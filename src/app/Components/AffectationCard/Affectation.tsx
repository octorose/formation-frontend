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
import { SearchIcon } from "lucide-react";
import Candidats from '../Candidats/Candidats';
interface ProductionLine {
  id: string;
  name: string;
}
function Affectation() {
  const [searchQuery, setSearchQuery] = useState("");
  const { alert, setAlert } = useAlert();
  const [Enformation, setEnformation] = useState<Agent[]>();
  const [productionLines, setProductionLines] = useState<ProductionLine[]>([]);
  const [productionline, setProductionLine] = useState("");
  const [EnformationLoading, setEnformationLoading] = useState(false);
  const [Error, setError] = useState("")
  useEffect(() => {
    fetchLignes();
    fetchEnformation();
  }, []);
  const fetchLignes = async () => {
    setEnformationLoading(true)
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
      setEnformation([]);
    } finally {
      setEnformationLoading(false);
    }
  };
  const fetchEnformation = async () => {
    setEnformationLoading(true);
    setError("");
    try {
      const response = await fetchWithAuth(`api/En-Formation/`);
      setEnformation(response.results);
    } catch (error: any) {
      setError(error.message);
      setEnformation([]);
    } finally {
      setEnformationLoading(false);
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 w-full">
      <div className="bg-background rounded-lg shadow-md bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Opérateurs Évalués</h2>
            <p className="text-muted-foreground">
                Affecter des Candidats en formation à une de votre lignes de production 
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="production-line">Ligne</label>
            <Select defaultValue="" onValueChange={(value) => {}}>
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
        <div className="grid gap-4 max-h-[300px] overflow-auto"></div>
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
              placeholder="Rechercher des opérateurs..."
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
