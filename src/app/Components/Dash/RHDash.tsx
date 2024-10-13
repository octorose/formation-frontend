"use client";
import React, { useEffect, useState } from "react";
import DataCard from "../3DCard/DataCard";
import CardBarChart from "../ui/charts/CardBarChart";
import Loader from "../common/Loader";
import HeadcountByContractChart from "../ui/charts/HeadcountByContractChart";
import { fetchWithAuth } from "@/utils/api";
import PositionPerformanceChart from "../ui/charts/PositionPerformanceChart";

function RHDash() {
  const [personnelData, setPersonnelData] = useState([]);
  const [personnelSumByEtat, setPersonnelSumByEtat] = useState([]);
  const [headcountByContract, setHeadcountByContract] = useState([]);
  const [loading, setLoading] = useState(true);
  const [positionPerformanceData, setPositionPerformanceData] = useState([]);
  const [lignes, setLignes] = useState<any>([]);
  const [selectedLigne, setSelectedLigne] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const personnelCountResponse = await fetchWithAuth(
          "api/personnel-count-by-month/"
        );
        setPersonnelData(personnelCountResponse);

        const personnelSumResponse = await fetchWithAuth(
          "api/personnel-sum-by-etat/"
        );
        setPersonnelSumByEtat(personnelSumResponse);

        const headcountResponse = await fetchWithAuth(
          "api/headcount-by-contract/"
        );
        setHeadcountByContract(headcountResponse);

        const performanceResponse = await fetchWithAuth(
          `api/position-performance/${
            selectedLigne ? `?ligne_id=${selectedLigne}` : ""
          }`
        );
        setPositionPerformanceData(performanceResponse);

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data", error);
        setLoading(false);
      }
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
  const totalOperators = getPersonnelSum(personnelSumByEtat, "Operateur");
  return (
    <div className="w-full p-6 bg-gradient-to-br from-white to-slate-300">
      <h1 className="text-2xl md:text-3xl font-bold text-graydark mb-6">
        Indicateurs De Performance Globale
      </h1>

      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h2 className="text-lg font-semibold mb-4">
              Statistiques du Personnel
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <DataCard title="En Formation" value={totalInFormation} />
              <DataCard title="Operateurs" value={totalOperators} />
              <DataCard title="Candidats" value={totalCandidates} />
              <DataCard
                title="Total"
                value={totalInFormation + totalOperators + totalCandidates}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <h2 className="text-lg font-semibold mb-4">
              Évolution du Personnel
            </h2>
            {personnelData.length > 0 ? (
              <CardBarChart personnelData={personnelData} />
            ) : (
              <p>No data available</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <h2 className="text-lg font-semibold mb-4">
              Répartition par Contrat
            </h2>
            {headcountByContract.length > 0 ? (
              <HeadcountByContractChart data={headcountByContract} />
            ) : (
              <p>No data available</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <h2 className="text-lg font-semibold mb-4">
              Performance des Postes
            </h2>
            {positionPerformanceData.length > 0 ? (
              <PositionPerformanceChart data={positionPerformanceData} />
            ) : (
              <p>No data available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default RHDash;
