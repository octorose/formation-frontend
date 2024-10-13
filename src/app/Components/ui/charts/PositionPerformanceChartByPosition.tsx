import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { fetchWithAuth } from "@/utils/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PositionPerformanceData {
  ligne__name: string;
  poste__name: string;
  avg_score: number;
}

interface PositionPerformanceChartByPositionProps {
  supervisorId: number;
}

const PositionPerformanceChartByPosition: React.FC<
  PositionPerformanceChartByPositionProps
> = ({ supervisorId }) => {
  const [chartData, setChartData] = useState<PositionPerformanceData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth(`api/position-performance`);
        const data: PositionPerformanceData[] = await response.json();
        setChartData(data);
      } catch (error) {
        console.error("Error fetching position performance data:", error);
      }
    };

    fetchData();
  }, []);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Position Performance",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
      },
    },
  };

  const data = {
    labels: chartData.map(
      (item) => `${item.poste__name} (${item.ligne__name})`
    ),
    datasets: [
      {
        label: "Performance",
        data: chartData.map((item) => item.avg_score),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return (
    <div>
      {chartData.length > 0 ? (
        <Bar options={chartOptions} data={data} />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default PositionPerformanceChartByPosition;
