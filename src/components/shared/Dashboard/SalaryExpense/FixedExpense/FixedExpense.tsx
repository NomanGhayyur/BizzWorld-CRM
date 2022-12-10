import { Button, Card, Icon, Avatar } from "elements";
import React, { useState } from "react";
import Image from "next/image";
import Update from "../../../../../public/icons/update.svg";
import { IAdmin } from "../../../../../model/admindashboard";

type ComponentProps = {
  otherdata: IAdmin;
  style: React.CSSProperties;
};

const FixedExpense = ({ style, otherdata }: ComponentProps) => {
  return (
    <div
      className="container-fluid"
      style={{
        borderRadius: "5px",
        boxShadow: "0px 2px 0px 0px rgba(0, 0, 0, 0.1)",
        background: "rgba(80, 105, 231, 0.06)",
      }}
    >
      <div className="m-2">
        <div
          className="row"
          style={{
            borderBottom: "1px solid #ededed",
          }}
        >
          <div className="col-lg-12" style={{}}>
            <h5
              style={{
                fontSize: "17px",
                fontWeight: "700",
                margin: "0.5rem",
              }}
            >
              Fixed Expense
            </h5>
          </div>
        </div>
        <div
          className="row"
          style={{
            marginTop: "0.3rem",
          }}
        >
          <div className="col-lg-8">
            <span
              style={{
                fontSize: "14px",
                color: "gray",
              }}
            >
              Name
            </span>
          </div>

          <div className="col-lg-4">
            <span
              style={{
                fontSize: "14px",
                color: "gray",
              }}
            >
              Rent
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
          {otherdata &&
            otherdata?.length > 0 &&
            //@ts-ignore
            otherdata.map((data: IAdmin) => (
              <div
                className="row"
                style={{
                  marginTop: "10px",
                  marginBottom: "15px",
                  marginLeft: "0px",
                  marginRight: "0px",
                }}
                key={data.van_id}
              >
                <div
                  className="col-lg-8 d-flex"
                  style={{ margin: "0px", padding: "0px" }}
                >
                  <p
                    style={{
                      color: "rgb(80, 105, 231)",
                      fontSize: "13px",
                      fontWeight: "500",
                      marginTop: "5px",
                      marginBottom: "0px",
                      marginLeft: "10px",
                    }}
                  >
                    {data?.expense_title}
                  </p>
                </div>

                <div className="col-lg-4">
                  <p
                    style={{
                      color: "rgb(80, 105, 231)",
                      fontSize: "12px",
                      fontWeight: "500",
                      marginTop: "5px",
                      marginBottom: "0px",
                      // textAlign: 'center',
                    }}
                  >
                    {data?.expense_amount}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
export default React.memo(FixedExpense);
