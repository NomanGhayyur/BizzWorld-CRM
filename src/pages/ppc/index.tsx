import moment from "moment";
import { useRouter } from "next/router";
import React, {
  useCallback,
  useMemo,
  useEffect,
  useState,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Table,
  Highlighter,
  Modal,
  IModalRef,
  IColumnHeading,
  Icon,
  Dropdown,
  IDropdownItem,
  Input,
  Card,
} from "elements";
import { IUser } from "../../model/user";
import { AppThunkDispatch, RootState } from "../../redux/types";
import styles from "../../styles/ppc/PPC.module.css";
import { useInfiniteQuery, useQuery } from "react-query";
import { deleteUser, getUserBrandList } from "../../api/user";
import { DATE_FORMAT, Roles } from "../../constant/app";
import { IRequestMeta } from "../../model/app";
import { getBrandUserList } from "../../api/brand";
import { getRoleList } from "../../api/role";
import Loader from "../../components/shared/Loader";
import Image from "next/image";
import Delete from "../../../public/icons/delete.svg";
import Update from "../../../public/icons/update.svg";
import PPCDetail from "./ppcDetails/ppcDetails";
import { deletePPC, getPPCList } from "../../api/ppc";
import { IPPC, IPPCListItem } from "../../model/ppc";
import { addDays } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import DateRangeCalendar from "../../components/shared/DateRange/dateRange";

type propTypes = {
  users?: Array<IUser>;
  className?: string;
  style?: React.CSSProperties;
};
type pageDetailsProps = {
  perPage: number | undefined;
  currentPage: string | number;
  total: number | undefined;
};
const PPCList = React.memo<propTypes>((props) => {
  const dispatch = useDispatch<AppThunkDispatch>();
  const [sortKeys, setSortKeys] =
    useState<{ [key in string]: "asc" | "desc" }>();
  const [filterText, setFilterText] = useState<string>("");
  const [meta, setMeta] = useState<IRequestMeta>();
  const user = useSelector((store: RootState) => store.auth.user);
  const router = useRouter();
  const modalRef = useRef<IModalRef>(null);
  const [ppcDetailsModal, setPPCDetailsModal] = useState(false);
  const [page, setPage] = useState(1);
  const [pageDetails, setPageDetails] = useState<pageDetailsProps>();

  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  const onSearchByText: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      setFilterText(e.target.value);
    }, []);

  const [brandID, setbrandId] = useState<number | string>(user?.brand1 || 1);
  const [roleID, setroledId] = useState<number | string | null>(null);
  const [acvtivePPCId, setActivePPCId] = useState(0);

  const handlebrand = async (brandID: string) => {
    setbrandId(brandID);
  };

  const handlerole = async (roleID: string) => {
    setroledId(roleID);
  };

  const getList = async (id: string | number, pageId: string | number) => {
    const params = {
      data: {
        brand_id: id,
      },
    };
    const response = await dispatch(getPPCList(params));
    if (pageId === 1) {
      setPageDetails({
        currentPage: response.data.current_page,
        perPage: response.data.per_page,
        total: response.data.total,
      });
    }
    return response.data;
  };

  const {
    data: ppc,
    isLoading,
    isFetching,
    refetch,
  } = useQuery<Array<IPPC>>(
    [`PPCList_${brandID}`, brandID, page],
    () => getList(brandID, page),
    {
      enabled: !!brandID && !!user?.user_id,
      keepPreviousData: true,
    }
  );

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

  const { data: roles } = useQuery(
    `Roles`,
    async () => {
      const response = await dispatch(getRoleList());
      return response.data;
    },
    {
      // enabled: !!user?.user_id,
    }
  );

  useEffect(() => {
    if (router.asPath.split("#")[1]) {
      modalRef.current?.showModal(true);
    } else {
      modalRef.current?.showModal(false);
    }
  }, [router]);

  const onRowItemClick = (v: IPPC) => {
    setActivePPCId(v.ppc_id);
    setPPCDetailsModal(true);
  };

  const onDelete = useCallback(
    async (
      ppcId: IPPC["ppc_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      try {
        const params = {
          data: {
            ppc_id: ppcId,
          },
        };
        await dispatch(deletePPC(params));
        refetch();
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, refetch]
  );

  const onRestore = useCallback(
    async (
      userId: IUser["user_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
    },
    []
  );

  const onEdit = useCallback(
    (
      ppcId: IPPC["ppc_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      router.push(`/ppc/update/${ppcId}`);
    },
    [router]
  );

  const columns = useMemo(() => {
    const temp: Array<IColumnHeading> = [
      {
        label: "ID",
        keyIndex: "ppc_id",
        render: (v: any, _: any, index: any) => parseInt(`${index + 1}`),
      },
      {
        label: "Name",
        keyIndex: "brand_name",
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterText} />
        ),
        sortable: true,
        sortIndex: "brand_name",
      },

      {
        label: "Amount",
        keyIndex: "ppc_amount",
        render: (v: any) => (
          <Highlighter text={v || ""} searchText={filterText} />
        ),
      },
      {
        label: "Created By",
        keyIndex: "user_name",
        render: (v: any) => (
          <Highlighter text={v || ""} searchText={filterText} />
        ),
      },
      {
        sortable: true,
        label: "Date",
        keyIndex: "ppc_date",
        render: (v: any) => moment(v).format(DATE_FORMAT),
      },
    ];

    if (
      user &&
      ![Roles.SALES_AGENT, Roles.MARKETING_AGENT].includes(user?.role_id)
    ) {
      temp.push({
        label: "Actions",
        keyIndex: "ppc_id,deleted_at",
        render: (v: any) => (
          <>
            {!v.status_id ? (
              <span
                style={{
                  marginLeft: "3px",
                  marginRight: "3px",
                }}
                title="Delete"
                onClick={onDelete.bind(this, v.ppc_id)}
              >
                <Image src={Delete} alt="Alt" width={"25px"} />
              </span>
            ) : (
              <span className="arrowclock">
                <Icon
                  className=""
                  name="arrow-counterclockwise"
                  onClick={onRestore.bind(this, v.ppc_id)}
                />
              </span>
            )}
            <span
              style={{
                marginLeft: "3px",
                marginRight: "3px",
              }}
              title="Edit"
              onClick={onEdit.bind(this, v.ppc_id)}
            >
              <Image src={Update} alt="Alt" width={"25px"} />
            </span>
          </>
        ),
      });
    }
    return temp;
  }, [filterText, onDelete, onRestore, onEdit, user]);

  const filtered: Array<IPPCListItem> = useMemo(() => {
    if (filterText) {
      return (
        ppc?.filter((v: IPPCListItem) => {
          return v.brand_name
            ?.toLowerCase()
            ?.includes(filterText.toLowerCase());
        }) || []
      );
    }
    return ppc || [];
  }, [filterText, ppc]);

  const onBackdrop = useCallback(() => {
    if (router.asPath.split("#")[1]) {
      router.replace({ pathname: router.pathname, query: router.query });
    }
  }, [router]);

  const onSuccessCreate = useCallback(() => {
    onBackdrop();
  }, [onBackdrop]);

  const rowClassGenerator = useCallback(
    (row: IUser) => (row?.deleted_at ? "table__rowStrike" : ""),
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
    <>
      <Modal
        style={{ overflow: "hidden", minHeight: "300px", maxHeight: "380px" }}
        show={ppcDetailsModal}
        onBackdrop={() => setPPCDetailsModal(false)}
      >
        <PPCDetail ppcId={acvtivePPCId || 0} />
      </Modal>
      <Card
        className={styles.brandList__container}
        style={{
          border: "none",
          boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
          borderRadius: "5px",
        }}
      >
        <div>
          <div className="row" style={{}}>
            <div className="col-lg-2">
              <h4 style={{ fontWeight: "bold", fontSize: "16px" }}>PPC List</h4>
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
              <div className="col-lg-3">
                <DateRangeCalendar />
              </div>
              <div className="col-3" style={{ marginRight: "10px" }}>
                {userBrand ? (
                  <Dropdown
                    style={{
                      width: "100%",
                      height: "52px",
                      marginTop: "15px",
                    }}
                    placeholder="Select Brand"
                    defaultKey="brand_id"
                    options={userBrand}
                    name="brand_id"
                    type="light"
                    className={styles.selectbrandoptioninusertable}
                    onItemClick={(brandID) => handlebrand(brandID)}
                    value={brandID.toString()}
                  />
                ) : null}
              </div>
              <div className="col-3" style={{ marginRight: "10px" }}>
                <Input
                  style={{ marginTop: "15px" }}
                  placeholder="Search PPC"
                  onChange={onSearchByText}
                />
              </div>
              <div className={`text-right ${styles.brandtableiconsswitchdiv}`}>
                <Button
                  iconName="plus"
                  onClick={() => router.push(`/ppc/create/`)}
                  style={{ marginTop: "23px", marginLeft: "15px" }}
                >
                  Create PPC
                </Button>
              </div>
            </div>
          </div>

          <Table
            onSortData={(sortKey, direction) =>
              setSortKeys({ [sortKey as keyof IUser]: direction })
            }
            autoSort={true}
            loading={isLoading}
            onRowItemClick={onRowItemClick}
            data={props.users || filtered || []}
            rowClass={rowClassGenerator}
            onPageChange={(p) => setPage(p)}
            pageSize={pageDetails?.perPage}
            currentPage={page}
            total={pageDetails?.total}
            columnHeadings={columns}
          />
        </div>
      </Card>
    </>
  );
});

export default PPCList;
