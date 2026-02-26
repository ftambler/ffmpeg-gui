import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { MouseEvent } from "react";
import type { MediaDraft } from "../../types/MediaDraft";
import { formatTime } from "../../utils/timeUtils";

type SortableClipProps = {
  clip: MediaDraft;
  isSelected: boolean;
  onSelect: () => void;
  onContext: (e: MouseEvent) => void;
};

export function SortableClip({ clip, isSelected, onSelect, onContext }: SortableClipProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: clip.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const clipDuration = Math.max(0, clip.endTime - clip.startTime);
  const timelineEndTime = clip.timelineStartTime + clipDuration;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onMouseDown={(e) => {
        if (e.button === 0) {
          onSelect();
        }
      }}
      onContextMenu={onContext}
      className={`min-w-52 p-4 rounded-lg cursor-grab active:cursor-grabbing border ${isSelected ? "bg-slate-700 border-blue-500" : "bg-slate-800 border-slate-700"}`} >
      <div className="text-sm truncate font-medium">
        {clip.file.name}
      </div>

      <div className="text-xs text-slate-400 mt-2">
        Timeline: {formatTime(clip.timelineStartTime)} – {formatTime(timelineEndTime)}
      </div>
      <div className="text-xs text-slate-500 mt-1">
        Trim: {formatTime(clip.startTime)} – {formatTime(clip.endTime)}
      </div>
      <div className="text-xs text-slate-500 mt-1">
        Length: {formatTime(clipDuration)}
      </div>
    </div>
  );
}