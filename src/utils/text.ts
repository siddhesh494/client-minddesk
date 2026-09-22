export function editorJsonToText(value: unknown): string {
  if (typeof value === "string") {
    const stripped = value.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ");
    return stripped.replace(/\s+/g, " ").trim();
  }
  if (!value || typeof value !== "object") {
    return "";
  }
  const node = value as { text?: string; content?: unknown[] };
  const parts: string[] = [];
  if (node.text) {
    parts.push(node.text);
  }
  if (Array.isArray(node.content)) {
    for (const child of node.content) {
      const childText = editorJsonToText(child);
      if (childText) {
        parts.push(childText);
      }
    }
  }
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

export function estimateChunks(characterCount: number, chunkSize = 1000, overlap = 150) {
  if (characterCount === 0) {
    return 0;
  }
  const step = Math.max(chunkSize - overlap, 1);
  return Math.max(1, Math.ceil(characterCount / step));
}

export function formatDate(value: string) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function createDemoPhone(uuid: string) {
  const digits = uuid.replace(/\D/g, "").slice(0, 8).padEnd(8, "0");
  return `+1999${digits}`;
}
