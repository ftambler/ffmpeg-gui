import { spawn } from "child_process";

export function renderVideo(options: {
    input: string;
    start: string;
    end: string;
    output: string;
}): Promise<string> {
    return new Promise((resolve, reject) => {
        const ffmpeg = spawn("ffmpeg", [
            "-ss", options.start,
            "-i", options.input,
            "-to", options.end,
            "-c:v", "libx264",
            "-c:a", "aac",
            "-preset", "medium",
            "-crf", "18",
            "-y",
            options.output
        ]);

        ffmpeg.on("close", (code) => {
            if (code === 0) resolve(options.output);
            else reject(new Error("FFmpeg exited with error"));
        });
    });
}
