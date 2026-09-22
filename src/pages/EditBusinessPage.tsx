import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

import { businessApi } from "../api/business";
import { getErrorMessage } from "../api/client";
import { CopyButton } from "../components/CopyButton";
import { RichTextEditor } from "../components/RichTextEditor";
import { StatusBadge } from "../components/StatusBadge";
import { SystemPromptField } from "../components/SystemPromptField";
import { DEFAULT_SYSTEM_PROMPT } from "../utils/defaultSystemPrompt";
import { estimateChunks, formatDate } from "../utils/text";

export function EditBusinessPage() {
  const { uuid = "" } = useParams();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [html, setHtml] = useState("<p></p>");
  const [plainText, setPlainText] = useState("");
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);

  const query = useQuery({
    queryKey: ["business", uuid],
    queryFn: async () => {
      const response = await businessApi.get(uuid);
      return response.data;
    },
    enabled: Boolean(uuid),
  });

  useEffect(() => {
    if (!query.data) {
      return;
    }
    setName(query.data.name);
    const content = query.data.editor_content;
    setHtml(typeof content === "string" && content ? content : `<p>${query.data.plain_text || ""}</p>`);
    setPlainText(query.data.plain_text || "");
    setSystemPrompt(query.data.system_prompt || DEFAULT_SYSTEM_PROMPT);
  }, [query.data]);

  const mutation = useMutation({
    mutationFn: () =>
      businessApi.update({
        uuid,
        name,
        text: plainText,
        editor_content: html,
        system_prompt: systemPrompt,
      }),
    onSuccess: async () => {
      toast.success("Business knowledge updated successfully");
      await queryClient.invalidateQueries({ queryKey: ["business", uuid] });
      await queryClient.invalidateQueries({ queryKey: ["businesses"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Update failed"));
    },
  });

  if (query.isLoading) {
    return <div className="text-sm text-ink-700">Loading business details...</div>;
  }

  if (query.isError || !query.data) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800">
        {getErrorMessage(query.error, "Business was not found")}
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div>
        <h1 className="mb-4 font-serif text-4xl text-ink-900">{query.data.name}</h1>
        <RichTextEditor
          value={html}
          onChange={(nextHtml, nextText) => {
            setHtml(nextHtml);
            setPlainText(nextText);
          }}
        />
        <SystemPromptField value={systemPrompt} onChange={setSystemPrompt} />
      </div>
      <aside className="h-fit rounded-2xl border border-ink-200 bg-white p-5 shadow-card">
        <label className="block text-sm">
          Business name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 w-full rounded-xl border border-ink-200 px-3 py-2 outline-none focus:border-accent-600"
          />
        </label>
        <div className="mt-5 flex items-center justify-between">
          <StatusBadge status={query.data.status} />
          <span className="text-xs text-ink-700">v{query.data.active_version}</span>
        </div>
        <p className="mt-4 break-all font-mono text-xs text-ink-700">{query.data.uuid}</p>
        <dl className="mt-5 space-y-3 text-sm text-ink-700">
          <div className="flex justify-between">
            <dt>Chunks</dt>
            <dd>{query.data.chunk_count}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Estimated next</dt>
            <dd>{estimateChunks(plainText.length)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Updated</dt>
            <dd className="text-right">{formatDate(query.data.updated_at)}</dd>
          </div>
        </dl>
        <div className="mt-5 flex flex-wrap gap-2">
          <CopyButton value={query.data.uuid} label="Copy UUID" />
          <Link
            to={`/busniness/try/${query.data.uuid}`}
            className="rounded-full border border-ink-200 px-3 py-1.5 text-sm"
          >
            Try AI
          </Link>
        </div>
        <button
          type="button"
          disabled={!name.trim() || !plainText.trim() || !systemPrompt.trim() || mutation.isPending}
          onClick={() => mutation.mutate()}
          className="mt-6 w-full rounded-full bg-accent-600 py-2.5 text-sm font-medium text-white hover:bg-accent-700 disabled:cursor-not-allowed disabled:bg-ink-200"
        >
          {mutation.isPending ? "Saving..." : "Save and re-index"}
        </button>
      </aside>
    </div>
  );
}
