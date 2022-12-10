import React from "react";
import { Doughnut } from "react-chartjs-2";
import { IAdmin } from "../../../../model/admindashboard";

type propType = {
  style?: React.CSSProperties;
  chartdata?: IAdmin;
  classname?: string;
};
const DoughnutChart = ({ chartdata }: propType) => {
  // const total = chartdata?.daywisepaidincome.map((a) => a.total);
  // const remaining = chartdata?.daywisepaidincome.map((a) => a.remaining);
  // const paid = chartdata?.daywisepaidincome.map((a) => a.paid);
  //@ts-ignore
  const total = chartdata?.map((a) => a.total);
  //@ts-ignore
  const remaining = chartdata?.map((a) => a.remaining);
  //@ts-ignore
  const paid = chartdata?.map((a) => a.paid);

  // console.log(total, 'total');
  // console.log(remaining, 'unpremainingaid');

  const lable = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
  ];
  return (
    <div
      style={{
        background: "white",
        borderRadius: "5px",
        marginTop: "0.7rem",
        width: "100%",
      }}
    >
      <Doughnut
        data={{
          labels: ["Paypal", "Stripe", "WorldPay", "GPay", "Payoneer"],

          datasets: [
            {
              label: "# of votes",
              data: [30000, 25000, 10000, 15000, 20000],
              backgroundColor: [
                "rgba(255, 99, 132)",
                "rgba(54, 162, 235)",
                "rgba(255, 206, 86)",
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

export default React.memo(DoughnutChart);
