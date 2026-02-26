import { videoOutputFormats, type VideoOutputFormat } from "../../types/VideoOutputFormat";

interface OutputSettingsProps {
    outputName: string;
    outputFormat: VideoOutputFormat;
    disabled?: boolean;
    onChange: (field: "outputName" | "outputFormat", value: string) => void;
}

export default function OutputSettings({ outputName, outputFormat, disabled, onChange }: OutputSettingsProps) {
    return (
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 lg:p-5 shadow">
            <h2 className="font-semibold tracking-widest mb-3">
                OUTPUT SETTINGS
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-300">Output Name</label>
                    <input
                        type="text"
                        value={outputName}
                        disabled={disabled}
                        onChange={(e) => onChange("outputName", e.target.value)}
                        className="border border-slate-700 bg-slate-950/70 text-slate-100 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-300">Output Format</label>
                    <select
                        value={outputFormat}
                        disabled={disabled}
                        onChange={(e) => onChange("outputFormat", e.target.value as VideoOutputFormat)}
                        className="border border-slate-700 bg-slate-950/70 text-slate-100 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {videoOutputFormats.map((format) => (
                            <option key={format} value={format}>
                                {format}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </section>
    );
}
