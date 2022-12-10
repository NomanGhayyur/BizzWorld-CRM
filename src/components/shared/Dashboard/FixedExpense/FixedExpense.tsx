import { Button, Card, Icon, Avatar } from "elements";
import React, { useState } from "react";
import Image from "next/image";
import Update from "../../../../../public/icons/update.svg";
import { IAdmin } from "../../../../model/admindashboard";

type ComponentProps = {
  data: IAdmin;
  style: React.CSSProperties;
};

const FixedExpense = ({ style, data }: ComponentProps) => {
  //@ts-ignore
  const Fdata = data?.fixexpense;
  function currencyFormat(num: number) {
    return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

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
              Title
            </span>
          </div>

          <div className="col-lg-4">
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
          {Fdata &&
            Fdata?.length > 0 &&
            Fdata.map((data: IAdmin) => (
              <div
                className="row"
                style={{
                  marginTop: "10px",
                  marginBottom: "15px",
                  marginLeft: "0px",
                  marginRight: "0px",
                }}
                //@ts-ignore
                key={data.expense_id}
              >
                <div
                  className="col-lg-8 d-flex"
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
                    {data?.expense_title}
                  </p>
                </div>

                <div className="col-lg-4">
                  <p
                    style={{
                      color: "",
                      fontSize: "12px",
                      fontWeight: "500",
                      marginTop: "5px",
                      marginBottom: "0px",
                      // textAlign: 'center',
                    }}
                  >
                    {/* {data?.expense_amount} */}
                    Rs{" "}
                    {
                      //@ts-ignore
                      currencyFormat(parseInt(data?.expense_amount))
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
                $ {currencyFormat(parseInt(data?.sumallexpense?.sumfixexpense))}
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default React.memo(FixedExpense);
