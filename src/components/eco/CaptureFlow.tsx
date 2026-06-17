import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pencil, Check, ChevronLeft, Loader2, Edit3 } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { STRINGS } from "@/config/strings";
import type { BillReading } from "@/services/db";

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
        <h3 className="text-sm text-slate-500">
          {isPrev ? STRINGS.steps.previousSubtitle : STRINGS.steps.recentSubtitle}
        </h3>

        {/* Removido o CaptureCard dinâmico para usar diretamente o formulário manual */}
        <ManualCaptureForm key={step} onSubmit={handleSubmit} defaults={defaults} />

        {!isPrev && previous && (
          <div className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
            <span className="font-semibold">Conta anterior registrada:</span> {previous.kwh} kWh · R$ {previous.valueBRL.toFixed(2)}
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

interface ManualCaptureFormProps {
  onSubmit: (b: BillReading) => void | Promise<void>;
  defaults?: BillReading | null;
}

function ManualCaptureForm({ onSubmit, defaults }: ManualCaptureFormProps) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit: rhfSubmit,
    formState: { errors },
  } = useForm<BillForm>({
    resolver: zodResolver(billSchema),
    defaultValues: defaults ? { kwh: defaults.kwh, valueBRL: defaults.valueBRL } : undefined,
  });

  const submit = async (data: BillForm) => {
    setSubmitting(true);
    // Transforma os dados do formulário validados pelo Zod no tipo BillReading esperado pela store
    await onSubmit({
      kwh: data.kwh,
      valueBRL: data.valueBRL,
    });
    setSubmitting(false);
  };

  return (
    <form onSubmit={rhfSubmit(submit)} className="mt-5 space-y-4">
      <div className="mb-4 flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
        <Pencil className="h-4 w-4 text-slate-400 shrink-0" />
        <span>Preencha os campos abaixo com as informações impressas na fatura de energia.</span>
      </div>

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