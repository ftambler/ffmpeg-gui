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
