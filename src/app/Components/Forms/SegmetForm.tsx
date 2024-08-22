"use client";
import { fetchWithAuth, postWithAuth } from "@/utils/api";
import { calculateAge } from "@/utils/calculateAge";
import { validateCINLength } from "@/utils/cinValidation";
import { getRoleFromToken } from "@/utils/getRoleFromToken";
import { validatePhoneNumber } from "@/utils/phoneValidation";
import { PlusIcon } from "lucide-react";
import React, { useEffect } from "react";
import Swal from "sweetalert2";
import DefaultLayout from "../Layout/DefaultLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { getRoleIdFromToken } from "@/utils/getRoleIdFromToken";
import { log } from "console";

function SegmetForm() {
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
    ligne: "",
  });
  const role = getRoleFromToken();
  const [productionLines, setProductionLines] = React.useState([]);
  interface ProductionLine {
    id: string;
    name: string;
  }
  
  const [productionLine, setProductionLine] =  React.useState("");
  
  interface ProductionLine {
    id: string;
    name: string;
  }
  useEffect(() => {
    fetchLignes();

  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const updatedValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormValues((prevState) => ({
      ...prevState,
      [name]: updatedValue,
    }));
  };
    const handleLineChange = async (value: string) => {
      setProductionLine(value);

      setFormValues((prevState) => ({
        ...prevState,
        ligne: value,
      }));
    };
   const fetchLignes = async () => {


     try {
       const response = await fetchWithAuth(`api/lignes/`);
       if (response && response.results && Array.isArray(response.results)) {
         setProductionLines(response.results);
         console.log(response.results);
         
         if (response.results.length > 0) {
           setProductionLine(response.results[0]);
         }
       } else {
         throw new Error("Invalid response format");
       }
     } catch (error: any) {
       console.error("Failed to fetch production lines:", error.message);
     }
   };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formValues);
    
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
      await postWithAuth("/api/segments/create/", {
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
          role: "Segment",
        },
        ligne: formValues.ligne,
      });
      // console.log(formValues);
      
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
        ligne: "",
      });

      Swal.fire({
        icon: "success",
        title: "Segment ajouté avec succès !",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error("Failed to add Segment", error);
      Swal.fire({
        icon: "error",
        title: "Une erreur est survenue lors de l'ajout du Segment.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  };
  return (
    <DefaultLayout>
      <div className="flex items-center justify-center bg-gradient-to-br">
        <div className="w-full max-w-20xl p-10 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-center text-blue-800 mb-8">
            Ajouter Segment
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
                  Ligne
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  onChange={(e) => {
                    handleLineChange(e.target.value);
                  }}
                >
                  <option value="">Sélectionnez une ligne de production</option>
                  {productionLines.map((ligne: ProductionLine) => (
                    <option key={ligne.id} value={ligne.id}>
                      {ligne.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="bg-graydark mt-6 w-full py-3 dark:bg-gray-100 shadow-md flex items-center justify-center px-6 rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
            >
              <PlusIcon /> Ajouter Segment
            </button>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default SegmetForm;
