import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Récupérer toutes les installations
export async function GET() {
  try {
    const installations = await prisma.installation.findMany({
      include: {
        stockItems: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(installations);
  } catch (error) {
    console.error("Erreur lors de la récupération des installations:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des installations" },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle installation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nom, adresse, description } = body;

    if (!nom || !adresse) {
      return NextResponse.json(
        { error: "Le nom et l'adresse sont requis" },
        { status: 400 }
      );
    }

    const installation = await prisma.installation.create({
      data: {
        nom,
        adresse,
        description: description || null,
      },
    });

    return NextResponse.json(installation, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de l'installation:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'installation" },
      { status: 500 }
    );
  }
}
