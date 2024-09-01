"use client";
import React, { useState, useEffect } from "react";
import { Button, Input } from "@headlessui/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Loader from "../common/Loader";
import { fetchWithAuth, postWithAuth, putWithAuth } from "@/utils/api";
import { getRoleIdFromToken } from "@/utils/getRoleIdFromToken";
import { Agent } from "@/interfaces/Agent";
import Image from "next/image";
import { Poste } from "@/interfaces/Poste";
import useAlert from "@/Hooks/useAlert";
import Modal from "../GlobalModal/Modal";
import Swal from "sweetalert2";
import Polyvalance from "@/Components/PolyvalanceCard/Polyvalance";
import { getRoleFromToken } from "@/utils/getRoleFromToken";

interface ScoreGridProps {
  score: number | undefined;
}

interface Employee {
  id: string;
  agent: Agent;
  etat: string;
  ligne: number;
  poste: Poste;
}
interface Polyvalence {
  id: number;
  score: number;
  comments: string;
  personnel: number;
  supervisor: number;
  poste: number;
  ligne: number;
}

interface ProductionLine {
  id: string;
  name: string;
}

interface RatedEmployee extends Employee {
  polyvalence: Polyvalence;
}

interface UnRatedEmployee extends Employee {
  polyvalenceId: string; // Add this field to store the Polyvalence ID
  score: number;
  comments: string;
}

const grids: { [key: number]: string[] } = {
  1: [
    "bg-blue-500",
    "bg-white",
    "bg-white",
    "bg-blue-500",
    "bg-white",
    "bg-white",
    "bg-blue-500",
    "bg-white",
    "bg-white",
  ],
  2: [
    "bg-blue-500",
    "bg-white",
    "bg-white",
    "bg-blue-500",
    "bg-white",
    "bg-white",
    "bg-blue-500",
    "bg-blue-500",
    "bg-blue-500",
  ],
  3: [
    "bg-blue-500",
    "bg-white",
    "bg-blue-500",
    "bg-blue-500",
    "bg-white",
    "bg-blue-500",
    "bg-blue-500",
    "bg-blue-500",
    "bg-blue-500",
  ],
  4: [
    "bg-blue-500",
    "bg-blue-500",
    "bg-blue-500",
    "bg-blue-500",
    "bg-white",
    "bg-blue-500",
    "bg-blue-500",
    "bg-blue-500",
    "bg-blue-500",
  ],
};

export default function Polyvalence() {
  const [ratedOperateurs, setRatedOperateurs] = useState<RatedEmployee[]>([]);
  const [unratedOperateurs, setUnratedOperateurs] = useState<RatedEmployee[]>(
    []
  );
  const [productionLines, setProductionLines] = useState<ProductionLine[]>([]);
  const [productionLine, setProductionLine] = useState("");
  const { alert, setAlert } = useAlert();
  const { alert: alert2, setAlert: setAlert2 } = useAlert();
  const [operatortoedit, setOperatorToEdit] = useState<Polyvalence>();
  const [operatorToAdd, setOperatorToAdd] = useState<Polyvalence>();
  const [postToAdd, setpostToAdd] = useState<RatedEmployee>();
  const [searchQuery, setSearchQuery] = useState("");
  const [ratedLoading, setRatedLoading] = useState(true);
  const [unratedLoading, setUnratedLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (productionLine) {
      fetchRatedOperateurs();
      fetchUnratedOperateurs();
    }
  }, [productionLine]);

  useEffect(() => {
    fetchLignes();
    if (getRoleFromToken() === "RH") {
      fetchRHLignes();
      
    }
  }, []);

  const fetchRatedOperateurs = async () => {
    setRatedLoading(true);
    setError("");
    try {
      const response = await fetchWithAuth(
        `/api/rated-operators/${productionLine}/`
      );
      setRatedOperateurs(
        response.map((operator: any) => ({
          ...operator,
          polyvalenceId: operator.polyvalence.id, // Ensure you have the Polyvalence ID
        }))
      );
    } catch (error: any) {
      setError(error.message);
      setRatedOperateurs([]);
    } finally {
      setRatedLoading(false);
    }
  };

  const fetchRHLignes = async () => {
    setRatedLoading(true);
    setError("");
    try {
      const response = await fetchWithAuth(`api/lignes/`);
      setProductionLines(response.results);
      if (response.results.length > 0) {
        setProductionLine(response.results[0].id);
      }
    } catch (error: any) {
      setError(error.message);
      setRatedOperateurs([]);
    } finally {
      setRatedLoading(false);
    }
  };

  const fetchLignes = async () => {
    setRatedLoading(true);
    setError("");
    try {
      const response = await fetchWithAuth(
        `api/supervisor-lignes/${getRoleIdFromToken()}/`
      );
      setProductionLines(response.results);
      if (response.results.length > 0) {
        setProductionLine(response.results[0].id);
      }
    } catch (error: any) {
      setError(error.message);
      setRatedOperateurs([]);
    } finally {
      setRatedLoading(false);
    }
  };

  const fetchUnratedOperateurs = async () => {
    setUnratedLoading(true);
    setError("");
    try {
      const response = await fetchWithAuth(
        `api/unrated-operators/${productionLine}/`
      );
      setUnratedOperateurs(response);
    } catch (error: any) {
      setError(error.message);
      setUnratedOperateurs([]);
    } finally {
      setUnratedLoading(false);
    }
  };
  const AddPolyvalence = async (payload: any) => {
    try {
      const res = await postWithAuth(`api/polyvalences/`, payload);
      console.log(res);
      setAlert2((prev) => ({ ...prev, isOpen: false }));
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        iconColor: "green",
        customClass: {
          popup: "colored-toast",
        },
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "success",
        title: "Polyvalence ajouté avec succès !",
      });
      fetchRatedOperateurs();
      fetchUnratedOperateurs();
    } catch (err) {
      console.log(err);
    }
  };

  const updateCandidate = async (payload: any) => {
    try {
      const res = await putWithAuth(
        `api/polyvalences/${operatortoedit?.id}/`,
        payload
      );
      console.log(res);
      setAlert((prev) => ({ ...prev, isOpen: false }));
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        iconColor: "green",
        customClass: {
          popup: "colored-toast",
        },
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      Toast.fire({
        icon: "success",
        title: "Polyvalence ajouté avec succès !",
      });
      fetchRatedOperateurs();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLineChange = async (value: string) => {
    setProductionLine(value);
    setRatedOperateurs([]); // Clear the rated operators
    setUnratedOperateurs([]); // Clear the unrated operators
    fetchRatedOperateurs();
    fetchUnratedOperateurs();
  };

  const handleScoreChange = (id: string, score: number) => {
    console.log(`Employee ${id} score changed to: ${score}`);
    // Here, you would update the employee's score in your state or send the update to your backend.
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 w-full">
      <div className="bg-background rounded-lg shadow-md bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Opérateurs Évalués</h2>
            <p className="text-muted-foreground">
              Examinez et évaluez la performance des opérateurs sur votre ligne
              de production.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="production-line">Ligne</label>
            <Select
              defaultValue=""
              onValueChange={(value) => handleLineChange(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une ligne de production" />
              </SelectTrigger>
              <SelectContent>
                {productionLines.map((line: any) => (
                  <SelectItem key={line.id} value={line.id}>
                    {line.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-4 max-h-[300px] overflow-auto">
          {productionLine ? (
            ratedLoading ? (
              <Loader />
            ) : error ? (
              <p>{error}</p>
            ) : ratedOperateurs.length === 0 ? (
              <p>
                Aucun opérateur évalué trouvé. Évaluez les opérateurs pour les
                voir ici.
              </p>
            ) : (
              ratedOperateurs.map((employee) => (
                <div
                  key={employee.polyvalence.id}
                  className="flex items-center rounded-md text-black cursor-pointer"
                  onClick={() => {
                    setOperatorToEdit(employee.polyvalence);
                    setpostToAdd(employee);
                    setAlert((prev) => ({ ...prev, isOpen: true }));
                  }}
                >
                  <div className="flex justify-between items-center w-full gap-3">
                    <span className="rounded-full">
                      <Image
                        width={20}
                        height={20}
                        src={
                          "https://ui-avatars.com/api/?name=" +
                          employee.agent.nom +
                          "i&size=160&background=random"
                        }
                        style={{
                          width: "auto",
                          height: "auto",
                          borderRadius: "50%",
                        }}
                        alt="Utilisateur"
                      />
                    </span>
                    <div className="font-medium">{employee.agent.nom}</div>
                    <div className="text-center">{employee.poste.name}</div>
                    <div>
                      <ScoreGrid
                        score={
                          employee.polyvalence.score > 4
                            ? 4
                            : employee.polyvalence.score
                        }
                      />
                    </div>
                  </div>
                </div>
              ))
            )
          ) : (
            <p>Veuillez choisir une ligne de production</p>
          )}
        </div>
      </div>
      <div className="bg-background rounded-lg bg-white shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Opérateurs Non Évalués</h2>
            <p className="text-muted-foreground">
              Examinez et évaluez la performance des opérateurs sur votre ligne
              de production.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Rechercher des opérateurs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button>
              <SearchIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="grid gap-4 max-h-[300px] overflow-auto">
          {productionLine ? (
            unratedLoading ? (
              <Loader />
            ) : error ? (
              <p>{error}</p>
            ) : unratedOperateurs.length === 0 ? (
              <p>Aucun opérateur non évalué trouvé. Tout est à jour.</p>
            ) : (
              unratedOperateurs
                .filter((employee) =>
                  employee.agent.nom.toLowerCase().includes(searchQuery)
                )
                .map((employee) => (
                  <div
                    key={employee.id}
                    className="flex items-center rounded-md text-black"
                    onClick={() => {
                      setAlert2((prev) => ({ ...prev, isOpen: true }));
                      setpostToAdd(employee);
                      setOperatorToAdd(employee.polyvalence);
                    }}
                  >
                    <div
                      className="flex items-center w-full gap-3 cursor-pointer"
                      onClick={() => console.log(unratedOperateurs)}
                    >
                      <span className="rounded-full">
                        <Image
                          width={20}
                          height={20}
                          src={
                            "https://ui-avatars.com/api/?name=" +
                            employee.agent.nom +
                            "i&size=160&background=random"
                          }
                          style={{
                            width: "auto",
                            height: "auto",
                            borderRadius: "50%",
                          }}
                          alt="Utilisateur"
                        />
                      </span>
                      <div className="font-medium">{employee.agent.nom}</div>
                      <div>{employee.poste.name}</div>
                    </div>
                  </div>
                ))
            )
          ) : (
            <p>Veuillez choisir une ligne de production</p>
          )}
        </div>
      </div>
      <Modal
        isOpen={alert.isOpen}
        onSubmit={() => {
          const payload = {
            score: operatortoedit?.score,
            comments: operatortoedit?.comments,
          };
          updateCandidate(payload);
        }}
        onCancel={() => {
          setAlert((prev) => ({ ...prev, isOpen: false }));
        }}
        alertTitle={"Modifier la polyvalence"}
        alertDescription={"Modifier "}
        submitBtnName={"Modifier"}
        cancelBtnName="Annuler"
        type="success"
        onClose={() => {
          setAlert((prev) => ({ ...prev, isOpen: false }));
        }}
      >
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label htmlFor="score">Score</label>
            <input
              type="number"
              id="score"
              name="score"
              value={operatortoedit?.score}
              min="1"
              max="4"
              className="w-full p-2 border border-gray-300 rounded-md"
              onChange={(e) => {
                const value = parseInt(e.target.value);

                if (isNaN(value)) {
                  e.target.value = "";
                } else if (value < 1) {
                  e.target.value = "1";
                } else if (value > 4) {
                  e.target.value = "4";
                }

                setOperatorToEdit((prev) => ({
                  ...prev!,
                  score: parseInt(e.target.value),
                }));
              }}
            />
          </div>
          <div>
            <label htmlFor="score">careau magique </label>
            <div className="flex items-center justify-between">
              <ScoreGrid score={operatortoedit?.score} />
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="score">commentaire</label>
          <textarea
            id="commentaire"
            name="commentaire"
            value={operatortoedit?.comments}
            className="w-full p-2 border border-gray-300 rounded-md"
            onChange={(e) => {
              setOperatorToEdit((prev) => ({
                ...prev!,
                comments: e.target.value,
              }));
            }}
          />
        </div>
      </Modal>
      <Modal
        isOpen={alert2.isOpen}
        onSubmit={() => {
          const payload = {
            score: operatorToAdd?.score,
            comments: operatorToAdd?.comments,
            supervisor: getRoleIdFromToken(),
            personnel: operatorToAdd?.id,
            ligne: productionLine,
            poste: postToAdd?.poste.id,
          };
          AddPolyvalence(payload);
        }}
        onCancel={() => {
          setAlert2((prev) => ({ ...prev, isOpen: false }));
        }}
        alertTitle={"Ajouter Polyvalence"}
        alertDescription={"Ajouter "}
        submitBtnName={"Ajouter"}
        cancelBtnName="Annuler"
        type="success"
        onClose={() => {
          setAlert((prev) => ({ ...prev, isOpen: false }));
        }}
      >
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label htmlFor="score">Score</label>
            <input
              type="number"
              id="score"
              name="score"
              value={operatortoedit?.score}
              min="1"
              max="4"
              className="w-full p-2 border border-gray-300 rounded-md"
              onChange={(e) => {
                const value = parseInt(e.target.value);

                if (isNaN(value)) {
                  e.target.value = "";
                } else if (value < 1) {
                  e.target.value = "1";
                } else if (value > 4) {
                  e.target.value = "4";
                }

                setOperatorToAdd((prev) => ({
                  ...prev!,
                  score: parseInt(e.target.value),
                }));
              }}
            />
          </div>
          <div>
            <label htmlFor="score">careau magique </label>
            <div className="flex items-center justify-between">
              <ScoreGrid score={operatorToAdd?.score} />
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="score">commentaire</label>
          <textarea
            id="commentaire"
            name="commentaire"
            value={operatortoedit?.comments}
            className="w-full p-2 border border-gray-300 rounded-md"
            onChange={(e) => {
              setOperatorToAdd((prev) => ({
                ...prev!,
                comments: e.target.value,
              }));
            }}
          />
        </div>
      </Modal>
    </div>
  );
}

const ScoreGrid: React.FC<ScoreGridProps> = ({ score }) => {
  const scoreGrid = grids[Number(score?.toString()) || 1];

  return (
    <div className="grid grid-cols-3 gap-1">
      {scoreGrid &&
        scoreGrid.map((className: string, index: number) => (
          <div key={index} className={`w-2 h-2 ${className}`}></div>
        ))}
    </div>
  );
};

function SearchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
