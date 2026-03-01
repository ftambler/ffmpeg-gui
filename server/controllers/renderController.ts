import { Request, Response } from "express";
import { renderTimeline } from "../services/RenderService.js";

export async function handleVideoEdit(req: Request, res: Response) {
  try {
    const { media, outputFile } = req.body;

    if (!Array.isArray(media) || typeof outputFile !== "string") {
      return res.status(400).json({ error: "Invalid request payload" });
    }

    const result = await renderTimeline(media, outputFile);
    res.json({ success: true, result });

  } catch (err: any) {
    const status = err.statusCode ?? 500;
    res.status(status).json({ error: err.message ?? "Render failed" });
  }
}