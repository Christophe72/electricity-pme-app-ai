import { prisma } from "@/lib/prisma";

export type ProposalCalcOptions = {
  op?: "lt" | "lte";
  mode?: "toSeuil" | "multiplier";
  multiplier?: number;
};

export async function computeThresholdProposals(
  options: ProposalCalcOptions = {}
) {
  const { op = "lte", mode = "toSeuil", multiplier = 2 } = options;

  const items = await prisma.stockItem.findMany({
    include: { installation: true },
    orderBy: { createdAt: "desc" },
  });

  const needsOrder = items.filter((it) =>
    op === "lt" ? it.quantite < it.seuil : it.quantite <= it.seuil
  );

  return needsOrder.map((it) => {
    const target =
      mode === "multiplier"
        ? Math.ceil(it.seuil * (multiplier || 2))
        : it.seuil;
    const aCommander = Math.max(0, target - it.quantite);
    return {
      stockItem: it,
      id: it.id,
      nom: it.nom,
      quantite: it.quantite,
      seuil: it.seuil,
      target,
      aCommander,
    };
  });
}
