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

const OrderquestionList = React.memo<propTypes>((props) => {
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

  const [show, setShow] = useState(false);

  const orderId: IOrder['order_id'] = (props.orderId ||
    router.query?.id) as IOrder['order_id'];

  const {
    data: ordersqa,
    isLoading,
    refetch,
  } = useQuery<IOrder>(`orderqa_id_${id}`, async () => {
    const response = await dispatch(getOrderDetail({ data: { order_id: id } }));

    return response.qadetail;
  });
  // const { data, isFetching, isLoading } = useQuery<Array<IOrder>>(`paymentdetail`, async () => {
  //     const response = await dispatch(getOrderDetail());

  //     return response.data
  // })
  const columns = useMemo(() => {
    return [
      {
        label: 'ID',
        keyIndex: 'orderqa_id',
        render: (v: any, _: any, index: any) => parseInt(`${index + 1}`),
      },
      {
        label: 'Question',
        keyIndex: 'orderquestion_name',
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterText} />
        ),
        sortable: true,
        sortIndex: 'orderquestion_name',
      },
      {
        label: 'Answer',
        keyIndex: 'orderqa_answer',
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterText} />
        ),
        sortable: true,
        sortIndex: 'orderqa_answer',
      },

      // {
      //     label: "Description",
      //     keyIndex: "order_description",
      //     render: (v: any) => <Highlighter text={v || ""} searchText={filterText} />,
      //     sortable: true,
      // },
      // {
      //     label: "Deadline",
      //     keyIndex: "order_deadlinedate",
      //     render: (v: any) => moment(v).format(DATE_FORMAT)
      // },
      // {
      //     label: "Status",
      //     keyIndex: "status_id",
      //     render: (v: any) => moment(v).format(DATE_FORMAT)
      // },
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
        ordersqa?.filter(
          (v: {
            orderqa_answer: any;
            orderqa_id: any;
            orderquestion_name: any;
          }) => {
            return (
              v.orderquestion_name
                ?.toLowerCase()
                ?.includes(filterText.toLowerCase()) ||
              `${v.orderqa_id}`
                .toLowerCase()
                ?.includes(filterText.toLowerCase()) ||
              v.orderqa_answer
                ?.toLowerCase()
                ?.includes(filterText.toLowerCase()) ||
              v.orderquestion_name
                ?.toLowerCase()
                ?.includes(filterText.toLowerCase())
            );
          }
        ) || []
      );
    }
    return ordersqa || [];
  }, [ordersqa, filterText]);

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
      {filtered.map((order: any) => (
        <>
          <div className="accordion w-100" id="basicAccordion">
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingOne">
                <button
                  style={{
                    background: '#eee',
                    color: '#444444',
                    fontFamily: 'inherit',
                    fontSize: '14px',
                  }}
                  onClick={() => setShow(!show)}
                  className="accordion-button collapsed"
                  type="button"
                  data-mdb-toggle="collapse"
                  data-mdb-target="#basicAccordionCollapseOne"
                  aria-expanded="false"
                  aria-controls="collapseOne"
                >
                  {order.orderquestion_name}
                </button>
              </h2>
              {show ? (
                <div className="">
                  <div className="accordion-body">{order.orderqa_answer}</div>
                </div>
              ) : null}
            </div>
          </div>
        </>
      ))}
      {/* <Modal ref={modalRef} onBackdrop={onBackdrop}>
               <Ordercreate orderId={router.asPath.split("#")[1]} onSuccess={onSuccessCreate} />
            </Modal> */}
    </>
  );
});

export default OrderquestionList;
