import { useEffect } from "react";
import { Camera } from "lucide-react";
import type { BillReading } from "@/services/db";

// Simulates an OCR scan. Fills realistic fake values after 3s.
export function PhotoScanner({
  variant,
  onDone,
}: {
  variant: "previous" | "recent";
  onDone: (b: BillReading) => void;
}) {
  useEffect(() => {
    const t = setTimeout(() => {
      // Realistic values; recent biased slightly higher to make scenarios interesting
      if (variant === "previous") {
        onDone({ kwh: 150, valueBRL: 125.5 });
      } else {
        // 50/50 up or down
        const up = Math.random() < 0.5;
        onDone(up ? { kwh: 182, valueBRL: 154.8 } : { kwh: 132, valueBRL: 110.2 });
      }
    }, 3000);
    return () => clearTimeout(t);
  }, [variant, onDone]);

  return (
    <div className="relative mx-auto aspect-[3/4] w-full max-w-xs overflow-hidden rounded-2xl border-2 border-emerald-300 bg-slate-900 shadow-inner">
      {/* fake bill backdrop */}
      <div className="absolute inset-3 rounded-lg bg-slate-100/90 p-3 text-[10px] leading-relaxed text-slate-500">
        <div className="font-bold text-slate-700">FATURA DE ENERGIA</div>
        <div className="mt-1 h-px bg-slate-300" />
        <div className="mt-2 space-y-1">
          <div>Cliente: ••••••</div>
          <div>Período: 01/—— a 30/——</div>
          <div>Consumo: ••• kWh</div>
          <div>Vencimento: ——/——</div>
          <div className="mt-2 font-bold text-slate-800">TOTAL R$ ••,••</div>
        </div>
      </div>

      {/* Laser line */}
      <div className="laser-line absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_18px_4px_rgba(16,185,129,0.7)]" />

      {/* Corner brackets */}
      {[
        "top-2 left-2 border-t-2 border-l-2",
        "top-2 right-2 border-t-2 border-r-2",
        "bottom-2 left-2 border-b-2 border-l-2",
        "bottom-2 right-2 border-b-2 border-r-2",
      ].map((cls, i) => (
        <span key={i} className={`absolute h-5 w-5 rounded-sm border-emerald-300 ${cls}`} />
      ))}

      <div className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-1.5 text-[11px] font-medium text-emerald-200">
        <Camera className="h-3.5 w-3.5 animate-pulse" />
        Lendo dados…
      </div>

      <style>{`
        .laser-line {
          animation: laser 1.6s ease-in-out infinite;
        }
        @keyframes laser {
          0% { top: 8%; opacity: 0; }
          10% { opacity: 1; }
          50% { top: 92%; opacity: 1; }
          60% { opacity: 0; }
          100% { top: 8%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
