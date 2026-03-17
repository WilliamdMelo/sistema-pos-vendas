"use client";

import { useEffect, useState } from "react";

import { mockWeeklyReports } from "@/lib/mock-data";
import { supabase } from "@/lib/supabase";
import type { WeeklyReport } from "@/lib/types";

const storageKey = "spv-weekly-reports";

export function useWeeklyReports() {
  const [reports, setReports] = useState<WeeklyReport[]>(mockWeeklyReports);
  const [source, setSource] = useState<"demo" | "supabase">("demo");
  const [loading, setLoading] = useState(true);

  async function loadReports() {
    if (supabase) {
      const result = await supabase.from("weekly_reports").select("*");

      if (!result.error && result.data) {
        setReports(
          [...(result.data as WeeklyReport[])].sort(
            (a, b) =>
              new Date(b.meeting_info.data_reuniao).getTime() -
              new Date(a.meeting_info.data_reuniao).getTime(),
          ),
        );
        setSource("supabase");
        setLoading(false);
        return;
      }
    }

    const raw = window.localStorage.getItem(storageKey);
    if (raw) {
      setReports(JSON.parse(raw) as WeeklyReport[]);
    } else {
      window.localStorage.setItem(storageKey, JSON.stringify(mockWeeklyReports));
    }

    setSource("demo");
    setLoading(false);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadReports();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  async function saveReport(report: WeeklyReport) {
    if (supabase) {
      const result = await supabase
        .from("weekly_reports")
        .upsert(report)
        .select()
        .single();

      if (!result.error && result.data) {
        setReports((current) => {
          const next = current.some((item) => item.id === report.id)
            ? current.map((item) => (item.id === report.id ? (result.data as WeeklyReport) : item))
            : [result.data as WeeklyReport, ...current];

          return next.sort(
            (a, b) =>
              new Date(b.meeting_info.data_reuniao).getTime() -
              new Date(a.meeting_info.data_reuniao).getTime(),
          );
        });
        setSource("supabase");
        return { ok: true as const };
      }

      return { ok: false as const, message: "Falha ao salvar no Supabase." };
    }

    const next = reports.some((item) => item.id === report.id)
      ? reports.map((item) => (item.id === report.id ? report : item))
      : [report, ...reports];

    const sorted = [...next].sort(
      (a, b) =>
        new Date(b.meeting_info.data_reuniao).getTime() -
        new Date(a.meeting_info.data_reuniao).getTime(),
    );

    setReports(sorted);
    window.localStorage.setItem(storageKey, JSON.stringify(sorted));
    return { ok: true as const };
  }

  async function deleteReport(id: string) {
    if (supabase) {
      const result = await supabase.from("weekly_reports").delete().eq("id", id);

      if (result.error) {
        return { ok: false as const, message: "Falha ao excluir no Supabase." };
      }

      setReports((current) => current.filter((item) => item.id !== id));
      return { ok: true as const };
    }

    const next = reports.filter((item) => item.id !== id);
    setReports(next);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
    return { ok: true as const };
  }

  return {
    reports,
    source,
    loading,
    saveReport,
    deleteReport,
  };
}
