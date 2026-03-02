import path from "path";
import { config } from "../config.js";
import fs from "fs/promises";
import { randomUUID, UUID } from "crypto";
import { concatVideos, trimVideo } from "./ffmpegService.js";
import { Media } from "../types/Media.js";
import { safeJoin } from "../utils/PathUtils.js";
import { BadRequestError } from "../controllers/errors.js";

type TrimParams = {
  inputFile: string;
  outputFile: string;
  start: number;
  end: number;
};

export async function renderTrim(options: TrimParams) {
  const inputPath = path.join(config.inputFolder, options.inputFile);
  const outputPath = path.join(config.outputFolder, options.outputFile);

  await trimVideo({
    inputPath,
    outputPath,
    start: Number(options.start),
    end: Number(options.end),
    reencode: true
  });

  return options.outputFile;
}

export async function renderTimeline(jobId: UUID, media: Media[], outputFile: string, onProgress?: (percent: number, message?: string) => void): Promise<string> {
  if (!media.length) {
    throw new BadRequestError("Media array is empty");
  }

  const sortedMedia = [...media].sort((a, b) => a.timelineStartTime - b.timelineStartTime);

  const totalDuration = sortedMedia.reduce((sum, clip) => sum + (clip.endTime - clip.startTime), 0);

  let processedDuration = 0;

  const jobDir = path.join(config.tempFolder, `job-${jobId}`);
  await fs.mkdir(jobDir, { recursive: true });

  try {
    const trimmedFiles: string[] = [];

    for (let i = 0; i < sortedMedia.length; i++) {
      const clip = sortedMedia[i];

      if (clip.endTime <= clip.startTime) {
        throw new Error(`Invalid time range for clip ${i}`);
      }

      const inputPath = safeJoin(config.inputFolder, clip.inputFile);
      const tempOutput = path.join(jobDir, `trim_${i}.mp4`);

      await trimVideo({
        inputPath,
        outputPath: tempOutput,
        start: clip.startTime,
        end: clip.endTime,
        reencode: true,
        onProgress: (p) => {
          if (!p.out_time_ms) return;

          const seconds = Number(p.out_time_ms) / 1_000_000;
          const overall =
            (processedDuration + seconds) / totalDuration;

          onProgress?.(Math.min(overall * 100, 100), `Trimming ${i + 1}/${sortedMedia.length}`);
        }
      });

      trimmedFiles.push(tempOutput);
      processedDuration += clip.endTime - clip.startTime;
    }

    const concatPath = path.join(jobDir, "concat.txt");

    const concatContent = trimmedFiles
      .map(file => `file '${file.replace(/'/g, "'\\''")}'`)
      .join("\n");

    await fs.writeFile(concatPath, concatContent);

    const finalOutput = safeJoin(config.outputFolder, outputFile);

    onProgress?.(99, "Concatenating");
    await concatVideos(concatPath, finalOutput);
    onProgress?.(100, "Completed");

    return outputFile;

  } finally {
    await fs.rm(jobDir, { recursive: true, force: true });
  }
}