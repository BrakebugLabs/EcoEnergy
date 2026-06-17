import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mx-auto mt-10 max-w-3xl border-t border-emerald-100 px-4 py-6 text-center text-xs text-slate-500">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <Link to="/privacy" className="hover:text-emerald-700 hover:underline">
          Política de Privacidade
        </Link>
        <span aria-hidden>•</span>
        <Link to="/terms" className="hover:text-emerald-700 hover:underline">
          Termos de Uso
        </Link>
      </div>
      <p className="mt-2">© {new Date().getFullYear()} EcoEnergy Score</p>
    </footer>
  );
}
