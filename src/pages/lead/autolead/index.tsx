import {
  Table,
  Highlighter,
  IModalRef,
  Icon,
  Input,
  Uploader,
  Dropdown,
  IDropdownItem,
  IButtonRef,
  Button,
  Spinner,
  Modal,
} from "elements";
import { NextPage } from "next";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./autolead.module.css";
import Card from "../../../components/shared/Card";
import { useDispatch, useSelector } from "react-redux";
import { AppThunkDispatch, RootState } from "../../../redux/types";
import moment from "moment";
import { useQuery } from "react-query";
import {
  deleteLead,
  getLeadList,
  getforwardedLeadList,
  getAutomanualLeadList,
} from "../../../api/lead";
import { ILead, ILeadListItem } from "../../../model/lead";
import Image from "next/image";
import { useRouter } from "next/router";
import { getUserBrandList } from "../../../api/user";
import { pickLead } from "../../../api/pick";
import Loader from "../../../components/shared/Loader";
import LeadDetail from "../leadDetails/leadDetails";
import Delete from "../../../../public/icons/delete.svg";
import Update from "../../../../public/icons/update.svg";

type propTypes = {
  leads?: Array<ILead>;
  className?: string;
  style?: React.CSSProperties;
};

type pageDetailsProps = {
  perPage: number | undefined;
  currentPage: string | number;
  total: number | undefined;
};

const AutoLeadList = React.memo<propTypes>((props) => {
  const dispatch = useDispatch<AppThunkDispatch>();
  const [sortKeys, setSortKeys] =
    useState<{ [key in string]: "asc" | "desc" }>();
  const [filterText, setFilterText] = useState<string>("");
  const [appliedFilters, setFilters] =
    useState<{ [key in string]: string | number }>();
  const [borderView, setBorderView] = useState<boolean>(false);
  const user = useSelector((store: RootState) => store.auth.user);
  const modalRef = useRef<IModalRef>(null);
  const router = useRouter();
  const [brandID, setbrandId] = useState<number | string>(user?.brand1 || 1);
  const [leadtype, setleadType] = useState<number | string>(1);
  const [acvtiveLeadId, setActiveLeadId] = useState(0);
  const [leadDetailsModal, setLeadDetailsModal] = useState(false);
  const [page, setPage] = useState(1);
  const [pageDetails, setPageDetails] = useState<pageDetailsProps>();

  useEffect(() => {
    setleadType(leadtype);
  }, [leadtype]);

  const handlebrand = async (brandID: string) => {
    setbrandId(brandID);
  };
  //   const id = 2; //static for testing

  const getList = async (id: string | number, pageId: string | number) => {
    const params = {
      data: {
        brand_id: id,
        page: pageId,
        leadtype_id: leadtype,
      },
    };
    const response = await dispatch(getAutomanualLeadList(params));
    if (pageId === 1) {
      setPageDetails({
        currentPage: response.data.current_page,
        perPage: response.data.per_page,
        total: response.data.total,
      });
    }
    return response.data.data;
  };
  // const getList = async (id: string | number) => {
  //   const params = {
  //     data: {
  //       brand_id: id,
  //       leadtype_id: leadtype,
  //     },
  //   };
  //   // params.data.append('leadtypeID', `${type}`);
  //   const response = await dispatch(getAutomanualLeadList(params));
  //   return response.data.data;
  // };

  const {
    data: leads,
    isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData,
    refetch,
  } = useQuery<Array<ILeadListItem>>(
    [`AutoLeadList_${brandID}`, brandID.toLocaleString, page],
    () => getList(brandID, page),
    {
      enabled: !!brandID && !!user?.user_id,
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (router.asPath.split("#")[1]) {
      modalRef.current?.showModal(true);
    } else {
      modalRef.current?.showModal(false);
    }
  }, [router]);

  const onRowItemClick = (v: ILead) => {
    setActiveLeadId(v.lead_id);
    setLeadDetailsModal(true);
  };
  // const onRowItemClick = useCallback(
  //   (lead: ILeadListItem) => {
  //     router.push(`/lead/${lead.lead_id}`);
  //   },
  //   [router]
  // );

  const onDelete = useCallback(
    async (
      leadId: ILead["lead_id"],
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

  // const onPick = useCallback(
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
  //       await dispatch(pickLead(params));
  //       refetch();
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   },
  //   [dispatch, refetch]
  // );

  const onRestore = useCallback(
    async (
      leadId: ILeadListItem["lead_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
    },
    []
  );

  const onEdit = useCallback(
    (
      leadId: ILeadListItem["lead_id"],
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
        label: "ID",
        keyIndex: "lead_id",
        render: (v: any, _: any, index: any) => parseInt(`${index + 1}`),
      },
      {
        label: "Name",
        keyIndex: "lead_name",
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterText} />
        ),
        sortable: true,
        sortIndex: "lead_name",
      },
      {
        label: "Bussiness Name",
        keyIndex: "lead_bussinessname",
        render: (v: any) => (
          <Highlighter text={v || ""} searchText={filterText} />
        ),
      },
      {
        label: "Email",
        keyIndex: "lead_email",
      },
      {
        label: "Status",
        keyIndex: "leadstatus_name",
        render: (v: any) => (
          <Highlighter text={v || ""} searchText={filterText} />
        ),
      },
      {
        sortable: true,
        label: "Create at",
        keyIndex: "created_at",
        render: (v: any) => moment(v).format("DD-MMM-YYYY"),
      },
      {
        label: "Actions",
        keyIndex: "lead_id,deleted_at",
        render: (v: any) => (
          <>
            {!v.deleted_at ? (
              <span
                style={{
                  marginLeft: "3px",
                  marginRight: "3px",
                }}
                title="Delete"
                onClick={onDelete.bind(this, v.lead_id)}
              >
                <Image src={Delete} alt="Alt" width={"25px"} />
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
                marginLeft: "3px",
                marginRight: "3px",
              }}
              title="Update"
              onClick={onEdit.bind(this, v.lead_id)}
            >
              <Image src={Update} alt="Alt" width={"25px"} />
            </span>
            {/* <span className='downloadicon'>
              <Icon
                className="m-1"
                name="download"
                onClick={onPick.bind(this, v.lead_id)}
              />
            </span> */}
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
    if (router.asPath.split("#")[1]) {
      router.replace({ pathname: router.pathname, query: router.query });
    }
  }, [router]);

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

  const renderOnRowHover = (row: ILeadListItem, index: number) => {};
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
        style={{ height: "100vh" }}
      >
        <Loader fullPage />
      </div>
    );
  }
  return (
    <>
      <Card
        className={styles.brandList__container}
        style={{
          border: "none",
          boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
          borderRadius: "5px",
        }}
      >
        <div className="row">
          <div className="col-lg-2">
            <h4 style={{ fontWeight: "bold", fontSize: "16px" }}>Auto Lead</h4>
          </div>
          <div className="col-lg-1">
            <Icon
              name={"arrow-left"}
              onClick={() => router.back()}
              style={{ marginTop: "13px" }}
            />
          </div>
          <div className="col-lg-2"></div>
          <div className="col-lg-3">
            {userBrand ? (
              <Dropdown
                className={styles.brandtypedropdown}
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

          <div className="col-lg-4">
            <Input
              style={{ marginTop: "10px" }}
              placeholder="Search Lead"
              onChange={onSearchByText}
            />
          </div>
        </div>

        <Table
          // renderOnRowHover={renderOnRowHover}
          onSortData={(sortKey, direction) =>
            setSortKeys({ [sortKey as keyof ILeadListItem]: direction })
          }
          autoSort={true}
          loading={isLoading}
          onRowItemClick={onRowItemClick}
          onPageChange={(p) => setPage(p)}
          pageSize={pageDetails?.perPage}
          currentPage={page}
          total={pageDetails?.total}
          data={filtered}
          columnHeadings={columns}
        />
        <Modal
          style={{
            overflow: "hidden",
            minHeight: "470px",
            maxHeight: "630px",
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
export default AutoLeadList;
