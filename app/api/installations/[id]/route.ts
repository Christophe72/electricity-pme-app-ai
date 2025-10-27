import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

// GET - Récupérer une installation par ID
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const installation = await prisma.installation.findUnique({
      where: { id: parseInt(id) },
      include: {
        stockItems: true,
      },
    });

    if (!installation) {
      return NextResponse.json(
        { error: "Installation non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(installation);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'installation:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'installation" },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une installation
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nom, adresse, description } = body;

    if (!nom || !adresse) {
      return NextResponse.json(
        { error: "Le nom et l'adresse sont requis" },
        { status: 400 }
      );
    }

    const installation = await prisma.installation.update({
      where: { id: parseInt(id) },
      data: {
        nom,
        adresse,
        description: description || null,
      },
    });

    return NextResponse.json(installation);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'installation:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'installation" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une installation
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    await prisma.installation.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Installation supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'installation:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'installation" },
      { status: 500 }
    );
  }
}
