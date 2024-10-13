import React, { useEffect, useState } from "react";
import { CardBody, CardContainer, CardItem } from "@/Components/3DCard/3d-card";
import Link from "next/link";
import Image from "next/image";
import ResponsivePagination from "react-responsive-pagination";
import moduleImage1 from "@/images/modules/image1.jpg";
import moduleImage2 from "@/images/modules/image2.jpg";
import moduleImage3 from "@/images/modules/image3.jpg";
import moduleImage4 from "@/images/modules/image4.jpg";
import { deleteWithAuth, fetchWithAuth, putWithAuth } from "@/utils/api";
import "@/css/pagination.css";
import Modal from "../GlobalModal/Modal";
import useAlert from "@/Hooks/useAlert";
import { on } from "events";
import Supervisors from "../SupervisorsCard/Supervisors";
import { Delete, Plus } from "lucide-react";
import GlobalButton from "../globalButton/globalButton";

// Import more images as needed

interface Module {
  id: number;
  name: string;
  superviseur_nom: string;
  superviseur_prenom: string;
  superviseur: number;
}

const LigneCards = ({}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [modules, setModules] = useState<Module[]>([]);
  const [data2, setData] = useState<Module[]>([]);
  const [Supervisors, setSupervisors] = useState<any[]>([]);
  const [LignetoEdit, setLignetoEdit] = useState<Module | null>(null);

  const { alert, setAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (LignetoEdit) {
      setLignetoEdit({ ...LignetoEdit, name: e.target.value });
    }
  };

  const handleSupervisorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (LignetoEdit) {
      setLignetoEdit({ ...LignetoEdit, superviseur: parseInt(e.target.value) });
    }
  };

  const getRandomImage = () => {
    const images = [moduleImage1, moduleImage2, moduleImage3, moduleImage4];
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const totalpages = Math.ceil((modules as any)?.count / 3);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetchWithAuth(`api/lignes?page=${currentPage}`);
      const supres = await fetchWithAuth(`api/supervisors`);
      setModules(response);
      setSupervisors(supres.results);
      setData(response.results);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }
  const DeleteLigne = async (id: number) => {
    try{
      await deleteWithAuth(`api/lignes/${id}/`);
      fetchData();
    }catch(error){
      console.error(error);
    }
    }

  const updateLigne = async (ligne: Module) => {
    const payload = {
      name: ligne.name,
      superviseur: ligne.superviseur,
    };
    // console.log(payload);
    
    try {
      await putWithAuth(`api/lignes/${ligne.id}/`, payload);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  return (
    <div>
      <div className="flex text-graydark justify-between mx-8">
        {data2?.map((module: Module, index: number) => (
          <div
            className="w-1/3"
            key={index}
            onClick={() => {
              console.log(currentPage);
            }}
          >
            <CardContainer className="w-11/12">
              <CardBody className="bg-zinc-100 relative group/card shadow-card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-2 border">
                <CardItem
                  translateZ="50"
                  className="text-xl font-bold text-neutral-600 dark:text-white"
                >
                  {module.name}
                </CardItem>
                <CardItem
                  as="p"
                  translateZ="60"
                  className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                >
                  {module.superviseur_nom ? (
                    <p>
                      Supervisé par{" "}
                      <span className="font-bold">
                        {module.superviseur_nom} {module.superviseur_prenom}
                      </span>{" "}
                    </p>
                  ) : (
                    <p>Supervisé par personne</p>
                  )}
                </CardItem>
                <CardItem translateZ="100" className="w-full mt-4">
                  <Image
                    src={getRandomImage()}
                    height="1000"
                    width="1000"
                    className="h-50 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                    alt="thumbnail"
                  />
                </CardItem>
                <div className="flex justify-between items-center mt-10">
                  <a
                    onClick={() => {
                      DeleteLigne(module.id);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-normal text-red cursor-pointer hover:bg-red hover:text-white dark:hover:bg-red-500 dark:hover:text-white"
                  >
                    Supprimer
                  </a>
                  <CardItem
                    onClick={() => {
                      setLignetoEdit(module);
                      setAlert((prev) => ({ ...prev, isOpen: true }));
                    }}
                    translateZ={20}
                    as="button"
                    className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Edit
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          </div>
        ))}
      </div>

      <ResponsivePagination
        current={currentPage}
        total={totalpages}
        onPageChange={handlePageChange}
      />
      {/* <GlobalButton
        onClick={() => (window.location.href = "/AddLigne")}
        className="bg-blue-950 w-14 h-14 rounded-full flex items-center justify-center left-0 shadow-xl text-white "
        aria-label="add"
      >
        <Plus />
      </GlobalButton> */}
      <Modal
        isOpen={alert.isOpen}
        onClose={() => {
          setAlert((prev) => ({ ...prev, isOpen: false }));
        }}
        alertTitle={"Modifications sur la ligne"}
        type="success"
        alertDescription={"Edit "}
        submitBtnName={"Modifier"}
        cancelBtnName="Annuler"
        onSubmit={() => {
          if (LignetoEdit) {
            updateLigne(LignetoEdit);
          }
          setAlert((prev) => ({ ...prev, isOpen: false }));
        }}
        onCancel={() => {
          setAlert((prev) => ({ ...prev, isOpen: false }));
        }}
      >
        <form className="flex flex-col">
          <input
            type="text"
            value={LignetoEdit?.name || ""}
            onChange={handleNameChange}
          />
          <select
            value={LignetoEdit?.superviseur || ""}
            onChange={handleSupervisorChange}
          >
            {Supervisors.map((supervisor: any) => (
              <option key={supervisor.id} value={supervisor.id}>
                {supervisor.agent.nom}
              </option>
            ))}
          </select>
        </form>
      </Modal>
    </div>
  );
};

export default LigneCards;
