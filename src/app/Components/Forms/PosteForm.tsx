"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import DefaultLayout from "../Layout/DefaultLayout";
import { PlusIcon } from "lucide-react";
import Swal from "sweetalert2";
import { postWithAuth, fetchWithAuth } from "@/utils/api";
import { getRoleIdFromToken } from "@/utils/getRoleIdFromToken";
import { getRoleFromToken } from "@/utils/getRoleFromToken";

interface FormValues {
  name: string;
  lignes: number[];
  type: string;
}

function PosteForm() {
  const [formValues, setFormValues] = useState<FormValues>({
    name: "",
    lignes: [],
    type: "simple_sans_risque",
  });
  const [selectedLignes, setSelectedLignes] = useState<number[]>([]);
  const [ligneOptions, setLigneOptions] = useState<
    { id: number; name: string }[]
  >([]);


  useEffect(() => {
    const supervisorId = getRoleIdFromToken();
    if (supervisorId) {
      fetchLignes(supervisorId);
    }
    if (getRoleFromToken() === "RH") {
      fetchLignesRH();
    }
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

  const fetchLignes = async (supervisorId: number) => {
    try {
      const response = await fetchWithAuth(`/api/supervisor-lignes/${supervisorId}/`);
      const lignesData = response.results.map((ligne: any) => ({
        id: ligne.id,
        name: ligne.name,
      }));
      setLigneOptions(lignesData);
    } catch (error) {
      console.error("Failed to fetch lignes", error);
    }
  };
  const fetchLignesRH = async () => {
    try {
      const response = await fetchWithAuth(`/api/lignes/`);
      const lignesData = response.results.map((ligne: any) => ({
        id: ligne.id,
        name: ligne.name,
      }));
      setLigneOptions(lignesData);
    } catch (error) {
      console.error("Failed to fetch lignes", error);
    }}

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
    try {
      const response = await postWithAuth("api/create-postes/", {
        name: formValues.name,
        lignes_ids: formValues.lignes,
        type: formValues.type,
      });

      console.log(formValues);
      setFormValues({
        name: "",
        lignes: [],
        type: "simple_sans_risque",
      });

      Swal.fire({
        icon: "success",
        title: "Poste ajouté avec succès !",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
      });
      setSelectedLignes([]);
    } catch (error) {
      console.error("Failed to add poste", error);
      Swal.fire({
        icon: "error",
        title: "Une erreur est survenue lors de l'ajout du poste.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  return (
    <DefaultLayout importexport={false}>
      <div className="flex items-center justify-center bg-gradient-to-br">
        <div className="w-full max-w-20xl p-10 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-center text-blue-800 mb-8">
            Ajouter une position
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="name" className="block text-gray-700">
                  Nom
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
                <label htmlFor="type" className="block text-gray-700">
                  Type
                </label>
                <select
                  className="mt-1 px-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12"
                  id="type"
                  name="type"
                  value={formValues.type}
                  onChange={handleChange}
                  required
                >
                  <option value="simple_sans_risque">Simple sans risque</option>
                  <option value="simple_avec_risque">Simple avec des risques</option>
                  <option value="compliqué_sans_risque">Compliqué sans risque</option>
                  <option value="compliqué_avec_risque">Compliqué avec le risque</option>
                </select>
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
              <PlusIcon /> Ajouter Position
            </button>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default PosteForm;
