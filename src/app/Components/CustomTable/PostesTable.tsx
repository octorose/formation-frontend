import React, { useEffect, useState } from "react";
import ResponsivePagination from "react-responsive-pagination";
import { deleteWithAuth, fetchWithAuth, putWithAuth } from "@/utils/api";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import useAlert from "@/Hooks/useAlert";
import Modal from "../GlobalModal/Modal";
import Swal from "sweetalert2";
import { getRoleIdFromToken } from "@/utils/getRoleIdFromToken";

interface Lignes {
  id: number;
  name: string;
}

interface Poste {
  id: number;
  name: string;
  type: string;
  lignes: Lignes[];
}

interface ApiResponse<T> {
  results: T[];
  count: number;
}

function PostesTable({
  endpoint,
  searchResults,
}: {
  endpoint: string;
  searchResults: any[];
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [postes, setPostes] = useState<Poste[]>([]);
  const [editMode, setEditMode] = useState(Array(15).fill(false));
  const { alert, setAlert } = useAlert();
  const [totalPostes, setTotalPostes] = useState(0);
  const [posteToDelete, setPosteToDelete] = useState({} as any);
  const [posteToEdit, setPosteToEdit] = useState({} as any);
  const { alert: alert2, setAlert: setAlert2 } = useAlert();
  const [deleteNameInput, setDeleteNameInput] = useState("");
  const [ligneOptions, setLigneOptions] = useState<Lignes[]>([]);

  const [editFormData, setEditFormData] = useState({
    name: "",
    type: "",
    lignes: [] as number[],
  });

  const handleEditInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: string,
    id?: number
  ) => {
    if (field === "lignes") {
      const target = event.target as HTMLInputElement; // Définir le type de target comme HTMLInputElement
      const newLignes = editFormData.lignes ? [...editFormData.lignes] : [];

      // Vérifier la propriété checked après avoir assuré le type
      if (target.checked) {
        if (id) newLignes.push(id);
      } else {
        if (id) {
          const index = newLignes.indexOf(id);
          if (index > -1) {
            newLignes.splice(index, 1);
          }
        }
      }
      setEditFormData((prevData) => ({
        ...prevData,
        lignes: newLignes,
      }));
    } else {
      const { value } = event.target as HTMLInputElement | HTMLSelectElement; // Définir le type de value comme string
      setEditFormData((prevData) => ({
        ...prevData,
        [field]: value,
      }));
    }
  };

  const handleDeleteInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    if (fieldName === "name") {
      setDeleteNameInput(event.target.value);
    }
  };

  const updatePoste = async (poste: any) => {
    try {
      await putWithAuth(`api/update-postes/${poste.id}/`, {
        name: editFormData.name,
        type: editFormData.type,
        lignes_ids: editFormData.lignes,
      });

      Toast.fire({
        icon: "success",
        title: "Poste mis à jour avec succès !",
        iconColor: "green",
      });

      fetchData();
      setAlert((prev) => ({ ...prev, isOpen: false }));
    } catch (error) {
      console.error("Échec de la mise à jour du poste", error);
      Toast.fire({
        icon: "error",
        title: "Une erreur est survenue lors de la mise à jour du poste.",
        iconColor: "red",
      });
    }
  };

  const fetchData = async () => {
    try {
      const supervisorId = getRoleIdFromToken(); // Get the supervisor ID from the token
      const response: ApiResponse<Poste> = await fetchWithAuth(
        `${endpoint}?page=${currentPage}&supervisor_id=${supervisorId}`
      );
      setPostes(response.results);
      setTotalPostes(response.count);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  useEffect(() => {
    fetchData();
    const supervisorId = getRoleIdFromToken();
    if (supervisorId) {
      fetchLignes(supervisorId);
    }
  }, [currentPage, endpoint]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    customClass: {
      popup: "colored-toast",
    },
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });

  const handleDelete = async () => {
    try {
      if (deleteNameInput === posteToDelete?.name) {
        const response = await deleteWithAuth(
          `api/delete-postes/${posteToDelete.id}/`
        );

        if (!response || response.status === 204) {
          Toast.fire({
            icon: "success",
            title: "Poste supprimé avec succès !",
            iconColor: "green",
          });

          fetchData();
          setAlert2((prev) => ({ ...prev, isOpen: false }));
          setDeleteNameInput("");
        } else {
          throw new Error("Failed to delete poste");
        }
      } else {
        Toast.fire({
          icon: "error",
          title: "Nom du poste invalide",
          iconColor: "red",
        });
      }
    } catch (error) {
      console.error("Échec de la suppression du poste", error);
      Toast.fire({
        icon: "error",
        title: "Une erreur est survenue lors de la suppression du poste.",
        iconColor: "red",
      });
    }
  };

  const handleClose = () => {
    setAlert2((prev) => ({ ...prev, isOpen: false }));
    setDeleteNameInput("");
  };
  const fetchLignes = async (supervisorId: number) => {
    try {
      const response = await fetchWithAuth(
        `api/supervisor-lignes/${supervisorId}/`
      );
      const lignesData = response.results.map((ligne: any) => ({
        id: ligne.id,
        name: ligne.name,
      }));
      console.log(response);

      setLigneOptions(lignesData);
    } catch (error) {
      console.error("Failed to fetch lignes", error);
    }
  };

  return (
    <div className="rounded-sm bg-transparent px-5 pb-2.5 pt-6 dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm text-black dark:text-white bg-gray-2 dark:bg-meta-4 sm:grid-cols-4">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Nom</h5>
          </div>
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Type
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Ligne Name
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Actions
            </h5>
          </div>
        </div>
        {searchResults !== undefined && searchResults.length > 0 ? (
          <>
            {searchResults.map((poste: Poste, key: number) => (
              <div
                className={`grid grid-cols-3 sm:grid-cols-4 text-base ${
                  key === postes.length - 1
                    ? ""
                    : "border-b border-stroke dark:border-strokedark"
                }`}
                key={key}
              >
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="hidden text-black dark:text-white sm:block">
                    {poste.name}
                  </p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">{poste.type}</p>
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">
                    {poste.lignes.map((ligne) => ligne.name).join(", ")}
                  </p>
                </div>
                <div className="hidden items-center justify-center gap-4 p-2.5 sm:flex xl:p-5">
                  <button
                    className="text-black dark:text-white"
                    onClick={() => {
                      setPosteToEdit(poste);
                      setEditFormData({
                        name: poste.name,
                        type: poste.type,
                        lignes: poste.lignes.map((ligne) => ligne.id),
                      });
                      setAlert((prev) => ({ ...prev, isOpen: true }));
                    }}
                  >
                    <Edit2Icon />
                  </button>
                  <button
                    className="text-black dark:text-white"
                    onClick={() => {
                      setPosteToDelete(poste);
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
            {postes.map((poste: Poste, key: number) => (
              <div
                className={`grid grid-cols-3 sm:grid-cols-4 text-base ${
                  key === postes.length - 1
                    ? ""
                    : "border-b border-stroke dark:border-strokedark"
                }`}
                key={key}
              >
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="hidden text-black dark:text-white sm:block">
                    {poste.name}
                  </p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">{poste.type}</p>
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">
                    {poste.lignes.map((ligne) => ligne.name).join(", ")}
                  </p>
                </div>
                <div className="hidden items-center justify-center gap-4 p-2.5 sm:flex xl:p-5">
                  <button
                    className="text-black dark:text-white"
                    onClick={() => {
                      setPosteToEdit(poste);
                      setEditFormData({
                        name: poste.name,
                        type: poste.type,
                        lignes: poste.lignes.map((ligne) => ligne.id),
                      });
                      setAlert((prev) => ({ ...prev, isOpen: true }));
                    }}
                  >
                    <Edit2Icon />
                  </button>
                  <button
                    className="text-black dark:text-white"
                    onClick={() => {
                      setPosteToDelete(poste);
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
        total={Math.ceil(totalPostes / 10)}
        onPageChange={handlePageChange}
      />
      <Modal
        isOpen={alert2.isOpen}
        onSubmit={handleDelete}
        onCancel={handleClose}
        alertTitle="Supprimer le poste"
        alertDescription={`Veuillez confirmer la suppression en saisissant le nom du poste : "${posteToDelete?.name}"`}
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
              onChange={(event) => handleDeleteInputChange(event, "name")}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder={`Tapez "${posteToDelete?.name}"`}
            />
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={alert.isOpen}
        onSubmit={() => updatePoste(posteToEdit)}
        onCancel={() => setAlert((prev) => ({ ...prev, isOpen: false }))}
        alertTitle={
          `Modifier le poste "${posteToEdit?.name}"` || "Modifier le poste"
        }
        alertDescription="Veuillez remplir les champs suivants pour modifier le poste."
        submitBtnName="Modifier"
        cancelBtnName="Annuler"
        type="success"
        onClose={() => setAlert((prev) => ({ ...prev, isOpen: false }))}
      >
        <div className="p-4">
          <div className="flex flex-col">
            <label htmlFor="editName" className="text-sm font-medium">
              Nom :
            </label>
            <input
              id="editName"
              type="text"
              value={editFormData.name}
              onChange={(event) => handleEditInputChange(event, "name")}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Nom"
            />
          </div>
          <div className="flex flex-col mt-4">
            <label htmlFor="editType" className="text-sm font-medium">
              Type :
            </label>
            <select
              id="editType"
              value={editFormData.type}
              onChange={(event) => handleEditInputChange(event, "type")}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="simple_sans_risque">Simple sans risque</option>
              <option value="simple_avec_risque">Simple avec risque</option>
              <option value="compliqué_sans_risque">
                Compliqué sans risque
              </option>
              <option value="compliqué_avec_risque">
                Compliqué avec le risque
              </option>
            </select>
          </div>
          <div className="flex flex-col mt-4">
            <label htmlFor="editLignes" className="text-sm font-medium">
              Lignes :
            </label>
            <div id="lignes" className="flex flex-col mt-2">
              {ligneOptions.map((ligne) => (
                <label key={ligne.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={ligne.id}
                    checked={editFormData.lignes?.includes(ligne.id) || false}
                    onChange={(event) =>
                      handleEditInputChange(event, "lignes", ligne.id)
                    }
                    className="mr-2"
                  />
                  <span>{ligne.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default PostesTable;
