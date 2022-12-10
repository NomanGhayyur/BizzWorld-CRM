import { Button, Card, Icon, Avatar } from "elements";
import React, { useState } from "react";
import Image from "next/image";
import Update from "../../../../../public/icons/update.svg";
import { IAdmin } from "../../../../model/admindashboard";

type ComponentProps = {
  style: React.CSSProperties;
  cardata: IAdmin;
};

const CarVendors = ({ style, cardata }: ComponentProps) => {
  const Cdata = cardata?.carexpense;
  function currencyFormat(num: number) {
    return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }
  // const data = cardata.carexpense;
  return (
    <div
      className="container-fluid"
      style={{
        borderRadius: "5px",
        boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
        background: "white",
      }}
    >
      <div className="m-2">
        <div
          className="row"
          style={{
            borderBottom: "1px solid #ededed",
          }}
        >
          <div className="col-lg-12">
            <h5
              style={{
                fontSize: "17px",
                fontWeight: "700",
                margin: "0.5rem",
              }}
            >
              Car Expense
            </h5>
          </div>
        </div>
        <div
          className="row"
          style={{
            marginTop: "0.3rem",
          }}
        >
          <div className="col-lg-4">
            <span
              style={{
                fontSize: "14px",
                color: "gray",
              }}
            >
              Car Name
            </span>
          </div>
          <div className="col-lg-5">
            <span
              style={{
                fontSize: "14px",
                color: "gray",
              }}
            >
              To
            </span>
          </div>
          <div className="col-lg-3">
            <span
              style={{
                fontSize: "14px",
                color: "gray",
              }}
            >
              Amount
            </span>
          </div>
        </div>
        <div
          style={{
            paddingBottom: "1px",
            overflowY: "scroll",
            height: "9rem",
          }}
        >
          {Cdata &&
            Cdata?.length > 0 &&
            Cdata.map((data: IAdmin) => (
              <div
                className="row"
                style={{
                  marginTop: "10px",
                  marginBottom: "15px",
                  marginLeft: "0px",
                  marginRight: "0px",
                }}
                key={data?.car_id}
              >
                <div
                  className="col-lg-4 d-flex"
                  style={{ margin: "0px", padding: "0px" }}
                >
                  <p
                    style={{
                      color: "",
                      fontSize: "13px",
                      fontWeight: "500",
                      marginTop: "5px",
                      marginBottom: "0px",
                      marginLeft: "10px",
                    }}
                  >
                    {data?.car_name}
                  </p>
                </div>

                <div className="col-lg-5">
                  <p
                    style={{
                      color: "",
                      fontSize: "12px",
                      fontWeight: "500",
                      marginTop: "5px",
                      marginBottom: "0px",
                    }}
                  >
                    {data?.assignto}
                  </p>
                </div>
                <div className="col-lg-3">
                  <p
                    style={{
                      color: "",
                      fontSize: "12px",
                      fontWeight: "500",
                      marginTop: "5px",
                      marginBottom: "0px",
                      textAlign: "center",
                    }}
                  >
                    {/* {`Rs ${data?.car_rent}`} */}
                    Rs{" "}
                    {
                      //@ts-ignore
                      currencyFormat(parseInt(data?.car_rent))
                    }
                  </p>
                </div>
                <hr style={{ margin: "0px", color: "lightgray" }} />
              </div>
            ))}
        </div>
      </div>
      <hr style={{ color: "gray", margin: "0px" }} />

      <div className="row">
        <div className="col-lg-12">
          <div style={{ marginBottom: "0.5rem", display: "flex" }}>
            <div className="col-lg-6">
              <h5
                style={{
                  margin: "0px",
                  marginLeft: "1rem",
                  color: "rgb(148, 23, 46)",
                }}
              >
                Total
              </h5>
            </div>
            <div className="col-lg-6">
              <h5
                style={{
                  margin: "0px",
                  marginRight: "1rem",
                  float: "right",
                  color: "rgb(148, 23, 46)",
                }}
              >
                Rs{" "}
                {currencyFormat(parseInt(cardata?.sumallexpense?.sumcarrent))}
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default React.memo(CarVendors);
