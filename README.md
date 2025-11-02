# ⚡ Electricity PME App AI

> Application Next.js pour la gestion de stock d'une société d'électricité, extraction PDF et assistant IA (OpenAI).

---

## 🚀 Fonctionnalités principales

- **Extraction de texte PDF** côté serveur (Node.js pur, sans dépendance DOM/canvas)
- **Assistant IA** pour répondre aux questions sur le contenu du PDF
- **Base de données Prisma** (SQLite) avec seed de matériel récurrent
- **Gestion des installations et du stock** (CRUD complet)
- **Pages interactives** : accueil, IA PDF, IA stock, gestion, module RGIE
- **Design responsive avec Tailwind CSS v4**

---

## 🛠️ Installation & Démarrage

1. **Installer les dépendances**

   ```bash
   npm install
   npm install pdfreader
   ```

2. **Configurer la base Prisma**

   ```bash
   npx prisma generate
   npx prisma db push
   npm run seed
   ```

3. **Placer votre PDF**

   - Placez le fichier à analyser dans `/public/certification.pdf`

4. **Lancer le serveur Next.js**

   ```bash
   npm run dev
   ```

5. **Accéder à l'application**
   - Page d'accueil : [http://localhost:3000](http://localhost:3000)
   - Assistant IA PDF : [http://localhost:3000/ai-pdf](http://localhost:3000/ai-pdf)
   - Assistant IA Stock : [http://localhost:3000/ai-stock](http://localhost:3000/ai-stock)
   - Gestion : [http://localhost:3000/gestion](http://localhost:3000/gestion)
   - Module RGIE : [http://localhost:3000/rgie](http://localhost:3000/rgie)

---

## 📄 Extraction PDF & IA

- **Librairie utilisée** : [`pdfreader`](https://www.npmjs.com/package/pdfreader) (Node.js only)
- **Fichier principal** : [`lib/pdf-helper.ts`](lib/pdf-helper.ts)
- **API** : `/api/ai/pdf`
  - Lit le PDF, extrait le texte, puis envoie le texte et la question à OpenAI pour obtenir une réponse.

### Exemple d'extraction

```typescript
export async function parsePDF(dataBuffer: Buffer): Promise<PDFData> {
  // ...voir le fichier pour l’implémentation complète
}
```

- Le parsing est asynchrone, le texte est concaténé page par page.
- Le nombre de pages est détecté automatiquement.

---

## 🤖 Assistant IA

- Utilise l'API OpenAI pour répondre aux questions sur le PDF ou le stock.
- Modèle utilisé : `gpt-4o-mini` (configurable)
- Les réponses sont contextualisées avec le texte extrait du PDF ou la base Prisma.

---

## 🧩 Structure du projet

- `app/ai-pdf/page.tsx` : Interface pour interroger l'IA sur le PDF
- `app/api/ai/pdf/route.ts` : Route API Next.js pour extraction PDF + IA
- `lib/pdf-helper.ts` : Extraction du texte PDF (Node.js only)
- `public/certification.pdf` : Fichier PDF à analyser
- `app/page.tsx` : Feuille d'accueil sobre et responsive
- `app/ai-stock/page.tsx` : Interface pour interroger l'IA sur le stock
- `app/gestion/page.tsx` : Interface CRUD pour installations et stock
- `app/api/ai/stock/route.ts` : Route API Next.js connectée à OpenAI et Prisma
- `app/api/installations/route.ts` : API CRUD installations
- `app/api/stock/route.ts` : API CRUD stock
- `app/rgie/page.tsx` & `app/rgie/quiz-module.tsx` : Module de quiz RGIE avec authentification intégrée
- `prisma/schema.prisma` : Modèles Installation et StockItem
- `prisma/seed.ts` : Script de seed avec matériel électrique récurrent
- `lib/prisma.ts` : Client Prisma pour Next.js

---

## 🧠 Module RGIE (Quiz)

- **Accès** : [http://localhost:3000/rgie](http://localhost:3000/rgie)
- **Objectif** : entraîner les équipes aux bonnes pratiques du RGIE avec un quiz interactif.
- **Connexion par défaut** :

  ```
  E-mail    : formation@electricity-pme.fr
  Mot de passe : rgie2025
  ```

- **Fonctionnalités** :
  - Authentification côté client avant l'accès au questionnaire.
  - 4 questions à choix multiples avec explications détaillées après validation.
  - Récapitulatif du score et rappels pédagogiques.

---

## 📦 Seed du stock

- Script `prisma/seed.ts` : +50 articles électriques courants, 2 installations exemples

---

## 📝 Fonctionnalités récentes

- Extraction PDF robuste (Node.js only)
- Correction des erreurs liées à DOMMatrix/canvas
- Assistant IA PDF et Stock
- Gestion visuelle du stock et des installations (CRUD)

---

## 📚 Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs/installation)
- [pdfreader](https://www.npmjs.com/package/pdfreader)
- [OpenAI](https://platform.openai.com/docs)

---

**Développé pour PME électricité — 2025**
