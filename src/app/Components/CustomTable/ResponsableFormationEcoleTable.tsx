import React, { useEffect, useState } from "react";
import ResponsivePagination from "react-responsive-pagination";
import { fetchWithAuth } from "@/utils/api";
import { Agent } from "@/interfaces/Agent";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import useAlert from "@/Hooks/useAlert";
import Modal from "../GlobalModal/Modal";
import Swal from "sweetalert2";
import axios from "axios";

interface ResponsableFormationEcole {
  id: number;
  agent: Agent;
  
}

interface ApiResponse<T> {
  results: T[];
  count: number;
}

function ResponsableFormationEcole({
  endpoint,
  searchResults,
}: {
  endpoint: string;
  searchResults: any[];
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [responsables, setResponsables] = useState<ResponsableFormationEcole[]>([]);
  const [editMode, setEditMode] = useState(Array(15).fill(false));
  const { alert, setAlert } = useAlert();
  const [totalResponsables, setTotalResponsables] = useState(0);
  const [responsableToDelete, setResponsableToDelete] = useState({} as any);
  const [responsableToEdit, setResponsableToEdit] = useState({} as any);
  const { alert: alert2, setAlert: setAlert2 } = useAlert();
  const [deleteNameInput, setDeleteNameInput] = useState('');
  const [editFormData, setEditFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
  
  });

  const handleEditInputChange = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    setEditFormData({ ...editFormData, [fieldName]: event.target.value });
  };

  const handleDeleteInputChange = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (fieldName === 'nom') {
      setDeleteNameInput(event.target.value);
    }
  };

  const updateResponsable = async (responsable: any) => {
    try {
      await axios.put(`http://localhost:8000/api/update-responsable_formation_ecole/${responsable.id}/`, {
        agent: {
          nom: editFormData.nom,
          prenom: editFormData.prenom,
          email: editFormData.email,
        },
     
      });

      Toast.fire({
        icon: 'success',
        title: 'Responsable mis à jour avec succès !',
        iconColor: 'green',
      });

      fetchData();
      setAlert((prev) => ({ ...prev, isOpen: false }));
    } catch (error) {
      console.error('Échec de la mise à jour du responsable', error);
      Toast.fire({
        icon: 'error',
        title: 'Une erreur est survenue lors de la mise à jour du responsable.',
        iconColor: 'red',
      });
    }
  };

  const fetchData = async () => {
    try {
      const response: ApiResponse<ResponsableFormationEcole> = await fetchWithAuth(
        `${endpoint}?page=${currentPage}`
      );
      setResponsables(response.results);
      setTotalResponsables(response.count);
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, endpoint]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    customClass: {
      popup: 'colored-toast',
    },
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });

  const handleDelete = async () => {
    try {
      if (deleteNameInput === responsableToDelete?.agent?.nom) {
        await axios.delete(`http://localhost:8000/api/delete-responsable_formation_ecole/${responsableToDelete.id}/`);

        Toast.fire({
          icon: 'success',
          title: 'Responsable supprimé avec succès !',
          iconColor: 'green',
        });

        fetchData();
        setAlert2((prev) => ({ ...prev, isOpen: false }));
        setDeleteNameInput(''); 
      } else {
        Toast.fire({
          icon: 'error',
          title: 'Nom du responsable invalide',
          iconColor: 'red',
        });
      }
    } catch (error) {
      console.error('Échec de la suppression du responsable', error);
      Toast.fire({
        icon: 'error',
        title: 'Une erreur est survenue lors de la suppression du responsable.',
        iconColor: 'red',
      });
    }
  };
  const handleClose = () => {
    setAlert2((prev) => ({ ...prev, isOpen: false }));
    setDeleteNameInput('');
  };
  return (
    <div className="rounded-sm bg-transparent px-5 pb-2.5 pt-6 dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm text-black dark:text-white bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Nom</h5>
          </div>
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Prenom</h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Email</h5>
          </div>
        
       
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Actions</h5>
          </div>
        </div>
        {searchResults !== undefined && searchResults.length > 0 ? (
          <>
            {searchResults.map((responsable: ResponsableFormationEcole, key: number) => (
              <div
                className={`grid grid-cols-3 sm:grid-cols-5 text-base ${
                  key === responsables.length - 1
                    ? ""
                    : "border-b border-stroke dark:border-strokedark"
                }`}
                key={key}
              >
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="hidden text-black dark:text-white sm:block">
                    {responsable.agent.nom}
                  </p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">
                    {responsable.agent.prenom}
                  </p>
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">
                {responsable.agent.email}
              </p>
            </div>
             
              
                <div className="hidden items-center justify-center gap-4 p-2.5 sm:flex xl:p-5">
                <button
                className="text-black dark:text-white"
                onClick={() => {
                  setResponsableToEdit(responsable);
                  setEditFormData({
                    nom: responsable.agent.nom,
                    prenom: responsable.agent.prenom,
                    email: responsable.agent.email,
                  
                  });
                  setAlert((prev) => ({ ...prev, isOpen: true }));
                }}
              >
                <Edit2Icon />
              </button>
                  <button
                    className="text-black dark:text-white"
                    onClick={() => {
                      setResponsableToDelete(responsable);
                      setAlert2((prev) => ({ ...prev, isOpen: true }));
                    }}
                  >
                    <Trash2Icon />
                  </button>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {responsables.map((responsable: ResponsableFormationEcole, key: number) => (
              <div
                className={`grid grid-cols-3 sm:grid-cols-5 text-base ${
                  key === responsables.length - 1
                    ? ""
                    : "border-b border-stroke dark:border-strokedark"
                }`}
                key={key}
              >
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="hidden text-black dark:text-white sm:block">
                    {responsable.agent.nom}
                  </p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">
                    {responsable.agent.prenom}
                  </p>
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">
                {responsable.agent.email}
              </p>
            </div>
              
                <div className="hidden items-center justify-center gap-4 p-2.5 sm:flex xl:p-5">
                <button
                className="text-black dark:text-white"
                onClick={() => {
                  setResponsableToEdit(responsable);
                  setEditFormData({
                    nom: responsable.agent.nom,
                    prenom: responsable.agent.prenom,
                    email: responsable.agent.email,
                
                  });
                  setAlert((prev) => ({ ...prev, isOpen: true }));
                }}
              >
                <Edit2Icon />
              </button>
                  <button
                    className="text-black dark:text-white"
                    onClick={() => {
                      setResponsableToDelete(responsable);
                      setAlert2((prev) => ({ ...prev, isOpen: true }));
                    }}
                  >
                    <Trash2Icon />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <ResponsivePagination
        current={currentPage}
        total={Math.ceil(totalResponsables / 10)}
        onPageChange={handlePageChange}
      />
    <Modal
        isOpen={alert2.isOpen}
        onSubmit={handleDelete}
        onCancel={handleClose}
        alertTitle="Supprimer le responsable"
        alertDescription={`Veuillez confirmer la suppression en saisissant le nom du responsable : "${responsableToDelete?.agent?.nom}"`}
        submitBtnName="Supprimer"
        cancelBtnName="Annuler"
        type="error"
        onClose={() => setAlert2((prev) => ({ ...prev, isOpen: false }))}
      >
        <div className="p-4">
          <div className="flex flex-col">
            <label htmlFor="deleteName" className="text-sm font-medium">
              Nom :
            </label>
            <input
              id="deleteName"
              type="text"
              value={deleteNameInput}
              onChange={(event) => handleDeleteInputChange(event, 'nom')}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder={`Tapez "${responsableToDelete?.agent?.nom}"`}
            />
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={alert.isOpen}
        onSubmit={() => updateResponsable(responsableToEdit)}
        onCancel={() => setAlert((prev) => ({ ...prev, isOpen: false }))}
        alertTitle={
          `Edit ${responsableToEdit?.agent?.nom} Details` ||
          `Responsable Details`
        }
        alertDescription="Edit"
        submitBtnName="Submit"
        cancelBtnName="Cancel"
        type="success"
        onClose={() => setAlert((prev) => ({ ...prev, isOpen: false }))}
      >
        <div className="p-4">
          <div className="flex flex-col">
            <label htmlFor="editNom" className="text-sm font-medium">
              Nom :
            </label>
            <input
              id="editNom"
              type="text"
              value={editFormData.nom}
              onChange={(event) => handleEditInputChange(event, 'nom')}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Nom"
            />
          </div>
          <div className="flex flex-col mt-4">
            <label htmlFor="editPrenom" className="text-sm font-medium">
              Prenom :
            </label>
            <input
              id="editPrenom"
              type="text"
              value={editFormData.prenom}
              onChange={(event) => handleEditInputChange(event, 'prenom')}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Prenom"
            />
          </div>
          <div className="flex flex-col mt-4">
            <label htmlFor="editEmail" className="text-sm font-medium">
              Email :
            </label>
            <input
              id="editEmail"
              type="text"
              value={editFormData.email}
              onChange={(event) => handleEditInputChange(event, 'email')}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Email"
            />
          </div>
        
        </div>
      </Modal>
    </div>
  );
}

export default ResponsableFormationEcole;
