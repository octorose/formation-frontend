"use client";
import React, { useRef, useState } from "react";
import DefaultLayout from "../Layout/DefaultLayout";
import { PencilIcon } from "lucide-react";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { postWithAuth } from "@/utils/api";

interface OcrData {
  nom: string;
  prenom: string;
  date_naissance: string;
  cin: string;
  email: string;
  username: string;
  password: string;
}

type EditMode = {
  [K in keyof OcrData]: boolean;
};

function PersonnelFormIA() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [ocrData, setOcrData] = useState<OcrData | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editMode, setEditMode] = useState<EditMode>({
    nom: false,
    prenom: false,
    date_naissance: false,
    cin: false,
    email: false,
    username: false,
    password: false,
  });
  const [address, setAddress] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  const handleNextClick = async () => {
    if (imageFile) {
      setLoading(true);
      try {
        const extractedData = await performOCR(imageFile);
        console.log("Données OCR extraites:", extractedData);
        setOcrData(extractedData);
      } catch (error) {
        console.error("Erreur lors de l'extraction OCR:", error);
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Une erreur est survenue lors de l'extraction OCR.",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleExtractToExcel = () => {
    if (ocrData) {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet([ocrData]);
      XLSX.utils.book_append_sheet(wb, ws, "Personnel Data");
      XLSX.writeFile(wb, "personnel_data.xlsx");
    }
  };

  const performOCR = async (file: File): Promise<OcrData> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/api/extract-ocr/`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data; // Return the extracted data
    } catch (error) {
      console.error("Error:", error);
      throw error; // Re-throw the error to be caught in handleNextClick
    }
  };

  const toggleEditMode = (field: keyof OcrData) => {
    setEditMode((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleInputChange = (field: keyof OcrData, value: string) => {
    setOcrData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleAddClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (ocrData) {
      try {
        if (!address || !phoneNumber) {
          Swal.fire({
            icon: "error",
            title: "Erreur",
            text: "L'adresse et le numéro de téléphone ne peuvent pas être vides.",
          });
          return;
        }

        const formattedDateOfBirth = new Date(ocrData.date_naissance)
          .toISOString()
          .split("T")[0];

        await postWithAuth("/api/create_personnel/", {
          agent: {
            username: ocrData.username,
            email: ocrData.email,
            password: ocrData.password,
            prenom: ocrData.prenom,
            nom: ocrData.nom,
            date_naissance: formattedDateOfBirth,
            addresse: address,
            cin: ocrData.cin,
            numerotel: phoneNumber,
            role: "Personnel",
          },
          etat: "Candidat",
        });

        setOcrData(null);
        setAddress("");
        setPhoneNumber("");

        Swal.fire({
          icon: "success",
          title: "Succès",
          text: "Personnel ajouté avec succès !",
        });
      } catch (error) {
        console.error("Failed to add personnel", error);

        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Une erreur est survenue lors de l'ajout du personnel.",
        });
      }
    }
  };

  return (
    <DefaultLayout importexport={false}>
      <div className="flex items-center justify-center bg-gradient-to-br">
        <div className="w-full max-w-3xl p-10 bg-white shadow-lg rounded-lg m-8">
          <h1 className="text-2xl font-bold text-center text-blue-800 mb-8">
            Ajouter Personnel Avec OCR
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <button
              className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-bold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out flex items-center justify-center space-x-2 col-span-1 md:col-span-3"
              onClick={handleUploadClick}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16s1.5 2 4 2 4-2 4-2M14 16s1.5 2 4 2 4-2 4-2M8 12V8c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v4M8 16v4c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-4"
                ></path>
              </svg>
              <span>Télécharger CIN</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <div className="flex justify-center mb-6">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Selected"
                className="max-w-xs rounded-lg shadow-lg"
              />
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              className={`border border-green-500 text-green-500 hover:bg-green-500 hover:text-white font-bold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out flex items-center justify-center space-x-2 col-span-1 md:col-span-3 ${
                loading ? "cursor-not-allowed opacity-50" : ""
              }`}
              onClick={handleNextClick}
              disabled={loading}
            >
              <svg
                className="w-5 h-5 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582a10.044 10.044 0 011.654-3.741l.753-.752 1.414 1.414-.752.752a8.038 8.038 0 00-1.269 2.373L6 10.032V16H4v-8zM16 6v5h.582a10.044 10.044 0 011.654-3.741l.753-.752 1.414 1.414-.752.752a8.038 8.038 0 00-1.269 2.373L18 10.032V16h-2v-8h2zM16 10h-2v6h2v-6zm-6 0h-2v6h2v-6z"
                ></path>
              </svg>
              <span>{loading ? "Chargement..." : "Extraire les Données"}</span>
            </button>
          </div>
          {ocrData && (
            <form onSubmit={handleAddClick}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(ocrData).map(([key, value]) => (
                  <div key={key} className="relative">
                    <label className="block text-sm font-medium text-gray-700">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                      <button
                        type="button"
                        className="absolute top-0 right-0 px-2 py-1 text-blue-500"
                        onClick={() => toggleEditMode(key as keyof OcrData)}
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                    </label>
                    <input
                      type="text"
                      className={`mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                        editMode[key as keyof OcrData] ? "bg-gray-100" : ""
                      }`}
                      value={
                        editMode[key as keyof OcrData]
                          ? value
                          : ocrData[key as keyof OcrData]
                      }
                      readOnly={!editMode[key as keyof OcrData]}
                      onChange={(e) =>
                        handleInputChange(key as keyof OcrData, e.target.value)
                      }
                    />
                  </div>
                ))}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">
                    Adresse
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">
                    Numéro de Téléphone
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-bold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out mr-4"
                  onClick={handleExtractToExcel}
                >
                  Exporter en Excel
                </button>
                <button
                  type="submit"
                  className="border border-green-500 text-green-500 hover:bg-green-500 hover:text-white font-bold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out"
                >
                  Ajouter Personnel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}

export default PersonnelFormIA;
