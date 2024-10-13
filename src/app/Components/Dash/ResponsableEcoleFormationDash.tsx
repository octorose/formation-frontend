import React, { useEffect, useState } from "react";
import DataCard from "../3DCard/DataCard";
import CardBarChart from "../ui/charts/CardBarChart";
import Loader from "../common/Loader";
import { refreshToken } from "@/utils/RefreshToken";

function ResponsableEcoleFormationDash() {
  const [personnelData, setPersonnelData] = useState([]);
  const [personnelSumByEtat, setPersonnelSumByEtat] = useState([]);

  useEffect(() => {
    // Fetch data specific to ResponsableEcoleFormation role
    const fetchData = async () => {
      // ... (similar to RHDash, but with endpoints specific to ResponsableEcoleFormation)
    };

    fetchData();
  }, []);

  const getPersonnelSum = (data: any, etat: any) => {
    const found = data.find((item: any) => item.etat === etat);
    return found ? found.sum_personnel : 0;
  };

  const totalCandidates =
    getPersonnelSum(personnelSumByEtat, "Candidate") +
    getPersonnelSum(personnelSumByEtat, "Candidat");
  const totalInFormation = getPersonnelSum(personnelSumByEtat, "En Formation");

  return (
    <div className="w-full overflow-hidden rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-white to-slate-300">
      <div className="flex flex-row justify-between text-graydark">
        <p>Indicateurs De Performance - Responsable École Formation</p>
      </div>
      <div className="flex text-graydark my-5">
        <div className="h-70 w-1/2 flex-col gap-3 rounded-lg shadow-lg justify-between">
          <div className="flex gap-1 h-1/2 w-full justify-center items-center">
            <DataCard title="Totale Candidats" value={totalCandidates} />
            <div className="bg-black h-[60%] w-1"></div>
            <DataCard title="Totale En Formation" value={totalInFormation} />
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
  );
}

export default ResponsableEcoleFormationDash;
