import {
  Table,
  Highlighter,
  IModalRef,
  Icon,
  Input,
  IDropdownItem,
  Modal,
  Card,
} from 'elements';
import { NextPage } from 'next';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from './billing.module.css';

import { useDispatch, useSelector } from 'react-redux';
import { AppThunkDispatch, RootState } from '../../../redux/types';
import { useQuery } from 'react-query';
import { IOrder, IOrderListItem } from '../../../model/order';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Roles } from '../../../constant/app';
import Loader from '../../../components/shared/Loader';
import Pick from '../../../../public/icons/pick.svg';
import { getForwardedPayments, pickPayment } from '../../../api/payment';

type propTypes = {
  leads?: Array<IOrder>;
  className?: string;
  style?: React.CSSProperties;
};

type forwardedpageDetailsProps = {
  forwardedperPage: number | undefined;
  forwardedcurrentPage: string | number;
  forwardedtotal: number | undefined;
};

const ForwardedPayments = React.memo<propTypes>((props) => {
  const dispatch = useDispatch<AppThunkDispatch>();
  const [sortKeys, setSortKeys] =
    useState<{ [key in string]: 'asc' | 'desc' }>();
  const [filterText, setFilterText] = useState<string>('');
  const [filterforwardedText, setFilterForwardedText] = useState<string>('');

  const user = useSelector((store: RootState) => store.auth.user);
  const modalRef = useRef<IModalRef>(null);
  const router = useRouter();
  const [acvtivePaymentId, setActivePaymentId] = useState(0);
  const [leadDetailsModal, setLeadDetailsModal] = useState(false);
  // const [leadstatus, setleadStatus] = useState<number | string>(2);
  const [brandID, setbrandId] = useState<number | string>(user?.brand1 || 1);
  const current = new Date();
  const date = `${current.getDate()}/${
    current.getMonth() + 1
  }/${current.getFullYear()}`;
  const [from, setFrom] = useState<number | string>(date);
  const [to, setTo] = useState<number | string>(date);
  const [forwardedpage, setForwardedPage] = useState(1);
  const [pageDetails, setPageDetails] = useState<forwardedpageDetailsProps>();

  const getForwardedList = async (
    pageId: string | number,
    from: string | number,
    to: string | number
  ) => {
    const params = {
      data: {
        to: to,
        from: from,
        page: pageId,
      },
    };
    const response = await dispatch(getForwardedPayments(params));
    if (pageId === 1) {
      setPageDetails({
        forwardedcurrentPage: response.data.current_page,
        forwardedperPage: response.data.per_page,
        forwardedtotal: response.data.total,
      });
    }
    return response.data.data;
  };
  const {
    data: forwardedpayments,
    isLoading,
    refetch: refetchForwardedLeads,
  } = useQuery<Array<IOrderListItem>>(
    [`ForwardedPayments_${from}`, to, forwardedpage],
    () => getForwardedList(forwardedpage, from, to),
    {
      enabled: !!user?.user_id,
    }
  );

  const refetchBothList = useCallback(async () => {
    await refetchForwardedLeads();
  }, [refetchForwardedLeads]);

  useEffect(() => {
    if (router.asPath.split('#')[1]) {
      modalRef.current?.showModal(true);
    } else {
      modalRef.current?.showModal(false);
    }
  }, [router]);

  const onRowItemClick = (v: IOrder) => {
    setActivePaymentId(v.order_id);
    setLeadDetailsModal(true);
  };

  const onPick = useCallback(
    async (
      orderpaymentId: IOrder['order_id'],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      try {
        const params = {
          data: {
            order_id: orderpaymentId,
          },
        };
        await dispatch(pickPayment(params));
        refetchBothList();
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, refetchBothList]
  );

  const forwardedcolumns = useMemo(() => {
    const temp = [
      {
        label: 'Sr. No.',
        keyIndex: 'order_id',
        render: (v: any, _: any, index: any) => parseInt(`${index + 1}`),
      },

      {
        label: 'Refr. No.',
        keyIndex: 'orderpayment_token',
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterforwardedText} />
        ),
      },
      {
        label: 'Invoice No.',
        keyIndex: 'orderpayment_invoiceno',
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterforwardedText} />
        ),
      },
      {
        label: 'Title',
        keyIndex: 'order_title',
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterforwardedText} />
        ),
      },
      {
        label: 'Lead Name',
        keyIndex: 'lead_name',
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterforwardedText} />
        ),
      },
      {
        label: 'Lead Email',
        keyIndex: 'lead_email',
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterforwardedText} />
        ),
      },
      {
        label: 'Payment Title',
        keyIndex: 'orderpayment_title',
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterforwardedText} />
        ),
      },

      {
        label: 'Status',
        keyIndex: 'orderpaymentstatus_name',
        render: (v: any) => (
          <Highlighter text={v || ''} searchText={filterforwardedText} />
        ),
      },
      {
        label: 'Amount',
        keyIndex: 'orderpayment_amount',
        render: (v: any) => (
          <p style={{ margin: '0px', padding: '0px' }}>
            $
            <Highlighter text={v || ''} searchText={filterforwardedText} />
          </p>
        ),
      },
      {
        label: 'Due Date',
        keyIndex: 'orderpayment_duedate',
        render: (v: any) => (
          <Highlighter text={v || ''} searchText={filterforwardedText} />
        ),
      },
      {
        label: 'Create By',
        keyIndex: 'user_name',
        render: (v: any) => (
          <Highlighter text={v || ''} searchText={filterforwardedText} />
        ),
      },
    ];
    if (user && ![Roles.MARKETING_AGENT].includes(user?.role_id)) {
      temp.push({
        label: 'Actions',
        keyIndex: 'order_id,deleted_at',
        render: (v: any) => (
          <>
            {user &&
            [Roles.SUPER_ADMIN, Roles.Billing].includes(user?.role_id) ? (
              <span
                title="Pick"
                style={{
                  marginLeft: '3px',
                  marginRight: '3px',
                }}
                onClick={onPick.bind(this, v.order_id)}
              >
                <Image src={Pick} alt="Alt" width={'25px'} />
              </span>
            ) : null}
          </>
        ),
      });
    }
    return temp;
  }, [user, filterforwardedText, onPick]);

  const onSearchByTextForwarded: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      setFilterForwardedText(e.target.value);
    }, []);

  const forwardedfiltered: Array<IOrderListItem> = useMemo(() => {
    if (filterforwardedText) {
      return (
        forwardedpayments?.filter((v: IOrderListItem) => {
          return (
            v.lead_name
              ?.toLowerCase()
              ?.includes(filterforwardedText.toLowerCase()) ||
            v.order_title
              ?.toLowerCase()
              ?.includes(filterforwardedText.toLowerCase()) ||
            v.orderpayment_title
              ?.toLowerCase()
              ?.includes(filterforwardedText.toLowerCase())
          );
        }) || []
      );
    }
    return forwardedpayments || [];
  }, [forwardedpayments, filterforwardedText]);

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
      <div className="">
        <Card
          style={{
            margin: '1rem',
          }}
        >
          <div className="container">
            <div className="row">
              <div className="col-lg-2">
                <h4 style={{ fontWeight: 'bold', fontSize: '16px' }}>
                  Forwarded Payments
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
                <div className="col-3" style={{ marginRight: '10px' }}>
                  <Input
                    style={{ marginTop: '10px' }}
                    placeholder="Search Forwarded Payment"
                    onChange={onSearchByTextForwarded}
                  />
                </div>
              </div>
            </div>

            <Table
              onSortData={(sortKey, direction) =>
                setSortKeys({ [sortKey as keyof IOrderListItem]: direction })
              }
              autoSort={true}
              loading={isLoading}
              onRowItemClick={onRowItemClick}
              data={forwardedfiltered}
              columnHeadings={forwardedcolumns}
              onPageChange={(p) => setForwardedPage(p)}
              pageSize={pageDetails?.forwardedperPage}
              currentPage={forwardedpage}
              total={pageDetails?.forwardedtotal}
              style={{
                maxHeight: '48vh',
                overflowY: 'scroll',
                marginTop: '0.5%',
              }}
            />
          </div>
          {/* <Modal
            style={{
              overflow: 'hidden',
              minHeight: '470px',
              maxHeight: '630px',
            }}
            show={leadDetailsModal}
            onBackdrop={() => setLeadDetailsModal(false)}
          >
            <LeadDetail orderpaymentId={acvtivePaymentId || 0} />
          </Modal> */}
        </Card>
      </div>
    </>
  );
});
export default ForwardedPayments;
