type ActionPanelProps = {
    status: "idle" | "processing" | "completed" | "failed";
    progress: number;
    error?: string;
    disabled?: boolean;
    submitLabel: string;
};

export default function ActionPanel({ status, progress, error, disabled, submitLabel }: ActionPanelProps) {
    const isProcessing = (status === "processing");
    const isCompleted = (status === "completed");
    const isFailed = (status === "failed");

    return (
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 lg:p-5 shadow flex flex-col justify-between min-h-40 gap-4">
            <div>
                <h2 className="font-semibold tracking-widest mb-3">
                    ACTION
                </h2>

                {error && (
                    <div className="text-red-400 text-sm mb-2">
                        {error}
                    </div>
                )}

                {isProcessing && (
                    <p className="text-base font-semibold text-green-500">
                        Rendering...
                    </p>
                )}

                {isCompleted && (
                    <p className="text-sm text-green-400 font-medium">
                        Completed successfully
                    </p>
                )}

                {isFailed && (
                    <p className="text-sm text-red-400 font-medium">
                        Render failed
                    </p>
                )}
            </div>

            {isProcessing ? (
                <div className="flex items-center gap-3">
                    <div className="flex-1">
                        <div className="w-full bg-slate-800 rounded-lg h-3 overflow-hidden">
                            <div
                                className="bg-green-600 h-3 transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    <span className="text-sm font-medium text-slate-300 w-14 text-right">
                        {progress.toFixed(1)}%
                    </span>
                </div>
            ) : (
                <button
                    type="submit"
                    disabled={disabled}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitLabel}
                </button>
            )}
        </section>
    );
}