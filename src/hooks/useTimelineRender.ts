import { useState } from "react";
import { RenderService } from "../services/renderService";
import { useRenderProgress } from "./useRenderProgress";
import type { MediaDraft } from "../types/MediaDraft";

export function useTimelineRender() {
  const [error, setError] = useState<string | undefined>();
  const { progress, status, start } = useRenderProgress();

  const isSubmitting = status === "processing";

  async function submit(
    clips: MediaDraft[],
    outputName: string,
    outputFormat: string
  ) {
    setError(undefined);

    if (!clips.length) {
      setError("Select at least one video file.");
      return;
    }

    if (!outputName) {
      setError("Set an output name.");
      return;
    }

    const payload = clips.map((c) => ({
      inputFile: c.file.name,
      startTime: c.startTime,
      endTime: c.endTime,
      timelineStartTime: c.timelineStartTime,
    }));

    try {
      const { jobId } =
        await RenderService.requestTimelineRender(
          payload,
          `${outputName}.${outputFormat}`
        );

      start(jobId); // this controls lifecycle
    } catch (err: any) {
      setError(err?.message || "Render failed.");
    }
  }

  return {
    submit,
    progress,
    status,
    error,
    isSubmitting,
  };
}