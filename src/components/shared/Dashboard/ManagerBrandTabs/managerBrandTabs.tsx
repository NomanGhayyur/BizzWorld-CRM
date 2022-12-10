import { Avatar, Button, Card, Dropdown, IDropdownItem, Input } from "elements";
import type { NextPage } from "next";
import { useDispatch } from "react-redux";
import { AppThunkDispatch } from "../../../../redux/types";
import { useState } from "react";
import { getUserBrandList } from "../../../../api/user";
import { useQuery } from "react-query";
import styles from "./tabs.module.css";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { IAdmin } from "../../../../model/admindashboard";
import BrandTopCard from "../../BrandTopCard/brandTopCard";
import Image from "next/image";
import { getAdminBrandDetails } from "../../../../api/admindashboard";
import { SalesLineChart } from "../../../LineChart/Linechart";
import BrandUserList from "../../BrandUserList/BrandUserList";
import RemainingTaskList from "../../BrandPaymentList/BrandPaymentList";
import BrandPaymentList from "../../BrandPaymentList/BrandPaymentList";
import ManagerBrandTopCard from "../../ManagerBrandTopCard/managerBrandTopCard";

type propType = {
  className?: string;
  style?: React.CSSProperties;
  branddata?: IAdmin;
  year?: number;
};

const ManagerBrandTabs: NextPage = ({ branddata, year }: propType) => {
  return (
    <div className="">
      <Card
        style={{
          border: "none",
          height: "33.5rem",
          overflowY: "scroll",
          background: "rgba(80, 105, 231, 0.06)",
        }}
      >
        <div className="container-fluid" style={{}}>
          <div className="row">
            <div className="col-lg-12" style={{ display: "flex" }}>
              <div className="col-lg-10" style={{ display: "flex" }}>
                <div
                  style={{
                    margin: "1rem",
                    marginLeft: "0px",
                    marginBottom: "0px",
                  }}
                >
                  <Image
                    alt={
                      //@ts-ignore
                      `${branddata?.branddetail?.brand_name}`
                    }
                    //@ts-ignore
                    src={`http://192.168.0.96:401/aicrm/public/brand_logo/${branddata?.branddetail?.brand_logo}`}
                    height={"50rem"}
                    width={"100rem"}
                  />
                </div>
                <h4
                  style={{
                    margin: "1rem",
                    marginLeft: "0px",
                    fontWeight: "700",
                    fontSize: "35px",
                  }}
                  //@ts-ignore
                >{`${branddata?.branddetail?.brand_name}`}</h4>
              </div>
            </div>
          </div>
          <div className="row">
            <div className={`col-lg ${styles.graph}`}>
              <ManagerBrandTopCard
                //@ts-ignore
                data={branddata?.target}
              />
              <div>
                <SalesLineChart
                  //@ts-ignore
                  chartdata={branddata?.daileordercount}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ManagerBrandTabs;
