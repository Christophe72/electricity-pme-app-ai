import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Début du seeding...");

  // Supprime les données existantes (optionnel)
  await prisma.stockItem.deleteMany();
  await prisma.installation.deleteMany();

  console.log("🗑️  Données existantes supprimées");

  // Création d'installations exemples
  const installation1 = await prisma.installation.create({
    data: {
      nom: "Chantier Rue de la Paix",
      adresse: "15 Rue de la Paix, 75002 Paris",
      description: "Rénovation électrique complète",
    },
  });

  const installation2 = await prisma.installation.create({
    data: {
      nom: "Usine Leblanc",
      adresse: "Zone Industrielle, 69100 Villeurbanne",
      description: "Mise aux normes électriques",
    },
  });

  console.log("✅ Installations créées");

  // Création du stock de matériel électrique
  const materielElectrique = [
    // Câbles
    { nom: "Câble XVB 3G2.5", quantite: 200, seuil: 100 },
    { nom: "Câble XVB 3G1.5", quantite: 150, seuil: 80 },
    { nom: "Câble XVB 5G2.5", quantite: 80, seuil: 50 },
    { nom: "Câble XVB 3G4", quantite: 120, seuil: 60 },
    { nom: "Câble XVB 3G6", quantite: 90, seuil: 40 },
    { nom: "Câble RO2V 3G2.5", quantite: 110, seuil: 70 },
    { nom: "Câble H07V-U 1.5mm²", quantite: 300, seuil: 150 },
    { nom: "Câble H07V-U 2.5mm²", quantite: 250, seuil: 120 },

    // Disjoncteurs
    { nom: "Disjoncteur 10A", quantite: 45, seuil: 30 },
    { nom: "Disjoncteur 16A", quantite: 8, seuil: 20 },
    { nom: "Disjoncteur 20A", quantite: 38, seuil: 25 },
    { nom: "Disjoncteur 32A", quantite: 22, seuil: 15 },
    { nom: "Disjoncteur différentiel 30mA", quantite: 18, seuil: 12 },
    { nom: "Disjoncteur différentiel 40A", quantite: 14, seuil: 10 },

    // Prises et interrupteurs
    { nom: "Prise 2P+T", quantite: 45, seuil: 50 },
    { nom: "Prise 2P+T encastrée", quantite: 65, seuil: 40 },
    { nom: "Prise USB double", quantite: 30, seuil: 20 },
    { nom: "Interrupteur simple", quantite: 70, seuil: 40 },
    { nom: "Interrupteur va-et-vient", quantite: 55, seuil: 30 },
    { nom: "Variateur LED", quantite: 25, seuil: 15 },

    // Tableaux électriques
    { nom: "Tableau électrique 2 rangées", quantite: 12, seuil: 8 },
    { nom: "Tableau électrique 3 rangées", quantite: 8, seuil: 5 },
    { nom: "Tableau électrique 4 rangées", quantite: 5, seuil: 3 },

    // Gaines et conduits
    { nom: "Gaine ICTA Ø16mm", quantite: 180, seuil: 100 },
    { nom: "Gaine ICTA Ø20mm", quantite: 140, seuil: 80 },
    { nom: "Gaine ICTA Ø25mm", quantite: 95, seuil: 50 },
    { nom: "Conduit IRL Ø16mm", quantite: 120, seuil: 70 },
    { nom: "Conduit IRL Ø20mm", quantite: 85, seuil: 50 },

    // Boîtes de dérivation
    { nom: "Boîte de dérivation 80x80", quantite: 90, seuil: 60 },
    { nom: "Boîte de dérivation 100x100", quantite: 75, seuil: 50 },
    { nom: "Boîte d'encastrement simple", quantite: 110, seuil: 70 },
    { nom: "Boîte d'encastrement double", quantite: 65, seuil: 40 },

    // Luminaires
    { nom: "Spot LED encastrable", quantite: 42, seuil: 30 },
    { nom: "Réglette LED 120cm", quantite: 28, seuil: 20 },
    { nom: "Hublot LED extérieur", quantite: 15, seuil: 10 },
    { nom: "Ampoule LED E27 12W", quantite: 95, seuil: 50 },
    { nom: "Ampoule LED GU10 6W", quantite: 78, seuil: 40 },

    // Accessoires
    { nom: "Domino électrique 3 plots", quantite: 200, seuil: 100 },
    { nom: "Wago 2 entrées", quantite: 250, seuil: 150 },
    { nom: "Wago 3 entrées", quantite: 180, seuil: 100 },
    { nom: "Wago 5 entrées", quantite: 120, seuil: 70 },
    { nom: "Serre-câbles 100mm", quantite: 300, seuil: 150 },
    { nom: "Serre-câbles 200mm", quantite: 200, seuil: 100 },
    { nom: "Ruban isolant", quantite: 48, seuil: 30 },
    { nom: "Serre-fils", quantite: 85, seuil: 50 },

    // Matériel de protection
    { nom: "Parafoudre type 2", quantite: 10, seuil: 8 },
    { nom: "Télérupteur 16A", quantite: 18, seuil: 12 },
    { nom: "Contacteur jour/nuit 40A", quantite: 12, seuil: 8 },
    { nom: "Minuterie d'escalier", quantite: 15, seuil: 10 },
  ];

  for (const materiel of materielElectrique) {
    await prisma.stockItem.create({
      data: materiel,
    });
  }

  console.log(`✅ ${materielElectrique.length} articles créés dans le stock`);

  // Associe quelques articles à des installations
  await prisma.stockItem.updateMany({
    where: {
      nom: { in: ["Câble XVB 3G2.5", "Disjoncteur 16A", "Prise 2P+T"] },
    },
    data: {
      installationId: installation1.id,
    },
  });

  await prisma.stockItem.updateMany({
    where: {
      nom: {
        in: ["Tableau électrique 3 rangées", "Disjoncteur différentiel 30mA"],
      },
    },
    data: {
      installationId: installation2.id,
    },
  });

  console.log("✅ Articles associés aux installations");
  console.log("🎉 Seeding terminé avec succès !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur durant le seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
