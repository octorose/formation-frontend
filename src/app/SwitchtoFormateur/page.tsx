"use client";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchWithAuth, postWithAuth } from "@/utils/api";
import DefaultLayout from "@/Components/Layout/DefaultLayout";

interface Agent {
  id: number;
  prenom: string;
  nom: string;
  email: string;
}

interface Operator {
  id: number;
  agent: Agent;
  etat: string;
  ligne: number;
  poste: {
    id: number;
    name: string;
  };
}

interface Ligne {
  id: number;
  name: string;
  superviseur_nom: string;
  superviseur_prenom: string;
  superviseur: number;
}

interface LigneApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Ligne[];
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Operator[];
}

const SwitchToFormateur: React.FC = () => {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [lignes, setLignes] = useState<Ligne[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<string>("");
  const [formateurType, setFormateurType] = useState<string>("Theorique");
  const [isAffecteur, setIsAffecteur] = useState<boolean>(false);
  const [selectedLignes, setSelectedLignes] = useState<string[]>([]);

  useEffect(() => {
    fetchOperators();
    fetchLignes();
  }, []);

  const fetchOperators = async () => {
    try {
      const response: ApiResponse = await fetchWithAuth("api/operators");
      setOperators(response.results);
    } catch (error) {
      console.error("Erreur lors de la récupération des opérateurs:", error);
      toast.error("Échec de la récupération des opérateurs");
    }
  };

  const fetchLignes = async () => {
    try {
      const response: LigneApiResponse = await fetchWithAuth("api/lignes");
      setLignes(response.results);
    } catch (error) {
      console.error("Erreur lors de la récupération des lignes:", error);
      toast.error("Échec de la récupération des lignes");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedOperator) {
      toast.warn("Veuillez sélectionner un opérateur");
      return;
    }

    try {
      await postWithAuth("api/switch-to-formateur/", {
        operatorId: selectedOperator,
        formateurType,
        isAffecteur,
        lignes: selectedLignes,
      });
      toast.success("L'opérateur a été changé en formateur avec succès");
      resetForm();
      fetchOperators(); // Actualiser la liste
    } catch (error) {
      console.error(
        "Erreur lors du changement de l'opérateur en formateur:",
        error
      );
      toast.error("Échec du changement de l'opérateur en formateur");
    }
  };

  const resetForm = () => {
    setSelectedOperator("");
    setFormateurType("Theorique");
    setIsAffecteur(false);
    setSelectedLignes([]);
  };

  return (
    <DefaultLayout>
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600">
          <h1 className="text-2xl font-bold text-white">
            Changer un Opérateur en Formateur
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="operator"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Sélectionner un Opérateur
            </label>
            <select
              id="operator"
              value={selectedOperator}
              onChange={(e) => setSelectedOperator(e.target.value)}
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Sélectionner un opérateur</option>
              {operators.map((operator) => (
                <option key={operator.id} value={operator.id}>
                  {operator.agent.prenom} {operator.agent.nom} -{" "}
                  {operator.agent.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="formateurType"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Type de Formateur
            </label>
            <select
              id="formateurType"
              value={formateurType}
              onChange={(e) => setFormateurType(e.target.value)}
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="Theorique">Théorique</option>
              <option value="Pratique">Pratique</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAffecteur"
              checked={isAffecteur}
              onChange={(e) => setIsAffecteur(e.target.checked)}
              className="mr-2"
            />
            <label
              htmlFor="isAffecteur"
              className="text-sm font-medium text-gray-700"
            >
              Est Affecteur
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sélectionner les Lignes
            </label>
            <div className="space-y-2">
              {lignes.map((ligne) => (
                <div key={ligne.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`ligne-${ligne.id}`}
                    value={ligne.id}
                    checked={selectedLignes.includes(ligne.id.toString())}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedLignes([
                          ...selectedLignes,
                          ligne.id.toString(),
                        ]);
                      } else {
                        setSelectedLignes(
                          selectedLignes.filter(
                            (id) => id !== ligne.id.toString()
                          )
                        );
                      }
                    }}
                    className="mr-2"
                  />
                  <label
                    htmlFor={`ligne-${ligne.id}`}
                    className="text-sm text-gray-700"
                  >
                    {ligne.name} - Superviseur: {ligne.superviseur_prenom}{" "}
                    {ligne.superviseur_nom}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Changer en Formateur
          </button>
        </form>
      </div>
      <ToastContainer />
    </DefaultLayout>
  );
};

export default SwitchToFormateur;