"use client";

import { useEffect, useMemo, useState } from "react";

type Suggestion = {
  id: number;
  nom: string;
  quantite: number;
  seuil: number;
  target: number;
  aCommander: number;
  installation?: { id: number; nom: string } | null;
};

type CreatedProposal = {
  id: number;
  status: "DRAFT" | "VALIDATED" | "CANCELLED";
  items: Array<{
    id: number;
    proposedQty: number;
    approvedQty?: number | null;
    stockItem: { nom: string };
  }>;
};

export default function PropositionsPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState<"none" | "save" | "validate">(
    "none"
  );
  const [created, setCreated] = useState<CreatedProposal | null>(null);
  const totalLines = useMemo(
    () => suggestions.filter((s) => s.aCommander > 0).length,
    [suggestions]
  );

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch("/api/stock/proposals")
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data: Suggestion[]) => {
        if (!active) return;
        setSuggestions(data);
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const onCreate = async (validate: boolean) => {
    try {
      setCreating(validate ? "validate" : "save");
      const res = await fetch("/api/stock/order-proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "threshold", validate }),
      });
      if (!res.ok) throw new Error("Erreur de création");
      const json = await res.json();
      setCreated(json);
    } catch {
      // noop simple UI
    } finally {
      setCreating("none");
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Propositions de commande</h1>

      <section className="space-y-2">
        <h2 className="font-medium">Suggestions (seuil)</h2>
        {loading ? (
          <p className="text-sm text-gray-500">Chargement…</p>
        ) : totalLines === 0 ? (
          <p className="text-sm text-gray-500">Aucune ligne à commander.</p>
        ) : (
          <div className="overflow-auto rounded border border-gray-200 dark:border-gray-700">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left p-2">Article</th>
                  <th className="text-right p-2">Qté</th>
                  <th className="text-right p-2">Seuil</th>
                  <th className="text-right p-2">Cible</th>
                  <th className="text-right p-2">À commander</th>
                </tr>
              </thead>
              <tbody>
                {suggestions
                  .filter((s) => s.aCommander > 0)
                  .map((s) => (
                    <tr
                      key={s.id}
                      className="border-t border-gray-100 dark:border-gray-800"
                    >
                      <td className="p-2">{s.nom}</td>
                      <td className="p-2 text-right">{s.quantite}</td>
                      <td className="p-2 text-right">{s.seuil}</td>
                      <td className="p-2 text-right">{s.target}</td>
                      <td className="p-2 text-right font-medium">
                        {s.aCommander}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex gap-2">
          <button
            disabled={creating !== "none" || totalLines === 0}
            onClick={() => onCreate(false)}
            className="px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {creating === "save"
              ? "Enregistrement…"
              : "Enregistrer en proposition"}
          </button>
          <button
            disabled={creating !== "none" || totalLines === 0}
            onClick={() => onCreate(true)}
            className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            {creating === "validate" ? "Validation…" : "Enregistrer et valider"}
          </button>
        </div>
      </section>

      {created && (
        <section className="space-y-2">
          <h2 className="font-medium">Dernière proposition créée</h2>
          <div className="rounded border border-gray-200 dark:border-gray-700 p-3">
            <p className="text-sm">
              ID: <span className="font-mono">{created.id}</span> — Statut:{" "}
              <strong>{created.status}</strong>
            </p>
            <ul className="mt-2 list-disc pl-5 text-sm">
              {created.items.map((it) => (
                <li key={it.id}>
                  {it.stockItem.nom}: proposé {it.proposedQty}
                  {it.approvedQty ? `, approuvé ${it.approvedQty}` : ""}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
