interface FilePickerProps {
    file: File | null;
    disabled?: boolean;
    onFileSelected: (file: File | null) => void;
}

export default function FilePicker({ file, disabled, onFileSelected }: FilePickerProps) {
    return (
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 lg:p-5 shadow">
            <h2 className="font-semibold tracking-widest mb-3">
                SOURCE MEDIA
            </h2>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-300">Input File</label>
                <input
                    type="file"
                    accept="video/*"
                    disabled={disabled}
                    onChange={(e) => onFileSelected(e.target.files?.[0] ?? null)}
                    className="block w-full text-sm text-slate-300
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-slate-800 file:text-slate-100
                    hover:file:bg-slate-700
                    disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-slate-500 truncate">
                    {file ? `Selected: ${file.name}` : "No file selected"}
                </p>
            </div>
        </section>
    );
}
