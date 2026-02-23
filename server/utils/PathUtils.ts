import path from "path";

export function safeJoin(base: string, target: string) {
  const resolved = path.resolve(base, target);
  if (!resolved.startsWith(path.resolve(base))) {
    throw new Error("Invalid file path");
  }
  return resolved;
}