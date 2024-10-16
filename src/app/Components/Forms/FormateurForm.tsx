"use client";

import React, { useEffect, useState } from "react";
import DefaultLayout from "../Layout/DefaultLayout";
import { PlusIcon } from "lucide-react";
import Swal from "sweetalert2";
import { fetchWithAuth, postWithAuth } from "@/utils/api";
import { calculateAge } from "@/utils/calculateAge";
import { validateCINLength } from "@/utils/cinValidation";
import { getRoleFromToken } from "@/utils/getRoleFromToken";
import { validatePhoneNumber } from "@/utils/phoneValidation";

function FormateurForm() {
  const [ligneOptions, setLigneOptions] = useState<
    { id: number; name: string }[]
  >([]);
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
    isAffecteur: false,
    Type: "Pratique",
    lignes: [] as number[],
  });
  const [selectedLignes, setSelectedLignes] = useState<number[]>([]);
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
  const role = getRoleFromToken();
 const fetchLignes = async () => {
   try {
     const response = await fetchWithAuth("api/lignes/");
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
  useEffect(() => {
    fetchLignes();
    if (role === "Superviseur") {
      setFormValues((prevState) => ({
        ...prevState,
        Type: "Pratique",
      }));
    } else if (role === "ResponsableEcoleFormation") {
      setFormValues((prevState) => ({
        ...prevState,
        Type: "Theorique",
        isAffecteur: false,
      }));
    }
  }, [role]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const updatedValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormValues((prevState) => ({
      ...prevState,
      [name]: updatedValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
    if (!validatePhoneNumber(formValues.numerotel)) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Le numéro de téléphone doit commencer par 0 et contenir 10 chiffres.",
      });
      return;
    }
    try {
      await postWithAuth("api/create-formateurs/", {
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
          role: "Formateur",
        },
        isAffecteur: formValues.isAffecteur,
        Type: formValues.Type,
        lignes: selectedLignes,
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
        isAffecteur: false,
        Type: "",
        lignes: [],
      });

      Swal.fire({
        icon: "success",
        title: "Formateur ajouté avec succès !",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error("Failed to add formateur", error);
      Swal.fire({
        icon: "error",
        title: "Une erreur est survenue lors de l'ajout du formateur.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  };

  return (
    <DefaultLayout importexport={false}>
      <div className="flex items-center justify-center bg-gradient-to-br">
        <div className="w-full max-w-20xl p-10 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-center text-blue-800 mb-8">
            Ajouter Formateur
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
                  min={5}
                  max={6}
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
                <label htmlFor="Type" className="block text-gray-700">
                  Type
                </label>
                <select
                  className="mt-1 px-4 block w-full rounded-md border-gray-300 shadow-sm  focus:border-blue-500 focus:ring-blue-500 h-12"
                  id="Type"
                  name="Type"
                  value={
                    role == "Superviseur"
                      ? "Pratique"
                      : role == "ResponsableEcoleFormation"
                      ? "Theorique"
                      : formValues.Type
                  }
                  onChange={handleChange}
                  required
                  disabled={role !== "RH"}
                >
                  <option value="Pratique">Pratique</option>
                  <option value="Theorique">Theorique</option>
                </select>
              </div>
              {formValues.Type === "Pratique" && (
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
              )}
              <div>
                <label htmlFor="isAffecteur" className="ml-2 text-gray-700">
                  Affecteur
                </label>
                <input
                  type="checkbox"
                  className="block w-1/12 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12"
                  id="isAffecteur"
                  name="isAffecteur"
                  checked={formValues.isAffecteur}
                  onChange={handleChange}
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-graydark mt-6 w-full py-3 dark:bg-gray-100 shadow-md flex items-center justify-center px-6 rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
            >
              <PlusIcon /> Ajouter Formateur
            </button>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default FormateurForm;
