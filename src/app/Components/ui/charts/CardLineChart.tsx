import React, { useEffect, useRef } from "react";
import { Chart, ChartConfiguration } from "chart.js/auto";

const CardLineChart = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const config = {
      type: "line",
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
            label: new Date().getFullYear(),
            backgroundColor: "#ffffff",
            borderColor: "#ffffff",
            data: [65, 78, 66, 44, 56, 67, 75],
            fill: false,
          },
          {
            label: new Date().getFullYear() - 1,
            fill: false,
            backgroundColor: "#3182ce",
            borderColor: "#3182ce",
            data: [40, 68, 86, 74, 56, 60, 87],
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        // Add other options as needed
        scales: {
          x: [
            {
              ticks: {
                fontColor: "#ffffff", // White color for x-axis labels
              },
            },
          ],
          y: [
            {
              ticks: {
                fontColor: "#ffffff", // White color for y-axis labels
              },
            },
          ],
        },
      },
    };

    const ctx = (canvasRef.current as HTMLCanvasElement | null)?.getContext(
      "2d"
    ) as CanvasRenderingContext2D;
    const chart = new Chart(ctx, config as unknown as ChartConfiguration);

    return () => {
      chart.destroy();
    };
  }, []);

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded ">
      <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full max-w-full flex-grow flex-1">
            <h6 className="uppercase text-white mb-1 text-xs font-semibold">
              Overview
            </h6>
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

export default CardLineChart;
