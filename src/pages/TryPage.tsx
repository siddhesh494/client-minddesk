import { FormEvent, KeyboardEvent, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { businessApi } from "../api/business";
import { chatApi } from "../api/chat";
import { getErrorMessage } from "../api/client";
import { createDemoPhone } from "../utils/text";
import type { ChatMessage } from "../types";

const suggestions = [
  "What does this business do?",
  "What products or services do you offer?",
  "What are your opening hours?",
  "What is your return policy?",
];

export function TryPage() {
  const { uuid = "" } = useParams();
  const demoPhone = useMemo(() => createDemoPhone(uuid), [uuid]);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const businessQuery = useQuery({
    queryKey: ["public-business", uuid],
    queryFn: async () => {
      const response = await businessApi.getPublic(uuid);
      return response.data;
    },
    enabled: Boolean(uuid),
  });

  const chatMutation = useMutation({
    mutationFn: (user_query: string) =>
      chatApi.send({
        uuid,
        user_phone_number: demoPhone,
        user_query,
      }),
    onSuccess: (response) => {
      setMessages((current) => [
        ...current.filter((message) => message.id !== "pending"),
        { id: crypto.randomUUID(), role: "assistant", content: response.data.answer },
      ]);
    },
    onError: (error) => {
      setMessages((current) => [
        ...current.filter((message) => message.id !== "pending"),
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: getErrorMessage(error, "The assistant could not answer just now."),
        },
      ]);
    },
  });

  function send(text: string) {
    const query = text.trim();
    if (!query || chatMutation.isPending) {
      return;
    }
    setInput("");
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", content: query },
      { id: "pending", role: "assistant", content: "Thinking..." },
    ]);
    chatMutation.mutate(query);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    send(input);
  }

  function handleComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send(input);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 pb-16">
      <div className="rounded-[28px] border border-ink-200 bg-white shadow-card">
        <div className="border-b border-ink-100 px-6 py-5">
          <p className="text-xs uppercase tracking-[0.16em] text-accent-700">AI Assistant</p>
          <h1 className="mt-2 font-serif text-3xl text-ink-900">
            {businessQuery.data?.name || (businessQuery.isLoading ? "Loading assistant..." : "Assistant")}
          </h1>
          {businessQuery.isError && (
            <p className="mt-2 text-sm text-rose-700">{getErrorMessage(businessQuery.error, "This business UUID is not available.")}</p>
          )}
        </div>

        <div className="flex min-h-[420px] flex-col gap-4 px-6 py-6">
          {messages.length === 0 && (
            <div className="rounded-2xl bg-ink-50 p-5 text-sm leading-6 text-ink-700">
              Ask a question the way a customer would. These prompts are only examples, not facts about the business.
              <div className="mt-4 flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => send(suggestion)}
                    className="rounded-full border border-ink-200 bg-white px-3 py-1.5 text-left text-xs text-ink-800 hover:bg-ink-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={
                message.role === "user"
                  ? "ml-auto max-w-[80%] whitespace-pre-wrap rounded-2xl bg-accent-600 px-4 py-3 text-sm text-white"
                  : "max-w-[85%] whitespace-pre-wrap rounded-2xl bg-ink-50 px-4 py-3 text-sm leading-6 text-ink-800"
              }
            >
              {message.content}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex items-end gap-3 border-t border-ink-100 px-6 py-4">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleComposerKeyDown}
            placeholder="Ask about this business. Shift+Enter for a new line."
            rows={3}
            className="max-h-40 min-h-[72px] flex-1 resize-none rounded-2xl border border-ink-200 px-4 py-2.5 outline-none focus:border-accent-600"
          />
          <button
            type="submit"
            disabled={!input.trim() || chatMutation.isPending || businessQuery.isError}
            className="rounded-full bg-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700 disabled:bg-ink-200"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
