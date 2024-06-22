import React, { useEffect, useState } from "react";
import CustomTable from "../CustomTable/CustomTable";
import CardBarChart from "../ui/charts/CardBarChart";
import { Search, SearchIcon } from "lucide-react";
import { refreshToken } from "@/utils/RefreshToken";
import Loader from "@/Components/Loaders/Loader";
// import DataCard from "../3DCard/DataCard";
// import SearchComponent from "../SearchComponent/Search";
// import Loader from "@/Components/Loaders/Loader";
import DataCard from "../3DCard/DataCard";
import SearchComponent from "../SearchComponent/Search";
function Candidats() {
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
        const response = await fetch(
          "http://localhost:8000/api/personnel-count-by-month/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        if (!response.ok) {
          if (response.status === 401) {
            // Token expired, try to refresh token
            const refreshResponse = await refreshToken(
              localStorage.getItem("refresh_token")
            );
            if (refreshResponse.ok) {
              // If refresh successful, retry original request
              localStorage.setItem("access_token", refreshResponse.access);
              //@ts-ignore

              const retryResponse = await fetch(
                `http://localhost:8000/api/personnel-count-by-month/`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                      "access_token"
                    )}`,
                  },
                }
              );
              if (retryResponse.ok) {
                const fetchedData = await retryResponse.json();
                setPersonnelData(fetchedData);
              } else {
                throw new Error("Failed to fetch data after token refresh");
              }
            } else {
              throw new Error("Failed to refresh token");
            }
          } else {
            throw new Error("Failed to fetch data");
          }
        } else {
          const fetchedData = await response.json();
          setPersonnelData(fetchedData);
        }
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

  // Calculate the sum of personnel count for the current month with etat = "Candidat"
  console.log(personnelSumByEtat);

  return (
    <div>
      <div className="w-full  overflow-hidden   rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-white to-slate-300">
        <div className="flex flex-row justify-between text-graydark mb-10">
          <p>Candidats</p>
          
          <div className=" rounded-2xl p-1 text-sm flex flex-row bg-transparent items-center">
            <SearchComponent
              onResults={handleSearchResults}
              onLoading={handleLoading}
              onError={handleError}
              endpoint="/api/personnel-search"
            />
            </div>
        </div>

        <CustomTable
          headers={[
            "Nom",
            "Prenom",
            "CIN",
            "numero tel",
            "Date_Naissance",
            "Date_Creation",
            "Status",
            "",
          ]}
          searchResults={searchResults}
        />
      </div>
    </div>
  );
}

export default Candidats;
