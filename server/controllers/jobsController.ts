import { getJob } from "../utils/jobManager.js";
import { Request, Response } from "express";

export function handleProgressStream(req: Request<{ jobId: string }>, res: Response) {
    const { jobId } = req.params;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const interval = setInterval(() => {
        const job = getJob(jobId);

        if (!job) {
            res.write(`data: ${JSON.stringify({ error: "Not found" })}\n\n`);
            clearInterval(interval);
            return res.end();
        }

        res.write(`data: ${JSON.stringify(job)}\n\n`);

        if (job.status === "completed" || job.status === "failed") {
            clearInterval(interval);
            res.end();
        }

    }, 500);

    req.on("close", () => {
        clearInterval(interval);
    });
}