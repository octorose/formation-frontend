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
import { fetchWithAuth } from "@/utils/api";
import { getRoleIdFromToken } from "@/utils/getRoleIdFromToken";
import { Agent } from "@/interfaces/Agent";
import Image from "next/image";
import useAlert from "@/Hooks/useAlert";
import { SearchIcon } from "lucide-react";

interface ProductionLine {
  id: string;
  name: string;
}

function Affectation() {
  const [searchQuery, setSearchQuery] = useState("");
  const { alert, setAlert } = useAlert();
  const [Enformation, setEnformation] = useState<Agent[]>([]);
  const [productionLines, setProductionLines] = useState<ProductionLine[]>([]);
  const [operators, setOperators] = useState([]);
  const [productionline, setProductionLine] = useState("");
  const [EnformationLoading, setEnformationLoading] = useState(false);
  const [operatorsLoading, setOperatorsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLignes();
    fetchEnformation();
  }, []);

  useEffect(() => {
    if (productionline) {
      fetchOperators();
    }
  }, [productionline]);

  const fetchLignes = async () => {
    setEnformationLoading(true);
    setError("");
    try {
      const response = await fetchWithAuth(
        `api/supervisor-lignes/${getRoleIdFromToken()}/`
      );
      console.log("fetchLignes response:", response); // Log the full response for debugging
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

  const fetchEnformation = async () => {
    setEnformationLoading(true);
    setError("");
    try {
      const response = await fetchWithAuth(`api/En-Formation/`);
      console.log("fetchEnformation response:", response); // Log the full response for debugging
      if (response && response.results && Array.isArray(response.results)) {
        setEnformation(response.results);
      } else {
        throw new Error("Invalid response format");
      }
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

      console.log("piwpiw");
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
                <SelectValue placeholder="Sélectionnez une ligne de production" />
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
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md"
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
                      <p className="text-muted-foreground">
                        {operator.agent.role}
                      </p>
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
        <div className="grid gap-4 max-h-[300px] overflow-auto"></div>
      </div>
    </div>
  );
}

export default Affectation;
