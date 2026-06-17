import { useEffect, useState } from "react";
import { Lightbulb, AlertTriangle, Sun, Moon } from "lucide-react";

interface Tip {
  icon: React.ReactNode;
  title: string;
  body: string;
  tone: "peak" | "morning" | "afternoon" | "night";
}

function getTipForHour(hour: number): Tip {
  // Horário de pico residencial no Brasil: 18h-21h
  if (hour >= 18 && hour < 21) {
    return {
      tone: "peak",
      icon: <AlertTriangle className="h-4 w-4" />,
      title: "⚡ Horário de pico (18h–21h)",
      body: "Evite usar chuveiro elétrico, forno e máquina de lavar agora. A tarifa pode ser até 3× mais cara.",
    };
  }
  if (hour >= 5 && hour < 12) {
    return {
      tone: "morning",
      icon: <Sun className="h-4 w-4" />,
      title: "🌅 Bom dia! Aproveite a luz natural",
      body: "Abra as cortinas antes de acender lâmpadas. Tomar banho agora custa menos que à noite.",
    };
  }
  if (hour >= 12 && hour < 18) {
    return {
      tone: "afternoon",
      icon: <Lightbulb className="h-4 w-4" />,
      title: "☀️ Tarde: aproveite o sol",
      body: "Se tiver máquina de lavar ou louças, agora é o melhor horário — fora do pico e com energia mais barata.",
    };
  }
  // 21h - 5h
  return {
    tone: "night",
    icon: <Moon className="h-4 w-4" />,
    title: "🌙 Madrugada: stand-by drena energia",
    body: "Desligue TV, roteador (se possível) e carregadores da tomada. Stand-by pode somar 12% da sua conta.",
  };
}

const TONE_STYLES: Record<Tip["tone"], string> = {
  peak: "border-red-200 bg-red-50 text-red-900",
  morning: "border-amber-200 bg-amber-50 text-amber-900",
  afternoon: "border-emerald-200 bg-emerald-50 text-emerald-900",
  night: "border-indigo-200 bg-indigo-50 text-indigo-900",
};

export function EnergyTips() {
  const [tip, setTip] = useState<Tip | null>(null);

  useEffect(() => {
    const update = () => setTip(getTipForHour(new Date().getHours()));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  if (!tip) return null;

  return (
    <div className={`mt-6 rounded-2xl border p-4 ${TONE_STYLES[tip.tone]}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-white/60">
          {tip.icon}
        </div>
        <div>
          <h3 className="text-sm font-semibold">{tip.title}</h3>
          <p className="mt-1 text-xs leading-relaxed opacity-90">{tip.body}</p>
        </div>
      </div>
    </div>
  );
}
