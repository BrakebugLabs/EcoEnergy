import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Camera, Pencil, Check, ChevronLeft, Loader2, Upload, Edit3 } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { STRINGS } from "@/config/strings";
import type { BillReading } from "@/services/db";
import { PhotoScanner } from "./PhotoScanner";
import { BillUploader } from "./BillUploader";

const billSchema = z.object({
  kwh: z.coerce.number().positive("Informe um valor maior que 0").max(10000),
  valueBRL: z.coerce.number().positive("Informe um valor maior que 0").max(100000),
});

type BillForm = z.infer<typeof billSchema>;

export function CaptureFlow() {
  const step = useAppStore((s) => s.step);
  const setPrevious = useAppStore((s) => s.setPrevious);
  const setRecent = useAppStore((s) => s.setRecent);
  const goWelcome = useAppStore((s) => s.goWelcome);
  const editPrevious = useAppStore((s) => s.editPrevious);
  const previous = useAppStore((s) => s.previous);
  const recent = useAppStore((s) => s.recent);

  const isPrev = step === "previous";
  const defaults = isPrev ? previous : recent;

  const handleSubmit = async (b: BillReading) => {
    if (isPrev) setPrevious(b);
    else await setRecent(b);
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 animate-fade-in">
      <button
        onClick={goWelcome}
        className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800"
      >
        <ChevronLeft className="h-4 w-4" /> Voltar
      </button>

      <Stepper step={step} />

      <div className="mt-5 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-1 flex items-center justify-between gap-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Etapa {isPrev ? "A" : "B"} de 2
          </div>
          {!isPrev && previous && (
            <button
              onClick={editPrevious}
              className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
              aria-label="Editar conta anterior"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Editar conta anterior
            </button>
          )}
        </div>
        <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
          {isPrev ? STRINGS.steps.previousTitle : STRINGS.steps.recentTitle}
        </h2>
        <p className="text-sm text-slate-500">
          {isPrev ? STRINGS.steps.previousSubtitle : STRINGS.steps.recentSubtitle}
        </p>

        <CaptureCard key={step} onSubmit={handleSubmit} variant={step} defaults={defaults} />

        {!isPrev && previous && (
          <div className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
            <span className="font-semibold">Conta anterior registrada:</span> {previous.kwh} kWh ·
            R$ {previous.valueBRL.toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
}

function Stepper({ step }: { step: "previous" | "recent" }) {
  return (
    <div className="flex items-center gap-2">
      <Dot active label="Anterior" done={step === "recent"} />
      <div className="h-px flex-1 bg-slate-200" />
      <Dot active={step === "recent"} label="Recente" />
    </div>
  );
}

function Dot({ active, done, label }: { active?: boolean; done?: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold transition ${
          done
            ? "bg-emerald-600 text-white"
            : active
              ? "bg-emerald-100 text-emerald-700 ring-2 ring-emerald-400"
              : "bg-slate-100 text-slate-400"
        }`}
      >
        {done ? <Check className="h-3.5 w-3.5" /> : label[0]}
      </div>
      <span
        className={`text-xs font-medium ${active || done ? "text-slate-800" : "text-slate-400"}`}
      >
        {label}
      </span>
    </div>
  );
}

type Mode = "choose" | "photo" | "upload" | "manual";

function CaptureCard({
  variant,
  onSubmit,
  defaults,
}: {
  variant: "previous" | "recent";
  onSubmit: (b: BillReading) => void | Promise<void>;
  defaults?: BillReading | null;
}) {
  const [mode, setMode] = useState<Mode>(defaults ? "manual" : "choose");
  const [scanned, setScanned] = useState<BillReading | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit: rhfSubmit,
    formState: { errors },
  } = useForm<BillForm>({
    resolver: zodResolver(billSchema),
    defaultValues: defaults ? { kwh: defaults.kwh, valueBRL: defaults.valueBRL } : undefined,
  });

  const submit = async (b: BillReading) => {
    setSubmitting(true);
    await onSubmit(b);
    setSubmitting(false);
  };

  if (mode === "choose") {
    return (
      <div className="mt-5 space-y-3">
        <button
          onClick={() => setMode("photo")}
          className="group flex w-full items-center gap-3 rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 p-4 text-left transition hover:border-emerald-400 hover:bg-emerald-50"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <Camera className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-slate-900">{STRINGS.steps.photoBtn}</div>
            <div className="text-xs text-slate-500">Leitura automática via IA (simulação)</div>
          </div>
        </button>

        <button
          onClick={() => setMode("upload")}
          className="flex w-full items-center gap-3 rounded-2xl border border-emerald-200 bg-white p-4 text-left transition hover:border-emerald-400 hover:bg-emerald-50/60"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <Upload className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-slate-900">{STRINGS.steps.uploadBtn}</div>
            <div className="text-xs text-slate-500">
              Recorte a área com os dados e leia automaticamente
            </div>
          </div>
        </button>

        <button
          onClick={() => setMode("manual")}
          className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:bg-slate-50"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <Pencil className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-slate-900">{STRINGS.steps.manualBtn}</div>
            <div className="text-xs text-slate-500">Insira os valores diretamente</div>
          </div>
        </button>
      </div>
    );
  }

  if (mode === "photo") {
    return (
      <div className="mt-5">
        {!scanned ? (
          <>
            <PhotoScanner variant={variant} onDone={setScanned} />
            <p className="mt-3 text-center text-xs text-slate-500">{STRINGS.steps.scanning}</p>
          </>
        ) : (
          <div className="animate-fade-in">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Dados detectados
              </div>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <Stat label="Consumo" value={`${scanned.kwh} kWh`} />
                <Stat label="Valor" value={`R$ ${scanned.valueBRL.toFixed(2)}`} />
              </div>
            </div>
            <button
              disabled={submitting}
              onClick={() => submit(scanned)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {STRINGS.steps.confirm}
            </button>
            <button
              onClick={() => {
                setScanned(null);
              }}
              className="mt-2 w-full text-center text-xs text-slate-500 hover:text-slate-800"
            >
              Escanear novamente
            </button>
          </div>
        )}
      </div>
    );
  }

  if (mode === "upload") {
    return (
      <div className="mt-5">
        {!scanned ? (
          <BillUploader variant={variant} onDone={setScanned} />
        ) : (
          <div className="animate-fade-in">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Dados detectados
              </div>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <Stat label="Consumo" value={`${scanned.kwh} kWh`} />
                <Stat label="Valor" value={`R$ ${scanned.valueBRL.toFixed(2)}`} />
              </div>
            </div>
            <button
              disabled={submitting}
              onClick={() => submit(scanned)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {STRINGS.steps.confirm}
            </button>
            <button
              onClick={() => setScanned(null)}
              className="mt-2 w-full text-center text-xs text-slate-500 hover:text-slate-800"
            >
              Selecionar outra área
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={rhfSubmit(submit)} className="mt-5 space-y-3">
      <Field label={STRINGS.steps.kwhLabel} error={errors.kwh?.message}>
        <input
          type="number"
          step="0.01"
          inputMode="decimal"
          {...register("kwh")}
          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          placeholder="Ex.: 150"
        />
      </Field>
      <Field label={STRINGS.steps.valueLabel} error={errors.valueBRL?.message}>
        <input
          type="number"
          step="0.01"
          inputMode="decimal"
          {...register("valueBRL")}
          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          placeholder="Ex.: 125.50"
        />
      </Field>
      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {STRINGS.steps.confirm}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-700">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white p-3">
      <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-0.5 text-sm font-bold text-slate-900">{value}</div>
    </div>
  );
}
