import { Request, Response } from "express";
import { randomUUID } from "crypto";

import { createJob, updateJob } from "../utils/jobManager.js";
import { renderTimeline } from "../services/renderingService.js";

export async function handleVideoEdit(req: Request, res: Response) {
  const { media, outputFile } = req.body;

  const jobId = randomUUID();
  createJob(jobId);

  res.json({ jobId });

  (async () => {
    try {
      updateJob(jobId, { status: "running" });

      await renderTimeline(jobId, media, outputFile, (progress, message) => {
        updateJob(jobId, {
          progress,
          message,
          status: "running"
        });
      });

      updateJob(jobId, {
        status: "completed",
        progress: 100
      });

    } catch (err: any) {
      updateJob(jobId, {
        status: "failed",
        error: err.message
      });
    }
  })();
}