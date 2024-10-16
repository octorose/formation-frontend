"use client"

import React, { use, useEffect } from 'react'
import DefaultLayout from '../Layout/DefaultLayout';
import { PlusIcon } from 'lucide-react';
import Swal from 'sweetalert2';
import { fetchWithAuth, postWithAuth } from '@/utils/api';
import { calculateAge } from '@/utils/calculateAge';
import { validateCINLength } from '@/utils/cinValidation';
import { validatePhoneNumber } from '@/utils/phoneValidation';
import { group } from 'console';

function PersonnelForm() {
  const [groups, setGroups] = React.useState([]);
  useEffect(() => {
    fetchGroups();
  }
  , []);
    const [formValues, setFormValues] = React.useState({
      nom: "",
      username: "",
      prenom: "",
      email: "",
      password: "",
      cin: "",
      addresse: "",
      numerotel: "",
      date_naissance: "",
      group_id: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormValues((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      e.preventDefault();

      const age = calculateAge(formValues.date_naissance);
      if (age < 20) {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "L'âge du responsable doit être supérieur ou égal à 20 ans.",
        });
        return;
      }

      if (!validateCINLength(formValues.cin)) {
        return;
      }
     // phone validation
      if (!validatePhoneNumber(formValues.numerotel)) {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Le numéro de téléphone doit commencer par 0 et contenir 10 chiffres.",
        });
        return;
      }

      try {
        await postWithAuth("api/create_personnel/", {
          agent: {
            username: formValues.username,
            email: formValues.email,
            password: formValues.password,
            prenom: formValues.prenom,
            nom: formValues.nom,
            date_naissance: formValues.date_naissance,
            addresse: formValues.addresse,
            cin: formValues.cin,
            numerotel: formValues.numerotel,
            role: "Personnel",
          },
          poste:null,
          group_id: formValues.group_id,
          etat: "Candidat",
        });
        
        setFormValues({
          nom: "",
          username: "",
          prenom: "",
          email: "",
          password: "",
          cin: "",
          addresse: "",
          numerotel: "",
          date_naissance: "",
          // poste:null,
          group_id: "",
        });

        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          iconColor: "green",
          customClass: {
            popup: "colored-toast",
          },
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });

        Toast.fire({
          icon: "success",
          title: "Personnel ajouté avec succès !",
        });
      } catch (error) {
        console.error("Failed to add personnel", error);

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
          title: "Une erreur est survenue lors de l'ajout du personnel.",
        });
      }
    };
    const fetchGroups = async () => {
      try {
        const res = await fetchWithAuth("api/groups/");
    
      
        
        setGroups(res);
      } catch (error) {
        console.error("Failed to fetch groups", error);
      }
    }
  return (
    <DefaultLayout importexport={false}>
      <div className="flex items-center justify-center bg-gradient-to-br">
        <div className="w-full max-w-20xl p-10 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-center text-blue-800 mb-8">
            Ajouter un candidat
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="form-group">
                <label htmlFor="nom" className="block text-gray-700">
                  Nom
                </label>
                <input
                  type="text"
                  className="mt-1 p-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12"
                  id="nom"
                  name="nom"
                  value={formValues.nom}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="prenom" className="block text-gray-700">
                  Prenom
                </label>
                <input
                  type="text"
                  className="mt-1 p-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12"
                  id="prenom"
                  name="prenom"
                  value={formValues.prenom}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="username" className="block text-gray-700">
                  Nom d&lsquo;utilisateur
                </label>
                <input
                  type="text"
                  className="mt-1 p-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12"
                  id="username"
                  name="username"
                  value={formValues.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email" className="block text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  className="mt-1 p-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12"
                  id="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password" className="block text-gray-700">
                  Mot de passe
                </label>
                <input
                  type="password"
                  className="mt-1 p-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12"
                  id="password"
                  name="password"
                  value={formValues.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="cin" className="block text-gray-700">
                  CIN
                </label>
                <input
                  type="text"
                  className="mt-1 p-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12"
                  id="cin"
                  name="cin"
                  value={formValues.cin}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="addresse" className="block text-gray-700">
                  Adresse
                </label>
                <input
                  type="text"
                  className="mt-1 p-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12"
                  id="addresse"
                  name="addresse"
                  value={formValues.addresse}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="numerotel" className="block text-gray-700">
                  Numéro de téléphone
                </label>
                <input
                  type="number"
                  className="mt-1 p-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12"
                  id="numerotel"
                  name="numerotel"
                  value={formValues.numerotel}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="date_naissance" className="block text-gray-700">
                  Date de naissance
                </label>
                <input
                  type="date"
                  className="mt-1 p-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12"
                  id="date_naissance"
                  name="date_naissance"
                  value={formValues.date_naissance}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="group" className="block text-gray-700">
                  Groupe
                </label>
                <select
                  id="group"
                  name="group"
                  value={formValues.group_id}
                  onChange={(e) => {
                    setFormValues((prevState) => ({
                      ...prevState,
                      group_id: e.target.value,
                    }));
                    // console.log(e.target.value);
                    
                  }}
                  className="mt-1 px-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12"
                >
                  <option value="">Choisir un groupe</option>
                  {groups.map((group: any) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="bg-graydark mt-6 w-full py-3 dark:bg-gray-100 shadow-md flex items-center justify-center px-6 rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
            >
              {" "}
              <PlusIcon /> Ajouter Candidat
            </button>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default PersonnelForm