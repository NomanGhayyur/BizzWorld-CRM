import { Button, Card, Icon, Avatar } from "elements";
import React, { useState } from "react";
import Image from "next/image";
import Update from "../../../../../public/icons/update.svg";
import { IAdmin } from "../../../../model/admindashboard";

type ComponentProps = {
  style: React.CSSProperties;
  topagent: IAdmin;
};

const TopAgents = ({ style, topagent }: ComponentProps) => {
  const agentdata = topagent?.topagent;
  const profilepath = topagent?.userpicturepath;
  // console.log(topagent, 'agent');
  return (
    <div
      className="container-fluid"
      style={{
        borderRadius: "5px",
        boxShadow: "0px 2px 0px 0px rgba(0, 0, 0, 0.1)",
        background: "white",
      }}
    >
      <div>
        <div
          className="row"
          style={{
            borderBottom: "1px solid #ededed",
          }}
        >
          <div className="col-lg-8 d-flex" style={{}}>
            {/* <Icon
              name="person-fill"
              style={{
                fontSize: '25px',
                marginRight: '5px',
                marginTop: '10px',
                color: 'rgb(80, 105, 231, 0.8)',
              }}
            /> */}
            <h5
              style={{
                fontSize: "17px",
                fontWeight: "700",
                marginTop: "9px",
                marginBottom: "5px",
                marginLeft: "10px",
              }}
            >
              Agents Target Report
            </h5>
          </div>
          <div className="col-lg-4">
            <Button
              style={{
                background: "none",
                color: "rgb(148, 23, 46)",
                fontSize: "12px",
                fontWeight: "700",
                marginTop: "1rem",
                padding: "0px",
                float: "right",
              }}
            >
              <p style={{ margin: "0px", fontWeight: "700" }}>
                {" "}
                {"See Details >"}
              </p>
            </Button>
          </div>
        </div>
        <div className="row" style={{ marginTop: "5px", marginBottom: "5px" }}>
          <div className="col-lg-6">
            <span
              style={{
                fontSize: "14px",
                color: "gray",
              }}
            >
              Names
            </span>
          </div>
          <div className="col-lg-3">
            <span
              style={{
                fontSize: "14px",
                color: "gray",
              }}
            >
              Target
            </span>
          </div>
          <div className="col-lg-3">
            <span
              style={{
                fontSize: "14px",
                color: "gray",
              }}
            >
              Achieved
            </span>
          </div>
        </div>
        <div
          style={{
            paddingBottom: "1px",
            overflowY: "scroll",
            height: "18rem",
          }}
        >
          {agentdata &&
            agentdata?.length > 0 &&
            agentdata.map((data: IAdmin) => (
              <div
                className="row"
                style={{
                  marginTop: "10px",
                  marginBottom: "15px",
                  marginLeft: "0px",
                  marginRight: "0px",
                }}
                key={data?.user_id}
              >
                <div
                  className="col-lg-6 d-flex"
                  style={{
                    margin: "0px",
                    padding: "0px",
                  }}
                >
                  <Avatar
                    name={"NoorulAin Khan"}
                    src={`${profilepath}${data?.user_picture}`}
                    style={{
                      marginTop: "3px",
                      fontSize: "10px",
                      height: "30px",
                      width: "30px",
                    }}
                  />

                  <p
                    style={{
                      color: "black",
                      fontSize: "13px",
                      fontWeight: "500",
                      marginTop: "5px",
                      marginBottom: "0px",
                      marginLeft: "10px",
                    }}
                  >
                    {data?.user_name}
                  </p>
                </div>

                <div className="col-lg-3">
                  <p
                    style={{
                      color: "black",
                      fontSize: "12px",
                      fontWeight: "500",
                      marginTop: "5px",
                      marginBottom: "0px",
                    }}
                  >
                    ${data?.user_target}
                  </p>
                </div>
                <div className="col-lg-3">
                  <p
                    style={{
                      color: "green",
                      fontSize: "12px",
                      fontWeight: "500",
                      marginTop: "5px",
                      marginBottom: "0px",
                      // textAlign: 'center',
                    }}
                  >
                    ${data?.user_achieved}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
export default React.memo(TopAgents);
