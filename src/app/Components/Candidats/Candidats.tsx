import React, { useEffect, useState } from "react";
import CustomTable from "../CustomTable/CustomTable";
import CardBarChart from "../ui/charts/CardBarChart";
import { SearchIcon } from "lucide-react";
import { refreshToken } from "@/utils/RefreshToken";

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

  // Calculate the sum of personnel count for the current month with etat = "Candidat"
  console.log(personnelSumByEtat);

  return (
    <div>
      <div className="w-full  overflow-hidden   rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-white to-slate-300">
        <div className="flex flex-row justify-between text-graydark">
          <p>Candidats</p>
          <div className="border border-1 rounded-2xl p-1 text-sm flex flex-row bg-transparent items-center">
            <input
              type="text"
              placeholder={"Search for "}
              className="bg-transparent"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const searchquery = e.currentTarget.value;
                }
              }}
            />
            <SearchIcon
              className="h-5 w-5 mx-3 text-blue-950"
              onClick={(e: any) => console.log(e)}
            />
          </div>
        </div>
        <div className="flex text-graydark my-5">
          <div className=" h-70 w-1/2 flex-col gap-3 rounded-lg shadow-lg  justify-between">
            <div className="flex rounded-xl  gap-1 h-1/2 w-full justify-center items-center">
              <div className="h-full w-1/2 px-5 flex flex-col justify-center">
                <h1>12</h1>
                <p className="text-slate-400 font-thin text-[20px]">
                  New Groups
                </p>
              </div>
              <div className="bg-black h-[60%] w-1"></div>
              <div className="h-full w-1/2 px-5 flex flex-col justify-center">
                <h1>
                  {
                    personnelSumByEtat[1] !== undefined
                    // @ts-ignore
                      ? personnelSumByEtat[1].sum_personnel
                      : "0"
                  }
                </h1>
                <p className="text-slate-400 font-thin text-[20px]">
                  Total Candidats
                </p>
              </div>
            </div>
            <div className="bg-black h-1 mx-auto w-11/12"></div>
            <div className="flex  gap-1 h-1/2 w-full justify-center items-center">
              <div className="h-full w-1/2 px-5 flex flex-col justify-center">
                <h1>
                  {
                    personnelSumByEtat[1] !== undefined
                    // @ts-ignore
                      ? personnelSumByEtat[1].sum_personnel
                      : "0"
                  }
                </h1>
                <p className="text-slate-400 font-thin text-[20px]">
                  Totale En Formation
                </p>
              </div>
              <div className="bg-black h-[60%] w-1"></div>
              <div className="h-full w-1/2 px-5 flex flex-col justify-center">
                <h1>
                  {
                    personnelSumByEtat[2] !== undefined
                    // @ts-ignore
                      ? personnelSumByEtat[2].sum_personnel
                      : "0"
                  }
                </h1>
                <p className="text-slate-400 font-thin text-[20px]">
                  Totale Operateurs
                </p>
              </div>
            </div>
          </div>
          <div className="h-70 w-1/2">
            {personnelData.length > 0 ? (
              <CardBarChart personnelData={personnelData} />
            ) : (
              <p>Loading...</p>
            )}
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
          ]}
        />
      </div>
    </div>
  );
}

export default Candidats;
