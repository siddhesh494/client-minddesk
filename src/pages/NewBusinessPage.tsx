import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { businessApi } from "../api/business";
import { getErrorMessage } from "../api/client";
import { CopyButton } from "../components/CopyButton";
import { RichTextEditor } from "../components/RichTextEditor";
import { SystemPromptField } from "../components/SystemPromptField";
import { DEFAULT_SYSTEM_PROMPT } from "../utils/defaultSystemPrompt";
import { estimateChunks } from "../utils/text";

export function NewBusinessPage() {
  const [name, setName] = useState("");
  const [html, setHtml] = useState("<p></p>");
  const [plainText, setPlainText] = useState("");
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [createdUuid, setCreatedUuid] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () =>
      businessApi.create({
        name,
        text: plainText,
        editor_content: html,
        system_prompt: systemPrompt,
      }),
    onSuccess: (response) => {
      setCreatedUuid(response.data.uuid);
      toast.success("Business indexed successfully.");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Indexing failed"));
    },
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div>
        <h1 className="mb-4 font-serif text-4xl text-ink-900">New client</h1>
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
        <dl className="mt-6 space-y-3 text-sm text-ink-700">
          <div className="flex justify-between">
            <dt>Characters</dt>
            <dd>{plainText.length}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Estimated chunks</dt>
            <dd>{estimateChunks(plainText.length)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Status</dt>
            <dd>{mutation.isPending ? "Indexing" : createdUuid ? "Active" : "Draft"}</dd>
          </div>
        </dl>
        <button
          type="button"
          disabled={!name.trim() || !plainText.trim() || !systemPrompt.trim() || mutation.isPending}
          onClick={() => mutation.mutate()}
          className="mt-6 w-full rounded-full bg-accent-600 py-2.5 text-sm font-medium text-white hover:bg-accent-700 disabled:cursor-not-allowed disabled:bg-ink-200"
        >
          {mutation.isPending ? "Processing..." : "Save / Process"}
        </button>
        {createdUuid && (
          <div className="mt-6 rounded-2xl bg-ink-50 p-4">
            <p className="text-sm text-ink-800">Business indexed successfully.</p>
            <p className="mt-3 break-all font-mono text-xs">{createdUuid}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <CopyButton value={createdUuid} label="Copy UUID" />
              <Link
                to={`/busniness/try/${createdUuid}`}
                className="rounded-full border border-ink-200 bg-white px-3 py-1.5 text-sm"
              >
                Try AI
              </Link>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
