
import React, { useEffect, useRef } from "react";
import { Chart, ChartConfiguration } from "chart.js/auto";

const CardBarChart = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const config = {
      type: "bar",
      data: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
        ],
        datasets: [
          {
            label: new Date().getFullYear() - 1,
            backgroundColor: "#4a5568",
            borderColor: "#4a5568",
            data: [30, 78, 56, 34, 100, 45, 13],
            fill: false,
            barThickness: 8,
          },
          {
            label: new Date().getFullYear(),
            fill: false,
            backgroundColor: "#3182ce",
            borderColor: "#3182ce",
            data: [27, 68, 86, 74, 10, 4, 87],
            barThickness: 8,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: false,
          text: "Orders Chart",
        },
        // Add other options as needed
      },
    };

    const ctx = (canvasRef.current as HTMLCanvasElement | null)?.getContext("2d") as CanvasRenderingContext2D;
    const chart = new Chart(ctx, config as unknown as ChartConfiguration);

    return () => {
      chart.destroy();
    };
  }, []);

  return (
    <div className="relative flex flex-col h-full min-w-0 break-words bg-transparent w-full mb-6 shadow-lg rounded">
      <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full max-w-full flex-grow flex-1">
            <h6 className="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
              Performance
            </h6>
            <h2 className="text-blueGray-700 text-xl font-semibold">
              Total orders
            </h2>
          </div>
        </div>
      </div>
      <div className="p-4 flex-auto">
        <div className="relative h-350-px">
          <canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  );
};

export default CardBarChart;
