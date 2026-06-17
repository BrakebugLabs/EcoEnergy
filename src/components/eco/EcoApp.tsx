import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { TopBar } from "./TopBar";
import { WelcomeScreen } from "./WelcomeScreen";
import { CaptureFlow } from "./CaptureFlow";
import { VerdictScreen } from "./VerdictScreen";
import { HistoryScreen } from "./HistoryScreen";
import { Footer } from "./Footer";

export function EcoApp() {
  const screen = useAppStore((s) => s.screen);
  const hydratePoints = useAppStore((s) => s.hydratePoints);

  useEffect(() => {
    hydratePoints();
  }, [hydratePoints]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 to-emerald-50/40">
      <TopBar />
      <main className="flex-1 pb-8">
        {screen === "welcome" && <WelcomeScreen />}
        {screen === "capture" && <CaptureFlow />}
        {screen === "verdict" && <VerdictScreen />}
        {screen === "history" && <HistoryScreen />}
      </main>
      <Footer />
    </div>
  );
}
