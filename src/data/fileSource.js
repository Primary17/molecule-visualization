import { LIMITS } from "./schema.js";

export function fileSource(file) {
  return {
    id: `file:${file.name}`,
    label: file.name,
    async load() {
      if (file.size > LIMITS.maxFileBytes) return { error: "FILE_TOO_LARGE" };
      return { text: await file.text() };
    },
  };
}
