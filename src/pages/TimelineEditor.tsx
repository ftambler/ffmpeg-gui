import { useState } from "react";

import { useTimeline } from "../hooks/useTimeline";
import type { VideoOutputFormat } from "../types/VideoOutputFormat";
import { TimelineSection } from "../components/EditVideo/TimelineSection";
import OutputSettings from "../components/EditVideo/OutputSettings";
import TrimActionPanel from "../components/EditVideo/TrimActionPanel";
import { TimelineContextMenu } from "../components/EditVideo/TimelineContextMenu";
import { TrimPopup } from "../components/EditVideo/TrimPopup";
import { SourceMediaSection } from "../components/EditVideo/SourceMediaSection";
import { useFileImport } from "../hooks/useFileImport";
import { useTimelineRender } from "../hooks/useTimelineRender";
import { useTrimState } from "../hooks/useTrimState";

export default function TimelineEditor() {
  const { createClips } = useFileImport();
  const timeline = useTimeline();
  const render = useTimelineRender();
  const { target, draft, setDraft, open, close } = useTrimState();

  const [outputName, setOutputName] = useState("");
  const [outputFormat, setOutputFormat] = useState<VideoOutputFormat>("mp4");
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; id: string } | null>(null);

  async function handleFiles(files: File[]) {
    const newClips = await createClips(files);
    timeline.add(newClips);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 px-6 py-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            render.submit(
              timeline.clips,
              outputName,
              outputFormat
            );
          }}
          className="flex flex-col gap-8"
        >
          <SourceMediaSection
            disabled={render.isSubmitting}
            onFiles={handleFiles}
          />

          <TimelineSection
            clips={timeline.clips}
            selectedId={timeline.selectedId}
            onSelect={timeline.setSelectedId}
            onContext={(e, id) =>
              setContextMenu({ x: e.clientX, y: e.clientY, id })
            }
            onReorder={timeline.reorder}
          />

          <OutputSettings
            outputName={outputName}
            outputFormat={outputFormat}
            disabled={render.isSubmitting}
            onChange={(field, value) => {
              if (field === "outputName") setOutputName(value);
              if (field === "outputFormat")
                setOutputFormat(value as VideoOutputFormat);
            }}
          />

          <TrimActionPanel
            status={render.status}
            progress={render.progress}
            error={render.error}
            disabled={render.isSubmitting}
            submitLabel="Render Timeline"
          />
        </form>
      </div>

      {/* Right Click on Timeline Menu */}
      {contextMenu && (
        <TimelineContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onDelete={() => {
            timeline.remove(contextMenu.id);
            setContextMenu(null);
          }}
          onTrim={() => {
            const clip = timeline.clips.find(
              (c) => c.id === contextMenu.id
            ) ?? null;

            if (clip) {
              open(clip);
            }

            setContextMenu(null);
          }}
          onClose={() => setContextMenu(null)}
        />
      )}

      {/* Trim Popup */}
      {target && draft && (
        <TrimPopup
          clip={target}
          draft={draft}
          onChange={(start, end) =>
            setDraft({ start, end })
          }
          onCancel={close}
          onApply={() => {
            timeline.update(
              target.id,
              draft.start,
              draft.end
            );
            close();
          }}
        />
      )}
    </div>
  );
}