"use client";

import React, { useState, useEffect } from "react";
import DefaultLayout from "../Layout/DefaultLayout";
import { PlusIcon } from "lucide-react";
import Swal from "sweetalert2";
import { postWithAuth, fetchWithAuth } from "@/utils/api";
import { Agent } from "@/interfaces/Agent";

interface Ligne {
  id: number;
  name: string;
  superviseur_nom: string;
  superviseur_prenom: string;
  superviseur: number;
}

interface Supervisor {
  id: number;
  agent: Agent;
  lignes: Ligne[];
}

function LigneForm() {
  const [formValues, setFormValues] = useState({
    name: "",
    supervisor: "",
  });
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState<Supervisor>();

  useEffect(() => {
    // Fetch supervisors from the database
    const fetchSupervisors = async () => {
      try {
        const response = await fetchWithAuth("api/all/supervisors/");
        setSupervisors(response);
      } catch (error) {
        console.error("Failed to fetch supervisors", error);
      }
    };

    fetchSupervisors();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "supervisor") {
      const supervisor = supervisors.find(
        (supervisor) => supervisor.id === parseInt(value)
      );
      setSelectedSupervisor(supervisor);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      name: formValues.name,
      superviseur: parseInt(formValues.supervisor),
    };

    try {
      await postWithAuth("api/lignes/create", payload);

      setFormValues({
        name: "",
        supervisor: "",
      });

      Swal.fire({
        icon: "success",
        title: "Ligne ajoutée avec succès !",
      });
    } catch (error) {
      console.error("Failed to add ligne", error);

      Swal.fire({
        icon: "error",
        title: "Une erreur est survenue lors de l'ajout de la ligne.",
      });
    }
  };

  return (
    <div className="flex items-center flex-col justify-center bg-gradient-to-br">
      <div className="w-full max-w-2xl p-10 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center text-blue-800 mb-8">
          Ajouter Ligne
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            <div className="form-group">
              <label htmlFor="name" className="block text-gray-700">
                Nom de la Ligne
              </label>
              <input
                type="text"
                className="mt-1 p-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12"
                id="name"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="supervisor" className="block text-gray-700">
                Superviseur
              </label>
              <select
                className="mt-1 p-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12"
                id="supervisor"
                name="supervisor"
                value={formValues.supervisor}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionner un superviseur</option>
                {supervisors.map((supervisor) => (
                  <option key={supervisor.id} value={supervisor.id}>
                    {supervisor.agent.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="bg-graydark mt-6 w-full py-3 shadow-md flex items-center justify-center px-6 rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
          >
            <PlusIcon /> Ajouter Ligne
          </button>
        </form>
      </div>
      {selectedSupervisor && selectedSupervisor.lignes.length > 0 && (
        <div className="w-full max-w-2xl p-10 bg-white shadow-lg rounded-lg mt-8">
          <h1 className="text-2xl font-bold text-center text-blue-800 mb-8">
            Lignes de {selectedSupervisor.agent.nom}
          </h1>
          <div className="flex flex-wrap justify-center gap-4">
            {selectedSupervisor.lignes.map((ligne) => (
              <div
                key={ligne.id}
                className="bg-gray-200 p-4 rounded-lg shadow-md w-full"
              >
                <h2 className="text-lg font-semibold">{ligne.name}</h2>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default LigneForm;
