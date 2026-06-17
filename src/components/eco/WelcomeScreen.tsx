// import { useState } from "react";
import { Zap, Sparkles, TrendingDown, History } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { STRINGS } from "@/config/strings";
// import { SignupModal } from "./SignupModal";
import { EnergyTips } from "./EnergyTips";

export function WelcomeScreen() {
  const start = useAppStore((s) => s.startAnalysis);
  const openHistory = useAppStore((s) => s.openHistory);
  const history = useAppStore((s) => s.history);
  // const [showSignup, setShowSignup] = useState(false);

  const hasHistory = history.length > 0;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-12 animate-fade-in">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 p-6 text-white shadow-xl sm:p-10">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

        <div className="relative">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Análise inteligente em 2 minutos
          </div>
          <h1 className="mt-4 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
            {STRINGS.tagline}
          </h1>
          <p className="mt-3 text-sm text-emerald-50/90 sm:text-base">
            Compare duas faturas, ganhe EcoPoints e descubra exatamente onde o seu dinheiro está
            indo.
          </p>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <button
              onClick={start}
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-semibold text-emerald-700 shadow-lg transition hover:scale-[1.01] hover:shadow-xl active:scale-100"
            >
              <Zap className="h-4 w-4 fill-amber-400 text-amber-400" />
              {hasHistory ? STRINGS.continueAnalysis : STRINGS.startAnalysis}
            </button>
            <button
              onClick={openHistory}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              <History className="h-4 w-4" />
              {STRINGS.viewHistory}
            </button>
          </div>
        </div>
      </div>

      <EnergyTips />

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <FeatureCard
          icon={<Zap className="h-4 w-4" />}
          title="Leitura por foto"
          body="Simulação de OCR por IA preenche os dados pra você."
        />
        <FeatureCard
          icon={<TrendingDown className="h-4 w-4" />}
          title="Veredito imediato"
          body="Saiba se economizou ou se está perdendo dinheiro."
        />
        <FeatureCard
          icon={<Sparkles className="h-4 w-4" />}
          title="EcoPoints"
          body="Ganhe pontos a cada mês de economia comprovada."
        />
      </div>

      {/* <div className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-4 text-center">
        <p className="text-sm text-slate-600">{STRINGS.signupCta}</p>
        <button
          onClick={() => setShowSignup(true)}
          className="mt-1.5 text-sm font-semibold text-emerald-700 underline-offset-2 hover:underline"
        >
          {STRINGS.simulateSignup}
        </button>
      </div> */}

      {/* <SignupModal open={showSignup} onClose={() => setShowSignup(false)} /> */}
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
        {icon}
      </div>
      <h3 className="mt-2.5 text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">{body}</p>
    </div>
  );
}
