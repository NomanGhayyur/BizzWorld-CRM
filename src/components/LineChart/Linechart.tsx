import React from "react";
import { Line } from "react-chartjs-2";
import { IAdmin } from "../../model/admindashboard";

type propType = {
  style?: React.CSSProperties;
  chartdata?: IAdmin;
  classname?: string;
};
export const WorkerLineChart = ({ chartdata }: propType) => {
  // const total = chartdata?.daywisepaidincome.map((a) => a.total);
  // const remaining = chartdata?.daywisepaidincome.map((a) => a.remaining);
  // const paid = chartdata?.daywisepaidincome.map((a) => a.paid);
  //@ts-ignore
  const total = chartdata?.map((a) => a.totalorders);
  //@ts-ignore
  const complete = chartdata?.map((a) => a.completeorders);

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
      <Line
        data={{
          labels: lable,

          datasets: [
            {
              label: "Total",
              data: total,
              backgroundColor: "rgba(80, 105, 231, 0.8)",
              borderColor: "rgba(80, 105, 231, 0.8)",
            },
            {
              label: "Complete",
              data: complete,
              backgroundColor: "orange",
              borderColor: "orange",
            },

            // {
            //   label: 'Paid',
            //   data: [14217, 5122, 1367, 5118, 19232, 15120],
            //   backgroundColor: 'orange',
            //   borderColor: 'yellow',
            // },
            // {
            //   label: 'Unpaid',
            //   data: [147, 53332, 12647, 52128, 141439, 12350],
            //   backgroundColor: 'orange',
            //   borderColor: 'red',
            // },
          ],
        }}
        height={250}
        width={1200}
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

          plugins: {
            legend: {
              labels: {
                //@ts-ignore
                fontSize: 25,
                boxWidth: 0,
              },
            },
          },
        }}
      />
    </div>
  );
};

export const AdminLineChart = ({ chartdata }: propType) => {
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
      <Line
        data={{
          labels: lable,

          datasets: [
            {
              label: "Total",
              data: total,
              backgroundColor: "rgba(80, 105, 231, 0.8)",
              borderColor: "rgba(80, 105, 231, 0.8)",
            },
            {
              label: "Remaining",
              data: remaining,
              backgroundColor: "orange",
              borderColor: "orange",
            },
            {
              label: "Paid",
              data: paid,
              backgroundColor: "green",
              borderColor: "green",
            },

            // {
            //   label: 'Paid',
            //   data: [14217, 5122, 1367, 5118, 19232, 15120],
            //   backgroundColor: 'orange',
            //   borderColor: 'yellow',
            // },
            // {
            //   label: 'Unpaid',
            //   data: [147, 53332, 12647, 52128, 141439, 12350],
            //   backgroundColor: 'orange',
            //   borderColor: 'red',
            // },
          ],
        }}
        height={250}
        width={1200}
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

          plugins: {
            legend: {
              labels: {
                //@ts-ignore
                fontSize: 25,
                boxWidth: 0,
              },
            },
          },
        }}
      />
    </div>
  );
};

export const SalesLineChart = ({ chartdata }: propType) => {
  // const total = chartdata?.daywisepaidincome.map((a) => a.total);
  // const remaining = chartdata?.daywisepaidincome.map((a) => a.remaining);
  // const paid = chartdata?.daywisepaidincome.map((a) => a.paid);
  //@ts-ignore
  const orders = chartdata?.map((a) => a.orderscount);
  //@ts-ignore
  const amount = chartdata?.map((a) => a.orderamount);

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
      <Line
        data={{
          labels: lable,

          datasets: [
            {
              label: "Orders",
              data: orders,
              backgroundColor: "rgba(80, 105, 231, 0.8)",
              borderColor: "rgba(80, 105, 231, 0.8)",
            },
            {
              label: "Amount",
              data: amount,
              backgroundColor: "orange",
              borderColor: "orange",
            },

            // {
            //   label: 'Paid',
            //   data: [14217, 5122, 1367, 5118, 19232, 15120],
            //   backgroundColor: 'orange',
            //   borderColor: 'yellow',
            // },
            // {
            //   label: 'Unpaid',
            //   data: [147, 53332, 12647, 52128, 141439, 12350],
            //   backgroundColor: 'orange',
            //   borderColor: 'red',
            // },
          ],
        }}
        height={250}
        width={1200}
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

          plugins: {
            legend: {
              labels: {
                //@ts-ignore
                fontSize: 25,
                boxWidth: 0,
              },
            },
          },
        }}
      />
    </div>
  );
};
