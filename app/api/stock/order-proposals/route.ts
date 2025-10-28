import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeThresholdProposals } from "@/lib/stock-proposal";

type InputItem = { stockItemId: number | string; quantity: number | string };

// GET /api/stock/order-proposals
export async function GET() {
  try {
    const proposals = await prisma.orderProposal.findMany({
      include: {
        items: {
          include: { stockItem: { include: { installation: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(proposals);
  } catch (error) {
    console.error("Erreur lors de la récupération des propositions:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des propositions" },
      { status: 500 }
    );
  }
}

// POST /api/stock/order-proposals
// Body:
//  - items?: { stockItemId: number; quantity: number }[]
//  - validate?: boolean (si true, statut VALIDATED et lignes APPROVED)
//  - notes?: string
//  - source?: string ("threshold" pour auto-génération)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { items, validate, notes, source } = body || {};

    let itemsToCreate: { stockItemId: number; proposedQty: number }[] = [];

    if (source === "threshold" || !Array.isArray(items) || items.length === 0) {
      const proposals = await computeThresholdProposals();
      itemsToCreate = proposals
        .filter((p) => p.aCommander > 0)
        .map((p) => ({ stockItemId: p.id, proposedQty: p.aCommander }));
    } else {
      const inputItems = items as InputItem[];
      itemsToCreate = inputItems
        .map((it) => ({
          stockItemId: Number(it.stockItemId),
          proposedQty: Number(it.quantity),
        }))
        .filter(
          (it) =>
            Number.isFinite(it.stockItemId) &&
            Number.isFinite(it.proposedQty) &&
            it.proposedQty > 0
        );
    }

    if (!itemsToCreate.length) {
      return NextResponse.json(
        {
          error:
            "Aucune ligne à enregistrer. Fournir des items ou utiliser source=threshold.",
        },
        { status: 400 }
      );
    }

    const proposal = await prisma.orderProposal.create({
      data: {
        status: validate ? "VALIDATED" : "DRAFT",
        source: source || (items ? "manual" : "threshold"),
        notes: notes || null,
        items: {
          create: itemsToCreate.map((it) => ({
            stockItemId: it.stockItemId,
            proposedQty: it.proposedQty,
            status: validate ? "APPROVED" : "PENDING",
            approvedQty: validate ? it.proposedQty : null,
          })),
        },
      },
      include: {
        items: { include: { stockItem: { include: { installation: true } } } },
      },
    });

    return NextResponse.json(proposal, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de la proposition:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la proposition" },
      { status: 500 }
    );
  }
}
