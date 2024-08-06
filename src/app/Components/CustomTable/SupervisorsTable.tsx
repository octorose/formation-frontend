import React, { useEffect, useState } from "react";
import ResponsivePagination from "react-responsive-pagination";
import { deleteWithAuth, fetchWithAuth, putWithAuth } from "@/utils/api";
import { Agent } from "@/interfaces/Agent";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import useAlert from "@/Hooks/useAlert";
import Modal from "../GlobalModal/Modal";
import Swal from "sweetalert2";
import PhaseRenderer from "../phaserenderer/PhaseRenderer";

interface Lignes {
  id: number;
  name: string;
}

interface Superviseur {
  id: number;
  agent: Agent;
  lignes: Lignes[];
}

interface ApiResponse<T> {
  results: T[];
  count: number;
}

function SupervisorsTable({
  endpoint,
  searchResults,
}: {
  endpoint: string;
  searchResults: any[];
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [supervisors, setSupervisors] = useState<Superviseur[]>([]);
  const [editMode, setEditMode] = useState(Array(15).fill(false));
  const { alert, setAlert } = useAlert();
  const [ligneOptions, setLigneOptions] = useState<Lignes[]>([]);
  const [totalSupervisors, setTotalSupervisors] = useState(0);
  const [SupervisortoDelete, setSupervisortoDelete] = useState({} as any);
  const [SupervisortoEdit, setSupervisortoEdit] = useState({} as any);
  const { alert: alert2, setAlert: setAlert2 } = useAlert();
  const handleEdit = (index: any) => {
    const updatedEditMode = [...editMode];
    if (updatedEditMode[index]) {
      updatedEditMode[index] = false;
    } else {
      updatedEditMode[index] = true;
    }
    setEditMode(updatedEditMode);
  };

  const updateCandidate = async (Candidate: any) => {
    console.log(Candidate);
    
    try{
      await putWithAuth(`${endpoint}/update/${Candidate.id}/`, {
      agent: {
        nom: Candidate.agent.nom,
        prenom: Candidate.agent.prenom,
        email: Candidate.agent.email,
        password: Candidate.agent.password,
        addresse: Candidate.agent.addresse,
        numerotel: Candidate.agent.numerotel,
        date_naissance: Candidate.agent.date_naissance,
        role: "Superviseur",
      },
      lignes_ids: Candidate.lignes,
    });
    Toast.fire({
      icon: 'success',
      title: 'superviseur mis à jour avec succès !',
      iconColor: 'green',
    });

    fetchData();
    setAlert((prev) => ({ ...prev, isOpen: false }));
  } catch (error) {
    console.error('Échec de la mise à jour du superviseur',error);
    Toast.fire({
      icon: 'error',
      title: 'Une erreur est survenue lors de la mise à jour du responsable.',
      iconColor: 'red',
    });
  }
    
  };

  const PersonalInfo = {
    nom: SupervisortoEdit?.agent?.nom,
    prenom: SupervisortoEdit?.agent?.prenom,
    lignes: SupervisortoEdit?.ligne_name,
    contract: "we need it from ichraq's code",
  };

  const fetchData = async () => {
    const response: ApiResponse<Superviseur> = await fetchWithAuth(
      `${endpoint}?page=${currentPage}`
    );
    setSupervisors(response.results);
    setTotalSupervisors(response.count);
  };

  useEffect(() => {
    fetchData();
    fetchLignes();
  }, [currentPage, endpoint]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    iconColor: "orange",
    customClass: {
      popup: "colored-toast",
    },
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });

  const handleDeleteInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    setSupervisortoDelete((prevSupervisorNameToDelete: any) => ({
      ...prevSupervisorNameToDelete,
      [key]: event.target.value,
    }));
  };

  const handleDelete = async (supervisor: any) => {
    //@ts-ignore
    if (SupervisortoDelete?.Nom === supervisor.agent.nom) {
      try {
        const response = await deleteWithAuth(
          `${endpoint}/${supervisor.id}/`
        );
        if (!response || response.status === 204) {
          Toast.fire({
            icon: 'success',
            title: 'Superviseur supprimé avec succès !',
            iconColor: 'green',
          });
        }
        // const data = await response.json();
        fetchData();
        setAlert2((prev) => ({ ...prev, isOpen: false }));
     
      } catch (error) {
        console.error(error);
      }
    } else {
      Toast.fire({
        icon: "error",
        title: "Invalid Supervisor name",
      });
    }
  };
   const fetchLignes = async () => {
     try {
       const response = await fetchWithAuth("/api/lignes/");
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

  return (
    <div className="rounded-sm bg-transparent px-5 pb-2.5 pt-6 dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm text-black dark:text-white bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Nom</h5>
          </div>
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Prenom
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Ligne Names
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Contract
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
            {searchResults.map((supervisor: Superviseur, key: number) => (
              <div
                className={`grid grid-cols-3 sm:grid-cols-5 text-base ${
                  key === supervisors.length - 1
                    ? ""
                    : "border-b border-stroke dark:border-strokedark"
                }`}
                key={key}
              >
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="hidden text-black dark:text-white sm:block">
                    {supervisor.agent.nom}
                  </p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">
                    {supervisor.agent.prenom}
                  </p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">
                    {supervisor.lignes.map((ligne) => ligne.name).join(", ")}
                  </p>
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">
                    we need it from ichraq&apos;s code
                  </p>
                </div>
                <div className="hidden items-center justify-center gap-4 p-2.5 sm:flex xl:p-5">
                  <button
                    className="text-black dark:text-white"
                    onClick={() => {
                      setSupervisortoEdit(supervisor);
                      setAlert((prev) => ({ ...prev, isOpen: true }));
                    }}
                  >
                    <Edit2Icon />
                  </button>
                  <button
                    className="text-black dark:text-white"
                    onClick={() => {
                      setSupervisortoDelete(supervisor);
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
            {supervisors.map((supervisor: Superviseur, key: number) => (
              <div
                className={`grid grid-cols-3 sm:grid-cols-5 text-base ${
                  key === supervisors.length - 1
                    ? ""
                    : "border-b border-stroke dark:border-strokedark"
                }`}
                key={key}
              >
                <div className="flex items-center gap-3 p-2.5 xl:p-5">
                  <p className="hidden text-black dark:text-white sm:block">
                    {supervisor.agent.nom}
                  </p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">
                    {supervisor.agent.prenom}
                  </p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">
                    {supervisor.lignes.map((ligne) => ligne.name).join(", ")}
                  </p>
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">
                    we need it from ichraq&apos;s code
                  </p>
                </div>
                <div className="hidden items-center justify-center gap-4 p-2.5 sm:flex xl:p-5">
                  <button
                    className="text-black dark:text-white"
                    onClick={() => {
                      setSupervisortoEdit(supervisor);
                      setAlert((prev) => ({ ...prev, isOpen: true }));
                    }}
                  >
                    <Edit2Icon />
                  </button>
                  <button
                    className="text-black dark:text-white"
                    onClick={() => {
                      setSupervisortoDelete(supervisor);
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
        total={Math.ceil(totalSupervisors / 10)}
        onPageChange={handlePageChange}
      />
      <Modal
        isOpen={alert2.isOpen}
        onSubmit={() => handleDelete(SupervisortoDelete)}
        onCancel={() => {
          setAlert2((prev) => ({ ...prev, isOpen: false }));
        }}
        alertTitle={"Delete Candidate"}
        alertDescription={
          `Si vous etes sur retaper le nom du superviseur "` +
          SupervisortoDelete?.agent?.nom +
          `" pour comfirmer la suppression`
        }
        submitBtnName={"Delete"}
        cancelBtnName="Cancel"
        type="error"
        onClose={() => {
          setAlert2((prev) => ({ ...prev, isOpen: false }));
        }}
      >
         <div className="p-4">
          <div className="flex flex-col">
            <label htmlFor="deleteName" className="text-sm font-medium">
              Nom :
            </label>
              <input
              id="deleteName"
              type="text"
             
              onChange={(event) => handleDeleteInputChange(event, 'Nom')}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder={`Tapez "${ SupervisortoDelete?.agent?.nom}"`}
            />
            </div>
          </div>
      
      </Modal>
      <Modal
        isOpen={alert.isOpen}
        onSubmit={() => {
          // console.log(SupervisortoEdit);

          updateCandidate(SupervisortoEdit);
        }}
        onCancel={() => {
          setAlert((prev) => ({ ...prev, isOpen: false }));
        }}
        alertTitle={
          "Edit " + SupervisortoEdit?.agent?.nom + " Details" ||
          "Candidate" + "Details"
        }
        alertDescription={"Edit "}
        submitBtnName={"Submit"}
        cancelBtnName="Cancel"
        type="success"
        onClose={() => {
          setAlert((prev) => ({ ...prev, isOpen: false }));
        }}
      >
        <PhaseRenderer
          fields={PersonalInfo}
          editMode={editMode}
          handleEdit={handleEdit}
          CandidatetoEdit={SupervisortoEdit}
          setCandidatetoEdit={setSupervisortoEdit}
          lignes={ligneOptions}
        />
      </Modal>
    </div>
  );
}

export default SupervisorsTable;
