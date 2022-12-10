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
} from '../../../api/order';
import { IOrder, IOrderListItem } from '../../../model/order';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import { DATE_FORMAT, Roles } from '../../../constant/app';
import { IRequestMeta } from '../../../model/app';
// import Ordercreate from './create';
import { getUserBrandList } from '../../../api/user';
import Loader from '../../../components/shared/Loader';

const OrdersList: NextPage = () => {
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

  const handlebrand = async (brandID: string) => {
    setbrandId(brandID);
  };

  const getList = async (id: string | number) => {
    const params = {
      data: {
        brand_id: id,
      },
    };
    const response = await dispatch(getOrderList(params));
    return response.data.data;
  };
  const {
    data: orders,
    isFetching,
    isLoading,
    refetch,
  } = useQuery<Array<IOrderListItem>>(
    [`OrderList_${brandID}`, brandID],
    () => getList(brandID),
    {
      enabled: !!brandID && !!user?.user_id,
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

  const onDelete = useCallback(
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
        label: 'Amount',
        keyIndex: 'order_id,totalamount',
        render: (v: any) => (
          <>
            {!v.totalamount ? (
              <Icon
                className="m-1 question"
                name="currency-dollar"
                onClick={onAmount.bind(this, v.order_id)}
              />
            ) : (
              <Button
                className="m-1 pencil"
                iconName="arrow-counterclockwise"
                onClick={onRestore.bind(this, v.order_id)}
              />
            )}
          </>
        ),
      },
      {
        label: 'Created By',
        keyIndex: 'creator',
        render: (v: any) => (
          <Highlighter text={v || ''} searchText={filterText} />
        ),
      },
      {
        label: 'Status',
        keyIndex: 'orderstatus_name',
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
        // sortable: true,
        label: 'Deadline',
        keyIndex: 'order_deadlinedate',
        render: (v: any) => moment(v).format(DATE_FORMAT),
      },
    ];
    if (user && ![Roles.PRODUCTION_HEAD].includes(user?.role_id)) {
      temp.push({
        label: 'Actions',
        keyIndex: 'order_id,deleted_at',
        render: (v: any) => (
          <>
            {!v.deleted_at ? (
              <span className="trash">
                <Icon
                  className="m-1"
                  name="trash"
                  onClick={onDelete.bind(this, v.order_id)}
                />
              </span>
            ) : (
              <span className="arrowclock">
                <Icon
                  className="m-1"
                  name="arrow-counterclockwise"
                  onClick={onRestore.bind(this, v.order_id)}
                />
              </span>
            )}
            <span className="pencil">
              <Icon
                className="m-1"
                name="pencil-square"
                onClick={onEdit.bind(this, v.order_id)}
              />
            </span>
          </>
        ),
      });
    }
    return temp;
  }, [user, filterText, onAmount, onRestore, onDelete, onEdit]);

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
    <Card className={styles.brandList__container}>
      <div className="row" style={{}}>
        <div className="col-lg-2">
          <h4 style={{ fontWeight: 'bold', fontSize: '16px' }}>Orders List</h4>
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
          <div className="col-3" style={{ marginRight: '10px' }}>
            {userBrand ? (
              <Dropdown
                className={styles.abcdedgropdown}
                style={{ width: '100%', marginTop: '10px' }}
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
          <div className={`text-right ${styles.brandtableiconsswitchdiv}`}>
            <Button
              iconName="plus"
              onClick={() => router.push('order/create')}
              style={{ marginTop: '10px' }}
            >
              Create Orders
            </Button>
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

export default OrdersList;
