import { cn } from "@/lib/utils";

const variants: Record<string, string> = {
  aberto: "bg-amber-100 text-amber-900",
  fechado: "bg-emerald-100 text-emerald-900",
  "em andamento": "bg-sky-100 text-sky-900",
  critico: "bg-rose-100 text-rose-900",
  monitorando: "bg-violet-100 text-violet-900",
  concluida: "bg-emerald-100 text-emerald-900",
  proposta: "bg-blue-100 text-blue-900",
};

export function StatusBadge({ value }: { value: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize",
        variants[value] ?? "bg-slate-100 text-slate-900",
      )}
    >
      {value}
    </span>
  );
}
