import { spawn } from "child_process";

type RunOptions = {
  onProgress?: (data: Record<string, string>) => void;
};

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

    ffmpeg.stdout.on("data", (chunk) => {
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

    ffmpeg.stderr.on("data", () => { });

    ffmpeg.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`FFmpeg exited with code ${code}`));
    });

    ffmpeg.on("error", reject);
  });
}