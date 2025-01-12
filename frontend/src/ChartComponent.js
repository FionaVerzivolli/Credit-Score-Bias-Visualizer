// ChartComponent.js
import React, { useEffect } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const ChartComponent = ({filtered_data = []}) => {
  useEffect(() => {
    const ctx = document.getElementById("chartCanvas").getContext("2d");

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["False Positive Rate", "Demographic Parity", "Group Disparity"],
        datasets: [
          {
            label: "Filtered Data",
            data: filtered_data,
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
            text: "Filtered Data",
          },
        },
      },
    });
  }, []);

  return (
    <div className="chart-container">
      <canvas id="chartCanvas" width="400" height="200"></canvas>
    </div>
  );
};

export default ChartComponent;
