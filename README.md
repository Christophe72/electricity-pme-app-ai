# ⚡ Electricity PME App

> Application Next.js pour la gestion de stock d'une société d'électricité, avec assistant IA et base de données Prisma.

---

## 🚀 Fonctionnalités principales

- **Page d'accueil moderne et sobre (cyan)**
- **Assistant IA** pour répondre aux questions sur le stock
- **Base de données Prisma** (SQLite) avec seed de matériel récurrent
- **Gestion des installations et du stock**
- **Seed automatique** : +50 articles électriques courants
- **Design responsive avec Tailwind CSS v4**

---

## 🛠️ Installation & Démarrage

1. **Installer les dépendances**

   ```bash
   npm install
   ```

2. **Configurer la base Prisma**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Peupler le stock avec du matériel courant**

   ```bash
   npm run seed
   ```

4. **Lancer le serveur Next.js**

   ```bash
   npm run dev
   ```

5. **Accéder à l'application**
   - Page d'accueil : [http://localhost:3000](http://localhost:3000)
   - Assistant IA : [http://localhost:3000/ai-stock](http://localhost:3000/ai-stock)

---

## 🧩 Structure du projet

- `app/page.tsx` : Feuille d'accueil sobre et responsive
- `app/ai-stock/page.tsx` : Interface pour interroger l'IA sur le stock
- `app/api/ai/stock/route.ts` : Route API Next.js connectée à OpenAI et Prisma
- `prisma/schema.prisma` : Modèles Installation et StockItem
- `prisma/seed.ts` : Script de seed avec matériel électrique récurrent
- `lib/prisma.ts` : Client Prisma pour Next.js

---

## 🤖 Assistant IA

L'assistant utilise l'API OpenAI pour répondre aux questions sur le stock en temps réel, en s'appuyant sur les données de la base SQLite.

Exemples de questions :

- "Quels articles sont sous le seuil ?"
- "Quels articles faut-il recommander ?"
- "Fais-moi un résumé du stock."

---

## 📦 Seed du stock

Le script `prisma/seed.ts` ajoute automatiquement plus de 50 articles courants pour une société d'électricité (câbles, disjoncteurs, prises, accessoires, etc.) et 2 installations exemples.

---

## 📝 À venir

- Gestion visuelle du stock
- Suivi des installations
- Statistiques avancées

---

## 📚 Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs/installation)

---

**Développé pour PME électricité — 2025**
