import React, { useEffect, useState } from "react";
import ResponsivePagination from "react-responsive-pagination";
import { deleteWithAuth, fetchWithAuth } from "@/utils/api";
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
  lignes: Lignes;
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
  // 
  console.log(Candidate);
};
const PersonalInfo = {
  nom : SupervisortoEdit?.agent?.nom,
  prenom : SupervisortoEdit?.agent?.prenom,
  ligne_name: SupervisortoEdit?.ligne_name,
  contract : "we need it from ichraq's code",
}
  const fetchData = async () => {
    const response: ApiResponse<Superviseur> = await fetchWithAuth(
      `${endpoint}?page=${currentPage}`
    ); 
    setSupervisors(response.results);
    setTotalSupervisors(response.count);  
  };
  useEffect(() => {
    fetchData();
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
    // `${process.env.NEXT_PUBLIC_API_URL}${endpoint}/${id}`,
    
    //@ts-ignore
    if (SupervisortoDelete?.Nom === supervisor.agent.nom) {
      // console.log("aywa");
      
      try {
        deleteWithAuth(`${endpoint}/${supervisor.id}`);
        fetchData();
        setAlert2((prev) => ({ ...prev, isOpen: false }));
        console.log("deleted");
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

  return (
    <div className="rounded-sm border border-stroke bg-transparent px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Superviseurs
      </h4>

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
              Ligne_name
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
                    {supervisor.lignes.name[0]}
                  </p>
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">
                    we need it from ichraq's code
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
                    {supervisor.lignes.name}
                  </p>
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">
                    we need it from ichraq's code
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
        <div className="grid grid-cols-2 gap-5 p-4">
          <div className="text-slate-900">
            <div>
              <h2 className="font-semibold">Name</h2>
              <input
                type="text"
                onChange={(event) => handleDeleteInputChange(event, "Nom")}
                className="w-full p-2 border border-neutral-200 rounded-lg"
              />
            </div>
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
        />
      </Modal>
    </div>
  );
}

export default SupervisorsTable;
