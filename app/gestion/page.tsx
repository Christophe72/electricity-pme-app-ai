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

export default function GestionPage() {
  const [activeTab, setActiveTab] = useState<"installations" | "stock">(
    "installations"
  );
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInstallationForm, setShowInstallationForm] = useState(false);
  const [showStockForm, setShowStockForm] = useState(false);
  const [editingInstallation, setEditingInstallation] =
    useState<Installation | null>(null);
  const [editingStock, setEditingStock] = useState<StockItem | null>(null);

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
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === "installations") {
        const res = await fetch("/api/installations");
        const data = await res.json();
        setInstallations(data);
      } else {
        const res = await fetch("/api/stock");
        const data = await res.json();
        setStockItems(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
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

  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-cyan-600 hover:text-cyan-700 mb-4 inline-block"
          >
            ← Retour à l&apos;accueil
          </Link>
          <h1 className="text-4xl font-bold text-gray-800">
            Gestion des données
          </h1>
          <p className="text-gray-600 mt-2">
            Ajoutez, modifiez et supprimez vos installations et articles de
            stock
          </p>
        </div>

        {/* Onglets */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
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
          </div>
        </div>

        {/* Contenu des onglets */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {activeTab === "installations" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
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
                  className="mb-6 p-4 bg-gray-50 rounded-lg"
                >
                  <h3 className="text-lg font-semibold mb-4">
                    {editingInstallation
                      ? "Modifier l'installation"
                      : "Nouvelle installation"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
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
                      <tr className="border-b">
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
                          className="border-b hover:bg-gray-50"
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
                            className="text-center py-8 text-gray-500"
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
                <h2 className="text-2xl font-bold text-gray-800">
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
                  className="mb-6 p-4 bg-gray-50 rounded-lg"
                >
                  <h3 className="text-lg font-semibold mb-4">
                    {editingStock ? "Modifier l'article" : "Nouvel article"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom *
                      </label>
                      <input
                        type="text"
                        required
                        value={stockForm.nom}
                        onChange={(e) =>
                          setStockForm({ ...stockForm, nom: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
                            quantite: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
                            seuil: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
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
                      <tr className="border-b">
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
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{item.nom}</td>
                          <td className="py-3 px-4">{item.quantite}</td>
                          <td className="py-3 px-4">{item.seuil}</td>
                          <td className="py-3 px-4">
                            {item.installation?.nom || "-"}
                          </td>
                          <td className="py-3 px-4">
                            {item.quantite <= item.seuil ? (
                              <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm">
                                Alerte
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
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
                            className="text-center py-8 text-gray-500"
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
        </div>
      </div>
    </div>
  );
}
