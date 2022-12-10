import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import "antd/dist/antd.css";
import { DatePicker, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import styles from "./bucket.module.css";
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
  MergeDeal,
  MergedDealList,
  UnMergeDeal,
  merchantList,
  getPaymentAmount,
} from "../../../api/payment";
import Invoice from "../../order/orderInvoice/[id]";
import ReactDOMServer from "react-dom/server";
import PaymentDetail from "../[id]";
import SentInvoice from "../../../../public/icons/invoicesent.svg";
import GenerateInvoice from "../../../../public/icons/invoiceview.svg";
import { updateOrderStatus } from "../../../api/pick";
import { Tab, Tabs } from "react-bootstrap";
import {
  Button,
  Card,
  Dropdown,
  Highlighter,
  IButtonRef,
  IDropdownItem,
  Icon,
  Input,
  Modal,
} from "elements";
import { useDispatch, useSelector } from "react-redux";
import { IPayment } from "../../../model/payment";
import StatusHighlight from "../../../components/shared/StatusHighligh/StatusHighlight";
import _ from "lodash";
import { getTotalAmount } from "../../../api/order";
import { getUserBrandList } from "../../../api/user";
const { RangePicker } = DatePicker;

interface DataType {
  key: React.Key;
  order_title: string;
  order_id: number;
  orderpayment_id: number;
  order_token: number;
  lead_email: string;
  lead_name: string;
  mergedeal_token: number | string;
}
type propTypes = {
  leads?: Array<IOrder>;
  className?: string;
  style?: React.CSSProperties;
};
const colorObject: any = {
  Cancel: "#FED7D7",
  Pending: "#82d7fa",
  Forwarded: "#D0F1DD",
  "Forwarded To Production": "#FED7D7",
  Picked: "#c5fab9",
  "Invoice Sent": "#CCEBF8",
};
type amountType = { [key in string]: number };

const PaymentsBuckets = React.memo((props) => {
  const dispatch = useDispatch<AppThunkDispatch>();
  const user = useSelector((store: RootState) => store.auth.user);
  const formRef = useRef<HTMLFormElement>(null);
  const btnRef = useRef<HTMLButtonElement & IButtonRef>(null);
  const [cancelModal, setCancelModal] = useState(false);
  const [invoiceModal, setInvoiceModal] = useState(false);
  const [mergeInvoiceModal, setMergeInvoiceModal] = useState(false);
  const [mergeCancelModal, setMergeCancelModal] = useState(false);
  const [order_id, setOrderPaymentId] = useState<number | string>();
  const [mergedeal_token, setMergeDealToken] = useState<number | string>();
  const [paymentDetailsModal, setPaymentDetailsModal] = useState(false);
  const [MergeDetailsModal, setMergeDetailsModal] = useState(false);
  const [acvtivePaymentId, setActivePaymentId] = useState(0);
  const [activeDealToken, setActiveDealToken] = useState(0);

  const [checkBoxRecord, setCheckboxRecord] = useState({});
  const [searchPickText, setSearchPickText] = useState("");
  const [searchForwardedText, setSearchForwardedText] = useState("");
  const [searchMergeText, setSearchMergeText] = useState("");
  const [selectedChecks, setSelectedChecks] = useState([]);
  const [key, setKey] = useState("pick");
  const [pickedDeal, setPickedDeal] = useState([]);
  const [forwardedkey, setForwardedKey] = useState("forwarded");

  const [brandID, setbrandId] = useState<number | string>(user?.brand1 || 1);
  const handlebrand = async (brandID: string) => {
    setbrandId(brandID);
  };

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
  const [[startForwardedDate, endForwardedDate], setDateForwarded] = useState(
    []
  );
  //@ts-ignore
  const onChangeForwardedDate = (dates) => setDateForwarded(dates || []);
  //@ts-ignore
  const forwardedstart = startForwardedDate?.format("YYYY-MM-DD") || startDate;
  //@ts-ignore
  const forwardedend = endForwardedDate?.format("YYYY-MM-DD") || fullDate;
  // console.log(startPickDate._d, 'startPickDate');
  // console.log(endPickDate._d, 'endPickDate');
  //@ts-ignore
  const [[startMergeDate, endMergeDate], setDateMerge] = useState([]);
  //@ts-ignore
  const onChangeMergeDate = (dates) => setDateMerge(dates || []);
  //@ts-ignore
  const mergestart = startMergeDate?.format("YYYY-MM-DD") || startDate;
  //@ts-ignore
  const mergeend = endMergeDate?.format("YYYY-MM-DD") || fullDate;

  const { data: merchants } = useQuery(
    `MerchantList_${brandID}`,
    async () => {
      const params = {
        data: {
          brand_id: brandID,
        },
      };
      const response = await dispatch(merchantList(params));
      return response.data;
    },
    {
      // enabled: !!user?.user_id
    }
  );

  const marchantOptions = useMemo(() => {
    return merchants?.reduce(
      (
        result: { [x: string]: { label: any } },
        merchants: {
          billingmerchant_id: string | number;
          billingmerchant_title: string;
        }
      ) => {
        result[
          (merchants.billingmerchant_title, merchants.billingmerchant_id)
        ] = {
          label: merchants.billingmerchant_title,
        };
        return result;
      },
      {} as { [key in string]: IDropdownItem }
    );
  }, [merchants]);

  const getForwarded = async (
    forwardedstart: string | number,
    forwardedend: string | number
  ) => {
    const params = {
      params: {
        from: forwardedstart,
        to: forwardedend,
      },
    };
    const response = await dispatch(getForwardedPayments(params));

    return response.data.data;
  };

  const { data: forwardedpayments, refetch: refetchForwardedPayments } =
    useQuery<Array<IPayment>>(
      [`ForwardedPayments_${forwardedstart}`, forwardedend],
      () => getForwarded(forwardedstart, forwardedend),
      {
        keepPreviousData: true,
      }
    );

  const getMerged = async (
    mergestart: string | number,
    mergeend: string | number
  ) => {
    const params = {
      params: {
        from: mergestart,
        to: mergeend,
        orderpaymentstatus_id: 9,
      },
    };
    const response = await dispatch(MergedDealList(params));

    return response.data;
  };

  const { data: mergepayments, refetch: refetchMergedPayments } = useQuery<
    Array<IPayment>
  >(
    [`MergedPayments_${mergestart}`, mergeend],
    () => getMerged(mergestart, mergeend),
    {
      keepPreviousData: true,
    }
  );

  const {
    data: pickedpay,
    isLoading,
    refetch: refetchPickedPayments,
  } = useQuery<IPayment>(
    [`PickedPayments_${pickstart}`, pickend],
    async () => {
      const response = await dispatch(
        getPickedPayments({
          params: { to: pickend, from: pickstart, orderpaymentstatus_id: 9 },
        })
      );
      setPickedDeal(response.data);
      return response.data;
    },
    {
      enabled: !!user?.user_id,
    }
  );

  const pDeals = useMemo(
    () => _.unionBy(pickedDeal, "order_token"),
    [pickedDeal]
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

  const onMergeRowItemClick = useCallback(
    (order: IPayment, rowIndex: number) => ({
      onClick: async (event: any) => {
        if (order.order_id) {
          await setActiveDealToken(order.mergedeal_token);
          setMergeDetailsModal(true);
        }
      },
    }),
    []
  );

  const refetchBothList = useCallback(async () => {
    await refetchForwardedPayments();
    await refetchPickedPayments();
    await refetchMergedPayments();
  }, [refetchForwardedPayments, refetchMergedPayments, refetchPickedPayments]);

  const MergeDeals = useCallback(async () => {
    try {
      const params = {
        data: {
          multiple: selectedChecks,
        },
      };
      await dispatch(MergeDeal(params));
      refetchPickedPayments();
      refetchMergedPayments();
    } catch (e) {
      console.error(e);
    }
  }, [dispatch, refetchMergedPayments, refetchPickedPayments, selectedChecks]);

  const onUnpick = useCallback(
    async (orderpaymentId: IOrder["order_id"]) => {
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
  const onEditMergeInvoice = useCallback(
    async (
      mergedealToken: IPayment["mergedeal_token"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      try {
        event.stopPropagation();
        setOrderPaymentId(mergedealToken);
        setMergeInvoiceModal(true);
      } catch (e) {
        console.error(e);
      }
    },
    []
  );
  const onEditPickedInvoice = useCallback(
    async (
      orderpaymentId: IPayment["order_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      try {
        event.stopPropagation();
        setOrderPaymentId(orderpaymentId);
        setInvoiceModal(true);
      } catch (e) {
        console.error(e);
      }
    },
    []
  );
  const onGenerateInvoice = useCallback(
    async (orderpaymentId: IOrder["order_id"]) => {
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

  const onCancel: React.FormEventHandler<HTMLFormElement> = useCallback(
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
        // btnRef.current?.setLoader(true);
        try {
          updateStatus();
          setCancelModal(false);
          refetchPickedPayments();
        } catch (e) {
          console.error(e);
        }
        // btnRef.current?.setLoader(false);
      }
    },
    [dispatch, order_id, refetchPickedPayments]
  );
  const onMergeCancel: React.FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      e.preventDefault();

      const updateStatus = async () => {
        if (formRef.current) {
          const params = {
            data: new FormData(formRef.current),
          };
          params.data.append("orderpaymentstatus_id", `4`);
          params.data.append("mergedeal_token", `${mergedeal_token}`);
          params.data.append("order_type", `Merge`);
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
    [dispatch, mergedeal_token, order_id, refetchPickedPayments]
  );
  const openMergeCancelModal = useCallback(
    async (
      mergedealToken: IPayment["mergedeal_token"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      try {
        event.stopPropagation();
        setMergeDealToken(mergedealToken);
        setMergeCancelModal(true);
      } catch (e) {
        console.error(e);
      }
    },
    []
  );
  const onPickedInvoiceNo: React.FormEventHandler<HTMLFormElement> =
    useCallback(
      async (e) => {
        e.preventDefault();

        const updateStatus = async () => {
          if (formRef.current) {
            const params = {
              data: new FormData(formRef.current),
            };
            params.data.append("orderpaymentstatus_id", `2`);
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
              setInvoiceModal(false);
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
  const onMergeInvoiceNo: React.FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      e.preventDefault();

      const updateStatus = async () => {
        if (formRef.current) {
          const params = {
            data: new FormData(formRef.current),
          };
          params.data.append("orderpaymentstatus_id", `2`);
          params.data.append("order_id", `${order_id}`);
          params.data.append("order_type", `Merge`);
          await dispatch(PaymentStatus(params));
        }
      };

      if (formRef.current) {
        btnRef.current?.setLoader(true);
        try {
          if (order_id) {
            updateStatus();
            setMergeInvoiceModal(false);
            refetchMergedPayments();
          } else {
          }
        } catch (e) {
          console.error(e);
        }
        btnRef.current?.setLoader(false);
      }
    },
    [dispatch, order_id, refetchMergedPayments]
  );
  const openCancelModal = useCallback(
    async (
      orderpaymentId: IOrder["order_id"],
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
  const [totalamount, setTotalAmount] = useState<amountType>();
  const { data: brands } = useQuery(
    `BrandList`,
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
  const onAmount = useCallback(
    async (
      orderId: IOrder["orderpayment_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      try {
        const params = {
          data: {
            order_id: orderId,
            order_type: "Unmerge",
          },
        };
        const response = await dispatch(getPaymentAmount(params));
        setTotalAmount({
          ...totalamount,
          [orderId]: response.totalamount,
        });
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, totalamount]
  );
  const onMergeAmount = useCallback(
    async (
      orderId: IOrder["orderpayment_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      try {
        const params = {
          data: {
            order_id: orderId,
            order_type: "Merge",
          },
        };
        const response = await dispatch(getPaymentAmount(params));
        setTotalAmount({
          ...totalamount,
          [orderId]: response.totalamount,
        });
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, totalamount]
  );

  const onPick = useCallback(
    async (orderpaymentId: IOrder["order_id"]) => {
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
  const onUnMergeDeal = useCallback(
    async (mergedealToken: IPayment["mergedeal_token"]) => {
      try {
        const params = {
          data: {
            order_id: mergedealToken,
          },
        };
        await dispatch(UnMergeDeal(params));
        refetchPickedPayments();
        refetchMergedPayments();
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, refetchMergedPayments, refetchPickedPayments]
  );
  const onGenerateMergeInvoice = useCallback(
    async (mergedealToken: IPayment["mergedeal_token"]) => {
      try {
        const params = {
          data: {
            order_id: mergedealToken,
            order_type: "Merge",
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
  // const forwardedcolumns: ColumnsType<DataType> = [
  const forwardedcolumns = useMemo(() => {
    const temp = [
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
          <Highlighter text={`${v}`.trim()} searchText={searchForwardedText} />
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
          <Highlighter text={`${v}`.trim()} searchText={searchForwardedText} />
        ),
      },
      {
        title: "Lead Name",
        dataIndex: "lead_name",
        key: "lead_name",
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={searchForwardedText} />
        ),
      },
      {
        title: "Lead Email",
        dataIndex: "lead_email",
        key: "lead_email",
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={searchForwardedText} />
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
        //@ts-ignore
        render: (v: any, order) => {
          return (
            <StatusHighlight bgColor={colorObject[v]}>
              {order.orderpaymentstatus_name}
            </StatusHighlight>
          );
        },
      },
      // {
      //   title: "Amount",
      //   dataIndex: "orderpayment_amount",
      //   key: "orderpayment_amount",
      //   render: (v: any) => <p style={{ margin: "0px", padding: "0px" }}>$</p>,
      // },
      {
        title: "Amount",
        keyIndex: "orderpayment_id,totalamount",
        render: (v: any) => {
          {
            if (totalamount) {
              if (totalamount[v.order_token]) {
                return (
                  <span>
                    <p style={{ marginBottom: "0px" }}>
                      ${totalamount[v.order_token]}
                    </p>
                  </span>
                );
              }
            }
            return (
              <>
                {!v.totalamount ? (
                  <span className="m-1 question">
                    <Icon
                      name="currency-dollar"
                      onClick={(e) => onAmount(v.order_token, e)}
                    />
                  </span>
                ) : (
                  <p>no data</p>
                )}
              </>
            );
          }
        },
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
        render: (
          v: any,
          order: { order_id: number; orderpayment_id: number }
        ) => (
          <>
            <span
              title="Unpick"
              style={{
                marginLeft: "3px",
                marginRight: "3px",
              }}
              onClick={onPick.bind(this, order.order_id, order.orderpayment_id)}
            >
              <Image src={Pick} alt="Alt" width={"25px"} />
            </span>
          </>
        ),
      },
    ];
    return temp;
  }, [searchForwardedText, totalamount, onAmount, onPick]);
  // ];

  const mergecolumns = useMemo(() => {
    const temp = [
      {
        title: "Sr. No.",
        dataIndex: "order_id",
        key: "order_id",
        render: (v: any, _: any, index: any) => parseInt(`${index + 1}`),
      },

      {
        title: "Reference No.",
        dataIndex: "mergedeal_token",
        key: "mergedeal_token",
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
        render: (v: any, order: IOrderListItem) => {
          return (
            <StatusHighlight bgColor={colorObject[v]}>
              {order.orderpaymentstatus_name}
            </StatusHighlight>
          );
        },
      },
      {
        title: "Amount",
        keyIndex: "orderpayment_id,totalamount",
        render: (v: any) => {
          {
            if (totalamount) {
              if (totalamount[v.mergedeal_token]) {
                return (
                  <span>
                    <p style={{ marginBottom: "0px" }}>
                      ${totalamount[v.mergedeal_token]}
                    </p>
                  </span>
                );
              }
            }
            return (
              <>
                {!v.totalamount ? (
                  <span className="m-1 question">
                    <Icon
                      name="currency-dollar"
                      onClick={(e) => onMergeAmount(v.mergedeal_token, e)}
                    />
                  </span>
                ) : (
                  <p>no data</p>
                )}
              </>
            );
          }
        },
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
        dataIndex: "order_id, mergedeal_token",
        //@ts-ignore
        render: (v: any, order) => (
          <>
            <span
              title="UnMerge"
              style={{
                marginLeft: "3px",
                marginRight: "3px",
              }}
              onClick={onUnMergeDeal.bind(this, order.mergedeal_token)}
            >
              <Image src={Pick} alt="Alt" width={"25px"} />
            </span>
            <span
              style={{
                marginLeft: "3px",
                marginRight: "3px",
              }}
              title="Generate Invoice"
              onClick={onGenerateMergeInvoice.bind(
                this,
                order.mergedeal_token,
                order.lead_name,
                order.lead_email,
                order.order_token
              )}
            >
              <Image src={GenerateInvoice} alt="Alt" width={"25px"} />
            </span>
            <span
              style={{
                marginLeft: "3px",
                marginRight: "3px",
              }}
              title="Cancel"
              onClick={openMergeCancelModal.bind(
                this,
                order.order_id,
                order.mergedeal_token
              )}
            >
              <Image src={Cancel} alt="Alt" width={"25px"} />
            </span>
            <span
              title="Sent Invoice"
              style={{
                marginLeft: "3px",
                marginRight: "3px",
              }}
              onClick={onEditMergeInvoice.bind(this, order.mergedeal_token)}
            >
              <Image src={SentInvoice} alt="Alt" width={"25px"} />
            </span>
          </>
        ),
      },
    ];
    return temp;
  }, [
    searchMergeText,
    totalamount,
    onMergeAmount,
    onUnMergeDeal,
    onGenerateMergeInvoice,
    openMergeCancelModal,
    onEditMergeInvoice,
  ]);
  // const pickcolumns: ColumnsType<DataType> = [
  const pickcolumns = useMemo(() => {
    const temp = [
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
        //@ts-ignore
        render: (v: any, order) => {
          return (
            <StatusHighlight bgColor={colorObject[v]}>
              {order.orderpaymentstatus_name}
            </StatusHighlight>
          );
        },
      },
      // {
      //   title: "Amount",
      //   dataIndex: "orderpayment_amount",
      //   key: "orderpayment_amount",
      //   render: (v: any) => <p style={{ margin: "0px", padding: "0px" }}>$</p>,
      // },
      {
        title: "Amount",
        keyIndex: "orderpayment_id,totalamount",
        render: (v: any) => {
          {
            if (totalamount) {
              if (totalamount[v.order_token]) {
                return (
                  <span>
                    <p style={{ marginBottom: "0px" }}>
                      ${totalamount[v.order_token]}
                    </p>
                  </span>
                );
              }
            }
            return (
              <>
                {!v.totalamount ? (
                  <span className="m-1 question">
                    <Icon
                      name="currency-dollar"
                      onClick={(e) => onAmount(v.order_token, e)}
                    />
                  </span>
                ) : (
                  <p>no data</p>
                )}
              </>
            );
          }
        },
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
    ];

    if (
      // selectedChecks &&
      selectedChecks.length <= 1
    ) {
      temp.push({
        title: "Actions",
        key: "orderpayment_id",
        dataIndex: "order_id, orderpayment_id",
        //@ts-ignore
        render: (v: any, order) => (
          <>
            <span
              title="Unpick"
              style={{
                marginLeft: "3px",
                marginRight: "3px",
              }}
              onClick={onUnpick.bind(
                this,
                order.order_id,
                order.orderpayment_id
              )}
            >
              <Image src={Unpick} alt="Alt" width={"25px"} />
            </span>

            <span
              style={{
                marginLeft: "3px",
                marginRight: "3px",
              }}
              title="Cancel"
              // onClick={onCancel.bind(this, v.order_id)}
              onClick={openCancelModal.bind(this, order.order_id)}
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
                order.order_id,
                order.lead_name,
                order.lead_email,
                order.order_token
              )}
            >
              <Image src={GenerateInvoice} alt="Alt" width={"25px"} />
            </span>
            <span
              style={{
                marginLeft: "3px",
                marginRight: "3px",
              }}
              title="Update Invoice"
              onClick={onEditPickedInvoice.bind(this, order.order_id)}
            >
              <Image src={SentInvoice} alt="Alt" width={"25px"} />
            </span>
          </>
        ),
      });
    } else {
      <span
        style={{
          marginLeft: "3px",
          marginRight: "3px",
        }}
        title="Delete"
        // onClick={onDelete.bind(this, v.user_id)}
      >
        <Image src={Cancel} alt="Alt" width={"25px"} />
      </span>;
    }
    return temp;
  }, [
    selectedChecks.length,
    searchPickText,
    totalamount,
    onAmount,
    onUnpick,
    openCancelModal,
    onGenerateInvoice,
    onEditPickedInvoice,
  ]);
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`);
    },
  };

  const forwardedfiltered: Array<IPayment> = useMemo(() => {
    if (searchForwardedText) {
      return (
        forwardedpayments?.filter((v: IPayment) => {
          return (
            v.lead_name
              ?.toLowerCase()
              ?.includes(searchForwardedText.toLowerCase()) ||
            v.order_title
              ?.toLowerCase()
              ?.includes(searchForwardedText.toLowerCase()) ||
            v.orderpayment_title
              ?.toLowerCase()
              ?.includes(searchForwardedText.toLowerCase())
          );
        }) || []
      );
    }
    return forwardedpayments || [];
  }, [forwardedpayments, searchForwardedText]);

  const mergefiltered: Array<IPayment> = useMemo(() => {
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
  }, [mergepayments, searchMergeText]);
  //@ts-ignore
  const onFilter = useCallback((v, searchText) => {
    if (searchText) {
      return (
        `${v.mergedeal_token || v.order_token || ""}`
          .toLowerCase()
          ?.includes(searchText.toLowerCase()) ||
        v.client_contactperson
          ?.toLowerCase()
          ?.includes(searchText.toLowerCase()) ||
        v.lead_email?.toLowerCase()?.includes(searchText.toLowerCase()) ||
        v.order_title?.toLowerCase()?.includes(searchText.toLowerCase()) ||
        v.order_invoicenumber
          ?.toLowerCase()
          ?.includes(searchText.toLowerCase()) ||
        v.user_name?.toLowerCase()?.includes(searchText.toLowerCase())
      );
    }
    return true;
  }, []);

  const onSearchByTextForwarded: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      setSearchForwardedText(e.target.value);
    }, []);
  const onSearchByTextMerge: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      setSearchMergeText(e.target.value);
    }, []);

  return (
    <div className="container-fluid">
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
          style={{ marginTop: "0.5rem", height: "46.5vh", overflowY: "scroll" }}
        >
          <Tabs
            id="forwarded-deals"
            activeKey={forwardedkey}
            //@ts-ignore
            onSelect={(fk) => setForwardedKey(fk)}
            className={styles.tab}
          >
            <Tab
              eventKey="forwarded"
              title={`Forwarded Deals (${forwardedfiltered.length})`}
            >
              <div className="row" style={{ marginBottom: "0.5rem" }}>
                <div className="col-lg-6"></div>
                <div className="col-lg-3">
                  <RangePicker
                    style={{ width: "100%" }}
                    size="large"
                    placeholder={["Start Date", "End Date"]}
                    onChange={onChangeForwardedDate}
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
                    placeholder="Search Forwarded Deals"
                    onChange={onSearchByTextForwarded}
                  />
                </div>
              </div>
              <Table
                className={styles.table}
                //@ts-ignore
                onRow={onRowItemClick}
                rowKey="order_token"
                //@ts-ignore
                columns={forwardedcolumns}
                dataSource={forwardedfiltered}
                pagination={{ position: ["bottomCenter"], pageSize: 30 }}
              />
            </Tab>
          </Tabs>
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
          style={{ marginTop: "0.5rem", height: "46.5vh", overflowY: "scroll" }}
        >
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            //@ts-ignore
            onSelect={(k) => setKey(k)}
            className={styles.tab}
          >
            <Tab eventKey="pick" title={`Picked Deals (${pDeals.length})`}>
              <div className="row" style={{ marginBottom: "0.5rem" }}>
                <div className="col-lg-3"></div>
                <div className="col-lg-3">
                  {selectedChecks.length > 1 ? (
                    <div
                      style={{
                        float: "right",
                        margin: "0px",
                      }}
                    >
                      <Button
                        style={{
                          borderRadius: "5px",
                          border: "none",
                        }}
                        onClick={MergeDeals}
                      >
                        Merge
                      </Button>
                    </div>
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
                    placeholder="Search Picked Deals"
                    // prefix={<SearchOutlined />}
                    onChange={(e) => setSearchPickText(e.target.value)}
                  />
                </div>
              </div>
              <Table
                className={styles.table}
                rowSelection={{
                  hideSelectAll: false,
                  selectedRowKeys: selectedChecks,
                  onChange: (selectedRowKeys, selectedRows) => {
                    //@ts-ignore
                    setSelectedChecks(selectedRowKeys || []);
                    setCheckboxRecord(selectedRows[0] || {});
                  },
                }}
                //@ts-ignore
                onRow={onRowItemClick}
                rowKey="order_token"
                columns={pickcolumns}
                dataSource={pDeals
                  .filter((v) => onFilter(v, searchPickText))
                  .filter((v) =>
                    //@ts-ignore
                    checkBoxRecord.lead_email
                      ? //@ts-ignore
                        v.lead_email === checkBoxRecord.lead_email
                      : true
                  )}
                pagination={{ position: ["bottomCenter"], pageSize: 30 }}
              />
            </Tab>
            <Tab
              eventKey="merge"
              title={`Merged Deals (${mergefiltered.length})`}
            >
              <div className="row" style={{ marginBottom: "0.5rem" }}>
                <div className="col-lg-6"></div>

                <div className="col-lg-3">
                  <RangePicker
                    style={{ width: "100%" }}
                    size="large"
                    placeholder={["Start Date", "End Date"]}
                    onChange={onChangeMergeDate}
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
                rowSelection={{
                  hideSelectAll: true,
                  selectedRowKeys: selectedChecks,
                  onChange: (selectedRowKeys, selectedRows) => {
                    //@ts-ignore
                    setSelectedChecks(selectedRowKeys || []);
                    setCheckboxRecord(selectedRows[0] || {});
                  },
                }}
                //@ts-ignore
                onRow={onMergeRowItemClick}
                rowKey="order_token"
                //@ts-ignore
                columns={mergecolumns}
                dataSource={mergefiltered}
                pagination={{ position: ["bottomCenter"], pageSize: 30 }}
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
            <h4 style={{ margin: "0rem" }}>
              Are you sure, you want to cancel this?
            </h4>
          </div>
          <form ref={formRef} onSubmit={onCancel}>
            <div className="row">
              <div className="col-lg-10">
                <Input
                  className={styles.inputfield}
                  type="floating"
                  title="Reason"
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
          minHeight: "5rem",
          maxHeight: "10rem",
          minWidth: "10rem",
          maxWidth: "40rem",
        }}
        show={mergeCancelModal}
        onBackdrop={() => setMergeCancelModal(false)}
      >
        <div className="container" style={{ margin: "auto" }}>
          <div>
            <h4 style={{ margin: "0rem" }}>
              Are you sure, you want to cancel this?
            </h4>
          </div>
          <form ref={formRef} onSubmit={onMergeCancel}>
            <div className="row">
              <div className="col-lg-10">
                <Input
                  className={styles.inputfield}
                  type="floating"
                  title="Reason"
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
          minHeight: "8rem",
          maxHeight: "15rem",
          minWidth: "10rem",
          maxWidth: "40rem",
          overflowY: "scroll",
        }}
        show={invoiceModal}
        onBackdrop={() => setInvoiceModal(false)}
      >
        <div className="container-fluid" style={{ marginTop: "2rem" }}>
          <div style={{ display: "flex" }}>
            <div className="col-lg-8">
              <h4 style={{ margin: "0rem" }}>PayPal Invoice Number</h4>
            </div>
            <div className="col-lg-4">
              {userBrand ? (
                <Dropdown
                  style={{
                    width: "100%",
                    height: "52px",
                  }}
                  placeholder="Select Brand"
                  defaultKey="brand_id"
                  options={userBrand}
                  name="brand_id"
                  type="primary"
                  className={styles.selectbrandoptioninusertable}
                  onItemClick={(brandID) => handlebrand(brandID)}
                  value={brandID.toString()}
                />
              ) : null}
            </div>
          </div>

          <form ref={formRef} onSubmit={onPickedInvoiceNo}>
            <div className="row">
              <div className="col-lg-7">
                <Input
                  className={styles.inputfield}
                  type="floating"
                  label="Invoice Number"
                  name="orderpayment_invoiceno"
                  required
                />
              </div>
              <div className="col-lg-3">
                {marchantOptions ? (
                  <div className={` mt-2 ${styles.selectbrandoptiondiv}`}>
                    {/* <label style={{color: 'var( --bs-body-color)',fontSize: '16px',fontWeight: '700',}}>Select Brand</label> */}
                    <Dropdown
                      defaultKey={JSON.stringify(merchants?.data?.merchant_id)}
                      placeholder="Select Merchant"
                      options={marchantOptions}
                      name="merchant_id"
                      type="primary"
                      style={{ marginTop: "0.7rem", width: "100%" }}
                    />
                  </div>
                ) : null}
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
          minHeight: "8rem",
          maxHeight: "15rem",
          minWidth: "10rem",
          maxWidth: "40rem",
          overflowY: "scroll",
        }}
        show={mergeInvoiceModal}
        onBackdrop={() => setMergeInvoiceModal(false)}
      >
        <div className="container-fluid" style={{ marginTop: "2rem" }}>
          <div>
            <h4 style={{ margin: "0rem" }}>PayPal Invoice Number</h4>
          </div>
          <form ref={formRef} onSubmit={onMergeInvoiceNo}>
            <div className="row">
              <div className="col-lg-7">
                <Input
                  className={styles.inputfield}
                  type="floating"
                  label="Invoice Number"
                  name="orderpayment_invoiceno"
                  required
                />
              </div>
              <div className="col-lg-3">
                {marchantOptions ? (
                  <div
                    className={`col-lg-6 mt-2 ${styles.selectbrandoptiondiv}`}
                  >
                    {/* <label style={{color: 'var( --bs-body-color)',fontSize: '16px',fontWeight: '700',}}>Select Brand</label> */}
                    <Dropdown
                      defaultKey={JSON.stringify(merchants?.data?.merchant_id)}
                      placeholder="Select Merchant"
                      options={marchantOptions}
                      name="merchant_id"
                      type="light"
                    />
                  </div>
                ) : null}
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

      <Modal
        style={{
          overflow: "hidden",
          minHeight: "470px",
          maxHeight: "630px",
        }}
        show={MergeDetailsModal}
        onBackdrop={() => setMergeDetailsModal(false)}
      >
        <PaymentDetail orderId={activeDealToken || 0} ordertype={"Merge"} />
      </Modal>
    </div>
  );
});

export default PaymentsBuckets;
