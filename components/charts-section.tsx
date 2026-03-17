"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const pieColors = ["#0A2A66", "#1F4E79", "#6D89B3", "#B7C7DE"];

export function ChartsSection({
  responseData,
  statusData,
  problemData,
}: {
  responseData: { name: string; resposta: number }[];
  statusData: { name: string; chamados: number }[];
  problemData: { name: string; value: number }[];
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="grid gap-5 xl:grid-cols-3">
        <div className="h-72 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2" />
        <div className="h-72 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm" />
        <div className="h-72 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm xl:col-span-3" />
      </div>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-3">
      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
        <div className="mb-5">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Tempo medio de resposta
          </p>
          <h3 className="mt-2 text-xl font-semibold text-slate-950">
            Linha semanal por projeto
          </h3>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={responseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dbe5f2" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="resposta"
                stroke="#0A2A66"
                strokeWidth={3}
                dot={{ fill: "#1F4E79", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Problemas</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-950">
            Distribuicao por tipo
          </h3>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={problemData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
              >
                {problemData.map((entry, index) => (
                  <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm xl:col-span-3">
        <div className="mb-5">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Chamados</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-950">
            Volume por status
          </h3>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dbe5f2" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="chamados" radius={[10, 10, 0, 0]} fill="#1F4E79" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
