import { createStart, createMiddleware } from "@tanstack/react-start";
import { getRouter } from "./router"; // 🟢 IMPORTANTE: Ajuste o caminho se o seu arquivo router estiver em outro local
import { renderErrorPage } from "./lib/error-page";

// 1. Instancia o roteador central da aplicação
const router = getRouter();

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// 2. Vincula o roteador ao inicializador do TanStack
// 🟢 CORRIGIDO: O framework precisa receber o objeto 'router' para processar a árvore de páginas
export const startInstance = createStart(() => ({
  router,
  requestMiddleware: [errorMiddleware],
}));