'use client';
import React, { useEffect, useState } from 'react'
import DataCard from '../3DCard/DataCard'
import CardBarChart from '../ui/charts/CardBarChart'
import Loader from '../common/Loader'
import SearchComponent from '../SearchComponent/Search'
import { refreshToken } from '@/utils/RefreshToken';

function Dash() {
      interface PersonnelType {
        candidat: number;
        formation: number;
        operateur: number;
      }

          const [searchResults, setSearchResults] = useState<any[]>([]);
          const [loading, setLoading] = useState<boolean>(false);
          const [error, setError] = useState<string | null>(null);
      const [personnelData, setPersonnelData] = useState([]);
      const [personnelSumByEtat, setPersonnelSumByEtat] = useState([]);
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
    const handleSearchResults = (results: any[]) => {
      setSearchResults(results);
    };

    const handleLoading = (isLoading: boolean) => {
      setLoading(isLoading);
    };

    const handleError = (error: string | null) => {
      setError(error);
    };
      const getPersonnelSum = (data: any, etat: any) => {
        const found = data.find((item: any) => item.etat === etat);
        return found ? found.sum_personnel : 0;
      };
      const totalCandidates = getPersonnelSum(personnelSumByEtat, "Candidate");
      const totalInFormation = getPersonnelSum(
        personnelSumByEtat,
        "En Formation"
      );
      const totalOperators = getPersonnelSum(personnelSumByEtat, "Operateur");
  return (
          <div className="w-full  overflow-hidden   rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-white to-slate-300">
        <div className="flex flex-row justify-between text-graydark">
          <p>Indicateurs De Performance Globale </p>
          {/* <SearchComponent
            onResults={handleSearchResults}
            onLoading={handleLoading}
            onError={handleError}
          /> */}
        </div>
        <div className="flex text-graydark my-5">
          <div className="h-70 w-1/2 flex-col gap-3 rounded-lg shadow-lg justify-between">
            <div className="flex rounded-xl gap-1 h-1/2 w-full justify-center items-center">
              <DataCard title="New Groups" value={12} />
              <div className="bg-black h-[60%] w-1"></div>
              <DataCard title="Total Candidats" value={totalCandidates} />
            </div>
            <div className="bg-black h-1 mx-auto w-11/12"></div>
            <div className="flex gap-1 h-1/2 w-full justify-center items-center">
              <DataCard title="Totale En Formation" value={totalInFormation} />
              <div className="bg-black h-[60%] w-1"></div>
              <DataCard title="Totale Operateurs" value={totalOperators} />
            </div>
          </div>
          <div className="h-70 w-1/2">
            {personnelData.length > 0 ? (
              <CardBarChart personnelData={personnelData} />
            ) : (
              <Loader />
            )}
          </div>
        </div>
        </div>
  )
}

export default Dash