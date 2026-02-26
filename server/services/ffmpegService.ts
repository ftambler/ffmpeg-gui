import { spawn } from "child_process";

export function runFFmpeg(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", args);

    // useful for debugging
    ffmpeg.stderr.on("data", (data) => {
      console.error(data.toString()); 
    });

    ffmpeg.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`FFmpeg exited with code ${code}`));
    });
  });
}