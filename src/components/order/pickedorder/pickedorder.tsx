import moment from 'moment';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
} from 'elements';
import CreateUser from '../../../components/user/CreateUser';
import FilterUserList from '../../../components/user/FilterUserList/FilterUserList';
import { IUser } from '../../../model/user';
import { AppThunkDispatch, RootState } from '../../../redux/types';
import styles from '../../../styles/order.module.css';
import Card from '../../../components/shared/Card';
import {
  deletOrderDetail,
  getOrderList,
  getOrderDetail,
  getTotalAmount,
  getPickedOrderList,
} from '../../../api/order';
import { IOrder, IOrderListItem } from '../../../model/order';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import { DATE_FORMAT, Roles } from '../../../constant/app';
import { IRequestMeta } from '../../../model/app';
// import Ordercreate from './create';
import { getUserBrandList } from '../../../api/user';
import Loader from '../../../components/shared/Loader';
import { unpickOrder, updateOrderStatus } from '../../../api/pick';
import Image from 'next/image';
import Cancel from '../../../../public/icons/cancel.svg';
import Unpick from '../../../../public/icons/unpick.svg';
import Create from '../../../../public/icons/createicon.svg';
import Assign from '../../../../public/icons/assign.svg';

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

const PickedOrders: NextPage = () => {
  const dispatch = useDispatch<AppThunkDispatch>();
  const [sortKeys, setSortKeys] =
    useState<{ [key in string]: 'asc' | 'desc' }>();
  const [filterText, setFilterText] = useState<string>('');
  const [appliedFilters, setFilters] =
    useState<{ [key in string]: string | number }>();
  const [borderView, setBorderView] = useState<boolean>(false);
  const [meta, setMeta] = useState<IRequestMeta>();
  const user = useSelector((store: RootState) => store.auth.user);
  const modalRef = useRef<IModalRef>(null);
  const router = useRouter();
  const [brandID, setbrandId] = useState<number | string>(user?.brand1 || 1);
  const [orderstatus, setOrderStatus] = useState<number | string>(3);
  const [page, setPage] = useState(1);
  const [pageDetails, setPageDetails] = useState<pageDetailsProps>();
  useEffect(() => {
    setOrderStatus(orderstatus);
  }, [orderstatus]);

  const getList = async (id: string | number, pageId: string | number) => {
    const params = {
      data: {
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
    isFetching,
    isLoading,
    refetch,
  } = useQuery<Array<IOrderListItem>>(
    [`PickList_${brandID}`, brandID, page],
    () => getList(brandID, page),
    {
      enabled: !!brandID && !!user?.user_id,
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (router.asPath.split('#')[1]) {
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
  const onCreatTask = useCallback(
    async (
      orderId: IOrder['order_id'],
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
      orderId: IOrder['order_id'],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      try {
        const params = {
          data: {
            order_id: orderId,
          },
        };
        await dispatch(unpickOrder(params));
        refetch();
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, refetch]
  );

  const onCancel = useCallback(
    async (
      orderId: IOrder['order_id'],
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
  const onAssign = useCallback(
    async (
      orderId: IOrder['order_id'],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      try {
        const params = {
          data: {
            order_id: orderId,
            orderstatus_id: 4,
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

  const onEdit = useCallback(
    async (
      orderId: IOrder['order_id'],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();

      router.push(`/order/update/${orderId}`);
    },
    [router]
  );

  const onRestore = useCallback(
    async (
      orderId: IOrder['order_id'],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
    },
    []
  );

  const onAmount = useCallback(
    async (
      orderId: IOrder['order_id'],
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

  const columns = useMemo(() => {
    const temp = [
      {
        label: 'ID',
        keyIndex: 'order_id',
        render: (v: any, _: any, index: any) => parseInt(`${index + 1}`),
      },
      {
        label: 'Title',
        keyIndex: 'order_title',
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterText} />
        ),

        sortIndex: 'order_title',
      },
      {
        label: 'Created By',
        keyIndex: 'creator',
        render: (v: any) => (
          <Highlighter text={v || ''} searchText={filterText} />
        ),
      },
      {
        sortable: true,
        label: 'Created At',
        keyIndex: 'created_at',
        render: (v: any) => moment(v).format('DD-MMM-YYYY'),
      },
      {
        sortable: true,
        label: 'Deadline',
        keyIndex: 'order_deadlinedate',
        render: (v: any) => moment(v).format(DATE_FORMAT),
      },
    ];
    if (
      user &&
      [Roles.PRODUCTION_HEAD, Roles.SUPER_ADMIN].includes(user?.role_id)
    ) {
      temp.push({
        label: 'Actions',
        keyIndex: 'order_id,deleted_at',
        render: (v: any) => (
          <>
            {!v.order_pickby ? (
              <span
                style={{
                  marginLeft: '3px',
                  marginRight: '3px',
                }}
                title="Unpick"
                onClick={onUnpick.bind(this, v.order_id)}
              >
                <Image src={Unpick} alt="Alt" width={'25px'} />
              </span>
            ) : null}
            {user &&
            [Roles.SUPER_ADMIN, Roles.PRODUCTION_HEAD].includes(
              user?.role_id
            ) ? (
              <>
                <span
                  style={{
                    marginLeft: '3px',
                    marginRight: '3px',
                  }}
                  title="Cancel"
                  onClick={onCancel.bind(this, v.order_id)}
                >
                  <Image src={Cancel} alt="Alt" width={'25px'} />
                </span>
                <span
                  style={{
                    marginLeft: '3px',
                    marginRight: '3px',
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
                  <Image src={Create} alt="Alt" width={'25px'} />
                </span>
                <span
                  style={{
                    marginLeft: '3px',
                    marginRight: '3px',
                  }}
                  title="Assign"
                  onClick={onAssign.bind(this, v.order_id)}
                >
                  <Image src={Assign} alt="Alt" width={'25px'} />
                </span>
              </>
            ) : null}
          </>
        ),
      });
    }
    return temp;
  }, [user, filterText, onUnpick, onCancel, onCreatTask, onAssign]);

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
    if (router.asPath.split('#')[1]) {
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
    (row: IUser) => (row.deleted_at ? 'table__rowStrike' : ''),
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
        style={{ height: '100vh' }}
      >
        <Loader fullPage />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row" style={{}}>
        <div className="col-lg-2">
          <h4 style={{ fontWeight: 'bold', fontSize: '16px' }}>
            Picked Orders List
          </h4>
        </div>
        <div className="col-lg-1">
          {' '}
          <Icon
            name={'arrow-left'}
            onClick={() => router.back()}
            style={{ marginTop: '13px' }}
          />
        </div>
        <div className="col-lg-9 d-flex justify-content-right">
          <div className="col-3" style={{ marginRight: '40px' }}>
            <Input
              style={{ marginTop: '10px', marginLeft: '27px' }}
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
        onPageChange={(p) => setPage(p)}
        pageSize={pageDetails?.perPage}
        currentPage={page}
        total={pageDetails?.total}
        columnHeadings={columns}
      />
    </div>
  );
};

export default PickedOrders;
