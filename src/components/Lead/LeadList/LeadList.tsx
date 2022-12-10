import { Table, Highlighter, Icon, IModalRef } from 'elements';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from '../../../styles/brand/Brand.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { AppThunkDispatch, RootState } from '../../../redux/types';
import moment from 'moment';
import { useQuery } from 'react-query';
import { deleteLead, getLeadList } from '../../../api/lead';
import { ILead, ILeadListItem } from '../../../model/lead';
import { useRouter } from 'next/router';
import Loader from '../../shared/Loader';
import Image from 'next/image';
import Delete from '../../../../public/icons/delete.svg';
import Update from '../../../../public/icons/update.svg';

type propTypes = {
  leads?: Array<ILead>;
  className?: string;
  style?: React.CSSProperties;
};

const LeadList = React.memo<propTypes>((props) => {
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

  const {
    data: leads,
    isFetching,
    isLoading,
    refetch,
  } = useQuery<Array<ILeadListItem>>(
    `LeadList_${id}`,
    async () => {
      const params = {
        data: {
          brand_id: id,
        },
      };
      const response = await dispatch(getLeadList(params));
      return response.data;
    },
    {
      enabled: !!id && !!user?.user_id,
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
    (lead: ILeadListItem) => {
      router.push(`/lead/${lead.lead_id}`);
    },
    [router]
  );

  const onDelete = useCallback(
    async (
      leadId: ILead['lead_id'],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      try {
        const params = {
          data: {
            lead_id: leadId,
          },
        };
        await dispatch(deleteLead(params));
        refetch();
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, refetch]
  );

  // const onDelete = useCallback(
  //   async (
  //     leadId: ILeadListItem['lead_id'],
  //     event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  //   ) => {
  //     event.stopPropagation();
  //     try {
  //       const params = {
  //         data: {
  //           lead_id: leadId,
  //         },
  //       };
  //       await dispatch(deleteLead(params));
  //       refetch();
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   },
  //   [dispatch, refetch]
  // );

  const onRestore = useCallback(
    async (
      leadId: ILeadListItem['lead_id'],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
    },
    []
  );

  const onEdit = useCallback(
    (
      leadId: ILeadListItem['lead_id'],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      router.push(`/lead/update/${leadId}`);
    },
    [router]
  );

  const columns = useMemo(() => {
    return [
      {
        label: 'ID',
        keyIndex: 'lead_id',
        render: (v: any, _: any, index: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterText} />
        ),
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
        render: (v: any) => (
          <Highlighter text={v || ''} searchText={filterText} />
        ),
      },
      {
        sortable: true,
        label: 'Create at',
        keyIndex: 'created_at',
        render: (v: any) => moment(v).format('DD-MMM-YYYY'),
      },

      {
        label: 'Actions',
        keyIndex: 'lead_id,deleted_at',
        render: (v: any) => (
          <>
            {!v.deleted_at ? (
              <span
                style={{
                  marginLeft: '3px',
                  marginRight: '3px',
                }}
                title="Delete"
                onClick={onDelete.bind(this, v.lead_id)}
              >
                <Image src={Delete} alt="Alt" width={'25px'} />
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
            <span
              style={{
                marginLeft: '3px',
                marginRight: '3px',
              }}
              title="Edit"
              onClick={onEdit.bind(this, v.lead_id)}
            >
              <Image src={Update} alt="Alt" width={'25px'} />
            </span>
          </>
        ),
      },
    ];
  }, [filterText, onDelete, onRestore, onEdit]);

  const onSearchByText: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      setFilterText(e.target.value);
    }, []);

  const onBackdrop = useCallback(() => {
    if (router.asPath.split('#')[1]) {
      router.replace({ pathname: router.pathname, query: router.query });
    }
  }, [router]);

  // const onSuccessCreate = useCallback(() => {
  //     onBackdrop();
  // }, [onBackdrop])

  const filtered: Array<ILeadListItem> = useMemo(() => {
    if (filterText) {
      return (
        leads?.filter((v: ILeadListItem) => {
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
    return leads || [];
  }, [leads, filterText]);

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

  const renderOnRowHover = (row: ILeadListItem, index: number) => {};

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
      <div className={`table_card ${styles.dataWrapper}`}>
        <Table
          // renderOnRowHover={renderOnRowHover}
          onSortData={(sortKey, direction) =>
            setSortKeys({ [sortKey as keyof ILeadListItem]: direction })
          }
          autoSort={true}
          loading={isLoading}
          onRowItemClick={onRowItemClick}
          onPageChange={(p) => console.log(p)}
          data={filtered}
          columnHeadings={columns}
          style={{ marginTop: '30px' }}
        />
      </div>
    </>
  );
});
export default LeadList;
