import { Icon, Input } from "elements";
import React, { useCallback, useState } from "react";
import { IAdmin } from "../../../model/admindashboard";
import Meter from "../Dashboard/Meter/meter";
import styles from "./DesignerBrandTopCard.module.css";

type propType = {
  className?: string;
  style?: React.CSSProperties;
  data?: IAdmin;
};

const DesignerBrandTopCard = ({ data }: propType) => {
  function currencyFormat(num: number) {
    return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  return (
    <div
      className="container-fluid"
      style={{ marginLeft: "0px", paddingLeft: "0px" }}
    >
      <div className="" style={{ marginTop: "0.5rem" }}>
        <div className="" style={{ paddingLeft: "0.5rem" }}>
          <div className="d-flex">
            <div
              className="col-lg"
              style={{
                background: "white",
                margin: "0.3rem",
                borderRadius: "5px",
              }}
            >
              <div style={{ height: "5rem" }}>
                <div style={{ margin: "1rem" }}>
                  <div className="row">
                    <div className="col-lg-12">
                      <div style={{}}>
                        <p style={{ color: "gray" }}>Total Orders</p>
                        <h4
                          style={{
                            margin: "auto",
                            fontWeight: "500",
                          }}
                        >
                          <span
                            style={{
                              color: "rgb(80, 105, 231, 0.8)",
                            }}
                          >
                            $
                          </span>{" "}
                          {/* {data?.remainingppcindollar} */}
                          {
                            //@ts-ignore
                            currencyFormat(parseInt(data?.totalorder))
                          }
                        </h4>{" "}
                        <br />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-lg"
              style={{
                background: "white",
                margin: "0.3rem",
                borderRadius: "5px",
              }}
            >
              <div style={{ height: "5rem" }}>
                <div style={{ margin: "1rem" }}>
                  <div className="row">
                    <div className="col-lg-12">
                      <div style={{}}>
                        <p style={{ color: "gray" }}>Complete Orders</p>
                        <h4
                          style={{
                            margin: "auto",
                            fontWeight: "500",
                          }}
                        >
                          <span
                            style={{
                              color: "green",
                            }}
                          >
                            $
                          </span>{" "}
                          {/* {data?.ppcspendindollar} */}
                          {
                            //@ts-ignore
                            currencyFormat(parseInt(data?.completeorder))
                          }
                        </h4>{" "}
                        <br />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-lg"
              style={{
                background: "white",
                margin: "0.3rem",
                borderRadius: "5px",
              }}
            >
              <div style={{ height: "5rem" }}>
                <div style={{ margin: "1rem" }}>
                  <div className="row">
                    <div className="col-lg-12">
                      <div style={{}}>
                        <p style={{ color: "gray" }}>Pending Orders</p>
                        <h4
                          style={{
                            margin: "auto",
                            fontWeight: "500",
                          }}
                        >
                          <span
                            style={{
                              color: "yellowgreen",
                            }}
                          >
                            $
                          </span>{" "}
                          {/* {data?.ppcassignindollar} */}
                          {
                            //@ts-ignore
                            currencyFormat(parseInt(data?.pendingorder))
                          }
                        </h4>{" "}
                        <br />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignerBrandTopCard;
