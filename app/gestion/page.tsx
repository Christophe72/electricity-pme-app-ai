"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Installation = {
  id: number;
  nom: string;
  adresse: string;
  description: string | null;
  stockItems?: StockItem[];
};

type StockItem = {
  id: number;
  nom: string;
  quantite: number;
  seuil: number;
  installationId: number | null;
  installation?: Installation;
};

type CommandSuggestion = {
  id: number;
  nom: string;
  quantite: number;
  seuil: number;
  target: number;
  aCommander: number;
  installation?: Installation | null;
};

type OrderProposalItem = {
  id: number;
  proposedQty: number;
  approvedQty: number | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  stockItem: {
    nom: string;
    installation?: Installation | null;
  };
};

type OrderProposalRecord = {
  id: number;
  status: "DRAFT" | "VALIDATED" | "CANCELLED";
  source?: string | null;
  notes?: string | null;
  createdAt: string;
  items: OrderProposalItem[];
};

type CommandMode = "toSeuil" | "multiplier";

const ORDER_STATUS_STYLES: Record<
  OrderProposalRecord["status"],
  string
> = {
  DRAFT:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-100",
  VALIDATED:
    "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200",
  CANCELLED:
    "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200",
};

export default function GestionPage() {
  const [activeTab, setActiveTab] = useState<
    "installations" | "stock" | "commandes"
  >("installations");
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [commandSuggestions, setCommandSuggestions] = useState<
    CommandSuggestion[]
  >([]);
  const [orderProposals, setOrderProposals] = useState<OrderProposalRecord[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [showInstallationForm, setShowInstallationForm] = useState(false);
  const [showStockForm, setShowStockForm] = useState(false);
  const [editingInstallation, setEditingInstallation] =
    useState<Installation | null>(null);
  const [editingStock, setEditingStock] = useState<StockItem | null>(null);
  const [creatingOrder, setCreatingOrder] = useState<
    "none" | "save" | "validate"
  >("none");
  const [orderError, setOrderError] = useState<string | null>(null);
  const [lastCreatedOrder, setLastCreatedOrder] =
    useState<OrderProposalRecord | null>(null);
  const [orderMode, setOrderMode] = useState<CommandMode>("toSeuil");
  const [orderMultiplier, setOrderMultiplier] = useState(2);
  const [manualQuantities, setManualQuantities] = useState<
    Record<number, number>
  >({});
  const suggestionsWithManual = commandSuggestions.map((suggestion) => {
    const manualQtyRaw =
      manualQuantities[suggestion.id] ?? suggestion.aCommander;
    const manualQty = Math.max(
      0,
      Number.isFinite(manualQtyRaw) ? Math.round(manualQtyRaw) : 0
    );
    return { ...suggestion, manualQty };
  });
  const actionableSuggestions = suggestionsWithManual.filter(
    (suggestion) => suggestion.manualQty > 0
  );
  const totalQuantityToOrder = actionableSuggestions.reduce(
    (total, suggestion) => total + suggestion.manualQty,
    0
  );

  // Formulaire Installation
  const [installationForm, setInstallationForm] = useState({
    nom: "",
    adresse: "",
    description: "",
  });

  // Formulaire Stock
  const [stockForm, setStockForm] = useState({
    nom: "",
    quantite: 0,
    seuil: 0,
    installationId: "",
  });

  // Charger les données
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, orderMode, orderMultiplier]);

  useEffect(() => {
    if (commandSuggestions.length === 0) {
      setManualQuantities((prev) => (Object.keys(prev).length ? {} : prev));
      return;
    }
    setManualQuantities((prev) => {
      const next: Record<number, number> = {};
      for (const item of commandSuggestions) {
        const prevValue = prev[item.id];
        next[item.id] =
          typeof prevValue === "number" && !Number.isNaN(prevValue)
            ? prevValue
            : item.aCommander;
      }

      const sameLength =
        Object.keys(next).length === Object.keys(prev).length;
      if (sameLength) {
        let identical = true;
        for (const item of commandSuggestions) {
          if (next[item.id] !== prev[item.id]) {
            identical = false;
            break;
          }
        }
        if (identical) {
          return prev;
        }
      }

      return next;
    });
  }, [commandSuggestions]);



  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === "installations") {
        const res = await fetch("/api/installations");
        const data = await res.json();
        setInstallations(data);
      } else if (activeTab === "stock") {
        const res = await fetch("/api/stock");
        const data = await res.json();
        setStockItems(data);
      } else {
        setOrderError(null);
        const params = new URLSearchParams({ mode: orderMode });
        if (orderMode === "multiplier") {
          const safeMultiplier = Number.isFinite(orderMultiplier)
            ? Math.max(1, orderMultiplier)
            : 2;
          params.set("multiplier", String(safeMultiplier));
        }

        const [suggestionsRes, ordersRes] = await Promise.all([
          fetch(`/api/stock/proposals?${params.toString()}`),
          fetch("/api/stock/order-proposals"),
        ]);

        if (!suggestionsRes.ok || !ordersRes.ok) {
          throw new Error("Impossible de charger les propositions de commandes");
        }

        const [suggestionsData, ordersData] = await Promise.all([
          suggestionsRes.json(),
          ordersRes.json(),
        ]);

        setCommandSuggestions(suggestionsData);
        setOrderProposals(ordersData);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des donn?es:", error);
      if (activeTab === "commandes") {
        setCommandSuggestions([]);
        setOrderProposals([]);
        setOrderError("Impossible de charger les propositions de commandes pour le moment.");
      }
    } finally {
      setLoading(false);
    }
  };
  // Gestion des installations
  const handleInstallationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingInstallation
        ? `/api/installations/${editingInstallation.id}`
        : "/api/installations";
      const method = editingInstallation ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(installationForm),
      });

      if (res.ok) {
        setInstallationForm({ nom: "", adresse: "", description: "" });
        setShowInstallationForm(false);
        setEditingInstallation(null);
        loadData();
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  const handleDeleteInstallation = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette installation ?"))
      return;

    try {
      const res = await fetch(`/api/installations/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        loadData();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const handleEditInstallation = (installation: Installation) => {
    setEditingInstallation(installation);
    setInstallationForm({
      nom: installation.nom,
      adresse: installation.adresse,
      description: installation.description || "",
    });
    setShowInstallationForm(true);
  };

  // Gestion du stock
  const handleStockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingStock ? `/api/stock/${editingStock.id}` : "/api/stock";
      const method = editingStock ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...stockForm,
          installationId: stockForm.installationId || null,
        }),
      });

      if (res.ok) {
        setStockForm({ nom: "", quantite: 0, seuil: 0, installationId: "" });
        setShowStockForm(false);
        setEditingStock(null);
        loadData();
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  const handleDeleteStock = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) return;

    try {
      const res = await fetch(`/api/stock/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        loadData();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const handleEditStock = (item: StockItem) => {
    setEditingStock(item);
    setStockForm({
      nom: item.nom,
      quantite: item.quantite,
      seuil: item.seuil,
      installationId: item.installationId?.toString() || "",
    });
    setShowStockForm(true);
  };

  const handleCreateOrder = async (validate: boolean) => {
    try {
      setOrderError(null);
      setCreatingOrder(validate ? "validate" : "save");
      const itemsPayload = commandSuggestions
        .map((item) => {
          const value =
            manualQuantities[item.id] ?? item.aCommander;
          const safeValue = Math.max(
            0,
            Number.isFinite(value) ? Math.round(value) : 0
          );
          return { stockItemId: item.id, quantity: safeValue };
        })
        .filter((item) => item.quantity > 0);

      if (!itemsPayload.length) {
        setOrderError(
          "Aucune quantité à commander. Ajustez les lignes avant de poursuivre."
        );
        setCreatingOrder("none");
        return;
      }

      const res = await fetch("/api/stock/order-proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "manual",
          validate,
          items: itemsPayload,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data?.error || "Impossible de créer la commande automatiquement."
        );
      }

      setLastCreatedOrder(data);
      await loadData();
    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error);
      setOrderError(
        error instanceof Error
          ? error.message
          : "Erreur lors de la création de la commande."
      );
    } finally {
      setCreatingOrder("none");
    }
  };

  // Charger les installations pour le sélecteur
  useEffect(() => {
    const loadInstallations = async () => {
      const res = await fetch("/api/installations");
      const data = await res.json();
      setInstallations(data);
    };
    if (activeTab === "stock") {
      loadInstallations();
    }
  }, [activeTab]);

  const formatDate = (value: string) =>
    new Date(value).toLocaleString("fr-BE", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const getOrderTotalQuantity = (order: OrderProposalRecord) =>
    order.items.reduce((sum, item) => sum + item.proposedQty, 0);

  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-cyan-600 hover:text-cyan-700 mb-4 inline-block"
          >
            ← Retour à l&apos;accueil
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
            Gestion des données
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Ajoutez, modifiez et supprimez vos installations et articles de
            stock
          </p>
        </div>

        {/* Onglets */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-6 border border-gray-200 dark:border-gray-700">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("installations")}
                className={`flex-1 py-4 px-6 font-medium transition-colors ${
                  activeTab === "installations"
                    ? "text-cyan-600 border-b-2 border-cyan-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                Installations
              </div>
              </button>
              <button
                onClick={() => setActiveTab("stock")}
                className={`flex-1 py-4 px-6 font-medium transition-colors ${
                  activeTab === "stock"
                    ? "text-cyan-600 border-b-2 border-cyan-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  Articles de stock
                </div>
              </button>
              <button
                onClick={() => setActiveTab("commandes")}
                className={`flex-1 py-4 px-6 font-medium transition-colors ${
                  activeTab === "commandes"
                    ? "text-cyan-600 border-b-2 border-cyan-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l1.5-8H5.4M7 13L5.4 5M7 13l-2 9m12-9 2 9m-14 0a1 1 0 102 0m10 0a1 1 0 102 0"
                    />
                  </svg>
                  Commandes
                </div>
              </button>
            </div>
          </div>

        {/* Contenu des onglets */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          {activeTab === "installations" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Installations
                </h2>
                <button
                  onClick={() => {
                    setShowInstallationForm(!showInstallationForm);
                    setEditingInstallation(null);
                    setInstallationForm({
                      nom: "",
                      adresse: "",
                      description: "",
                    });
                  }}
                  className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors"
                >
                  + Nouvelle installation
                </button>
              </div>

              {/* Formulaire Installation */}
              {showInstallationForm && (
                <form
                  onSubmit={handleInstallationSubmit}
                  className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                >
                  <h3 className="text-lg font-semibold mb-4">
                    {editingInstallation
                      ? "Modifier l'installation"
                      : "Nouvelle installation"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Nom *
                      </label>
                      <input
                        type="text"
                        required
                        value={installationForm.nom}
                        onChange={(e) =>
                          setInstallationForm({
                            ...installationForm,
                            nom: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Adresse *
                      </label>
                      <input
                        type="text"
                        required
                        value={installationForm.adresse}
                        onChange={(e) =>
                          setInstallationForm({
                            ...installationForm,
                            adresse: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Description
                      </label>
                      <textarea
                        value={installationForm.description}
                        onChange={(e) =>
                          setInstallationForm({
                            ...installationForm,
                            description: e.target.value,
                          })
                        }
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      type="submit"
                      className="bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-700 transition-colors"
                    >
                      {editingInstallation ? "Mettre à jour" : "Créer"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowInstallationForm(false);
                        setEditingInstallation(null);
                        setInstallationForm({
                          nom: "",
                          adresse: "",
                          description: "",
                        });
                      }}
                      className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              )}

              {/* Liste des installations */}
              {loading ? (
                <div className="text-center py-8">Chargement...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4">Nom</th>
                        <th className="text-left py-3 px-4">Adresse</th>
                        <th className="text-left py-3 px-4">Description</th>
                        <th className="text-right py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {installations.map((installation) => (
                        <tr
                          key={installation.id}
                          className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                        >
                          <td className="py-3 px-4 font-medium">
                            {installation.nom}
                          </td>
                          <td className="py-3 px-4">{installation.adresse}</td>
                          <td className="py-3 px-4">
                            {installation.description || "-"}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() =>
                                handleEditInstallation(installation)
                              }
                              className="text-blue-600 hover:text-blue-800 mr-3"
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteInstallation(installation.id)
                              }
                              className="text-red-600 hover:text-red-800"
                            >
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))}
                      {installations.length === 0 && (
                        <tr>
                          <td
                            colSpan={4}
                            className="text-center py-8 text-gray-500 dark:text-gray-400"
                          >
                            Aucune installation trouvée
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "stock" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Articles de stock
                </h2>
                <button
                  onClick={() => {
                    setShowStockForm(!showStockForm);
                    setEditingStock(null);
                    setStockForm({
                      nom: "",
                      quantite: 0,
                      seuil: 0,
                      installationId: "",
                    });
                  }}
                  className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors"
                >
                  + Nouvel article
                </button>
              </div>

              {/* Formulaire Stock */}
              {showStockForm && (
                <form
                  onSubmit={handleStockSubmit}
                  className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                >
                  <h3 className="text-lg font-semibold mb-4">
                    {editingStock ? "Modifier l'article" : "Nouvel article"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Nom *
                      </label>
                      <input
                        type="text"
                        required
                        value={stockForm.nom}
                        onChange={(e) =>
                          setStockForm({ ...stockForm, nom: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Quantité *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={stockForm.quantite}
                        onChange={(e) =>
                          setStockForm({
                            ...stockForm,
                            quantite: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Seuil d&apos;alerte *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={stockForm.seuil}
                        onChange={(e) =>
                          setStockForm({
                            ...stockForm,
                            seuil: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Installation (optionnel)
                      </label>
                      <select
                        value={stockForm.installationId}
                        onChange={(e) =>
                          setStockForm({
                            ...stockForm,
                            installationId: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      >
                        <option value="">Aucune</option>
                        {installations.map((installation) => (
                          <option key={installation.id} value={installation.id}>
                            {installation.nom}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      type="submit"
                      className="bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-700 transition-colors"
                    >
                      {editingStock ? "Mettre à jour" : "Créer"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowStockForm(false);
                        setEditingStock(null);
                        setStockForm({
                          nom: "",
                          quantite: 0,
                          seuil: 0,
                          installationId: "",
                        });
                      }}
                      className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              )}

              {/* Liste du stock */}
              {loading ? (
                <div className="text-center py-8">Chargement...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4">Nom</th>
                        <th className="text-left py-3 px-4">Quantité</th>
                        <th className="text-left py-3 px-4">Seuil</th>
                        <th className="text-left py-3 px-4">Installation</th>
                        <th className="text-left py-3 px-4">État</th>
                        <th className="text-right py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockItems.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                        >
                          <td className="py-3 px-4 font-medium">{item.nom}</td>
                          <td className="py-3 px-4">{item.quantite}</td>
                          <td className="py-3 px-4">{item.seuil}</td>
                          <td className="py-3 px-4">
                            {item.installation?.nom || "-"}
                          </td>
                          <td className="py-3 px-4">
                            {item.quantite <= item.seuil ? (
                              <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-sm">
                                Alerte
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-sm">
                                OK
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleEditStock(item)}
                              className="text-blue-600 hover:text-blue-800 mr-3"
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() => handleDeleteStock(item.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))}
                      {stockItems.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="text-center py-8 text-gray-500 dark:text-gray-400"
                          >
                            Aucun article trouvé
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          {activeTab === "commandes" && (
            <div className="space-y-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    Commandes automatiques
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Regroupez toutes les lignes sous le seuil pour préparer vos commandes en un clic.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleCreateOrder(false)}
                    disabled={
                      creatingOrder !== "none" || totalQuantityToOrder === 0
                    }
                    className={`px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium ${
                      creatingOrder === "save" || totalQuantityToOrder === 0
                        ? "opacity-60 cursor-not-allowed"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    {creatingOrder === "save"
                      ? "Enregistrement..."
                      : "Enregistrer en brouillon"}
                  </button>
                  <button
                    onClick={() => handleCreateOrder(true)}
                    disabled={
                      creatingOrder !== "none" || totalQuantityToOrder === 0
                    }
                    className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${
                      creatingOrder === "validate" || totalQuantityToOrder === 0
                        ? "bg-cyan-400 cursor-not-allowed"
                        : "bg-cyan-600 hover:bg-cyan-700"
                    }`}
                  >
                    {creatingOrder === "validate"
                      ? "Validation..."
                      : "Créer et valider"}
                  </button>
                </div>
              </div>

              {orderError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-950/40 dark:text-red-200">
                  {orderError}
                </div>
              )}

              <section className="space-y-3">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      Articles sous le seuil
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {actionableSuggestions.length} ligne(s) • {totalQuantityToOrder} pièce(s) à commander
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 lg:items-end">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setOrderMode("toSeuil")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                          orderMode === "toSeuil"
                            ? "bg-cyan-600 text-white border-cyan-600"
                            : "border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                        }`}
                      >
                        Atteindre le seuil
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderMode("multiplier")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                          orderMode === "multiplier"
                            ? "bg-cyan-600 text-white border-cyan-600"
                            : "border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                        }`}
                      >
                        Multiplier le seuil
                      </button>
                    </div>
                    {orderMode === "multiplier" && (
                      <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        Multiplicateur
                        <input
                          type="number"
                          min={1}
                          step={1}
                          value={orderMultiplier}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            setOrderMultiplier(
                              Number.isFinite(value) && value >= 1 ? value : 1
                            );
                          }}
                          className="w-20 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-right px-2 py-1 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        />
                      </label>
                    )}
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Source : inventaire du jour
                    </p>
                  </div>
                </div>
                {loading ? (
                  <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
                    Calcul des propositions...
                  </div>
                ) : actionableSuggestions.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    Tout est au-dessus du seuil pour le moment.
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                          <th className="p-3 text-left">Article</th>
                          <th className="p-3 text-left">Installation</th>
                          <th className="p-3 text-right">Qté</th>
                          <th className="p-3 text-right">Seuil</th>
                          <th className="p-3 text-right">Cible</th>
                          <th className="p-3 text-right">À commander (auto)</th>
                          <th className="p-3 text-right text-cyan-700 dark:text-cyan-300">
                            Qté retenue
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {suggestionsWithManual.map((item) => (
                          <tr
                            key={item.id}
                            className="border-t border-gray-100 dark:border-gray-800"
                          >
                            <td className="p-3 font-medium text-gray-800 dark:text-gray-100">
                              {item.nom}
                            </td>
                            <td className="p-3 text-gray-600 dark:text-gray-300">
                              {item.installation?.nom || "Stock principal"}
                            </td>
                            <td className="p-3 text-right">{item.quantite}</td>
                            <td className="p-3 text-right">{item.seuil}</td>
                            <td className="p-3 text-right">{item.target}</td>
                            <td className="p-3 text-right font-medium text-gray-700 dark:text-gray-200">
                              {item.aCommander}
                            </td>
                            <td className="p-3 text-right">
                              <input
                                type="number"
                                min={0}
                                value={manualQuantities[item.id] ?? item.aCommander}
                                onChange={(e) => {
                                  const value = Number(e.target.value);
                                  setManualQuantities((prev) => ({
                                    ...prev,
                                    [item.id]:
                                      Number.isFinite(value) && value >= 0 ? value : 0,
                                  }));
                                }}
                                className="w-24 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-right px-2 py-1 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Ajustez la colonne « Qté retenue » avant d&apos;enregistrer pour affiner la commande.
                </p>
              </section>

              {lastCreatedOrder && (
                <div className="rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900 dark:border-cyan-500/30 dark:bg-cyan-900/30 dark:text-cyan-100">
                  <p className="font-semibold">
                    Commande #{lastCreatedOrder.id} enregistrée ({lastCreatedOrder.status === "DRAFT" ? "brouillon" : "validée"}).
                  </p>
                  <p>
                    {lastCreatedOrder.items.length} ligne(s) •{" "}
                    {getOrderTotalQuantity(lastCreatedOrder)} pièce(s).
                  </p>
                </div>
              )}

              <section className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Historique des commandes
                </h3>
                {loading ? (
                  <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
                    Chargement de l&apos;historique...
                  </div>
                ) : orderProposals.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    Aucune commande enregistrée pour l&apos;instant.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orderProposals.map((order) => (
                      <div
                        key={order.id}
                        className="rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-100">
                              Commande #{order.id}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(order.createdAt)} • {order.items.length} ligne(s) •{" "}
                              {getOrderTotalQuantity(order)} pièce(s)
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              ORDER_STATUS_STYLES[order.status]
                            }`}
                          >
                            {order.status === "DRAFT"
                              ? "Brouillon"
                              : order.status === "VALIDATED"
                              ? "Validée"
                              : "Annulée"}
                          </span>
                        </div>
                        <ul className="mt-3 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                          {order.items.slice(0, 4).map((item) => (
                            <li key={item.id} className="flex items-center justify-between">
                              <span>
                                {item.stockItem.nom}
                                {item.stockItem.installation?.nom
                                  ? ` · ${item.stockItem.installation.nom}`
                                  : ""}
                              </span>
                              <span className="font-semibold">{item.proposedQty} u</span>
                            </li>
                          ))}
                          {order.items.length > 4 && (
                            <li className="text-gray-500 dark:text-gray-400">
                              + {order.items.length - 4} article(s) supplémentaire(s)
                            </li>
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
