"use client";

import React, { Key, useEffect, useState } from 'react';
import DefaultLayout from '@/Components/Layout/DefaultLayout';
import Swal from 'sweetalert2';
import { PlusIcon } from 'lucide-react';

const AddContrat = () => {
  const [formValues, setFormValues] = useState({
    cin: '',
    agent_id : 0,
    type_contrat: '',
    date_creation_contrat: '',
    duree_contrat: '',
  });

  const [agents, setAgents] = useState<Array<{
    id: number;
    cin: string;
    prenom: string;
    nom: string;
    role: string;
  }>>([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<{id : number, prenom: string; nom: string } | null>(null);
  const [agentId, setAgentId] = useState(0)

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/api/agents/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAgents(data.results);
      } catch (error) {
        console.error("Failed to fetch agents", error);
      }
    };

    fetchAgents();
  }, []);

  useEffect(() => {
    
  }, [formValues]); 
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prevState => ({
      ...prevState,
      [name]: value,
    }));
    
    if (name === 'cin') {
      const agent = agents.find(agent => agent.cin === value);

      if (agent) {
        setSelectedAgent({ id : agent.id , prenom: agent.prenom, nom: agent.nom });
        setFormValues(prevState => ({
            ...prevState,
            agent_id: agent.id,
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
    console.log(formValues)
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/api/contrats/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });
      console.log(response);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setFormValues({
        agent_id : 0,
        cin: '',
        type_contrat: '',
        date_creation_contrat: '',
        duree_contrat: '',
      });
      setSelectedAgent(null);

      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        iconColor: 'green',
        customClass: {
          popup: 'colored-toast',
        },
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      Toast.fire({
        icon: 'success',
        title: 'Contrat ajouté avec succès !'
      });
    } catch (error) {
      console.error("Failed to add Contrat", error);
      const errorMessage = "Une erreur est survenue lors de l'ajout du contrat.";

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        iconColor: "red",
        customClass: {
          popup: "colored-toast",
        },
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      Toast.fire({
        icon: "error",
        text: errorMessage,
      });
    }
  };

  const uniqueRoles = Array.from(new Set(agents.map(agent => agent.role)));
  const filteredAgents = selectedRole ? agents.filter(agent => agent.role === selectedRole) : agents;

  return (
    <DefaultLayout importexport={false}>
      <div className="flex items-center justify-center bg-gradient-to-br">
        <div className="w-full max-w-4xl p-10 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-center text-blue-800 mb-8">Ajouter Contrat</h1>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="form-group">
                <label htmlFor="role" className="block text-gray-700">Rôle</label>
                <select
                  className="mt-1 p-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12"
                  id="role"
                  name="role"
                  value={selectedRole}
                  onChange={handleRoleChange}
                >
                  <option value="" disabled>-- Sélectionner un Rôle --</option>
                  {uniqueRoles.map((role, index) => (
                    <option key={index} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="cin" className="block text-gray-700">CIN</label>
                <select
                  className="mt-1 p-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12"
                  id="cin"
                  name="cin"
                  value={formValues.cin}
                  onChange={handleChange}
                  required
                >
                  <option value="">--Please choose an option--</option>
                  {filteredAgents.map(agent => (
                    <option key={agent.cin} value={agent.cin}>
                      {agent.cin}
                    </option>
                  ))}
                </select>
              </div>
              {selectedAgent && (
                <>
                  <div className="form-group">
                    <label htmlFor="prenom" className="block text-gray-700">Prénom</label>
                    <input
                      type="text"
                      className="mt-1 p-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12"
                      id="prenom"
                      name="prenom"
                      value={selectedAgent.prenom}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="nom" className="block text-gray-700">Nom</label>
                    <input
                      type="text"
                      className="mt-1 p-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12"
                      id="nom"
                      name="nom"
                      value={selectedAgent.nom}
                      readOnly
                    />
                  </div>
                </>
              )}
              <div className="form-group">
                <label htmlFor="type_contrat" className="block text-gray-700">Type de contrat</label>
                <select
                  className="mt-1 p-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12"
                  id="type_contrat"
                  name="type_contrat"
                  value={formValues.type_contrat}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>-- Sélectionner un Type de contrat --</option>
                  <option value="ANAPEC">ANAPEC</option>
                  <option value="CDI">CDI</option>
                  <option value="CDD">CDD</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="date_creation_contrat" className="block text-gray-700">Date de création</label>
                <input
                  type="date"
                  className="mt-1 p-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12"
                  id="date_creation_contrat"
                  name="date_creation_contrat"
                  value={formValues.date_creation_contrat}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="duree_contrat" className="block text-gray-700">Durée (mois)</label>
                <input
                  type="number"
                  className="mt-1 p-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12"
                  id="duree_contrat"
                  name="duree_contrat"
                  value={formValues.duree_contrat}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <button type="submit" className="bg-graydark mt-6 w-full py-3 dark:bg-gray-100 shadow-md flex items-center justify-center px-6 rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:bg-gray-700">
              <PlusIcon /> Ajouter Contrat
            </button>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AddContrat;
