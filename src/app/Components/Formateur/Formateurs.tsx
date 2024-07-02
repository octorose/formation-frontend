import React, { useEffect, useState } from "react";
import CustomTable from "../CustomTable/CustomTable";
import CardBarChart from "../ui/charts/CardBarChart";
import { Plus, Search, SearchIcon } from "lucide-react";
import { refreshToken } from "@/utils/RefreshToken";
import Loader from "@/Components/Loaders/Loader";
// import DataCard from "../3DCard/DataCard";
// import SearchComponent from "../SearchComponent/Search";
// import Loader from "@/Components/Loaders/Loader";
import DataCard from "../3DCard/DataCard";
import SearchComponent from "../SearchComponent/Search";
import GlobalButton from "../globalButton/globalButton";
import { fetchWithAuth } from "@/utils/api";
import FormateursTable from "../CustomTable/FormateurTable";
function Formateur() {
  interface PersonnelType {
    candidat: number;
    formation: number;
    operateur: number;
  }
  const [personnelData, setPersonnelData] = useState([]);
  const [personnelSumByEtat, setPersonnelSumByEtat] = useState([]);
  const [personneltype, setPersonnelType] = useState<PersonnelType>({
    candidat: 0,
    formation: 0,
    operateur: 0,
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth("/api/formateurs/");
        const fetchedData = await response.json();
        setPersonnelData(fetchedData);
      } catch (error) {
        console.error(error);
      }
    };
    fetch("http://localhost:8000/api/personnel-sum-by-etat/")
      .then((response) => response.json())
      .then((data) => {
        setPersonnelSumByEtat(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    fetchData();
  }, []);
  const getPersonnelSum = (data: any, etat: any) => {
    const found = data.find((item: any) => item.etat === etat);
    return found ? found.sum_personnel : 0;
  };
  const totalCandidates = getPersonnelSum(personnelSumByEtat, "Candidate");
  const totalInFormation = getPersonnelSum(personnelSumByEtat, "En Formation");
  const totalOperators = getPersonnelSum(personnelSumByEtat, "Operateur");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearchResults = (results: any[]) => {
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
      <div className="w-full  overflow-hidden   rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-white to-slate-300">
        <div className="flex flex-row justify-between text-graydark mb-10">
          <p>Formateurs</p>

          <div className=" rounded-2xl p-1 text-sm flex flex-row bg-transparent items-center">
            <SearchComponent
              onResults={handleSearchResults}
              onLoading={handleLoading}
              onError={handleError}
              endpoint="/api/search-formateurs/"
            />
          </div>
        </div>

        <FormateursTable
          headers={[
            "Nom",
            "Prenom",
            "CIN",
            "numero tel",
            "Type",
            "Affecteur",
            "",
          ]}
          searchResults={searchResults}
        />
      </div>
      <div style={{ position: "fixed", bottom: "20px", right: "20px" }}>
        <GlobalButton
          onClick={() => (window.location.href = "/AddFormateur")}
          className="bg-blue-950 w-14 h-14 rounded-full flex items-center justify-center shadow-xl text-white mr-10"
          aria-label="add"
        >
          <Plus />
        </GlobalButton>
      </div>
    </div>
  );
}

export default Formateur;
