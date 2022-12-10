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
import { Modal, Table, Input, Highlighter, Icon, IModalRef } from "elements";
import { IUser } from "../../../model/user";
import { AppThunkDispatch, RootState } from "../../../redux/types";
import styles from "../../../styles/order.module.css";
import Card from "../../../components/shared/Card";
import {
  deletOrderDetail,
  getTotalAmount,
  getPickedOrderList,
  getTotalTask,
  getGroupOrderList,
} from "../../../api/order";
import { IOrder, IOrderListItem } from "../../../model/order";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";
import { DATE_FORMAT, Roles } from "../../../constant/app";
// import Ordercreate from './create';
import Image from "next/image";
import Loader from "../../../components/shared/Loader";
import { updateOrderStatus } from "../../../api/pick";
import OrderWiseTaskList from "../../../components/tasks/orderwisetasklist/OrderWiseTaskList";
import Hault from "../../../../public/icons/hault.svg";
import Complete from "../../../../public/icons/complete.svg";
import Cancel from "../../../../public/icons/cancel.svg";
import List from "../../../../public/icons/list.svg";

type pageDetailsProps = {
  perPage: number | undefined;
  currentPage: string | number;
  total: number | undefined;
};

type amountType = { [key in string]: number };
type taskType = { [key in string]: number };

const AssignedOrder: NextPage = () => {
  const dispatch = useDispatch<AppThunkDispatch>();
  const [sortKeys, setSortKeys] =
    useState<{ [key in string]: "asc" | "desc" }>();
  const [filterText, setFilterText] = useState<string>("");
  const user = useSelector((store: RootState) => store.auth.user);
  const modalRef = useRef<IModalRef>(null);
  const router = useRouter();
  const [orderstatus, setOrderStatus] = useState<number | string>(4);
  const [orderID, setOrderId] = useState<number | string>(0);
  const [totalamount, setTotalAmount] = useState<amountType>();
  const [totaltask, setTotalTask] = useState<taskType>();
  const [completetask, setCompleteTask] = useState<taskType>();
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
        brand_id: id,
        page: pageId,
        orderstatus_id: orderstatus,
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
    refetch,
    isLoading,
  } = useQuery<Array<IOrderListItem>>(
    [`PickOrderList`, page],
    () => getList(page, ""),
    {
      enabled: !!user?.user_id,
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
  const onShowTask = useCallback(
    async (
      orderToken: IOrder["order_token"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      setOrderId(orderToken);
      modalRef.current?.showModal(true);
    },
    []
  );
  const onOrderShowTask = useCallback(
    async (
      orderId: IOrder["order_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      setOrderId(orderId);
      modalRef.current?.showModal(true);
    },
    []
  );

  const onProgress = useCallback(
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
        const response = await dispatch(getTotalTask(params));
        setTotalTask({
          ...totaltask,
          [orderToken]: response.totaltask,
        });
        setCompleteTask({
          ...completetask,
          [orderToken]: response.completetask,
        });
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, totaltask, completetask]
  );
  const onOrderProgress = useCallback(
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
        const response = await dispatch(getTotalTask(params));
        setTotalTask({
          ...totaltask,
          [orderId]: response.totaltask,
        });
        setCompleteTask({
          ...completetask,
          [orderId]: response.completetask,
        });
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, totaltask, completetask]
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

  const onHault = useCallback(
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
            orderstatus_id: 7,
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
  const onOrderHault = useCallback(
    async (
      orderId: IOrder["order_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      try {
        const params = {
          data: {
            trype: "Order",
            order_id: orderId,
            orderstatus_id: 7,
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

  const onComplete = useCallback(
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
            orderstatus_id: 5,
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
  const onOrderComplete = useCallback(
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
            orderstatus_id: 5,
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

  const onCancel = useCallback(
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
  const onOrderCancel = useCallback(
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
        label: "Amount",
        keyIndex: "order_token,totalamount",
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
        label: "Progress",
        keyIndex: "order_token,totaltask,completetask",
        render: (v: any) => {
          {
            if (totaltask && completetask) {
              if (
                totaltask[v.order_token] &&
                completetask[v.order_token] > -1
              ) {
                return (
                  <div className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      aria-valuenow={completetask[v.order_token]}
                      aria-valuemin={0}
                      aria-valuemax={totaltask[v.order_token]}
                      style={{ width: totaltask[v.order_token] }}
                    ></div>
                  </div>
                );
              }
            }
            return (
              <>
                {!v.totaltask && !v.completetask ? (
                  <span className="m-1 question">
                    <Icon
                      name="list-task"
                      onClick={(e) => onProgress(v.order_token, e)}
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
    if (
      user &&
      [
        Roles.SUPER_ADMIN,
        Roles.PRODUCTION_HEAD,
        Roles.SALES_AGENT,
        Roles.SALES_Manager,
      ].includes(user?.role_id)
    ) {
      temp.push({
        label: "Actions",
        keyIndex: "order_token,deleted_at",
        render: (v: any) => (
          <>
            <span
              style={{
                marginLeft: "3px",
                marginRight: "3px",
              }}
              title="Show Task"
              onClick={onShowTask.bind(this, v.order_token)}
            >
              <Image src={List} alt="Alt" width={"25px"} />
            </span>
            {user &&
            [
              Roles.SUPER_ADMIN,
              Roles.SALES_AGENT,
              Roles.SALES_Manager,
            ].includes(user?.role_id) ? (
              <span
                style={{
                  marginLeft: "3px",
                  marginRight: "3px",
                }}
                title="Hault"
                onClick={onHault.bind(this, v.order_token)}
              >
                <Image src={Hault} alt="Alt" width={"25px"} />
              </span>
            ) : null}
            <span
              style={{
                marginLeft: "3px",
                marginRight: "3px",
              }}
              title="Complete"
              onClick={onComplete.bind(this, v.order_token)}
            >
              <Image src={Complete} alt="Alt" width={"25px"} />
            </span>
            {user &&
            [
              Roles.SUPER_ADMIN,
              Roles.SALES_AGENT,
              Roles.SALES_Manager,
            ].includes(user?.role_id) ? (
              <>
                <span
                  style={{
                    marginLeft: "3px",
                    marginRight: "3px",
                  }}
                  title="Cancel"
                  onClick={onCancel.bind(this, v.order_token)}
                >
                  <Image src={Cancel} alt="Alt" width={"25px"} />
                </span>
              </>
            ) : null}
          </>
        ),
      });
    }
    return temp;
  }, [
    user,
    filterText,
    totalamount,
    onAmount,
    totaltask,
    completetask,
    onProgress,
    onShowTask,
    onHault,
    onComplete,
    onCancel,
  ]);

  const ModalColumns = useMemo(() => {
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
        label: "Amount",
        keyIndex: "order_id,totalamount",
        render: (v: any) => {
          {
            if (totalamount) {
              if (totalamount[v.order_id]) {
                return (
                  <span>
                    <p style={{ marginBottom: "0px" }}>
                      ${totalamount[v.order_id]}
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
                      onClick={(e) => onOrderAmount(v.order_id, e)}
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
        label: "Progress",
        keyIndex: "order_id,totaltask,completetask",
        render: (v: any) => {
          {
            if (totaltask && completetask) {
              if (totaltask[v.order_id] && completetask[v.order_id] > -1) {
                return (
                  <div className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      aria-valuenow={completetask[v.order_id]}
                      aria-valuemin={0}
                      aria-valuemax={totaltask[v.order_id]}
                      style={{ width: totaltask[v.order_id] }}
                    ></div>
                  </div>
                );
              }
            }
            return (
              <>
                {!v.totaltask && !v.completetask ? (
                  <span className="m-1 question">
                    <Icon
                      name="list-task"
                      onClick={(e) => onOrderProgress(v.order_id, e)}
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
    if (
      user &&
      [
        Roles.SUPER_ADMIN,
        Roles.PRODUCTION_HEAD,
        Roles.SALES_AGENT,
        Roles.SALES_Manager,
      ].includes(user?.role_id)
    ) {
      temp.push({
        label: "Actions",
        keyIndex: "order_id,deleted_at",
        render: (v: any) => (
          <>
            <span
              style={{
                marginLeft: "3px",
                marginRight: "3px",
              }}
              title="Show Task"
              onClick={onOrderShowTask.bind(this, v.order_id)}
            >
              <Image src={List} alt="Alt" width={"25px"} />
            </span>
            {user &&
            [
              Roles.SUPER_ADMIN,
              Roles.SALES_Manager,
              Roles.SALES_AGENT,
            ].includes(user?.role_id) ? (
              <span
                style={{
                  marginLeft: "3px",
                  marginRight: "3px",
                }}
                title="Hault"
                onClick={onOrderHault.bind(this, v.order_id)}
              >
                <Image src={Hault} alt="Alt" width={"25px"} />
              </span>
            ) : null}

            {user &&
            [
              Roles.SUPER_ADMIN,
              Roles.PRODUCTION_HEAD,
              Roles.SALES_AGENT,
            ].includes(user?.role_id) ? (
              <>
                <span
                  style={{
                    marginLeft: "3px",
                    marginRight: "3px",
                  }}
                  title="Complete"
                  onClick={onOrderComplete.bind(this, v.order_id)}
                >
                  <Image src={Complete} alt="Alt" width={"25px"} />
                </span>
                <span
                  style={{
                    marginLeft: "3px",
                    marginRight: "3px",
                  }}
                  title="Cancel"
                  onClick={onOrderCancel.bind(this, v.order_id)}
                >
                  <Image src={Cancel} alt="Alt" width={"25px"} />
                </span>
              </>
            ) : null}
          </>
        ),
      });
    }
    return temp;
  }, [
    user,
    filterText,
    totalamount,
    onOrderAmount,
    totaltask,
    completetask,
    onOrderProgress,
    onOrderShowTask,
    onOrderHault,
    onOrderComplete,
    onOrderCancel,
  ]);

  const onSearchByText: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      setFilterText(e.target.value);
    }, []);

  const onBackdrop = useCallback(() => {
    if (router.asPath.split("#")[1]) {
      router.replace({ pathname: router.pathname, query: router.query });
    }
  }, [router]);

  const onSuccessShow = useCallback(() => {
    onBackdrop();
  }, [onBackdrop]);

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
          <h4 style={{ fontWeight: "bold", fontSize: "16px" }}>
            Assigned Orders List
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
        pageSize={pageDetails?.perPage}
        currentPage={page}
        total={pageDetails?.total}
      />

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
                columnHeadings={ModalColumns}
                pageSize={pageDetails?.perPage}
                currentPage={page}
                total={pageDetails?.total}
              />
            </div>
          </div>
        </div>
      </Modal>
      <Modal ref={modalRef} onBackdrop={onBackdrop}>
        {/* <TasksList
          tasksId={router.asPath.split('#')[1]}
          onSuccess={onSuccessShow}
        /> */}
        {orderID && <OrderWiseTaskList orderId={orderID || 0} />}
        {/* <OrderWiseTaskList /> */}
      </Modal>
    </Card>
  );
};

export default AssignedOrder;
