import { useState } from "react";
import type { MediaDraft } from "../types/MediaDraft";
import { arrayMove } from "@dnd-kit/sortable";

export function useTimeline() {
  const [clips, setClips] = useState<MediaDraft[]>([]);
  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  function rebuild(list: MediaDraft[]) {
    let cursor = 0;
    return list.map((clip) => {
      const duration = Math.max(
        0,
        clip.endTime - clip.startTime
      );

      const updated = {
        ...clip,
        timelineStartTime: cursor,
      };

      cursor += duration;
      return updated;
    });
  }

  function add(newClips: MediaDraft[]) {
    if (!newClips.length) return;
    setSelectedId((prev) => prev ?? newClips[0].id);
    setClips((prev) => rebuild([...prev, ...newClips]));
  }

  function update(id: string, start: number, end: number) {
    setClips((prev) =>
      rebuild(
        prev.map((clip) =>
          clip.id === id
            ? { ...clip, startTime: start, endTime: end }
            : clip
        )
      )
    );
  }

  function remove(id: string) {
    setClips((prev) =>
      rebuild(prev.filter((c) => c.id !== id))
    );
    setSelectedId((prev) =>
      prev === id ? null : prev
    );
  }

  function reorder(activeId: string, overId: string) {
    setClips((prev) => {
      const oldIndex = prev.findIndex(
        (c) => c.id === activeId
      );
      const newIndex = prev.findIndex(
        (c) => c.id === overId
      );

      if (oldIndex < 0 || newIndex < 0) return prev;

      return rebuild(
        arrayMove(prev, oldIndex, newIndex)
      );
    });
  }

  return {
    clips,
    selectedId,
    setSelectedId,
    add,
    update,
    remove,
    reorder,
  };
}