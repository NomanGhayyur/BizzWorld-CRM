import { Card } from "elements";
import type { NextPage } from "next";
import { useDispatch, useSelector } from "react-redux";
import { AppThunkDispatch, RootState } from "../../../redux/types";
import { useState } from "react";
import { getUserBrandList } from "../../../api/user";
import { useQuery } from "react-query";
import styles from "./dashboard.module.css";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { IAdmin } from "../../../model/admindashboard";
import { getAdminBrandDetails } from "../../../api/admindashboard";
import { IBrand } from "../../../model/brand";
import { DatePicker } from "antd";
import "antd/dist/antd.css";
import dayjs from "dayjs";
import ManagerBrandTabs from "../../shared/Dashboard/ManagerBrandTabs/managerBrandTabs";
import { getSalesDashboard } from "../../../api/salesdasboard";

const ManagerDashboard: NextPage = () => {
  const dispatch = useDispatch<AppThunkDispatch>();
  const userId = useSelector((store: RootState) => store.auth.user?.user_id);
  const current = new Date();
  const date = `${current.getFullYear()}-${current.getMonth() + 1}`;
  const [month, setYearMonth] = useState<number | string>(date);
  const [dollarRate, setDollarRate] = useState<string | number>(225);
  const [key, setKey] = useState(1);

  const onChange = (date: any, dateString: any) => {
    setYearMonth(dateString);
  };

  const { data: branddetail } = useQuery<IBrand>(
    `BrandDetail_${key}${month}`,
    async () => {
      let response = await dispatch(
        getSalesDashboard({
          params: {
            id: userId,
            yearmonth: month,
            brand_id: key,
          },
        })
      );

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
                      }}
                    >
                      DASHBOARD
                    </h2>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className={styles.input} style={{ float: "right" }}>
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
                    </Tabs>
                  </div>
                </div>
              </div>
              <ManagerBrandTabs
                //@ts-ignore

                year={month}
                branddata={branddetail}
              />
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManagerDashboard;
