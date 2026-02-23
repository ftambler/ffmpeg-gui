import type { MediaPayload } from "../types/MediaDraft";

export async function requestRender(data: {
  inputFile: string,
  start: string;
  end: string;
  outputFile: string;
  format: string;
}) {
  const normalizedOutput = data.outputFile.toLowerCase().endsWith(`.${data.format.toLowerCase()}`)
    ? data.outputFile
    : `${data.outputFile}.${data.format}`;

  const response = await fetch("http://localhost:3000/api/render", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
      outputFile: normalizedOutput,
    }),
  });

  if (!response.ok) {
    throw new Error("Render request failed");
  }

  return response.json();
}

export async function requestTimelineRender(
  media: MediaPayload[],
  outputFile: string
): Promise<{ outputFile: string }> {
  const res = await fetch("http://localhost:3000/api/timeline/render", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      media,
      outputFile,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Timeline render failed");
  }

  return res.json();
}