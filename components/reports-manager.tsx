"use client";

import { FormEvent, useEffect, useState } from "react";
import { PencilLine } from "lucide-react";

import { mockWeeklyReports } from "@/lib/mock-data";
import { supabase } from "@/lib/supabase";
import type { WeeklyReport } from "@/lib/types";

const initialForm = {
  start_date: "",
  end_date: "",
  responsible: "",
  comments: "",
  avg_response: "",
  avg_resolution: "",
};

export function ReportsManager() {
  const [reports, setReports] = useState<WeeklyReport[]>(mockWeeklyReports);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("Relatorios em modo demo.");

  async function loadReports() {
    if (!supabase) {
      return;
    }

    const result = await supabase
      .from("weekly_reports")
      .select(
        "id, start_date, end_date, responsible, comments, avg_response, avg_resolution",
      )
      .order("start_date", { ascending: false });

    if (result.error) {
      setMessage("Falha ao carregar relatorios do Supabase.");
      return;
    }

    setReports((result.data as WeeklyReport[]) ?? []);
    setMessage("Relatorios carregados do Supabase.");
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadReports();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = {
      start_date: form.start_date,
      end_date: form.end_date,
      responsible: form.responsible,
      comments: form.comments,
      avg_response: Number(form.avg_response),
      avg_resolution: Number(form.avg_resolution),
    };

    if (!supabase) {
      if (selectedId) {
        setReports((current) =>
          current.map((report) =>
            report.id === selectedId ? { ...report, ...payload } : report,
          ),
        );
        setMessage("Relatorio atualizado em memoria.");
      } else {
        setReports((current) => [{ id: `demo-${Date.now()}`, ...payload }, ...current]);
        setMessage("Relatorio criado em memoria.");
      }

      setSelectedId(null);
      setForm(initialForm);
      return;
    }

    if (selectedId) {
      const result = await supabase
        .from("weekly_reports")
        .update(payload)
        .eq("id", selectedId)
        .select()
        .single();

      if (result.error) {
        setMessage("Nao foi possivel atualizar o relatorio.");
        return;
      }

      setReports((current) =>
        current.map((report) =>
          report.id === selectedId ? (result.data as WeeklyReport) : report,
        ),
      );
      setMessage("Relatorio atualizado com sucesso.");
    } else {
      const result = await supabase
        .from("weekly_reports")
        .insert(payload)
        .select()
        .single();

      if (result.error) {
        setMessage("Nao foi possivel criar o relatorio.");
        return;
      }

      setReports((current) => [result.data as WeeklyReport, ...current]);
      setMessage("Relatorio criado com sucesso.");
    }

    setSelectedId(null);
    setForm(initialForm);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Relatorios</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              Ciclo semanal consolidado
            </h2>
          </div>
          <p className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
            {message}
          </p>
        </div>

        <div className="mt-5 grid gap-4">
          {reports.map((report) => (
            <article
              key={report.id}
              className="rounded-[24px] border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                    {report.start_date} ate {report.end_date}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-950">
                    Responsavel: {report.responsible}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{report.comments}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedId(report.id);
                    setForm({
                      start_date: report.start_date,
                      end_date: report.end_date,
                      responsible: report.responsible,
                      comments: report.comments,
                      avg_response: String(report.avg_response),
                      avg_resolution: String(report.avg_resolution),
                    });
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white"
                >
                  <PencilLine className="h-4 w-4" />
                  Editar
                </button>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                    Media resposta
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {report.avg_response} min
                  </p>
                </div>
                <div className="rounded-2xl bg-white px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                    Media resolucao
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {report.avg_resolution} min
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          {selectedId ? "Editar relatorio" : "Novo relatorio"}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">
          Fechamento semanal
        </h2>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm text-slate-600">Inicio</span>
              <input
                type="date"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-950"
                value={form.start_date}
                onChange={(event) =>
                  setForm((current) => ({ ...current, start_date: event.target.value }))
                }
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-slate-600">Fim</span>
              <input
                type="date"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-950"
                value={form.end_date}
                onChange={(event) =>
                  setForm((current) => ({ ...current, end_date: event.target.value }))
                }
              />
            </label>
          </div>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-600">Responsavel</span>
            <input
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-950"
              value={form.responsible}
              onChange={(event) =>
                setForm((current) => ({ ...current, responsible: event.target.value }))
              }
              placeholder="Marina Dias"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-600">Comentarios</span>
            <textarea
              className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-950"
              value={form.comments}
              onChange={(event) =>
                setForm((current) => ({ ...current, comments: event.target.value }))
              }
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm text-slate-600">Media resposta</span>
              <input
                type="number"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-950"
                value={form.avg_response}
                onChange={(event) =>
                  setForm((current) => ({ ...current, avg_response: event.target.value }))
                }
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-slate-600">Media resolucao</span>
              <input
                type="number"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-950"
                value={form.avg_resolution}
                onChange={(event) =>
                  setForm((current) => ({ ...current, avg_resolution: event.target.value }))
                }
              />
            </label>
          </div>
          <button
            type="submit"
            className="w-full rounded-2xl bg-slate-950 px-4 py-3 font-medium text-white transition hover:bg-[#0A2A66]"
          >
            {selectedId ? "Salvar alteracoes" : "Criar relatorio"}
          </button>
        </form>
      </section>
    </div>
  );
}
