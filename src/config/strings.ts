// Centralized strings for easy maintenance / future i18n
export const STRINGS = {
  appName: "EcoEnergy Score",
  tagline: "Descubra se você está economizando ou rasgando dinheiro na conta de luz em 2 minutos.",
  startAnalysis: "Iniciar Análise",
  continueAnalysis: "Continuar Análise",
  viewHistory: "Ver Histórico",
  ecoPoints: (n: number) => `${n} EcoPoints`,
  signupCta: "💾 Deseja salvar seu histórico na nuvem futuramente?",

  history: {
    title: "Seu histórico",
    subtitle: "Últimos 12 meses",
    saved: "Economizado",
    overspent: "Gasto a mais",
    net: "Saldo final",
    entries: "Análises recentes",
    emptyTitle: "Nenhuma análise ainda",
    emptyBody: "Faça sua primeira análise para começar a acompanhar sua economia.",
  },
  simulateSignup: "Simular Cadastro",
  signupSuccess:
    "Simulação de cadastro realizada! Pronto para integração com PostgreSQL no futuro.",

  steps: {
    previousTitle: "Insira os dados da sua CONTA ANTERIOR",
    previousSubtitle: "Mês Passado",
    recentTitle: "Insira os dados da sua CONTA RECENTE",
    recentSubtitle: "Mês Atual",
    photoBtn: "📸 Tirar Foto da Conta",
    uploadBtn: "📄 Enviar Conta Digital",
    uploadHint: "Envie um PDF ou imagem (JPG/PNG) da sua fatura",
    uploadChange: "Trocar arquivo",
    uploadSelectArea:
      "Ajuste o retângulo sobre a área que contém o consumo (kWh) e o valor total da conta.",
    uploadRead: "Ler informações",
    manualBtn: "Digitar manualmente",
    scanning: "Lendo dados da fatura com IA…",
    kwhLabel: "Consumo (kWh)",
    valueLabel: "Valor da fatura (R$)",
    confirm: "Confirmar e continuar",
  },

  verdict: {
    greenTitle: "Parabéns! Você está economizando.",
    greenBody: (kwh: number, brl: number) =>
      `Você consumiu ${kwh.toFixed(1)} kWh a menos que no mês passado. Isso salvou R$ ${brl.toFixed(2)} do seu bolso!`,
    reward: "+150 EcoPoints",
    redTitle: "⚠️ Alerta de Risco Financeiro Detectado!",
    redBody: (kwh: number, brl: number) =>
      `Seu consumo subiu ${kwh.toFixed(1)} kWh. Mantendo este ritmo, você vai DESPERDIÇAR R$ ${brl.toFixed(2)} nos próximos 12 meses (Prejuízo Projetado).`,
    actionPlan: "Plano de Ação",
    keepGoing: "Continue assim — dicas para manter o ritmo:",
    newAnalysis: "Fazer nova análise",
    backToHome: "Voltar ao Início",
    editData: "Editar dados",
    saveHistory: "Salvar histórico",
    savedHistory: "Histórico salvo",
  },

  tipsGreen: [
    {
      title: "Mantenha as lâmpadas LED",
      body: "LEDs consomem até 80% menos energia que incandescentes. Continue trocando as antigas.",
    },
    {
      title: "Aparelhos fora da tomada à noite",
      body: "Stand-by representa até 12% da conta. Desligar TV, micro-ondas e carregadores faz diferença.",
    },
    {
      title: "Use a luz natural durante o dia",
      body: "Abrir cortinas reduz a necessidade de luz artificial em ambientes de trabalho.",
    },
  ],

  tipsRed: [
    {
      title: "Chuveiro no modo Verão",
      body: "Trocar do modo Inverno para Verão economiza até 30% da energia do banho.",
    },
    {
      title: "Ar-condicionado em 23°C",
      body: "Cada grau abaixo aumenta o consumo em ~8%. Fixe em 23°C e use o modo eco.",
    },
    {
      title: "Geladeira longe do fogão e da parede",
      body: "Garanta 10cm de afastamento. Geladeira esquentada gasta até 15% a mais.",
    },
  ],
};
