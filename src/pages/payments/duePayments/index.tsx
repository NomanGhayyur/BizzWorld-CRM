import moment from "moment";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Button,
  Modal,
  Table,
  Input,
  Highlighter,
  Icon,
  IModalRef,
  Dropdown,
  IDropdownItem,
} from "elements";
import Image from "next/image";
import { IUser } from "../../../model/user";
import { AppThunkDispatch, RootState } from "../../../redux/types";
import styles from "../../../styles/order.module.css";
import Card from "../../../components/shared/Card";
import {
  deletOrderDetail,
  getOrderList,
  getTotalAmount,
} from "../../../api/order";
import { IOrder, IOrderListItem } from "../../../model/order";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";
import { IRequestMeta } from "../../../model/app";
import { getUserBrandList } from "../../../api/user";
import {
  DATE_FORMAT,
  Pending,
  Cancel,
  Paid,
  Roles,
  Invoice_Sent,
} from "../../../constant/app";
import Loader from "../../../components/shared/Loader";
import useTotalAmount from "../../../hooks/useTotalAmount";
import toCancel from "../../../../public/icons/cancel.svg";
import InvoiceSent from "../../../../public/icons/invoicesent.svg";
import StatusHighlight from "../../../components/shared/StatusHighligh/StatusHighlight";
import { getPaymentList, updatePaymentStatus } from "../../../api/payment";
import { IPayment, IPaymentListItem } from "../../../model/payment";

type pageDetailsProps = {
  perPage: number | undefined;
  currentPage: string | number;
  total: number | undefined;
};
const colorObject: any = {
  Pending: "#FED7D7",
  Cancel: "#c5fab9",
  Paid: "#c5fab9",
  "Invoice Sent": "#CCEBF8",
};

type amountType = { [key in string]: number };

const DuePayments: NextPage = () => {
  const dispatch = useDispatch<AppThunkDispatch>();
  const [sortKeys, setSortKeys] =
    useState<{ [key in string]: "asc" | "desc" }>();
  const [filterText, setFilterText] = useState<string>("");
  const [appliedFilters, setFilters] =
    useState<{ [key in string]: string | number }>();
  const user = useSelector((store: RootState) => store.auth.user);
  const modalRef = useRef<IModalRef>(null);
  const router = useRouter();
  const [brandID, setbrandId] = useState<number | string>(user?.brand1 || 1);
  const [paymentstatus, setPaymentStatus] = useState<number | string>(1);
  const [totalamount, setTotalAmount] = useState<amountType>();
  const [page, setPage] = useState(1);
  const [pageDetails, setPageDetails] = useState<pageDetailsProps>();

  useEffect(() => {
    setPaymentStatus(paymentstatus);
  }, [paymentstatus]);

  const getList = async (pageId: string | number) => {
    const params = {
      data: {
        orderpaymentstatus_id: paymentstatus,
        page: pageId,
      },
    };
    const response = await dispatch(getPaymentList(params));
    if (pageId === 1) {
      setPageDetails({
        currentPage: response.data.current_page,
        perPage: response.data.per_page,
        total: response.data.total,
      });
    }
    return response.data.data;
  };
  const {
    data: payments,
    isFetching,
    isLoading,
    refetch,
  } = useQuery<Array<IPaymentListItem>>(
    [`DuePaymentList`, page],
    () => getList(page),
    {
      enabled: !!user?.user_id,
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (router.asPath.split("#")[1]) {
      modalRef.current?.showModal(true);
    } else {
      modalRef.current?.showModal(false);
    }
  }, [router]);

  const onRowItemClick = useCallback(
    (order: IOrder) => {
      router.push(`/order/${order.order_id}`);
    },
    [router]
  );

  const onInvoiceSent = useCallback(
    async (
      orderId: IPayment["orderpaymentstatus_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      try {
        const params = {
          data: {
            orderpayment_id: orderId,
            orderpaymentstatus_id: 8,
          },
        };
        await dispatch(updatePaymentStatus(params));
        refetch();
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, refetch]
  );

  const onCancel = useCallback(
    async (
      orderId: IPayment["orderpaymentstatus_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      try {
        const params = {
          data: {
            orderpayment_id: orderId,
            orderpaymentstatus_id: 4,
          },
        };
        await dispatch(updatePaymentStatus(params));
        refetch();
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, refetch]
  );

  const columns = useMemo(() => {
    const temp = [
      {
        label: "ID",
        keyIndex: "order_id",
        render: (v: any, _: any, index: any) => parseInt(`${index + 1}`),
      },
      {
        label: "Order Title",
        keyIndex: "order_title",
        render: (v: any) => (
          <span
            style={{
              wordBreak: "break-all",
            }}
          >
            <Highlighter text={`${v}`.trim()} searchText={filterText} />
          </span>
        ),

        sortIndex: "order_title",
      },
      {
        label: "Payment Title",
        keyIndex: "orderpayment_title",
        render: (v: any) => (
          <span
            style={{
              wordBreak: "break-all",
            }}
          >
            <Highlighter text={`${v}`.trim()} searchText={filterText} />
          </span>
        ),

        sortIndex: "order_title",
      },
      {
        label: "Amount",
        keyIndex: "orderpayment_amount",
        render: (v: any) => (
          <Highlighter text={`$${v}`.trim()} searchText={filterText} />
        ),
      },
      {
        label: "Created By",
        keyIndex: "user_name",
        render: (v: any) => (
          <Highlighter text={v || ""} searchText={filterText} />
        ),
      },
      {
        label: "Due Date",
        keyIndex: "orderpayment_duedate",
        render: (v: any) => moment(v).format(DATE_FORMAT),
      },
      {
        sortable: true,
        label: "Created At",
        keyIndex: "created_at",
        render: (v: any) => moment(v).format("DD-MMM-YYYY"),
      },
    ];
    if (
      user &&
      [Roles.SUPER_ADMIN, Roles.SALES_AGENT, Roles.SALES_Manager].includes(
        user?.role_id
      )
    ) {
      temp.push({
        label: "Actions",
        keyIndex: "orderpayment_id,orderpaymentstatus_name",
        render: (v: any) => (
          <>
            <span
              style={{
                marginLeft: "3px",
                marginRight: "3px",
              }}
              title="Forward To Billing"
              onClick={onInvoiceSent.bind(this, v.orderpayment_id)}
            >
              <Image src={InvoiceSent} alt="Alt" width={"25px"} />
            </span>
          </>
        ),
      });
    }
    return temp;
  }, [user, filterText, onInvoiceSent]);

  const onSearchByText: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      setFilterText(e.target.value);
    }, []);

  const onBackdrop = useCallback(() => {
    if (router.asPath.split("#")[1]) {
      router.replace({ pathname: router.pathname, query: router.query });
    }
  }, [router]);

  const onSuccessCreate = useCallback(() => {
    onBackdrop();
  }, [onBackdrop]);

  const filtered: Array<IPaymentListItem> = useMemo(() => {
    if (filterText) {
      return (
        payments?.filter((v: IPaymentListItem) => {
          return (
            v.order_title?.toLowerCase()?.includes(filterText.toLowerCase()) ||
            v.orderpayment_title
              ?.toLowerCase()
              ?.includes(filterText.toLowerCase())
          );
        }) || []
      );
    }
    return payments || [];
  }, [payments, filterText]);

  const rowClassGenerator = useCallback(
    (row: IUser) => (row.deleted_at ? "table__rowStrike" : ""),
    []
  );

  const onApplyFilters = useCallback(
    (filters: { [key in string]: string | number }) => {
      setFilters({
        contact_number: filters.contact_number,
        email: filters.email,
        first_name: filters.first_name,
        membership_status: filters.membership_status,
        role: filters.role,
        status: filters.status,
      });
    },
    []
  );

  const onRemoveFilter = useCallback((key: string) => {
    setFilters((filters) => {
      const f = Object.assign({}, filters);
      if (f) delete f[key];
      return f;
    });
  }, []);
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
    <Card
      className={styles.brandList__container}
      style={{
        border: "none",
        boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
        borderRadius: "5px",
      }}
    >
      <div className="row" style={{}}>
        <div className="col-lg-2">
          <h4 style={{ fontWeight: "bold", fontSize: "16px" }}>Due Payments</h4>
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
          <div className="col-3" style={{ marginRight: "40px" }}>
            <Input
              style={{ marginTop: "10px", marginLeft: "27px" }}
              placeholder="Search Orders"
              onChange={onSearchByText}
            />
          </div>
        </div>
      </div>

      <Table
        onSortData={(sortKey, direction) =>
          setSortKeys({ [sortKey as keyof IUser]: direction })
        }
        autoSort={false}
        loading={isLoading}
        onRowItemClick={onRowItemClick}
        data={filtered}
        rowClass={rowClassGenerator}
        columnHeadings={columns}
        onPageChange={(p) => setPage(p)}
        pageSize={pageDetails?.perPage}
        currentPage={page}
        total={pageDetails?.total}
      />
    </Card>
  );
};

export default DuePayments;
