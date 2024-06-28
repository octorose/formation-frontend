"use client"

import React, { use } from 'react'
import DefaultLayout from '../Layout/DefaultLayout';
import { PlusIcon } from 'lucide-react';
import Swal from 'sweetalert2';
import { postWithAuth } from '@/utils/api';

function PersonnelForm() {
    const [formValues, setFormValues] = React.useState({
      nom: "",
      username: "",
      prenom: "",
      email: "",
      password: "",
      cin: "",
      addresse: "",
      numerotel: "",
      schoolName: "",
      date_naissance: "",
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
      try {
        await postWithAuth("/api/create_personnel/", {
          agent: {
            username: "prsouser",
            email: "rhuser@example.com",
            password: "password123",
            prenom: "second",
            nom: "something",
            date_naissance: "1990-01-01",
            addresse: "123 Main St",
            cin: "d5678",
            numerotel: "1234567890",
            role: "Personnel",
          },
          etat: "En Formation",
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
          schoolName: "",
          date_naissance: "",
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
  return (
    <DefaultLayout importexport={false}>
      <div className="flex items-center justify-center bg-gradient-to-br">
        <div className="w-full max-w-20xl p-10 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-center text-blue-800 mb-8">
            Ajouter Personnel 
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
                    Username
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
                  Password
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
            </div>
            <button
              type="submit"
              className="bg-graydark mt-6 w-full py-3 dark:bg-gray-100 shadow-md flex items-center justify-center px-6 rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
            >
              {" "}
              <PlusIcon /> Ajouter Personnel
            </button>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default PersonnelForm