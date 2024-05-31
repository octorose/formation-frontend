import React, { useEffect, useRef } from "react";
import { Chart, ChartConfiguration } from "chart.js/auto";

const PieChart = (data:any) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const config = {
      type: "pie",
      data: {
        labels: ["CNHI", "VCE", "MAN", "JCB", "CLASS", "VOLVO"],
        datasets: [
          {
            label: "Dataset 1",
            data: [12, 19, 3, 2, 3, 5],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
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
        // Add other options as needed
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
    <div className="w-full flex justify-center">
      <div className="">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default PieChart;
