import {
    useEffect,
    useRef,
    useState,
    type MouseEvent as ReactMouseEvent,
} from "react";
import {
    DndContext,
    closestCenter,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    horizontalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";

import VideoTrimTimeline from "../components/TrimVideo/VideoTrimTimeline";
import OutputSettings from "../components/TrimVideo/OutputSettings";
import TrimActionPanel from "../components/TrimVideo/TrimActionPanel";
import { requestTimelineRender } from "../services/renderService";
import { toast } from "react-toastify";
import type { MediaDraft, MediaPayload } from "../types/MediaDraft";
import type { VideoOutputFormat } from "../types/VideoOutputFormat";
import { SortableClip } from "../components/EditVideo/SortableClip";

export default function TimelineEditorV2() {
    const [clips, setClips] = useState<MediaDraft[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [outputName, setOutputName] = useState("");
    const [outputFormat, setOutputFormat] =
        useState<VideoOutputFormat>("mp4");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [contextMenu, setContextMenu] =
        useState<{ x: number; y: number; id: string } | null>(null);
    const contextMenuRef = useRef<HTMLDivElement | null>(null);

    const [trimTarget, setTrimTarget] =
        useState<MediaDraft | null>(null);
    const [trimDraft, setTrimDraft] = useState<
        { start: number; end: number } | null
    >(null);

    useEffect(() => {
        if (!contextMenu) return;

        const onPointerDown = (event: PointerEvent) => {
            const target = event.target as Node | null;
            if (!target) return;

            if (contextMenuRef.current?.contains(target)) {
                return;
            }

            setContextMenu(null);
        };

        const onEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setContextMenu(null);
            }
        };

        window.addEventListener("pointerdown", onPointerDown);
        window.addEventListener("keydown", onEscape);

        return () => {
            window.removeEventListener("pointerdown", onPointerDown);
            window.removeEventListener("keydown", onEscape);
        };
    }, [contextMenu]);

    function rebuildTimeline(list: MediaDraft[]) {
        let cursor = 0;
        return list.map((clip) => {
            const duration = Math.max(0, clip.endTime - clip.startTime);
            const updated = { ...clip, timelineStartTime: cursor };
            cursor += duration;
            return updated;
        });
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

    async function addClips(files: File[]) {
        const newClips: MediaDraft[] = await Promise.all(
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

        if (!newClips.length) return;

        setSelectedId((prev) => prev ?? newClips[0].id);
        setClips((prev) => rebuildTimeline([...prev, ...newClips]));
    }

    function updateClip(id: string, start: number, end: number) {
        setClips((prev) => {
            let changed = false;

            const updated = prev.map((clip) => {
                if (clip.id !== id) return clip;
                if (clip.startTime === start && clip.endTime === end) {
                    return clip;
                }

                changed = true;
                return { ...clip, startTime: start, endTime: end };
            });

            return changed ? rebuildTimeline(updated) : prev;
        });
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = clips.findIndex((c) => c.id === active.id);
        const newIndex = clips.findIndex((c) => c.id === over.id);

        if (oldIndex < 0 || newIndex < 0) return;

        const reordered = arrayMove(clips, oldIndex, newIndex);
        setClips(rebuildTimeline(reordered));
    }

    function deleteClip(id: string) {
        setClips((prev) =>
            rebuildTimeline(prev.filter((c) => c.id !== id))
        );
        setSelectedId((prev) => (prev === id ? null : prev));
        setContextMenu(null);
    }

    function applyTrimFromPopup() {
        if (!trimTarget || !trimDraft) return;
        if (trimDraft.end <= trimDraft.start) return;

        updateClip(trimTarget.id, trimDraft.start, trimDraft.end);
        setSelectedId(trimTarget.id);
        setTrimTarget(null);
        setTrimDraft(null);
    }

    async function handleSubmit() {
        setError(null);

        if (!clips.length) {
            setError("Add at least one clip.");
            return;
        }

        if (!outputName.trim()) {
            setError("Output name is required.");
            return;
        }

        const invalid = clips.find(
            (c) => c.endTime <= c.startTime
        );

        if (invalid) {
            setError("All clips must have valid trim ranges.");
            return;
        }

        const payload: MediaPayload[] = clips.map((c) => ({
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

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 px-6 py-8">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
                className="max-w-6xl mx-auto flex flex-col gap-8"
            >
                {/* SOURCE MEDIA */}
                <section className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <h2 className="font-semibold mb-4 tracking-widest">
                        SOURCE MEDIA
                    </h2>
                    <input
                        type="file"
                        multiple
                        accept="video/*"
                        disabled={isSubmitting}
                        onChange={(e) => {
                            void addClips(Array.from(e.target.files ?? []));
                            e.currentTarget.value = "";
                        }}
                    />
                </section>

                {/* TIMELINE */}
                <section className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <h2 className="font-semibold mb-4 tracking-widest">
                        TIMELINE
                    </h2>

                    <DndContext
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={clips.map((c) => c.id)}
                            strategy={horizontalListSortingStrategy}
                        >
                            <div className="flex gap-4 overflow-x-auto">
                                {clips.map((clip) => (
                                    <SortableClip
                                        key={clip.id}
                                        clip={clip}
                                        isSelected={clip.id === selectedId}
                                        onSelect={() => setSelectedId(clip.id)}
                                        onContext={(e: ReactMouseEvent) => {
                                            e.preventDefault();
                                            setContextMenu({
                                                x: e.clientX,
                                                y: e.clientY,
                                                id: clip.id,
                                            });
                                        }}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>

                    {contextMenu && (
                        <div
                            ref={contextMenuRef}
                            className="fixed bg-slate-800 border border-slate-700 rounded shadow-lg p-2 z-50"
                            style={{
                                top: contextMenu.y,
                                left: contextMenu.x,
                            }}
                        >
                            <button
                                className="block w-full text-left px-3 py-1 hover:bg-slate-700"
                                onClick={() => deleteClip(contextMenu.id)}
                            >
                                Delete
                            </button>
                            <button
                                className="block w-full text-left px-3 py-1 hover:bg-slate-700"
                                onClick={() => {
                                    const clip = clips.find(
                                        (c) => c.id === contextMenu.id
                                    );
                                    if (clip) {
                                        setTrimTarget(clip);
                                        setTrimDraft({
                                            start: clip.startTime,
                                            end: clip.endTime,
                                        });
                                    }
                                    setContextMenu(null);
                                }}
                            >
                                Trim
                            </button>
                        </div>
                    )}
                </section>

                <OutputSettings
                    outputName={outputName}
                    outputFormat={outputFormat}
                    disabled={isSubmitting}
                    onChange={(field, value) => {
                        if (field === "outputName") setOutputName(value);
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

            {/* TRIM MODAL */}
            {trimTarget && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-slate-900 p-6 rounded-xl w-[900px] max-w-full">
                        <h2 className="text-lg font-semibold mb-4">
                            Trim: {trimTarget.file.name}
                        </h2>

                        <VideoTrimTimeline
                            file={trimTarget.file}
                            disabled={false}
                            onChange={(start, end) => {
                                setTrimDraft({ start, end });
                            }}
                        />

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                className="px-4 py-2 bg-slate-700 rounded"
                                onClick={() => {
                                    setTrimTarget(null);
                                    setTrimDraft(null);
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                className="px-4 py-2 bg-blue-600 rounded"
                                onClick={() => {
                                    applyTrimFromPopup();
                                }}
                            >
                                Apply Trim
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
