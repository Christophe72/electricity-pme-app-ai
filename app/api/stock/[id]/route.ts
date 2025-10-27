import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

// GET - Récupérer un article par ID
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const stockItem = await prisma.stockItem.findUnique({
      where: { id: parseInt(id) },
      include: {
        installation: true,
      },
    });

    if (!stockItem) {
      return NextResponse.json(
        { error: "Article non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(stockItem);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'article:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'article" },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un article
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nom, quantite, seuil, installationId } = body;

    if (!nom || quantite === undefined || seuil === undefined) {
      return NextResponse.json(
        { error: "Le nom, la quantité et le seuil sont requis" },
        { status: 400 }
      );
    }

    const stockItem = await prisma.stockItem.update({
      where: { id: parseInt(id) },
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

    return NextResponse.json(stockItem);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'article:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'article" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un article
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    await prisma.stockItem.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Article supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'article:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'article" },
      { status: 500 }
    );
  }
}
