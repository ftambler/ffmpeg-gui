export async function requestRender(data: {
  input: string,
  start: string;
  end: string;
  output: string;
  format: string;
}) {
  const normalizedOutput = data.output.toLowerCase().endsWith(`.${data.format.toLowerCase()}`)
    ? data.output
    : `${data.output}.${data.format}`;

  const response = await fetch("http://localhost:3001/api/render", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
      output: normalizedOutput,
    }),
  });

  if (!response.ok) {
    throw new Error("Render request failed");
  }

  return response.json();
}
