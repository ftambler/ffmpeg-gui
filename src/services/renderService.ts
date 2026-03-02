import { api } from "../api/axios";
import type { MediaPayload } from "../types/MediaDraft";

export class RenderService {
  static async requestTimelineRender( media: MediaPayload[], outputFile: string): Promise<{ jobId: string }> {
    const response = await api.post("/video/render", { media, outputFile });

    return response.data;
  }
}