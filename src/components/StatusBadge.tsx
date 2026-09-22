import { cn } from "../utils/cn";
import type { BusinessStatus } from "../types";

const styles: Record<BusinessStatus, string> = {
  active: "bg-emerald-50 text-emerald-800 border-emerald-200",
  indexing: "bg-amber-50 text-amber-800 border-amber-200",
  failed: "bg-rose-50 text-rose-800 border-rose-200",
};

export function StatusBadge({ status }: { status: BusinessStatus }) {
  return (
    <span className={cn("rounded-full border px-2.5 py-1 text-xs font-medium capitalize", styles[status])}>
      {status}
    </span>
  );
}
