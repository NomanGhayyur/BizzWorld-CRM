import { Avatar, Button, Card, Dropdown, IDropdownItem, Input } from "elements";
import type { NextPage } from "next";
import { useDispatch } from "react-redux";
import { AppThunkDispatch } from "../../../redux/types";
import { useState } from "react";
import { useQuery } from "react-query";
import styles from "./tabs.module.css";
import { IAdmin } from "../../../model/admindashboard";
import Image from "next/image";

type propType = {
  className?: string;
  style?: React.CSSProperties;
  data?: IAdmin;
};

const colorObject: any = {
  Full: "#FED7D7",
  Complete: "#CCEBC8",
  Cancel: "#82d7fa",
  Doing: "#D0F1DD",
  Done: "#FED7D7",
  Halt: "#c5fab9",
  "To Do": "#CCEBF8",
  "Sent To Client": "#f1f5b0",
};

const PaymentList: NextPage = ({ data }: propType) => {
  const path = data?.userpicturepath;
  //   const user = saleagent?.saleagent;

  return (
    <div
      className="container-fluid"
      style={{
        background: "white",
        borderRadius: "5px",
        boxShadow: "0px 2px 0px 0px rgba(0, 0, 0, 0.1)",
        marginTop: "1rem",
      }}
    >
      <div className="col-lg-12" style={{ display: "flex" }}>
        <div className="col-lg-10">
          <h4 style={{ margin: "1rem" }}>Task List</h4>
        </div>
        <div className="col-lg-2">
          <Button
            style={{
              background: "none",
              color: "rgb(148, 23, 46)",
              fontSize: "12px",
              fontWeight: "700",
              padding: "0px",
              float: "right",
              marginTop: "1rem",
            }}
          >
            <p style={{ margin: "0px", fontWeight: "700" }}>
              {"See Details >"}
            </p>
          </Button>
        </div>
      </div>
      <hr style={{ margin: "0px", marginBottom: "1rem", color: "#d1cece" }} />
      <div className="col-lg-12" style={{ display: "flex" }}>
        <div className="col-lg-4">
          <p style={{ color: "gray" }}>Creator</p>
        </div>
        <div className="col-lg-3">
          <p style={{ color: "gray" }}>Order Title</p>
        </div>
        <div className="col-lg-3">
          <p style={{ color: "gray" }}>Status</p>
        </div>
        <div className="col-lg-2">
          <p style={{ color: "gray" }}>Amount</p>
        </div>
      </div>
      <div
        style={{
          height: "15.5rem",
          overflowY: "scroll",
        }}
      >
        {
          //@ts-ignore
          data?.upcommingpayments &&
            //@ts-ignore
            data?.upcommingpayments.length > 0 &&
            //@ts-ignore
            data?.upcommingpayments.map((data: IAdmin) => (
              <div
                key={data?.user_id}
                className="col-lg-12"
                style={{
                  display: "flex",
                  marginTop: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                <div className="col-lg-4">
                  <div style={{ display: "flex" }}>
                    <Avatar
                      name={data?.user_name}
                      src={`${path}${data?.user_picture}`}
                      style={{
                        //   margin: 'auto',
                        //   marginTop: '3px',
                        fontSize: "10px",
                        // height: 'auto',
                        // width: '20px',
                      }}
                    />
                    <span style={{ margin: "auto", marginLeft: "1rem" }}>
                      {data?.user_name}
                    </span>
                  </div>
                </div>
                <div className="col-lg-3">
                  <p
                    style={{
                      // fontWeight: '500',
                      margin: "0px",
                      marginTop: "0.5rem",
                    }}
                  >
                    {
                      //@ts-ignore
                      data?.order_title
                    }
                  </p>
                </div>
                <div className="col-lg-3">
                  <p
                    style={{
                      // fontWeight: '500',
                      margin: "0px",
                      marginTop: "0.5rem",
                    }}
                  >
                    {
                      //@ts-ignore
                      data?.orderpayment_title
                    }
                  </p>
                </div>
                <div className="col-lg-2">
                  <p
                    style={{
                      // fontWeight: '500',
                      margin: "0px",
                      marginTop: "0.5rem",
                    }}
                  >
                    <span>$</span>
                    {
                      //@ts-ignore
                      data?.orderpayment_amount
                    }
                  </p>
                </div>
                <hr style={{ margin: "0px", color: "gray" }} />
              </div>
            ))
        }
      </div>
    </div>
  );
};

export default PaymentList;
