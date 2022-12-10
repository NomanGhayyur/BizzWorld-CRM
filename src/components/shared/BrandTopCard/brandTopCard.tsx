import { Icon, Input } from "elements";
import React, { useCallback, useState } from "react";
import { IAdmin } from "../../../model/admindashboard";
import Meter from "../Dashboard/Meter/meter";
import styles from "./BrandTopCard.module.css";

type propType = {
  className?: string;
  style?: React.CSSProperties;
  data?: IAdmin;
};

const BrandTopCard = ({ data }: propType) => {
  function currencyFormat(num: number) {
    return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  return (
    <div
      className="container-fluid"
      style={{ marginLeft: "0px", paddingLeft: "0px" }}
    >
      <div className="row" style={{ marginTop: "0.5rem" }}>
        <div className="col-lg-12" style={{ paddingLeft: "0.5rem" }}>
          <div className="d-flex">
            <div
              className="col-lg-4"
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
                        <p style={{ color: "gray" }}>Total Income</p>
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
                            currencyFormat(parseInt(data?.totalincomeindollar))
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
              className="col-lg-4"
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
                        <p style={{ color: "gray" }}>Paid Income</p>
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
                            currencyFormat(parseInt(data?.paidincomeindollar))
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
              className="col-lg-4"
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
                        <p style={{ color: "gray" }}>Remaining Income</p>
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
                          {currencyFormat(
                            //@ts-ignore
                            parseInt(data?.remaininngincomeindollar)
                          )}
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
              className="col-lg-4"
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
                        <p style={{ color: "gray" }}>Total Unpaid</p>
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
                            currencyFormat(parseInt(data?.remainingppcindollar))
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
              className="col-lg-4"
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
                        <p style={{ color: "gray" }}>Previous Unpaid</p>
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
                            currencyFormat(parseInt(data?.ppcspendindollar))
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
              className="col-lg-4"
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
                        <p style={{ color: "gray" }}>Previous Cancel</p>
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
                            currencyFormat(parseInt(data?.ppcassignindollar))
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
              className="col-lg-4"
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
                        <p style={{ color: "gray" }}>Recovery</p>
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
                            currencyFormat(parseInt(data?.remainingppcindollar))
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
              className="col-lg-4"
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
                        <p style={{ color: "gray" }}>Cancel</p>
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
                            currencyFormat(parseInt(data?.ppcspendindollar))
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
              className="col-lg-4"
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
                        <p style={{ color: "gray" }}>Refund / Chargeback</p>
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
                            currencyFormat(parseInt(data?.ppcassignindollar))
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
              className="col-lg-4"
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
                        <p style={{ color: "gray" }}>PPC Assigned</p>
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
                          {/* {data?.ppcassignindollar} */}
                          {
                            //@ts-ignore
                            currencyFormat(parseInt(data?.ppcassignindollar))
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
              className="col-lg-4"
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
                        <p style={{ color: "gray" }}>PPC Spent</p>
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
                            currencyFormat(parseInt(data?.ppcspendindollar))
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
              className="col-lg-4"
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
                        <p style={{ color: "gray" }}>PPC Remaining</p>
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
                          {/* {data?.remainingppcindollar} */}
                          {
                            //@ts-ignore
                            currencyFormat(parseInt(data?.remainingppcindollar))
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

export default React.memo(BrandTopCard);
