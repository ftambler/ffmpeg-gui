import { runFFmpeg } from "../infrastructure/ffmpegInfra.js";
import { hasNvenc } from "../utils/nvencChecker.js";


type TrimOptions = {
  inputPath: string;
  outputPath: string;
  start: number;
  end: number;
  reencode?: boolean;
  onProgress?: (data: Record<string, string>) => void;
};

const useNvenc = hasNvenc();

function buildVideoEncoderArgs() {
  if (useNvenc) {
    console.log("Using nvenc")
    return [
      "-c:v", "h264_nvenc",
      "-preset", "p4",
      "-cq", "23"
    ];
  }

  return [
    "-c:v", "libx264",
    "-preset", "ultrafast",
    "-crf", "23"
  ];
}

export async function trimVideo({ inputPath, outputPath, start, end, reencode = true, onProgress }: TrimOptions): Promise<void> {
  const args = reencode
    ? [
      "-ss", start.toString(),
      "-i", inputPath,
      "-t", (end - start).toString(),
      ...buildVideoEncoderArgs(),
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