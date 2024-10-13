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
import { fetchWithAuth, patchWithAuth } from "@/utils/api";
import { getRoleIdFromToken } from "@/utils/getRoleIdFromToken";
import { Agent } from "@/interfaces/Agent";
import Image from "next/image";
import useAlert from "@/Hooks/useAlert";
import { SearchIcon } from "lucide-react";
import Modal from "../GlobalModal/Modal";
import { on } from "events";
import { getRoleFromToken } from "@/utils/getRoleFromToken";
import { log } from "console";

interface ProductionLine {
  id: string;
  name: string;
}
interface Affectation {
  id: number;
  agent: Agent;
  poste: number;
  ligne: number;
}
interface payload {
  poste: string;
  ligne: string;
}
function Affectation() {
  const [searchQuery, setSearchQuery] = useState("");
  const { alert, setAlert } = useAlert();
  const { alert: alert2, setAlert: setAlert2 } = useAlert();
  const [Enformation, setEnformation] = useState<Agent[]>([]);
  const [productionLines, setProductionLines] = useState<ProductionLine[]>([]);
  const [operators, setOperators] = useState([]);
  const [productionline, setProductionLine] = useState("");
  const [EnformationLoading, setEnformationLoading] = useState(false);
  const [operatorsLoading, setOperatorsLoading] = useState(false);
  const [error, setError] = useState("");
  const [postes, setPostes] = useState([]);
  const [payload, setPayload] = useState<payload>({ poste: "", ligne: "" });
  const [operatortoAffect, setOperatorToAffect] = useState<Affectation>();
  const [candidattoAssigne, setCandidattoAssigne] = useState<Affectation>();

  useEffect(() => {
    fetchLignes();
    fetchEnformation();
    if (getRoleFromToken() === "RH") {
      fetchLignesRH();
    }
  }, []);

  useEffect(() => {
    if (productionline) {
      fetchOperators();
    }
  }, [productionline]);

  const fetchLignesRH = async () => {
    setEnformationLoading(true);
    setError("");
    try {
      const response = await fetchWithAuth(`api/lignes/`);
      if (response && response.results && Array.isArray(response.results)) {
        setProductionLines(response.results);
        if (response.results.length > 0) {
          setProductionLine(response.results[0].id);
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error: any) {
      console.error("Failed to fetch production lines:", error.message);
      setError("Failed to fetch production lines");
    } finally {
      setEnformationLoading(false);
    }
  };
  const fetchLignes = async () => {
    setEnformationLoading(true);
    setError("");
    try {
      console.log(getRoleIdFromToken());

      const response = await fetchWithAuth(
        `api/formateur-lignes/${getRoleIdFromToken()}/`
      );
      if (response && response.lignes && Array.isArray(response.lignes)) {
        setProductionLines(response.lignes);
        if (response.lignes.length > 0) {
          setProductionLine(response.lignes[0].id);
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error: any) {
      console.error("Failed to fetch production lines:", error.message);
      setError("Failed to fetch production lines");
    } finally {
      setEnformationLoading(false);
    }
  };

  const AssigneCandidat = async () => {
    setEnformationLoading(true);
    setOperatorsLoading(true);
    setError("");
    try {
      const response = await patchWithAuth(
        `api/personnel/${candidattoAssigne?.id}/update-to-operator/`,
        payload
      );
      setOperators(response);
    } catch (error: any) {
      console.error("Failed to fetch operators:", error.message);
      console.log("fetchOperators error response:", error.response);
      setError("Failed to fetch operators");
    } finally {
      fetchEnformation();
      fetchOperators();
      setOperatorsLoading(false);
      setEnformationLoading(false);
    }
  };

  const fetchPostesByLigne = async () => {
    setError("");
    try {
      const response = await fetchWithAuth(`api/posts/${payload.ligne}/`);
      console.log("fetchPostesByLigne response:", response);
      setPostes(response);
    } catch (error: any) {
      console.error("Failed to fetch operators:", error.message);
      console.log("fetchOperators error response:", error.response);
      setError("Failed to fetch operators");
    }
  };
  useEffect(() => {
    fetchPostesByLigne();
  }, [payload.ligne]);
  const fetchEnformation = async () => {
    setEnformationLoading(true);
    setError("");
    try {
      const response = await fetchWithAuth(`api/En-Formation/`);
      console.log("fetchEnformation response:", response);
      setEnformation(response);
    } catch (error: any) {
      console.error("Failed to fetch candidates in formation:", error.message);
      setError("Failed to fetch candidates in formation");
    } finally {
      setEnformationLoading(false);
    }
  };

  const fetchOperators = async () => {
    setOperatorsLoading(true);
    setError("");
    try {
      const response = await fetchWithAuth(
        `api/line-operateurs/${productionline}/`
      );
      setOperators(response);
    } catch (error: any) {
      console.error("Failed to fetch operators:", error.message);
      console.log("fetchOperators error response:", error.response);
      setError("Failed to fetch operators");
    } finally {
      setOperatorsLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 w-full">
      <div className="bg-background rounded-lg shadow-md bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Operateurs de votre ligne</h2>
            <p className="text-muted-foreground">
              Rechercher et affecter des opérateurs à une ligne de production
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="production-line">Ligne</label>
            <Select
              defaultValue=""
              onValueChange={(value) => setProductionLine(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder= {productionline ? productionLines.find(line => line.id === productionline)?.name : "Sélectionnez une ligne de production"} />
              </SelectTrigger>
              <SelectContent>
                {productionLines.map((line: ProductionLine) => (
                  <SelectItem key={line.id} value={line.id}>
                    {line.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-4 max-h-[300px] overflow-auto">
          {operatorsLoading ? (
            <Loader />
          ) : error ? (
            <div className="text-center text-muted-foreground">{error}</div>
          ) : operators.length > 0 ? (
            operators.map((operator: any) => (
              <div
                key={operator.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg "
                onClick={() => {
                  setCandidattoAssigne(operator);
                  setAlert2((prev) => ({ ...prev, isOpen: true }));
                }}
              >
                <div className="flex items-center gap-4 w-full">
                  <Image
                    width={20}
                    height={20}
                    src={
                      "https://ui-avatars.com/api/?name=" +
                      operator.agent.nom +
                      "i&size=160&background=random"
                    }
                    style={{
                      width: "auto",
                      height: "auto",
                      borderRadius: "50%",
                    }}
                    alt="Utilisateur"
                  />
                  <div className="w-full">
                    <h3 className="text-lg font-semibold">
                      {operator.agent.nom}
                    </h3>
                    <div className="flex flex-row gap-1 justify-between">
                      <div className="flex gap-1 justify-center items-center text-center  ">
                        <p className="text-muted-foreground">
                          {operator.agent.role}
                        </p>
                        <p className="text-sm">{operator.etat}</p>
                      </div>
                      <p
                        className={
                          operator.poste.type == "simple_sans_risque"
                            ? "text-green-500"
                            : operator.poste.type == "simple_avec_risque"
                            ? "text-yellow-500"
                            : operator.poste.type == "complex_sans_risque"
                            ? "text-orange-500"
                            : "text-red"
                        }
                      >
                        {operator.poste.name}
                      </p>
                    </div>
                    {/* <p className="text-muted-foreground">{operator.email}</p> */}
                  </div>
                </div>
                <Button>{/* <span>Affecter</span> */}</Button>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground">
              Aucun opérateur trouvé
            </div>
          )}
        </div>
      </div>
      <div className="bg-background rounded-lg bg-white shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Candidats En Formation</h2>
            <p className="text-muted-foreground">
              Rechercher et affecter des candidats en formation à une ligne de
              production
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Rechercher un candidat ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button>
              <SearchIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="grid gap-4 max-h-[300px] overflow-auto">
          {EnformationLoading ? (
            <Loader />
          ) : error ? (
            <div className="text-center text-muted-foreground">{error}</div>
          ) : Enformation.length > 0 ? (
            Enformation.map((operator: any) => (
              <div
                key={operator.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md"
                onClick={() => {
                  setCandidattoAssigne(operator);
                  setAlert((prev) => ({ ...prev, isOpen: true }));
                }}
              >
                <div className="flex items-center gap-4 w-full">
                  <Image
                    width={20}
                    height={20}
                    src={
                      "https://ui-avatars.com/api/?name=" +
                      operator.nom +
                      "i&size=160&background=random"
                    }
                    style={{
                      width: "auto",
                      height: "auto",
                      borderRadius: "50%",
                    }}
                    alt="Utilisateur"
                  />
                  <div className="w-full">
                    <h3 className="text-lg font-semibold">
                      {operator.agent.nom}
                    </h3>
                    <div className="flex flex-row gap-1 items-center ">
                      <p className="text-muted-foreground">
                        {operator.agent.role}
                      </p>
                      <p className="text-muted-foreground text-sm ">
                        {operator.etat}
                      </p>
                    </div>
                    {/* <p className="text-muted-foreground">{operator.email}</p> */}
                  </div>
                </div>
                <Button>{/* <span>Affecter</span> */}</Button>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground">
              Aucun candidat en formation trouvé
            </div>
          )}
        </div>
      </div>
      <Modal
        isOpen={alert.isOpen}
        onSubmit={() => {
          AssigneCandidat();
        }}
        onCancel={() => {
          setAlert((prev) => ({ ...prev, isOpen: false }));
        }}
        alertTitle={"Affectation de " + candidattoAssigne?.agent.nom}
        alertDescription={"Ajouter "}
        submitBtnName={"Ajouter"}
        cancelBtnName="Annuler"
        type="success"
        onClose={() => {
          setAlert((prev) => ({ ...prev, isOpen: false }));
        }}
      >
        <div className="flex items-center gap-4">
          <div className="flex-col ">
            <label htmlFor="production-line">Ligne</label>
            <div className="z-50">
              <select
                className="w-full p-2 border border-gray-300 rounded-lg"
                onChange={(e) => {
                  setPayload({ ...payload, ligne: e.target.value });
                }}
              >
                <option value="">Sélectionnez une ligne de production</option>
                {productionLines.map((line: ProductionLine) => (
                  <option key={line.id} value={line.id}>
                    {line.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <label htmlFor="production-line">Poste</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg"
                onChange={(e) => {
                  setPayload({ ...payload, poste: e.target.value });
                }}
                disabled={!payload.ligne}
              >
                <option value="">Sélectionnez un poste</option>
                {postes.map((poste: any) => (
                  <option key={poste.id} value={poste.id}>
                    {poste.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={alert2.isOpen}
        onSubmit={() => {
          AssigneCandidat();
        }}
        onCancel={() => {
          setAlert2((prev) => ({ ...prev, isOpen: false }));
        }}
        alertTitle={"Affectation de " + candidattoAssigne?.agent.nom}
        alertDescription={"Ajouter "}
        submitBtnName={"Ajouter"}
        cancelBtnName="Annuler"
        type="success"
        onClose={() => {
          setAlert2((prev) => ({ ...prev, isOpen: false }));
        }}
      >
        <div className="flex items-center gap-4">
          <div className="flex-col ">
            <label htmlFor="production-line">Ligne</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg"
              onChange={(e) => {
                setPayload({ ...payload, ligne: e.target.value });
              }}
            >
              <option value="">Sélectionnez une ligne de production</option>
              {productionLines.map((line: ProductionLine) => (
                <option key={line.id} value={line.id}>
                  {line.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <label htmlFor="production-line">Poste</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg"
                onChange={(e) => {
                  setPayload({ ...payload, poste: e.target.value });
                }}
              >
                <option value="">Sélectionnez un poste</option>
                {postes.map((poste: any) => (
                  <option key={poste.id} value={poste.id}>
                    {poste.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Affectation;
