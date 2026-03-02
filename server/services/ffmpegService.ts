import { runFFmpeg } from "../infrastructure/ffmpegInfra.js";

type TrimOptions = {
  inputPath: string;
  outputPath: string;
  start: number;
  end: number;
  reencode?: boolean;
  onProgress?: (data: Record<string, string>) => void;
};

export async function trimVideo({ inputPath, outputPath, start, end, reencode = true, onProgress }: TrimOptions): Promise<void> {
  const args = reencode
    ? [
      "-i", inputPath,
      "-ss", start.toString(),
      "-t", (end - start).toString(),
      "-c:v", "libx264",
      "-c:a", "aac",
      "-preset", "veryfast",
      "-crf", "18",
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

  return runFFmpeg(args, {onProgress});
}

export async function concatVideos(
  concatFilePath: string,
  outputPath: string
) {
  return runFFmpeg([
    "-f", "concat",
    "-safe", "0",
    "-i", concatFilePath,
    "-c", "copy",
    "-y",
    outputPath
  ]);
}