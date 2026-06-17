import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — EcoEnergy Score" },
      {
        name: "description",
        content: "Como o EcoEnergy Score trata seus dados de consumo de energia.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 text-slate-700">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-emerald-700 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-slate-900">Política de Privacidade</h1>
      <p className="mt-2 text-sm text-slate-500">
        Última atualização: {new Date().toLocaleDateString("pt-BR")}
      </p>

      <section className="prose prose-slate mt-6 space-y-4 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold text-slate-900">1. Dados que coletamos</h2>
        <p>
          O EcoEnergy Score é uma aplicação local-first. Os dados de consumo (kWh) e valores (R$)
          que você insere ficam armazenados <strong>somente no seu navegador</strong>, via
          IndexedDB, e não são enviados para nossos servidores.
        </p>

        <h2 className="text-lg font-semibold text-slate-900">2. Cadastro simulado</h2>
        <p>
          O cadastro disponível no app é apenas uma simulação para fins demonstrativos. Nenhuma
          informação pessoal é transmitida ou armazenada externamente nesta versão.
        </p>

        <h2 className="text-lg font-semibold text-slate-900">3. Cookies e rastreamento</h2>
        <p>Não utilizamos cookies de rastreamento nem ferramentas de análise de terceiros.</p>

        <h2 className="text-lg font-semibold text-slate-900">4. Instalação como PWA</h2>
        <p>
          Ao instalar o EcoEnergy Score como aplicativo, o navegador armazena os arquivos da
          interface localmente. Você pode desinstalar a qualquer momento pelas configurações do
          dispositivo.
        </p>

        <h2 className="text-lg font-semibold text-slate-900">5. Seus direitos</h2>
        <p>
          Você pode apagar todos os dados a qualquer momento limpando o armazenamento do site nas
          configurações do navegador (LGPD, Art. 18).
        </p>

        <h2 className="text-lg font-semibold text-slate-900">6. Contato</h2>
        <p>Dúvidas podem ser direcionadas ao responsável pelo projeto via repositório oficial.</p>
      </section>
    </div>
  );
}
