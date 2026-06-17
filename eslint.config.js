import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactHooks from "eslint-plugin-react-hooks";
import tanstackRouter from "@tanstack/eslint-plugin-router";
import globals from "globals"; // Nativo do ecossistema para resolver no-undef

export default [
  {
    ignores: [
      "**/dist/**",
      "**/.output/**",
      "**/public/sw.js",
      "**/src/routeTree.gen.ts",
      "**/src/components/archive/**",
      "eslint.config.js",
      "prettier.config.js",
      "vite.config.ts"
    ],
  },
  js.configs.recommended,
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
      // 🟢 RESOLVE TODOS OS ERROS NO-UNDEF: injeta escopos de forma oficial
      globals: {
        ...globals.browser, // Libera window, document, localStorage, navigator, etc.
        ...globals.node,    // Libera console, process, etc.
        React: "writable",  // Libera o uso implícito de JSX sem 'import React' obrigatório
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "react-hooks": reactHooks,
      "@tanstack/router": tanstackRouter,
    },
    rules: {
      // Configurações de tipagem e ambiente estável
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
      "no-shadow": "off",
      "@typescript-eslint/no-shadow": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@tanstack/router/create-route-property-order": "warn",
      
      // 🟢 TRATAMENTO DE VARIÁVEIS NÃO UTILIZADAS:
      // Tolera argumentos com prefixo '_' ou mapeamentos obrigatórios de bibliotecas (ctx, env, etc)
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { 
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_"
        }
      ]
    },
  },
];