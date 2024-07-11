"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import DefaultLayout from "../Layout/DefaultLayout";
import { PlusIcon } from "lucide-react";
import Swal from "sweetalert2";
import { postWithAuth, fetchWithAuth } from "@/utils/api"; // Assuming you have API utility functions
import { calculateAge } from "@/utils/calculateAge";
import { validateCINLength } from "@/utils/cinValidation";

interface FormValues {
  nom: string;
  username: string;
  prenom: string;
  email: string;
  password: string;
  cin: string;
  addresse: string;
  numerotel: string;
  date_naissance: string;
  lignes: number[]; // Array of selected ligne IDs
}

function SupervisorForm() {
  const [formValues, setFormValues] = useState<FormValues>({
    nom: "",
    username: "",
    prenom: "",
    email: "",
    password: "",
    cin: "",
    addresse: "",
    numerotel: "",
    date_naissance: "",
    lignes: [], // Initialize as empty array
  });
const [selectedLignes, setSelectedLignes] = useState<number[]>([]);
  const [ligneOptions, setLigneOptions] = useState<
    { id: number; name: string }[]
  >([]);

  useEffect(() => {
    fetchLignes();
  }, []);

  const handleLigneChange = (ligneId: number) => {
    if (selectedLignes.includes(ligneId)) {
      setSelectedLignes(selectedLignes.filter((id) => id !== ligneId));
      setFormValues((prevValues) => ({
        ...prevValues,
        lignes: selectedLignes.filter((id) => id !== ligneId),
      }));
    } else {
      setSelectedLignes([...selectedLignes, ligneId]);
      setFormValues((prevValues) => ({
        ...prevValues,
        lignes: [...selectedLignes, ligneId],
      }));
    }
  };

  const fetchLignes = async () => {
    try {
      const response = await fetchWithAuth("/api/lignes/");
      const lignesData = response.results.map((ligne: any) => ({
        id: ligne.id,
        name: ligne.name,
      }));
      console.log(response);
      
      setLigneOptions(lignesData);
    } catch (error) {
      console.error("Failed to fetch lignes", error);
      // Handle error if needed
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "lignes") {
      const selectedLignes = Array.from((e.target as HTMLSelectElement).selectedOptions, (option) =>
        Number(option.value)
      );
      setFormValues((prevValues) => ({
        ...prevValues,
        lignes: selectedLignes,
      }));
    } else {
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.preventDefault();

    // Age validation
    const age = calculateAge(formValues.date_naissance);
    if (age < 20) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "L'âge du responsable doit être supérieur ou égal à 20 ans.",
      });
      return;
    }

    // CIN length validation
    if (!validateCINLength(formValues.cin)) {
      return;
    }
    try {
      const response = await postWithAuth("/api/create_supervisor/", {
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
          role: "Superviseur",
        },
        lignes_ids: formValues.lignes,
      });
      console.log(formValues);
      
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
        lignes: [], // Reset lignes after submission
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
          title: "Superviseur ajouté avec succès !",
        });
        setSelectedLignes([]); // Reset selected lignes after submission
      }
        
      
     catch (error) {
      console.error("Failed to add supervisor", error);

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
        title: "Une erreur est survenue lors de l'ajout du Superviseur.",
      });
    }
  };

  return (
    <DefaultLayout importexport={false}>
      <div className="flex items-center justify-center bg-gradient-to-br">
        <div className="w-full max-w-20xl p-10 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-center text-blue-800 mb-8">
            Ajouter Superviseur
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

              <div className="form-group">
                <label htmlFor="lignes" className="block text-gray-700">
                  Lignes
                </label>
                <div className="mt-1 p-4 flex gap-5  w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12">
                  {ligneOptions.map((ligne) => (
                    <div key={ligne.id} className=" ">
                      <input
                        type="checkbox"
                        id={`ligne-${ligne.id}`}
                        name={`lignes`}
                        value={ligne.id.toString()}
                        checked={selectedLignes.includes(ligne.id)}
                        onChange={() => handleLigneChange(ligne.id)}
                        className="mr-2"
                      />
                      <label htmlFor={`ligne-${ligne.id}`}>{ligne.name}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="bg-graydark mt-6 w-full py-3 dark:bg-gray-100 shadow-md flex items-center justify-center px-6 rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
            >
              <PlusIcon /> Ajouter Superviseur
            </button>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default SupervisorForm;
