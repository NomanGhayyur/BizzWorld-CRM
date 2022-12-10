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
  getGroupOrderList,
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
  APPROVED,
  CANCEL,
  DOING,
  DONE,
  HALT,
  Roles,
  SENT_TO_CLIENT,
  TODO,
} from "../../../constant/app";
import Loader from "../../../components/shared/Loader";
import useTotalAmount from "../../../hooks/useTotalAmount";
import Delete from "../../../../public/icons/delete.svg";
import Update from "../../../../public/icons/update.svg";
import StatusHighlight from "../../../components/shared/StatusHighligh/StatusHighlight";

type propTypes = {
  task?: Array<IOrder>;
  className?: string;
  style?: React.CSSProperties;
};

type pageDetailsProps = {
  perPage: number | undefined;
  currentPage: string | number;
  total: number | undefined;
};
const colorObject: any = {
  Complete: "#FED7D7",
  "Save By Sales": "#82d7fa",
  "Pick By Production": "#D0F1DD",
  "Forwarded To Production": "#FED7D7",
  Assigned: "#c5fab9",
  "Invoice Sent": "#CCEBF8",
};

type amountType = { [key in string]: number };
const OrdersList: NextPage = () => {
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
  const [totalamount, setTotalAmount] = useState<amountType>();
  const [page, setPage] = useState(1);
  const [pageDetails, setPageDetails] = useState<pageDetailsProps>();
  const [activeRowToken, setActiveRowToken] = useState<number | string>(0);
  const [orderModal, setOrderModal] = useState(false);

  const handlebrand = async (brandID: string) => {
    setbrandId(brandID);
  };
  const getList = async (id: string | number, pageId: string | number) => {
    const params = {
      data: {
        brand_id: id,
        page: pageId,
      },
    };
    const response = await dispatch(getOrderList(params));
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
    data: orders,
    isFetching,
    isLoading,
    refetch,
  } = useQuery<Array<IOrderListItem>>(
    [`AllOrderList_${brandID}`, brandID, page],
    () => getList(brandID, page),
    {
      enabled: !!brandID && !!user?.user_id,
      keepPreviousData: true,
    }
  );
  const getGroupList = async (order_token = activeRowToken) => {
    const params = {
      data: {
        order_token,
      },
    };
    const response = await dispatch(getGroupOrderList(params));
    return response.data;
  };

  const { data: groupOrders, refetch: refetchGroupLeads } = useQuery<
    Array<IOrderListItem>
  >([`GroupOrderList`, activeRowToken], () => getGroupList(), {
    enabled: !!user?.user_id,
    keepPreviousData: true,
  });
  useEffect(() => {
    if (router.asPath.split("#")[1]) {
      modalRef.current?.showModal(true);
    } else {
      modalRef.current?.showModal(false);
    }
  }, [router]);

  const onRowClick = useCallback(
    (order: IOrder) => {
      router.push(`/order/${order.order_id}`);
    },
    [router]
  );
  const onRowItemClick = (v: IOrderListItem) => {
    setActiveRowToken(v.order_token);
    setOrderModal(true);
  };
  const onDelete = useCallback(
    async (
      orderToken: IOrder["order_token"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      try {
        const params = {
          data: {
            order_token: orderToken,
          },
        };
        await dispatch(deletOrderDetail(params));
        refetch();
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, refetch]
  );

  const onUpdate = useCallback(
    async (
      orderId: IOrder["order_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();

      router.push(`/order/update/${orderId}`);
    },
    [router]
  );

  const onRestore = useCallback(
    async (
      orderId: IOrder["order_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
    },
    []
  );

  const onAmount = useCallback(
    async (
      orderToken: IOrder["order_token"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      try {
        const params = {
          data: {
            type: "Deal",
            order_token: orderToken,
          },
        };
        const response = await dispatch(getTotalAmount(params));
        setTotalAmount({
          ...totalamount,
          [orderToken]: response.totalamount,
        });
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, totalamount]
  );
  const onOrderAmount = useCallback(
    async (
      orderId: IOrder["order_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      try {
        const params = {
          data: {
            type: "order",
            order_id: orderId,
          },
        };
        const response = await dispatch(getTotalAmount(params));
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

  const columns = useMemo(() => {
    const temp = [
      {
        label: "ID",
        keyIndex: "order_id",
        render: (v: any, _: any, index: any) => parseInt(`${index + 1}`),
      },
      {
        label: "Title",
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
        label: "Status",
        keyIndex: "orderstatus_name",
        render: (v: any) => (
          <StatusHighlight bgColor={colorObject[v]}>
            <Highlighter text={`${v}`.trim()} searchText={filterText} />
          </StatusHighlight>
        ),
        sortIndex: "orderstatus_name",
      },
      {
        label: "Amount",
        keyIndex: "order_token,totalamount",
        render: (v: any) => {
          {
            if (totalamount) {
              if (totalamount[v.order_token]) {
                return (
                  <span style={{ marginLeft: "5px" }}>
                    <p style={{ marginBottom: "0px" }}>
                      ${totalamount[v.order_token]}
                    </p>
                  </span>
                );
              }
            }
            return (
              <>
                <span className="m-1 question">
                  <Icon
                    name="currency-dollar"
                    onClick={(e) => onAmount(v.order_token, e)}
                  />
                </span>
              </>
            );
          }
        },
      },
      {
        label: "Created By",
        keyIndex: "creator",
        render: (v: any) => (
          <Highlighter text={v || ""} searchText={filterText} />
        ),
      },

      {
        sortable: true,
        label: "Created At",
        keyIndex: "created_at",
        render: (v: any) => moment(v).format("DD-MMM-YYYY"),
      },
      {
        // sortable: true,
        label: "Deadline",
        keyIndex: "order_deadlinedate",
        render: (v: any) => moment(v).format(DATE_FORMAT),
      },
    ];
    if (user && [Roles.SUPER_ADMIN].includes(user?.role_id)) {
      temp.push({
        label: "Actions",
        keyIndex: "order_token",
        render: (v: any) => (
          <>
            <span
              style={{
                marginLeft: "3px",
                marginRight: "3px",
              }}
              title="Delete"
              onClick={onDelete.bind(this, v.order_token)}
            >
              <Image src={Delete} alt="Alt" width={"25px"} />
            </span>
          </>
        ),
      });
    }
    return temp;
  }, [user, filterText, totalamount, onAmount, onDelete]);

  const modalColumns = useMemo(() => {
    const temp = [
      {
        label: "ID",
        keyIndex: "order_id",
        render: (v: any, _: any, index: any) => parseInt(`${index + 1}`),
      },
      {
        label: "Title",
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
        label: "Status",
        keyIndex: "orderstatus_name",
        render: (v: any) => (
          <StatusHighlight bgColor={colorObject[v]}>
            <Highlighter text={`${v}`.trim()} searchText={filterText} />
          </StatusHighlight>
        ),
        sortIndex: "orderstatus_name",
      },
      {
        label: "Amount",
        keyIndex: "order_id,totalamount",
        render: (v: any) => {
          {
            if (totalamount) {
              if (totalamount[v.order_id]) {
                return (
                  <span style={{ marginLeft: "5px" }}>
                    <p style={{ marginBottom: "0px" }}>
                      ${totalamount[v.order_id]}
                    </p>
                  </span>
                );
              }
            }
            return (
              <>
                <span className="m-1 question">
                  <Icon
                    name="currency-dollar"
                    onClick={(e) => onOrderAmount(v.order_id, e)}
                  />
                </span>
              </>
            );
          }
        },
      },
      {
        label: "Created By",
        keyIndex: "creator",
        render: (v: any) => (
          <Highlighter text={v || ""} searchText={filterText} />
        ),
      },

      {
        sortable: true,
        label: "Created At",
        keyIndex: "created_at",
        render: (v: any) => moment(v).format("DD-MMM-YYYY"),
      },
      {
        // sortable: true,
        label: "Deadline",
        keyIndex: "order_deadlinedate",
        render: (v: any) => moment(v).format(DATE_FORMAT),
      },
    ];
    if (user && [Roles.SUPER_ADMIN].includes(user?.role_id)) {
      temp.push({
        label: "Actions",
        keyIndex: "order_id",
        render: (v: any) => (
          <>
            <span
              style={{
                marginLeft: "3px",
                marginRight: "3px",
              }}
              title="Edit"
              onClick={onUpdate.bind(this, v.order_id)}
            >
              <Image src={Update} alt="Alt" width={"25px"} />
            </span>
          </>
        ),
      });
    }
    return temp;
  }, [user, filterText, totalamount, onOrderAmount, onUpdate]);

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

  const filtered: Array<IOrderListItem> = useMemo(() => {
    if (filterText) {
      return (
        orders?.filter((v: IOrderListItem) => {
          return (
            v.order_title?.toLowerCase()?.includes(filterText.toLowerCase()) ||
            v.orderstatus_name
              ?.toLowerCase()
              ?.includes(filterText.toLowerCase())
          );
        }) || []
      );
    }
    return orders || [];
  }, [orders, filterText]);

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
    <>
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
            <h4 style={{ fontWeight: "bold", fontSize: "16px" }}>
              Orders List
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
            <div className="col-3" style={{ marginRight: "40px" }}>
              <Input
                style={{ marginTop: "10px", marginLeft: "27px" }}
                placeholder="Search Orders"
                onChange={onSearchByText}
              />
            </div>
            <div className="col-3" style={{ marginRight: "10px" }}>
              {userBrand ? (
                <Dropdown
                  className={styles.abcdedgropdown}
                  style={{ width: "100%", marginTop: "10px" }}
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
            {/* <div className={`text-right ${styles.brandtableiconsswitchdiv}`}>
            <Button
              iconName="plus"
              onClick={() => router.push('order/create')}
              style={{ marginTop: '10px' }}
            >
              Create Orders
            </Button>
          </div> */}
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
      <Modal
        style={{
          overflow: "scroll",
          minHeight: "470px",
          maxHeight: "630px",
          width: "50rem",
        }}
        show={orderModal}
        onBackdrop={() => setOrderModal(false)}
      >
        <div className="container">
          <div className="row mt-3">
            <div className="col-lg-12">
              <h4>Group List</h4>
            </div>
          </div>

          <div className="container">
            <div className="mt-3">
              <Table
                onSortData={(sortKey, direction) =>
                  setSortKeys({ [sortKey as keyof IUser]: direction })
                }
                autoSort={false}
                loading={isLoading}
                onRowItemClick={onRowClick}
                //@ts-ignore
                data={groupOrders}
                rowClass={rowClassGenerator}
                columnHeadings={modalColumns}
                pageSize={pageDetails?.perPage}
                currentPage={page}
                total={pageDetails?.total}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default OrdersList;
