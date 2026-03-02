import { useEffect, useRef, useState } from "react";

type JobStatus = "idle" | "processing" | "completed" | "failed";

export function useRenderProgress() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<JobStatus>("idle");

  const eventSourceRef = useRef<EventSource | null>(null);

  function start(jobId: string) {
    eventSourceRef.current?.close();

    setProgress(0);
    setStatus("processing");

    const url = `${import.meta.env.VITE_API_URL}/video/progress/${jobId}`;
    const es = new EventSource(url);

    eventSourceRef.current = es;

    es.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.error) {
        setStatus("failed");
        es.close();
        return;
      }

      setProgress(data.progress ?? 0);
      setStatus(data.progress == 100 ? "completed": "processing");

      if (data.status === "completed" || data.status === "failed") {
        es.close();
      }
    };
  }

  function reset() {
    eventSourceRef.current?.close();
    setProgress(0);
    setStatus("idle");
  }

  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  return { progress, status, start, reset };
}