describe("EcoEnergy - Smoke Test", () => {
  beforeEach(() => {
    // Visita a rota raiz da aplicação antes de cada teste
    cy.visit("/");
  });

  it("Deve carregar a tela de boas-vindas com sucesso", () => {
    // Verifica se o título principal ou textos configurados na STRINGS aparecem na tela
    cy.get("body").should("be.visible");
    cy.contains("Análise inteligente").should("be.visible");
  });

  it("Deve navegar até o formulário manual ao clicar em Iniciar Análise", () => {
    // 1. Encontra e clica no botão de início
    // Usamos um seletor flexível baseado no texto do botão
    cy.contains("button", "Análise").click();
  });
});