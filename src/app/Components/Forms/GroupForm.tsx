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
  Effectif: number;
}

function GroupForm() {
  const [formValues, setFormValues] = useState<FormValues>({
    name: "",
    Effectif: 0,
  });


  useEffect(() => {
    // fetchGroups();
  }, []);





  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value
    }));
  }
    

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await postWithAuth("api/groups/", {
        name: formValues.name,
        Effectif: formValues.Effectif,
      });

      console.log(formValues);
      setFormValues({
        name: "",
        Effectif: 0,
      });

      Swal.fire({
        icon: "success",
        title: "Poste ajouté avec succès !",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
      });
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
          <form 
          onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="name" className="block text-gray-700">
                  Nom de group
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
             <div>
                <label htmlFor="Effectif" className="block text-gray-700">
                  Effectif
                </label>
                <input type="number" name="Effectif" id="Effectif"
                 value = {formValues.Effectif}
                 onChange={handleChange} placeholder="Effectif" className="mt-1 p-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12" />
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

export default GroupForm;
