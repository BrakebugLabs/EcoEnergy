import { ChevronLeft, TrendingDown, TrendingUp, Inbox, Calendar } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { STRINGS } from "@/config/strings";
import type { AnalysisRecord } from "@/services/db";

export function HistoryScreen() {
  const history = useAppStore((s) => s.history);
  const goWelcome = useAppStore((s) => s.goWelcome);

  const totalSaved = history.reduce((s, r) => s + (r.diffBRL < 0 ? -r.diffBRL : 0), 0);
  const totalOver = history.reduce((s, r) => s + (r.diffBRL > 0 ? r.diffBRL : 0), 0);
  const net = totalSaved - totalOver;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 animate-fade-in">
      <button
        onClick={goWelcome}
        className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800"
      >
        <ChevronLeft className="h-4 w-4" /> Voltar
      </button>

      <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-5 shadow-sm sm:p-7">
        <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
          {STRINGS.history.title}
        </div>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {STRINGS.history.subtitle}
        </h2>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <Stat label={STRINGS.history.saved} value={`R$ ${totalSaved.toFixed(2)}`} tone="green" />
          <Stat label={STRINGS.history.overspent} value={`R$ ${totalOver.toFixed(2)}`} tone="red" />
          <Stat
            label={STRINGS.history.net}
            value={`${net >= 0 ? "+" : "−"}R$ ${Math.abs(net).toFixed(2)}`}
            tone={net >= 0 ? "green" : "red"}
          />
        </div>
      </div>

      <h3 className="mb-3 mt-6 text-sm font-semibold text-slate-700">{STRINGS.history.entries}</h3>

      {history.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="space-y-2">
          {history.map((r) => (
            <HistoryItem key={r.id} record={r} />
          ))}
        </ul>
      )}
    </div>
  );
}

function HistoryItem({ record }: { record: AnalysisRecord }) {
  const saved = record.diffBRL <= 0;
  const amount = Math.abs(record.diffBRL);
  const kwh = Math.abs(record.diffKwh);
  const date = new Date(record.createdAt);
  const dateLabel = date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <li
      className={`flex items-center gap-3 rounded-2xl border p-4 transition ${
        saved
          ? "border-emerald-200 bg-white hover:bg-emerald-50/40"
          : "border-red-200 bg-white hover:bg-red-50/40"
      }`}
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
          saved ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
        }`}
      >
        {saved ? <TrendingDown className="h-5 w-5" /> : <TrendingUp className="h-5 w-5" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-slate-500">
          <Calendar className="h-3 w-3" />
          {dateLabel}
        </div>
        <div className="mt-0.5 text-sm font-semibold text-slate-900">
          {saved ? "Economia" : "Gasto a mais"}{" "}
          <span className={saved ? "text-emerald-700" : "text-red-700"}>
            {saved ? "−" : "+"}R$ {amount.toFixed(2)}
          </span>
        </div>
        <div className="mt-0.5 text-xs text-slate-500">
          {kwh.toFixed(1)} kWh 
          {/* · {record.previous.kwh}→{record.recent.kwh} kWh */}
        </div>
      </div>
      {record.earnedPoints > 0 && (
        <div className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-200">
          +{record.earnedPoints} pts
        </div>
      )}
    </li>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "green" | "red" }) {
  const tones = {
    green: "text-emerald-700",
    red: "text-red-700",
  } as const;
  return (
    <div className="rounded-2xl bg-white/80 p-3 shadow-sm backdrop-blur">
      <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{label}</div>
      <div className={`mt-1 text-base font-bold sm:text-lg ${tones[tone]}`}>{value}</div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
        <Inbox className="h-6 w-6" />
      </div>
      <p className="mt-3 text-sm font-semibold text-slate-700">{STRINGS.history.emptyTitle}</p>
      <p className="mt-1 text-xs text-slate-500">{STRINGS.history.emptyBody}</p>
    </div>
  );
}
