import VideoTrimTimeline from "../TrimVideo/VideoTrimTimeline";
import type { MediaDraft } from "../../types/MediaDraft";

type TrimPopupProps = {
  clip: MediaDraft;
  draft: { start: number; end: number };
  onChange: (start: number, end: number) => void;
  onCancel: () => void;
  onApply: () => void;
};

export function TrimPopup({ clip, onChange, onCancel, onApply }: TrimPopupProps) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-slate-900 p-6 rounded-xl w-[900px] max-w-full">
        <h2 className="text-lg font-semibold mb-4">
          Trim: {clip.file.name}
        </h2>

        <VideoTrimTimeline file={clip.file} disabled={false} onChange={onChange} />

        <div className="flex justify-end gap-3 mt-6">
          <button className="px-4 py-2 bg-slate-700 rounded" onClick={onCancel}>
            Cancel
          </button>

          <button className="px-4 py-2 bg-blue-600 rounded" onClick={onApply} >
            Apply Trim
          </button>
          
        </div>
      </div>
    </div>
  );
}