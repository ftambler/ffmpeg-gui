export async function requestRender(data: {
  input: string;
  start: string;
  end: string;
  output: string;
}) {
  const response = await fetch("http://localhost:3001/api/render", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error("Render request failed");
  }

  return response.json();
}
