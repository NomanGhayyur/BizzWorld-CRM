import React from "react";
import { Card } from "elements";
import { NextPage } from "next";
import { IAdmin } from "../../../model/admindashboard";

const FixedExpense = React.lazy(
  () => import("../Dashboard/FixedExpense/FixedExpense")
);
const CarVendors = React.lazy(
  () => import("../Dashboard/CarVendors/CarVendors")
);
const OtherExpense = React.lazy(
  () => import("../Dashboard/OtherExpense/OtherExpense")
);
const SalaryExpense = React.lazy(
  () => import("../Dashboard/SalaryExpense/SalaryExpense")
);
const TotalExpense = React.lazy(
  () => import("../Dashboard/TotalExpense/TotalExpense")
);
const VansExpense = React.lazy(
  () => import("../Dashboard/VansExpense/VansExpense")
);

type propType = {
  statsdata?: IAdmin;
};

const Expense: NextPage = ({ statsdata }: propType) => {
  return (
    <Card
      style={{
        border: "none",
        background: "white",
        borderRadius: "5px",
        height: "39rem",
      }}
    >
      <div className="row">
        <h3
          style={{
            margin: "1rem",
            fontWeight: "700",
          }}
        >
          Expenses
        </h3>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-4">
            <FixedExpense
              //@ts-ignore
              data={statsdata}
              //@ts-ignore

              style={undefined}
            />
          </div>
          <div className="col-lg-4">
            <CarVendors
              style={{}}
              //@ts-ignore

              cardata={statsdata}
            />
          </div>
          <div className="col-lg-4">
            <VansExpense
              style={{}}
              //@ts-ignore

              vandata={statsdata}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4">
            <OtherExpense
              style={{}}
              //@ts-ignore

              otherdata={statsdata}
            />
          </div>
          <div className="col-lg-4">
            <SalaryExpense
              style={{}}
              //@ts-ignore

              salarydata={statsdata?.salaryexpense}
            />
          </div>
          <div className="col-lg-4">
            <TotalExpense
              style={{}}
              //@ts-ignore

              otherdata={statsdata}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default React.memo(Expense);
