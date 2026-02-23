import { useRef, type ChangeEvent } from "react";

type Props = {
  disabled?: boolean;
  onFiles: (files: File[]) => void;
};

export function SourceMediaSection({
  disabled,
  onFiles,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    onFiles(files);
    e.currentTarget.value = "";
  }

  function openFileDialog() {
    if (disabled) return;
    inputRef.current?.click();
  }

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 lg:p-5 shadow">
      <h2 className="font-semibold tracking-widest mb-3">
        SOURCE MEDIA
      </h2>

      <div className="flex flex-col gap-3">
        {/* Hidden native input */}
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="video/*"
          disabled={disabled}
          onChange={handleChange}
          className="hidden"
        />

        {/* Custom button */}
        <button
          type="button"
          onClick={openFileDialog}
          disabled={disabled}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-md text-sm font-semibold disabled:opacity-50"
        >
          Add Video File
        </button>

        <p className="text-xs text-slate-400">
          Supported formats: MP4, MOV, MKV
        </p>
      </div>
    </section>
  );
}