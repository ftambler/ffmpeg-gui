import { spawn, spawnSync } from "child_process";

type RunOptions = {
  onProgress?: (data: Record<string, string>) => void;
};

export function getEncoders(): string[] {
  const result = spawnSync("ffmpeg", ["-hide_banner", "-encoders"], {
    encoding: "utf8"
  });

  const output = result.stdout ?? "";

  return output
    .split("\n")
    .filter((line: string) => line.startsWith(" V"))
    .map((line: string) => line.trim().split(/\s+/)[1]);
}

export function runFFmpeg(
  args: string[],
  options?: RunOptions
): Promise<void> {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      ...args,
      "-progress", "pipe:1",
      "-nostats"
    ]);

    let buffer = "";

    let currentBlock: Record<string, string> = {};

    ffmpeg.stdout.on("data", (chunk: { toString: () => string; }) => {
      buffer += chunk.toString();
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const [key, value] = line.split("=");
        if (!key || !value) continue;

        const k = key.trim();
        const v = value.trim();

        currentBlock[k] = v;

        if (k === "progress") {
          options?.onProgress?.(currentBlock);
          currentBlock = {};
        }
      }
    });

    // DEBUG LOGS
    // ffmpeg.stderr.on("data", (chunk) => {
    //   console.error(chunk.toString());
    // });

    ffmpeg.on("close", (code: number) => {
      if (code === 0) resolve();
      else reject(new Error(`FFmpeg exited with code ${code}`));
    });

    ffmpeg.on("error", reject);
  });
}