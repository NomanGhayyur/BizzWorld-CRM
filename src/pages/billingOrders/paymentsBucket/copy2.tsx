import {
  Table,
  Highlighter,
  IModalRef,
  Icon,
  Input,
  Modal,
  Card,
  Button,
  IButtonRef,
} from "elements";
import styles from "./bucket.module.css";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppThunkDispatch, RootState } from "../../../redux/types";
import { useQuery } from "react-query";
import { IOrder, IOrderListItem } from "../../../model/order";
import Image from "next/image";
import { useRouter } from "next/router";
import { Roles } from "../../../constant/app";
import Loader from "../../../components/shared/Loader";
import Pick from "../../../../public/icons/pick.svg";
import Unpick from "../../../../public/icons/unpick.svg";
import Cancel from "../../../../public/icons/cancel.svg";
import {
  getPaymentDetails,
  getPickedPayments,
  pickPayment,
  getForwardedPayments,
  unpickPayment,
  PaymentStatus,
} from "../../../api/payment";
import Invoice from "../../order/orderInvoice/[id]";
import ReactDOMServer from "react-dom/server";
import PaymentDetail from "../[id]";
import SentInvoice from "../../../../public/icons/invoicesent.svg";
import GenerateInvoice from "../../../../public/icons/invoiceview.svg";
import { updateOrderStatus } from "../../../api/pick";
import { Tab, Tabs } from "react-bootstrap";

type propTypes = {
  leads?: Array<IOrder>;
  className?: string;
  style?: React.CSSProperties;
};

type pickpageDetailsProps = {
  pickperPage: number | undefined;
  pickcurrentPage: string | number;
  picktotal: number | undefined;
};

type forwardedpageDetailsProps = {
  forwardedperPage: number | undefined;
  forwardedcurrentPage: string | number;
  forwardedtotal: number | undefined;
};

const PaymentsBuckets = React.memo<propTypes>((props) => {
  const dispatch = useDispatch<AppThunkDispatch>();
  const [sortKeys, setSortKeys] =
    useState<{ [key in string]: "asc" | "desc" }>();
  const [filterText, setFilterText] = useState<string>("");
  const [filterforwardedText, setFilterForwardedText] = useState<string>("");
  const user = useSelector((store: RootState) => store.auth.user);
  const modalRef = useRef<IModalRef>(null);
  const router = useRouter();
  const [acvtivePaymentId, setActivePaymentId] = useState(0);
  const [leadDetailsModal, setLeadDetailsModal] = useState(false);
  // const [leadstatus, setleadStatus] = useState<number | string>(2);
  const [brandID, setbrandId] = useState<number | string>(user?.brand1 || 1);
  const current = new Date();
  const date = `${current.getDate()}/${
    current.getMonth() + 1
  }/${current.getFullYear()}`;
  const [from, setFrom] = useState<number | string>(date);
  const [to, setTo] = useState<number | string>(date);
  const [forwardedpage, setForwardedPage] = useState(1);
  const [pageDetails, setPageDetails] = useState<forwardedpageDetailsProps>();
  const [acvtivePaymentLeadEmail, setActivePaymentLeadEmail] = useState("");
  const [acvtivePaymentLeadName, setActivePaymentLeadName] = useState("");
  const [paymentDetailsModal, setPaymentDetailsModal] = useState(false);
  const [filterPickedText, setFilterPickedText] = useState<string>("");
  const [checked, setChecked] = useState();
  const [pickpageDetails, setPickPageDetails] =
    useState<pickpageDetailsProps>();
  const [pickpage, setPickPage] = useState(1);
  const [comment, setComment] = useState();
  const [cancelModal, setCancelModal] = useState(false);
  const [order_id, setOrderPaymentId] = useState<number | string>();
  const inputRef = useRef(null);
  const formRef = useRef<HTMLFormElement>(null);
  const btnRef = useRef<HTMLButtonElement & IButtonRef>(null);

  const [key, setKey] = useState("PickPayments");
  function handleClick() {
    //@ts-ignore
    console.log(inputRef.current.value);
  }
  const getForwardedList = async (
    pageId: string | number,
    from: string | number,
    to: string | number
  ) => {
    const params = {
      data: {
        to: to,
        from: from,
        page: pageId,
      },
    };
    const response = await dispatch(getForwardedPayments(params));
    if (pageId === 1) {
      setPageDetails({
        forwardedcurrentPage: response.data.current_page,
        forwardedperPage: response.data.per_page,
        forwardedtotal: response.data.total,
      });
    }
    return response.data.data;
  };
  const {
    data: forwardedpayments,
    isLoading,
    refetch: refetchForwardedPayments,
  } = useQuery<Array<IOrderListItem>>(
    [`ForwardedPayments_${from}`, to, forwardedpage],
    () => getForwardedList(forwardedpage, from, to),
    {
      enabled: !!user?.user_id,
    }
  );

  const getPickedList = async (
    pageId: string | number,
    from: string | number,
    to: string | number
  ) => {
    const params = {
      data: {
        to: to,
        from: from,
        page: pageId,
      },
    };
    const response = await dispatch(getPickedPayments(params));
    if (pageId === 1) {
      setPickPageDetails({
        pickcurrentPage: response.data.current_page,
        pickperPage: response.data.per_page,
        picktotal: response.data.total,
      });
    }
    return response.data.data;
  };
  const {
    data: pickedpayments,
    isError,
    error,
    data,
    isPreviousData,
    refetch: refetchPickedPayments,
  } = useQuery<Array<IOrderListItem>>(
    [`PickedPayments_${from}`, to, pickpage],
    () => getPickedList(pickpage, from, to),
    {
      enabled: !!user?.user_id,
    }
  );

  const refetchBothList = useCallback(async () => {
    await refetchForwardedPayments();
    await refetchPickedPayments();
  }, [refetchForwardedPayments, refetchPickedPayments]);

  useEffect(() => {
    if (router.asPath.split("#")[1]) {
      modalRef.current?.showModal(true);
    } else {
      modalRef.current?.showModal(false);
    }
  }, [router]);

  const onRowItemClick = (v: IOrder) => {
    setActivePaymentLeadEmail(v.lead_email);
    setActivePaymentLeadName(v.lead_name);
    setActivePaymentId(v.order_id);
    setPaymentDetailsModal(true);
  };

  const onUnpick = useCallback(
    async (
      orderpaymentId: IOrder["order_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
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
    async (
      order_id: IOrder["order_id"],
      order_token: IOrder["order_token"],
      lead_name: IOrder["lead_name"],
      lead_email: IOrder["lead_email"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      try {
        const params = {
          data: {
            order_id: order_id,
            order_type: "UnMerge",
          },
        };
        const orders = await dispatch(getPaymentDetails(params));

        const newWindow = window.open();
        //@ts-ignore
        newWindow.document.write(
          `<!DOCTYPE>${ReactDOMServer.renderToString(
            <Invoice
              orders={orders}
              date={date}
              leademail={acvtivePaymentLeadEmail}
              leadname={acvtivePaymentLeadName}
            />
          )}`
        );
      } catch (e) {
        console.error(e);
      }
    },
    [acvtivePaymentLeadEmail, acvtivePaymentLeadName, date, dispatch]
  );
  const onInvoiceSent = useCallback(
    async (
      orderId: IOrder["order_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      try {
        const params = {
          data: {
            order_id: orderId,
            orderstatus_id: 10,
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
  // const onCancel = useCallback(
  //   async (
  //     order_id: IOrder['order_id'],
  //     event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  //   ) => {
  //     event.preventDefault();
  //     try {
  //       const params = {
  //         data: {
  //           order_type: 'UnMerger',
  //           orderpaymentstatus_id: '4',
  //           order_id: order_id,
  //           orderpayment_comment: comment,
  //         },
  //       };
  //       await dispatch(PaymentStatus(params));
  //       setCancelModal(false);
  //       refetchPickedPayments();
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   },
  //   [comment, dispatch, refetchPickedPayments]
  // );
  const onCancel: React.FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      e.preventDefault();

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
        refetchPickedPayments();
      };

      if (formRef.current) {
        btnRef.current?.setLoader(true);
        try {
          if (order_id) {
            updateStatus();
            setCancelModal(false);
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
  const openCancelModal = useCallback(
    async (
      orderpaymentId: IOrder["order_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      try {
        event.preventDefault();
        setOrderPaymentId(orderpaymentId);
        setCancelModal(true);
        // setPaymentDetailsModal(false);
      } catch (e) {
        console.error(e);
      }
    },
    []
  );
  // const openCancelModal = useCallback(
  //   (
  //     state: boolean,
  //     order_id: number | string,
  //     e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  //   ) => {
  //     // if (router.asPath.split('#')[1]) {
  //     //   router.replace({ pathname: router.pathname, query: router.query });
  //     // }
  //     if (state) {
  //       setOrderPaymentId(order_id);
  //     }
  //     setCancelModal(true);
  //   },
  //   []
  // );

  const onPick = useCallback(
    async (
      orderpaymentId: IOrder["order_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
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

  const forwardedcolumns = useMemo(() => {
    const temp = [
      {
        label: "Sr. No.",
        keyIndex: "order_id",
        render: (v: any, _: any, index: any) => parseInt(`${index + 1}`),
      },

      {
        label: "Refr. No.",
        keyIndex: "orderpayment_token",
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterforwardedText} />
        ),
      },
      {
        label: "Invoice No.",
        keyIndex: "orderpayment_invoiceno",
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterforwardedText} />
        ),
      },
      {
        label: "Title",
        keyIndex: "order_title",
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterforwardedText} />
        ),
      },
      {
        label: "Lead Name",
        keyIndex: "lead_name",
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterforwardedText} />
        ),
      },
      {
        label: "Lead Email",
        keyIndex: "lead_email",
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterforwardedText} />
        ),
      },
      {
        label: "Payment Title",
        keyIndex: "orderpayment_title",
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterforwardedText} />
        ),
      },

      {
        label: "Status",
        keyIndex: "orderpaymentstatus_name",
        render: (v: any) => (
          <Highlighter text={v || ""} searchText={filterforwardedText} />
        ),
      },
      {
        label: "Amount",
        keyIndex: "orderpayment_amount",
        render: (v: any) => (
          <p style={{ margin: "0px", padding: "0px" }}>
            $
            <Highlighter text={v || ""} searchText={filterforwardedText} />
          </p>
        ),
      },
      {
        label: "Due Date",
        keyIndex: "orderpayment_duedate",
        render: (v: any) => (
          <Highlighter text={v || ""} searchText={filterforwardedText} />
        ),
      },
      {
        label: "Create By",
        keyIndex: "user_name",
        render: (v: any) => (
          <Highlighter text={v || ""} searchText={filterforwardedText} />
        ),
      },
    ];
    if (user && ![Roles.MARKETING_AGENT].includes(user?.role_id)) {
      temp.push({
        label: "Actions",
        keyIndex: "order_id,deleted_at",
        render: (v: any) => (
          <>
            {user &&
            [Roles.SUPER_ADMIN, Roles.Billing].includes(user?.role_id) ? (
              <span
                title="Pick"
                style={{
                  marginLeft: "3px",
                  marginRight: "3px",
                }}
                onClick={onPick.bind(this, v.order_id)}
              >
                <Image src={Pick} alt="Alt" width={"25px"} />
              </span>
            ) : null}
          </>
        ),
      });
    }
    return temp;
  }, [user, filterforwardedText, onPick]);

  const pickedcolumns = useMemo(() => {
    const temp = [
      {
        label: "Sr. No.",
        keyIndex: "order_id",
        render: (v: any, _: any, index: any) => parseInt(`${index + 1}`),
      },

      {
        label: "Refr. No.",
        keyIndex: "order_token",
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterPickedText} />
        ),
      },
      {
        label: "Invoice No.",
        keyIndex: "orderpayment_invoiceno",
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterPickedText} />
        ),
      },
      {
        label: "Title",
        keyIndex: "order_title",
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterPickedText} />
        ),
      },
      {
        label: "Lead Name",
        keyIndex: "lead_name",
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterPickedText} />
        ),
      },
      {
        label: "Lead Email",
        keyIndex: "lead_email",
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterPickedText} />
        ),
      },
      {
        label: "Payment Title",
        keyIndex: "orderpayment_title",
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterPickedText} />
        ),
      },

      {
        label: "Status",
        keyIndex: "orderpaymentstatus_name",
        render: (v: any) => (
          <Highlighter text={v || ""} searchText={filterPickedText} />
        ),
      },
      {
        label: "Amount",
        keyIndex: "orderpayment_amount",
        render: (v: any) => (
          <p style={{ margin: "0px", padding: "0px" }}>
            $
            <Highlighter text={v || ""} searchText={filterPickedText} />
          </p>
        ),
      },
      {
        label: "Due Date",
        keyIndex: "orderpayment_duedate",
        render: (v: any) => (
          <Highlighter text={v || ""} searchText={filterPickedText} />
        ),
      },
      {
        label: "Create By",
        keyIndex: "user_name",
        render: (v: any) => (
          <Highlighter text={v || ""} searchText={filterPickedText} />
        ),
      },
    ];
    if (user && ![Roles.MARKETING_AGENT].includes(user?.role_id)) {
      temp.push({
        label: "Actions",
        keyIndex: "order_id,deleted_at",
        render: (v: any) => (
          <>
            {user &&
            [Roles.SUPER_ADMIN, Roles.SALES_AGENT, Roles.Billing].includes(
              user?.role_id
            ) ? (
              <span
                title="Unpick"
                style={{
                  marginLeft: "3px",
                  marginRight: "3px",
                }}
                onClick={onUnpick.bind(this, v.order_id)}
              >
                <Image src={Unpick} alt="Alt" width={"25px"} />
              </span>
            ) : null}

            <span
              style={{
                marginLeft: "3px",
                marginRight: "3px",
              }}
              title="Cancel"
              // onClick={onCancel.bind(this, v.order_id)}
              onClick={openCancelModal.bind(this, v.order_id)}
            >
              <Image src={Cancel} alt="Alt" width={"25px"} />
            </span>

            <span
              style={{
                marginLeft: "3px",
                marginRight: "3px",
              }}
              title="Generate Invoice"
              onClick={onGenerateInvoice.bind(
                this,
                v.order_id,
                v.lead_name,
                v.lead_email,
                v.order_token
              )}
            >
              <Image src={GenerateInvoice} alt="Alt" width={"25px"} />
            </span>
            <span
              title="Sent Invoice"
              style={{
                marginLeft: "3px",
                marginRight: "3px",
              }}
              onClick={onInvoiceSent.bind(this, v.order_id)}
            >
              <Image src={SentInvoice} alt="Alt" width={"25px"} />
            </span>
          </>
        ),
      });
    }
    return temp;
  }, [
    user,
    filterPickedText,
    onUnpick,
    openCancelModal,
    onGenerateInvoice,
    onInvoiceSent,
  ]);

  const onSearchByTextForwarded: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      setFilterForwardedText(e.target.value);
    }, []);

  const onSearchByTextPicked: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      setFilterPickedText(e.target.value);
    }, []);

  const forwardedfiltered: Array<IOrderListItem> = useMemo(() => {
    if (filterforwardedText) {
      return (
        forwardedpayments?.filter((v: IOrderListItem) => {
          return (
            v.lead_name
              ?.toLowerCase()
              ?.includes(filterforwardedText.toLowerCase()) ||
            v.order_title
              ?.toLowerCase()
              ?.includes(filterforwardedText.toLowerCase()) ||
            v.orderpayment_title
              ?.toLowerCase()
              ?.includes(filterforwardedText.toLowerCase())
          );
        }) || []
      );
    }
    return forwardedpayments || [];
  }, [forwardedpayments, filterforwardedText]);

  const pickedfiltered: Array<IOrderListItem> = useMemo(() => {
    if (filterPickedText) {
      return (
        pickedpayments?.filter((v: IOrderListItem) => {
          return (
            v.lead_name
              ?.toLowerCase()
              ?.includes(filterPickedText.toLowerCase()) ||
            v.order_title
              ?.toLowerCase()
              ?.includes(filterPickedText.toLowerCase()) ||
            v.orderpayment_title
              ?.toLowerCase()
              ?.includes(filterPickedText.toLowerCase())
          );
        }) || []
      );
    }
    return pickedpayments || [];
  }, [pickedpayments, filterPickedText]);

  if (isLoading) {
    return (
      <div
        className="d-flex justify-cntent-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Loader fullPage />
      </div>
    );
  }

  return (
    <>
      <div className="forwarded">
        <Card
          style={{
            margin: "1rem",
            height: "46vh",
            overflowY: "scroll",
          }}
        >
          <div className="container">
            <div className="row">
              <div className="col-lg-2">
                <h4 style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Forwarded Payments
                </h4>
              </div>
              <div className="col-lg-1">
                {" "}
                <Icon
                  name={"arrow-left"}
                  onClick={() => router.back()}
                  style={{ marginTop: "13px" }}
                />
              </div>
              <div className="col-lg-9 d-flex justify-content-right">
                <div className="col-3" style={{ marginRight: "10px" }}>
                  <Input
                    style={{ marginTop: "10px" }}
                    placeholder="Search Forwarded Payment"
                    onChange={onSearchByTextForwarded}
                  />
                </div>
              </div>
            </div>

            <Table
              onSortData={(sortKey, direction) =>
                setSortKeys({ [sortKey as keyof IOrderListItem]: direction })
              }
              autoSort={true}
              loading={isLoading}
              onRowItemClick={onRowItemClick}
              data={forwardedfiltered}
              columnHeadings={forwardedcolumns}
              onPageChange={(p) => setForwardedPage(p)}
              pageSize={pageDetails?.forwardedperPage}
              currentPage={forwardedpage}
              total={pageDetails?.forwardedtotal}
              style={{
                maxHeight: "48vh",
                overflowY: "scroll",
                marginTop: "0.5%",
              }}
            />
          </div>
          {/* <Modal
          style={{
            overflow: 'hidden',
            minHeight: '470px',
            maxHeight: '630px',
          }}
          show={leadDetailsModal}
          onBackdrop={() => setLeadDetailsModal(false)}
        >
          <LeadDetail orderpaymentId={acvtivePaymentId || 0} />
        </Modal> */}
        </Card>
      </div>

      <div className="Picked">
        <Card
          style={{
            margin: "1rem",
            height: "46vh",
            overflowY: "scroll",
          }}
        >
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            //@ts-ignore
            onSelect={(k) => setKey(k)}
            className={styles.tab}
          >
            <Tab eventKey="PickPayments" title="Picked Payments">
              <div className="container">
                <div className="row">
                  <div className="col-lg-12 d-flex justify-content-right">
                    <div className="col-3" style={{}}>
                      <Input
                        style={{ marginTop: "0rem", float: "right" }}
                        placeholder="Search Picked Payment"
                        onChange={onSearchByTextPicked}
                      />
                    </div>
                  </div>
                </div>

                <Table
                  onSortData={(sortKey, direction) =>
                    setSortKeys({
                      [sortKey as keyof IOrderListItem]: direction,
                    })
                  }
                  autoSort={true}
                  loading={isLoading}
                  onRowItemClick={onRowItemClick}
                  data={pickedfiltered}
                  columnHeadings={pickedcolumns}
                  onPageChange={(p) => setPickPage(p)}
                  pageSize={pickpageDetails?.pickperPage}
                  currentPage={pickpage}
                  total={pickpageDetails?.picktotal}
                  style={{
                    maxHeight: "48vh",
                    overflowY: "scroll",
                    marginTop: "0.5%",
                  }}
                />
              </div>
            </Tab>
            <Tab eventKey="Merge" title="Merge Payments">
              <div className="container">
                <div className="row">
                  {/* <div className="col-lg-3">
                    <h4 style={{ fontWeight: 'bold', fontSize: '16px' }}>
                      Merge Payments
                    </h4>
                  </div> */}

                  <div className="col-lg-12 d-flex justify-content-right">
                    <div className="col-3" style={{}}>
                      <Input
                        style={{ marginTop: "0rem", float: "right" }}
                        placeholder="Search Picked Payment"
                        onChange={onSearchByTextPicked}
                      />
                    </div>
                  </div>
                </div>

                <Table
                  onSortData={(sortKey, direction) =>
                    setSortKeys({
                      [sortKey as keyof IOrderListItem]: direction,
                    })
                  }
                  autoSort={true}
                  loading={isLoading}
                  onRowItemClick={onRowItemClick}
                  data={pickedfiltered}
                  columnHeadings={pickedcolumns}
                  onPageChange={(p) => setPickPage(p)}
                  pageSize={pickpageDetails?.pickperPage}
                  currentPage={pickpage}
                  total={pickpageDetails?.picktotal}
                  style={{
                    maxHeight: "48vh",
                    overflowY: "scroll",
                    marginTop: "0.5%",
                  }}
                />
              </div>
            </Tab>
          </Tabs>

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
                <h4 style={{ margin: "0rem" }}>
                  Are you sure, you want to cancel this?
                </h4>
              </div>
              <form
                ref={formRef}
                onSubmit={onCancel}
                className={`${styles.createUser__container} ${
                  props.className || ""
                }`.trim()}
              >
                <div className="row">
                  <div className="col-lg-10">
                    <Input
                      className={styles.inputfield}
                      type="floating"
                      label="Reason"
                      name="orderpayment_comment"
                      required
                    />
                  </div>
                  <div className="col-lg-1">
                    <Button
                      className=""
                      style={{
                        background: "var(--bs-primary)",
                        marginTop: "1.44rem",
                      }}
                      ref={btnRef}
                      htmlType="submit"
                    >
                      Submit
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
            <PaymentDetail
              orderId={acvtivePaymentId || 0}
              ordertype={"UnMerge"}
            />
          </Modal>
        </Card>
      </div>
    </>
  );
});
export default PaymentsBuckets;
