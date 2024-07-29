import React, { useEffect, useState } from "react";
import ContratTable from "../CustomTable/ContratTable";
import { Plus } from "lucide-react";
import SearchComponent from "../SearchComponent/Search";
import GlobalButton from "../globalButton/globalButton";
import { fetchWithAuth } from "@/utils/api";

interface Contrat {
  id: number;
  agent_id: number;
  type_contrat: string;
  date_creation_contrat: string;
  duree_contrat: number;
}

const Contrats = () => {
  const [contrats, setContrats] = useState([]);
  const [searchResults, setSearchResults] = useState<Contrat[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    

    const fetchData = async () => {
      try {
        const response = await fetchWithAuth("/api/contrats/");
        // If response is already a JavaScript object, set it directly
        setContrats(response.results);
      } catch (error) {
        console.error(error);
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
           endpoint="/api/contrats/"
           searchResults={searchResults}
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
