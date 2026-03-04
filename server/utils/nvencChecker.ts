import { spawnSync } from "child_process";

export function hasNvenc(): boolean {
  const result = spawnSync("ffmpeg", ["-hide_banner", "-encoders"], {
    encoding: "utf-8"
  });

  if (result.status !== 0) return false;

  return result.stdout.includes("h264_nvenc");
}