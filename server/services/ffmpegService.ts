import { runFFmpeg } from "../infrastructure/ffmpegInfra.js";
import { buildVideoEncoderArgs, invalidateEncoder } from "./encoderService.js";

type TrimOptions = {
  inputPath: string;
  outputPath: string;
  start: number;
  end: number;
  reencode?: boolean;
  onProgress?: (data: Record<string, string>) => void;
};

async function executeTrim(options: TrimOptions, encoderArgs: string[]): Promise<void> {
  const { inputPath, outputPath, start, end, reencode = true, onProgress } = options;

  const args = reencode
    ? [
      "-ss", start.toString(),
      "-i", inputPath,
      "-t", (end - start).toString(),
      ...encoderArgs,
      "-c:a", "aac",
      "-b:a", "192k",
      "-movflags", "+faststart",
      "-y",
      outputPath
    ]
    : [
      "-ss", start.toString(),
      "-t", (end - start).toString(),
      "-i", inputPath,
      "-c", "copy",
      "-y",
      outputPath
    ];

  return runFFmpeg(args, { onProgress });
}

export async function trimVideo(options: TrimOptions): Promise<void> {
  if (!options.reencode) {
    return executeTrim(options, []);
  }

  try {
    await executeTrim(
      options,
      buildVideoEncoderArgs()
    );
  } catch (error) {
    console.warn(
      "Hardware encoder failed. Falling back to libx264.",
      error
    );

    invalidateEncoder();

    await executeTrim(
      options,
      buildVideoEncoderArgs("libx264")
    );
  }
}

export async function concatVideos(concatFilePath: string, outputPath: string) {
  return runFFmpeg([
    "-f", "concat",
    "-safe", "0",
    "-i", concatFilePath,
    "-c", "copy",
    "-y",
    outputPath
  ]);
}