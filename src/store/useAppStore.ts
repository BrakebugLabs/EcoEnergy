import { create } from "zustand";
import type { BillReading, AnalysisRecord } from "@/services/db";
import { analysisRepository } from "@/services/analysisRepository";

export type Screen = "welcome" | "capture" | "verdict" | "history";
export type CaptureStep = "previous" | "recent";

interface AppState {
  screen: Screen;
  step: CaptureStep;
  previous: BillReading | null;
  recent: BillReading | null;
  totalPoints: number;
  lastEarned: number;
  monthBalanceBRL: number;
  history: AnalysisRecord[];
  lastSaved: boolean;

  goWelcome: () => void;
  startAnalysis: () => void;
  openHistory: () => Promise<void>;
  setPrevious: (_b: BillReading) => void;
  setRecent: (_b: BillReading) => Promise<void>;
  editPrevious: () => void;
  editRecent: () => void;
  saveCurrentAnalysis: () => Promise<void>;
  deleteAnalysis: (id: number) => Promise<void>;
  clearHistory: () => Promise<void>;
  hydratePoints: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  screen: "welcome",
  step: "previous",
  previous: null,
  recent: null,
  totalPoints: 0,
  lastEarned: 0,
  monthBalanceBRL: 0,
  history: [],
  lastSaved: false,

  goWelcome: () =>
    set({
      screen: "welcome",
      step: "previous",
      previous: null,
      recent: null,
      lastEarned: 0,
      lastSaved: false,
    }),
  startAnalysis: () =>
    set({ screen: "capture", step: "previous", previous: null, recent: null, lastSaved: false }),
  openHistory: async () => {
    const list = await analysisRepository.listRecent(12);
    set({ screen: "history", history: list });
  },
  setPrevious: (b) => set({ previous: b, step: "recent" }),

  setRecent: async (b) => {
    const prev = get().previous;
    if (!prev) return;
    const diffKwh = b.kwh - prev.kwh;
    const diffBRL = b.valueBRL - prev.valueBRL;
    const saved = diffKwh <= 0;
    const earned = saved ? 150 : 0;

    set({
      recent: b,
      screen: "verdict",
      lastEarned: earned,
      monthBalanceBRL: diffBRL,
      lastSaved: false,
    });
  },

  editPrevious: () => set({ screen: "capture", step: "previous", lastSaved: false }),
  editRecent: () => set({ screen: "capture", step: "recent", lastSaved: false }),

  saveCurrentAnalysis: async () => {
    const { previous, recent, lastEarned, lastSaved } = get();
    if (!previous || !recent || lastSaved) return;
    const diffKwh = recent.kwh - previous.kwh;
    const diffBRL = recent.valueBRL - previous.valueBRL;
    await analysisRepository.save({
      createdAt: Date.now(),
      previous,
      recent,
      diffKwh,
      diffBRL,
      earnedPoints: lastEarned,
    });
    const total = await analysisRepository.totalPoints();
    const list = await analysisRepository.listRecent(12);
    set({ totalPoints: total, history: list, lastSaved: true });
  },

  deleteAnalysis: async (id) => {
    await analysisRepository.deleteOne(id);
    const total = await analysisRepository.totalPoints();
    const list = await analysisRepository.listRecent(12);
    set({ totalPoints: total, history: list });
  },

  clearHistory: async () => {
    await analysisRepository.clearAll();
    set({ totalPoints: 0, history: [], monthBalanceBRL: 0 });
  },

  hydratePoints: async () => {
    const total = await analysisRepository.totalPoints();
    const list = await analysisRepository.listRecent(12);
    const lastBalance = list[0]?.diffBRL ?? 0;
    set({ totalPoints: total, history: list, monthBalanceBRL: lastBalance });
  },
}));
