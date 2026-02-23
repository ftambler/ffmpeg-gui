import { Request, Response } from "express";
import { renderTimeline, renderTrim } from "../services/RenderService.js";

export async function handleRender(req: Request, res: Response) {
  try {
    const result = await renderTrim(req.body);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: "Render failed" });
  }
}

export async function handleVideoEdit(req: Request, res: Response) {
  try {
    const media = req.body.media;
    const outputFile = req.body.outputFile;

    const result = await renderTimeline(media, outputFile);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: "Render failed" });
  }
}
