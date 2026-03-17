"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BellDot,
  LayoutDashboard,
  ShieldAlert,
  Ticket,
} from "lucide-react";

import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Resumo", icon: LayoutDashboard },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/chamados", label: "Chamados", icon: Ticket },
  { href: "/relatorios", label: "Relatorios", icon: BellDot },
  { href: "/clientes-risco", label: "Clientes em risco", icon: ShieldAlert },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(31,78,121,0.24),_transparent_28%),linear-gradient(160deg,_#071631_0%,_#0a2a66_42%,_#f4f7fb_42%,_#f4f7fb_100%)] text-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-4 lg:flex-row lg:px-6">
        <aside className="w-full rounded-[28px] border border-white/15 bg-slate-950/75 p-5 text-white shadow-2xl backdrop-blur lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:w-80">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.35em] text-sky-200/70">
              Sistema de Pos-Vendas
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Operacao, risco e relatorios em uma tela.
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Painel completo para acompanhar chamados, clientes sensiveis e ritmo de entrega semanal.
            </p>
          </div>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition",
                    isActive
                      ? "border-sky-300/40 bg-sky-400/15 text-white"
                      : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/8 hover:text-white",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-sky-200/70">
              Pulso da semana
            </p>
            <div className="mt-3 space-y-3 text-sm text-slate-300">
              <p>
                Relatorios consolidados com foco em tempo de resposta, resolucao e contas em risco.
              </p>
              <p className="rounded-2xl bg-white/10 px-3 py-2 text-white">
                Paleta: <span className="font-medium">#0A2A66</span> e{" "}
                <span className="font-medium">#1F4E79</span>
              </p>
            </div>
          </div>
        </aside>

        <main className="flex-1 rounded-[32px] border border-slate-200/70 bg-white/90 p-4 shadow-[0_24px_80px_rgba(7,22,49,0.18)] backdrop-blur sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
