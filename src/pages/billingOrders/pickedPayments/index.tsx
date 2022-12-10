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
import { AppThunkDispatch, RootState } from "../../../redux/types";
import moment from "moment";
import { useQuery } from "react-query";
import { deleteLead, getforwardedLeadList } from "../../../api/lead";
import { IOrder, IOrderListItem } from "../../../model/order";
import Image from "next/image";
import { useRouter } from "next/router";
import { getUserBrandList } from "../../../api/user";
import {
  cancellead,
  getPickedLeadList,
  pickLead,
  unpicklead,
} from "../../../api/pick";
import { Roles } from "../../../constant/app";
import Loader from "../../../components/shared/Loader";
import LeadDetail from "../../lead/leadDetails/leadDetails";
import Pick from "../../../../public/icons/pick.svg";
import Delete from "../../../../public/icons/delete.svg";
import Update from "../../../../public/icons/update.svg";
import Unpick from "../../../../public/icons/unpick.svg";
import InvoiceSent from "../../../../public/icons/invoicesent.svg";
import Cancel from "../../../../public/icons/cancel.svg";
import {
  getPaymentDetails,
  getPickedPayments,
  pickPayment,
  unpickPayment,
} from "../../../api/payment";
import Invoice from "../../order/orderInvoice/[id]";
import { getOrderDetail } from "../../../api/order";
import ReactDOMServer from "react-dom/server";
import PaymentDetail from "../[id]";
import { IApiParam } from "../../../helper/api";

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

const PickedPayments = React.memo<propTypes>((props) => {
  const dispatch = useDispatch<AppThunkDispatch>();
  const [sortKeys, setSortKeys] =
    useState<{ [key in string]: "asc" | "desc" }>();
  const [filterText, setFilterText] = useState<string>("");
  const [filterPickedText, setFilterPickedText] = useState<string>("");

  const user = useSelector((store: RootState) => store.auth.user);
  const modalRef = useRef<IModalRef>(null);
  const router = useRouter();
  const [acvtivePaymentId, setActivePaymentId] = useState(0);
  const [acvtivePaymentLeadEmail, setActivePaymentLeadEmail] = useState("");
  const [acvtivePaymentLeadName, setActivePaymentLeadName] = useState("");

  // console.log(acvtivePaymentLead, 'acvtivePaymentLead');

  const [paymentDetailsModal, setPaymentDetailsModal] = useState(false);
  // const [leadstatus, setleadStatus] = useState<number | string>(2);
  const [brandID, setbrandId] = useState<number | string>(user?.brand1 || 1);

  const current = new Date();
  const date = `${current.getDate()}/${
    current.getMonth() + 1
  }/${current.getFullYear()}`;
  const [from, setFrom] = useState<number | string>(date);
  const [to, setTo] = useState<number | string>(date);

  const [checked, setChecked] = useState();
  console.log(checked, "checked");

  const [pickpageDetails, setPickPageDetails] =
    useState<pickpageDetailsProps>();

  const [pickpage, setPickPage] = useState(1);

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
    isLoading,
    isPreviousData,
    refetch: refetchForwardedLeads,
  } = useQuery<Array<IOrderListItem>>(
    [`PickedPayments_${from}`, to, pickpage],
    () => getPickedList(pickpage, from, to),
    {
      enabled: !!user?.user_id,
    }
  );

  const refetchBothList = useCallback(async () => {
    await refetchForwardedLeads();
  }, [refetchForwardedLeads]);

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

  const onInvoiceSent = useCallback(
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
            //@ts-ignore
            <Invoice
              orders={orders.data}
              leademail={acvtivePaymentLeadEmail}
              leadname={acvtivePaymentLeadName}
            />
          )}`
        );
      } catch (e) {
        console.error(e);
      }
    },
    [acvtivePaymentLeadEmail, acvtivePaymentLeadName, dispatch]
  );
  // const onInvoiceSent = useCallback(async (v) => {
  //   const orders = await getPaymentDetails(v.order_id);
  //   const newWindow = window.open();
  //   newWindow.document.write(
  //     `<!DOCTYPE>${ReactDOMServer.renderToString(<Invoice orders={orders} />)}`
  //   );
  // }, []);

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
        refetchBothList();
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, refetchBothList]
  );

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
              onClick={onCancel.bind(this, v.order_id)}
            >
              <Image src={Cancel} alt="Alt" width={"25px"} />
            </span>

            <span
              style={{
                marginLeft: "3px",
                marginRight: "3px",
              }}
              title="Invoice Sent"
              onClick={onInvoiceSent.bind(
                this,
                v.order_id,
                v.lead_name,
                v.lead_email,
                v.order_token
              )}
            >
              <Image src={InvoiceSent} alt="Alt" width={"25px"} />
            </span>
          </>
        ),
      });
    }
    return temp;
  }, [user, filterPickedText, onUnpick, onCancel, onInvoiceSent]);

  const onSearchByTextPicked: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      setFilterPickedText(e.target.value);
    }, []);

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
                    placeholder="Search Picked Payment"
                    onChange={onSearchByTextPicked}
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

export default PickedPayments;
