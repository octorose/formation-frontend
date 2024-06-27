"use client";
import React from 'react';
import DefaultLayout from '@/Components/Layout/DefaultLayout';
import axios from 'axios';
import Swal from 'sweetalert2';

const AddResponsableEcole = () => {
  const [formValues, setFormValues] = React.useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    cin: '',
    addresse: '',
    numerotel: '',
    schoolName: '',
    date_naissance: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/create-responsable_formation_ecole/', {
        agent: {
          nom: formValues.nom,
          prenom: formValues.prenom,
          email: formValues.email,
          password: formValues.password,
          cin: formValues.cin,
          addresse: formValues.addresse,
          numerotel: formValues.numerotel,
          date_naissance: formValues.date_naissance,
          role: 'ResponsableEcoleFormation' 
        },
        school_name: formValues.schoolName,
      });
      // Clear form after successful submission
      setFormValues({
        nom: '',
        prenom: '',
        email: '',
        password: '',
        cin: '',
        addresse: '',
        numerotel: '',
        schoolName: '',
        date_naissance: '',
      });

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
        title: 'Responsable ajouté avec succès !'
      });
    } catch (error) {
      console.error('Failed to add responsable', error);

      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        iconColor: 'red',
        customClass: {
          popup: 'colored-toast',
        },
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      Toast.fire({
        icon: 'error',
        title: 'Une erreur est survenue lors de l\'ajout du responsable.'
      });
    }
  };

  return (
    <DefaultLayout importexport={false}>
      <div className="flex items-center justify-center bg-gradient-to-br">
        <div className="w-full max-w-20xl p-10 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-center text-blue-800 mb-8">Ajouter Responsable Ecole formation</h1>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="form-group">
                <label htmlFor="nom" className="block text-gray-700">Nom</label>
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
                <label htmlFor="prenom" className="block text-gray-700">Prenom</label>
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
                <label htmlFor="email" className="block text-gray-700">Email</label>
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
                <label htmlFor="password" className="block text-gray-700">Password</label>
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
                <label htmlFor="cin" className="block text-gray-700">CIN</label>
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
                <label htmlFor="addresse" className="block text-gray-700">Adresse</label>
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
                <label htmlFor="numerotel" className="block text-gray-700">Numéro de téléphone</label>
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
                <label htmlFor="schoolName" className="block text-gray-700">Nom de l'école</label>
                <input
                  type="text"
                  className="mt-1 p-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12"
                  id="schoolName"
                  name="schoolName"
                  value={formValues.schoolName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="date_naissance" className="block text-gray-700">Date de naissance</label>
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
            <button type="submit" className="mt-6 w-full py-3 px-6 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:bg-blue-700">Ajouter Responsable Ecole formation</button>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AddResponsableEcole;
