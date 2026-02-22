import { Request, Response } from "express";
import { renderVideo } from "../services/ffmpegService.js";

export async function handleRender(req: Request, res: Response) {
  try {
    const result = await renderVideo(req.body);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: "Render failed" });
  }
}
