import { Button, Card, Icon, Avatar } from "elements";
import React, { useState } from "react";
import Image from "next/image";
import Update from "../../../../../public/icons/update.svg";
import { IAdmin } from "../../../../model/admindashboard";

type ComponentProps = {
  style: React.CSSProperties;
  topbrand: IAdmin;
};

const TopBrands = ({ style, topbrand }: ComponentProps) => {
  const branddata = topbrand?.topbrand;
  const profilepath = topbrand?.userpicturepath;
  return (
    <div
      className="container-fluid"
      style={{
        marginTop: "5px",
        borderRadius: "5px",
        boxShadow: "0px 2px 0px 0px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        className="row"
        style={{
          borderBottom: "1px solid #ededed",
        }}
      >
        <div className="col-lg-8 d-flex" style={{ paddingLeft: "0px" }}>
          <Icon
            name="graph-up-arrow"
            style={{
              color: "blue",
              fontSize: "25px",
              marginRight: "5px",
              marginTop: "10px",
            }}
          />
          <h5
            style={{
              fontSize: "17px",
              fontWeight: "700",
              marginTop: "9px",
              marginBottom: "5px",
              marginLeft: "10px",
            }}
          >
            Top Brands
          </h5>
        </div>
        <div className="col-lg-4">
          <Button
            style={{
              background: "none",
              color: "rgb(148, 23, 46)",
              fontSize: "12px",
              fontWeight: "700",
              marginTop: "5px",
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
        <div className="col-lg-5">
          <span
            style={{
              fontSize: "14px",
              color: "gray",
            }}
          >
            Names
          </span>
        </div>
        <div className="col-lg-6">
          <span
            style={{
              fontSize: "14px",
              color: "gray",
            }}
          >
            Leads
          </span>
        </div>
      </div>
      <div style={{ paddingBottom: "1px" }}>
        {branddata &&
          branddata?.length > 0 &&
          branddata.map((data: IAdmin) => (
            <div
              className="row"
              style={{ marginTop: "10px", marginBottom: "15px" }}
              key={data?.brand_id}
            >
              <div
                className="col-lg-5 d-flex"
                style={{ margin: "0px", padding: "0px" }}
              >
                <Avatar
                  name={"Prime Web"}
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
                    fontWeight: "700",
                    marginTop: "5px",
                    marginBottom: "0px",
                    marginLeft: "10px",
                  }}
                >
                  {data?.brand_name}
                </p>
              </div>
              <div className="col-lg-6 d-flex">
                <div className="col-lg-3">
                  <p
                    style={{
                      color: "black",
                      fontSize: "12px",
                      fontWeight: "700",
                      marginTop: "5px",
                      marginBottom: "0px",
                    }}
                  >
                    {data?.brand_totalamount}
                  </p>
                </div>
                <div className="col-lg-3">
                  <p
                    style={{
                      color: "green",
                      fontSize: "12px",
                      fontWeight: "700",
                      marginTop: "5px",
                      marginBottom: "0px",
                    }}
                  >
                    {data?.brand_paidamount}
                  </p>
                </div>
                <div className="col-lg-6">
                  <div
                    className="progress"
                    style={{
                      height: "20px",
                      borderRadius: "4px",
                      marginTop: "5px",
                      marginLeft: "5px",
                    }}
                  >
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: "50%" }}
                      aria-valuenow={50}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        {/* <div
          className="row"
          style={{ marginTop: '10px', marginBottom: '15px' }}
        >
          <div
            className="col-lg-5 d-flex"
            style={{ margin: '0px', padding: '0px' }}
          >
            <Avatar
              name={'Creative Web'}
              style={{
                marginTop: '3px',
                fontSize: '10px',
                height: '30px',
                width: '30px',
              }}
            />

            <p
              style={{
                color: 'black',
                fontSize: '13px',
                fontWeight: '700',
                marginTop: '5px',
                marginBottom: '0px',
                marginLeft: '10px',
              }}
            >
              Creative Web
            </p>
          </div>
          <div className="col-lg-6 d-flex">
            <div className="col-lg-3">
              <p
                style={{
                  color: 'black',
                  fontSize: '12px',
                  fontWeight: '700',
                  marginTop: '5px',
                  marginBottom: '0px',
                }}
              >
                215
              </p>
            </div>
            <div className="col-lg-3">
              <p
                style={{
                  color: 'green',
                  fontSize: '12px',
                  fontWeight: '700',
                  marginTop: '5px',
                  marginBottom: '0px',
                }}
              >
                +115%
              </p>
            </div>
            <div className="col-lg-6">
              <div
                className="progress"
                style={{
                  height: '20px',
                  borderRadius: '4px',
                  marginTop: '5px',
                  marginLeft: '5px',
                }}
              >
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: '30%' }}
                  aria-valuenow={50}
                  aria-valuemin={0}
                  aria-valuemax={100}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="row"
          style={{ marginTop: '10px', marginBottom: '15px' }}
        >
          <div
            className="col-lg-5 d-flex"
            style={{ margin: '0px', padding: '0px' }}
          >
            <Avatar
              name={'Rankup First'}
              style={{
                marginTop: '3px',
                fontSize: '10px',
                height: '30px',
                width: '30px',
              }}
            />

            <p
              style={{
                color: 'black',
                fontSize: '13px',
                fontWeight: '700',
                marginTop: '5px',
                marginBottom: '0px',
                marginLeft: '10px',
              }}
            >
              Rankup First
            </p>
          </div>
          <div className="col-lg-6 d-flex">
            <div className="col-lg-3">
              <p
                style={{
                  color: 'black',
                  fontSize: '12px',
                  fontWeight: '700',
                  marginTop: '5px',
                  marginBottom: '0px',
                }}
              >
                215
              </p>
            </div>
            <div className="col-lg-3">
              <p
                style={{
                  color: 'green',
                  fontSize: '12px',
                  fontWeight: '700',
                  marginTop: '5px',
                  marginBottom: '0px',
                }}
              >
                +275%
              </p>
            </div>
            <div className="col-lg-6">
              <div
                className="progress"
                style={{
                  height: '20px',
                  borderRadius: '4px',
                  marginTop: '5px',
                  marginLeft: '5px',
                }}
              >
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: '75%' }}
                  aria-valuenow={50}
                  aria-valuemin={0}
                  aria-valuemax={100}
                ></div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};
export default React.memo(TopBrands);
