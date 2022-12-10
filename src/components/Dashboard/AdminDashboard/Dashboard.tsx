import React from "react";
import { Card, Dropdown, IDropdownItem, Input } from "elements";
import type { NextPage } from "next";
import { useDispatch } from "react-redux";
import { AppThunkDispatch } from "../../../redux/types";
import { useMemo, useState } from "react";
import { getUserBrandList } from "../../../api/user";
import { useQuery } from "react-query";
import styles from "./dashboard.module.css";
import TopBrands from "../../../components/shared/Dashboard/TopBrands/topBrands";
// import Payments from "../../../components/shared/Dashboard/Payments/payments";
// import TopCard from "../../../components/shared/TopCard/topCard";
import TopAgents from "../../shared/Dashboard/TopAgents/topAgents";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import RemainingTaskList from "../../shared/BrandPaymentList/BrandPaymentList";
import CarVendors from "../../shared/Dashboard/CarVendors/CarVendors";
import VansExpense from "../../shared/Dashboard/VansExpense/VansExpense";
import OtherExpense from "../../shared/Dashboard/OtherExpense/OtherExpense";
import { IAdmin } from "../../../model/admindashboard";
import {
  getAdminBrandDetails,
  getAdminDashboard,
  getAdminGraphDetails,
  getAdminStatsDetails,
} from "../../../api/admindashboard";
import GaugeContainer from "../../shared/Dashboard/Meter/meter";
import Meter from "../../shared/Dashboard/Meter/meter";
// import BrandTabs from "../../shared/Dashboard/BrandTabs/brandTabs";
import { IBrand } from "../../../model/brand";
import PaymentList from "../../shared/PaymentList/paymentList";
// import MainGraph from "../../shared/MainGraph/MainGraph";
// import PPCCard from "../../shared/PPCCard/ppcCard";
// import Marchant from "../../shared/Marchant/marchat";
// import Expense from "../../shared/Expense/Expense";
import TaskList from "../../../pages/tasks/taskList";
// import DashboardTaskList from "../../shared/Dashboard/DashboardTaskList.tsx/dashboardTaskList";
import { DatePicker } from "antd";
import "antd/dist/antd.css";
import dayjs from "dayjs";

const TopCard = React.lazy(
  () => import("../../../components/shared/TopCard/topCard")
);
const PPCCard = React.lazy(() => import("../../shared/PPCCard/ppcCard"));
const Payments = React.lazy(
  () => import("../../../components/shared/Dashboard/Payments/payments")
);
const Marchant = React.lazy(() => import("../../shared/Marchant/marchat"));
const Expense = React.lazy(() => import("../../shared/Expense/Expense"));
const DashboardTaskList = React.lazy(
  () => import("../../shared/Dashboard/DashboardTaskList.tsx/dashboardTaskList")
);
const MainGraph = React.lazy(() => import("../../shared/MainGraph/MainGraph"));
const BrandTabs = React.lazy(
  () => import("../../shared/Dashboard/BrandTabs/brandTabs")
);

const AdminDashboard: NextPage = () => {
  const dispatch = useDispatch<AppThunkDispatch>();

  const current = new Date();
  const date = `${current.getFullYear()}-${current.getMonth() + 1}`;
  const [month, setYearMonth] = useState<number | string>(date);
  const [dollarRate, setDollarRate] = useState<string | number>(225);

  const [key, setKey] = useState(1);
  // const value = parseInt(key);

  // const handledatatype = async (date: string) => {
  //   setYearMonth(date);
  // };
  const onChange = (date: any, dateString: any) => {
    console.log(dateString);
    setYearMonth(dateString);
  };

  const { data: graphdetails } = useQuery<IAdmin>(
    `Graph_${month}`,
    async () => {
      let response = await dispatch(
        getAdminGraphDetails({
          params: {
            yearmonth: month,
            dollar: dollarRate,
          },
        })
      );

      return response;
    },
    {
      // enabled: !!userId,
    }
  );

  const {
    data: dashboarddata,
    isLoading,
    refetch,
  } = useQuery<IAdmin>(
    `Dashboard_${month}`,
    async () => {
      let response = await dispatch(
        getAdminDashboard({
          params: {
            yearmonth: month,
            dollar: dollarRate,
          },
        })
      );
      // setLogoPathPrefix(response.profilepath);
      // setCoverPathPrefix(response.coverpath);
      // response = { ...response.data, brands: response.brands };
      return response;
    },
    {
      // enabled: !!userId,
    }
  );
  const userProfilePath = dashboarddata?.userpicturepath;
  const { data: branddetail } = useQuery<IBrand>(
    `BrandDetail_${key}${month}`,
    async () => {
      let response = await dispatch(
        getAdminBrandDetails({
          params: {
            yearmonth: month,
            brand_id: key,
          },
        })
      );
      // setLogoPathPrefix(response.profilepath);
      // setCoverPathPrefix(response.coverpath);
      // response = { ...response.data, brands: response.brands };
      return response;
    },
    {
      // enabled: !!userId,
    }
  );
  const { data: expense } = useQuery<IAdmin>(
    `Expense_${month}`,
    async () => {
      let response = await dispatch(
        getAdminStatsDetails({
          params: {
            yearmonth: month,
            dollar: dollarRate,
          },
        })
      );
      // setLogoPathPrefix(response.profilepath);
      // setCoverPathPrefix(response.coverpath);
      // response = { ...response.data, brands: response.brands };
      return response;
    },
    {
      // enabled: !!userId,
    }
  );
  const handlebrand = async (brandID: string) => {
    //@ts-ignore
    setKey(brandID);
  };

  const { data: brands } = useQuery(
    `UserBrandList`,
    async () => {
      const response = await dispatch(getUserBrandList());
      return response.data;
    },
    {
      // enabled: !!user?.user_id,
    }
  );
  const monthFormat = "YYYY/MM";
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <Card
              style={{
                border: "none",
                background: "#298ECE",
                borderBottomLeftRadius: "5px",
                borderBottomRightRadius: "5px",
                // background:
                //   'linear-gradient(-90deg, rgba(255,255,255,1) 0%, rgba(80,105,231,0.08) 50%)',
              }}
            >
              <div className="d-flex">
                <div className="col-lg-6">
                  <div style={{ marginLeft: "1rem" }}>
                    <h2
                      className={styles.fontfacegm}
                      style={{
                        margin: "0px",
                        fontWeight: "750",
                        color: "white",
                        // fontFamily: 'GoldmanBold',
                      }}
                    >
                      DASHBOARD
                    </h2>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className={styles.input} style={{ float: "right" }}>
                    {/* <Input
                      className={styles.monthinput}
                      name="month"
                      htmlType="month"
                      type="floating"
                      defaultValue={date}
                      onChange={(event) => handledatatype(event.target.value)}
                    /> */}

                    <DatePicker
                      //@ts-ignore
                      defaultValue={dayjs(month)}
                      // format={monthFormat}
                      onChange={onChange}
                      picker="month"
                      style={{ border: "none", margin: "1rem" }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <TopCard className={styles.card} topdata={dashboarddata?.topdata} />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <PPCCard marketing={dashboarddata?.topdata} />
          </div>
        </div>
        <div className="row" style={{ marginTop: "1rem" }}>
          <div className="col-lg-12">
            <Payments
              style={{}}
              //@ts-ignore
              graphdata={graphdetails}
              path={userProfilePath}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <Marchant />
          </div>
        </div>
        <div className="row" style={{ marginTop: "" }}>
          <div className="col-lg-12">
            <Expense
              //@ts-ignore
              statsdata={expense}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <DashboardTaskList taskdata={dashboarddata?.pendingtask} />
            {/* <PaymentList data={dashboarddata} /> */}
          </div>
        </div>
        <div className="row">
          <div className={`col-lg-12 ${styles.maingraph}`}>
            <MainGraph chartdata={dashboarddata?.graphdata} />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <Card
              className="container-fluid"
              style={{
                background: "white",
                borderRadius: "5px",
                border: "none",
                height: "38rem",
                marginTop: "1rem",
              }}
            >
              <div className="" style={{ marginTop: "1rem" }}>
                <h3 style={{ margin: "1rem", fontWeight: "700" }}>Brands</h3>
                <div className="col-lg-12" style={{ display: "flex" }}>
                  <div className="col-lg">
                    <Tabs
                      id="controlled-tab-example"
                      activeKey={key}
                      //@ts-ignore
                      onSelect={(brandID) => handlebrand(brandID)}
                      className={styles.sortingbutton}
                    >
                      {brands &&
                        brands?.length > 0 &&
                        brands.map((data: IAdmin) => (
                          <Tab
                            key={data?.brand_id}
                            eventKey={`${data?.brand_id}`}
                            title={`${data?.brand_name}`}
                          ></Tab>
                        ))}

                      {/* <Tab eventKey="2" title="Weekly"></Tab>
              <Tab eventKey="3" title="Monthly"></Tab> */}
                    </Tabs>
                  </div>
                </div>
              </div>
              <BrandTabs
                //@ts-ignore
                year={month}
                branddata={branddetail}
              />
            </Card>
          </div>
        </div>

        {/* <div
          className="row"
          style={{ marginTop: '1rem', marginBottom: '1rem' }}
        >
          <div className="col-lg-6">
            <TopAgents style={{}} topagent={dashboarddata} />
          </div>
            <TopBrands style={{}} topbrand={dashboarddata} /> 
          <div className="col-lg-6">
          </div>
        </div> */}

        {/* <div className="row">
          <div className="col-lg-8 d-flex">
            <div style={{ margin: '0px' }}></div>

            <div style={{ marginTop: '1.3rem', marginLeft: '1rem' }}>
              <p style={{ margin: '0px', color: 'rgb(80, 105, 231)' }}>
                Current Dollar Rate
              </p>
              <div style={{ display: 'flex' }}>
                <span
                  style={{
                    marginTop: '2px',
                    marginRight: '3px',
                    fontWeight: '500',
                    fontSize: '15px',
                  }}
                >
                  $
                </span>
                <Input
                  className={styles.inputfield}
                  name="lead_email"
                  htmlType="Number"
                  type="floating"
                  labelClass={styles.inputlabel}
                  defaultValue={dollarRate}
                  onChange={(event) => setDollarRate(event.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div style={{ display: 'flex', float: 'right' }}>
              <div
                style={{
                  background: 'rgb(235, 228, 234, 0.3)',
                  borderRadius: '5px',
                  margin: '15px',
                  marginRight: '5px',
                }}
              ></div>

              <div style={{ marginTop: '15px' }}>
                <Input
                  className={styles.monthinputfield}
                  name="month"
                  htmlType="month"
                  type="floating"
                  defaultValue={date}
                  onChange={(event) => handledatatype(event.target.value)}
                />
               
              </div>
            </div>
          </div>
        </div> */}
        {/* <Tabs
                  id="controlled-tab-example"
                  activeKey={key}
                  onSelect={(dataType) => handledatatype(dataType)}
                  className={styles.sortingbutton}
                >
                  <Tab eventKey="1" title="Daily"></Tab>
                  <Tab eventKey="2" title="Weekly"></Tab>
                  <Tab eventKey="3" title="Monthly"></Tab>
                </Tabs> */}
      </div>
    </>
  );
};

export default React.memo(AdminDashboard);
