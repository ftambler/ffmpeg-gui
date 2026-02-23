export function timeToSeconds(time: string): number {
    const parts = time.split(":").map(Number);

    if (parts.length === 3) {
        const [hh, mm, ss] = parts;
        return hh * 3600 + mm * 60 + ss;
    }

    return 0;
}

export function formatTime(seconds: number): string {
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  const hours = Math.floor(safeSeconds / 3600);
  const mins = Math.floor((safeSeconds % 3600) / 60);
  const secs = Math.floor(safeSeconds % 60);
//   const ms = Math.floor((safeSeconds % 1) * 100);

  return `${hours}:${mins.toString().padStart(2, "0")}:${secs
    .toString()
    // .padStart(2, "0")}.}${ms
    .toString()
    .padStart(2, "0")}`;
}
