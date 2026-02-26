import { api } from "../api/axios";
import type { MediaPayload } from "../types/MediaDraft";

export class RenderService {
  static async requestRender(data: { inputFile: string; start: string; end: string; outputFile: string; format: string; }) {
    const normalizedOutput = data.outputFile.toLowerCase().endsWith( `.${data.format.toLowerCase()}`)
        ? data.outputFile
        : `${data.outputFile}.${data.format}`;

    const response = await api.post("/render", { ...data, outputFile: normalizedOutput });

    return response.data;
  }

  static async requestTimelineRender( media: MediaPayload[], outputFile: string): Promise<{ outputFile: string }> {
    const response = await api.post("/timeline/render", { media, outputFile });

    return response.data;
  }
}