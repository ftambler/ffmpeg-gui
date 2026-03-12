import { getEncoders } from "../infrastructure/ffmpegInfra.js";

let cachedBestEncoder: string | null = null;

const priority = [
  "h264_nvenc",
  "h264_qsv",
  "h264_videotoolbox",
  "h264_amf",
  "libx264"
];

function detectBestEncoder(): string {
  const encoders = new Set(getEncoders());

  for (const enc of priority) {
    if (encoders.has(enc)) return enc;
  }

  return "libx264";
}

export function getBestEncoder(): string {
  if (!cachedBestEncoder) {
    cachedBestEncoder = detectBestEncoder();
    console.log("Selected encoder:", cachedBestEncoder);
  }

  return cachedBestEncoder;
}

export function buildVideoEncoderArgs(): string[] {
  const encoder = getBestEncoder();

  const configs: Record<string, string[]> = {
    h264_nvenc: ["-c:v", "h264_nvenc", "-preset", "p4", "-cq", "23"],
    h264_qsv: ["-c:v", "h264_qsv", "-preset", "fast", "-global_quality", "23"],
    h264_videotoolbox: ["-c:v", "h264_videotoolbox", "-q:v", "65"],
    h264_amf: ["-c:v", "h264_amf", "-quality", "speed"],
    libx264: ["-c:v", "libx264", "-preset", "ultrafast", "-crf", "23"]
  };

  return configs[encoder] ?? configs["libx264"];
}