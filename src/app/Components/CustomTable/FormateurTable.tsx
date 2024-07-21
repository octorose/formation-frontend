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
import { getRoleFromToken } from "@/utils/getRoleFromToken";
import { validatePhoneNumber } from "@/utils/phoneValidation";
import { calculateAge } from "@/utils/calculateAge";
import { validateCINLength } from "@/utils/cinValidation";

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

interface FormateurData {
  agent: Agent;
  isAffecteur: boolean;
  id: number;
  Type: string;
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

function FormateursTable({
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
  const [data2, setData] = useState<FormateurData[]>([]);
  const [filteredData, setFilteredData] = useState<FormateurData[]>([]);
  const [FormateurNameToDelete, setFormateurNameToDelete] = useState();
  const [FormateurtoEdit, setFormateurtoEdit] = useState({} as any);
  const totalPages = Math.ceil(data2.length / perpage);
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
  const role = getRoleFromToken();

  const DeleteFormateur = async (Formateur: any) => {
    //@ts-ignore
    if (FormateurNameToDelete?.Nom === Formateur.agent.nom) {
      try {
        const response = await deleteWithAuth(
          `api/delete-formateurs/${Formateur.id}/`
        );
        if (!response || response.status === 204) {
          Toast.fire({
            icon: 'success',
            title: 'Formateur supprimé avec succès !',
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
        title: "Invalid Formateur name",
      });
    }
  };

  const handleDeleteInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    setFormateurNameToDelete((prevFormateurNameToDelete: any) => ({
      ...prevFormateurNameToDelete,
      [key]: event.target.value,
    }));
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const fetchedData = await fetchWithAuth(
        `api/formateurs/?page=${currentPage}`
      );
      setData(fetchedData.results);
      console.log(fetchedData.results);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  
  const filterData = () => {
    const role = getRoleFromToken();
    if (role === "Superviseur") {
      setFilteredData(data2.filter((formateur) => formateur.Type === "Pratique"));
    } else if (role === "ResponsableEcoleFormation") {
      setFilteredData(data2.filter((formateur) => formateur.Type === "Theorique"));
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [currentPage]);

  useEffect(() => {
    filterData();
  }, [data2]);

  const updateFormateur = async (Formateur: any) => {
    console.log(Formateur);
    if (!validateCINLength(Formateur.agent.cin)) {
      Toast.fire({
        icon: 'error',
        title: 'Le CIN doit commencer par une ou deux lettres suivies de 4 à 6 chiffres.',
        iconColor: 'red',
      });
      return;
    }
    if (!validatePhoneNumber(Formateur.agent.numerotel)) {
      Toast.fire({
        icon: 'error',
        title: 'Numéro de téléphone invalide !',
        iconColor: 'red',
      });
      return;
    }
   
    if (!calculateAge(Formateur.agent.date_naissance)) {
      Toast.fire({
        icon: 'error',
        title: 'Âge invalide !',
        iconColor: 'red',
      });
      return;
    }
    try {
      const response = await putWithAuth(
        `api/update-formateurs/${Formateur.id}/`,
        Formateur
      );
      Toast.fire({
        icon: 'success',
        title: 'Formateur mis à jour avec succès !',
        iconColor: 'green',
      });

      fetchData();
      setAlert((prev) => ({ ...prev, isOpen: false }));
    } catch (error) {
      console.error(error);
    }
  };

  const PersonalInfo = {
    nom: FormateurtoEdit?.agent?.nom,
    prenom: FormateurtoEdit?.agent?.prenom,
    cin: FormateurtoEdit?.agent?.cin,
    Type: FormateurtoEdit?.Type,
    ...(role !== "ResponsableEcoleFormation" && { isAffecteur: FormateurtoEdit?.isAffecteur }),
};
const filteredHeaders = headers.filter(header => 
  !(header === "Affecteur" && role == "ResponsableEcoleFormation")
);


  return (
    <div className="w-full">
      {!isLoading ? (
        <div>
          <div className="flex justify-center">
            <table className="w-9/12">
              <thead className="rounded-t-xl rounded-b-xl">
                <tr className="rounded-lg h-12 flex-shrink-0 bg-ft-gray-dark-blue rounded-t-xl rounded-b-xl">
                {filteredHeaders?.map((header, index) => (
                    <TableHeader
                      key={index}
                      header={header}
                      index={index}
                      totalHeaders={filteredHeaders.length}
                    />
                  ))}
                  </tr>
              </thead>
              <tbody>
                {searchResults !== undefined && searchResults.length > 0 ? (
                  searchResults?.map((item: any) => (
                    <tr
                      key={item.id}
                      className="p-2 py-5 text-center rounded-t-lg rounded-b-lg border-b-2 text-base cursor-pointer text-neutral-900"
                    >
                      <td
                        onClick={() => {
                          setAlert((prev) => ({ ...prev, isOpen: true }));
                          setFormateurtoEdit(item);
                        }}
                      >
                        {item.agent["nom"]}
                      </td>
                      <td
                        onClick={() => {
                          setAlert((prev) => ({ ...prev, isOpen: true }));
                          setFormateurtoEdit(item);
                        }}
                      >
                        {item.agent["prenom"]}
                      </td>
                      <td
                        onClick={() => {
                          setAlert((prev) => ({ ...prev, isOpen: true }));
                          setFormateurtoEdit(item);
                        }}
                      >
                        {item.agent["cin"]}
                      </td>
                      <td
                        onClick={() => {
                          setAlert((prev) => ({ ...prev, isOpen: true }));
                          setFormateurtoEdit(item);
                        }}
                      >
                        {item.agent["numerotel"]}
                      </td>
                      <td
                        onClick={() => {
                          setAlert((prev) => ({ ...prev, isOpen: true }));
                          setFormateurtoEdit(item);
                        }}
                      >
                        {item.Type}
                      </td>
                      {role === "Superviseur" && (
                      <td
                        onClick={() => {
                          setAlert((prev) => ({ ...prev, isOpen: true }));
                          setFormateurtoEdit(item);
                        }}
                      >
                        {item.isAffecteur ? (
                          <p className="text-green-600">Oui</p>
                        ) : (
                          <p className="text-red-600">Non</p>
                        )}
                      </td>
                      )}
                      <button
                        onClick={() => {
                          setAlert2((prev) => ({ ...prev, isOpen: true }));
                          setFormateurNameToDelete(item);
                        }}
                      >
                        <TrashIcon className="w-5 text-red-600" />
                      </button>
                    </tr>
                  ))
                ) : (
                  filteredData?.map((item: any) => (
                    <tr
                      key={item.id}
                      className="p-2 py-5 text-center rounded-t-lg rounded-b-lg border-b-2 text-base cursor-pointer text-neutral-900"
                    >
                      <td
                        onClick={() => {
                          setAlert((prev) => ({ ...prev, isOpen: true }));
                          setFormateurtoEdit(item);
                        }}
                      >
                        {item.agent["nom"]}
                      </td>
                      <td
                        onClick={() => {
                          setAlert((prev) => ({ ...prev, isOpen: true }));
                          setFormateurtoEdit(item);
                        }}
                      >
                        {item.agent["prenom"]}
                      </td>
                      <td
                        onClick={() => {
                          setAlert((prev) => ({ ...prev, isOpen: true }));
                          setFormateurtoEdit(item);
                        }}
                      >
                        {item.agent["cin"]}
                      </td>
                      <td
                        onClick={() => {
                          setAlert((prev) => ({ ...prev, isOpen: true }));
                          setFormateurtoEdit(item);
                        }}
                      >
                        {item.agent["numerotel"]}
                      </td>
                      <td
                        onClick={() => {
                          setAlert((prev) => ({ ...prev, isOpen: true }));
                          setFormateurtoEdit(item);
                        }}
                      >
                        {item.Type}
                      </td>
                      {role === "Superviseur" && (
                      <td
                        onClick={() => {
                          setAlert((prev) => ({ ...prev, isOpen: true }));
                          setFormateurtoEdit(item);
                        }}
                      >
                        {item.isAffecteur ? (
                          <p className="text-green-600">Oui</p>
                        ) : (
                          <p className="text-red-600">Non</p>
                        )}
                      </td>
                      )}
                      <button
                        onClick={() => {
                          setAlert2((prev) => ({ ...prev, isOpen: true }));
                          setFormateurtoEdit(item);
                        }}
                      >
                        <TrashIcon className="w-5 text-red-600" />
                      </button>
                    </tr>
                  ))
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
          // console.log(FormateurtoEdit);

          updateFormateur(FormateurtoEdit);
        }}
        onCancel={() => {
          setAlert((prev) => ({ ...prev, isOpen: false }));
        }}
        alertTitle={
          "Edit " + FormateurtoEdit?.agent?.nom + " Details" ||
          "Formateur" + "Details"
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
          CandidatetoEdit={FormateurtoEdit}
          setCandidatetoEdit={setFormateurtoEdit}
        />
      </Modal>
      <Modal
        isOpen={alert2.isOpen}
        onSubmit={() => DeleteFormateur(FormateurtoEdit)}
        onCancel={() => {
          setAlert2((prev) => ({ ...prev, isOpen: false }));
        }}
        alertTitle={"Delete Formateur"}
        alertDescription={
          `If You are sure type the Formateurs Name "` +
          FormateurtoEdit?.agent?.nom +
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
              placeholder={`Tapez "${FormateurtoEdit?.agent?.nom}"`}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default FormateursTable;
