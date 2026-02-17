import { useEffect, useState } from "react";
import VideoTrimTimeline from "../components/TrimVideo/VideoTrimTimeline";
import { requestRender } from "../services/renderService";
import { toast } from "react-toastify";
import { readSettings } from "../services/settingsService";
import OutputSettings from "../components/TrimVideo/OutputSettings";
import FilePicker from "../components/TrimVideo/FilePicker";
import type { VideoOutputFormat } from "../types/VideoOutputFormat";


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

    const [baseInput, setBaseInput] = useState("");
    const [baseOutput, setBaseOutput] = useState("");

    useEffect(() => {
        const settings = readSettings();
        setBaseInput(settings.BASE_INPUT);
        setBaseOutput(settings.BASE_OUTPUT);
    }, []);

    const handleChange = <K extends keyof TrimFormData>(
        key: K,
        value: TrimFormData[K]
    ) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (!baseInput || !baseOutput) {
            toast.error("Configure INPUT and OUTPUT folder in Settings first");
            return;
        }

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

            const result = await requestRender({
                input: `${baseInput}/${form.file.name}`,
                start: form.startTime,
                end: form.endTime,
                output: `${baseOutput}/${form.outputName}`,
                format: form.outputFormat,
            });


            toast.success("Video trimmed successfully!");
            console.log("Render complete:", result);

        } catch (err: any) {
            setError(err?.message || "Render failed.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <form onSubmit={handleSubmit} className="w-full max-w-xl bg-white shadow-lg rounded-xl p-8 space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800">Trim Video</h2>

                <FilePicker file={form.file} disabled={isSubmitting} onFileSelected={(file) => handleChange("file", file)} />

                {form.file && (
                    <>
                        <VideoTrimTimeline
                            file={form.file}
                            onChange={(start, end) => {
                                handleChange("startTime", start.toString());
                                handleChange("endTime", end.toString());
                            }}
                            disabled={isSubmitting}
                        />

                        <OutputSettings
                            outputName={form.outputName}
                            outputFormat={form.outputFormat}
                            disabled={isSubmitting}
                            onChange={(field, value) => handleChange(field, value as any)}
                        />

                        {error && (<div className="text-red-600 text-sm font-medium">{error}</div>)}

                        <button type="submit" disabled={isSubmitting}
                            className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed" >
                            {isSubmitting ? "Processing..." : "Trim"}
                        </button>
                    </>
                )}
            </form>
        </div>
    );
}
