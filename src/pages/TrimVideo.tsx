import { useState } from "react";
import VideoTrimTimeline from "../components/TrimVideo/VideoTrimTimeline";
import { toast } from "react-toastify";
import OutputSettings from "../components/TrimVideo/OutputSettings";
import FilePicker from "../components/TrimVideo/FilePicker";
import TrimActionPanel from "../components/TrimVideo/TrimActionPanel";
import type { VideoOutputFormat } from "../types/VideoOutputFormat";
import { RenderService } from "../services/renderService";

interface TrimFormData {
    file: File | null;
    startTime: string;
    endTime: string;
    outputName: string;
    outputFormat: VideoOutputFormat;
    outputPath: string;
}

export default function TrimVideo() {
    const [form, setForm] = useState<TrimFormData>({
        file: null,
        startTime: "00:00:00",
        endTime: "",
        outputName: "",
        outputFormat: "mp4",
        outputPath: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = <K extends keyof TrimFormData>(
        key: K,
        value: TrimFormData[K]
    ) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (!form.file) {
            setError("Please select a video file.");
            return;
        }

        if (!form.startTime || !form.endTime) {
            setError("Start and end times are required.");
            return;
        }

        if (!form.outputName.trim()) {
            setError("Output name is required.");
            return;
        }

        if (form.endTime <= form.startTime) {
            setError("End time must be greater than start time.");
            return;
        }

        try {
            setIsSubmitting(true);
            
            const result = await RenderService.requestRender({
                inputFile: form.file.name,
                start: form.startTime,
                end: form.endTime,
                outputFile: form.outputName,
                format: form.outputFormat,
            });

            toast.dark("Video trimmed successfully!");
            toast.dark(`Saved: ${form.outputName}.${form.outputFormat}`);
            console.log("Render complete:", result);
        } catch (err: any) {
            setError(err?.message || "Render failed.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="h-full min-h-0 bg-slate-950 text-slate-200 p-4 md:p-6 overflow-y-auto rounded-xl">
            <form
                onSubmit={handleSubmit}
                className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6"
            >
                <div className="flex flex-col gap-4 lg:gap-6">
                    <FilePicker
                        file={form.file}
                        disabled={isSubmitting}
                        onFileSelected={(file) => handleChange("file", file)}
                    />

                    <VideoTrimTimeline
                        file={form.file}
                        onChange={(start, end) => {
                            handleChange("startTime", start.toString());
                            handleChange("endTime", end.toString());
                        }}
                        disabled={isSubmitting}
                    />
                </div>

                <div className="flex flex-col gap-4 lg:gap-6">
                    <OutputSettings
                        outputName={form.outputName}
                        outputFormat={form.outputFormat}
                        disabled={isSubmitting}
                        onChange={(field, value) =>
                            handleChange(field, value as TrimFormData[typeof field])
                        }
                    />

                    <TrimActionPanel
                        error={error}
                        disabled={isSubmitting}
                        submitLabel={isSubmitting ? "Processing..." : "Run Trim"}
                    />
                </div>
            </form>
        </div>
    );
}
