interface TrimActionPanelProps {
    error: string | null;
    disabled?: boolean;
    submitLabel: string;
}

export default function TrimActionPanel({ error, disabled, submitLabel }: TrimActionPanelProps) {
    return (
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 lg:p-5 shadow flex flex-col justify-between min-h-40 gap-4">
            <div>
                <h2 className="font-semibold tracking-widest mb-3">
                    ACTION
                </h2>

                {error && <div className="text-red-400 text-sm">{error}</div>}
            </div>

            <button
                type="submit"
                disabled={disabled}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {submitLabel}
            </button>
        </section>
    );
}
