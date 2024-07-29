import React, { useEffect, useState } from "react";
import ResponsivePagination from "react-responsive-pagination";
import { deleteWithAuth, fetchWithAuth, putWithAuth } from "@/utils/api";
import { Agent } from "@/interfaces/Agent";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import useAlert from "@/Hooks/useAlert";
import Modal from "../GlobalModal/Modal";
import Swal from "sweetalert2";


interface Contrat {
  id: number;
  agent: Agent;
  type_contrat: string;
  date_creation_contrat: string;
  duree_contrat: number;
}

interface ApiResponse<T> {
  results: T[];
  count: number;
}

function ContratTable({ endpoint, searchResults }: { endpoint: string; searchResults: any[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [contrats, setContrats] = useState<Contrat[]>([]);
  const { alert, setAlert } = useAlert();
  const [totalContrats, setTotalContrats] = useState(0);
  const [contratToDelete, setContratToDelete] = useState({} as any);
  const [contratToEdit, setContratToEdit] = useState({} as any);
  const { alert: alert2, setAlert: setAlert2 } = useAlert();
  const [deleteNameInput, setDeleteNameInput] = useState('');
  const [editFormData, setEditFormData] = useState({
    type_contrat: '',
    date_creation_contrat: '',
    duree_contrat: 0,
  });

  const handleEditInputChange = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    setEditFormData({ ...editFormData, [fieldName]: event.target.value });
  };

  const handleDeleteInputChange = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (fieldName === 'nom') {
      setDeleteNameInput(event.target.value);
    }
  };

  const updateContrat = async (contrat: any) => {
    try {
      await putWithAuth(`/api/contrats/update/${contrat.id}/`, {
        type_contrat: editFormData.type_contrat,
        date_creation_contrat: editFormData.date_creation_contrat,
        duree_contrat: editFormData.duree_contrat,
      });

      Toast.fire({
        icon: 'success',
        title: 'Contrat mis à jour avec succès !',
        iconColor: 'green',
      });

      fetchData();
      setAlert((prev) => ({ ...prev, isOpen: false }));
    } catch (error) {
      console.error('Échec de la mise à jour du contrat', error);
      Toast.fire({
        icon: 'error',
        title: 'Une erreur est survenue lors de la mise à jour du contrat.',
        iconColor: 'red',
      });
    }
  };

  const fetchData = async () => {
    try {
      const response: ApiResponse<Contrat> = await fetchWithAuth(`${endpoint}?page=${currentPage}`);
      setContrats(response.results);
      setTotalContrats(response.count);
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
      if (deleteNameInput === contratToDelete?.agent?.nom) {
        const response = await deleteWithAuth(`/api/contrats/delete/${contratToDelete.id}/`);

        if (!response || response.status === 204) {
          Toast.fire({
            icon: 'success',
            title: 'Contrat supprimé avec succès !',
            iconColor: 'green',
          });

          fetchData();
          setAlert2((prev) => ({ ...prev, isOpen: false }));
          setDeleteNameInput('');
        } else {
          throw new Error('Failed to delete contrat');
        }
      } else {
        Toast.fire({
          icon: 'error',
          title: 'Nom du responsable invalide',
          iconColor: 'red',
        });
      }
    } catch (error) {
      console.error('Échec de la suppression du contrat', error);
      Toast.fire({
        icon: 'error',
        title: 'Une erreur est survenue lors de la suppression du contrat.',
        iconColor: 'red',
      });
    }
  };

  const handleClose = () => {
    setAlert2((prev) => ({ ...prev, isOpen: false }));
    setDeleteNameInput('');
  };

  return (
    <div className="rounded-sm bg-transparent px-3 pb-2.5 pt-6 dark:border-strokedark dark:bg-boxdark sm:px-7 xl:pb-1">
      <div className="flex flex-col">
        <div className="grid grid-cols-4 rounded-sm text-black dark:text-white bg-gray-2 dark:bg-meta-4 sm:grid-cols-6">
          <div className="p-2 xl:p-3">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Nom</h5>
          </div>
          <div className="p-2 xl:p-3">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Prenom</h5>
          </div>
          <div className="p-2 xl:p-3">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Cin</h5>
          </div>
          <div className="p-2 xl:p-3">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Type de Contrat</h5>
          </div>
          <div className="p-2 text-center xl:p-3">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Date de Création</h5>
          </div>
          <div className="p-2 text-center xl:p-3">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Durée (mois)</h5>
          </div>
          <div className="hidden p-2 text-center sm:block xl:p-3">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Actions</h5>
          </div>
        </div>
        {searchResults !== undefined && searchResults.length > 0 ? (
          <>
            {searchResults.map((contrat: Contrat, key: number) => (
              <div
                className={`grid grid-cols-4 sm:grid-cols-6 text-base ${
                  key === contrats.length - 1 ? "" : "border-b border-stroke dark:border-strokedark"
                }`}
                key={key}
              >
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="hidden text-black dark:text-white sm:block">
                    {contrat.agent.nom}
                  </p>
                </div>
                
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="hidden text-black dark:text-white sm:block">
                    {contrat.agent.prenom}
                  </p>
                </div>
                
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="hidden text-black dark:text-white sm:block">
                    {contrat.agent.cin}
                  </p>
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">
                    {contrat.type_contrat}
                  </p>
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">
                    {contrat.date_creation_contrat}
                  </p>
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">
                    {contrat.duree_contrat}
                  </p>
                </div>
                <div className="hidden items-center justify-center gap-4 p-2.5 sm:flex xl:p-5">
                  <button
                    className="text-black dark:text-white"
                    onClick={() => {
                      setContratToEdit(contrat);
                      setEditFormData({
                        type_contrat: contrat.type_contrat,
                        date_creation_contrat: contrat.date_creation_contrat,
                        duree_contrat: contrat.duree_contrat,
                      });
                      setAlert((prev) => ({ ...prev, isOpen: true }));
                    }}
                  >
                    <Edit2Icon />
                  </button>
                  <button
                    className="text-black dark:text-white"
                    onClick={() => {
                      setContratToDelete(contrat);
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
            {contrats.map((contrat: Contrat, key: number) => (
              <div
                className={`grid grid-cols-4 sm:grid-cols-6 text-base ${
                  key === contrats.length - 1 ? "" : "border-b border-stroke dark:border-strokedark"
                }`}
                key={key}
              >
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="hidden text-black dark:text-white sm:block">
                    {contrat.agent.nom}
                  </p>
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="hidden text-black dark:text-white sm:block">
                    {contrat.agent.prenom}
                  </p>
                </div>
                
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="hidden text-black dark:text-white sm:block">
                    {contrat.agent.cin}
                  </p>
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">
                    {contrat.type_contrat}
                  </p>
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">
                    {contrat.date_creation_contrat}
                  </p>
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">
                    {contrat.duree_contrat}
                  </p>
                </div>
                <div className="hidden items-center justify-center gap-4 p-2.5 sm:flex xl:p-5">
                  <button
                    className="text-black dark:text-white"
                    onClick={() => {
                      setContratToEdit(contrat);
                      setEditFormData({
                        type_contrat: contrat.type_contrat,
                        date_creation_contrat: contrat.date_creation_contrat,
                        duree_contrat: contrat.duree_contrat,
                      });
                      setAlert((prev) => ({ ...prev, isOpen: true }));
                    }}
                  >
                    <Edit2Icon />
                  </button>
                  <button
                    className="text-black dark:text-white"
                    onClick={() => {
                      setContratToDelete(contrat);
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
        total={Math.ceil(totalContrats / 10)}
        onPageChange={handlePageChange}
      />
      <Modal
        isOpen={alert2.isOpen}
        onSubmit={handleDelete}
        onCancel={handleClose}
        alertTitle="Supprimer le contrat"
        alertDescription={`Veuillez confirmer la suppression en saisissant le nom du responsable : "${contratToDelete?.agent?.nom}"`}
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
              placeholder={`Tapez "${contratToDelete?.agent?.nom}"`}
            />
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={alert.isOpen}
        onSubmit={() => updateContrat(contratToEdit)}
        onCancel={() => setAlert((prev) => ({ ...prev, isOpen: false }))}
        alertTitle={
          `Edit ${contratToEdit?.agent?.nom} Details` ||
          `Contrat Details`
        }
        alertDescription="Edit"
        submitBtnName="Submit"
        cancelBtnName="Cancel"
        type="success"
        onClose={() => setAlert((prev) => ({ ...prev, isOpen: false }))}
      >
        <div className="p-4">
          <div className="flex flex-col">
            <label htmlFor="editTypeContrat" className="text-sm font-medium">
              Type de Contrat :
            </label>
            <input
              id="editTypeContrat"
              type="text"
              value={editFormData.type_contrat}
              onChange={(event) => handleEditInputChange(event, 'type_contrat')}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Type de Contrat"
            />
          </div>
          <div className="flex flex-col mt-4">
            <label htmlFor="editDateCreation" className="text-sm font-medium">
              Date de Création :
            </label>
            <input
              id="editDateCreation"
              type="text"
              value={editFormData.date_creation_contrat}
              onChange={(event) => handleEditInputChange(event, 'date_creation_contrat')}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Date de Création"
            />
          </div>
          <div className="flex flex-col mt-4">
            <label htmlFor="editDureeContrat" className="text-sm font-medium">
              Durée (mois) :
            </label>
            <input
              id="editDureeContrat"
              type="number"
              value={editFormData.duree_contrat}
              onChange={(event) => handleEditInputChange(event, 'duree_contrat')}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Durée"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ContratTable;
