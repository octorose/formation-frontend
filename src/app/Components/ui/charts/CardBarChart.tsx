import React, { useEffect, useRef } from "react";
import { Chart, ChartConfiguration } from "chart.js/auto";

const CardBarChart = ({ personnelData }:{personnelData:any}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!personnelData || personnelData.length === 0) return;
    //@ts-ignore
    const labels = personnelData.map((entry) => entry.month);
    //@ts-ignore
    const counts = personnelData.map((entry) => entry.count);

    const config = {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Personnel Count by Month",
            backgroundColor: "#3182ce",
            borderColor: "#3182ce",
            data: counts,
            barThickness: 8,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: true,
          text: "Personnel Count by Month",
        },
        // Add other options as needed
      },
    };

    const ctx = (canvasRef.current as unknown as HTMLCanvasElement)?.getContext("2d");
    if (ctx) {
      const chart = new Chart(ctx, config as unknown as ChartConfiguration);
      return () => {
        chart.destroy();
      };
    }

  }, [personnelData]);

  return (
    <div className="relative flex flex-col h-full min-w-0 break-words bg-transparent w-full mb-6 shadow-lg rounded">
      <div className="p-4 flex-auto">
        <div className="relative h-350-px">
          <canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  );
};

export default CardBarChart;
