import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{ id: string }>;
};

// GET /api/stock/order-proposals/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const proposal = await prisma.orderProposal.findUnique({
      where: { id: Number(id) },
      include: {
        items: { include: { stockItem: { include: { installation: true } } } },
      },
    });
    if (!proposal)
      return NextResponse.json(
        { error: "Proposition introuvable" },
        { status: 404 }
      );
    return NextResponse.json(proposal);
  } catch (error) {
    console.error("Erreur lors de la récupération de la proposition:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la proposition" },
      { status: 500 }
    );
  }
}

// PATCH /api/stock/order-proposals/[id]
// Body: { validate?: boolean, notes?: string, approvals?: { itemId: number, approvedQty: number }[] }
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { validate, notes, approvals } =
      body ||
      ({} as {
        validate?: boolean;
        notes?: string;
        approvals?: { itemId: number; approvedQty: number }[];
      });

    // Approuver des lignes spécifiques si fourni
    if (Array.isArray(approvals) && approvals.length > 0) {
      await Promise.all(
        approvals.map((a) =>
          prisma.proposalItem.update({
            where: { id: Number(a.itemId) },
            data: {
              approvedQty: Number(a.approvedQty),
              status: "APPROVED",
            },
          })
        )
      );
    }

    const updated = await prisma.orderProposal.update({
      where: { id: Number(id) },
      data: {
        status: validate ? "VALIDATED" : undefined,
        notes: notes ?? undefined,
      },
      include: {
        items: { include: { stockItem: { include: { installation: true } } } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la proposition:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la proposition" },
      { status: 500 }
    );
  }
}
