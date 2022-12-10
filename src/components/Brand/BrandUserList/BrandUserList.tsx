import moment from 'moment';
import { useRouter } from 'next/router';
import React, {
  useCallback,
  useMemo,
  useEffect,
  useState,
  useRef,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Table,
  Highlighter,
  Modal,
  IModalRef,
  IColumnHeading,
  Icon,
} from 'elements';
import { IUser } from '../../../model/user';
import { AppThunkDispatch, RootState } from '../../../redux/types';
import styles from './../../user/UserList';
import Card from '../../shared/Card';
import { useInfiniteQuery, useQuery } from 'react-query';
import { deleteUser } from '../../../api/user';
import { DATE_FORMAT, Roles } from '../../../constant/app';
import CreateUser from '../../user/CreateUser';
import { IRequestMeta } from '../../../model/app';
import { getBrandUserList } from '../../../api/brand';
import Image from 'next/image';
import Delete from '../../../../public/icons/delete.svg';
import Update from '../../../../public/icons/update.svg';

type propTypes = {
  users?: Array<IUser>;
  className?: string;
  style?: React.CSSProperties;
};

const UsersList = React.memo<propTypes>((props) => {
  const dispatch = useDispatch<AppThunkDispatch>();
  const [sortKeys, setSortKeys] =
    useState<{ [key in string]: 'asc' | 'desc' }>();
  const [filterText, setFilterText] = useState<string>('');
  const [borderView, setBorderView] = useState<boolean>(false);
  const [coverpath, setCoverPathPrefix] = useState<string>('');
  const [profilepath, setProfilePathPrefix] = useState<string>('');
  const [meta, setMeta] = useState<IRequestMeta>();
  const user = useSelector((store: RootState) => store.auth.user);
  const router = useRouter();
  const modalRef = useRef<IModalRef>(null);
  const { id } = router.query;

  const {
    data: users,
    isFetching,
    isLoading,
    refetch,
  } = useQuery<Array<IUser>>(
    `UserList_${id}`,
    async () => {
      const params = {
        data: {
          brand_id: id,
        },
      };
      const response = await dispatch(getBrandUserList(params));
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
    (user: IUser) => {
      router.push(`/user/${user.user_id}`);
    },
    [router]
  );

  const onDelete = useCallback(
    async (
      userId: IUser['user_id'],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      try {
        const params = {
          data: {
            edituser_id: userId,
          },
        };
        await dispatch(deleteUser(params));
        refetch();
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, refetch]
  );

  const onRestore = useCallback(
    async (
      userId: IUser['user_id'],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
    },
    []
  );

  const onEdit = useCallback(
    (
      userId: IUser['user_id'],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      router.push(`/user/update/${userId}`);
      // event.stopPropagation();
      // router.replace(`${router.asPath}#${userId}`)
    },
    [router]
  );

  const columns = useMemo(() => {
    const temp: Array<IColumnHeading> = [
      {
        label: 'ID',
        keyIndex: 'user_id',
        render: (v: any, _: any, index: any) => parseInt(`${index + 1}`),
      },
      {
        label: 'Name',
        keyIndex: 'user_name',
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterText} />
        ),
        sortable: true,
        sortIndex: 'user_name',
      },

      {
        label: 'Email',
        keyIndex: 'user_email',
        render: (v: any) => (
          <Highlighter text={v || ''} searchText={filterText} />
        ),
      },
      {
        sortable: true,
        label: 'Created At',
        keyIndex: 'created_at',
        render: (v: any) => moment(v).format(DATE_FORMAT),
      },
    ];

    if (
      user &&
      ![Roles.SALES_AGENT, Roles.MARKETING_AGENT].includes(user?.role_id)
    ) {
      temp.push({
        label: 'Actions',
        keyIndex: 'user_id,deleted_at',
        render: (v: any) => (
          <>
            {!v.deleted_at ? (
              <span
                style={{
                  marginLeft: '3px',
                  marginRight: '3px',
                }}
                title="Delete"
                onClick={onDelete.bind(this, v.user_id)}
              >
                <Image src={Delete} alt="Alt" width={'25px'} />
              </span>
            ) : (
              <span className="arrowclock"></span>
            )}
            <span
              style={{
                marginLeft: '3px',
                marginRight: '3px',
              }}
              title="Edit"
              onClick={onEdit.bind(this, v.user_id)}
            >
              <Image src={Update} alt="Alt" width={'25px'} />
            </span>
          </>
        ),
      });
    }
    return temp;
  }, [filterText, onDelete, onEdit, user]);

  const filtered = useMemo(() => {
    if (filterText) {
      // return users?.pages?.flat()?.filter((v) => {
      users?.filter((v: IUser) => {
        return (
          v.user_name?.toLowerCase()?.includes(filterText.toLowerCase()) ||
          v.user_email?.toLowerCase()?.includes(filterText.toLowerCase()) ||
          v.user_username?.toLowerCase()?.includes(filterText.toLowerCase())
        );
      });
    }
    return users || [];
  }, [users, filterText]);

  const onBackdrop = useCallback(() => {
    if (router.asPath.split('#')[1]) {
      router.replace({ pathname: router.pathname, query: router.query });
    }
  }, [router]);

  const onSuccessCreate = useCallback(() => {
    onBackdrop();
  }, [onBackdrop]);

  const rowClassGenerator = useCallback(
    (row: IUser) => (row?.deleted_at ? 'table__rowStrike' : ''),
    []
  );

  return (
    <div className={`table_card`} style={{ marginTop: '30px' }}>
      <Table
        onSortData={(sortKey, direction) =>
          setSortKeys({ [sortKey as keyof IUser]: direction })
        }
        autoSort={true}
        loading={isLoading}
        onRowItemClick={onRowItemClick}
        onPageChange={(p) => console.log(p)}
        data={props.users || filtered || []}
        rowClass={rowClassGenerator}
        pageSize={meta?.per_page}
        total={meta?.total}
        currentPage={meta?.current_page}
        columnHeadings={columns}
      />
      <Modal ref={modalRef} onBackdrop={onBackdrop}>
        <CreateUser
          userId={router.asPath.split('#')[1]}
          onSuccess={onSuccessCreate}
        />
      </Modal>
    </div>
  );
});

export default UsersList;
