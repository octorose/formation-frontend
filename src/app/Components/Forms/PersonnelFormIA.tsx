"use client";
import React, { useRef, useState } from 'react';
import DefaultLayout from '../Layout/DefaultLayout';
import { PencilIcon } from 'lucide-react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { postWithAuth } from '@/utils/api';

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
  const [address, setAddress] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
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
      setLoading(true); // Début du chargement
      try {
        const extractedData = await performOCR(imageFile);
        console.log('Données OCR extraites:', extractedData);
        setOcrData(extractedData);
      } catch (error) {
        console.error('Erreur lors de l\'extraction OCR:', error);
      } finally {
        setLoading(false); // Fin du chargement
      }
    }
  };

  const handleExtractToExcel = () => {
    if (ocrData) {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet([ocrData]);
      XLSX.utils.book_append_sheet(wb, ws, 'Personnel Data');
      XLSX.writeFile(wb, 'personnel_data.xlsx');
    }
  };

  const performOCR = async (file: File): Promise<OcrData> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8002/extract-ocr/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Réponse OCR:', response.data);

      const username = `${response.data.nom.toLowerCase()}${response.data.cin}`;
      const email = `${response.data.nom.toLowerCase().replace(/\s+/g, '_')}${response.data.cin}@gmail.com`;

      return {
        ...response.data,
        username: username,
        email: email,
      };
    } catch (error) {
      console.error('Erreur lors de l\'extraction OCR:', error);
      throw error;
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
            icon: 'error',
            title: 'Erreur',
            text: 'L\'adresse et le numéro de téléphone ne peuvent pas être vides.',
          });
          return;
        }
  
        
        const formattedDateOfBirth = new Date(ocrData.date_naissance).toISOString().split('T')[0];
  
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
        setAddress('');
        setPhoneNumber('');
  
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
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16s1.5 2 4 2 4-2 4-2M14 16s1.5 2 4 2 4-2 4-2M8 12V8c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v4M8 16v4c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-4"></path></svg>
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
            {selectedImage && <img src={selectedImage} alt="Selected" className="max-w-xs rounded-lg shadow-lg" />}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
  className={`border border-green-500 text-green-500 hover:bg-green-500 hover:text-white font-bold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out flex items-center justify-center space-x-2 col-span-1 md:col-span-3 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
  onClick={handleNextClick}
  disabled={loading}
>
  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582a10.044 10.044 0 011.654-3.741l.753-.752 1.414 1.414-.752.753A10.045 10.045 0 016 10.418V15h5a1 1 0 011 1v.164a10.045 10.045 0 013.741-1.654l.753-.752 1.414 1.414-.752.753a10.044 10.044 0 01-1.654 3.741H15v5h5a1 1 0 011-1v-5h-.164a10.044 10.044 0 011.654-3.741l.752-.753-1.414-1.414-.753.752A10.045 10.045 0 0115.582 14H10V9a1 1 0 00-1-1H7.418a10.045 10.045 0 01-3.741 1.654l-.753.752L1.418 9.586l.752-.753A10.044 10.044 0 014 4H4z"></path></svg>
  <span>{loading ? "Extraction en cours..." : "Extraire avec OCR"}</span>
</button>


          </div>
          {ocrData && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 mt-6">Informations extraites</h2>
              <form onSubmit={handleAddClick} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(ocrData).map(([key, value]) => (
                  <div key={key} className="relative">
                    <label className="block font-semibold text-gray-700 mb-1">{formatLabel(key)}</label>
                    {editMode[key as keyof OcrData] ? (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleInputChange(key as keyof OcrData, e.target.value)}
                        className="border border-gray-300 rounded px-4 py-2 w-full"
                      />
                    ) : (
                      <div className="border border-gray-300 rounded px-4 py-2 w-full">
                        {value}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleEditMode(key as keyof OcrData)}
                      className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <div className="relative">
                  <label className="block font-semibold text-gray-700 mb-1">Adresse</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="border border-gray-300 rounded px-4 py-2 w-full"
                  />
                </div>
                <div className="relative">
                  <label className="block font-semibold text-gray-700 mb-1">Numéro de téléphone</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="border border-gray-300 rounded px-4 py-2 w-full"
                  />
                </div>
                <div className="md:col-span-2 flex justify-between mt-6">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
                  >
                    Ajouter
                  </button>
                  <button
                    type="button"
                    className="bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
                    onClick={handleExtractToExcel}
                  >
                    Extraire vers Excel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );

  function formatLabel(key: string): string {
    switch (key) {
      case 'nom':
        return 'Nom';
      case 'prenom':
        return 'Prénom';
      case 'date_naissance':
        return 'Date de naissance';
      case 'cin':
        return 'CIN';
      case 'email':
        return 'Email';
      case 'username':
        return "Nom d'utilisateur";
      case 'password':
        return 'Mot de passe';
      default:
        return key;
    }
  }
}

export default PersonnelFormIA;
