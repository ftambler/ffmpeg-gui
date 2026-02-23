import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import type { MediaDraft } from "../../types/MediaDraft";
import { SortableClip } from "./SortableClip";

type TimelineSectionProps = {
  clips: MediaDraft[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onContext: (e: React.MouseEvent, id: string) => void;
  onReorder: (activeId: string, overId: string) => void;
};

export function TimelineSection({ clips, selectedId, onSelect, onContext, onReorder }: TimelineSectionProps) {
  return (
    <section className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <h2 className="font-semibold mb-4 tracking-widest">
        TIMELINE
      </h2>

      <DndContext collisionDetection={closestCenter}
        onDragEnd={(e: DragEndEvent) => {
          if (!e.over) return;
          if (e.active.id === e.over.id) return;
          onReorder(
            String(e.active.id),
            String(e.over.id)
          );
        }}
      >
        <SortableContext items={clips.map((c) => c.id)} strategy={horizontalListSortingStrategy} >
          <div className="flex gap-4 overflow-x-auto">
            {clips.map((clip) => (
              <SortableClip key={clip.id} clip={clip} isSelected={clip.id === selectedId}
                onSelect={() => onSelect(clip.id)}
                onContext={(e) => {
                  e.preventDefault()
                  onContext(e, clip.id)
                }}
              />
            ))}
          </div>
        </SortableContext>
        
      </DndContext>
    </section>
  );
}