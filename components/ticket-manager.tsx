"use client";

import { FormEvent, useEffect, useState } from "react";

import { StatusBadge } from "@/components/status-badge";
import { mockTickets } from "@/lib/mock-data";
import { supabase } from "@/lib/supabase";
import type { Ticket } from "@/lib/types";

const initialForm = {
  client_id: "",
  project: "",
  problem_type: "",
  description: "",
  status: "aberto",
  responsible: "",
};

export function TicketManager() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("Modo demo ativo ate conectar o Supabase.");

  async function loadTickets() {
    if (!supabase) {
      return;
    }

    const result = await supabase
      .from("tickets")
      .select(
        "id, client_id, project, problem_type, description, status, opened_at, resolved_at, responsible",
      )
      .order("opened_at", { ascending: false });

    if (result.error) {
      setMessage("Falha ao carregar chamados do Supabase. Mantendo dados de demo.");
      return;
    }

    setTickets((result.data as Ticket[]) ?? []);
    setMessage("Chamados carregados do Supabase.");
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadTickets();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      opened_at: new Date().toISOString(),
      resolved_at: null,
    };

    if (!supabase) {
      setTickets((current) => [{ id: `demo-${Date.now()}`, ...payload }, ...current]);
      setMessage("Chamado criado em memoria. Preencha o Supabase para persistir.");
      setForm(initialForm);
      setSaving(false);
      return;
    }

    const result = await supabase.from("tickets").insert(payload).select().single();

    setSaving(false);

    if (result.error) {
      setMessage("Nao foi possivel criar o chamado no Supabase.");
      return;
    }

    setTickets((current) => [result.data as Ticket, ...current]);
    setForm(initialForm);
    setMessage("Chamado criado com sucesso.");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Chamados</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">Fila operacional</h2>
          </div>
          <p className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
            {message}
          </p>
        </div>

        <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Projeto</th>
                <th className="px-4 py-3 font-medium">Problema</th>
                <th className="px-4 py-3 font-medium">Responsavel</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="px-4 py-4">
                    <p className="font-medium text-slate-950">{ticket.project}</p>
                    <p className="text-xs text-slate-500">{ticket.description}</p>
                  </td>
                  <td className="px-4 py-4 text-slate-700">{ticket.problem_type}</td>
                  <td className="px-4 py-4 text-slate-700">{ticket.responsible}</td>
                  <td className="px-4 py-4">
                    <StatusBadge value={ticket.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Novo chamado</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">
          Registrar ocorrencia
        </h2>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-600">Client ID</span>
            <input
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-950"
              value={form.client_id}
              onChange={(event) =>
                setForm((current) => ({ ...current, client_id: event.target.value }))
              }
              placeholder="cli-1"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-600">Projeto</span>
            <input
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-950"
              value={form.project}
              onChange={(event) =>
                setForm((current) => ({ ...current, project: event.target.value }))
              }
              placeholder="Portal do Cliente"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-600">Tipo de problema</span>
            <input
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-950"
              value={form.problem_type}
              onChange={(event) =>
                setForm((current) => ({ ...current, problem_type: event.target.value }))
              }
              placeholder="Performance"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-600">Descricao</span>
            <textarea
              className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-950"
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({ ...current, description: event.target.value }))
              }
              placeholder="Detalhe o impacto e os passos para reproduzir."
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm text-slate-600">Status</span>
              <select
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-950"
                value={form.status}
                onChange={(event) =>
                  setForm((current) => ({ ...current, status: event.target.value }))
                }
              >
                <option value="aberto">aberto</option>
                <option value="em andamento">em andamento</option>
                <option value="fechado">fechado</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-slate-600">Responsavel</span>
              <input
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-950"
                value={form.responsible}
                onChange={(event) =>
                  setForm((current) => ({ ...current, responsible: event.target.value }))
                }
                placeholder="Equipe Suporte N1"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-2xl bg-slate-950 px-4 py-3 font-medium text-white transition hover:bg-[#0A2A66] disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Criar chamado"}
          </button>
        </form>
      </section>
    </div>
  );
}
