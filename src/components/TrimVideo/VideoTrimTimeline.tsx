import { useEffect, useRef, useState } from "react";

interface Props {
    file: File | null;
    onChange: (start: number, end: number) => void;
    disabled?: boolean; // new prop to block inputs
}

export default function VideoTrimTimeline({ file, onChange, disabled = false }: Props) {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(0);

    useEffect(() => {
        if (!file) return;

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

    return (
        <div className="space-y-4">
            {videoUrl && (
                <>
                    {/* Video Preview */}
                    <video
                        ref={videoRef}
                        src={videoUrl}
                        controls={!disabled} // disable controls while processing
                        className="w-full rounded-lg"
                        onLoadedMetadata={(e) => {
                            const d = e.currentTarget.duration;
                            setDuration(d);
                            setEnd(d);
                        }}
                        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                    />

                    {/* Timeline */}
                    <div className="relative w-full h-6 bg-gray-200 rounded-md">
                        <div
                            className="absolute h-6 bg-blue-400/40 rounded-md"
                            style={{
                                left: `${(start / duration) * 100}%`,
                                width: `${((end - start) / duration) * 100}%`,
                            }}
                        />
                        <div
                            className="absolute top-0 bottom-0 w-0.5 bg-red-500"
                            style={{ left: `${(currentTime / duration) * 100}%` }}
                        />
                    </div>

                    {/* Sliders */}
                    <div className="flex flex-col gap-3">
                        <div>
                            <label className="text-sm font-medium">
                                Start: {formatTime(start)}
                            </label>
                            <input
                                type="range"
                                min={0}
                                max={duration}
                                step={0.01}
                                value={start}
                                disabled={disabled} // disable while processing
                                onChange={(e) =>
                                    setStart(Math.min(Number(e.target.value), end - 0.1))
                                }
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">
                                End: {formatTime(end)}
                            </label>
                            <input
                                type="range"
                                min={0}
                                max={duration}
                                step={0.01}
                                value={end}
                                disabled={disabled} // disable while processing
                                onChange={(e) =>
                                    setEnd(Math.max(Number(e.target.value), start + 0.1))
                                }
                                className="w-full"
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
