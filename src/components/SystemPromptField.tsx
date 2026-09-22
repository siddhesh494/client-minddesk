interface SystemPromptFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function SystemPromptField({ value, onChange }: SystemPromptFieldProps) {
  return (
    <label className="mt-6 block">
      <div className="mb-2 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-ink-900">Assistant prompt</p>
          <p className="mt-1 text-xs leading-5 text-ink-700">
            This prompt is unique to this client. The assistant uses it for every customer conversation.
          </p>
        </div>
        <span className="text-xs text-ink-700">{value.length} chars</span>
      </div>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={12}
        className="w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 font-mono text-sm leading-6 text-ink-800 outline-none focus:border-accent-600"
      />
    </label>
  );
}
