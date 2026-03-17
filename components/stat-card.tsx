import { ReactNode } from "react";

export function StatCard({
  label,
  value,
  helper,
  icon,
}: {
  label: string;
  value: string;
  helper: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{label}</p>
          <p className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
            {value}
          </p>
          <p className="mt-3 text-sm text-slate-500">{helper}</p>
        </div>
        <div className="rounded-2xl bg-slate-950 p-3 text-white">{icon}</div>
      </div>
    </div>
  );
}
