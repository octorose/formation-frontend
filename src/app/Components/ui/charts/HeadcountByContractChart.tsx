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

interface HeadcountData {
  type_contrat: string;
  count: number;
}

interface HeadcountByContractChartProps {
  data: HeadcountData[];
}

const HeadcountByContractChart: React.FC<HeadcountByContractChartProps> = ({
  data,
}) => {
  const chartData = {
    labels: data.map((item) => item.type_contrat),
    datasets: [
      {
        label: "Headcount",
        data: data.map((item) => item.count),
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Headcount by Contract Type",
        color: "black",
        font: {
          size: 18,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "black",
        },
      },
      x: {
        ticks: {
          color: "black",
        },
      },
    },
  };

  return (
    <div style={{ height: "300px", width: "100%", maxWidth: "100%" }}>
      <Bar options={options} data={chartData} />
    </div>
  );
};

export default HeadcountByContractChart;
