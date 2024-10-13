import React, { useEffect, useState } from "react";
import DataCard from "../3DCard/DataCard";
import Loader from "../common/Loader";
import { fetchWithAuth } from "@/utils/api";
import PositionPerformanceChart from "../ui/charts/PositionPerformanceChart";
import { getRoleIdFromToken } from "@/utils/getRoleIdFromToken";

function SuperviseurDash() {
  const [personnelSumByEtat, setPersonnelSumByEtat] = useState([]);
  const [linePerformanceData, setLinePerformanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch personnel sum by etat
        const sumResponse = await fetchWithAuth("api/personnel-sum-by-etat/");
        setPersonnelSumByEtat(sumResponse);
        console.log("Sum response:", sumResponse);

        const supervisorId = getRoleIdFromToken();
        // Fetch line performance data
        const performanceResponse = await fetchWithAuth(
          `api/supervisor-line-performance/${supervisorId}/`
        );
        setLinePerformanceData(performanceResponse);
        console.log("Performance data:", performanceResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getPersonnelSum = (data: any, etat: string) => {
    const found = data.find(
      (item: any) => item.etat.toLowerCase() === etat.toLowerCase()
    );
    return found ? found.sum_personnel : 0;
  };

  const totalInFormation = getPersonnelSum(personnelSumByEtat, "En Formation");
  const totalOperators = getPersonnelSum(personnelSumByEtat, "Operateur");

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Tableau de Bord du Superviseur
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <DataCard title="Personnel en Formation" value={totalInFormation} />
        <DataCard title="Opérateurs Actifs" value={totalOperators} />
      </div>

      <div className="bg-gray-50 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Performance des Lignes Spécifique au Superviseur
        </h2>
        <PositionPerformanceChart data={linePerformanceData} />
      </div>
    </div>
  );
}

export default SuperviseurDash;
