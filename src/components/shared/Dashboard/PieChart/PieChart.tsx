import React from "react";
import { Pie } from "react-chartjs-2";
//@ts-ignore
import { IAdmin } from "../../../model/admindashboard";

type propType = {
  style?: React.CSSProperties;
  chartdata?: IAdmin;
  classname?: string;
};

const PolarChart = ({ chartdata }: propType) => {
  const graph = [
    chartdata?.ppcassigned,
    chartdata?.ppcspend,
    chartdata?.remainingppc,
  ];
  console.log(graph, "chartdata");

  return (
    <div
      style={{
        background: "white",
        borderRadius: "5px",
        marginTop: "0.7rem",
        width: "100%",
      }}
    >
      <Pie
        data={{
          labels: ["Assigned", "Spent", "Remaining"],

          datasets: [
            {
              label: "# of votes",
              data: graph,
              backgroundColor: [
                "rgba(54, 162, 235)",
                "rgba(255, 206, 86)",
                "rgba(255, 99, 132)",
                "rgba(75, 192, 192)",
                "rgba(153, 102, 255)",
                "rgba(255, 159, 64)",
              ],
              //   borderColor: [
              //     'rgba(255, 99, 132, 1)',
              //     'rgba(54, 162, 235, 1)',
              //     'rgba(255, 206, 86, 1)',
              //     'rgba(75, 192, 192, 1)',
              //     'rgba(153, 102, 255, 1)',
              //     'rgba(255, 159, 64, 1)',
              //   ],
              borderWidth: 1,
            },
            // {
            //   label: 'Quantity',
            //   data: [47, 52, 67, 58, 9, 50],
            //   backgroundColor: 'orange',
            //   borderColor: 'red',
            // },
          ],
        }}
        height={250}
        width={300}
        options={{
          maintainAspectRatio: false,
          scales: {
            //@ts-ignore
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
          legend: {
            labels: {
              fontSize: 25,
            },
          },
        }}
      />
    </div>
  );
};

export default React.memo(PolarChart);
