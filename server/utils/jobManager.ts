type JobStatus = "pending" | "running" | "completed" | "failed";

type Job = {
  id: string;
  status: JobStatus;
  progress: number;
  message?: string;
  error?: string;
};

const jobs = new Map<string, Job>();

export function createJob(id: string): Job {
  const job: Job = {
    id,
    status: "pending",
    progress: 0
  };
  jobs.set(id, job);
  return job;
}

export function getJob(id: string): Job | undefined {
  return jobs.get(id);
}

export function updateJob(id: string, updates: Partial<Job>) {
  const job = jobs.get(id);
  if (!job) return;
  Object.assign(job, updates);
}