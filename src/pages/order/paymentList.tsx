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
} from 'elements';
import CreateUser from '../../components/user/CreateUser';
import FilterUserList from '../../components/user/FilterUserList/FilterUserList';
import { IOrder } from '../../model/order';
import { AppThunkDispatch, RootState } from '../../redux/types';
import styles from '../../styles/order.module.css';
import Card from '../../components/shared/Card';
import {
  deletOrderDetail,
  getOrderDetail,
  getOrderList,
} from '../../api/order';
import { IOrderListItem } from '../../model/order';
import { useDispatch, useSelector } from 'react-redux';
import { useInfiniteQuery, useQuery } from 'react-query';
import { DATE_FORMAT } from '../../constant/app';
import { IRequestMeta } from '../../model/app';
import Ordercreate from './create';
import Loader from '../../components/shared/Loader';

type propTypes = {
  users?: Array<IOrder>;
  className?: string;
  style?: React.CSSProperties;
  orderId?: IOrder['order_id'];
};

const PaymentList = React.memo<propTypes>((props) => {
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
  const { id, order_id } = router.query;

  const orderId: IOrder['order_id'] = (props.orderId ||
    router.query?.id) as IOrder['order_id'];

  const {
    data: payments,
    isFetching,
    isLoading,
    refetch,
  } = useQuery<IOrderListItem>(
    `orderpayment_${id}`,
    async () => {
      const response = await dispatch(
        getOrderDetail({ data: { order_id: id } })
      );

      return response.paymentdetail;
    },
    {
      enabled: !!user?.user_id && !!id,
    }
  );
  // const { data, isFetching, isLoading } = useQuery<Array<IOrder>>(`paymentdetail`, async () => {
  //     const response = await dispatch(getOrderDetail());

  //     return response.data
  // })
  const columns = useMemo(() => {
    return [
      {
        label: 'ID',
        keyIndex: 'orderpayment_id',
        render: (v: any, _: any, index: any) => parseInt(`${index + 1}`),
      },
      {
        label: 'Title',
        keyIndex: 'orderpayment_title',
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterText} />
        ),
        sortable: true,
        sortIndex: 'orderpayment_title',
      },
      {
        label: 'Amount',
        keyIndex: 'orderpayment_amount',
        render: (v: any, _: any) => parseFloat(`${v}`),
      },
      {
        label: 'Due Date',
        keyIndex: 'orderpayment_duedate',
        render: (v: any) => moment(v).format(DATE_FORMAT),
      },
    ];
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

  const filtered: Array<IOrderListItem> = useMemo(() => {
    if (filterText) {
      return (
        payments?.filter(
          (v: {
            orderpayment_amount: any;
            orderpayment_id: any;
            orderpayment_title: any;
          }) => {
            return (
              v.orderpayment_title
                ?.toLowerCase()
                ?.includes(filterText.toLowerCase()) ||
              `${v.orderpayment_id}`
                .toLowerCase()
                ?.includes(filterText.toLowerCase()) ||
              v.orderpayment_amount
                ?.toLowerCase()
                ?.includes(filterText.toLowerCase()) ||
              v.orderpayment_title
                ?.toLowerCase()
                ?.includes(filterText.toLowerCase())
            );
          }
        ) || []
      );
    }
    return payments || [];
  }, [payments, filterText]);

  // const rowClassGenerator = useCallback((row: IOrder) => row.deleted_at ? "table__rowStrike" : "", [])

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
    <>
      {/* <div className="row">
        <div className="col-lg-5 mt-1">
        <legend className={styles.orderheading}>Orders</legend>
        </div>
        <div className="col-lg-7 mt-1 d-flex justify-content-right">
            <div className="ml-6 col-6">
        <Input  placeholder="Search Orders" onChange={onSearchByText} />
        </div>
        <div className={styles.createorderheading}>
       <Button iconName="plus" onClick={() => router.push("order/create")}>
                Create Orders
            </Button>
</div>
            <div className={`text-right ${styles.odertableiconsswitchdiv}`}

>

{!borderView ? (
<Icon name="table" onClick={setBorderView.bind(this, true)} />
) : (
<Icon name="list" onClick={setBorderView.bind(this, false)} />
)}
</div>
</div>
        </div> */}
      <div className={`table_card ${styles.dataWrapper}`}>
        {borderView ? (
          <React.Fragment>
            {filtered.map((order: any) => (
              <Card
                className={styles.userCard}
                key={order.orderpayment_id}
                header={order.order_id}
              >
                {order.orderpayment_title}
              </Card>
            ))}
          </React.Fragment>
        ) : (
          <Table
            onSortData={(sortKey, direction) =>
              setSortKeys({ [sortKey as keyof IOrder]: direction })
            }
            autoSort={false}
            loading={isLoading}
            // onRowItemClick={onRowItemClick}
            onPageChange={(p) => console.log(p)}
            data={filtered}
            // rowClass={rowClassGenerator}
            pageSize={meta?.per_page}
            total={meta?.total}
            currentPage={meta?.current_page}
            columnHeadings={columns}
            style={{ marginTop: '30px' }}
          />
        )}
      </div>

      {/* <Modal ref={modalRef} onBackdrop={onBackdrop}>
               <Ordercreate orderId={router.asPath.split("#")[1]} onSuccess={onSuccessCreate} />
            </Modal> */}
    </>
  );
});

export default PaymentList;
