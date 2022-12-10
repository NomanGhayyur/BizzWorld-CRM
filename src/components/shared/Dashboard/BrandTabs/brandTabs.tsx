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
import Image from "next/image";
import { getAdminBrandDetails } from "../../../../api/admindashboard";
import { AdminLineChart } from "../../../LineChart/Linechart";
import RemainingTaskList from "../../BrandPaymentList/BrandPaymentList";
import React from "react";

const BrandTopCard = React.lazy(
  () => import("../../BrandTopCard/brandTopCard")
);
const BrandUserList = React.lazy(
  () => import("../../BrandUserList/BrandUserList")
);
const BrandPaymentList = React.lazy(
  () => import("../../BrandPaymentList/BrandPaymentList")
);

type propType = {
  className?: string;
  style?: React.CSSProperties;
  branddata?: IAdmin;
  year?: number;
};

const BrandTabs: NextPage = ({ branddata, year }: propType) => {
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
          {/* <div className="row">
            <div className="col-lg-12">
              <div style={{ display: 'flex' }}>
                <div
                  style={{
                    margin: '1rem',
                    marginTop: '1.7rem',
                  }}
                >
                  <Image
                    alt={`${branddata?.branddetails?.brand_name}`}
                    src={`http://192.168.0.96:401/aicrm/public/brand_logo/${branddata?.branddetails?.brand_logo}`}
                    height={100}
                    width={200}
                  />
                </div>
                <div
                  style={{
                    width: '20rem',
                    margin: '1rem',
                    marginTop: '1.7rem',
                  }}
                >
                  <h4
                    style={{
                      margin: '0px',
                      //   marginTop: '1.7rem',
                    }}
                  >
                    {branddata?.branddetails?.brand_name}
                  </h4>
                </div>

                <p
                  style={{
                    marginTop: '2rem',
                    marginLeft: '2rem',
                  }}
                >
                  {branddata?.branddetails?.brand_description}
                </p>
              </div>
            </div>
          </div> */}
          <div className="row">
            <div className={`col-lg-6 ${styles.graph}`}>
              <BrandTopCard data={branddata?.stats} />
              <div>
                <AdminLineChart chartdata={branddata?.daywisepaidincome} />
              </div>
            </div>
            <div className="col-lg-6">
              <Card
                style={{
                  marginTop: "0.7rem",
                  border: "none",
                  height: "42rem",
                  overflowY: "scroll",
                  borderRadius: "5px",
                }}
              >
                <div className="container-fluid">
                  <BrandUserList
                    //@ts-ignore
                    saleagent={branddata}
                  />
                </div>
              </Card>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <Card
                style={{
                  marginTop: "0.7rem",
                  marginBottom: "0.7rem",
                  border: "none",
                  height: "29rem",
                  overflowY: "scroll",
                  borderRadius: "5px",
                }}
              >
                <BrandPaymentList
                  //@ts-ignore
                  paymentdata={branddata?.payments}
                  isLoading={undefined}
                />
              </Card>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default React.memo(BrandTabs);
