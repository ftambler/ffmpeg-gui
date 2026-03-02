import { useState } from "react";
import type { MediaDraft } from "../types/MediaDraft";

export function useTrimState() {
  const [target, setTarget] = useState<MediaDraft | null>(null);
  const [draft, setDraft] = useState<{ start: number; end: number } | null>(null);

  function open(clip: MediaDraft) {
    setTarget(clip);
    setDraft({
      start: clip.startTime,
      end: clip.endTime,
    });
  }

  function close() {
    setTarget(null);
    setDraft(null);
  }

  return { target, draft, setDraft, open, close };
}