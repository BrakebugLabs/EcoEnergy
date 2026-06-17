import { Leaf, Star, TrendingDown, TrendingUp } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { STRINGS } from "@/config/strings";
import { InstallAppButton } from "./InstallAppButton";

export function TopBar() {
  const points = useAppStore((s) => s.totalPoints);
  const balance = useAppStore((s) => s.monthBalanceBRL);
  const goWelcome = useAppStore((s) => s.goWelcome);

  const saved = balance <= 0;
  const amount = Math.abs(balance);
  const hasBalance = amount > 0.001;

  return (
    <header className="sticky top-0 z-30 border-b border-emerald-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-4 py-3">
        <button
          onClick={goWelcome}
          className="flex items-center gap-2 text-emerald-700 transition-opacity hover:opacity-80"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100">
            <Leaf className="h-5 w-5" />
          </div>
          <span className="hidden text-sm font-semibold tracking-tight sm:inline sm:text-base">
            {STRINGS.appName}
          </span>
        </button>

        <div className="flex items-center gap-1.5">
          {hasBalance && (
            <div
              title={saved ? "Economia neste mês" : "Gasto a mais neste mês"}
              className={`flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-semibold ring-1 sm:text-sm ${
                saved
                  ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                  : "bg-red-50 text-red-700 ring-red-200"
              }`}
            >
              {saved ? (
                <TrendingDown className="h-3.5 w-3.5" />
              ) : (
                <TrendingUp className="h-3.5 w-3.5" />
              )}
              <span>
                {saved ? "−" : "+"}R$ {amount.toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-200 sm:text-sm">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span>{STRINGS.ecoPoints(points)}</span>
          </div>

          <InstallAppButton />
        </div>
      </div>
    </header>
  );
}
