import type { MediaDraft } from "../types/MediaDraft";

export function useFileImport() {
  async function getVideoDuration(file: File): Promise<number> {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const video = document.createElement("video");

      video.preload = "metadata";

      const cleanup = () => {
        URL.revokeObjectURL(url);
        video.removeAttribute("src");
        video.load();
      };

      video.onloadedmetadata = () => {
        const duration = Number.isFinite(video.duration)
          ? Math.max(0, video.duration)
          : 0;

        cleanup();
        resolve(duration);
      };

      video.onerror = () => {
        cleanup();
        resolve(0);
      };

      video.src = url;
    });
  }

  async function createClips(files: File[]): Promise<MediaDraft[]> {
    return Promise.all(
      files.map(async (file) => {
        const duration = await getVideoDuration(file);

        return {
          id: crypto.randomUUID(),
          file,
          startTime: 0,
          endTime: duration,
          timelineStartTime: 0,
        };
      })
    );
  }

  return { createClips };
}