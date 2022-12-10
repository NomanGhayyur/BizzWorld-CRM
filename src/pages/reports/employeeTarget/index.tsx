import {
  Table,
  Highlighter,
  IModalRef,
  Icon,
  Input,
  Dropdown,
  IDropdownItem,
  Modal,
  Button,
  IButtonRef,
  Avatar,
} from "elements";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./target.module.css";
import Card from "../../../components/shared/Card";
import { useDispatch, useSelector } from "react-redux";
import { AppThunkDispatch, RootState } from "../../../redux/types";
import moment from "moment";
import { useQuery } from "react-query";
import { deleteLead, getAutomanualLeadList } from "../../../api/lead";

import Image from "next/image";
import { useRouter } from "next/router";
import { getUserBrandList } from "../../../api/user";
import Loader from "../../../components/shared/Loader";
import Delete from "../../../../public/icons/delete.svg";
import Update from "../../../../public/icons/update.svg";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { PaymentStatus } from "../../../api/payment";
import {
  addTarget,
  getNonTargetReport,
  getTargetDetails,
  getTargetReport,
  updateTarget,
} from "../../../api/report";
import { IReport, IReportListItem } from "../../../model/report";
import AvatarStatus from "../../../components/shared/AvatarStatus";

type propTypes = {
  nonTarget?: Array<IReport>;
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
  const formRef = useRef<HTMLFormElement>(null);
  const btnRef = useRef<HTMLButtonElement & IButtonRef>(null);
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
  const [acvtiveUserId, setActiveUserId] = useState(0);
  const [acvtiveTargetId, setActiveTargetId] = useState(0);
  const [acvtiveTarge, setActiveTarget] = useState<number | string>();
  const [addTargetModal, setAddTargetModal] = useState(false);
  const [editTargetModal, setEditTargetModal] = useState(false);
  const [page, setPage] = useState(1);
  const [pageDetails, setPageDetails] = useState<pageDetailsProps>();
  const [profilepath, setProfilePath] = useState("");

  useEffect(() => {
    setleadType(leadtype);
  }, [leadtype]);

  const current = new Date();
  const date = `${current.getFullYear()}-${current.getMonth() + 1}`;
  const [month, setYearMonth] = useState<number | string>(date);
  const onChange = (date: any, dateString: any) => {
    console.log(dateString);
    setYearMonth(dateString);
  };

  const handlebrand = async (brandID: string) => {
    setbrandId(brandID);
  };
  //   const id = 2; //static for testing

  const {
    data: nonTarget,
    isFetching,
    isLoading,
    refetch,
  } = useQuery<Array<IReportListItem>>(
    `NonTargetReport${brandID}${month}`,
    async () => {
      const params = {
        data: {
          brand_id: brandID,
          usertarget_month: month,
        },
      };
      const response = await dispatch(getNonTargetReport(params));
      setProfilePath(response.profilepath);
      return response.nontargetemployeedata;
    },
    {
      enabled: !!user?.user_id,
    }
  );

  const { data: target } = useQuery<Array<IReportListItem>>(
    `TargetReport${brandID}${month}`,
    async () => {
      const params = {
        data: {
          brand_id: brandID,
          usertarget_month: month,
        },
      };
      const response = await dispatch(getTargetReport(params));
      setProfilePath(response.profilepath);
      return response.targetemployeedata;
    },
    {
      enabled: !!user?.user_id,
    }
  );

  const { data: targetdetails } = useQuery<Array<IReportListItem>>(
    `TargetDetails${acvtiveUserId}`,
    async () => {
      const params = {
        data: {
          target_userid: acvtiveUserId,
        },
      };
      const response = await dispatch(getTargetDetails(params));
      setProfilePath(response.profilepath);
      return response.usertargetata;
    },
    {
      enabled: !!user?.user_id,
    }
  );

  useEffect(() => {
    if (router.asPath.split("#")[1]) {
      modalRef.current?.showModal(true);
    } else {
      modalRef.current?.showModal(false);
    }
  }, [router]);

  const onRowAddClick = (v: IReport) => {
    setActiveUserId(v.user_id);
    console.log(v, "v");
    setAddTargetModal(true);
  };
  const onRowEditClick = (v: IReport) => {
    setActiveTargetId(v.usertarget_id);
    setActiveUserId(v.user_id);
    setActiveTarget(v.usertarget_target);
    setEditTargetModal(true);
  };
  const onGetTargetClick = (v: IReport) => {
    setActiveTarget(v.usertarget_target);
  };

  const onAddTarget: React.FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      e.preventDefault();
      const addNewTarget = async () => {
        if (formRef.current) {
          const params = {
            data: new FormData(formRef.current),
          };
          params.data.append("usertarget_month", `${month}`);
          params.data.append("usertarget_userid", `${acvtiveUserId}`);
          params.data.append("brand_id", `${brandID}`);
          await dispatch(addTarget(params));
        }
      };
      addNewTarget();
    },
    [acvtiveUserId, brandID, dispatch, month]
  );

  const onEditTarget: React.FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      e.preventDefault();
      const addNewTarget = async () => {
        if (formRef.current) {
          const params = {
            data: new FormData(formRef.current),
          };
          params.data.append("usertarget_id", `${acvtiveTargetId}`);
          await dispatch(updateTarget(params));
        }
      };
      addNewTarget();
    },
    [acvtiveTargetId, dispatch]
  );

  const targetColumn = useMemo(() => {
    const temp = [
      {
        label: "Sr. No.",
        keyIndex: "user_id",
        render: (v: any, _: any, index: any) => parseInt(`${index + 1}`),
      },
      {
        label: "Name",
        keyIndex: "user_picture,user_name",
        render: (v: any) => (
          <div className="d-flex">
            <AvatarStatus
              //   src={user_image + record.user_picture}
              src={`${profilepath}${v.user_picture}`}
              size={50}
              name={v.user_name}
              text={""}
              type={""}
              icon={""}
              suffix={""}
              subTitle={""}
              shape={""}
              gap={0} // subTitle={"noman@gmail.com"}
            />
          </div>
        ),
      },
      {
        label: "Total Orders",
        keyIndex: "usertarget_target",
        render: (v: any) => <>$ {v}</>,
      },

      {
        label: "Commission",
        keyIndex: "usertarget_month",
        render: (v: any) => <>${v}</>,
      },
    ];
    return temp;
  }, [profilepath]);

  const nonTargetColumn = useMemo(() => {
    const temp = [
      {
        label: "Sr. No.",
        keyIndex: "user_id",
        render: (v: any, _: any, index: any) => parseInt(`${index + 1}`),
      },
      {
        label: "Name",
        keyIndex: "user_picture,user_name",
        render: (v: any) => (
          <div className="d-flex">
            <AvatarStatus
              //   src={user_image + record.user_picture}
              src={`${profilepath}${v.user_picture}`}
              size={50}
              name={v.user_name}
              text={""}
              type={""}
              icon={""}
              suffix={""}
              subTitle={""}
              shape={""}
              gap={0} // subTitle={"noman@gmail.com"}
            />
          </div>
        ),
      },
    ];
    return temp;
  }, [profilepath]);
  const targetDetailsModal = useMemo(() => {
    return [
      //   {
      //     label: "ID",
      //     keyIndex: "target_id",
      //     render: (v: any, _: any, index: any) => parseInt(`${index + 1}`),
      //   },
      {
        label: "Name",
        keyIndex: "user_picture,user_name",
        render: (v: any) => (
          <div className="d-flex">
            <AvatarStatus
              //   src={user_image + record.user_picture}
              src={`${profilepath}${v.user_picture}`}
              size={50}
              name={v.user_name}
              text={""}
              type={""}
              icon={""}
              suffix={""}
              subTitle={""}
              shape={""}
              gap={0} // subTitle={"noman@gmail.com"}
            />
          </div>
        ),
      },
      {
        label: "Target",
        keyIndex: "usertarget_target",
      },
      {
        label: "Target Month",
        keyIndex: "usertarget_month",
      },
    ];
  }, [profilepath]);

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
            <h4 style={{ fontWeight: "bold", fontSize: "16px" }}>
              Target Report
            </h4>
          </div>
          <div className="col-lg-1">
            <Icon name={"arrow-left"} onClick={() => router.back()} />
          </div>
          <div className="col-lg"></div>
          <div className="col-lg-2">
            {userBrand ? (
              <Dropdown
                className={styles.abcdropdown}
                style={{ width: "100%" }}
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
          <div className="col-lg-1">
            <DatePicker
              //@ts-ignore
              defaultValue={dayjs(month)}
              // format={monthFormat}
              onChange={onChange}
              picker="month"
              style={{
                border: "1px solid lightgray",
                float: "right",
                height: "2.4rem",
              }}
            />
          </div>
        </div>
      </Card>

      <Card
        className={styles.brandList__container}
        style={{
          border: "none",
          boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
          borderRadius: "5px",
          height: "50%",
          overflowY: "scroll",
        }}
      >
        <Table
          // renderOnRowHover={renderOnRowHover}
          onSortData={(sortKey, direction) =>
            setSortKeys({ [sortKey as keyof IReportListItem]: direction })
          }
          autoSort={true}
          loading={isLoading}
          onRowItemClick={onRowEditClick}
          pageSize={50}
          //@ts-ignore
          data={target}
          columnHeadings={targetColumn}
        />
      </Card>
      <Card
        className={styles.brandList__container}
        style={{
          border: "none",
          boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
          borderRadius: "5px",
        }}
      >
        <Table
          // renderOnRowHover={renderOnRowHover}
          onSortData={(sortKey, direction) =>
            setSortKeys({ [sortKey as keyof IReportListItem]: direction })
          }
          autoSort={true}
          loading={isLoading}
          onRowItemClick={onRowAddClick}
          pageSize={50}
          //@ts-ignore
          data={nonTarget}
          columnHeadings={nonTargetColumn}
        />
      </Card>
      <Modal
        style={{
          overflow: "scroll",
          minHeight: "470px",
          maxHeight: "630px",
          width: "50rem",
        }}
        show={addTargetModal}
        onBackdrop={() => setAddTargetModal(false)}
      >
        <div className="container">
          <div className="row mt-3">
            <div className="col-lg-12">
              <h4>Add Target</h4>
            </div>
          </div>

          <div className="container">
            <form ref={formRef} onSubmit={onAddTarget}>
              <div className="row">
                {/* <div className="col-lg"></div> */}
                <div className="col-lg-10">
                  <Input
                    className={styles.inputfield}
                    type="floating"
                    label="Monthly Target"
                    name="usertarget_target"
                    required
                  />
                </div>

                <div className="col-lg-2">
                  <Button
                    className=""
                    style={{
                      background: "var(--bs-primary)",
                      marginTop: "1.44rem",
                      borderRadius: "5px",
                    }}
                    ref={btnRef}
                    htmlType="submit"
                  >
                    Add Target
                  </Button>
                </div>
                {/* <div className="col-lg"></div> */}
              </div>
            </form>
            <div className="mt-3">
              <Table
                // renderOnRowHover={renderOnRowHover}
                onSortData={(sortKey, direction) =>
                  setSortKeys({
                    [sortKey as keyof IReportListItem]: direction,
                  })
                }
                autoSort={true}
                loading={isLoading}
                pageSize={50}
                //@ts-ignore
                data={targetdetails}
                columnHeadings={targetDetailsModal}
              />
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        style={{
          overflow: "scroll",
          minHeight: "270px",
          maxHeight: "330px",
          width: "50rem",
        }}
        show={editTargetModal}
        onBackdrop={() => setEditTargetModal(false)}
      >
        <div className="container">
          <div className="row mt-3">
            <div className="col-lg-12">
              <h4>Edit Target</h4>
            </div>
          </div>

          <div className="container">
            <form ref={formRef} onSubmit={onEditTarget}>
              <div className="row">
                {/* <div className="col-lg"></div> */}
                <div className="col-lg-10">
                  <Input
                    className={styles.inputfield}
                    type="floating"
                    label="Monthly Target"
                    name="usertarget_target"
                    defaultValue={acvtiveTarge}
                    required
                  />
                </div>

                <div className="col-lg-2">
                  <Button
                    className=""
                    style={{
                      background: "var(--bs-primary)",
                      marginTop: "1.44rem",
                      borderRadius: "5px",
                    }}
                    ref={btnRef}
                    htmlType="submit"
                  >
                    Edit Target
                  </Button>
                </div>
                {/* <div className="col-lg"></div> */}
              </div>
            </form>
            <div className="mt-3">
              <Table
                // renderOnRowHover={renderOnRowHover}
                onSortData={(sortKey, direction) =>
                  setSortKeys({
                    [sortKey as keyof IReportListItem]: direction,
                  })
                }
                autoSort={true}
                loading={isLoading}
                pageSize={50}
                //@ts-ignore
                data={targetdetails}
                columnHeadings={targetDetailsModal}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
});
export default AutoLeadList;
