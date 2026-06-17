import { useState } from "react";
import {
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  PartyPopper,
  RotateCcw,
  Leaf,
  CheckCircle2,
  Circle,
  Edit3,
  Save,
  Check as CheckIcon,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { STRINGS } from "@/config/strings";

export function VerdictScreen() {
  const previous = useAppStore((s) => s.previous);
  const recent = useAppStore((s) => s.recent);
  const lastEarned = useAppStore((s) => s.lastEarned);
  const goWelcome = useAppStore((s) => s.goWelcome);
  const editPrevious = useAppStore((s) => s.editPrevious);
  const saveCurrentAnalysis = useAppStore((s) => s.saveCurrentAnalysis);
  const lastSaved = useAppStore((s) => s.lastSaved);
  const [saving, setSaving] = useState(false);

  if (!previous || !recent) return null;

  const diffKwh = recent.kwh - previous.kwh;
  const diffBRL = recent.valueBRL - previous.valueBRL;
  const saved = diffKwh <= 0;

  const handleSave = async () => {
    setSaving(true);
    await saveCurrentAnalysis();
    setSaving(false);
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 animate-fade-in">
      {saved ? (
        <GreenVerdict diffKwh={Math.abs(diffKwh)} diffBRL={Math.abs(diffBRL)} earned={lastEarned} />
      ) : (
        <RedVerdict diffKwh={diffKwh} diffBRL={diffBRL} />
      )}

      <button
        onClick={handleSave}
        disabled={saving || lastSaved}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-70"
      >
        {lastSaved ? <CheckIcon className="h-4 w-4" /> : <Save className="h-4 w-4" />}
        {lastSaved ? STRINGS.verdict.savedHistory : STRINGS.verdict.saveHistory}
      </button>

      <button
        onClick={editPrevious}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
      >
        <Edit3 className="h-4 w-4" />
        {STRINGS.verdict.editData}
      </button>

      <button
        onClick={goWelcome}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        <RotateCcw className="h-4 w-4" />
        {STRINGS.verdict.newAnalysis}
      </button>

      <button
        onClick={goWelcome}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-transparent px-4 py-3 text-sm font-semibold text-slate-500 transition hover:text-slate-700"
      >
        {STRINGS.verdict.backToHome}
      </button>
    </div>
  );
}

function GreenVerdict({
  diffKwh,
  diffBRL,
  earned,
}: {
  diffKwh: number;
  diffBRL: number;
  earned: number;
}) {
  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-3xl border border-green-200 bg-green-50 p-6 shadow-sm sm:p-8">
        <FallingLeaves />
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
            <PartyPopper className="h-3.5 w-3.5" />+{earned} EcoPoints
          </div>
          <h2 className="mt-3 text-2xl font-bold text-green-900 sm:text-3xl">
            {STRINGS.verdict.greenTitle}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-green-800 sm:text-base">
            {STRINGS.verdict.greenBody(diffKwh, diffBRL)}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Metric
              icon={<TrendingDown className="h-4 w-4" />}
              label="Energia poupada"
              value={`${diffKwh.toFixed(1)} kWh`}
              tone="green"
            />
            <Metric
              icon={<Leaf className="h-4 w-4" />}
              label="Dinheiro salvo"
              value={`R$ ${diffBRL.toFixed(2)}`}
              tone="green"
            />
          </div>
        </div>
      </div>

      <SectionTitle>{STRINGS.verdict.keepGoing}</SectionTitle>
      <div className="grid gap-3 sm:grid-cols-2">
        {pickRandom(STRINGS.tipsGreen, 2).map((t) => (
          <TipCard key={t.title} title={t.title} body={t.body} tone="green" />
        ))}
      </div>
    </div>
  );
}

function RedVerdict({ diffKwh, diffBRL }: { diffKwh: number; diffBRL: number }) {
  const projectedYear = diffBRL * 12;
  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 shadow-sm sm:p-8">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
          <AlertTriangle className="h-3.5 w-3.5" />
          Risco financeiro
        </div>
        <h2 className="mt-3 text-2xl font-bold text-red-900 sm:text-3xl">
          {STRINGS.verdict.redTitle}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-red-800 sm:text-base">
          {STRINGS.verdict.redBody(diffKwh, projectedYear)}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Metric
            icon={<TrendingUp className="h-4 w-4" />}
            label="Aumento de consumo"
            value={`+${diffKwh.toFixed(1)} kWh`}
            tone="red"
          />
          <Metric
            icon={<AlertTriangle className="h-4 w-4" />}
            label="Prejuízo / 12 meses"
            value={`R$ ${projectedYear.toFixed(2)}`}
            tone="amber"
          />
        </div>
      </div>

      <SectionTitle>{STRINGS.verdict.actionPlan}</SectionTitle>
      <Checklist tips={STRINGS.tipsRed} />
    </div>
  );
}

function Checklist({ tips }: { tips: { title: string; body: string }[] }) {
  const [done, setDone] = useState<Record<number, boolean>>({});
  return (
    <ul className="space-y-2">
      {tips.map((t, i) => {
        const checked = !!done[i];
        return (
          <li key={t.title}>
            <button
              onClick={() => setDone((d) => ({ ...d, [i]: !d[i] }))}
              className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition ${
                checked
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              {checked ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              ) : (
                <Circle className="mt-0.5 h-5 w-5 shrink-0 text-slate-300" />
              )}
              <div>
                <div
                  className={`text-sm font-semibold ${
                    checked ? "text-emerald-900 line-through" : "text-slate-900"
                  }`}
                >
                  {t.title}
                </div>
                <div className="mt-0.5 text-xs leading-relaxed text-slate-600">{t.body}</div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function Metric({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "green" | "red" | "amber";
}) {
  const tones: Record<typeof tone, string> = {
    green: "bg-white text-green-800",
    red: "bg-white text-red-800",
    amber: "bg-white text-amber-800",
  };
  return (
    <div className={`rounded-2xl p-3.5 ${tones[tone]} shadow-sm`}>
      <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider opacity-70">
        {icon} {label}
      </div>
      <div className="mt-1 text-lg font-bold">{value}</div>
    </div>
  );
}

function TipCard({ title, body }: { title: string; body: string; tone: "green" }) {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 shadow-sm">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-700">
        <Leaf className="h-4 w-4" />
      </div>
      <h4 className="mt-2 text-sm font-semibold text-slate-900">{title}</h4>
      <p className="mt-1 text-xs leading-relaxed text-slate-600">{body}</p>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-semibold text-slate-700">{children}</h3>;
}

function pickRandom<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  while (out.length < n && copy.length) {
    const i = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(i, 1)[0]);
  }
  return out;
}

function FallingLeaves() {
  // Decorative animation
  const leaves = Array.from({ length: 8 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {leaves.map((_, i) => (
        <Leaf
          key={i}
          className="absolute h-4 w-4 text-green-400/60"
          style={{
            left: `${(i * 13 + 5) % 100}%`,
            top: `-10px`,
            animation: `fall ${4 + (i % 3)}s linear ${i * 0.4}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(220px) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
