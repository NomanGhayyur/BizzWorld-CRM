import {
  Table,
  Button,
  Highlighter,
  Icon,
  Input,
  IModalRef,
  Modal,
} from 'elements';
import { NextPage } from 'next';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from '../../../styles/brand/Brand.module.css';
import Card from '../../../components/shared/Card';
import { useDispatch, useSelector } from 'react-redux';
import { AppThunkDispatch, RootState } from '../../../redux/types';
import moment from 'moment';
import { useQuery } from 'react-query';
// import { brandType, deleteBrandDetail, getBrandList } from '../../api/brand';
import { ILead, ILeadListItem } from '../../../model/lead';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Roles } from '../../../constant/app';
import { cancellead, getPickedLeadList, unpicklead } from '../../../api/pick';
import Loader from '../../shared/Loader';
import LeadDetail from '../../../pages/lead/leadDetails/leadDetails';
import Unpick from '../../../../public/icons/unpick.svg';
import Create from '../../../../public/icons/createicon.svg';
import Cancel from '../../../../public/icons/cancel.svg';

type propTypes = {
  brand?: Array<ILead>;
  className?: string;
  style?: React.CSSProperties;
};

const PickedLeadList: NextPage = React.memo<propTypes>((props) => {
  const dispatch = useDispatch<AppThunkDispatch>();
  const [sortKeys, setSortKeys] =
    useState<{ [key in string]: 'asc' | 'desc' }>();
  const [filterText, setFilterText] = useState<string>('');
  const [appliedFilters, setFilters] =
    useState<{ [key in string]: string | number }>();
  const [logoPathPrefix, setLogoPathPrefix] = useState<string>('');
  const [coverPathPrefix, setCoverPathPrefix] = useState<string>('');
  const [borderView, setBorderView] = useState<boolean>(false);
  const user = useSelector((store: RootState) => store.auth.user);
  const modalRef = useRef<IModalRef>(null);
  const router = useRouter();
  const { id } = router.query;
  const [leadstatus, setleadStatus] = useState<number | string>(2);
  const [acvtiveLeadId, setActiveLeadId] = useState(0);
  const [leadDetailsModal, setLeadDetailsModal] = useState(false);

  const {
    data: picklead,
    isFetching,
    isLoading,
    refetch,
  } = useQuery<Array<ILeadListItem>>(
    `BrandList`,
    async () => {
      const params = {
        data: {
          leadstatus_id: leadstatus,
        },
      };
      const response = await dispatch(getPickedLeadList(params));
      refetch();
      return response.data.data;
    },
    {
      enabled: !!user?.user_id,
    }
  );

  useEffect(() => {
    if (router.asPath.split('#')[1]) {
      modalRef.current?.showModal(true);
    } else {
      modalRef.current?.showModal(false);
    }
  }, [router]);

  const onRowItemClick = (v: ILead) => {
    setActiveLeadId(v.lead_id);
    setLeadDetailsModal(true);
  };

  const onUnpick = useCallback(
    async (
      leadId: ILeadListItem['lead_id'],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      try {
        const params = {
          data: {
            lead_id: leadId,
          },
        };
        await dispatch(unpicklead(params));
        refetch();
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, refetch]
  );
  const onCancel = useCallback(
    async (
      leadId: ILeadListItem['lead_id'],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      try {
        const params = {
          data: {
            lead_id: leadId,
          },
        };
        await dispatch(cancellead(params));
        refetch();
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, refetch]
  );

  // const onCreateOrder = useCallback(
  //   (
  //     leadId: ILead['lead_id'],
  //     event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  //   ) => {
  //     event.stopPropagation();
  //     // router.push(`/order/create/`);
  //     // event.stopPropagation();
  //     router.replace(`/order/create/`);
  //   },
  //   [router]
  // );

  const onRestore = useCallback(
    async (
      leadId: ILead['lead_id'],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
    },
    []
  );

  const columns = useMemo(() => {
    return [
      {
        label: 'ID',
        keyIndex: 'lead_id',
        render: (v: any, _: any, index: any) => parseInt(`${index + 1}`),
      },
      {
        label: 'Name',
        keyIndex: 'lead_name',
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterText} />
        ),
        sortable: true,
        sortIndex: 'lead_name',
      },
      {
        label: 'Bussiness Name',
        keyIndex: 'lead_bussinessname',
        render: (v: any) => (
          <Highlighter text={v || ''} searchText={filterText} />
        ),
      },
      {
        label: 'Email',
        keyIndex: 'lead_email',
        render: (v: any) => (
          <Highlighter text={v || ''} searchText={filterText} />
        ),
      },
      {
        label: 'Status',
        keyIndex: 'leadstatus_name',
        sortable: true,
        render: (v: any) => (
          <Highlighter text={v || ''} searchText={filterText} />
        ),
      },
      {
        // sortable: true,
        label: 'Create at',
        keyIndex: 'created_at',
        render: (v: any) => moment(v).format('DD-MMM-YYYY'),
      },
      {
        label: 'Actions',
        keyIndex: 'lead_id,deleted_at',
        render: (v: any) => (
          <div className="">
            <span
              title="Unpick"
              style={{
                marginLeft: '3px',
                marginRight: '3px',
              }}
              onClick={onUnpick.bind(this, v.lead_id)}
            >
              <Image src={Unpick} alt="Alt" width={'25px'} />
            </span>
            <span
              title="Create Order"
              style={{
                marginLeft: '3px',
                marginRight: '3px',
              }}
              // onClick={onCreateOrder.bind(this, v.lead_id)}

              onClick={() =>
                router.push({
                  pathname: '/order/create',
                  query: {
                    lead_id: v.lead_id,
                  },
                })
              }
            >
              <Image src={Create} alt="Alt" width={'25px'} />
            </span>

            {!v.deleted_at ? (
              <span
                title="Cancel"
                style={{
                  marginLeft: '3px',
                  marginRight: '3px',
                }}
                onClick={onCancel.bind(this, v.lead_id)}
              >
                <Image src={Cancel} alt="Alt" width={'25px'} />
              </span>
            ) : (
              <span className="arrowclock">
                <Icon
                  className="m-1"
                  name="arrow-counterclockwise"
                  onClick={onRestore.bind(this, v.lead_id)}
                />
              </span>
            )}
          </div>
        ),
      },
    ];
  }, [filterText, onUnpick, onCancel, onRestore, router]);

  const onSearchByText: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      setFilterText(e.target.value);
    }, []);

  const onBackdrop = useCallback(() => {
    if (router.asPath.split('#')[1]) {
      router.replace({ pathname: router.pathname, query: router.query });
    }
  }, [router]);

  const filtered: Array<ILeadListItem> = useMemo(() => {
    if (filterText) {
      return (
        picklead?.filter((v: ILeadListItem) => {
          return (
            v.lead_name?.toLowerCase()?.includes(filterText.toLowerCase()) ||
            v.lead_email?.toLowerCase()?.includes(filterText.toLowerCase()) ||
            v.lead_bussinessname
              ?.toLowerCase()
              ?.includes(filterText.toLowerCase())
          );
        }) || []
      );
    }
    return picklead || [];
  }, [picklead, filterText]);

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
      <Card className={styles.brandList__container}>
        <div className="row">
          <div className="col-lg-2">
            <h4 style={{ fontWeight: 'bold', fontSize: '16px' }}>
              Picked List
            </h4>
          </div>
          <div className="col-lg-1">
            <Icon
              name={'arrow-left'}
              onClick={() => router.back()}
              style={{ marginTop: '13px' }}
            />
          </div>
          <div className="col-lg-1"></div>
          <div className="col-lg-3"></div>
          <div className="col-lg-2"></div>
          <div className="col-lg-3">
            <Input
              placeholder="Search Picked Lead"
              onChange={onSearchByText}
              style={{ marginTop: '15px' }}
            />
          </div>
        </div>

        <Table
          onSortData={(sortKey, direction) =>
            setSortKeys({ [sortKey as keyof ILeadListItem]: direction })
          }
          autoSort={false}
          loading={isLoading}
          onRowItemClick={onRowItemClick}
          onPageChange={(p) => console.log(p)}
          data={filtered}
          columnHeadings={columns}
        />
        <Modal
          style={{
            overflow: 'hidden',
            minHeight: '470px',
            maxHeight: '630px',
          }}
          show={leadDetailsModal}
          onBackdrop={() => setLeadDetailsModal(false)}
        >
          <LeadDetail leadId={acvtiveLeadId || 0} />
        </Modal>
      </Card>
    </>
  );
});
export default PickedLeadList;
