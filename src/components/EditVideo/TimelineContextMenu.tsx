type Props = {
  x: number;
  y: number;
  onDelete: () => void;
  onTrim: () => void;
};

export function TimelineContextMenu({
  x,
  y,
  onDelete,
  onTrim,
}: Props) {
  return (
    <div
      className="fixed bg-slate-800 border border-slate-700 rounded shadow-lg p-2 z-50"
      style={{ top: y, left: x }}
    >
      <button
        className="block w-full text-left px-3 py-1 hover:bg-slate-700"
        onClick={onDelete}
      >
        Delete
      </button>

      <button
        className="block w-full text-left px-3 py-1 hover:bg-slate-700"
        onClick={onTrim}
      >
        Trim
      </button>
    </div>
  );
}