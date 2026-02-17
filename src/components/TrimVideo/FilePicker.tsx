interface FilePickerProps {
    file: File | null;
    disabled?: boolean;
    onFileSelected: (file: File | null) => void;
}

export default function FilePicker({ disabled, onFileSelected }: FilePickerProps) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Input File</label>
            <input
                type="file"
                accept="video/*"
                disabled={disabled}
                onChange={(e) => onFileSelected(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-gray-600
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-md file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100"
            />
        </div>
    );
}
