// ChartComponent.js
import React, { useEffect } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const ChartComponent = () => {
  useEffect(() => {
    const ctx = document.getElementById("chartCanvas").getContext("2d");

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Metric 1", "Metric 2", "Metric 3"],
        datasets: [
          {
            label: "Sample Data",
            data: [12, 19, 7],
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            borderColor: ["#FF6384", "#36A2EB", "#FFCE56"],
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
            text: "Sample Chart",
          },
        },
      },
    });
  }, []);

  return (
    <div className="chart-container">
      <h2>Sample Chart</h2>
      <canvas id="chartCanvas" width="400" height="200"></canvas>
    </div>
  );
};

export default ChartComponent;
