import { createFileRoute } from "@tanstack/react-router";
import { EcoApp } from "@/components/eco/EcoApp";
import { Toaster } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EcoEnergy Score — Economize na conta de luz" },
      {
        name: "description",
        content:
          "Compare duas contas de luz em 2 minutos. Receba seu EcoScore, ganhe EcoPoints e descubra como economizar dinheiro.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <EcoApp />
      <Toaster position="top-center" richColors />
    </>
  );
}
