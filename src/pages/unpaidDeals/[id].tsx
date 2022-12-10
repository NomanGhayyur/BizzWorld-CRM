import {
  Table,
  Highlighter,
  IModalRef,
  Icon,
  Input,
  IDropdownItem,
  Modal,
  Card,
} from "elements";
import { NextPage } from "next";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./billing.module.css";

import { useDispatch, useSelector } from "react-redux";
import { AppThunkDispatch, RootState } from "../../redux/types";
import moment from "moment";
import { useQuery } from "react-query";
import { deleteLead, getforwardedLeadList } from "../../api/lead";
import { IOrder, IOrderListItem } from "../../model/order";
import Image from "next/image";
import { useRouter } from "next/router";
import { getUserBrandList } from "../../api/user";
import {
  cancellead,
  getPickedLeadList,
  pickLead,
  unpicklead,
} from "../../api/pick";
import { Roles } from "../../constant/app";
import Loader from "../../components/shared/Loader";
import LeadDetail from "../lead/leadDetails/leadDetails";
import Pick from "../../../../public/icons/pick.svg";
import Delete from "../../../public/icons/delete.svg";
import Update from "../../../public/icons/update.svg";
import Unpick from "../../../public/icons/unpick.svg";
import InvoiceSent from "../../../public/icons/invoicesent.svg";
import Cancel from "../../../public/icons/cancel.svg";
import {
  getPaymentDetails,
  getPickedPayments,
  pickPayment,
  unpickPayment,
} from "../../api/payment";
import Invoice from "../order/orderInvoice/[id]";
import { getOrderDetail } from "../../api/order";
import ReactDOMServer from "react-dom/server";

type propTypes = {
  orderId: string | number;
  ordertype: string;
  className?: string;
  style?: React.CSSProperties;
};

type pageDetailsProps = {
  perPage: number | undefined;
  currentPage: string | number;
  total: number | undefined;
};

// const Payments = ({ style, graphdata, path }: ComponentProps) => {

const PaymentDetail = React.memo<propTypes>(({ orderId, ordertype }) => {
  const getList = async (
    pageId: string | number,
    orderId: string | number,
    ordertype: string
  ) => {
    const params = {
      data: {
        order_id: orderId,
        order_type: ordertype,
        page: pageId,
      },
    };
    const response = await dispatch(getPaymentDetails(params));
    if (pageId === 1) {
      setPageDetails({
        currentPage: response.data.current_page,
        perPage: response.data.per_page,
        total: response.data.total,
      });
    }
    return response.data;
  };

  const dispatch = useDispatch<AppThunkDispatch>();
  const [sortKeys, setSortKeys] =
    useState<{ [key in string]: "asc" | "desc" }>();
  const [filterText, setFilterText] = useState<string>("");
  const [filterforwardedText, setFilterForwardedText] = useState<string>("");

  const user = useSelector((store: RootState) => store.auth.user);
  const modalRef = useRef<IModalRef>(null);
  const router = useRouter();
  const [acvtivePaymentId, setActivePaymentId] = useState(0);
  const [acvtivePaymenttypeId, setActivePaymenttypeId] = useState(0);

  const [paymentDetailsModal, setPaymentDetailsModal] = useState(false);
  // const [leadstatus, setleadStatus] = useState<number | string>(2);
  const [brandID, setbrandId] = useState<number | string>(user?.brand1 || 1);

  const current = new Date();
  const date = `${current.getDate()}/${
    current.getMonth() + 1
  }/${current.getFullYear()}`;
  const [from, setFrom] = useState<number | string>(date);
  const [to, setTo] = useState<number | string>(date);

  const [page, setPage] = useState(1);
  const [pageDetails, setPageDetails] = useState<pageDetailsProps>();

  const [pickpage, setPickPage] = useState(1);

  const {
    data: paymentdetail,
    isError,
    error,
    data,
    isLoading,
    isPreviousData,
    refetch,
  } = useQuery<Array<IOrderListItem>>(
    [`PaymentsDetails_${orderId}`, page],
    () => getList(page, orderId, ordertype),
    {
      enabled: !!user?.user_id,
    }
  );

  // const refetchBothList = useCallback(async () => {
  //   await refetchForwardedLeads();
  // }, [refetchForwardedLeads]);

  useEffect(() => {
    if (router.asPath.split("#")[1]) {
      modalRef.current?.showModal(true);
    } else {
      modalRef.current?.showModal(false);
    }
  }, [router]);

  const onRowItemClick = (v: IOrder) => {
    setActivePaymentId(v.order_id);
    //@ts-ignore
    setActivePaymenttypeId(v.order_type);
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
        refetch();
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, refetch]
  );

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
        refetch();
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, refetch]
  );
  const onCancel = useCallback(
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
        refetch();
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, refetch]
  );

  // const onInvoiceSent = useCallback(
  //   async (
  //     orderpaymentId: IOrder['order_id'],
  //     event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  //   ) => {
  //     event.stopPropagation();
  //     try {
  //       const params = {
  //         data: {
  //           order_id: orderpaymentId,
  //         },
  //       };
  //       await dispatch(unpickPayment(params));
  //       refetchBothList();
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   },
  //   [dispatch, refetchBothList]
  // );

  const forwardedcolumns = useMemo(() => {
    const temp = [
      {
        label: "ID",
        keyIndex: "order_id",
        render: (v: any, _: any, index: any) => parseInt(`${index + 1}`),
      },

      {
        label: "Refr. No.",
        keyIndex: "order_token",
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
            {/* {user &&
            [Roles.SUPER_ADMIN, Roles.SALES_AGENT, Roles.Billing].includes(
              user?.role_id
            ) ? (
              <span
                title="Unpick"
                style={{
                  marginLeft: '3px',
                  marginRight: '3px',
                }}
                onClick={onUnpick.bind(this, v.order_id)}
              >
                <Image src={Unpick} alt="Alt" width={'25px'} />
              </span>
            ) : null} */}

            <span
              style={{
                marginLeft: "3px",
                marginRight: "3px",
              }}
              title="Cancel"
              onClick={onCancel.bind(this, v.order_id)}
            >
              <Image src={Cancel} alt="Alt" width={"25px"} />
            </span>
          </>
        ),
      });
    }
    return temp;
  }, [user, filterforwardedText, onCancel]);

  const onSearchByTextForwarded: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      setFilterForwardedText(e.target.value);
    }, []);

  const filtered: Array<IOrderListItem> = useMemo(() => {
    if (filterforwardedText) {
      return (
        paymentdetail?.filter((v: IOrderListItem) => {
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
    return paymentdetail || [];
  }, [paymentdetail, filterforwardedText]);

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
      <div className="">
        <Card
          style={{
            margin: "1rem",
          }}
        >
          <div className="container">
            <div className="row">
              <div className="col-lg-2">
                <h4 style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Picked Payments
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
              data={filtered}
              columnHeadings={forwardedcolumns}
              onPageChange={(p) => setPage(p)}
              pageSize={pageDetails?.perPage}
              currentPage={page}
              total={pageDetails?.total}
              style={{
                maxHeight: "48vh",
                overflowY: "scroll",
                marginTop: "0.5%",
              }}
            />
          </div>
        </Card>
      </div>
    </>
  );
});
export default PaymentDetail;
