"use client";

import React, { useEffect, useState } from "react";
import DefaultLayout from "@/Components/Layout/DefaultLayout";
import Swal from "sweetalert2";
import { PlusIcon } from "lucide-react";
import { fetchWithAuth, postWithAuth } from "@/utils/api";
import withAuth from "@/utils/HOC/withAuth";

// Define interfaces
interface Agent {
  id: number;
  cin: string;
  prenom: string;
  nom: string;
  role: string;
}

interface FormValues {
  cin: string;
  agent: number;
  type_contrat: string;
  date_creation_contrat: string;
  duree_contrat: string;
}

interface Contrat {
  id: number;
  agent: Agent;
  type_contrat: string;
  date_creation_contrat: string;
  duree_contrat: number;
}

const AddContrat = () => {
  const [formValues, setFormValues] = useState<FormValues>({
    cin: '',
    agent: 0,
    type_contrat: '',
    date_creation_contrat: '',
    duree_contrat: '',
  });

  const [contrats, setContrats] = useState<Contrat[]>([]);

  const [agents, setAgents] = useState<Agent[]>([]);

  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');
  useEffect(() => {

    const fettchContracts = async () => {
      try {
        const response  = await fetchWithAuth('/api/contrats/');
        if (response && response.results) {
          setContrats(response.results);
        }
      } catch (error) {
        console.error("Failed to contracts", error);
      }
    }

    fettchContracts()

    const fetchAgents = async () => {
      try {
        const response = await fetchWithAuth('/api/agents/');
        // Check if the response is an object and has the 'results' property
        if (response ) {
          const agentsData = response.map((agent: any) => ({
            id: agent.id,
            cin: agent.cin,
            prenom: agent.prenom,
            nom: agent.nom,
            role: agent.role,
          }));
          setAgents(agentsData);
        } else {
          console.error("Invalid response format:", response);
        }
      } catch (error) {
        console.error("Failed to fetch agents", error);
      }
    };
  
    fetchAgents();
  }, []);
  

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prevState => ({
      ...prevState,
      [name]: value,
    }));

    if (name === 'cin') {
      const agent = agents.find(agent => agent.cin === value);
      if (agent) {
        setSelectedAgent(agent);
        setFormValues(prevState => ({
          ...prevState,
          agent: agent.id,
        }));
      } else {
        setSelectedAgent(null);
      }
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(e.target.value);
    setFormValues(prevState => ({
      ...prevState,
      cin: '',
    }));
    setSelectedAgent(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {

      const exist = contrats.some(contrat => contrat.agent.cin === formValues.cin);
      if (exist){
        Swal.fire({
          icon: 'error',
          title: 'Cet utilisateur a déjà un contrat.',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        return
      }
      

      console.log('Submitting form with values:', formValues);
      if (formValues.type_contrat === 'CDI'){
        setFormValues(prevState => ({
          ...prevState,
          duree_contrat: '0',
        }));
      }
      const response = await postWithAuth('/api/contrats/create/', formValues);
      console.log('Response:', response);

      setFormValues({
        cin: '',
        agent: 0,
        type_contrat: '',
        date_creation_contrat: '',
        duree_contrat: '',
      });
      setSelectedAgent(null);

      Swal.fire({
        icon: 'success',
        title: 'Contrat ajouté avec succès !',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error("Failed to add contract", error);
      Swal.fire({
        icon: 'error',
        title: 'Une erreur est survenue lors de l\'ajout du contrat.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  };

  const uniqueRoles = Array.from(new Set(agents.map(agent => agent.role)));
  const filteredAgents = selectedRole ? agents.filter(agent => agent.role === selectedRole) : agents;

  return (
    <DefaultLayout importexport={false}>
      <div className="flex items-center justify-center bg-gradient-to-br">
        <div className="w-full max-w-4xl p-10 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-center text-blue-800 mb-8">
            Ajouter Contrat
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="form-group">
                <label htmlFor="role" className="block text-gray-700">
                  Rôle
                </label>
                <select
                  className="mt-1 px-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12"
                  id="role"
                  name="role"
                  value={selectedRole}
                  onChange={handleRoleChange}
                >
                  <option value="" disabled>
                    -- Sélectionner un Rôle --
                  </option>
                  {uniqueRoles.map((role, index) => (
                    <option key={index} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="cin" className="block text-gray-700">
                  CIN
                </label>
                <select
                  className="mt-1 px-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12"
                  id="cin"
                  name="cin"
                  value={formValues.cin}
                  onChange={handleChange}
                  required
                >
                  <option value="">--Please choose an option--</option>
                  {filteredAgents.map((agent) => (
                    <option key={agent.cin} value={agent.cin}>
                      {agent.cin}
                    </option>
                  ))}
                </select>
              </div>
              {selectedAgent && (
                <>
                  <div className="form-group">
                    <label htmlFor="prenom" className="block text-gray-700">
                      Prénom
                    </label>
                    <input
                      type="text"
                      className="mt-1 px-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12"
                      id="prenom"
                      name="prenom"
                      value={selectedAgent.prenom}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="nom" className="block text-gray-700">
                      Nom
                    </label>
                    <input
                      type="text"
                      className="mt-1 px-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12"
                      id="nom"
                      name="nom"
                      value={selectedAgent.nom}
                      readOnly
                    />
                  </div>
                </>
              )}
              <div className="form-group">
                <label htmlFor="type_contrat" className="block text-gray-700">
                  Type de contrat
                </label>
                <select
                  className="mt-1 px-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12"
                  id="type_contrat"
                  name="type_contrat"
                  value={formValues.type_contrat}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    -- Sélectionner un Type de contrat --
                  </option>
                  <option value="ANAPEC">ANAPEC</option>
                  <option value="CDI">CDI</option>
                  <option value="CDD">CDD</option>
                </select>
              </div>
              <div className="form-group">
                <label
                  htmlFor="date_creation_contrat"
                  className="block text-gray-700"
                >
                  Date de création
                </label>
                <input
                  type="date"
                  className="mt-1 px-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12"
                  id="date_creation_contrat"
                  name="date_creation_contrat"
                  value={formValues.date_creation_contrat}
                  onChange={handleChange}
                  required
                />
              </div>

              {formValues.type_contrat !== "CDI" && (
                <div className="form-group">
                  <label
                    htmlFor="duree_contrat"
                    className="block text-gray-700"
                  >
                    Durée (mois)
                  </label>
                  <input
                    type="number"
                    className="mt-1 px-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12"
                    id="duree_contrat"
                    name="duree_contrat"
                    value={formValues.duree_contrat}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
            </div>
            <button
              type="submit"
              className="bg-graydark mt-6 w-full py-3 dark:bg-gray-100 shadow-md flex items-center justify-center px-6 rounded-md text-white bg-gray-600 hover:bg-gray-700"
            >
              <PlusIcon className="mr-2 h-5 w-5" />
              Ajouter
            </button>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default withAuth(AddContrat, ['RH']);
