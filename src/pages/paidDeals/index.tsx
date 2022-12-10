import React, { useState, useMemo, useCallback, useRef } from "react";
import "antd/dist/antd.css";
import { DatePicker, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import styles from "./bucket.module.css";
import { AppThunkDispatch, RootState } from "../../redux/types";
import { useQuery } from "react-query";

import Image from "next/image";
import { useRouter } from "next/router";
import { Roles } from "../../constant/app";
import Loader from "../../components/shared/Loader";
import Pick from "../../../public/icons/pick.svg";
import ViewInvoice from "../../../public/icons/invoiceview.svg";
import Update from "../../../public/icons/update.svg";
import Paid from "../../../public/icons/paid.svg";
import {
  getPaymentDetails,
  getPickedPayments,
  pickPayment,
  getForwardedPayments,
  unpickPayment,
  PaymentStatus,
  statusWisePaymentList,
  mergeStatusWisePaymentList,
} from "../../api/payment";
import Invoice from "../order/orderInvoice/[id]";
import ReactDOMServer from "react-dom/server";
import PaymentDetail from "./[id]";
import SentInvoice from "../../../public/icons/invoicesent.svg";
import GenerateInvoice from "../../../public/icons/invoiceview.svg";
import { updateOrderStatus } from "../../api/pick";
import { Tab, Tabs } from "react-bootstrap";
import {
  Button,
  Card,
  Dropdown,
  Highlighter,
  IButtonRef,
  Icon,
  IDropdownItem,
  Input,
  Modal,
} from "elements";
import { useDispatch, useSelector } from "react-redux";
import { IPayment } from "../../model/payment";
import StatusHighlight from "../../components/shared/StatusHighligh/StatusHighlight";
import { getUserBrandList } from "../../api/user";
const { RangePicker } = DatePicker;

interface DataType {
  key: React.Key;
  order_title: string;
  order_id: number;
  orderpayment_id: number;
  order_token: number;
  lead_email: string;
  lead_name: string;
  orderpaymentstatus_name: string;
}
type propTypes = {
  leads?: Array<IPayment>;
  className?: string;
  style?: React.CSSProperties;
};
const colorObject: any = {
  Paid: "#FED7D7",
  Pending: "#82d7fa",
  Forwarded: "#D0F1DD",
  "Forwarded To Production": "#FED7D7",
  Picked: "#c5fab9",
  "Invoice Sent": "#CCEBF8",
};

const PaidDeals = React.memo((props) => {
  const dispatch = useDispatch<AppThunkDispatch>();
  const user = useSelector((store: RootState) => store.auth.user);
  const formRef = useRef<HTMLFormElement>(null);
  const btnRef = useRef<HTMLButtonElement & IButtonRef>(null);
  const [cancelModal, setCancelModal] = useState(false);
  const [order_id, setOrderPaymentId] = useState<number | string>();
  const [paymentDetailsModal, setPaymentDetailsModal] = useState(false);
  const [acvtivePaymentId, setActivePaymentId] = useState(0);
  const [searchPickText, setSearchPickText] = useState("");
  const [searchMergeText, setSearchMergeText] = useState("");
  const [key, setKey] = useState("paid");

  const [cpage, setCPage] = useState(1);
  const [totalcpages, setTotalCPages] = useState();
  const [cpagesize, setCPagesSize] = useState();

  const [mpage, setMPage] = useState(1);
  const [totalmpages, setTotalMPages] = useState();
  const [mpagesize, setMPagesSize] = useState();

  const [pageDetail, setPageDetail] = useState({});
  const [currentpage, setCurrentPage] = useState();
  const [Lastpage, setLastPage] = useState();

  function currencyFormat(num: number) {
    return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let fullDate = `${day}-${month}-${year}`;
  let startDate = `01-${month}-${year}`;
  //@ts-ignore
  const [[startPickDate, endPickDate], setDatePick] = useState([]);
  //@ts-ignore
  const onChangePickDate = (dates) => setDatePick(dates || []);
  //@ts-ignore
  const pickstart = startPickDate?.format("YYYY-MM-DD") || startDate;
  //@ts-ignore
  const pickend = endPickDate?.format("YYYY-MM-DD") || fullDate;
  //@ts-ignore
  const [[startMergedDate, endMergedDate], setDateMerged] = useState([]);
  //@ts-ignore
  const onChangeMergedDate = (dates) => setDateMerged(dates || []);
  //@ts-ignore
  const mergedstart = startMergedDate?.format("YYYY-MM-DD") || startDate;
  //@ts-ignore
  const mergedend = endMergedDate?.format("YYYY-MM-DD") || fullDate;

  const [brandID, setbrandId] = useState<number | string>(user?.brand1 || 1);
  const handlebrand = async (brandID: string) => {
    setbrandId(brandID);
  };
  const [mergebrandID, setmergebrandId] = useState<number | string>(
    user?.brand1 || 1
  );
  const handlemergebrand = async (mergebrandID: string) => {
    setmergebrandId(mergebrandID);
  };
  const { data: brands } = useQuery(
    `List`,
    async () => {
      const response = await dispatch(getUserBrandList());
      return response.data;
    },
    {
      // enabled: !!user?.user_id,
    }
  );
  const userBrand = useMemo(() => {
    return brands?.reduce(
      (
        result: { [x: string]: { label: any } },
        brands: { brand_id: string | number; brand_name: any }
      ) => {
        result[brands.brand_id] = {
          label: brands.brand_name,
        };
        return result;
      },
      {} as { [key in string]: IDropdownItem }
    );
  }, [brands]);

  const getPaid = async (from = pickstart, to = pickend, cpage: number) => {
    const params = {
      params: {
        from,
        to,
        page: cpage,
        orderpaymentstatus_id: 3,
        brand_id: brandID,
      },
    };
    const response = await dispatch(statusWisePaymentList(params));
    setCPage(response.data.current_page);
    setTotalCPages(response.data.total);
    setCPagesSize(response.data.per_page);
    return response.data.data;
  };
  const {
    data: Paidpayments,
    isLoading,
    refetch: refetchPickedPayments,
  } = useQuery<Array<IPayment>>(
    [`PaidPayments_${pickstart}${brandID}`, pickend, cpage],
    () => getPaid(pickstart, pickend, cpage),
    {
      keepPreviousData: true,
    }
  );

  const getMerged = async (
    from = mergedstart,
    to = mergedend,
    mpage: number
  ) => {
    const params = {
      params: {
        from,
        to,
        page: mpage,
        orderpaymentstatus_id: 3,
        brand_id: mergebrandID,
      },
    };
    const response = await dispatch(mergeStatusWisePaymentList(params));
    setMPage(response.data.current_page);
    setTotalMPages(response.data.total);
    setMPagesSize(response.data.per_page);
    return response.data.data;
  };
  const { data: mergepayments, refetch: refetchMergePayments } = useQuery<
    Array<IPayment>
  >(
    [`MergePayments_${mergedstart}${mergebrandID}`, mergedend, mpage],
    () => getMerged(mergedstart, mergedend, mpage),
    {
      keepPreviousData: true,
    }
  );

  const onRowItemClick = useCallback(
    (order: IPayment, rowIndex: number) => ({
      onClick: async (event: any) => {
        if (order.order_id) {
          await setActivePaymentId(order.order_id);
          setPaymentDetailsModal(true);
        }
      },
    }),
    []
  );

  const refetchBothList = useCallback(async () => {
    await refetchMergePayments();
    await refetchPickedPayments();
  }, [refetchMergePayments, refetchPickedPayments]);

  const onUnpick = useCallback(
    async (orderpaymentId: IPayment["order_id"]) => {
      try {
        const params = {
          data: {
            order_id: orderpaymentId,
          },
        };
        await dispatch(unpickPayment(params));
        refetchBothList();
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, refetchBothList]
  );
  const onGenerateInvoice = useCallback(
    async (orderpaymentId: IPayment["order_id"]) => {
      try {
        const params = {
          data: {
            order_id: orderpaymentId,
            order_type: "UnMerge",
            name: "name",
          },
        };
        const orders = await dispatch(getPaymentDetails(params));
        const newWindow = window.open();
        //@ts-ignore
        newWindow.document.write(
          `<!DOCTYPE>${ReactDOMServer.renderToString(
            <Invoice orders={orders} date={fullDate} />
          )}`
        );
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, fullDate]
  );
  const onPaid = useCallback(
    async (
      orderId: IPayment["order_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      try {
        const params = {
          data: {
            order_id: orderId,
            orderstatus_id: 3,
          },
        };
        await dispatch(updateOrderStatus(params));
        refetchPickedPayments();
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, refetchPickedPayments]
  );
  const onInvoiceNo: React.FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      // e.preventDefault();

      const updateStatus = async () => {
        if (formRef.current) {
          const params = {
            data: new FormData(formRef.current),
          };
          params.data.append("orderpaymentstatus_id", `4`);
          params.data.append("order_id", `${order_id}`);
          params.data.append("order_type", `UnMerge`);
          await dispatch(PaymentStatus(params));
        }
      };

      if (formRef.current) {
        btnRef.current?.setLoader(true);
        try {
          if (order_id) {
            updateStatus();
            setCancelModal(false);
            refetchPickedPayments();
          } else {
          }
        } catch (e) {
          console.error(e);
        }
        btnRef.current?.setLoader(false);
      }
    },
    [dispatch, order_id, refetchPickedPayments]
  );

  const onEditInvoice = useCallback(
    async (
      orderpaymentId: IPayment["order_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      try {
        event.stopPropagation();
        setOrderPaymentId(orderpaymentId);
        setCancelModal(true);
      } catch (e) {
        console.error(e);
      }
    },
    []
  );

  const onPick = useCallback(
    async (orderpaymentId: IPayment["order_id"]) => {
      try {
        const params = {
          data: {
            order_id: orderpaymentId,
          },
        };
        await dispatch(pickPayment(params));
        refetchBothList();
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, refetchBothList]
  );

  const mergedcolumns: ColumnsType<DataType> = [
    {
      title: "Sr. No.",
      dataIndex: "order_id",
      key: "order_id",
      render: (v: any, _: any, index: any) => parseInt(`${index + 1}`),
    },
    {
      title: "Reference No.",
      dataIndex: "order_token",
      key: "order_token",
      render: (v: any) => (
        <Highlighter text={`${v}`.trim()} searchText={searchMergeText} />
      ),
    },
    {
      title: "Invoice No.",
      dataIndex: "orderpayment_invoiceno",
      key: "orderpayment_invoiceno",
    },
    {
      title: "Title",
      dataIndex: "order_title",
      key: "order_title",
      render: (v: any) => (
        <Highlighter text={`${v}`.trim()} searchText={searchMergeText} />
      ),
    },
    {
      title: "Lead Name",
      dataIndex: "lead_name",
      key: "lead_name",
      render: (v: any) => (
        <Highlighter text={`${v}`.trim()} searchText={searchMergeText} />
      ),
    },
    {
      title: "Lead Email",
      dataIndex: "lead_email",
      key: "lead_email",
      render: (v: any) => (
        <Highlighter text={`${v}`.trim()} searchText={searchMergeText} />
      ),
    },
    {
      title: "Payment Title",
      dataIndex: "orderpayment_title",
      key: "orderpayment_title",
    },

    {
      title: "Status",
      dataIndex: "orderpaymentstatus_name",
      key: "orderpaymentstatus_name",
      render: (v: any, order) => {
        return (
          <StatusHighlight bgColor={colorObject[v]}>
            {order.orderpaymentstatus_name}
          </StatusHighlight>
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "orderpayment_amount",
      key: "orderpayment_amount",
      render: (v: any) => <p style={{ margin: "0px", padding: "0px" }}>$</p>,
    },
    {
      title: "Due Date",
      dataIndex: "orderpayment_duedate",
      key: "orderpayment_duedate",
    },
    {
      title: "Create By",
      dataIndex: "user_name",
      key: "user_name",
    },
    {
      title: "Actions",
      dataIndex: "order_id, orderpayment_id",
      render: (v: any, order) => (
        <>
          {/* <span
            title="Edit"
            style={{
              marginLeft: '3px',
              marginRight: '3px',
            }}
            onClick={onUnpick.bind(this, order.order_id, order.orderpayment_id)}
          >
            <Image src={Update} alt="Alt" width={'25px'} />
          </span> */}

          <span
            style={{
              marginLeft: "3px",
              marginRight: "3px",
            }}
            title="Update Invoice"
            onClick={onEditInvoice.bind(this, order.order_id)}
          >
            <Image src={Update} alt="Alt" width={"25px"} />
          </span>

          <span
            style={{
              marginLeft: "3px",
              marginRight: "3px",
            }}
            title="Generate Invoice"
            onClick={onGenerateInvoice.bind(
              this,
              order.order_id,
              order.lead_name,
              order.lead_email,
              order.order_token
            )}
          >
            <Image src={GenerateInvoice} alt="Alt" width={"25px"} />
          </span>
          <span
            title="Paid by Client"
            style={{
              marginLeft: "3px",
              marginRight: "3px",
            }}
            onClick={onPaid.bind(this, order.order_id)}
          >
            <Image src={Paid} alt="Alt" width={"25px"} />
          </span>
        </>
      ),
    },
  ];
  const pickcolumns: ColumnsType<DataType> = [
    {
      title: "Sr. No.",
      dataIndex: "order_id",
      key: "order_id",
      render: (v: any, _: any, index: any) => parseInt(`${index + 1}`),
    },

    {
      title: "Reference No.",
      dataIndex: "order_token",
      key: "order_token",
      render: (v: any) => (
        <Highlighter text={`${v}`.trim()} searchText={searchPickText} />
      ),
    },
    {
      title: "Invoice No.",
      dataIndex: "orderpayment_invoiceno",
      key: "orderpayment_invoiceno",
    },
    {
      title: "Title",
      dataIndex: "order_title",
      key: "order_title",
      render: (v: any) => (
        <Highlighter text={`${v}`.trim()} searchText={searchPickText} />
      ),
    },
    {
      title: "Lead Name",
      dataIndex: "lead_name",
      key: "lead_name",
      render: (v: any) => (
        <Highlighter text={`${v}`.trim()} searchText={searchPickText} />
      ),
    },
    {
      title: "Lead Email",
      dataIndex: "lead_email",
      key: "lead_email",
      render: (v: any) => (
        <Highlighter text={`${v}`.trim()} searchText={searchPickText} />
      ),
    },
    {
      title: "Payment Title",
      dataIndex: "orderpayment_title",
      key: "orderpayment_title",
    },

    {
      title: "Status",
      dataIndex: "orderpaymentstatus_name",
      key: "orderpaymentstatus_name",
      render: (v: any, order) => {
        return (
          <StatusHighlight bgColor={colorObject[v]}>
            {order.orderpaymentstatus_name}
          </StatusHighlight>
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "orderpayment_amount",
      key: "orderpayment_amount",
      render: (v: any) => <p style={{ margin: "0px", padding: "0px" }}>$</p>,
    },
    {
      title: "Due Date",
      dataIndex: "orderpayment_duedate",
      key: "orderpayment_duedate",
    },
    {
      title: "Create By",
      dataIndex: "user_name",
      key: "user_name",
    },
    {
      title: "Actions",
      dataIndex: "order_id, orderpayment_id",
      render: (v: any, order) => (
        <>
          {/* <span
            title="Edit"
            style={{
              marginLeft: '3px',
              marginRight: '3px',
            }}
            onClick={onUnpick.bind(this, order.order_id, order.orderpayment_id)}
          >
            <Image src={Update} alt="Alt" width={'25px'} />
          </span> */}

          <span
            style={{
              marginLeft: "3px",
              marginRight: "3px",
            }}
            title="Update Invoice"
            onClick={onEditInvoice.bind(this, order.order_id)}
          >
            <Image src={Update} alt="Alt" width={"25px"} />
          </span>

          <span
            style={{
              marginLeft: "3px",
              marginRight: "3px",
            }}
            title="Generate Invoice"
            onClick={onGenerateInvoice.bind(
              this,
              order.order_id,
              order.lead_name,
              order.lead_email,
              order.order_token
            )}
          >
            <Image src={GenerateInvoice} alt="Alt" width={"25px"} />
          </span>
          <span
            title="Paid by Client"
            style={{
              marginLeft: "3px",
              marginRight: "3px",
            }}
            onClick={onPaid.bind(this, order.order_id)}
          >
            <Image src={Paid} alt="Alt" width={"25px"} />
          </span>
        </>
      ),
    },
  ];

  const pickedfiltered: Array<IPayment> = useMemo(() => {
    if (searchPickText) {
      return (
        Paidpayments?.filter((v: IPayment) => {
          return (
            v.lead_name
              ?.toLowerCase()
              ?.includes(searchPickText.toLowerCase()) ||
            v.order_title
              ?.toLowerCase()
              ?.includes(searchPickText.toLowerCase()) ||
            v.orderpayment_title
              ?.toLowerCase()
              ?.includes(searchPickText.toLowerCase())
          );
        }) || []
      );
    }
    return Paidpayments || [];
  }, [searchPickText, Paidpayments]);

  const mergedfiltered: Array<IPayment> = useMemo(() => {
    if (searchMergeText) {
      return (
        mergepayments?.filter((v: IPayment) => {
          return (
            v.lead_name
              ?.toLowerCase()
              ?.includes(searchMergeText.toLowerCase()) ||
            v.order_title
              ?.toLowerCase()
              ?.includes(searchMergeText.toLowerCase()) ||
            v.orderpayment_title
              ?.toLowerCase()
              ?.includes(searchMergeText.toLowerCase())
          );
        }) || []
      );
    }
    return mergepayments || [];
  }, [searchMergeText, mergepayments]);

  const onSearchByTextPicked: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      setSearchPickText(e.target.value);
    }, []);

  const onSearchByTextMerge: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      setSearchMergeText(e.target.value);
    }, []);

  return (
    <div className="container-fluid">
      <Card
        style={{
          background: "rgba(80, 105, 231, 0.06)",
          border: "none",
          borderRadius: "5px",
          marginTop: "1rem",
        }}
      >
        <div
          className="container-fluid"
          style={{
            marginTop: "1rem",
            marginBottom: "1rem",
          }}
        >
          <h4
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
            }}
          >
            Paid Deal List
          </h4>
          <div className="row">
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
                          {currencyFormat(parseInt("0"))}
                          {/* {topdata?.totalincomeindollar} */}
                        </h4>{" "}
                        <br />
                        <p style={{ color: "gray", float: "right" }}>Paid</p>
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
                          {currencyFormat(parseInt("0"))}
                          {/* {topdata?.totalincomeindollar} */}
                        </h4>{" "}
                        <br />
                        <p style={{ color: "gray", float: "right" }}>
                          Merge Paid
                        </p>
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
                            color: "rgb(80, 105, 231)",
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
                          <span style={{ color: "rgb(80, 105, 231)" }}>$</span>{" "}
                          {currencyFormat(parseInt("0"))}
                          {/* {topdata?.totalincomeindollar} */}
                        </h4>{" "}
                        <br />
                        <p style={{ color: "gray", float: "right" }}>
                          Total Paid
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <Card
        style={{
          marginTop: "0.5rem",
          border: "none",
          boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
          borderRadius: "5px",
        }}
      >
        <div
          className="container-fluid"
          style={{ marginTop: "0.5rem", height: "71vh", overflowY: "scroll" }}
        >
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            //@ts-ignore
            onSelect={(k) => setKey(k)}
            className={styles.tab}
          >
            <Tab
              eventKey="paid"
              title={`Paid Deals (${pickedfiltered.length})`}
            >
              <div className="row" style={{ marginBottom: "0.5rem" }}>
                <div className="col-lg-3"></div>
                <div className="col-lg-3">
                  {userBrand ? (
                    <Dropdown
                      className={styles.dropdownn}
                      style={{ width: "100%" }}
                      placeholder="Select Brand"
                      defaultKey="brand_id"
                      options={userBrand}
                      name="brand_id"
                      type="light"
                      onItemClick={(brandID) => handlebrand(brandID)}
                      value={brandID.toString()}
                    />
                  ) : null}
                </div>
                <div className="col-lg-3">
                  <RangePicker
                    style={{ width: "100%" }}
                    size="large"
                    placeholder={["Start Date", "End Date"]}
                    onChange={onChangePickDate}
                  />
                </div>
                <div className="col-lg-3">
                  <Input
                    style={{
                      width: "100%",
                      border: "1px solid lightgray",
                      borderRadius: "2px",
                      marginTop: "0.1rem",
                    }}
                    placeholder="Search Paid Deals"
                    // prefix={<SearchOutlined />}
                    onChange={onSearchByTextPicked}
                  />
                </div>
              </div>
              <Table
                className={styles.table}
                //@ts-ignore
                onRow={onRowItemClick}
                rowKey="order_token"
                //@ts-ignore
                columns={pickcolumns}
                dataSource={pickedfiltered}
                pagination={{
                  current: cpage,
                  pageSize: cpagesize,
                  total: totalcpages,
                  onChange(cpage, cpageSize) {
                    setCPage(cpage);
                  },
                }}
              />
            </Tab>
            <Tab
              eventKey="merge"
              title={`Merged Deals (${mergedfiltered.length})`}
            >
              <div className="row" style={{ marginBottom: "0.5rem" }}>
                <div className="col-lg-3"></div>
                <div className="col-lg-3">
                  {userBrand ? (
                    <Dropdown
                      className={styles.dropdownn}
                      style={{ width: "100%" }}
                      placeholder="Select Brand"
                      defaultKey="brand_id"
                      options={userBrand}
                      name="brand_id"
                      type="light"
                      onItemClick={(brandID) => handlemergebrand(brandID)}
                      value={brandID.toString()}
                    />
                  ) : null}
                </div>
                <div className="col-lg-3">
                  <RangePicker
                    style={{ width: "100%" }}
                    size="large"
                    placeholder={["Start Date", "End Date"]}
                    onChange={onChangeMergedDate}
                  />
                </div>
                <div className="col-lg-3">
                  <Input
                    style={{
                      width: "100%",
                      border: "1px solid lightgray",
                      borderRadius: "2px",
                      marginTop: "0.1rem",
                    }}
                    placeholder="Search Merged Deals"
                    // prefix={<SearchOutlined />}
                    onChange={onSearchByTextMerge}
                  />
                </div>
              </div>
              <Table
                className={styles.table}
                dataSource={mergedfiltered}
                //@ts-ignore
                columns={mergedcolumns}
                //@ts-ignore
                onRow={onRowItemClick}
                rowKey="order_token"
                pagination={{
                  current: mpage,
                  pageSize: mpagesize,
                  total: totalmpages,
                  onChange(mpage, mpageSize) {
                    setMPage(mpage);
                  },
                }}
              />
            </Tab>
          </Tabs>
        </div>
      </Card>
      <Modal
        style={{
          overflow: "hidden",
          minHeight: "5rem",
          maxHeight: "10rem",
          minWidth: "10rem",
          maxWidth: "40rem",
        }}
        show={cancelModal}
        onBackdrop={() => setCancelModal(false)}
      >
        <div className="container" style={{ margin: "auto" }}>
          <div>
            <h4 style={{ margin: "0rem" }}>PayPal Invoice Number</h4>
          </div>
          <form ref={formRef} onSubmit={onInvoiceNo}>
            <div className="row">
              <div className="col-lg-10">
                <Input
                  className={styles.inputfield}
                  type="floating"
                  label="Invoice Number"
                  name="invoice_no"
                  required
                />
              </div>
              <div className="col-lg-1">
                <Button
                  className=""
                  style={{
                    background: "var(--bs-primary)",
                    marginTop: "1.44rem",
                    borderRadius: "5px",
                  }}
                  ref={btnRef}
                  htmlType="submit"
                >
                  Save
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Modal>
      <Modal
        style={{
          overflow: "hidden",
          minHeight: "470px",
          maxHeight: "630px",
        }}
        show={paymentDetailsModal}
        onBackdrop={() => setPaymentDetailsModal(false)}
      >
        <PaymentDetail orderId={acvtivePaymentId || 0} ordertype={"UnMerge"} />
      </Modal>
    </div>
  );
});

export default PaidDeals;
