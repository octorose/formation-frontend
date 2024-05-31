import React, { useEffect, useState } from "react";
import ResponsivePagination from "react-responsive-pagination";
import "@/css/pagination.css";
import useAlert from "@/Hooks/useAlert";
import Modal from "@/Components/GlobalModal/Modal";
import { EditIcon, TrashIcon } from "lucide-react";
import Loader from "@/Components/Loaders/Loader";
import DashHeader from "../Header/DashHeader";
import Swal from "sweetalert2";
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

  const classNames = `py-3.5 pl-4 pr-3 text-center font-medium text-sm text-neutral-500
  ${isFirst ? "rounded-l-xl" : ""}
  ${isLast ? "rounded-r-xl" : ""}`;

  return <th className={classNames}>{header}</th>;
};

function CustomTable({ headres }: { headres: string[]; data2?: any }) {
  const perpage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setisLoading] = useState(false);
  const [phase, setPhase] = useState(1);
  const [editMode, setEditMode] = useState(Array(15).fill(false));
  const [data2, setData] = useState();
  const [CandidateNameToDelete, setCandidateNameToDelete] = useState();
  const [CandidatetoEdit, setCandidatetoEdit] = useState({} as any);
  let fetched: any;
  const totalPages = Math.ceil((data2 as any)?.count / perpage);
  const { alert, setAlert } = useAlert();
  const { alert:alert2, setAlert:setAlert2 } = useAlert();
  const handleEdit = (index: any) => {
    const updatedEditMode = [...editMode];
    if (updatedEditMode[index]) {
      updatedEditMode[index] = false;
    } else {
      updatedEditMode[index] = true;
    }
    setEditMode(updatedEditMode);
  };
  const SetToFalse = () => {
    setEditMode(Array(15).fill(false));
  };
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    setCandidatetoEdit((prevCandidatetoEdit: any) => ({
      ...prevCandidatetoEdit,
      [key]: event.target.value,
    }));
  };

  const renderPhaseFields = (fields: any) => (
    <div className="grid grid-cols-2 gap-5 p-4">
      {Object.keys(fields).map((key, index) => (
        <div key={index} className="text-slate-900">
          <div>
            <h2 className="font-semibold">{key}</h2>
            {editMode[index] ? (
              <input
                type="text"
                onChange={(event) => handleInputChange(event, key)}
                className="w-full p-2 border border-neutral-200 rounded-lg"
              />
            ) : (
              <div className="flex flex-row items-center justify-between">
                <h2>
                  {CandidatetoEdit[key]?.toString().length > 10
                    ? CandidatetoEdit[key].toString().slice(0, 6) + "..."
                    : CandidatetoEdit[key]}
                </h2>
                <EditIcon
                  className="w-6 h-6"
                  onClick={() => handleEdit(index)}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
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
    if(CandidateNameToDelete?.Nom === Candidate.Nom){
    try {
      const response = await fetch(`/api/Candidates?id=${Candidate._id}`, {
        method: "DELETE",

      });
      if (!response.ok) {
        throw new Error("Failed to delete candidate");
      }
      const data = await response.json();
    } catch (error) {
      console.error(error);
    }}
    else{
      Toast.fire({
        icon: "warning",
        title: "Invalid PR Id",
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

  const personalInfo = {
    Nom: CandidatetoEdit.Nom,
    Prenom: CandidatetoEdit.Prenom,
    Date_naissance: CandidatetoEdit.Date_naissance,
    Addresse: CandidatetoEdit.Addresse,
    Sexe: CandidatetoEdit.Sexe,
  };
  const ApplicationInfo = {
    CV_Select: CandidatetoEdit.CV_Select,
    ApplicationSource: CandidatetoEdit.ApplicationSource,
    Pr_ID: CandidatetoEdit.Pr_ID,
    Candidt_Decline: CandidatetoEdit.Candidt_Decline,
  };
  const InterviewsInfo = {
    Accepted: CandidatetoEdit.Accepted,
    AcceptedE1: CandidatetoEdit.AcceptedE1,
    AcceptedE2: CandidatetoEdit.AcceptedE2,
    AcceptedE3: CandidatetoEdit.AcceptedE3,
  };
  const ProfessionalInfo = {
    ID: CandidatetoEdit.ID,
    Status: CandidatetoEdit.Status,
    Date_creation_Contrat: CandidatetoEdit.Date_creation_Contrat,
    Type_contract: CandidatetoEdit.Type_contract,
  };
  const UpdateCandidate = async (CandidatetoEdit: any) => {
    try {
      const response = await fetch(
        `/api/Candidates/Update?id=${CandidatetoEdit.ID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(CandidatetoEdit),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update candidate");
      }
      const data = await response.json();
    } catch (error) {
      console.error(error);
    }
  };
  const dummydata = {
    data: [
      {
        Nom: "Only_Exemple",
        Prenom: "Only_Exemple",
        Date_naissance: "Only_Exemple",
        Addresse: "1234 Main St",
        Sexe: "M",
        CV_Select: "CV",
        ApplicationSource: "Only_Exemple",
        Pr_ID: "123456",
        Candidt_Decline: "No",
        Accepted: "Yes",
        AcceptedE1: "Yes",
        AcceptedE2: "Yes",
        AcceptedE3: "Yes",
        ID: "123456",
        Status: "Pending",
        Date_creation_Contrat: "01/01/2021",
        Type_contract: "Full Time",
      },
      {
        Nom: "Jane",
        Prenom: "Doe",
        Date_naissance: "01/01/1990",
        Addresse: "1234 Main St",
        Sexe: "F",
        CV_Select: "CV",
        ApplicationSource: "Indeed",
        Pr_ID: "123456",
        Candidt_Decline: "No",
        Accepted: "Yes",
        AcceptedE1: "Yes",
        AcceptedE2: "Yes",
        AcceptedE3: "Yes",
        ID: "123456",
        Status: "Pending",
        Date_creation_Contrat: "01/01/2021",
        Type_contract: "Full Time",
      },
      {
        Nom: "John",
        Prenom: "Doe",
        Date_naissance: "01/01/1990",
        Addresse: "1234 Main St",
        Sexe: "M",
        CV_Select: "CV",
        ApplicationSource: "Indeed",
        Pr_ID: "123456",
        Candidt_Decline: "No",
        Accepted: "Yes",
        AcceptedE1: "Yes",
        AcceptedE2: "Yes",
        AcceptedE3: "Yes",
        ID: "123456",
        Status: "Pending",
        Date_creation_Contrat: "01/01/2021",
        Type_contract: "Full Time",
      },
      {
        Nom: "Jane",
        Prenom: "Doe",
        Date_naissance: "01/01/1990",
        Addresse: "1234 Main St",
        Sexe: "F",
        CV_Select: "CV",
        ApplicationSource: "Indeed",
        Pr_ID: "123456",
        Candidt_Decline: "No",
        Accepted: "Yes",
        AcceptedE1: "Yes",
        AcceptedE2: "Yes",
        AcceptedE3: "Yes",
        ID: "123456",
        Status: "Pending",
        Date_creation_Contrat: "01/01/2021",
        Type_contract: "Full Time",
      },
      {
        Nom: "John",
        Prenom: "Doe",
        Date_naissance: "01/01/1990",
        Addresse: "1234 Main St",
        Sexe: "M",
        CV_Select: "CV",
        ApplicationSource: "Indeed",
        Pr_ID: "123456",
        Candidt_Decline: "No",
        Accepted: "Yes",
        AcceptedE1: "Yes",
        AcceptedE2: "Yes",
        AcceptedE3: "Yes",
        ID: "123456",
        Status: "Pending",
        Date_creation_Contrat: "01/01/2021",
        Type_contract: "Full Time",
      },
    ],
  };

  const fetchData = async () => {
    try {
      setisLoading(true);
      const response = await fetch(`/api/Candidates?page=${currentPage}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setData(data);
      setisLoading(false);
    } catch (error) {
      console.error(error);
    }

    return data2;
  };
  const filterCandidateByName = async (name: string) => {
    try {
      setisLoading(true);
      const allCandidates = await fetch("/api/Candidates/All");
      if (!allCandidates.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await allCandidates.json();
      const filtreddata = {
        data: data.data.filter((candidate: any) =>
          candidate.Nom.toLowerCase().includes(name.toLowerCase())
        ),
      };

      // @ts-ignore
      setData(filtreddata);
      setisLoading(false);
    } catch (error) {
      console.error(error);
    }
    return data2;
  };
  useEffect(() => {
    fetched = fetchData();
  }, [currentPage]);
  const handleSubmit = async () => {
    if (phase === 3) {
      SetToFalse();
      await UpdateCandidate(CandidatetoEdit);
      setCurrentPage(currentPage);
      fetchData();
      setAlert((prev) => {
        return {
          ...prev,
          isOpen: false,
        };
      });
    } else {
      setPhase(phase + 1);
      SetToFalse();
    }
  };
  return (
    <div className="w-full">
      {!isLoading ? (
        <div>
          <DashHeader
            handleSearch={filterCandidateByName}
            Candidate={data2}
            Topic="Candidate"
          />
          <div className="flex justify-center">
            <table className=" ">
              <thead className="rounded-t-xl rounded-b-xl">
                <tr className="rounded-lg h-12 flex-shrink-0 bg-ft-gray-dark-blue rounded-t-xl rounded-b-xl">
                  {headres?.map((header, index) => (
                    <TableHeader
                      key={index}
                      header={header}
                      index={index}
                      totalHeaders={headres.length}
                    />
                  ))}
                </tr>
              </thead>
              <tbody>
                {data2 &&
                  // @ts-ignore
                  data2?.data?.map(
                    (item: any, index: React.Key | null | undefined) => (
                      <tr
                        key={index}
                        className="p-2 text-center rounded-t-lg rounded-b-lg text-neutral-500 hover:border-ft-lt/30 cursor-pointer"
                      >
                        {Object.values(item).map((value, index) =>
                          index < headres.length ? (
                            <td
                              key={index}
                              className="py-4 px-6 border-b  border-neutral-200"
                              onClick={() => {
                                setCandidatetoEdit(item),
                                  setAlert((prev) => {
                                    return {
                                      ...prev,
                                      onCancel: () => {
                                        setAlert((prev) => {
                                          return {
                                            ...prev,
                                            isOpen: false,
                                          };
                                        });
                                      },
                                      isOpen: true,
                                    };
                                  });
                              }}
                            >
                              <div className="flex justify-center gap-2 items-center">
                                <p>{item[headres[index]]}</p>
                                {item[headres[index]] === "Pending" ? (
                                  <div className="bg-yellow-600 rounded-3xl w-2 h-2"></div>
                                ) : item[headres[index]] === "Yes" ? (
                                  <div className="bg-green-600 rounded-3xl w-2 h-2"></div>
                                ) : item[headres[index]] === "No" ? (
                                  <div className="bg-red-600 rounded-3xl w-2 h-2"></div>
                                ) : (
                                  <></>
                                )}
                              </div>
                            </td>
                          ) : null
                        )}
                        <td className="py-4 px-6 border-b border-neutral-200">
                          <div className="flex justify-center gap-2 items-center">
                            <TrashIcon
                              className="w-4 h-4 text-red-500 cursor-pointer hover:animate-bounce "
                              onClick={() => {
                                setCandidatetoEdit(item),
                                  setAlert2((prev) => {
                                    return {
                                      ...prev,
                                      onCancel: () => {
                                        setAlert2((prev) => {
                                          return {
                                            ...prev,
                                            isOpen: false,
                                          };
                                        });
                                      },
                                      isOpen: true,
                                    };
                                  });
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    )
                  )}
              </tbody>
            </table>
          </div>
          <ResponsivePagination
            current={currentPage}
            total={totalPages}
            onPageChange={(newpage) => setCurrentPage(newpage)}
          />
        </div>
      ) : (
        // <Loader key={"Loader_v0"} />
        <div className="">
          {/* <DashHeader
            handleSearch={filterCandidateByName}
            Candidate={data2}
            Topic="Candidate"
          /> */}
          <div className="">
            <table className="w-full">
              <thead className="rounded-t-xl rounded-b-xl">
                <tr className="rounded-lg h-12 flex-shrink-0 bg-ft-gray-dark-blue rounded-t-xl rounded-b-xl">
                  {headres?.map((header, index) => (
                    <TableHeader
                      key={index}
                      header={header}
                      index={index}
                      totalHeaders={headres.length}
                    />
                  ))}
                </tr>
              </thead>
              <tbody>
                {dummydata &&
                  // @ts-ignore
                  dummydata.data.map(
                    (item: any, index: React.Key | null | undefined) => (
                      <tr
                        key={index}
                        className="p-2 text-center rounded-t-lg text-sm rounded-b-lg text-neutral-500 hover:border-ft-lt/30 cursor-pointer"
                      >
                        {Object.values(item).map((value, index) =>
                          index < headres.length ? (
                            <td
                              key={index}
                              className="py-4 px-6 border-b  border-neutral-800 "
                              onClick={() => {
                                setCandidatetoEdit(item),
                                  setAlert((prev) => {
                                    return {
                                      ...prev,
                                      onCancel: () => {
                                        setAlert((prev) => {
                                          return {
                                            ...prev,
                                            isOpen: false,
                                          };
                                        });
                                      },
                                      isOpen: true,
                                    };
                                  });
                              }}
                            >
                              <div className="flex justify-center gap-2 items-center">
                                <p>{item[headres[index]]}</p>
                                {item[headres[index]] === "Pending" ? (
                                  <div className="bg-yellow-600 rounded-3xl w-2 h-2"></div>
                                ) : item[headres[index]] === "Yes" ? (
                                  <div className="bg-green-600 rounded-3xl w-2 h-2"></div>
                                ) : item[headres[index]] === "No" ? (
                                  <div className="bg-red-600 rounded-3xl w-2 h-2"></div>
                                ) : (
                                  <></>
                                )}
                              </div>
                            </td>
                          ) : null
                        )}
                        <td className="py-4 px-6 border-b border-neutral-200">
                          <div className="flex justify-center gap-2 items-center">
                            <TrashIcon
                              className="w-4 h-4 text-red-500 cursor-pointer hover:animate-bounce "
                              onClick={() => {
                                setCandidatetoEdit(item),
                                  setAlert2((prev) => {
                                    return {
                                      ...prev,
                                      onCancel: () => {
                                        setAlert2((prev) => {
                                          return {
                                            ...prev,
                                            isOpen: false,
                                          };
                                        });
                                      },
                                      isOpen: true,
                                    };
                                  });
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    )
                  )}
              </tbody>
            </table>
          </div>
          <ResponsivePagination
            current={1}
            total={5}
            onPageChange={(newpage) => setCurrentPage(newpage)}
          />
        </div>
      )}
      <Modal
        isOpen={alert.isOpen}
        onSubmit={() => {
          handleSubmit();
        }}
        onCancel={() => {
          setAlert((prev) => ({ ...prev, isOpen: false }));
        }}
        alertTitle={
          "Edit " + CandidatetoEdit?.Nom + " Details" || "Candidate" + "Details"
        }
        alertDescription={"Edit "}
        submitBtnName={phase === 3 ? "Submit" : "Next"}
        cancelBtnName="Cancel"
        type="success"
        onClose={() => {
          setAlert((prev) => ({ ...prev, isOpen: false }));
          setPhase(1);
        }}
      >
        {phase === 1 && renderPhaseFields(personalInfo)}
        {phase === 2 && renderPhaseFields(ApplicationInfo)}
        {phase === 3 && renderPhaseFields(InterviewsInfo)}
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
          CandidatetoEdit.Nom +
          `" to confirme your request`
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
    </div>
  );
}

export default CustomTable;
