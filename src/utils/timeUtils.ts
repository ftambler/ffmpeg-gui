export function timeToSeconds(time: string): number {
    const parts = time.split(":").map(Number);

    if (parts.length === 3) {
        const [hh, mm, ss] = parts;
        return hh * 3600 + mm * 60 + ss;
    }

    return 0;
}
