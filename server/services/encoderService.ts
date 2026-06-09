import { spawnSync } from "node:child_process";
import { getEncoders } from "../infrastructure/ffmpegInfra.js";

let cachedBestEncoder: string | null = null;

const priority = [
  "h264_nvenc",
  "h264_qsv",
  "h264_videotoolbox",
  "h264_amf",
  "libx264",
];

function canUseEncoder(encoder: string): boolean {
  if (encoder === "libx264") {
    return true;
  }

  const result = spawnSync(
    "ffmpeg",
    [
      "-hide_banner",
      "-loglevel",
      "error",
      "-f",
      "lavfi",
      "-i",
      "color=size=128x128:rate=1",
      "-frames:v",
      "1",
      "-c:v",
      encoder,
      "-f",
      "null",
      "-"
    ],
    { encoding: "utf8" }
  );

  return result.status === 0;
}

function detectBestEncoder(): string {
  const encoders = new Set(getEncoders());

  for (const encoder of priority) {
    if (!encoders.has(encoder)) {
      continue;
    }

    if (canUseEncoder(encoder)) {
      return encoder;
    }

    console.warn(`Encoder ${encoder} detected but unusable`);
  }

  return "libx264";
}

export function getBestEncoder(): string {
  if (!cachedBestEncoder) {
    cachedBestEncoder = detectBestEncoder();

    console.log(
      `Selected ${cachedBestEncoder === "libx264" ? "CPU" : "hardware"
      } encoder: ${cachedBestEncoder}`
    );
  }

  return cachedBestEncoder;
}

export function invalidateEncoder(): void {
  cachedBestEncoder = "libx264";
}

const configs: Record<string, string[]> = {
  h264_nvenc: [
    "-c:v", "h264_nvenc",
    "-preset", "p7",
    "-rc", "vbr",
    "-cq", "18",
    "-b:v", "0"
  ],

  h264_qsv: [
    "-c:v", "h264_qsv",
    "-global_quality", "18"
  ],

  h264_videotoolbox: [
    "-c:v", "h264_videotoolbox",
    "-q:v", "85"
  ],

  h264_amf: [
    "-c:v", "h264_amf",
    "-rc", "vbr_peak",
    "-cq", "18"
  ],

  libx264: [
    "-c:v", "libx264",
    "-preset", "slow",
    "-crf", "18"
  ]
};
export function buildVideoEncoderArgs(encoder = getBestEncoder()): string[] {
  return configs[encoder] ?? configs.libx264;
}