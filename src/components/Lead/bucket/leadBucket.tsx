import {
  Table,
  Highlighter,
  IModalRef,
  Icon,
  Input,
  Dropdown,
  IDropdownItem,
  Button,
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
import styles from "./bucket.module.css";
import Card from "../../shared/Card";
import { useDispatch, useSelector } from "react-redux";
import { AppThunkDispatch, RootState } from "../../../redux/types";
import moment from "moment";
import { useQuery } from "react-query";
import { deleteLead, getforwardedLeadList } from "../../../api/lead";
import { ILead, ILeadListItem } from "../../../model/lead";
import Image from "next/image";
import { useRouter } from "next/router";
import { getUserBrandList } from "../../../api/user";
import {
  cancellead,
  getPickedLeadList,
  pickLead,
  unpicklead,
} from "../../../api/pick";
import { Roles } from "../../../constant/app";
import Loader from "../../shared/Loader";
import LeadDetail from "../../../pages/lead/leadDetails/leadDetails";
import Pick from "../../../../public/icons/pick.svg";
import Delete from "../../../../public/icons/delete.svg";
import Update from "../../../../public/icons/update.svg";
import Unpick from "../../../../public/icons/unpick.svg";
import Create from "../../../../public/icons/createicon.svg";
import Cancel from "../../../../public/icons/cancel.svg";

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
type pickPageDetailsProps = {
  pickperPage: number | undefined;
  pickcurrentPage: string | number;
  picktotal: number | undefined;
};

const BucketList = React.memo<propTypes>((props) => {
  const dispatch = useDispatch<AppThunkDispatch>();
  const [sortKeys, setSortKeys] =
    useState<{ [key in string]: "asc" | "desc" }>();
  const [filterText, setFilterText] = useState<string>("");
  const [filterforwardedText, setFilterForwardedText] = useState<string>("");

  const user = useSelector((store: RootState) => store.auth.user);
  const modalRef = useRef<IModalRef>(null);
  const router = useRouter();
  const [acvtiveLeadId, setActiveLeadId] = useState(0);
  const [leadDetailsModal, setLeadDetailsModal] = useState(false);
  // const [leadstatus, setleadStatus] = useState<number | string>(2);
  const [brandID, setbrandId] = useState<number | string>(user?.brand1 || 1);

  const [page, setPage] = useState(1);
  const [pageDetails, setPageDetails] = useState<pageDetailsProps>();

  const [pickpage, setPickPage] = useState(1);
  const [pickpageDetails, setPickPageDetails] =
    useState<pickPageDetailsProps>();

  const handlebrand = async (brandID: string) => {
    setbrandId(brandID);
  };

  const getList = async (id: string | number, pageId: string | number) => {
    const params = {
      data: {
        brand_id: id,
        page: pageId,
      },
    };
    const response = await dispatch(getforwardedLeadList(params));
    if (pageId === 1) {
      setPageDetails({
        currentPage: response.data.current_page,
        perPage: response.data.per_page,
        total: response.data.total,
      });
    }
    return response.data.data;
  };
  const {
    data: forwardedleads,
    isError,
    error,
    data,
    isPreviousData,
    refetch: refetchForwardedLeads,
  } = useQuery<Array<ILeadListItem>>(
    [`ForwardedLeadList_${brandID}`, brandID, page],
    () => getList(brandID, page),
    {
      enabled: !!brandID && !!user?.user_id,
    }
  );

  const getPickList = async (
    id: string | number,
    pickpageId: string | number
  ) => {
    const params = {
      data: {
        page: pickpageId,
        leadstatus_id: 2,
      },
    };
    const response = await dispatch(getPickedLeadList(params));
    if (pickpageId === 1) {
      setPickPageDetails({
        pickcurrentPage: response.data.current_page,
        pickperPage: response.data.per_page,
        picktotal: response.data.total,
      });
    }
    return response.data.data;
  };
  const {
    data: picklead,
    isFetching,
    isLoading,
    refetch: refetchPickedLeads,
  } = useQuery<Array<ILeadListItem>>(
    [`PickedLeadList_${brandID}`, brandID, page],
    () => getPickList(brandID, page),
    {
      enabled: !!brandID && !!user?.user_id,
    }
  );

  const refetchBothList = useCallback(async () => {
    await refetchForwardedLeads();
    await refetchPickedLeads();
  }, [refetchForwardedLeads, refetchPickedLeads]);

  const onUnpick = useCallback(
    async (
      leadId: ILeadListItem["lead_id"],
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
        refetchBothList();
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, refetchBothList]
  );

  const onCancel = useCallback(
    async (
      leadId: ILeadListItem["lead_id"],
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
        refetchPickedLeads();
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, refetchPickedLeads]
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
        refetchForwardedLeads();
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, refetchForwardedLeads]
  );

  const onPick = useCallback(
    async (
      leadId: ILeadListItem["lead_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      try {
        const params = {
          data: {
            lead_id: leadId,
          },
        };
        await dispatch(pickLead(params));
        refetchBothList();
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, refetchBothList]
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

  const pickcolumns = useMemo(() => {
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
        render: (v: any) => (
          <Highlighter text={v || ""} searchText={filterText} />
        ),
      },
      {
        label: "Status",
        keyIndex: "leadstatus_name",
        sortable: true,
        render: (v: any) => (
          <Highlighter text={v || ""} searchText={filterText} />
        ),
      },
      {
        // sortable: true,
        label: "Create at",
        keyIndex: "created_at",
        render: (v: any) => moment(v).format("DD-MMM-YYYY"),
      },
      {
        label: "Actions",
        keyIndex: "lead_id,deleted_at",
        render: (v: any) => (
          <div className="">
            <span
              title="Unpick"
              style={{
                marginLeft: "3px",
                marginRight: "3px",
              }}
              onClick={onUnpick.bind(this, v.lead_id)}
            >
              <Image src={Unpick} alt="Alt" width={"25px"} />
            </span>
            <span
              title="Create Order"
              style={{
                marginLeft: "3px",
                marginRight: "3px",
              }}
              // onClick={onCreateOrder.bind(this, v.lead_id)}

              onClick={() =>
                router.push({
                  pathname: "/order/create",
                  query: {
                    lead_id: v.lead_id,
                  },
                })
              }
            >
              <Image src={Create} alt="Alt" width={"25px"} />
            </span>
            {user && [Roles.SUPER_ADMIN].includes(user?.role_id) ? (
              <span
                title="Cancel"
                style={{
                  marginLeft: "3px",
                  marginRight: "3px",
                }}
                onClick={onCancel.bind(this, v.lead_id)}
              >
                <Image src={Cancel} alt="Alt" width={"25px"} />
              </span>
            ) : null}
          </div>
        ),
      },
    ];
  }, [filterText, onCancel, onUnpick, router, user]);

  const forwardedcolumns = useMemo(() => {
    const temp = [
      {
        label: "ID",
        keyIndex: "lead_id",
        render: (v: any, _: any, index: any) => parseInt(`${index + 1}`),
      },
      {
        label: "Name",
        keyIndex: "lead_name",
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterforwardedText} />
        ),
        sortable: true,
        sortIndex: "lead_name",
      },
      {
        label: "Bussiness Name",
        keyIndex: "lead_bussinessname",
        render: (v: any) => (
          <Highlighter text={v || ""} searchText={filterforwardedText} />
        ),
      },
      {
        label: "Email",
        keyIndex: "lead_email",
        render: (v: any) => (
          <Highlighter text={v || ""} searchText={filterforwardedText} />
        ),
      },
      {
        label: "Status",
        keyIndex: "leadstatus_name",
        render: (v: any) => (
          <Highlighter text={v || ""} searchText={filterforwardedText} />
        ),
      },
      {
        sortable: true,
        label: "Create at",
        keyIndex: "created_at",
        render: (v: any) => moment(v).format("DD-MMM-YYYY"),
      },
    ];
    if (user && ![Roles.MARKETING_AGENT].includes(user?.role_id)) {
      temp.push({
        label: "Actions",
        keyIndex: "lead_id,deleted_at",
        render: (v: any) => (
          <>
            {user && [Roles.SUPER_ADMIN].includes(user?.role_id) ? (
              // <Icon
              //   className="m-1 downloadicon"
              //   name="download"
              //   onClick={onPick.bind(this, v.lead_id)}
              // />
              <>
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

                <span
                  style={{
                    marginLeft: "3px",
                    marginRight: "3px",
                  }}
                  title="Edit"
                  onClick={onEdit.bind(this, v.lead_id)}
                >
                  <Image src={Update} alt="Alt" width={"25px"} />
                </span>
              </>
            ) : null}

            <span
              title="Pick"
              style={{
                marginLeft: "3px",
                marginRight: "3px",
              }}
              onClick={onPick.bind(this, v.lead_id)}
            >
              <Image src={Pick} alt="Alt" width={"25px"} />
            </span>
          </>
        ),
      });
    }
    return temp;
  }, [user, filterforwardedText, onPick, onDelete, onEdit]);

  const onSearchByText: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      setFilterText(e.target.value);
    }, []);

  const onSearchByTextForwarded: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      setFilterForwardedText(e.target.value);
    }, []);

  const filtered: Array<ILeadListItem> = useMemo(() => {
    if (filterforwardedText) {
      return (
        forwardedleads?.filter((v: ILeadListItem) => {
          return (
            v.lead_name
              ?.toLowerCase()
              ?.includes(filterforwardedText.toLowerCase()) ||
            v.lead_email
              ?.toLowerCase()
              ?.includes(filterforwardedText.toLowerCase()) ||
            v.lead_bussinessname
              ?.toLowerCase()
              ?.includes(filterforwardedText.toLowerCase())
          );
        }) || []
      );
    }
    return forwardedleads || [];
  }, [forwardedleads, filterforwardedText]);
  const filteredpick: Array<ILeadListItem> = useMemo(() => {
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
        style={{
          maxHeight: "48vh",
          overflowY: "scroll",
          marginTop: "0.5%",
          border: "none",
          boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
          borderRadius: "5px",
        }}
      >
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-2">
              <h4 style={{ fontWeight: "bold", fontSize: "16px" }}>
                Forwarded Lead List
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
                  style={{ marginTop: "10px" }}
                  placeholder="Search Forwarded Lead"
                  onChange={onSearchByTextForwarded}
                />
              </div>
              <div className="col-3" style={{ marginRight: "10px" }}>
                {userBrand ? (
                  <Dropdown
                    className={styles.abcdropdown}
                    style={{ width: "100%", marginTop: "10px" }}
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
                {user &&
                [
                  Roles.SALES_AGENT,
                  Roles.MARKETING_HEAD,
                  Roles.SUPER_ADMIN,
                  Roles.MARKETING_AGENT,
                ].includes(user?.role_id) ? (
                  <Button
                    style={{ marginTop: "10px" }}
                    iconName="plus"
                    onClick={() =>
                      router.push({
                        pathname: "/lead/create",
                        // query: { brand_id: brand?.brand_id },
                      })
                    }
                  >
                    Create Lead
                  </Button>
                ) : null}
              </div>
            </div>
          </div>

          <Table
            onSortData={(sortKey, direction) =>
              setSortKeys({ [sortKey as keyof ILeadListItem]: direction })
            }
            autoSort={true}
            loading={isLoading}
            onRowItemClick={onRowItemClick}
            data={filtered}
            columnHeadings={forwardedcolumns}
            onPageChange={(p) => setPage(p)}
            pageSize={pageDetails?.perPage}
            currentPage={page}
            total={pageDetails?.total}
            style={{
              maxHeight: "48vh",
              overflowY: "scroll",
              marginTop: "0.5%",
            }}
          />
        </div>
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
      <Card
        style={{
          maxHeight: "48vh",
          overflowY: "scroll",
          marginTop: "0.5%",
          border: "none",
          boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
          borderRadius: "5px",
        }}
      >
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-2">
              <h4 style={{ fontWeight: "bold", fontSize: "16px" }}>
                Picked Lead List
              </h4>
            </div>
            <div className="col-lg-1">
              <Icon
                name={"arrow-left"}
                onClick={() => router.back()}
                style={{ marginTop: "13px" }}
              />
            </div>
            <div className="col-lg-1"></div>
            <div className="col-lg-3"></div>
            <div className="col-lg-2"></div>
            <div className="col-lg-3">
              <Input
                placeholder="Search Picked Lead"
                onChange={onSearchByText}
                style={{ marginTop: "15px" }}
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
            data={filteredpick}
            columnHeadings={pickcolumns}
            onPageChange={(p) => setPickPage(p)}
            pageSize={pickpageDetails?.pickperPage}
            currentPage={pickpage}
            total={pickpageDetails?.picktotal}
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
          <LeadDetail leadId={acvtiveLeadId || 0} />
        </Modal> */}
      </Card>
    </>
  );
});
export default BucketList;
