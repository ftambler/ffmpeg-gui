import { spawn } from "child_process";
import path from "path";
import { config } from "../config.js";

type TrimOptions = {
  inputFile: string;
  start: string;
  end: string;
  outputFile: string;
};

export function renderVideo(options: TrimOptions): Promise<string> {
  const inputPath = path.join(config.inputFolder, options.inputFile);
  const outputPath = path.join(config.outputFolder, options.outputFile);

  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-ss", options.start,
      "-to", options.end,
      "-i", inputPath,
      "-c:v", "libx264",
      "-c:a", "aac",
      "-preset", "medium",
      "-crf", "18",
      "-y",
      outputPath
    ]);

    // useful for debugging
    // ffmpeg.stderr.on("data", (data) => {
    //   console.error(data.toString()); 
    // });

    ffmpeg.on("close", (code) => {
      if (code === 0) resolve(options.outputFile);
      else reject(new Error(`FFmpeg exited with code ${code}`));
    });
  });
}