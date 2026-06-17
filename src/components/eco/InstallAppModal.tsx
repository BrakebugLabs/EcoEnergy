import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Download, X } from "lucide-react";
import { toast } from "sonner";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface Props {
  open: boolean;
  onClose: () => void;
  deferredPrompt: BeforeInstallPromptEvent | null;
  onInstalled: () => void;
}

export function InstallAppModal({ open, onClose, deferredPrompt, onInstalled }: Props) {
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  const handleInstall = async () => {
    if (!accepted) return;
    localStorage.setItem("eco:terms-accepted", new Date().toISOString());

    if (deferredPrompt) {
      setBusy(true);
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === "accepted") {
          toast.success("App instalado! Abra pelo ícone na sua tela inicial.");
          onInstalled();
        } else {
          toast.message("Instalação cancelada.");
        }
      } finally {
        setBusy(false);
        onClose();
      }
    } else {
      toast.message(
        "Para instalar: use o menu do seu navegador → 'Adicionar à tela inicial' / 'Instalar app'.",
        { duration: 6000 },
      );
      onInstalled();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-fade-in">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Instalar EcoEnergy</h2>
              <p className="text-xs text-slate-500">Acesse direto da sua tela inicial</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <ul className="mt-5 space-y-1.5 text-sm text-slate-600">
          <li>✅ Funciona como um app nativo</li>
          <li>✅ Ícone na tela inicial</li>
          <li>✅ Abre em tela cheia, sem barra do navegador</li>
        </ul>

        <label className="mt-5 flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-emerald-600"
          />
          <span>
            Li e concordo com a{" "}
            <Link to="/privacy" target="_blank" className="font-medium text-emerald-700 underline">
              Política de Privacidade
            </Link>{" "}
            e os{" "}
            <Link to="/terms" target="_blank" className="font-medium text-emerald-700 underline">
              Termos de Uso
            </Link>
            .
          </span>
        </label>

        <button
          onClick={handleInstall}
          disabled={!accepted || busy}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <Download className="h-4 w-4" />
          {busy ? "Aguardando…" : "Baixar App"}
        </button>
      </div>
    </div>
  );
}
