import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "@/utils/api";
import DataCard from "../3DCard/DataCard";
import CardBarChart from "../ui/charts/CardBarChart";
import PieChart from "../ui/charts/PieChart";
import Loader from "../common/Loader";
import { Bar } from "react-chartjs-2";
interface DashboardData {
  personnel_data: {
    candidates: number;
    in_training: number;
    operators: number;
    monthly_data: Array<{ month: string; count: number }>;
  };
  test_scores: {
    Mauvais: number;
    Passable: number;
    Bien: number;
    "Très bien": number;
  };
  absence_data: Array<{ date: string; count: number }>;
}

function FormateurDash() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth("api/formateur-dash/");
        setDashboardData(response);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !dashboardData) {
    return <Loader />;
  }

  const { personnel_data, test_scores, absence_data } = dashboardData;
  // Prepare data for absenteeism chart
  const absenteeismChartData = {
    labels: absence_data.map((item) => item.date),
    datasets: [
      {
        label: "Nombre d'absences",
        data: absence_data.map((item) => item.count),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };
  const absenteeismChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Taux d'Absentéisme",
      },
    },
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Tableau de Bord du Formateur
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DataCard title="Candidats" value={personnel_data.candidates} />
        <DataCard title="En Formation" value={personnel_data.in_training} />
        <DataCard title="Opérateurs" value={personnel_data.operators} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Évolution des Effectifs
          </h2>
          <CardBarChart personnelData={personnel_data.monthly_data} />
        </div>

        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Répartition des Scores de Tests
          </h2>
          <div className="flex justify-center items-center ">
            <PieChart
              data={test_scores}
              title="Distribution des Scores de Tests"
            />
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg shadow col-span-2">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Taux d'Absentéisme
          </h2>
          <Bar data={absenteeismChartData} options={absenteeismChartOptions} />
        </div>
      </div>
    </div>
  );
}
export default FormateurDash;
