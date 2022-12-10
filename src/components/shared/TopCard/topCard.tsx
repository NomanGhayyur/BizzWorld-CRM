import { Icon, Input } from "elements";
import React, { useCallback, useState } from "react";
import { IAdmin } from "../../../model/admindashboard";
import Meter from "../Dashboard/Meter/meter";
import styles from "./TopCard.module.css";

type propType = {
  className?: string;
  style?: React.CSSProperties;
  topdata?: IAdmin;
};

const TopCard = ({ topdata }: propType) => {
  function currencyFormat(num: number) {
    return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  return (
    <div className="">
      <div
        className="row"
        style={{
          marginTop: "0.5rem",
          marginBottom: "0.5rem",
          marginLeft: "0.1rem",
          marginRight: "0.7rem",
        }}
      >
        <div
          className="col-lg-3"
          style={{
            background: "white",
            borderRadius: "5px",
            marginBottom: "0.3rem",
            marginTop: "0.4rem",
          }}
        >
          <div style={{ marginTop: "1rem", marginLeft: "1rem" }}>
            <Meter data={topdata} />
          </div>
        </div>
        <div className="col-lg-9">
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
                    <div className="col-lg-4">
                      <div
                        style={{
                          background: "rgb(0, 0, 0,0.03)",
                          borderRadius: "50px",
                          width: "3rem",
                          height: "3rem",
                        }}
                      >
                        <Icon
                          name="coin"
                          style={{
                            margin: "0.55rem",
                            color: "#3e98c7",
                            fontSize: "30px",
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-8">
                      <div style={{ float: "right" }}>
                        <h4
                          style={{
                            margin: "0px",
                            fontWeight: "500",
                            float: "right",
                          }}
                        >
                          <span style={{ color: "#3e98c7" }}>$</span>{" "}
                          {
                            //@ts-ignore
                            currencyFormat(parseInt(topdata?.grosssale))
                          }
                          {/* {topdata?.totalincomeindollar} */}
                        </h4>{" "}
                        <br />
                        <p style={{ color: "gray", float: "right" }}>
                          Gross Sales
                        </p>
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
                    <div className="col-lg-4">
                      <div
                        style={{
                          background: "rgb(0, 0, 0,0.03)",
                          borderRadius: "50px",
                          width: "3rem",
                          height: "3rem",
                        }}
                      >
                        <Icon
                          name="coin"
                          style={{
                            margin: "0.55rem",
                            color: "green",
                            fontSize: "30px",
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-8">
                      <div style={{ float: "right" }}>
                        <h4
                          style={{
                            margin: "0px",
                            fontWeight: "500",
                            float: "right",
                          }}
                        >
                          <span style={{ color: "green" }}>$</span>{" "}
                          {/* {topdata?.paidincomeindollar} */}
                          {
                            //@ts-ignore
                            currencyFormat(parseInt(topdata?.paidsale))
                          }
                        </h4>{" "}
                        <br />
                        <p style={{ color: "gray", float: "right" }}>
                          Paid Sales
                        </p>
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
                    <div className="col-lg-4">
                      <div
                        style={{
                          background: "rgb(0, 0, 0,0.03)",
                          borderRadius: "50px",
                          width: "3rem",
                          height: "3rem",
                        }}
                      >
                        <Icon
                          name="coin"
                          style={{
                            margin: "0.55rem",
                            color: "orange",
                            fontSize: "30px",
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-8">
                      <div style={{ float: "right" }}>
                        <h4
                          style={{
                            margin: "0px",
                            fontWeight: "500",
                            float: "right",
                          }}
                        >
                          <span style={{ color: "orange" }}>$</span>{" "}
                          {/* {topdata?.remaininngincomeindollar} */}
                          {
                            //@ts-ignore
                            currencyFormat(parseInt(topdata?.unpaidsale))
                          }
                        </h4>{" "}
                        <br />
                        <p style={{ color: "gray", float: "right" }}>
                          Unpaid Sales
                        </p>
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
                    <div className="col-lg-4">
                      <div
                        style={{
                          background: "rgb(0, 0, 0,0.03)",
                          borderRadius: "50px",
                          width: "3rem",
                          height: "3rem",
                        }}
                      >
                        <Icon
                          name="coin"
                          style={{
                            margin: "0.55rem",
                            color: "brown",
                            fontSize: "30px",
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-8">
                      <div style={{ float: "right" }}>
                        <h4
                          style={{
                            margin: "0px",
                            fontWeight: "500",
                            float: "right",
                          }}
                        >
                          <span style={{ color: "brown" }}>$</span>{" "}
                          {/* {topdata?.ppcassignindollar} */}
                          {
                            //@ts-ignore
                            currencyFormat(parseInt(topdata?.cancel))
                          }
                        </h4>{" "}
                        <br />
                        <p style={{ color: "gray", float: "right" }}>
                          Cancelled
                        </p>
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
                    <div className="col-lg-4">
                      <div
                        style={{
                          background: "rgb(0, 0, 0,0.03)",
                          borderRadius: "50px",
                          width: "3rem",
                          height: "3rem",
                        }}
                      >
                        <Icon
                          name="coin"
                          style={{
                            margin: "0.55rem",
                            color: "rgb(80, 105, 231, 0.8)",
                            fontSize: "30px",
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-8">
                      <div style={{ float: "right" }}>
                        <h4
                          style={{
                            margin: "0px",
                            fontWeight: "500",
                            float: "right",
                          }}
                        >
                          <span style={{ color: "rgb(80, 105, 231, 0.8)" }}>
                            $
                          </span>{" "}
                          {/* {topdata?.ppcspendindollar} */}
                          {
                            //@ts-ignore
                            currencyFormat(parseInt(topdata?.recovery))
                          }
                        </h4>{" "}
                        <br />
                        <p style={{ color: "gray", float: "right" }}>
                          Recovery
                        </p>
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
                    <div className="col-lg-4">
                      <div
                        style={{
                          background: "rgb(0, 0, 0,0.03)",
                          borderRadius: "50px",
                          width: "3rem",
                          height: "3rem",
                        }}
                      >
                        <Icon
                          name="coin"
                          style={{
                            margin: "0.55rem",
                            color: "red",
                            fontSize: "30px",
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-8">
                      <div style={{ float: "right" }}>
                        <h4
                          style={{
                            margin: "0px",
                            fontWeight: "500",
                            float: "right",
                          }}
                        >
                          <span style={{ color: "red" }}>$</span>{" "}
                          {/* {topdata?.remainingppcindollar} */}
                          {currencyFormat(
                            //@ts-ignore
                            parseInt(topdata?.refund + topdata?.chargeback)
                          )}
                        </h4>{" "}
                        <br />
                        <p style={{ color: "gray", float: "right" }}>
                          Refund / Chargeback
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="row"
        style={{
          marginTop: "-0.5rem",
          marginBottom: "0.5rem",
          // marginLeft: "0.1rem",
          marginRight: "1.8rem",
        }}
      >
        <div className="col-lg-12">
          <div className="d-flex">
            <div
              className="col-lg-3"
              style={{
                background: "white",
                margin: "0.3rem",
                marginRight: "1rem",
                borderRadius: "5px",
              }}
            >
              <div style={{ height: "5rem" }}>
                <div style={{ margin: "1rem" }}>
                  <div className="row">
                    <div className="col-lg-4">
                      <div
                        style={{
                          background: "rgb(0, 0, 0,0.03)",
                          borderRadius: "50px",
                          width: "3rem",
                          height: "3rem",
                        }}
                      >
                        <Icon
                          name="coin"
                          style={{
                            margin: "0.55rem",
                            color: "#3e98c7",
                            fontSize: "30px",
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-8">
                      <div style={{ float: "right" }}>
                        <h4
                          style={{
                            margin: "0px",
                            fontWeight: "500",
                            float: "right",
                          }}
                        >
                          <span style={{ color: "#3e98c7" }}>$</span>{" "}
                          {
                            //@ts-ignore
                            currencyFormat(parseInt(topdata?.grosssale))
                          }
                          {/* {topdata?.totalincomeindollar} */}
                        </h4>{" "}
                        <br />
                        <p style={{ color: "gray", float: "right" }}>
                          Previous Recovered Sales
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-lg-3"
              style={{
                background: "white",
                margin: "0.3rem",
                borderRadius: "5px",
              }}
            >
              <div style={{ height: "5rem" }}>
                <div style={{ margin: "1rem" }}>
                  <div className="row">
                    <div className="col-lg-4">
                      <div
                        style={{
                          background: "rgb(0, 0, 0,0.03)",
                          borderRadius: "50px",
                          width: "3rem",
                          height: "3rem",
                        }}
                      >
                        <Icon
                          name="coin"
                          style={{
                            margin: "0.55rem",
                            color: "#3e98c7",
                            fontSize: "30px",
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-8">
                      <div style={{ float: "right" }}>
                        <h4
                          style={{
                            margin: "0px",
                            fontWeight: "500",
                            float: "right",
                          }}
                        >
                          <span style={{ color: "#3e98c7" }}>$</span>{" "}
                          {
                            //@ts-ignore
                            currencyFormat(parseInt(topdata?.grosssale))
                          }
                          {/* {topdata?.totalincomeindollar} */}
                        </h4>{" "}
                        <br />
                        <p style={{ color: "gray", float: "right" }}>
                          Previous Cancelled Sales
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-lg-3"
              style={{
                background: "white",
                margin: "0.3rem",
                borderRadius: "5px",
              }}
            >
              <div style={{ height: "5rem" }}>
                <div style={{ margin: "1rem" }}>
                  <div className="row">
                    <div className="col-lg-4">
                      <div
                        style={{
                          background: "rgb(0, 0, 0,0.03)",
                          borderRadius: "50px",
                          width: "3rem",
                          height: "3rem",
                        }}
                      >
                        <Icon
                          name="coin"
                          style={{
                            margin: "0.55rem",
                            color: "green",
                            fontSize: "30px",
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-8">
                      <div style={{ float: "right" }}>
                        <h4
                          style={{
                            margin: "0px",
                            fontWeight: "500",
                            float: "right",
                          }}
                        >
                          <span style={{ color: "green" }}>$</span>{" "}
                          {/* {topdata?.paidincomeindollar} */}
                          {
                            //@ts-ignore
                            currencyFormat(parseInt(topdata?.paidsale))
                          }
                        </h4>{" "}
                        <br />
                        <p style={{ color: "gray", float: "right" }}>
                          Previous Unpaid Sales
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-lg-3"
              style={{
                background: "white",
                margin: "0.3rem",
                borderRadius: "5px",
              }}
            >
              <div style={{ height: "5rem" }}>
                <div style={{ margin: "1rem" }}>
                  <div className="row">
                    <div className="col-lg-4">
                      <div
                        style={{
                          background: "rgb(0, 0, 0,0.03)",
                          borderRadius: "50px",
                          width: "3rem",
                          height: "3rem",
                        }}
                      >
                        <Icon
                          name="coin"
                          style={{
                            margin: "0.55rem",
                            color: "orange",
                            fontSize: "30px",
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-8">
                      <div style={{ float: "right" }}>
                        <h4
                          style={{
                            margin: "0px",
                            fontWeight: "500",
                            float: "right",
                          }}
                        >
                          <span style={{ color: "orange" }}>$</span>{" "}
                          {/* {topdata?.remaininngincomeindollar} */}
                          {
                            //@ts-ignore
                            currencyFormat(parseInt(topdata?.unpaidsale))
                          }
                        </h4>{" "}
                        <br />
                        <p style={{ color: "gray", float: "right" }}>
                          Total Unpaid Sales
                        </p>
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

export default React.memo(TopCard);
