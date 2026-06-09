import { useEffect, useRef, useState } from "react";
import type { MediaDraft } from "../../types/MediaDraft";
import { formatTime } from "../../utils/timeUtils";

type TrimPopupProps = {
  clip: MediaDraft;
  draft: { start: number; end: number };
  onChange: (start: number, end: number) => void;
  onCancel: () => void;
  onApply: () => void;
};

const STEP = 0.5;

export function TrimPopup({ clip, draft, onChange, onCancel, onApply }: TrimPopupProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [start, setStart] = useState(draft.start ?? 0);
  const [end, setEnd] = useState(draft.end ?? 0);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!clip?.file) {
      setVideoUrl(null);
      setDuration(0);
      setCurrentTime(0);
      setStart(0);
      setEnd(0);
      return;
    }

    const url = URL.createObjectURL(clip.file);
    setVideoUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [clip]);

  useEffect(() => {
    onChange(start, end);
    if (videoRef.current) {
      videoRef.current.currentTime = start;
    }
    setError(undefined)
  }, [start, end]);

  const timelineScale = duration > 0 ? duration : 1;


  function setStartToCurrent(): void {
    if (!videoRef.current) return;

    if (videoRef.current.currentTime <= end)
      setStart(videoRef.current!.currentTime);
    else setError("Start Time must be before End Time")
  }

  function setEndToCurrent(): void {
    if (!videoRef.current) return;

    if (videoRef.current.currentTime >= start)
      setEnd(videoRef.current!.currentTime);
    else setError("End Time must be after Start Time")
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-slate-900 p-6 rounded-xl w-[900px] max-w-full">
        <h2 className="text-lg font-semibold mb-4">
          Trim: {clip.file.name}
        </h2>

        <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow">
          {!videoUrl && (
            <div className="min-h-40 rounded-lg border border-dashed border-slate-700 grid place-items-center text-sm text-slate-500">
              Select a video to preview and trim timeline.
            </div>
          )}

          {videoUrl && (
            <div className="space-y-4">
              <video ref={videoRef} src={videoUrl} controls className="w-full max-h-[42vh] rounded-lg bg-black object-contain"
                onLoadedMetadata={(e) => {
                  const d = e.currentTarget.duration;
                  setDuration(d);
                  if (!draft.end) {
                    setEnd(d);
                  }
                }}
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              />

              <div className="flex justify-end gap-3 mt-4">
                <button className="w-full bg-blue-800 hover:bg-blue-900 text-white font-semibold py-2 rounded-lg" onClick={setStartToCurrent} >
                  Current Time as START
                </button>

                <button className="w-full bg-blue-800 hover:bg-blue-900 text-white font-semibold py-2 rounded-lg" onClick={setEndToCurrent} >
                  Current Time as END
                </button>
              </div>

              <div className="relative w-full h-5 bg-slate-800 rounded-md">
                <div
                  className="absolute h-5 bg-blue-400/40 rounded-md"
                  style={{
                    left: `${(start / timelineScale) * 100}%`,
                    width: `${((end - start) / timelineScale) * 100}%`,
                  }}
                />
                <div className="absolute top-0 bottom-0 w-0.5 bg-red-500"
                  style={{
                    left: `${(currentTime / timelineScale) * 100}%`,
                  }}
                />
              </div>

              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-sm font-medium text-slate-300">
                    Start: {formatTime(start)}
                  </label>

                  <div className="flex gap-2 items-center">
                    <button
                      type="button"
                      onClick={() => setStart(Math.max(start - STEP, 0))}
                      className="px-3 py-1 bg-slate-700 rounded">
                      {`-${STEP}s`}
                    </button>

                    <input type="range" min={0} max={duration} step={0.01} value={start}
                      onChange={(e) => setStart(Math.min(Number(e.target.value), end - 0.1))}
                      className="w-full"
                    />

                    <button type="button" onClick={() => setStart(Math.min(start + STEP, end - 0.1))} className="px-3 py-1 bg-slate-700 rounded">
                      {`+${STEP}s`}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300">
                    End: {formatTime(end)}
                  </label>

                  <div className="flex gap-2 items-center">
                    <button type="button" onClick={() => setEnd(Math.max(end - STEP, start + 0.1))} className="px-3 py-1 bg-slate-700 rounded" >
                      {`-${STEP}s`}
                    </button>

                    <input type="range" min={0} max={duration} step={0.01} value={end}
                      onChange={(e) => setEnd(Math.max(Number(e.target.value), start + 0.1))}
                      className="w-full"
                    />

                    <button type="button" onClick={() => setEnd(Math.min(end + STEP, duration))} className="px-3 py-1 bg-slate-700 rounded">
                      {`+${STEP}s`}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm mb-2 mt-2">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button className="w-full bg-red-700 hover:bg-red-800 text-white font-semibold py-3 rounded-lg" onClick={onCancel} >
              Cancel
            </button>

            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg" onClick={onApply} >
              Apply Trim
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}