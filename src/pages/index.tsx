import React from "react";
import type { NextPage } from "next";
import { useDispatch, useSelector } from "react-redux";
import { AppThunkDispatch, RootState } from "../redux/types";
import styles from "../styles/Home.module.css";
import { Roles } from "../constant/app";

const AdminDashboard = React.lazy(
  () => import("../components/Dashboard/AdminDashboard/index")
);
const UnitHeadDashboard = React.lazy(
  () => import("../components/Dashboard/UnitHeadDashboard/index")
);
const ManagerDashboard = React.lazy(
  () => import("../components/Dashboard/ManagerDashboard/index")
);
const DesignerDashboard = React.lazy(
  () => import("../components/Dashboard/DesignerDashboard/index")
);

const Index: NextPage = () => {
  const user = useSelector((store: RootState) => store.auth.user);
  const dispatch = useDispatch<AppThunkDispatch>();

  return (
    <>
      {user && [Roles.SUPER_ADMIN, Roles.Billing].includes(user?.role_id) ? (
        <div style={{ background: "rgba(80, 105, 231, 0.06)" }}>
          <AdminDashboard />
        </div>
      ) : user && [Roles.UNIT_HEAD].includes(user?.role_id) ? (
        <div style={{ background: "rgba(80, 105, 231, 0.06)" }}>
          <UnitHeadDashboard />
        </div>
      ) : user &&
        [Roles.SALES_Manager, Roles.SALES_AGENT].includes(user?.role_id) ? (
        <div style={{ background: "rgba(80, 105, 231, 0.06)" }}>
          <ManagerDashboard />
        </div>
      ) : user && [Roles.DESIGNER, Roles.DIGITIZER].includes(user?.role_id) ? (
        <div style={{ background: "rgba(80, 105, 231, 0.06)" }}>
          <DesignerDashboard />
        </div>
      ) : (
        <div className={styles.dashboardbackgroundimage}></div>
      )}
    </>
  );
};

export default Index;
