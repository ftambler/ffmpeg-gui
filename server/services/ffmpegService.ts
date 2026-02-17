import { spawn } from "child_process";

export function renderVideo(options: any): Promise<string> {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-i",
      options.input,
      "-ss",
      options.start,
      "-to",
      options.end,
      options.output
    ]);

    ffmpeg.on("close", (code) => {
      if (code === 0) resolve(options.output);
      else reject(new Error("FFmpeg exited with error"));
    });
  });
}
