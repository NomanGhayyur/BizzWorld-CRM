import { Button, Card, Icon, Avatar } from "elements";
import React, { useState } from "react";
import Image from "next/image";
import Update from "../../../../../public/icons/update.svg";
import { IAdmin } from "../../../../model/admindashboard";

type ComponentProps = {
  salarydata: IAdmin;
  style: React.CSSProperties;
};

const SalaryExpense = ({ style, salarydata }: ComponentProps) => {
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
        height: "15.9rem",
      }}
    >
      <div className="m-2" style={{}}>
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
              Salary Expense
            </h5>
          </div>
        </div>
        <div style={{ marginLeft: "" }}>
          <div
            className="row"
            style={{
              marginTop: "0.3rem",
            }}
          >
            <div className="col-lg-6">
              <span
                style={{
                  fontSize: "14px",
                  color: "",
                  fontWeight: "500",
                }}
              >
                Gross Salary
              </span>
            </div>

            <div className="col-lg-6">
              <p
                style={{
                  color: "gray",
                  fontSize: "13px",
                  // fontWeight: '500',
                  marginTop: "5px",
                  marginBottom: "0px",
                  marginLeft: "10px",
                }}
              >
                {/* {data?.grosssalary} */}
                Rs{" "}
                {
                  //@ts-ignore
                  currencyFormat(parseInt(salarydata?.grosssalary))
                }
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6">
              <span
                style={{
                  fontSize: "14px",
                  color: "",
                  fontWeight: "500",
                }}
              >
                Net Salary
              </span>
            </div>
            <div className="col-lg-6">
              <p
                style={{
                  color: "gray",
                  fontSize: "13px",

                  marginTop: "5px",
                  marginBottom: "0px",
                  marginLeft: "10px",
                }}
              >
                {/* {data?.grosssalary} */}
                Rs{" "}
                {
                  //@ts-ignore
                  currencyFormat(parseInt(salarydata?.netsalary))
                }
              </p>
            </div>
          </div>
          <div
            className="row"
            style={{
              marginTop: "0.3rem",
            }}
          >
            <div className="col-lg-6">
              <span
                style={{
                  fontSize: "14px",
                  color: "",
                  fontWeight: "500",
                }}
              >
                Correction
              </span>
            </div>

            <div className="col-lg-6">
              <p
                style={{
                  fontSize: "13px",
                  color: "gray",
                  marginTop: "5px",
                  marginBottom: "0px",
                  marginLeft: "10px",
                }}
              >
                {/* {data?.grosssalary} */}
                Rs{" "}
                {
                  //@ts-ignore
                  currencyFormat(parseInt(salarydata?.getcorrection))
                }
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* <hr style={{ color: 'gray', margin: '0px' }} /> */}
      <div>
        {/* <div className="row">
          <div className="col-lg-12">
            <div style={{ marginBottom: '0.5rem', display: 'flex' }}>
              <div className="col-lg-6">
                <h5
                  style={{
                    margin: '0px',
                    marginLeft: '1rem',
                    color: 'rgb(80, 105, 231)',
                  }}
                >
                  Total
                </h5>
              </div>
              <div className="col-lg-6">
                <h5
                  style={{
                    margin: '0px',
                    marginRight: '1rem',
                    float: 'right',
                    color: 'rgb(80, 105, 231)',
                  }}
                >
                  Rs {currencyFormat(parseInt(10000))}
                </h5>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};
export default React.memo(SalaryExpense);
