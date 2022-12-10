import { Avatar, Button, Card, Dropdown, IDropdownItem, Input } from "elements";
import type { NextPage } from "next";
import { useDispatch } from "react-redux";
import { AppThunkDispatch } from "../../../redux/types";
import { useState } from "react";
import { useQuery } from "react-query";
import styles from "./tabs.module.css";
import { IAdmin } from "../../../model/admindashboard";
import Image from "next/image";
import React from "react";

type propType = {
  className?: string;
  style?: React.CSSProperties;
  saleagent?: IAdmin;
};

const BrandTabs: NextPage = ({ saleagent }: propType) => {
  //@ts-ignore
  const brandLogo = saleagent?.brandlogopath;

  function currencyFormat(num: number) {
    return num.toFixed().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  const path = saleagent?.userpicturepath;
  const user = saleagent?.agenttarget;
  const topagent = saleagent?.topagent;

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12" style={{ display: "flex" }}>
          <div className="col-lg-10" style={{ display: "flex" }}>
            <div
              style={{
                margin: "1rem",
                marginLeft: "0px",
              }}
            >
              <Image
                alt={`${saleagent?.branddetails?.brand_name}`}
                src={`http://192.168.0.96:401/aicrm/public/brand_logo/${saleagent?.branddetails?.brand_logo}`}
                height={"35rem"}
                width={"70rem"}
              />
            </div>
            <h4
              style={{ margin: "1rem", marginLeft: "0px" }}
            >{`${saleagent?.branddetails?.brand_name}`}</h4>
          </div>
          <div className="col-lg-2">
            <Button
              style={{
                background: "none",
                color: "rgb(148, 23, 46)",
                fontSize: "12px",
                fontWeight: "700",
                padding: "0px",
                float: "right",
                marginTop: "1rem",
              }}
            >
              <p style={{ margin: "0px", fontWeight: "700" }}>
                {"See Details >"}
              </p>
            </Button>
          </div>
        </div>
      </div>
      <hr style={{ margin: "0px", marginBottom: "0.5rem", color: "#d1cece" }} />
      <div className="row">
        <div className="col-lg-12" style={{ display: "flex" }}>
          {topagent &&
            topagent.length > 0 &&
            topagent.map((data: IAdmin) => (
              <div key={data?.user_id} className="col-lg-4">
                <Card
                  style={{
                    border: "none",
                    boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
                    background: "rgba(80, 105, 231, 0.03)",
                    height: "6rem",
                    margin: "0.2rem",
                    borderRadius: "5px",
                  }}
                >
                  <div className="col-lg-12" style={{ display: "flex" }}>
                    <div className="col-lg-3">
                      <Avatar
                        name={`${path}${data?.user_picture}`}
                        src={`${path}${data?.user_picture}`}
                        style={{
                          margin: "0.5rem",
                          fontSize: "10px",
                          // height: 'auto',
                          // width: '20px',
                        }}
                      />
                    </div>
                    <div
                      className="col-lg-9"
                      style={{
                        wordBreak: "break-all",
                      }}
                    >
                      <h5
                        style={{
                          margin: "0.3rem",
                          marginTop: "1.1rem",
                          fontSize: "0.8rem",
                        }}
                      >
                        {data?.user_name}
                      </h5>
                    </div>
                  </div>
                  <div className="col-lg-12" style={{ display: "flex" }}>
                    <div className="col-lg-6" style={{ textAlign: "center" }}>
                      <p style={{ margin: "0px", color: "gray" }}>Target</p>
                    </div>
                    <div className="col-lg-6" style={{ textAlign: "center" }}>
                      <p style={{ margin: "0px", color: "gray" }}>Achieved</p>
                    </div>
                  </div>
                  <div className="col-lg-12" style={{ display: "flex" }}>
                    <div className="col-lg-6" style={{ textAlign: "center" }}>
                      <p style={{ margin: "0px", fontWeight: "500" }}>
                        ${" "}
                        {
                          //@ts-ignore
                          currencyFormat(parseInt(data?.user_target))
                        }
                      </p>
                    </div>
                    <div className="col-lg-6" style={{ textAlign: "center" }}>
                      <p style={{ margin: "0px", fontWeight: "500" }}>
                        ${" "}
                        {
                          //@ts-ignore
                          currencyFormat(parseInt(data?.achieve))
                        }
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
        </div>
      </div>
      <div
        className="col-lg-12"
        style={{ display: "flex", marginTop: "0.5rem" }}
      >
        <div className="col-lg-4">
          <p style={{ color: "gray" }}>Name</p>
        </div>
        <div className="col-lg-2">
          <p style={{ color: "gray" }}>Target</p>
        </div>
        <div className="col-lg-2">
          <p style={{ color: "gray" }}>Achieved</p>
        </div>
        <div className="col-lg-2">
          <p style={{ color: "gray" }}>Paid</p>
        </div>
        <div className="col-lg-2">
          <p style={{ color: "gray" }}>Cancelled</p>
        </div>
      </div>
      <div
        style={{
          height: "34rem",
          overflowY: "scroll",
        }}
      >
        {user &&
          user.length > 0 &&
          user.map((data: IAdmin) => (
            <>
              <div
                key={data?.user_id}
                className="col-lg-12"
                style={{ display: "flex" }}
              >
                <div className="col-lg-4">
                  <div style={{ display: "flex" }}>
                    <Avatar
                      name={data?.user_name}
                      src={`${path}${data?.user_picture}`}
                      style={{
                        //   margin: 'auto',
                        //   marginTop: '3px',
                        fontSize: "10px",
                        // height: 'auto',
                        // width: '20px',
                      }}
                    />
                    <span style={{ margin: "auto", marginLeft: "1rem" }}>
                      {data?.user_name}
                    </span>
                  </div>
                </div>
                <div className="col-lg-2">
                  <h5
                    style={{
                      fontWeight: "500",
                      margin: "0px",
                      marginTop: "0.5rem",
                    }}
                  >
                    <span>$</span>
                    {data?.user_target}
                  </h5>
                </div>
                <div className="col-lg-2">
                  <h5
                    style={{
                      fontWeight: "500",
                      margin: "0px",
                      marginTop: "0.5rem",
                    }}
                  >
                    <span>$</span> {data?.achieve}
                  </h5>
                </div>
                <div className="col-lg-2">
                  <h5
                    style={{
                      fontWeight: "500",
                      margin: "0px",
                      marginTop: "0.5rem",
                    }}
                  >
                    <span>$</span>
                    {data?.paid}
                  </h5>
                </div>
                <div className="col-lg-2">
                  <h5
                    style={{
                      fontWeight: "500",
                      margin: "0px",
                      marginTop: "0.5rem",
                    }}
                  >
                    <span>$</span>
                    {data?.cancel}
                  </h5>
                </div>
              </div>
              <hr style={{ margin: "0.5rem", color: "rgb(209, 206, 206)" }} />
            </>
          ))}
      </div>
    </div>
  );
};

export default React.memo(BrandTabs);
