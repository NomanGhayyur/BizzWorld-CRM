import { Card, Icon, Input } from "elements";
import React, { useCallback, useState } from "react";
import { IAdmin } from "../../../model/admindashboard";
import Meter from "../Dashboard/Meter/meter";
import Image from "next/image";
import Assigned from "../../../../public/images/assignedPPC.png";
import Spent from "../../../../public/images/spentPPC.png";
import Remaining from "../../../../public/images/remainingPPC.png";

const PieChart = React.lazy(() => import("../Dashboard/PieChart/PieChart"));

type propType = {
  className?: string;
  style?: React.CSSProperties;
  marketing?: IAdmin;
};

const PPCCard = ({ marketing }: propType) => {
  function currencyFormat(num: number) {
    return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  return (
    <Card
      className=""
      style={{ border: "none", borderRadius: "5px", marginTop: "1rem" }}
    >
      <div className="row">
        <div className="col-lg-12">
          <h3 style={{ margin: "1rem", fontWeight: "700" }}>Marketing</h3>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="d-flex">
            <div className="col-lg-3">
              <div
                style={{
                  background: "white",
                  boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
                  margin: "1rem",
                  borderRadius: "5px",
                  height: "17rem",
                }}
              >
                <PieChart chartdata={marketing} />
              </div>
            </div>
            <div className="col-lg" style={{}}>
              <div
                style={{
                  background: "white",
                  boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
                  margin: "1rem",
                  marginTop: "2rem",
                  height: "14rem",
                  borderRadius: "5px",
                }}
              >
                <div style={{ margin: "1rem" }}>
                  <div className="row">
                    <div className="col-lg-12">
                      <div>
                        <h3 style={{ color: "gray", marginTop: "1rem" }}>
                          Assigned PPC
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      <div style={{ float: "right" }}>
                        <h3
                          style={{
                            margin: "0.5rem",
                            fontWeight: "700",
                            float: "right",
                          }}
                        >
                          <span style={{ color: "rgb(80, 105, 231, 0.8)" }}>
                            $
                          </span>{" "}
                          {
                            //@ts-ignore
                            currencyFormat(parseInt(marketing?.ppcassigned))
                          }
                          {/* {marketing?.totalincomeindollar} */}
                        </h3>{" "}
                        <br />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6">
                      <Image
                        alt={"PPC Remaining"}
                        src={Assigned}
                        height={70}
                        width={70}
                        style={{ opacity: "0.5" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg" style={{}}>
              <div
                style={{
                  background: "white",
                  boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
                  margin: "1rem",
                  height: "14rem",
                  marginTop: "2rem",
                  borderRadius: "5px",
                }}
              >
                <div style={{ margin: "1rem" }}>
                  <div className="row">
                    <div className="col-lg-12">
                      <div>
                        <h3 style={{ color: "gray", marginTop: "1rem" }}>
                          PPC Spent
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      <div style={{ float: "right" }}>
                        <h3
                          style={{
                            margin: "0.5rem",
                            fontWeight: "700",
                            float: "right",
                          }}
                        >
                          <span style={{ color: "green" }}>$</span>{" "}
                          {
                            //@ts-ignore
                            currencyFormat(parseInt(marketing?.ppcspend))
                          }
                          {/* {marketing?.totalincomeindollar} */}
                        </h3>{" "}
                        <br />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6">
                      <Image
                        alt={"PPC Remaining"}
                        src={Spent}
                        height={70}
                        width={70}
                        style={{ opacity: "0.5" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg" style={{}}>
              <div
                style={{
                  background: "white",
                  boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
                  margin: "1rem",
                  marginTop: "2rem",
                  height: "14rem",
                  borderRadius: "5px",
                }}
              >
                <div style={{ margin: "1rem" }}>
                  <div className="row">
                    <div className="col-lg-12">
                      <div>
                        <h3 style={{ color: "gray", marginTop: "1rem" }}>
                          PPC Remaining
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      <div style={{ float: "right" }}>
                        <h3
                          style={{
                            margin: "0.5rem",
                            fontWeight: "700",
                            float: "right",
                          }}
                        >
                          <span style={{ color: "orange" }}>$</span>{" "}
                          {
                            //@ts-ignore
                            currencyFormat(parseInt(marketing?.remainingppc))
                          }
                          {/* {marketing?.totalincomeindollar} */}
                        </h3>{" "}
                        <br />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6">
                      <Image
                        alt={"PPC Remaining"}
                        src={Remaining}
                        height={70}
                        width={70}
                        style={{ opacity: "0.5" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default React.memo(PPCCard);
