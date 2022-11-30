import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Bar } from "react-chartjs-2";
import { AnswerTotal } from "types/result";
import randomRGBGenerator from "utils/randomRGBGenerator";

function Multiple({ answerTotal }: { answerTotal: AnswerTotal }) {
  ChartJS.register(CategoryScale, LinearScale, BarElement);
  const { length } = Object.keys(answerTotal);

  const colorSet = Array.from(
    {
      length,
    },
    () => randomRGBGenerator()
  );

  const data = {
    labels: [""],
    datasets: Object.entries(answerTotal).map(([key, value], index) => ({
      label: key,
      data: [value],
      backgroundColor: colorSet[index].backgroundColor,
      borderColor: colorSet[index].borderColor,
      borderWidth: 1.5,
      barPercentage: 0.8,
    })),
  };

  const options = {
    indexAxis: "y" as const,
    responsive: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        align: "start" as const,
        boxWidth: 10,
      },
    },
    scales: {
      x: {
        ticks: {
          callback: (value: number | string) => {
            const tick = Number(value);
            if (tick !== parseInt(tick.toString(), 10)) return "";
            return value;
          },
        },
      },
    },
  };

  return (
    <Bar
      data={data}
      options={options}
      redraw
      width={480}
      height={50 * (length + 1)}
      style={{ marginLeft: "auto", marginRight: "auto" }}
    />
  );
}

export default Multiple;
