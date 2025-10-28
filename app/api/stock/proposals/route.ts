import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Contrat
// GET /api/stock/proposals?mode=toSeuil|multiplier&multiplier=number&op=lt|lte
// - mode:
//   - toSeuil (défaut): propose d'atteindre le seuil (aCommander = max(0, seuil - quantite))
//   - multiplier: propose d'atteindre seuil * multiplier (défaut multiplier=2)
// - op: lt (quantite < seuil) ou lte (quantite <= seuil). Défaut: lte.
// Réponse: [{ id, nom, quantite, seuil, installation, aCommander, target }]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = (searchParams.get("mode") || "toSeuil").toLowerCase();
    const op = (searchParams.get("op") || "lte").toLowerCase();
    const multiplierRaw = searchParams.get("multiplier");
    const multiplier = multiplierRaw ? Number(multiplierRaw) : 2;

    if (mode !== "toseuil" && mode !== "multiplier") {
      return NextResponse.json(
        {
          error:
            "Paramètre 'mode' invalide. Utilisez 'toSeuil' ou 'multiplier'.",
        },
        { status: 400 }
      );
    }
    if (op !== "lt" && op !== "lte") {
      return NextResponse.json(
        { error: "Paramètre 'op' invalide. Utilisez 'lt' ou 'lte'." },
        { status: 400 }
      );
    }
    if (
      mode === "multiplier" &&
      (!Number.isFinite(multiplier) || multiplier <= 0)
    ) {
      return NextResponse.json(
        { error: "'multiplier' doit être un nombre > 0." },
        { status: 400 }
      );
    }

    // Prisma ne prend pas en charge la comparaison champ-à-champ dans 'where',
    // on récupère puis on filtre côté application.
    const items = await prisma.stockItem.findMany({
      include: { installation: true },
      orderBy: { createdAt: "desc" },
    });

    const needsOrder = items.filter((it) =>
      op === "lt" ? it.quantite < it.seuil : it.quantite <= it.seuil
    );

    const proposals = needsOrder.map((it) => {
      const target =
        mode === "multiplier" ? Math.ceil(it.seuil * multiplier) : it.seuil;
      const aCommander = Math.max(0, target - it.quantite);
      return {
        id: it.id,
        nom: it.nom,
        quantite: it.quantite,
        seuil: it.seuil,
        installation: it.installation,
        target,
        aCommander,
      };
    });

    return NextResponse.json(proposals);
  } catch (error) {
    console.error("Erreur lors du calcul des propositions de commande:", error);
    return NextResponse.json(
      { error: "Erreur lors du calcul des propositions de commande" },
      { status: 500 }
    );
  }
}
