import { useState } from "react";

import { toast } from "react-toastify";
import { useTimeline } from "../hooks/useTimeline";
import type { VideoOutputFormat } from "../types/VideoOutputFormat";
import type { MediaDraft } from "../types/MediaDraft";
import { requestTimelineRender } from "../services/renderService";
import { TimelineSection } from "../components/EditVideo/TimelineSection";
import OutputSettings from "../components/TrimVideo/OutputSettings";
import TrimActionPanel from "../components/TrimVideo/TrimActionPanel";
import { TimelineContextMenu } from "../components/EditVideo/TimelineContextMenu";
import { TrimModal } from "../components/EditVideo/TrimModel";
import { SourceMediaSection } from "../components/EditVideo/SourceMediaSection";

export default function TimelineEditorV3() {
    const timeline = useTimeline();

    const [outputName, setOutputName] = useState("");
    const [outputFormat, setOutputFormat] =
        useState<VideoOutputFormat>("mp4");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [contextMenu, setContextMenu] =
        useState<{ x: number; y: number; id: string } | null>(null);

    const [trimTarget, setTrimTarget] =
        useState<MediaDraft | null>(null);
    const [trimDraft, setTrimDraft] =
        useState<{ start: number; end: number } | null>(null);

    async function handleSubmit() {
        if (!timeline.clips.length) return;

        const payload = timeline.clips.map((c) => ({
            inputFile: c.file.name,
            startTime: c.startTime,
            endTime: c.endTime,
            timelineStartTime: c.timelineStartTime,
        }));

        try {
            setIsSubmitting(true);
            await requestTimelineRender(
                payload,
                `${outputName}.${outputFormat}`
            );
            toast.dark("Timeline rendered successfully.");
        } catch (err: any) {
            setError(err?.message || "Render failed.");
        } finally {
            setIsSubmitting(false);
        }
    }

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

    async function handleFiles(files: File[]) {
        const newClips = await Promise.all(
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

        timeline.add(newClips);
    }
return (
  <div className="min-h-screen bg-slate-950 text-slate-200 px-6 py-8">
    <div className="max-w-6xl mx-auto flex flex-col gap-8">

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex flex-col gap-8"
      >
        <SourceMediaSection
          disabled={isSubmitting}
          onFiles={handleFiles}
        />

        <TimelineSection
          clips={timeline.clips}
          selectedId={timeline.selectedId}
          onSelect={timeline.setSelectedId}
          onContext={(e, id) =>
            setContextMenu({
              x: e.clientX,
              y: e.clientY,
              id,
            })
          }
          onReorder={timeline.reorder}
        />

        <OutputSettings
          outputName={outputName}
          outputFormat={outputFormat}
          disabled={isSubmitting}
          onChange={(field, value) => {
            if (field === "outputName")
              setOutputName(value);
            if (field === "outputFormat")
              setOutputFormat(value as VideoOutputFormat);
          }}
        />

        <TrimActionPanel
          error={error}
          disabled={isSubmitting}
          submitLabel={
            isSubmitting ? "Rendering..." : "Render Timeline"
          }
        />
      </form>
    </div>

    {/* Context + Modals OUTSIDE form */}
    {contextMenu && (
      <TimelineContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        onDelete={() => {
          timeline.remove(contextMenu.id);
          setContextMenu(null);
        }}
        onTrim={() => {
          const clip =
            timeline.clips.find(
              (c) => c.id === contextMenu.id
            ) ?? null;

          if (clip) {
            setTrimTarget(clip);
            setTrimDraft({
              start: clip.startTime,
              end: clip.endTime,
            });
          }

          setContextMenu(null);
        }}
      />
    )}

    {trimTarget && trimDraft && (
      <TrimModal
        clip={trimTarget}
        draft={trimDraft}
        onChange={(start, end) =>
          setTrimDraft({ start, end })
        }
        onCancel={() => {
          setTrimTarget(null);
          setTrimDraft(null);
        }}
        onApply={() => {
          timeline.update(
            trimTarget.id,
            trimDraft.start,
            trimDraft.end
          );
          setTrimTarget(null);
          setTrimDraft(null);
        }}
      />
    )}
  </div>
);
}