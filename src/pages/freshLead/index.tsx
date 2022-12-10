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
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./freshlead.module.css";
import Card from "../../components/shared/Card";
import { useDispatch, useSelector } from "react-redux";
import { AppThunkDispatch, RootState } from "../../redux/types";
import moment from "moment";
import { useQuery } from "react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { getUserBrandList } from "../../api/user";
import Loader from "../../components/shared/Loader";
import LeadDetail from "./[id]";
import List from "../../../public/icons/list.svg";
import {
  addFreshLeadFollowUp,
  getFreshLeadFollowUp,
  getFreshLeadList,
  submitFreshLead,
} from "../../api/freshlead";
import { DatePicker } from "antd";
import "antd/dist/antd.css";
import { IFollowUp } from "../../model/followup";
const { RangePicker } = DatePicker;

type propTypes = {
  leads?: Array<IFollowUp>;
  className?: string;
  style?: React.CSSProperties;
};

type pageDetailsProps = {
  perPage: number | undefined;
  currentPage: string | number;
  total: number | undefined;
};

const FreshLead = React.memo<propTypes>((props) => {
  const dispatch = useDispatch<AppThunkDispatch>();
  const formRef = useRef<HTMLFormElement>(null);
  const btnRef = useRef<HTMLButtonElement & IButtonRef>(null);
  const [sortKeys, setSortKeys] =
    useState<{ [key in string]: "asc" | "desc" }>();
  const [filterText, setFilterText] = useState<string>("");
  const user = useSelector((store: RootState) => store.auth.user);
  const modalRef = useRef<IModalRef>(null);
  const router = useRouter();
  const [brandID, setbrandId] = useState<number | string>(user?.brand1 || 1);
  const [leadtype, setleadType] = useState<number | string>(1);
  const [acvtiveFreshLeadId, setActiveFreshLeadId] = useState(0);
  const [leadDetailsModal, setLeadDetailsModal] = useState(false);
  const [page, setPage] = useState(1);
  const [pageDetails, setPageDetails] = useState<pageDetailsProps>();
  const [followUpModal, setFollowUpModal] = useState(false);
  const [freshLead, setFreshLead] = useState(0);
  console.log(acvtiveFreshLeadId, "acvtiveFreshLeadId");

  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let fullDate = `${day}-${month}-${year}`;
  let startDate = `01-${month}-${year}`;
  //@ts-ignore
  const [[startPickDate, endPickDate], setDatePick] = useState([]);
  //@ts-ignore
  const onChangePickDate = (dates) => setDatePick(dates || []);
  //@ts-ignore
  const pickstart = startPickDate?.format("YYYY-MM-DD") || startDate;
  //@ts-ignore
  const pickend = endPickDate?.format("YYYY-MM-DD") || fullDate;

  useEffect(() => {
    setleadType(leadtype);
  }, [leadtype]);

  const handlebrand = async (brandID: string) => {
    setbrandId(brandID);
  };

  const getList = async (
    id: string | number,
    pageId: number,
    from = pickstart,
    to = pickend
  ) => {
    const params = {
      params: {
        brand_id: id,
        page: pageId,
        from,
        to,
      },
    };
    const response = await dispatch(getFreshLeadList(params));

    return response.data;
  };
  const {
    data: leads,
    isLoading,
    refetch,
  } = useQuery<Array<IFollowUp>>(
    [`FreshLead_${brandID}`, page, pickend, pickend],
    () => getList(brandID, page, pickstart, pickend),
    {
      keepPreviousData: true,
    }
  );

  const getFollowup = async (freshLead: number) => {
    const params = {
      params: {
        freshlead_id: freshLead,
      },
    };
    const response = await dispatch(getFreshLeadFollowUp(params));
    return response.data;
  };
  const { data: followUps, refetch: refetchFollowUp } = useQuery<
    Array<IFollowUp>
  >([`FollowUps`], () => getFollowup(freshLead), {
    keepPreviousData: true,
  });

  const onSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      e.preventDefault();

      const CreateLead = async () => {
        if (formRef.current) {
          const params = {
            data: new FormData(formRef.current),
          };
          console.log(params, "form");
          params.data.append("brand_id", `${brandID}`);
          await dispatch(submitFreshLead(params));
        }
      };

      if (formRef.current) {
        btnRef.current?.setLoader(true);
        CreateLead();
        refetchFollowUp();
      }
    },
    [brandID, dispatch, refetchFollowUp]
  );

  useEffect(() => {
    if (router.asPath.split("#")[1]) {
      modalRef.current?.showModal(true);
    } else {
      modalRef.current?.showModal(false);
    }
  }, [router]);

  const onRowItemClick = (v: IFollowUp) => {
    setActiveFreshLeadId(v.freshlead_id);
    setLeadDetailsModal(true);
  };

  // const openFollowUpModal = useCallback(
  //   async (
  //     freshLeadId: IFollowUp["freshlead_id"],
  //     event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  //   ) => {
  //     try {
  //       console.log(freshLeadId, "id");
  //       event.stopPropagation();
  //       setFreshLead(freshLeadId);
  //       setFollowUpModal(true);
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   },
  //   []
  // );

  const openFollowUpModal = useCallback(
    (
      freshleadId: IFollowUp["freshlead_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      console.log(freshleadId, "freshleadId");
    },
    []
  );

  const addFollowUp: React.FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      e.preventDefault();

      const updateFollowUp = async () => {
        if (formRef.current) {
          const params = {
            data: new FormData(formRef.current),
          };
          params.data.append("freshlead_id", `${acvtiveFreshLeadId}`);
          await dispatch(addFreshLeadFollowUp(params));
        }
      };

      if (formRef.current) {
        btnRef.current?.setLoader(true);
        try {
          if (acvtiveFreshLeadId) {
            updateFollowUp();
            setFollowUpModal(false);
            refetch();
          } else {
          }
        } catch (e) {
          console.error(e);
        }
        btnRef.current?.setLoader(false);
      }
    },
    [acvtiveFreshLeadId, dispatch, refetch]
  );

  const columns = useMemo(() => {
    return [
      {
        label: "ID",
        keyIndex: "freshlead_id",
        render: (v: any, _: any, index: any) => parseInt(`${index + 1}`),
      },
      {
        label: "Name",
        keyIndex: "freshlead_name",
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterText} />
        ),

        sortIndex: "freshlead_name",
      },
      {
        label: "Email",
        keyIndex: "freshlead_email",
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterText} />
        ),
      },
      {
        label: "Contact",
        keyIndex: "freshlead_phone",
      },
      {
        label: "Create at",
        keyIndex: "created_at",
        render: (v: any) => moment(v).format("DD-MMM-YYYY"),
      },
      {
        label: "Comments",
        keyIndex: "freshlead_id",
        render: (v: any) => (
          <>
            <span
              style={{
                marginLeft: "3px",
                marginRight: "3px",
              }}
              title="Comments"
              onClick={openFollowUpModal.bind(this, v.freshlead_id)}
            >
              <Image src={List} alt="Alt" width={"25px"} />
            </span>
          </>
        ),
      },
    ];
  }, [filterText, openFollowUpModal]);

  const followUpColumns = useMemo(() => {
    return [
      {
        label: "Sr. No.",
        keyIndex: "lead_id",
        render: (v: any, _: any, index: any) => parseInt(`${index + 1}`),
      },
      {
        label: "Comment",
        keyIndex: "freshlead_name",
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterText} />
        ),

        sortIndex: "freshlead_name",
      },
      {
        label: "Email",
        keyIndex: "freshlead_email",
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterText} />
        ),
      },
      {
        label: "Contact",
        keyIndex: "freshlead_phone",
      },
      {
        sortable: true,
        label: "Create at",
        keyIndex: "created_at",
        render: (v: any) => moment(v).format("DD-MMM-YYYY"),
      },
    ];
  }, [filterText]);

  const onSearchByText: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      setFilterText(e.target.value);
    }, []);

  const filtered: Array<IFollowUp> = useMemo(() => {
    if (filterText) {
      return (
        leads?.filter((v: IFollowUp) => {
          return (
            //@ts-ignore
            v.freshlead_name
              ?.toLowerCase()
              ?.includes(filterText.toLowerCase()) ||
            //@ts-ignore
            v.freshlead_email?.toLowerCase()?.includes(filterText.toLowerCase())
          );
        }) || []
      );
    }
    return leads || [];
  }, [leads, filterText]);

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
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-2">
              <h4 style={{ fontWeight: "bold", fontSize: "16px" }}>
                Fresh Leads
              </h4>
            </div>
            <div className="col-lg-1">
              <Icon
                name={"arrow-left"}
                onClick={() => router.back()}
                style={{ marginTop: "13px" }}
              />
            </div>

            <div className="col-lg-3">
              <RangePicker
                style={{ width: "100%", marginTop: "0.6rem" }}
                size="large"
                placeholder={["Start Date", "End Date"]}
                onChange={onChangePickDate}
              />
            </div>

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

            <div className="col-lg-3">
              <Input
                style={{ marginTop: "10px" }}
                placeholder="Search Lead"
                onChange={onSearchByText}
              />
            </div>
          </div>
        </div>
        <div
          className="container-fluid"
          style={{
            boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
            borderRadius: "5px",
            marginTop: "1rem",
          }}
        >
          <div className="row">
            <div className="col-lg-12">
              <h4 style={{ fontWeight: "bold", fontSize: "16px" }}>
                Add New Lead
              </h4>
            </div>
          </div>
          <form onSubmit={onSubmit} ref={formRef}>
            <div className="row">
              <div className="col-lg-4">
                <Input
                  className={styles.inputfield}
                  type="floating"
                  label="Name"
                  name="freshlead_name"
                  required
                  style={{ border: "1px solid lightgrey" }}
                />
              </div>
              <div className="col-lg-4">
                <Input
                  style={{ border: "1px solid lightgrey" }}
                  className={styles.inputfield}
                  name="freshlead_email"
                  htmlType="Email"
                  type="floating"
                  label="Email"
                  labelClass={styles.inputlabel}
                  required
                />
              </div>
              <div className="col-lg-4">
                <Input
                  style={{ border: "1px solid lightgrey" }}
                  className={styles.inputfield}
                  type="floating"
                  htmlType="Number"
                  label="Contact"
                  name="freshlead_phone"
                  required
                />
              </div>
            </div>
            <div className="row" style={{ paddingBottom: "1rem" }}>
              <div className="col-lg-11">
                <Input
                  style={{ border: "1px solid lightgrey" }}
                  className={styles.inputfield}
                  type="floating"
                  label="Other Detail"
                  name="freshlead_otherdetail"
                  required
                />
              </div>
              <div className="col-lg-1">
                <Button
                  className="btn btn-primary btn-md"
                  htmlType="submit"
                  style={{ marginTop: "1.4rem", borderRadius: "3px" }}
                >
                  Create
                </Button>
              </div>
            </div>
          </form>
        </div>
        <div
          style={{
            marginTop: "1rem",
            height: "64vh",
            overflowY: "scroll",
          }}
        >
          <Table
            onSortData={(sortKey, direction) =>
              setSortKeys({ [sortKey as keyof IFollowUp]: direction })
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
          <LeadDetail leadId={acvtiveFreshLeadId || 0} />
        </Modal>
        <Modal
          style={{
            overflow: "hidden",
            minHeight: "25rem",
            maxHeight: "30rem",
            minWidth: "45rem",
            maxWidth: "50rem",
          }}
          show={followUpModal}
          onBackdrop={() => setFollowUpModal(false)}
        >
          <div className="container" style={{ marginTop: "1rem" }}>
            <div>
              <h4 style={{ margin: "0rem" }}>Follow Ups</h4>
            </div>
            <form ref={formRef} onSubmit={addFollowUp}>
              <div className="row">
                <div className="col-lg-10">
                  <Input
                    className={styles.inputfield}
                    type="floating"
                    label="Comment"
                    name="leadfollowup_comment"
                    required
                  />
                </div>
                <div className="col-lg-2">
                  <Button
                    className=""
                    style={{
                      background: "var(--bs-primary)",
                      marginTop: "1.44rem",
                      borderRadius: "3px",
                      width: "95%",
                    }}
                    ref={btnRef}
                    htmlType="submit"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </form>
            <div
              style={{ marginTop: "1rem", height: "45vh", overflowY: "scroll" }}
            >
              <Table
                // renderOnRowHover={renderOnRowHover}
                onSortData={(sortKey, direction) =>
                  setSortKeys({ [sortKey as keyof IFollowUp]: direction })
                }
                autoSort={true}
                loading={isLoading}
                onRowItemClick={onRowItemClick}
                pageSize={30}
                //@ts-ignore
                data={followUps}
                columnHeadings={followUpColumns}
              />
            </div>
          </div>
        </Modal>
      </Card>
    </>
  );
});
export default FreshLead;
