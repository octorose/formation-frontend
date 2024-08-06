import React, { useEffect, useState } from "react";
import ResponsivePagination from "react-responsive-pagination";
import "@/css/pagination.css";

import useAlert from "@/Hooks/useAlert";
import Modal from "@/Components/GlobalModal/Modal";
import { EditIcon, TrashIcon } from "lucide-react";
import Loader from "@/Components/Loaders/Loader";
import Swal from "sweetalert2";
import { refreshToken } from "@/utils/RefreshToken";
import PhaseRenderer from "../phaserenderer/PhaseRenderer";
import { deleteWithAuth, fetchWithAuth, putWithAuth } from "@/utils/api";
import { validateCINLength } from "@/utils/cinValidation";
import { validatePhoneNumber } from "@/utils/phoneValidation";
import { calculateAge } from "@/utils/calculateAge";

interface Agent {
  address: string;
  cin: string;
  date_joined: string;
  date_naissance: string;
  email: string;
  first_name: string;
  groups: any[];
  id: number;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  last_login: string;
  last_name: string;
  nom: string;
  numertel: string;
  prenom: string;
  role: string;
  temporary_session: boolean;
  user_permissions: any[];
  username: string | null;
}

interface CandidateData {
  agent: Agent;
  etat: string;
  id: number;
}

interface TableHeaderProps {
  header: string;
  index: number;
  totalHeaders: number;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  header,
  index,
  totalHeaders,
}) => {
  const isFirst = index === 0;
  const isLast = index === totalHeaders - 1;

  const classNames = `py-3.5 pl-4 pr-3 text-center text-white dark:text-black font-medium text-lg bg-black dark:bg-white text-neutral-500
  ${isFirst ? "rounded-tl-xl" : ""}
  ${isLast ? "rounded-tr-xl" : ""}`;

  return <th className={classNames}>{header}</th>;
};


function CustomTable({
  headers,
  searchResults,
}: {
  headers: string[];
  searchResults: any;
}) {
  
  const perpage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(Array(15).fill(false));
  const [data2, setData] = useState<CandidateData[]>();
  const [CandidateNameToDelete, setCandidateNameToDelete] = useState();
  const [CandidatetoEdit, setCandidatetoEdit] = useState({} as any);
  let fetched: any;
  const totalPages = Math.ceil((data2 as any)?.count / perpage);
  const { alert, setAlert } = useAlert();
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

  const DeleteCandidate = async (Candidate: any) => {

    //@ts-ignore
    if (CandidateNameToDelete?.Nom === Candidate.agent.nom) {

      try {
        const response = await deleteWithAuth(`/api/delete_personnel/${Candidate.id}/`);
        if (!response) {
          Toast.fire({
            icon: 'success',
            title: 'Candidat supprimé avec succès !',
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
        title: "Invalid Candidate name",
      });
    }
  };
 
  const handleDeleteInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    setCandidateNameToDelete((prevCandidateNameToDelete: any) => ({
      ...prevCandidateNameToDelete,
      [key]: event.target.value,
    }));
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
        const fetchedData = await fetchWithAuth(
          `api/personnel/?page=${currentPage}`
        );
        setData(fetchedData);
        setIsLoading(false);

    } catch (error) {
      console.error(error);
    }
  };
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  }
  const updateCandidate = async (Candidate: any) => {
    console.log(Candidate);
    if (!validateCINLength(Candidate.agent.cin)) {
      Toast.fire({
        icon: 'error',
        title: 'Le CIN doit commencer par une ou deux lettres suivies de 4 à 6 chiffres.',
        iconColor: 'red',
      });
      return;
    }
    if (!validatePhoneNumber(Candidate.agent.numerotel)) {
      Toast.fire({
        icon: 'error',
        title: 'Numéro de téléphone invalide !',
        iconColor: 'red',
      });
      return;
    }
   
    if (!calculateAge(Candidate.agent.date_naissance)) {
      Toast.fire({
        icon: 'error',
        title: 'Âge invalide !',
        iconColor: 'red',
      });
      return;
    }
    try {
      const response = await putWithAuth(`/api/update_personnel/${Candidate.id}/`, Candidate);
      Toast.fire({
        icon: 'success',
        title: 'Candidats mis à jour avec succès !',
        iconColor: 'green',
      });

      fetchData();
      setAlert((prev) => ({ ...prev, isOpen: false }));
      fetchData();

      // const data = await response.json();
      setAlert((prev) => ({ ...prev, isOpen: false }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetched = fetchData();
  }, [currentPage]);
  const PersonalInfo = {
    nom: CandidatetoEdit?.agent?.nom,
    prenom: CandidatetoEdit?.agent?.prenom,
    cin: CandidatetoEdit?.agent?.cin,
    date_naissance: CandidatetoEdit?.agent?.date_naissance,
    // date_joined: CandidatetoEdit?.agent?.date_joined,
    etat: CandidatetoEdit?.etat,
  };

  return (
    <div className="w-full">
      {!isLoading ? (
        <div>
          <div className=" flex justify-center">
            <table className="w-9/12 ">
              <thead className="rounded-t-xl   rounded-b-xl">
                <tr
                  className="rounded-lg h-12 flex-shrink-0 bg-ft-gray-dark-blue rounded-t-xl rounded-b-xl"
                  onClick={() => {
                    // console.log(data2);
                  }}
                >
                  {headers?.map((header, index) => (
                    <TableHeader
                      key={index}
                      header={header}
                      index={index}
                      totalHeaders={headers.length}
                    />
                  ))}
                </tr>
              </thead>
              <tbody>
                {searchResults !== undefined && searchResults.length > 0 ? (
                  //@ts-ignore
                  searchResults?.map((item: any) => (
                    <tr
                      key={item.id}
                      className=" p-2 py-5 text-center rounded-t-lg rounded-b-lg border-b-2 text-base  cursor-pointer text-neutral-900"
                    >
                      <td
                        className=""
                        onClick={() => {
                          // console.log(item);
                          setAlert((prev) => ({ ...prev, isOpen: true }));
                          setCandidatetoEdit(item);
                        }}
                      >
                        {item.agent["nom"]}
                      </td>
                      <td
                        className=""
                        onClick={() => {
                          // console.log(item);
                          setAlert((prev) => ({ ...prev, isOpen: true }));
                          setCandidatetoEdit(item);
                        }}
                      >
                        {item.agent["prenom"]}
                      </td>
                      <td
                        className=""
                        onClick={() => {
                          // console.log(item);
                          setAlert((prev) => ({ ...prev, isOpen: true }));
                          setCandidatetoEdit(item);
                        }}
                      >
                        {item.agent["cin"]}
                      </td>
                      <td
                        className=""
                        onClick={() => {
                          // console.log(item);
                          setAlert((prev) => ({ ...prev, isOpen: true }));
                          setCandidatetoEdit(item);
                        }}
                      >
                        {item.agent["numerotel"]}
                      </td>
                      <td
                        className=""
                        onClick={() => {
                          // console.log(item);
                          setAlert((prev) => ({ ...prev, isOpen: true }));
                          setCandidatetoEdit(item);
                        }}
                      >
                        {formatDate(item.agent["date_naissance"])}
                      </td>
                      <td
                        className=""
                        onClick={() => {
                          // console.log(item);
                          setAlert((prev) => ({ ...prev, isOpen: true }));
                          setCandidatetoEdit(item);
                        }}
                      >
                        {formatDate(item.agent["date_joined"])}
                      </td>
                      <td
                        className=""
                        onClick={() => {
                          // console.log(item);
                          setAlert((prev) => ({ ...prev, isOpen: true }));
                          setCandidatetoEdit(item);
                        }}
                      >
                        {item.etat}
                      </td>

                      <button
                        onClick={() => {
                          setCandidatetoEdit(item);
                          setAlert2((prev) => ({ ...prev, isOpen: true }));
                        }}
                      >
                        <TrashIcon
                          size={20}
                          className="w-4 h-4 text-red-500 cursor-pointer hover:animate-bounce "
                        />
                      </button>
                    </tr>
                  ))
                ) : (
                  <>
                    {data2 &&
                      //@ts-ignore
                      data2?.results?.map((item: any) => (
                        <tr
                          key={item.id}
                          className=" text-center rounded-t-lg rounded-b-lg border-b-2 text-lg  cursor-pointer text-neutral-900"
                        >
                          <td
                            className=""
                            onClick={() => {
                              // console.log(item);
                              setAlert((prev) => ({ ...prev, isOpen: true }));
                              setCandidatetoEdit(item);
                            }}
                          >
                            {item.agent["nom"]}
                          </td>
                          <td
                            className=""
                            onClick={() => {
                              // console.log(item);
                              setAlert((prev) => ({ ...prev, isOpen: true }));
                              setCandidatetoEdit(item);
                            }}
                          >
                            {item.agent["prenom"]}
                          </td>
                          <td
                            className=""
                            onClick={() => {
                              // console.log(item);
                              setAlert((prev) => ({ ...prev, isOpen: true }));
                              setCandidatetoEdit(item);
                            }}
                          >
                            {item.agent["cin"]}
                          </td>
                          <td
                            className=""
                            onClick={() => {
                              
                              setAlert((prev) => ({ ...prev, isOpen: true }));
                              setCandidatetoEdit(item);
                            }}
                          >
                            {item.agent["numerotel"]}
                          </td>
                          <td
                            className=""
                            onClick={() => {
                              // console.log(item);
                              setAlert((prev) => ({ ...prev, isOpen: true }));
                              setCandidatetoEdit(item);
                            }}
                          >
                            {formatDate(item.agent["date_naissance"])}
                          </td>
                          <td
                            className=""
                            onClick={() => {
                              // console.log(item);
                              setAlert((prev) => ({ ...prev, isOpen: true }));
                              setCandidatetoEdit(item);
                            }}
                          >
                            {formatDate(item.agent["date_joined"])}
                          </td>
                          <td
                            className=""
                            onClick={() => {
                              // console.log(item);
                              setAlert((prev) => ({ ...prev, isOpen: true }));
                              setCandidatetoEdit(item);
                            }}
                          >
                            {item.etat}
                          </td>

                          <button
                            onClick={() => {
                              setCandidatetoEdit(item);
                              setAlert2((prev) => ({ ...prev, isOpen: true }));
                            }}
                          >
                            <TrashIcon
                              size={20}
                              className="w-4 h-4 text-red-500 cursor-pointer hover:animate-bounce "
                            />
                          </button>
                        </tr>
                      ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
          <ResponsivePagination
            current={currentPage}
            total={totalPages}
            onPageChange={(newPage) => setCurrentPage(newPage)}
          />
        </div>
      ) : (
        <Loader />
      )}
      <Modal
        isOpen={alert.isOpen}
        onSubmit={() => {
          // console.log(CandidatetoEdit);
          
          updateCandidate(CandidatetoEdit);
        }}
        onCancel={() => {
          setAlert((prev) => ({ ...prev, isOpen: false }));
        }}
        alertTitle={
          "Edit " + CandidatetoEdit?.agent?.nom + " Details" ||
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
          CandidatetoEdit={CandidatetoEdit}
          setCandidatetoEdit={setCandidatetoEdit}
        />
      </Modal>
      <Modal
        isOpen={alert2.isOpen}
        onSubmit={() => DeleteCandidate(CandidatetoEdit)}
        onCancel={() => {
          setAlert2((prev) => ({ ...prev, isOpen: false }));
        }}
        alertTitle={"Delete Candidate"}
        alertDescription={
          `If You are sure type the Candidates Name "` +
          CandidatetoEdit?.agent?.nom +
          `" to confirm your request`
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
              placeholder={`Tapez "${ CandidatetoEdit?.agent?.nom}"`}
            />
            </div>
          </div>
      
      </Modal>
    </div>
  );
}

export default CustomTable;
