import { useEffect, useRef } from "react";

type TimelineContextMenuProps = {
  x: number;
  y: number;
  onDelete: () => void;
  onTrim: () => void;
  onClose: () => void
};


export function TimelineContextMenu({ x, y, onDelete, onTrim, onClose }: TimelineContextMenuProps) {
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [onClose]);

  return (
    <div ref={menuRef} className="fixed bg-slate-800 border border-slate-700 rounded shadow-lg p-2 z-50" style={{ top: y, left: x }} >
      <button className="block w-full text-left px-3 py-1 hover:bg-slate-700" onClick={onDelete}>
        Delete
      </button>

      <button className="block w-full text-left px-3 py-1 hover:bg-slate-700" onClick={onTrim} >
        Trim
      </button>
    </div>
  );
}