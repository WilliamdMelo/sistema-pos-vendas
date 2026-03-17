"use client";

import { useEffect, useState } from "react";

import { StatusBadge } from "@/components/status-badge";
import { mockRiskClients } from "@/lib/mock-data";
import { supabase } from "@/lib/supabase";
import type { RiskClient } from "@/lib/types";

export function RiskClientsManager() {
  const [riskClients, setRiskClients] = useState<RiskClient[]>(mockRiskClients);
  const [source, setSource] = useState("demo");

  useEffect(() => {
    async function loadRiskClients() {
      if (!supabase) {
        return;
      }

      const result = await supabase
        .from("risk_clients")
        .select("id, client, project, problem, next_step, deadline, status")
        .order("deadline", { ascending: true });

      if (result.error) {
        return;
      }

      setRiskClients((result.data as RiskClient[]) ?? []);
      setSource("supabase");
    }

    void loadRiskClients();
  }, []);

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Clientes em risco
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">
            Contas que exigem plano de acao
          </h2>
        </div>
        <p className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
          Origem: {source}
        </p>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {riskClients.map((item) => (
          <article
            key={item.id}
            className="rounded-[24px] border border-slate-200 bg-slate-50 p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                  {item.project}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-950">
                  {item.client}
                </h3>
              </div>
              <StatusBadge value={item.status} />
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-700">{item.problem}</p>
            <div className="mt-4 grid gap-3 rounded-2xl bg-white p-4 text-sm text-slate-600">
              <p>
                <span className="font-semibold text-slate-900">Proximo passo:</span>{" "}
                {item.next_step}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Prazo:</span>{" "}
                {item.deadline}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
