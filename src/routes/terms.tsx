import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Termos de Uso — EcoEnergy Score" },
      { name: "description", content: "Termos de uso do aplicativo EcoEnergy Score." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 text-slate-700">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-emerald-700 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-slate-900">Termos de Uso</h1>
      <p className="mt-2 text-sm text-slate-500">
        Última atualização: {new Date().toLocaleDateString("pt-BR")}
      </p>

      <section className="prose prose-slate mt-6 space-y-4 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold text-slate-900">1. Aceitação</h2>
        <p>
          Ao usar ou instalar o EcoEnergy Score, você concorda com estes Termos e com a nossa{" "}
          <Link to="/privacy" className="text-emerald-700 underline">
            Política de Privacidade
          </Link>
          .
        </p>

        <h2 className="text-lg font-semibold text-slate-900">2. Finalidade do app</h2>
        <p>
          O EcoEnergy Score é uma ferramenta educativa que compara duas faturas de energia elétrica
          para fornecer indicadores de economia ou desperdício. Os resultados são{" "}
          <strong>estimativas</strong>e não substituem a leitura oficial da concessionária.
        </p>

        <h2 className="text-lg font-semibold text-slate-900">3. OCR e leitura de fatura</h2>
        <p>
          A leitura automática por foto/PDF é simulada nesta versão. Você é responsável por conferir
          os valores inseridos antes de salvar.
        </p>

        <h2 className="text-lg font-semibold text-slate-900">4. EcoPoints</h2>
        <p>
          EcoPoints são uma pontuação simbólica de gamificação. Não possuem valor monetário, não
          podem ser trocados por dinheiro e podem ser zerados ao limpar o armazenamento do
          navegador.
        </p>

        <h2 className="text-lg font-semibold text-slate-900">5. Uso adequado</h2>
        <p>
          Você concorda em não utilizar o app para fins ilegais, nem realizar engenharia reversa ou
          tentar burlar o funcionamento da aplicação.
        </p>

        <h2 className="text-lg font-semibold text-slate-900">6. Limitação de responsabilidade</h2>
        <p>
          O EcoEnergy Score é fornecido "como está". Não nos responsabilizamos por decisões
          financeiras tomadas com base nas estimativas exibidas.
        </p>

        <h2 className="text-lg font-semibold text-slate-900">7. Alterações</h2>
        <p>Estes termos podem ser atualizados. Mudanças relevantes serão sinalizadas no app.</p>
      </section>
    </div>
  );
}
