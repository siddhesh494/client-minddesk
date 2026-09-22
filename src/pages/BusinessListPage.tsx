import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { businessApi } from "../api/business";
import { getErrorMessage } from "../api/client";
import { CopyButton } from "../components/CopyButton";
import { StatusBadge } from "../components/StatusBadge";
import { formatDate } from "../utils/text";

export function BusinessListPage() {
  const query = useQuery({
    queryKey: ["businesses"],
    queryFn: async () => {
      const response = await businessApi.list();
      return response.data.items;
    },
  });

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-ink-900">Your Clients</h1>
          <p className="mt-2 text-sm text-ink-700">Each card is a private knowledge base with a public UUID.</p>
        </div>
        <Link
          to="/newbusniness"
          className="rounded-full bg-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700"
        >
          + Add New Client
        </Link>
      </div>

      {query.isLoading && (
        <div className="rounded-2xl border border-ink-200 bg-white p-8 text-sm text-ink-700 shadow-card">
          Loading clients...
        </div>
      )}

      {query.isError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-sm text-rose-800">
          {getErrorMessage(query.error, "Unable to load clients")}
        </div>
      )}

      {query.data && query.data.length === 0 && (
        <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-12 text-center shadow-card">
          <h2 className="font-serif text-2xl text-ink-900">No clients yet</h2>
          <p className="mt-2 text-sm text-ink-700">Create a knowledge base to generate the first business UUID.</p>
          <Link to="/newbusniness" className="mt-6 inline-flex rounded-full bg-accent-600 px-4 py-2 text-sm text-white">
            Add your first client
          </Link>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {query.data?.map((business) => (
          <article key={business.uuid} className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card">
            <div className="flex items-start justify-between gap-4">
              <Link to={`/busniness/${business.uuid}`} className="font-serif text-2xl text-ink-900">
                {business.name}
              </Link>
              <StatusBadge status={business.status} />
            </div>
            <p className="mt-3 break-all font-mono text-xs text-ink-700">{business.uuid}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-ink-700">
              <span>{business.chunk_count} chunks</span>
              <span>Updated {formatDate(business.updated_at)}</span>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <CopyButton value={business.uuid} label="Copy UUID" />
              <Link
                to={`/busniness/${business.uuid}`}
                className="rounded-full border border-ink-200 px-3 py-1.5 text-sm text-ink-800 hover:bg-ink-50"
              >
                Edit
              </Link>
              <Link
                to={`/busniness/try/${business.uuid}`}
                className="rounded-full border border-ink-200 px-3 py-1.5 text-sm text-ink-800 hover:bg-ink-50"
              >
                Try
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
