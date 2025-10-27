import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Récupérer tous les articles de stock
export async function GET() {
  try {
    const stockItems = await prisma.stockItem.findMany({
      include: {
        installation: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(stockItems);
  } catch (error) {
    console.error("Erreur lors de la récupération des articles:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des articles" },
      { status: 500 }
    );
  }
}

// POST - Créer un nouvel article de stock
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nom, quantite, seuil, installationId } = body;

    if (!nom || quantite === undefined || seuil === undefined) {
      return NextResponse.json(
        { error: "Le nom, la quantité et le seuil sont requis" },
        { status: 400 }
      );
    }

    const stockItem = await prisma.stockItem.create({
      data: {
        nom,
        quantite: parseInt(quantite),
        seuil: parseInt(seuil),
        installationId: installationId ? parseInt(installationId) : null,
      },
      include: {
        installation: true,
      },
    });

    return NextResponse.json(stockItem, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de l'article:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'article" },
      { status: 500 }
    );
  }
}
