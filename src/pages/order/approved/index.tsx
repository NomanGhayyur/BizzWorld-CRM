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
import CreateUser from "../../../components/user/CreateUser";
import FilterUserList from "../../../components/user/FilterUserList/FilterUserList";
import { IUser } from "../../../model/user";
import { AppThunkDispatch, RootState } from "../../../redux/types";
import styles from "../../../styles/order.module.css";
import Card from "../../../components/shared/Card";
import {
  deletOrderDetail,
  getOrderList,
  getOrderDetail,
  getTotalAmount,
  getPickedOrderList,
  getGroupOrderList,
} from "../../../api/order";
import { IOrder, IOrderListItem } from "../../../model/order";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";
import { DATE_FORMAT, Roles } from "../../../constant/app";
import { IRequestMeta } from "../../../model/app";
// import Ordercreate from './create';
import { getUserBrandList } from "../../../api/user";
import Loader from "../../../components/shared/Loader";
import { unpickOrder, updateOrderStatus } from "../../../api/pick";

type pageDetailsProps = {
  perPage: number | undefined;
  currentPage: string | number;
  total: number | undefined;
};

const Approved: NextPage = () => {
  const dispatch = useDispatch<AppThunkDispatch>();
  const [sortKeys, setSortKeys] =
    useState<{ [key in string]: "asc" | "desc" }>();
  const [filterText, setFilterText] = useState<string>("");
  const [appliedFilters, setFilters] =
    useState<{ [key in string]: string | number }>();
  const [borderView, setBorderView] = useState<boolean>(false);
  const [meta, setMeta] = useState<IRequestMeta>();
  const user = useSelector((store: RootState) => store.auth.user);
  const modalRef = useRef<IModalRef>(null);
  const router = useRouter();
  const [brandID, setbrandId] = useState<number | string>(user?.brand1 || 1);
  const [orderstatus, setOrderStatus] = useState<number | string>(11);
  const [page, setPage] = useState(1);
  const [pageDetails, setPageDetails] = useState<pageDetailsProps>();
  const [activeRowToken, setActiveRowToken] = useState<number | string>(0);
  const [orderModal, setOrderModal] = useState(false);

  useEffect(() => {
    setOrderStatus(orderstatus);
  }, [orderstatus]);

  const getList = async (id: string | number, pageId: string | number) => {
    const params = {
      data: {
        orderstatus_id: orderstatus,
        page: pageId,
      },
    };
    const response = await dispatch(getPickedOrderList(params));
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
    [`ApprovedList`, page],
    () => getList(page, ""),
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
  const onEditbyClient = useCallback(
    async (
      orderId: IOrder["order_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      try {
        const params = {
          data: {
            order_id: orderId,
            orderstatus_id: 9,
          },
        };
        await dispatch(updateOrderStatus(params));
        refetch();
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, refetch]
  );

  const onDelete = useCallback(
    async (
      orderId: IOrder["order_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      try {
        const params = {
          data: {
            order_id: orderId,
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

  const onEdit = useCallback(
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
      orderId: IOrder["order_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      try {
        const params = {
          data: {
            order_id: orderId,
          },
        };
        await dispatch(getTotalAmount(params));
        refetch();
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, refetch]
  );

  const onCancel = useCallback(
    async (
      orderId: IOrder["order_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      try {
        const params = {
          data: {
            order_id: orderId,
            orderstatus_id: 6,
          },
        };
        await dispatch(updateOrderStatus(params));
        refetch();
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, refetch]
  );
  const onApproved = useCallback(
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
        label: "Title",
        keyIndex: "order_title",
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterText} />
        ),

        sortIndex: "order_title",
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
    ];
    return temp;
  }, [filterText]);

  const onSearchByText: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      setFilterText(e.target.value);
      // window.clearTimeout(inputDebounce.current)
      // inputDebounce.current = window.setTimeout(() => {
      //     setFilters(f => ({
      //         ...f,
      //         last_name: Contains(e.target.value),
      //         email: Contains(e.target.value),
      //         first_name: Contains(e.target.value),
      //         contact_number: Contains(e.target.value),
      //     }))
      // }, 1000)
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
            <h4 style={{ fontWeight: "bold", fontSize: "16px" }}>Approved</h4>
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
            <div className="col-3">
              <Input
                style={{ marginTop: "10px" }}
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
                columnHeadings={columns}
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

export default Approved;
