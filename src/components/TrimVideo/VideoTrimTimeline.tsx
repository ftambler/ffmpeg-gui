import { useEffect, useRef, useState } from "react";

interface Props {
    file: File | null;
    onChange: (start: number, end: number) => void;
    disabled?: boolean;
}

export default function VideoTrimTimeline({ file, onChange, disabled = false }: Props) {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(0);

    useEffect(() => {
        if (!file) {
            setVideoUrl(null);
            setDuration(0);
            setCurrentTime(0);
            setStart(0);
            setEnd(0);
            return;
        }

        const url = URL.createObjectURL(file);
        setVideoUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [file]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        onChange(start, end);
        video.currentTime = start;
    }, [start, end]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);

        return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
    };

    const timelineScale = duration > 0 ? duration : 1;

    return (
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 lg:p-5 shadow">
            <h2 className="font-semibold tracking-widest mb-3">
                VIDEO TRIM
            </h2>

            {!videoUrl && (
                <div className="min-h-40 rounded-lg border border-dashed border-slate-700 grid place-items-center text-sm text-slate-500">
                    Select a video to preview and trim timeline.
                </div>
            )}

            {videoUrl && (
                <div className="space-y-4">
                    <video
                        ref={videoRef}
                        src={videoUrl}
                        controls={true}
                        className="w-full max-h-[42vh] rounded-lg bg-black object-contain"
                        onLoadedMetadata={(e) => {
                            const d = e.currentTarget.duration;
                            setDuration(d);
                            setEnd(d);
                        }}
                        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                    />

                    <div className="relative w-full h-6 bg-slate-800 rounded-md">
                        <div
                            className="absolute h-6 bg-blue-400/40 rounded-md"
                            style={{
                                left: `${(start / timelineScale) * 100}%`,
                                width: `${((end - start) / timelineScale) * 100}%`,
                            }}
                        />
                        <div
                            className="absolute top-0 bottom-0 w-0.5 bg-red-500"
                            style={{ left: `${(currentTime / timelineScale) * 100}%` }}
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <div>
                            <label className="text-sm font-medium text-slate-300">
                                Start: {formatTime(start)}
                            </label>
                            <input
                                type="range"
                                min={0}
                                max={duration}
                                step={0.01}
                                value={start}
                                disabled={disabled}
                                onChange={(e) =>
                                    setStart(Math.min(Number(e.target.value), end - 0.1))
                                }
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-300">
                                End: {formatTime(end)}
                            </label>
                            <input
                                type="range"
                                min={0}
                                max={duration}
                                step={0.01}
                                value={end}
                                disabled={disabled}
                                onChange={(e) =>
                                    setEnd(Math.max(Number(e.target.value), start + 0.1))
                                }
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
