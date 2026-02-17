import { useState } from "react";
import VideoTrimTimeline from "../components/VideoTrimTimeline";
import { requestRender } from "../services/renderService";
import { timeToSeconds } from "../utils/timeUtils";

type OutputFormat = "mp4" | "mkv" | "mov" | "webm";

interface TrimFormData {
    file: File | null;
    startTime: string;
    endTime: string;
    outputName: string;
    outputFormat: OutputFormat;
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

        if (!form.startTime) {
            setError("Start time is required.");
            return;
        }

        if (!form.endTime) {
            setError("End time is required.");
            return;
        }

        if (!form.outputName.trim()) {
            setError("Output name is required.");
            return;
        }

        if (!form.outputPath.trim()) {
            setError("Output path is required.");
            return;
        }

        const startSeconds = timeToSeconds(form.startTime);
        const endSeconds = timeToSeconds(form.endTime);

        if (endSeconds <= startSeconds) {
            setError("End time must be greater than start time.");
            return;
        }

        const outputFile = `${form.outputPath.replace(/\/$/, "")}/${form.outputName}.${form.outputFormat}`;

        try {
            setIsSubmitting(true);

            await requestRender({
                input: form.file.name, // see architecture note above
                start: form.startTime,
                end: form.endTime,
                output: outputFile
            });

        } catch (err) {
            setError("Render failed.");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-xl bg-white shadow-lg rounded-xl p-8 space-y-6"
            >
                <h2 className="text-2xl font-semibold text-gray-800">
                    Trim Video
                </h2>

                {/* File */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                        Input File
                    </label>
                    <input
                        type="file"
                        accept="video/*"
                        className="block w-full text-sm text-gray-600
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-md file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100"
                        onChange={(e) =>
                            handleChange("file", e.target.files?.[0] ?? null)
                        }
                    />
                </div>

                <VideoTrimTimeline
                    file={form.file}
                    onChange={(start, end) => {
                        handleChange("startTime", start.toString());
                        handleChange("endTime", end.toString());
                    }}
                />

                {form.file && (
                    <>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">
                                Output Name
                            </label>
                            <input
                                type="text"
                                value={form.outputName}
                                onChange={(e) =>
                                    handleChange("outputName", e.target.value)
                                }
                                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Format + Path */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Output Format
                                </label>
                                <select
                                    value={form.outputFormat}
                                    onChange={(e) =>
                                        handleChange(
                                            "outputFormat",
                                            e.target.value as OutputFormat
                                        )
                                    }
                                    className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="mp4">mp4</option>
                                    <option value="mkv">mkv</option>
                                    <option value="mov">mov</option>
                                    <option value="webm">webm</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Output Path
                                </label>
                                <input
                                    type="text"
                                    placeholder="/outputs"
                                    value={form.outputPath}
                                    onChange={(e) =>
                                        handleChange("outputPath", e.target.value)
                                    }
                                    className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition"
                        >
                            Trim
                        </button>
                    </>
                )}
            </form>
        </div>
    );
}
