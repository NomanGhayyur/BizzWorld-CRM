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
import CreateUser from "../../user/CreateUser";
import FilterUserList from "../../user/FilterUserList/FilterUserList";
import { IUser } from "../../../model/user";
import { AppThunkDispatch, RootState } from "../../../redux/types";
import styles from "../../../styles/order.module.css";
import Card from "../../shared/Card";
import {
  deletOrderDetail,
  getOrderList,
  getOrderDetail,
  getTotalAmount,
  getPickedOrderList,
} from "../../../api/order";
// import { IOrderListItem } from '../../../model/order';
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";
import { DATE_FORMAT, Roles } from "../../../constant/app";
import { IRequestMeta } from "../../../model/app";
// import Ordercreate from './create';
import { getUserBrandList } from "../../../api/user";
import Loader from "../../shared/Loader";
import { unpickOrder, updateOrderStatus } from "../../../api/pick";
import { getOrderWiseTaskList } from "../../../api/task";
import { ITask } from "../../../model/task";

const OrderWiseTaskList = (orderId: { orderId?: string | number }) => {
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
  const [orderID, setOrderId] = useState<number | string>(user?.brand1 || 1);
  // const [orderstatus, setOrderStatus] = useState<number | string>(3);
  // useEffect(() => {
  //   setOrderStatus(orderstatus);
  // }, [orderstatus]);

  const {
    data: tasks,
    isFetching,
    isLoading,
    refetch,
  } = useQuery<Array<ITask>>(
    `OrderWiseTaskList`,
    async () => {
      const params = {
        data: {
          order_token: orderId,
        },
      };
      const response = await dispatch(getOrderWiseTaskList(params));
      refetch();
      return response.data.data;
    },
    {
      enabled: !!user?.user_id,
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
    (task: ITask) => {
      router.push(`/tasks/${task.task_id}`);
    },
    [router]
  );

  // const onUnpick = useCallback(
  //   async (
  //     orderId: ITask['order_id'],
  //     event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  //   ) => {
  //     event.stopPropagation();
  //     try {
  //       const params = {
  //         data: {
  //           order_id: orderId,
  //         },
  //       };
  //       await dispatch(unpickOrder(params));
  //       refetch();
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   },
  //   [dispatch, refetch]
  // );

  // const onCancel = useCallback(
  //   async (
  //     orderId: ITask['order_id'],
  //     event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  //   ) => {
  //     event.stopPropagation();
  //     try {
  //       const params = {
  //         data: {
  //           order_id: orderId,
  //           orderstatus_id: 6,
  //         },
  //       };
  //       await dispatch(updateOrderStatus(params));
  //       refetch();
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   },
  //   [dispatch, refetch]
  // );
  // const onHault = useCallback(
  //   async (
  //     orderId: ITask['order_id'],
  //     event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  //   ) => {
  //     event.stopPropagation();
  //     try {
  //       const params = {
  //         data: {
  //           order_id: orderId,
  //           orderstatus_id: 7,
  //         },
  //       };
  //       await dispatch(updateOrderStatus(params));
  //       refetch();
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   },
  //   [dispatch, refetch]
  // );

  // const onEdit = useCallback(
  //   async (
  //     orderId: ITask['order_id'],
  //     event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  //   ) => {
  //     event.stopPropagation();

  //     router.push(`/order/update/${orderId}`);
  //   },
  //   [router]
  // );

  // const onRestore = useCallback(
  //   async (
  //     orderId: ITask['order_id'],
  //     event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  //   ) => {
  //     event.stopPropagation();
  //   },
  //   []
  // );

  // const onAmount = useCallback(
  //   async (
  //     orderId: ITask['order_id'],
  //     event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  //   ) => {
  //     event.stopPropagation();
  //     try {
  //       const params = {
  //         data: {
  //           order_id: orderId,
  //         },
  //       };
  //       await dispatch(getTotalAmount(params));
  //       refetch();
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   },
  //   [dispatch, refetch]
  // );

  const columns = useMemo(() => {
    const temp = [
      {
        label: "ID",
        keyIndex: "task_id",
        render: (v: any, _: any, index: any) => parseInt(`${index + 1}`),
      },
      {
        label: "Title",
        keyIndex: "task_title",
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterText} />
        ),

        sortIndex: "task_title",
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
        label: "Deadline",
        keyIndex: "order_deadlinedate",
        render: (v: any) => moment(v).format(DATE_FORMAT),
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

  const filtered: Array<ITask> = useMemo(() => {
    if (filterText && tasks?.length) {
      return (
        tasks?.filter((v) => {
          return v.task_title
            ?.toLowerCase()
            ?.includes(filterText.toLowerCase());
        }) || []
      );
    }
    return tasks || [];
  }, [tasks, filterText]);

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
  // const { data: brands } = useQuery(
  //   `List`,
  //   async () => {
  //     const response = await dispatch(getUserBrandList());
  //     return response.data;
  //   },
  //   {
  //     // enabled: !!user?.user_id,
  //   }
  // );
  // const userBrand = useMemo(() => {
  //   return brands?.reduce(
  //     (
  //       result: { [x: string]: { label: any } },
  //       brands: { brand_id: string | number; brand_name: any }
  //     ) => {
  //       result[brands.brand_id] = {
  //         label: brands.brand_name,
  //       };
  //       return result;
  //     },
  //     {} as { [key in string]: IDropdownItem }
  //   );
  // }, [brands]);

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
    <Card className={styles.brandList__container}>
      <div className="row" style={{}}>
        <div className="col-lg-2">
          <h4 style={{ fontWeight: "bold", fontSize: "16px" }}>Task List</h4>
        </div>
        <div className="col-lg-1"> </div>
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
        onPageChange={(p) => console.log(p)}
        data={filtered}
        rowClass={rowClassGenerator}
        pageSize={meta?.per_page}
        total={meta?.total}
        currentPage={meta?.current_page}
        columnHeadings={columns}
      />
    </Card>
  );
};

export default OrderWiseTaskList;
