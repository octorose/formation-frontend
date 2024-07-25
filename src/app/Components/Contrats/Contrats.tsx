import React, { useEffect, useState } from "react";
import ContratTable from "../CustomTable/ContratTable";
import { Plus } from "lucide-react";
import SearchComponent from "../SearchComponent/Search";
import GlobalButton from "../globalButton/globalButton";

interface Contrat {
  id: number;
  agent_id: number;
  type_contrat: string;
  date_creation_contrat: string;
  duree_contrat: number;
}

const Contrats = () => {
  const [contrats, setContrats] = useState<Contrat[]>([]);
  const [searchResults, setSearchResults] = useState<Contrat[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://127.0.0.1:8000/api/api/contrats/", {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const fetchedData = await response.json();
        setContrats(fetchedData.results); // Assurez-vous que votre API renvoie un objet contenant les résultats
      } catch (error) {
        console.error(error);
        setError("Une erreur s'est produite lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchResults = (results: Contrat[]) => {
    setSearchResults(results);
  };

  const handleLoading = (isLoading: boolean) => {
    setLoading(isLoading);
  };

  const handleError = (error: string | null) => {
    setError(error);
  };

  return (
    <div>
      <div className="w-full overflow-hidden rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-white to-slate-300">
        <div className="flex flex-row justify-between text-graydark mb-10">
          <p>Contrats</p>

          <div className="rounded-2xl p-1 text-sm flex flex-row bg-transparent items-center">
            <SearchComponent
              onResults={handleSearchResults}
              onLoading={handleLoading}
              onError={handleError}
              endpoint="/api/contrats-search"
            />
          </div>
        </div>

        <ContratTable
          headers={[
            "Agent ID",
            "Type de Contrat",
            "Date de Création",
            "Durée (mois)",
            "",
          ]}
          searchResults={searchResults.length > 0 ? searchResults : contrats}
        />
      </div>
      <div style={{ position: "fixed", bottom: "20px", right: "20px" }}>
        <GlobalButton
          onClick={() => (window.location.href = "/AddContrat")}
          className="bg-blue-950 w-14 h-14 rounded-full flex items-center justify-center shadow-xl text-white mr-10"
          aria-label="add"
        >
          <Plus />
        </GlobalButton>
      </div>
    </div>
  );
};

export default Contrats;
