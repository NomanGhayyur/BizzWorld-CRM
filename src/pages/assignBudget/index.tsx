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
  Input,
  Card,
} from "elements";
import { IUser } from "../../model/user";
import { AppThunkDispatch, RootState } from "../../redux/types";
import styles from "../../styles/ppc/PPC.module.css";
import { useQuery } from "react-query";
import { Roles } from "../../constant/app";
import { IRequestMeta } from "../../model/app";
import Loader from "../../components/shared/Loader";
import Image from "next/image";
import Delete from "../../../public/icons/delete.svg";
import Update from "../../../public/icons/update.svg";
import PPCDetail from "./budgetDetails/ppcBudgetDetails";
import { IPPC, IPPCListItem } from "../../model/ppc";
import { deletePPCBudget, getPPCBudgetList } from "../../api/budget";

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

const BudgetPPCList = React.memo<propTypes>((props) => {
  const dispatch = useDispatch<AppThunkDispatch>();
  const [sortKeys, setSortKeys] =
    useState<{ [key in string]: "asc" | "desc" }>();
  const [filterText, setFilterText] = useState<string>("");
  const user = useSelector((store: RootState) => store.auth.user);
  const router = useRouter();
  const modalRef = useRef<IModalRef>(null);
  const [ppcDetailsModal, setPPCDetailsModal] = useState(false);
  const [page, setPage] = useState(1);
  const [pageDetails, setPageDetails] = useState<pageDetailsProps>();

  const onSearchByText: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      setFilterText(e.target.value);
    }, []);

  const [acvtiveassignPPCId, setActiveAssignPPCId] = useState(0);

  const getList = async (id: string | number, pageId: string | number) => {
    const params = {
      data: {
        brand_id: id,
      },
    };
    const response = await dispatch(getPPCBudgetList(params));
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
  } = useQuery<Array<IPPC>>([`BudgetPPCList`, page], () => getList(page, ""), {
    enabled: !!user?.user_id,
    keepPreviousData: true,
  });

  useEffect(() => {
    if (router.asPath.split("#")[1]) {
      modalRef.current?.showModal(true);
    } else {
      modalRef.current?.showModal(false);
    }
  }, [router]);

  const onRowItemClick = (v: IPPC) => {
    setActiveAssignPPCId(v.assignppc_id);
    setPPCDetailsModal(true);
  };

  const onDelete = useCallback(
    async (
      assignppcId: IPPC["assignppc_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      try {
        const params = {
          data: {
            assignppc_id: assignppcId,
          },
        };
        await dispatch(deletePPCBudget(params));
        refetch();
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, refetch]
  );

  const onEdit = useCallback(
    (
      assignppcId: IPPC["assignppc_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      router.push(`/assignBudget/update/${assignppcId}`);
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
        keyIndex: "assignuser_name",
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterText} />
        ),
        sortable: true,
        sortIndex: "assignuser_name",
      },

      {
        label: "Amount",
        keyIndex: "assignppc_amount",
        render: (v: any) => (
          <Highlighter text={v || ""} searchText={filterText} />
        ),
      },
      {
        sortable: true,
        label: "Month",
        keyIndex: "assignppc_month",
        render: (v: any) => (
          <Highlighter text={v || ""} searchText={filterText} />
        ),
      },
      {
        label: "Created By",
        keyIndex: "creator",
        render: (v: any) => (
          <Highlighter text={v || ""} searchText={filterText} />
        ),
      },
    ];

    if (
      user &&
      ![Roles.SALES_AGENT, Roles.MARKETING_AGENT].includes(user?.role_id)
    ) {
      temp.push({
        label: "Actions",
        keyIndex: "assignppc_id,deleted_at",
        render: (v: any) => (
          <>
            <span
              style={{
                marginLeft: "3px",
                marginRight: "3px",
              }}
              title="Delete"
              onClick={onDelete.bind(this, v.assignppc_id)}
            >
              <Image src={Delete} alt="Alt" width={"25px"} />
            </span>
            <span
              style={{
                marginLeft: "3px",
                marginRight: "3px",
              }}
              title="Edit"
              onClick={onEdit.bind(this, v.assignppc_id)}
            >
              <Image src={Update} alt="Alt" width={"25px"} />
            </span>
          </>
        ),
      });
    }
    return temp;
  }, [filterText, onDelete, onEdit, user]);

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
        <PPCDetail assignppcId={acvtiveassignPPCId || 0} />
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
              <h4 style={{ fontWeight: "bold", fontSize: "16px" }}>
                PPC Budget List
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
                  onClick={() => router.push(`/assignBudget/create/`)}
                  style={{ marginTop: "23px", marginLeft: "15px" }}
                >
                  Assign Budget
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

export default BudgetPPCList;
