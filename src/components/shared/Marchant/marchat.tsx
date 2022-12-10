import { Icon, Input } from "elements";
import React, { useCallback, useState } from "react";
import { IAdmin } from "../../../model/admindashboard";
import Meter from "../Dashboard/Meter/meter";

import styles from "./Marchant.module.css";
import Image from "next/image";
import Paypal from "../../../../public/images/PayPal.png";
import Stripe from "../../../../public/images/stripe.png";
import WorldPay from "../../../../public/images/worldpay.png";
import Google from "../../../../public/images/googlepay.png";
import Payoneer from "../../../../public/images/payoneer.png";

const DoughnutChart = React.lazy(
  () => import("../Dashboard/DoughnutChart/DoughnutChart")
);

type propType = {
  className?: string;
  style?: React.CSSProperties;
  topdata?: IAdmin;
};

const Marchant = ({ topdata }: propType) => {
  function currencyFormat(num: number) {
    return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  return (
    <div
      className=""
      style={{
        background: "white",
        borderRadius: "5px",
        height: "26rem",
        marginTop: "1rem",
        marginBottom: "1rem",
      }}
    >
      <div className="row">
        <div className="col-lg-12">
          <h3 style={{ margin: "1rem", fontWeight: "700" }}>Marchants</h3>
        </div>
      </div>
      <div
        className="row"
        style={{
          marginTop: "0.5rem",
          marginBottom: "0.5rem",
          marginLeft: "1rem",
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
            boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div style={{ margin: "0rem" }}>
            <DoughnutChart
              //@ts-ignore
              data={topdata}
            />
          </div>
        </div>
        <div className="col-lg-9">
          <div className="d-flex">
            <div
              className="col-lg-2"
              style={{
                boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
                height: "17rem",
                borderRadius: "5px",
                margin: "1rem",
              }}
            >
              <div style={{ margin: "1rem" }}>
                <div style={{ textAlign: "center" }}>
                  <Image
                    alt={`Paypal`}
                    src={Paypal}
                    height={50}
                    width={100}
                    style={{}}
                  />
                </div>
                <div style={{ textAlign: "center" }}>
                  <h4
                    style={{
                      margin: "0px",
                      fontWeight: "500",
                    }}
                  >
                    <span style={{ color: "#3e98c7" }}>Paypal</span>{" "}
                  </h4>{" "}
                  <p style={{ color: "gray", margin: "0px" }}>Account Title</p>
                  <br />
                  <div style={{ height: "9rem", overflowY: "scroll" }}>
                    <h6 style={{ margin: "0px", float: "left" }}>
                      Opening Balance
                    </h6>
                    <p style={{ margin: "0px", float: "right" }}>$ 0.00</p>
                    <br />
                    <h6 style={{ margin: "0px", float: "left" }}>Fee</h6>
                    <p style={{ margin: "0px", float: "right" }}>$ 0.00</p>
                    <br />
                    <h6 style={{ margin: "0px", float: "left" }}>Withdrawal</h6>
                    <p style={{ margin: "0px", float: "right" }}>$ 0.00</p>
                    <br />
                    <h6 style={{ margin: "0px", float: "left" }}>
                      Closing Balance
                    </h6>
                    <p style={{ margin: "0px", float: "right" }}>$ 0.00</p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-lg-2"
              style={{
                boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
                height: "17rem",
                borderRadius: "5px",
                margin: "1rem",
              }}
            >
              <div style={{ margin: "1rem" }}>
                <div style={{ textAlign: "center" }}>
                  <Image
                    alt={`Stripe`}
                    src={Stripe}
                    height={50}
                    width={100}
                    style={{}}
                  />
                </div>
                <div style={{ textAlign: "center" }}>
                  <h4
                    style={{
                      margin: "0px",
                      fontWeight: "500",
                    }}
                  >
                    <span style={{ color: "#3e98c7" }}>Stripe</span>
                  </h4>{" "}
                  <p style={{ color: "gray", margin: "0px" }}>Account Title</p>
                  <br />
                  <div style={{ height: "9rem", overflowY: "scroll" }}>
                    <h6 style={{ margin: "0px", float: "left" }}>
                      Opening Balance
                    </h6>
                    <p style={{ margin: "0px", float: "right" }}>$ 0.00</p>
                    <br />
                    <h6 style={{ margin: "0px", float: "left" }}>Fee</h6>
                    <p style={{ margin: "0px", float: "right" }}>$ 0.00</p>
                    <br />
                    <h6 style={{ margin: "0px", float: "left" }}>Withdrawal</h6>
                    <p style={{ margin: "0px", float: "right" }}>$ 0.00</p>
                    <br />
                    <h6 style={{ margin: "0px", float: "left" }}>
                      Closing Balance
                    </h6>
                    <p style={{ margin: "0px", float: "right" }}>$ 0.00</p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-lg-2"
              style={{
                boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
                height: "17rem",
                borderRadius: "5px",
                margin: "1rem",
              }}
            >
              <div style={{ margin: "1rem" }}>
                <div style={{ textAlign: "center" }}>
                  <Image
                    alt={`WorldPay`}
                    src={WorldPay}
                    height={50}
                    width={100}
                    style={{}}
                  />
                </div>
                <div style={{ textAlign: "center" }}>
                  <h4
                    style={{
                      margin: "0px",
                      fontWeight: "500",
                    }}
                  >
                    <span style={{ color: "#3e98c7" }}>WorldPay</span>{" "}
                  </h4>{" "}
                  <p style={{ color: "gray", margin: "0px" }}>Account Title</p>
                  <br />
                  <div style={{ height: "9rem", overflowY: "scroll" }}>
                    <h6 style={{ margin: "0px", float: "left" }}>
                      Opening Balance
                    </h6>
                    <p style={{ margin: "0px", float: "right" }}>$ 0.00</p>
                    <br />
                    <h6 style={{ margin: "0px", float: "left" }}>Fee</h6>
                    <p style={{ margin: "0px", float: "right" }}>$ 0.00</p>
                    <br />
                    <h6 style={{ margin: "0px", float: "left" }}>Withdrawal</h6>
                    <p style={{ margin: "0px", float: "right" }}>$ 0.00</p>
                    <br />
                    <h6 style={{ margin: "0px", float: "left" }}>
                      Closing Balance
                    </h6>
                    <p style={{ margin: "0px", float: "right" }}>$ 0.00</p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-lg-2"
              style={{
                boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
                height: "17rem",
                borderRadius: "5px",
                margin: "1rem",
              }}
            >
              <div style={{ margin: "1rem" }}>
                <div style={{ textAlign: "center" }}>
                  <Image
                    alt={`Google Pay`}
                    src={Google}
                    height={50}
                    width={100}
                    style={{}}
                  />
                </div>
                <div style={{ textAlign: "center" }}>
                  <h4
                    style={{
                      margin: "0px",
                      fontWeight: "500",
                    }}
                  >
                    <span style={{ color: "#3e98c7" }}>Google Pay</span>
                  </h4>{" "}
                  <p style={{ color: "gray", margin: "0px" }}>Account Title</p>
                  <br />
                  <div style={{ height: "9rem", overflowY: "scroll" }}>
                    <h6 style={{ margin: "0px", float: "left" }}>
                      Opening Balance
                    </h6>
                    <p style={{ margin: "0px", float: "right" }}>$ 0.00</p>
                    <br />
                    <h6 style={{ margin: "0px", float: "left" }}>Fee</h6>
                    <p style={{ margin: "0px", float: "right" }}>$ 0.00</p>
                    <br />
                    <h6 style={{ margin: "0px", float: "left" }}>Withdrawal</h6>
                    <p style={{ margin: "0px", float: "right" }}>$ 0.00</p>
                    <br />
                    <h6 style={{ margin: "0px", float: "left" }}>
                      Closing Balance
                    </h6>
                    <p style={{ margin: "0px", float: "right" }}>$ 0.00</p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-lg-2"
              style={{
                boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
                height: "17rem",
                borderRadius: "5px",
                margin: "1rem",
              }}
            >
              <div style={{ margin: "1rem" }}>
                <div style={{ textAlign: "center" }}>
                  <Image
                    alt={`Payoneer`}
                    src={Payoneer}
                    height={50}
                    width={50}
                    style={{}}
                  />
                </div>
                <div style={{ textAlign: "center" }}>
                  <h4
                    style={{
                      margin: "0px",
                      fontWeight: "500",
                    }}
                  >
                    <span style={{ color: "#3e98c7" }}>Payoneer</span>
                  </h4>{" "}
                  <p style={{ color: "gray", margin: "0px" }}>Account Title</p>
                  <br />
                  <div style={{ height: "9rem", overflowY: "scroll" }}>
                    <h6 style={{ margin: "0px", float: "left" }}>
                      Opening Balance
                    </h6>
                    <p style={{ margin: "0px", float: "right" }}>$ 0.00</p>
                    <br />
                    <h6 style={{ margin: "0px", float: "left" }}>Fee</h6>
                    <p style={{ margin: "0px", float: "right" }}>$ 0.00</p>
                    <br />
                    <h6 style={{ margin: "0px", float: "left" }}>Withdrawal</h6>
                    <p style={{ margin: "0px", float: "right" }}>$ 0.00</p>
                    <br />
                    <h6 style={{ margin: "0px", float: "left" }}>
                      Closing Balance
                    </h6>
                    <p style={{ margin: "0px", float: "right" }}>$ 0.00</p>
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

export default React.memo(Marchant);
