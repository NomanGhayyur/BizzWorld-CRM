/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-head-element */
/* eslint-disable react/jsx-no-comment-textnodes */
//@ts-nocheck
import React from "react";
import { Card } from "elements";
import Image from "next/image";
import ArcLogo from "../../../../public/images/InvoiceLogo.svg";
import { IOrder, IOrderListItem } from "../../../model/order";
import { ILeadListItem } from "../../../model/lead";
// import moment from 'moment-timezone';
// import { TIME_ZONE } from 'constants/Enums';

type propTypes = {
  orders?: IOrder;
  leademail?: string;
  leadname?: string;
  date: string | number;
};

const Invoice = React.memo<propTypes>(
  ({ orders, leademail, leadname, date }) => {
    console.log(leademail, "lead");
    console.log(leadname, "leadname");
    console.log(orders, "orders");
    //@ts-ignore
    const table = orders?.data;
    //@ts-ignore

    const info = orders?.inviceinfo;
    return (
      <html>
        // eslint-disable-next-line @next/next/no-head-element
        <head>
          <meta charSet="UTF-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css"
          />
          {/* <link
        rel="stylesheet"
        href={`${orders.location?.origin}/css/invoice.css`}
      /> */}
          <title>Invoice</title>
        </head>
        <body>
          <div
            className="container"
            style={{
              marginBottom: "1.5rem",

              marginTop: "1.5rem",
            }}
          >
            <>
              <div
                className="flex-container"
                style={{ marginBottom: "2.5rem" }}
              >
                {/* <img
              src={`${orders.location?.origin}${campaign_banner}${orders.campaign?.campaign_banner || orders.user?.campaign_banner}`}
              alt="Max Digitizing"
              style={{ width: "18rem", marginLeft: "-1rem" }}
            /> */}
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`${info?.brand_logopath}${info?.brand_logo}`}
                  alt="Arc Inventador"
                  style={{ width: "12rem", marginTop: "0rem" }}
                />
                <div style={{ textAlign: "right", marginTop: "0rem" }}>
                  <h5 style={{ margin: "0px" }}>INVOICE</h5>
                  <p style={{ margin: "0px" }}>Arc Invendatod Ltd</p>
                  <p style={{ margin: "0px" }}>{info?.brand_invoicename}</p>
                  <p style={{ margin: "0px" }}>{info?.brand_email}</p>
                </div>
              </div>
              <div className="flex-container">
                <div>
                  <div>
                    <p style={{ display: "inline" }} className="head">
                      <span style={{ fontWeight: "500" }}>Invoice no: </span>
                      {info?.order_token}
                    </p>
                  </div>
                  <div>
                    <p style={{ display: "inline" }} className="head">
                      <span style={{ fontWeight: "500" }}>Invoice Date: </span>
                      {date}
                    </p>
                    {/* <span>{moment().tz(TIME_ZONE).format('DD MMM YYYY')}</span> */}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <h4>{`${parseFloat(info?.totalAmount || 0).toFixed(
                    2
                  )} $`}</h4>
                  <h5>Amount Due</h5>
                </div>
              </div>
              <div className="flex-container" style={{ marginBottom: "2rem" }}>
                <div>
                  <p
                    className="head"
                    style={{ fontWeight: "500", margin: "0px" }}
                  >
                    BILL TO:
                  </p>
                  <p style={{ margin: "0px" }}>{info?.lead_name}</p>
                  <p style={{ margin: "0px" }}>{info?.lead_email}</p>
                  <p style={{ margin: "0px" }}>{info?.lead_phone}</p>
                </div>
                <div></div>
              </div>

              <table className="table table-hover">
                <thead>
                  <th scope="col">No</th>
                  <th scope="col">Date</th>
                  <th scope="col">Items and Description</th>
                  <th scope="col" style={{ textAlign: "right" }}>
                    QTY/HRS
                  </th>
                  <th scope="col" style={{ textAlign: "right" }}>
                    Price
                  </th>
                  <th scope="col" style={{ textAlign: "right" }}>
                    Amount($)
                  </th>
                </thead>
                <tbody>
                  {table &&
                    table?.length > 0 &&
                    table.map((data: IOrderListItem, index: number) => (
                      // <p key={data.orderpayment_id}>{data?.order_title}</p>
                      <tr key={data.orderpayment_id}>
                        <td> {index + 1} </td>
                        <td>{"20 OCT 2022"}</td>
                        <td>{data.order_title}</td>
                        <td style={{ textAlign: "right" }}>
                          {"data.order_title"}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {/* ${data.orderpayment_amount} */}
                          {`$${parseFloat(
                            //@ts-ignore

                            data?.orderpayment_amount || 0
                          ).toFixed(2)}`}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {`$${parseFloat(
                            //@ts-ignore

                            data?.orderpayment_amount || 0
                          ).toFixed(2)}`}
                        </td>
                      </tr>
                    ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th
                      //@ts-ignore

                      colSpan="4"
                    >
                      Total
                    </th>
                    <th
                      //@ts-ignore

                      colSpan="2"
                    >{`$${parseFloat(info?.total_amount || 0).toFixed(2)}`}</th>
                  </tr>
                </tfoot>
              </table>
              <div>
                <h4>Notes to Customer</h4>
                <p>
                  We are trying our best to get your logo requst done in a
                  professional and timely manner. This email is to inform you
                  that we are open and trying to help our community in every
                  possible way, and we hope that you are thinking in a same way,
                  kindly pay your bills ASAP. We will be very thankful to you!.
                </p>
              </div>
            </>
          </div>
        </body>
      </html>
    );
  }
);

export default Invoice;
