import { Avatar, Button, Card, Icon } from "elements";
import React, { useState } from "react";
import styles from "./payment.module.css";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { IAdmin } from "../../../../model/admindashboard";

type ComponentProps = {
  style: React.CSSProperties;
  graphdata: IAdmin;
  path?: string;
};

const Payments = ({ style, graphdata, path }: ComponentProps) => {
  console.log(path, "path");
  // console.log(graphdata, 'graphdata');
  // const data = [
  //   {
  //     mainID: 1,
  //     id: 0,
  //     date: '01',
  //     text: '$ 1,000.00',
  //     type: 'Prime Web Solution',
  //     sabdata: [
  //       {
  //         sabID: 0,
  //         secondtext: '$ 500.00',
  //         secondtexttype: 'Creative Web Junction',
  //       },
  //     ],
  //     sabdata2: [
  //       {
  //         sabID: 0,
  //         secondtext: '$ 450.00',
  //         secondtexttype: 'Renkup First',
  //       },
  //     ],
  //   },
  //   {
  //     mainID: 2,
  //     id: 1,
  //     type: 'Creative Web',
  //     date: '02',
  //     text: '$ 0.00',
  //     secondtext: '$ 0.00',
  //   },
  //   {
  //     mainID: 3,
  //     id: 2,
  //     type: 'Ebook Content',
  //     date: '03',
  //     text: '$ 0.00',
  //   },
  //   {
  //     mainID: 4,
  //     id: 3,
  //     type: 'Review with Compliance',
  //     date: '04',
  //     text: '$ 0.00',
  //     sabdata: [
  //       {
  //         sabID: 0,
  //         secondtext: '$ 0.00',
  //         seconsabdtext: '$ 0.00',
  //       },
  //       {
  //         sabID: 1,
  //         secondtext: '$ 0.00',
  //         seconsabdtext: '$ 0.00',
  //       },
  //     ],
  //   },
  //   {
  //     mainID: 5,
  //     id: 4,
  //     date: '05',
  //     secondtext: '$ 0.00',
  //     text: '$ 0.00',
  //   },
  //   {
  //     mainID: 6,
  //     id: 5,
  //     date: '06',
  //     text: '$ 0.00',
  //     sabdata: [
  //       {
  //         sabID: 0,
  //         secondtext: '$ 0.00',
  //         seconsabdtext: '$ 0.00',
  //       },
  //     ],
  //   },
  //   {
  //     mainID: 7,
  //     id: 6,
  //     date: '07',
  //     secondtext: '$ 0.00',
  //     text: '$ 0.00',
  //   },
  //   {
  //     mainID: 8,
  //     id: 7,
  //     date: '08',
  //     secondtext: '$ 0.00',
  //     text: '$ 0.00',
  //   },
  //   {
  //     mainID: 9,
  //     id: 8,
  //     date: '09',
  //     secondtext: '$ 0.00',
  //     text: '$ 0.00',
  //     sabdata: [
  //       {
  //         sabID: 0,
  //         secondtext: '$ 0.00',
  //         seconsabdtext: '$ 0.00',
  //       },
  //     ],
  //   },
  //   {
  //     mainID: 10,
  //     id: 9,
  //     date: '10',
  //     secondtext: '$ 0.00',
  //     text: '$ 0.00',
  //     sabdata: [
  //       {
  //         sabID: 0,
  //         secondtext: '$ 0.00',
  //         seconsabdtext: '$ 0.00',
  //       },
  //     ],
  //   },
  //   {
  //     mainID: 11,
  //     id: 10,
  //     date: '11',
  //     text: '$ 0.00',
  //     sabdata: [
  //       {
  //         sabID: 0,
  //         secondtext: '$ 0.00',
  //         seconsabdtext: '$ 0.00',
  //       },
  //     ],
  //   },
  //   {
  //     mainID: 12,
  //     id: 11,
  //     date: '12',
  //     text: '$ 0.00',
  //     secondtext: '$ 0.00',
  //   },
  //   {
  //     mainID: 13,
  //     id: 12,
  //     date: '13',
  //     text: '$ 0.00',
  //   },
  //   {
  //     mainID: 14,
  //     id: 13,
  //     date: '14',
  //     text: '$ 0.00',
  //     sabdata: [
  //       {
  //         sabID: 0,
  //         secondtext: '$ 0.00',
  //         seconsabdtext: '$ 0.00',
  //       },
  //       {
  //         sabID: 1,
  //         secondtext: '$ 0.00',
  //         seconsabdtext: '$ 0.00',
  //       },
  //     ],
  //   },
  //   {
  //     mainID: 15,
  //     id: 14,
  //     date: '15',
  //     secondtext: '$ 0.00',
  //     text: '$ 0.00',
  //   },
  //   {
  //     mainID: 16,
  //     id: 15,
  //     date: '16',
  //     text: '$ 0.00',
  //     sabdata: [
  //       {
  //         sabID: 0,
  //         secondtext: '$ 0.00',
  //         seconsabdtext: '$ 0.00',
  //       },
  //     ],
  //   },
  //   {
  //     mainID: 17,
  //     id: 16,
  //     date: '17',
  //     secondtext: '$ 0.00',
  //     text: '$ 0.00',
  //   },
  //   {
  //     mainID: 18,
  //     id: 17,
  //     date: '18',
  //     secondtext: '$ 0.00',
  //     text: '$ 0.00',
  //   },
  //   {
  //     mainID: 19,
  //     id: 18,
  //     date: '19',
  //     secondtext: '$ 0.00',
  //     text: '$ 0.00',
  //     sabdata: [
  //       {
  //         sabID: 0,
  //         secondtext: '$ 0.00',
  //         seconsabdtext: '$ 0.00',
  //       },
  //     ],
  //   },
  //   {
  //     mainID: 20,
  //     id: 19,
  //     date: '20',
  //     text: '$ 0.00',
  //     sabdata: [
  //       {
  //         sabID: 0,
  //         secondtext: '$ 0.00',
  //         seconsabdtext: '$ 0.00',
  //       },
  //     ],
  //   },
  //   {
  //     mainID: 21,
  //     id: 20,
  //     date: '21',
  //     text: '$ 0.00',
  //     secondtext: '$ 0.00',
  //   },
  //   {
  //     mainID: 22,
  //     id: 21,
  //     date: '22',
  //     text: '$ 0.00',
  //   },
  //   {
  //     mainID: 23,
  //     id: 22,
  //     date: '23',
  //     text: '$ 0.00',
  //     sabdata: [
  //       {
  //         sabID: 0,
  //         secondtext: '$ 0.00',
  //         seconsabdtext: '$ 0.00',
  //       },
  //       {
  //         sabID: 1,
  //         secondtext: '$ 0.00',
  //         seconsabdtext: '$ 0.00',
  //       },
  //     ],
  //   },
  //   {
  //     mainID: 24,
  //     id: 23,
  //     date: '24',
  //     secondtext: '$ 0.00',
  //     text: '$ 0.00',
  //   },
  //   {
  //     mainID: 25,
  //     id: 24,
  //     date: '25',
  //     text: '$ 0.00',
  //     sabdata: [
  //       {
  //         sabID: 0,
  //         secondtext: '$ 0.00',
  //         seconsabdtext: '$ 0.00',
  //       },
  //     ],
  //   },
  //   {
  //     mainID: 26,
  //     id: 25,
  //     date: '26',
  //     secondtext: '$ 0.00',
  //     text: '$ 0.00',
  //   },
  //   {
  //     mainID: 27,
  //     id: 26,
  //     date: '27',
  //     secondtext: '$ 0.00',
  //     text: '$ 0.00',
  //   },
  //   {
  //     mainID: 28,
  //     id: 27,
  //     date: '28',
  //     secondtext: '$ 0.00',
  //     text: '$ 0.00',
  //     sabdata: [
  //       {
  //         sabID: 0,
  //         secondtext: '$ 0.00',
  //         seconsabdtext: '$ 0.00',
  //       },
  //     ],
  //   },
  //   {
  //     mainID: 29,
  //     id: 28,
  //     date: '29',
  //     secondtext: '$ 0.00',
  //     text: '$ 0.00',
  //     sabdata: [
  //       {
  //         sabID: 0,
  //         secondtext: '$ 0.00',
  //         seconsabdtext: '$ 0.00',
  //       },
  //     ],
  //   },
  //   {
  //     mainID: 30,
  //     id: 29,
  //     date: '30',
  //     secondtext: '$ 0.00',
  //     text: '$ 0.00',
  //     sabdata: [
  //       {
  //         sabID: 0,
  //         secondtext: '$ 0.00',
  //         seconsabdtext: '$ 0.00',
  //       },
  //     ],
  //   },
  // ];
  function currencyFormat(num: number) {
    return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }
  //@ts-ignore
  const [key, setKey] = useState(`${graphdata?.date}` && 1);

  return (
    <Card
      className=""
      style={{
        border: "none",
        background: "white",
        borderRadius: "5px",
      }}
    >
      <div className="container-fluid" style={{}}>
        <div
          className="row"
          style={{
            borderBottom: "1px solid #ededed",
          }}
        >
          <div className="col-lg-10" style={{}}>
            <h3
              style={{
                fontWeight: "700",
                marginTop: "1rem",
              }}
            >
              Upcoming Payments
            </h3>
          </div>
          <div className="col-lg-2">
            <Button
              style={{
                background: "none",
                color: "rgb(148, 23, 46)",
                fontSize: "12px",
                fontWeight: "700",
                marginTop: "1rem",
                float: "right",
              }}
            >
              <p style={{ margin: "0px", fontWeight: "700" }}>
                {"See Details >"}
              </p>
            </Button>
          </div>
        </div>
        <div
          className="row"
          style={{ marginTop: "1rem", marginBottom: "1rem" }}
        >
          <div className="col-lg-12" style={{}}>
            <Card
              style={{
                borderRadius: "5px",
                border: "none",
                boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
                marginBottom: "5px",
                width: "70rem",
                margin: "auto",
              }}
            >
              <div className="container-fluid">
                <Tabs
                  defaultActiveKey={"" || 1}
                  id="controlled-tab-example"
                  activeKey={key}
                  //@ts-ignore
                  onSelect={(e) => setKey(e)}
                  className={styles.tab}
                >
                  {graphdata &&
                    graphdata?.length > 0 &&
                    //@ts-ignore
                    graphdata.map((data: any) => (
                      <Tab
                        eventKey={data?.date}
                        key={data.date}
                        title={data.date}
                        //   style={{ borderRadius: '10px' }}
                      >
                        <div className="row" style={{ margin: "10px" }}>
                          {/* <div className="col-lg-4">
                            <div className="col-lg-12">
                              <h5 style={{ marginTop: '0px' }}>Projects</h5>

                           
                              <div>
                                <p>
                                  <Icon
                                    name="calendar-event"
                                    style={{
                                      color: 'blue',
                                      fontSize: '15px',
                                      marginRight: '5px',
                                      //   marginTop: '10px',
                                    }}
                                  />
                             
                                  CRM Development
                                </p>
                              </div>
                              <div>
                                <p>
                                  <Icon
                                    name="calendar-event"
                                    style={{
                                      color: 'blue',
                                      fontSize: '15px',
                                      marginRight: '5px',
                                      //   marginTop: '10px',
                                    }}
                                  />
                               
                                  Website Development
                                </p>
                              </div>
                              <div>
                                <p>
                                  <Icon
                                    name="calendar-event"
                                    style={{
                                      color: 'blue',
                                      fontSize: '15px',
                                      marginRight: '5px',
                                      //   marginTop: '10px',
                                    }}
                                  />
                           
                                  test test
                                </p>
                              </div>
                              <div>
                                <p>
                                  <Icon
                                    name="calendar-event"
                                    style={{
                                      color: 'blue',
                                      fontSize: '15px',
                                      marginRight: '5px',
                                      //   marginTop: '10px',
                                    }}
                                  />
                         
                                  testinng
                                </p>
                              </div>
                    
                            </div>
                          </div> */}
                          <div
                            className="col-lg-12"
                            style={{
                              height: "20rem",
                              overflowY: "scroll",
                            }}
                          >
                            {/* <div className="">
                              <Card
                                style={{
                                  height: '50px',
                                  maxWidth: '60vh',
                                  borderRadius: '5px',
                                  border: '2px solid rgba(80, 105, 231, 0.5)',
                                  background: 'rgba(80, 105, 231, 0.1)',
                                }}
                              >
                                <div className="d-flex">
                                  <div className="col-lg"></div>

                                  <div
                                    className="col-lg-8"
                                    style={{
                                      wordBreak: 'break-all',
                                      margin: 'auto',
                                    }}
                                  >
                                    <p
                                      style={{
                                        display: 'block',
                                        marginBottom: '0px',
                                        marginTop: '3px',
                                      }}
                                    >
                                      {data.text}
                                    </p>
                                    <p
                                      style={{
                                        fontSize: '12px',
                                        color: 'gray',
                                      }}
                                    >
                                      {data.type}
                                    </p>
                                  </div>
                                  <div className="col-lg-2">
                                    <Avatar
                                      name={'data.date'}
                                      style={{
                                        margin: 'auto',
                                        marginTop: '3px',
                                        fontSize: '10px',
                                        // height: 'auto',
                                        // width: '20px',
                                      }}
                                    />
                                  </div>
                                  <div className="col-lg"></div>
                                </div>
                              </Card>
                            </div> */}
                            {data.payments &&
                              data?.payments?.length > 0 &&
                              data.payments.map((data: any) => (
                                <div
                                  className="col-lg"
                                  style={{ marginLeft: "10rem" }}
                                  key={data.date}
                                >
                                  <Card
                                    style={{
                                      height: "5rem",
                                      maxWidth: "70%",
                                      borderRadius: "5px",
                                      border:
                                        "2px solid rgba(80, 105, 231, 0.5)",
                                      background: "rgba(80, 105, 231, 0.1)",
                                      marginTop: "0.5rem",
                                      // marginLeft: 'auto',
                                    }}
                                  >
                                    <div className="d-flex">
                                      <div className="col-lg"></div>

                                      <div
                                        className="col-lg-8"
                                        style={{
                                          wordBreak: "break-all",
                                          margin: "auto",
                                        }}
                                      >
                                        <h5
                                          style={{
                                            display: "block",
                                            marginBottom: "0px",
                                            marginTop: "3px",
                                          }}
                                        >
                                          {data.order_title}
                                        </h5>
                                        <p
                                          style={{
                                            fontSize: "14px",
                                            color: "gray",
                                            margin: "0px",
                                          }}
                                        >
                                          $
                                          {currencyFormat(
                                            parseInt(data?.orderpayment_amount)
                                          )}
                                        </p>
                                        <p
                                          style={{
                                            fontSize: "12px",
                                            color: "gray",
                                            // margin: 'auto',
                                            marginTop: "0.2rem",
                                          }}
                                        >
                                          {data.orderpayment_title}
                                        </p>
                                      </div>
                                      <div
                                        className="col-lg-2"
                                        style={{ textAlign: "center" }}
                                      >
                                        <Avatar
                                          name={"asdas"}
                                          src={`${path}${data?.user_picture}`}
                                          style={{
                                            margin: "auto",
                                            marginTop: "0.2rem",
                                            fontSize: "15px",
                                            height: "3rem",
                                            width: "3rem",
                                          }}
                                        />

                                        <p
                                          style={{
                                            fontSize: "12px",
                                            color: "gray",
                                          }}
                                        >
                                          {data.user_name}
                                        </p>
                                      </div>
                                      <div className="col-lg"></div>
                                    </div>
                                  </Card>
                                </div>
                              ))}
                            {/* {data.sabdata2 &&
                              data?.sabdata?.length > 0 &&
                              data.sabdata2.map((data) => (
                                <Card
                                  style={{
                                    height: '50px',
                                    maxWidth: '57vh',
                                    borderRadius: '5px',
                                    border: '2px solid rgba(80, 105, 231, 0.5)',
                                    background: 'rgba(32, 111, 56, 0.1)',
                                    marginLeft: '100px',
                                    marginTop: '5px',
                                  }}
                                  key={data.sabID}
                                >
                                  <div className="d-flex">
                                    <div className="col-lg"></div>

                                    <div
                                      className="col-lg-8"
                                      style={{
                                        wordBreak: 'break-all',
                                        margin: 'auto',
                                      }}
                                    >
                                      <p
                                        style={{
                                          display: 'block',
                                          marginBottom: '0px',
                                          marginTop: '3px',
                                        }}
                                      >
                                        {data.secondtext}
                                      </p>
                                      <p
                                        style={{
                                          fontSize: '12px',
                                          color: 'gray',
                                        }}
                                      >
                                        {data.secondtexttype}
                                      </p>
                                    </div>
                                    <div className="col-lg-2">
                                      <Avatar
                                        name={data.secondtext}
                                        style={{
                                          margin: 'auto',
                                          marginTop: '3px',
                                          fontSize: '10px',
                                          // height: 'auto',
                                          // width: '20px',
                                        }}
                                      />
                                    </div>
                                    <div className="col-lg"></div>
                                  </div>
                                </Card>
                              ))} */}
                          </div>
                        </div>
                      </Tab>
                    ))}
                </Tabs>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Card>
  );
};
export default React.memo(Payments);
