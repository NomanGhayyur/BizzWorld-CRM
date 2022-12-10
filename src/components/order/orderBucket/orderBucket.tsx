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
  Table,
  Input,
  Highlighter,
  Icon,
  IModalRef,
  Dropdown,
  IDropdownItem,
  Modal,
} from "elements";
import { IUser } from "../../../model/user";
import { AppThunkDispatch, RootState } from "../../../redux/types";
import styles from "../../../styles/order.module.css";
import Card from "../../shared/Card";
import {
  getForwardedOrderList,
  getGroupOrderList,
  getPickedOrderList,
} from "../../../api/order";
import { IOrder, IOrderListItem } from "../../../model/order";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";
import { DATE_FORMAT, Roles } from "../../../constant/app";
// import Ordercreate from './create';
import { getUserBrandList } from "../../../api/user";
import Loader from "../../shared/Loader";
import { pickOrder, unpickOrder, updateOrderStatus } from "../../../api/pick";
import Image from "next/image";
import Update from "../../../../public/icons/update.svg";
import Pick from "../../../../public/icons/pick.svg";
import Cancel from "../../../../public/icons/cancel.svg";
import Unpick from "../../../../public/icons/unpick.svg";
import Create from "../../../../public/icons/createicon.svg";
import Assign from "../../../../public/icons/assign.svg";

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
type pickPageDetailsProps = {
  pickperPage: number | undefined;
  pickcurrentPage: string | number;
  picktotal: number | undefined;
};

const OrderBucket: NextPage = () => {
  const dispatch = useDispatch<AppThunkDispatch>();
  const [sortKeys, setSortKeys] =
    useState<{ [key in string]: "asc" | "desc" }>();
  const [filterForwardedText, setFilterForwardedText] = useState<string>("");
  const [filterPickText, setFilterPickText] = useState<string>("");

  const user = useSelector((store: RootState) => store.auth.user);
  const modalRef = useRef<IModalRef>(null);
  const router = useRouter();
  const [brandID, setbrandId] = useState<number | string>(user?.brand1 || 1);
  const [forwardorderstatus, setForwardOrderStatus] = useState<number | string>(
    2
  );
  const [pickorderstatus, setPickOrderStatus] = useState<number | string>(3);
  const [activeRowToken, setActiveRowToken] = useState<number | string>(0);
  const [orderModal, setOrderModal] = useState(false);
  const [pickOrderModal, setPickOrderModal] = useState(false);

  const [page, setPage] = useState(1);
  const [pageDetails, setPageDetails] = useState<pageDetailsProps>();

  const [pickpage, setPickPage] = useState(1);
  const [pickpageDetails, setPickPageDetails] =
    useState<pickPageDetailsProps>();

  useEffect(() => {
    setForwardOrderStatus(forwardorderstatus);
  }, [forwardorderstatus]);

  const handlebrand = async (brandID: string) => {
    setbrandId(brandID);
  };
  const getList = async (id: string | number, pageId: string | number) => {
    const params = {
      data: {
        brand_id: id,
        page: pageId,
        orderstatus_id: forwardorderstatus,
      },
    };
    const response = await dispatch(getForwardedOrderList(params));
    if (pageId === 1) {
      setPageDetails({
        currentPage: response.data.current_page,
        perPage: response.data.per_page,
        total: response.data.total,
      });
    }
    return response.data.data;
  };
  const { data: forwardedorders, refetch: refetchForwardedOrder } = useQuery<
    Array<IOrderListItem>
  >(
    [`ForwardedOrderList_${brandID}`, brandID, page],
    () => getList(brandID, page),
    {
      enabled: !!brandID && !!user?.user_id,
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    setPickOrderStatus(pickorderstatus);
  }, [pickorderstatus]);

  const getPickList = async (
    id: string | number,
    pickpageId: string | number
  ) => {
    const params = {
      data: {
        orderstatus_id: pickorderstatus,
        page: pickpageId,
      },
    };
    const response = await dispatch(getPickedOrderList(params));
    if (pickpageId === 1) {
      setPickPageDetails({
        pickcurrentPage: response.data.current_page,
        pickperPage: response.data.per_page,
        picktotal: response.data.total,
      });
    }
    return response.data.data;
  };
  const {
    data: pickedorders,
    isFetching,
    isLoading,
    refetch: refetchPickedOrder,
  } = useQuery<Array<IOrderListItem>>(
    [`PickedOrderList_${brandID}`, brandID, page],
    () => getPickList(brandID, page),
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
  const refetchBothList = useCallback(async () => {
    await refetchForwardedOrder();
    await refetchPickedOrder();
  }, [refetchForwardedOrder, refetchPickedOrder]);

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

  const onRowClick = (v: IOrderListItem) => {
    setActiveRowToken(v.order_token);
    setOrderModal(true);
  };

  const onRowPickClick = (v: IOrderListItem) => {
    setActiveRowToken(v.order_token);
    setPickOrderModal(true);
  };

  const onPick = useCallback(
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
        await dispatch(pickOrder(params));
        refetchBothList();
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, refetchBothList]
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

  const onCreatTask = useCallback(
    async (
      orderId: IOrder["order_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      try {
        router.push({
          pathname: `/tasks/create/`,
          query: {
            order_id: orderId,
          },
        });
      } catch (e) {
        console.error(e);
      }
    },
    [router]
  );

  const onUnpick = useCallback(
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
        await dispatch(unpickOrder(params));
        refetchBothList();
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, refetchBothList]
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
        refetchPickedOrder();
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, refetchPickedOrder]
  );
  const onAssign = useCallback(
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
            orderstatus_id: 4,
          },
        };
        await dispatch(updateOrderStatus(params));
        refetchPickedOrder();
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, refetchPickedOrder]
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
          <Highlighter text={`${v}`.trim()} searchText={filterForwardedText} />
        ),

        sortIndex: "order_title",
      },
      {
        label: "Created By",
        keyIndex: "creator",
        render: (v: any) => (
          <Highlighter text={v || ""} searchText={filterForwardedText} />
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
      [Roles.PRODUCTION_HEAD, Roles.SUPER_ADMIN].includes(user?.role_id)
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
              title="Pick"
              onClick={onPick.bind(this, v.order_token)}
            >
              <Image src={Pick} alt="Alt" width={"25px"} />
            </span>

            {user &&
            [Roles.SUPER_ADMIN, Roles.UNIT_HEAD].includes(user?.role_id) ? (
              <span
                style={{
                  marginLeft: "3px",
                  marginRight: "3px",
                }}
                title="Edit"
                onClick={onEdit.bind(this, v.order_token)}
              >
                <Image src={Update} alt="Alt" width={"25px"} />
              </span>
            ) : null}
          </>
        ),
      });
    }
    return temp;
  }, [user, filterForwardedText, onPick, onEdit]);

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
          <Highlighter text={`${v}`.trim()} searchText={filterPickText} />
        ),

        sortIndex: "order_title",
      },
      {
        label: "Created By",
        keyIndex: "creator",
        render: (v: any) => (
          <Highlighter text={v || ""} searchText={filterPickText} />
        ),
      },
      {
        sortable: true,
        label: "Created At",
        keyIndex: "created_at",
        render: (v: any) => moment(v).format("DD-MMM-YYYY"),
      },
      {
        sortable: true,
        label: "Deadline",
        keyIndex: "order_deadlinedate",
        render: (v: any) => moment(v).format(DATE_FORMAT),
      },
    ];

    return temp;
  }, [filterPickText]);

  const pickcolumns = useMemo(() => {
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
          <Highlighter text={`${v}`.trim()} searchText={filterPickText} />
        ),

        sortIndex: "order_title",
      },
      {
        label: "Created By",
        keyIndex: "creator",
        render: (v: any) => (
          <Highlighter text={v || ""} searchText={filterPickText} />
        ),
      },
      {
        sortable: true,
        label: "Created At",
        keyIndex: "created_at",
        render: (v: any) => moment(v).format("DD-MMM-YYYY"),
      },
      {
        sortable: true,
        label: "Deadline",
        keyIndex: "order_deadlinedate",
        render: (v: any) => moment(v).format(DATE_FORMAT),
      },
    ];
    if (
      user &&
      [Roles.PRODUCTION_HEAD, Roles.SUPER_ADMIN].includes(user?.role_id)
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
              title="Unpick"
              onClick={onUnpick.bind(this, v.order_token)}
            >
              <Image src={Unpick} alt="Alt" width={"25px"} />
            </span>
            <span
              style={{
                marginLeft: "3px",
                marginRight: "3px",
              }}
              title="Assign"
              onClick={onAssign.bind(this, v.order_token)}
            >
              <Image src={Assign} alt="Alt" width={"25px"} />
            </span>

            {user && [Roles.SUPER_ADMIN].includes(user?.role_id) ? (
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
  }, [user, filterPickText, onUnpick, onCancel, onAssign]);

  const pickModalColumns = useMemo(() => {
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
          <Highlighter text={`${v}`.trim()} searchText={filterPickText} />
        ),

        sortIndex: "order_title",
      },
      {
        label: "Created By",
        keyIndex: "creator",
        render: (v: any) => (
          <Highlighter text={v || ""} searchText={filterPickText} />
        ),
      },
      {
        sortable: true,
        label: "Created At",
        keyIndex: "created_at",
        render: (v: any) => moment(v).format("DD-MMM-YYYY"),
      },
      {
        sortable: true,
        label: "Deadline",
        keyIndex: "order_deadlinedate",
        render: (v: any) => moment(v).format(DATE_FORMAT),
      },
    ];
    if (
      user &&
      [Roles.PRODUCTION_HEAD, Roles.SUPER_ADMIN].includes(user?.role_id)
    ) {
      temp.push({
        label: "Actions",
        keyIndex: "order_id,deleted_at",
        render: (v: any) => (
          <>
            {user &&
            [Roles.SUPER_ADMIN, Roles.PRODUCTION_HEAD].includes(
              user?.role_id
            ) ? (
              <>
                <span
                  style={{
                    marginLeft: "3px",
                    marginRight: "3px",
                  }}
                  title="Create Task"
                  onClick={onCreatTask.bind(this, v.order_id)}
                  // onClick={() =>
                  //   router.push({
                  //     pathname: `/tasks/create/`,
                  //     query: {
                  //       order_id: v.order_id,
                  //     },
                  //   })
                  // }
                >
                  <Image src={Create} alt="Alt" width={"25px"} />
                </span>
              </>
            ) : null}
          </>
        ),
      });
    }
    return temp;
  }, [user, filterPickText, onCreatTask]);

  const onSearchByForwardedText: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      setFilterForwardedText(e.target.value);
    }, []);
  const onSearchByPickedText: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      setFilterPickText(e.target.value);
    }, []);

  const onBackdrop = useCallback(() => {
    if (router.asPath.split("#")[1]) {
      router.replace({ pathname: router.pathname, query: router.query });
    }
  }, [router]);

  const filteredForwarded: Array<IOrderListItem> = useMemo(() => {
    if (filterForwardedText) {
      return (
        forwardedorders?.filter((v: IOrderListItem) => {
          return (
            v.order_title
              ?.toLowerCase()
              ?.includes(filterForwardedText.toLowerCase()) ||
            v.orderstatus_name
              ?.toLowerCase()
              ?.includes(filterForwardedText.toLowerCase())
          );
        }) || []
      );
    }
    return forwardedorders || [];
  }, [forwardedorders, filterForwardedText]);

  const filteredpick: Array<IOrderListItem> = useMemo(() => {
    if (filterPickText) {
      return (
        pickedorders?.filter((v: IOrderListItem) => {
          return (
            v.order_title
              ?.toLowerCase()
              ?.includes(filterPickText.toLowerCase()) ||
            v.orderstatus_name
              ?.toLowerCase()
              ?.includes(filterPickText.toLowerCase())
          );
        }) || []
      );
    }
    return pickedorders || [];
  }, [filterPickText, pickedorders]);

  const rowClassGenerator = useCallback(
    (row: IUser) => (row.deleted_at ? "table__rowStrike" : ""),
    []
  );

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
        style={{
          maxHeight: "48vh",
          overflowY: "scroll",
          marginTop: "0.5%",
          border: "none",
          boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
          borderRadius: "5px",
        }}
      >
        <div className="container-fluid">
          <div className="row" style={{}}>
            <div className="col-lg-2">
              <h4 style={{ fontWeight: "bold", fontSize: "16px" }}>
                Forwarded Orders List
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
                  placeholder="Search Forwarded Orders"
                  onChange={onSearchByForwardedText}
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
            </div>
          </div>

          <Table
            onSortData={(sortKey, direction) =>
              setSortKeys({ [sortKey as keyof IUser]: direction })
            }
            autoSort={false}
            loading={isLoading}
            onRowItemClick={onRowClick}
            data={filteredForwarded}
            rowClass={rowClassGenerator}
            onPageChange={(p) => setPage(p)}
            pageSize={pageDetails?.perPage}
            currentPage={page}
            total={pageDetails?.total}
            columnHeadings={columns}
          />
        </div>
      </Card>
      <Card
        style={{
          maxHeight: "48vh",
          overflowY: "scroll",
          marginTop: "0.5%",
          border: "none",
          boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
          borderRadius: "5px",
        }}
      >
        <div className="container-fluid">
          <div className="row" style={{}}>
            <div className="col-lg-2">
              <h4 style={{ fontWeight: "bold", fontSize: "16px" }}>
                Picked Orders List
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
                  placeholder="Search Picked Orders"
                  onChange={onSearchByPickedText}
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
            onRowItemClick={onRowPickClick}
            data={filteredpick}
            rowClass={rowClassGenerator}
            columnHeadings={pickcolumns}
            onPageChange={(p) => setPickPage(p)}
            pageSize={pickpageDetails?.pickperPage}
            currentPage={pickpage}
            total={pickpageDetails?.picktotal}
          />
        </div>
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
                onRowItemClick={onRowItemClick}
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
      <Modal
        style={{
          overflow: "scroll",
          minHeight: "470px",
          maxHeight: "630px",
          width: "50rem",
        }}
        show={pickOrderModal}
        onBackdrop={() => setPickOrderModal(false)}
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
                onRowItemClick={onRowItemClick}
                //@ts-ignore
                data={groupOrders}
                rowClass={rowClassGenerator}
                columnHeadings={pickModalColumns}
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

export default OrderBucket;
