// src/app/Components/Charts/PositionPerformanceChart.tsx
import React from "react";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PerformanceData {
  ligne__name: string;
  poste__name: string;
  avg_score: number;
}

interface PositionPerformanceChartProps {
  data: PerformanceData[];
}

const PositionPerformanceChart: React.FC<PositionPerformanceChartProps> = ({
  data,
}) => {
const lignes = Array.from(new Set(data.map((item) => item.ligne__name)));
const postes = Array.from(new Set(data.map((item) => item.poste__name)));

  const chartData = {
    labels: postes,
    datasets: lignes.map((ligne, index) => ({
      label: ligne,
      data: postes.map((poste) => {
        const item = data.find(
          (d) => d.ligne__name === ligne && d.poste__name === poste
        );
        return item ? item.avg_score : 0;
      }),
      backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
        Math.random() * 255
      }, 0.6)`,
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        title: {
          display: true,
          text: "Average Score",
        },
      },
    },
  };

  return <Bar options={options} data={chartData} />;
};

export default PositionPerformanceChart;
