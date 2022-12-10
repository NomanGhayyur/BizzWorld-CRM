import { Icon, Input } from "elements";
import React, { useCallback, useState } from "react";
import { IAdmin } from "../../../model/admindashboard";
import Meter from "../Dashboard/Meter/meter";
import styles from "./ManagerBrandTopCard.module.css";

type propType = {
  className?: string;
  style?: React.CSSProperties;
  data?: IAdmin;
};

const ManagerBrandTopCard = ({ data }: propType) => {
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
                        <p style={{ color: "gray" }}>Target</p>
                        <h4
                          style={{
                            margin: "auto",
                            fontWeight: "500",
                          }}
                        >
                          <span style={{ color: "rgb(80, 105, 231, 0.8)" }}>
                            $
                          </span>{" "}
                          {/* {data?.totalincomeindollar} */}
                          {
                            //@ts-ignore
                            currencyFormat(parseInt(data?.user_target))
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
                        <p style={{ color: "gray" }}>Achieved</p>
                        <h4
                          style={{
                            margin: "auto",
                            fontWeight: "500",
                          }}
                        >
                          <span style={{ color: "green" }}>$</span>{" "}
                          {/* {data?.paidincomeindollar} */}
                          {
                            //@ts-ignore
                            currencyFormat(parseInt(data?.achieved))
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
                        <p style={{ color: "gray" }}>Remaining</p>
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
                          {/* {data?.remaininngincomeindollar} */}
                          {
                            //@ts-ignore
                            currencyFormat(parseInt(data?.remaining))
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
                        <p style={{ color: "gray" }}>Per Day</p>
                        <h4
                          style={{
                            margin: "auto",
                            fontWeight: "500",
                          }}
                        >
                          <span
                            style={{
                              color: "orange",
                            }}
                          >
                            $
                          </span>{" "}
                          {/* {data?.ppcassignindollar} */}
                          {
                            //@ts-ignore
                            currencyFormat(parseInt(data?.perday))
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
                        <p style={{ color: "gray" }}>Paid Amount</p>
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
                            currencyFormat(parseInt(data?.paid))
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
                        <p style={{ color: "gray" }}>Unpaid Amount</p>
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
                            currencyFormat(parseInt(data?.unpaidamount))
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
                        <p style={{ color: "gray" }}>Recovery Amount</p>
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
                            currencyFormat(parseInt(data?.recovery))
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
                        <p style={{ color: "gray" }}>Cancel Amount</p>
                        <h4
                          style={{
                            margin: "auto",
                            fontWeight: "500",
                          }}
                        >
                          <span
                            style={{
                              color: "orange",
                            }}
                          >
                            $
                          </span>{" "}
                          {/* {data?.ppcspendindollar} */}
                          {
                            //@ts-ignore
                            currencyFormat(parseInt(data?.cancel))
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
                            No.
                          </span>{" "}
                          {/* {data?.remainingppcindollar} */}
                          {
                            //@ts-ignore
                            data?.counttotalorders
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
                            No.
                          </span>{" "}
                          {/* {data?.ppcspendindollar} */}
                          {
                            //@ts-ignore
                            data?.countcompleteorders
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
                        <p style={{ color: "gray" }}>Paid Orders</p>
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
                            No.
                          </span>{" "}
                          {/* {data?.ppcassignindollar} */}
                          {
                            //@ts-ignore
                            data?.countpaidorders
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
                        <p style={{ color: "gray" }}>Cancel Orders</p>
                        <h4
                          style={{
                            margin: "auto",
                            fontWeight: "500",
                          }}
                        >
                          <span
                            style={{
                              color: "orange",
                            }}
                          >
                            No.
                          </span>{" "}
                          {/* {data?.remainingppcindollar} */}
                          {
                            //@ts-ignore
                            data?.countcancel
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

export default ManagerBrandTopCard;
