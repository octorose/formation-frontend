import React, { useEffect, useRef } from "react";
import { Chart, ChartConfiguration } from "chart.js/auto";

interface PieChartProps {
  data: {
    [key: string]: number;
  };
  title?: string;
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  title = "Distribution",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        // Destroy existing chart if it exists
        if (chartRef.current) {
          chartRef.current.destroy();
        }

        const labels = Object.keys(data);
        const values = Object.values(data);

        const config: ChartConfiguration = {
          type: "pie",
          data: {
            labels: labels,
            datasets: [
              {
                data: values,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.8)",
                  "rgba(54, 162, 235, 0.8)",
                  "rgba(255, 206, 86, 0.8)",
                  "rgba(75, 192, 192, 0.8)",
                  "rgba(153, 102, 255, 0.8)",
                  "rgba(255, 159, 64, 0.8)",
                ],
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(153, 102, 255, 1)",
                  "rgba(255, 159, 64, 1)",
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: title,
              },
            },
          },
        };

        chartRef.current = new Chart(ctx, config);
      }
    }

    // Cleanup function
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, title]);

  return (
    <div className="w-full flex justify-center">
      <div className="w-full  max-w-md">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default PieChart;
