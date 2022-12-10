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
import { Table as CTable } from "antd";
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
import { getOrderoptionDetail, orderType } from "../../../api/order";
import Loader from "../../../components/shared/Loader";
import Delete from "../../../../public/icons/delete.svg";
import Update from "../../../../public/icons/update.svg";
import AvatarStatus from "../../../components/shared/AvatarStatus";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;
import "antd/dist/antd.css";
import dayjs from "dayjs";
import { PaymentStatus } from "../../../api/payment";
import { getCommissionReport, getSalesTargetReport } from "../../../api/report";
import { IReport, IReportListItem } from "../../../model/report";

type propTypes = {
  leads?: Array<IReport>;
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
  const [leadtype, setleadType] = useState<number | string>(1);
  const [acvtiveRowId, setActiveRowId] = useState(0);
  const [addTargetModal, setAddTargetModal] = useState(false);
  const [editTargetModal, setEditTargetModal] = useState(false);
  const [page, setPage] = useState(1);
  const [pageDetails, setPageDetails] = useState<pageDetailsProps>();
  const [agents, setAgents] = useState([]);
  const [designers, setDesigners] = useState([]);
  const [digitizers, setDigitizers] = useState([]);
  const [sum, setSum] = useState({});
  const [profilepath, setProfilePath] = useState("");
  const [targetAchievedDate, setAchievedDate] = useState("");

  const [orderTypeID, setbrandId] = useState<number | string>(
    user?.brand1 || 1
  );
  const handleordertype = async (orderTypeID: string) => {
    setbrandId(orderTypeID);
  };

  useEffect(() => {
    setleadType(leadtype);
  }, [leadtype]);

  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let fullDate = `${year}-${month}-${day}`;
  let startDate = `${year}-${month}-01`;
  //@ts-ignore
  const [[startPickDate, endPickDate], setDatePick] = useState([]);
  //@ts-ignore
  const onChangePickDate = (dates) => setDatePick(dates || []);
  //@ts-ignore
  const pickstart = startPickDate?.format("YYYY-MM-DD") || startDate;
  //@ts-ignore
  const pickend = endPickDate?.format("YYYY-MM-DD") || fullDate;

  const { data: ordertypes } = useQuery(
    `OrderType`,
    async () => {
      const response = await dispatch(getOrderoptionDetail());
      return response.data;
    },
    {
      // enabled: !!user?.user_id,
    }
  );
  const orderType = useMemo(() => {
    return ordertypes?.reduce(
      (
        result: { [x: string]: { label: any } },
        ordertypes: { ordertype_id: string | number; ordertype_name: any }
      ) => {
        result[ordertypes.ordertype_id] = {
          label: ordertypes.ordertype_name,
        };
        return result;
      },
      {} as { [key in string]: IDropdownItem }
    );
  }, [ordertypes]);

  const {
    data: report,
    isFetching,
    isLoading,
    refetch,
  } = useQuery<Array<IReportListItem>>(
    `Report${orderTypeID}${pickstart}${pickend}`,
    async () => {
      const params = {
        data: {
          ordertype_id: orderTypeID,
          from: pickstart,
          to: pickend,
        },
      };
      const response = await dispatch(getSalesTargetReport(params));
      setAgents(response.userdetails);
      setDesigners(response.designerdetails);
      setDigitizers(response.digitizerdetails);
      setProfilePath(response.profilepath);
      setSum(response.summreport);
      return response.data;
    },
    {
      enabled: !!user?.user_id,
    }
  );

  const { data: commissionreport } = useQuery<Array<IReportListItem>>(
    `Commission_${acvtiveRowId}`,
    async () => {
      const params = {
        data: {
          date: pickstart,
          id: acvtiveRowId,
          from: pickstart,
          to: pickend,
        },
      };
      const response = await dispatch(getCommissionReport(params));
      setAchievedDate(response.targetachieveddate);
      return response.commissiondata;
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

  const onRowItemClick = (v: IReport) => {
    setActiveRowId(v.user_id);
    setEditTargetModal(true);
  };

  const designer = useMemo(() => {
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
              icon={""}
              type={""}
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
        keyIndex: "completeorders",
        render: (v: any) => <>{v}</>,
      },

      {
        label: "Commission",
        keyIndex: "commission",
        render: (v: any) => <>${v}</>,
      },
    ];
    return temp;
  }, [profilepath]);

  const digitizer = useMemo(() => {
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
              type={""}
              suffix={""}
              subTitle={""}
              icon={""}
              shape={""}
              gap={0}
              text={""} // subTitle={"noman@gmail.com"}
            />
          </div>
        ),
      },
      {
        label: "Total Orders",
        keyIndex: "completeorders",
        render: (v: any) => <>{v}</>,
      },

      {
        label: "Commission",
        keyIndex: "commission",
        render: (v: any) => <>${v}</>,
      },
    ];
    return temp;
  }, [profilepath]);
  const agent = useMemo(() => {
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
              icon={""}
              type={""}
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
        keyIndex: "user_target",
        render: (v: any) => <>${v}</>,
      },
      {
        label: "Achieved",
        keyIndex: "achieved",
        render: (v: any) => <>${v}</>,
      },
      {
        label: "Paid",
        keyIndex: "paid",
        render: (v: any) => <>${v}</>,
      },
      {
        label: "Cancel",
        keyIndex: "cancel",
        render: (v: any) => <>${v}</>,
      },
      {
        label: "Unpaid",
        keyIndex: "unpaid",
        render: (v: any) => <>${v}</>,
      },
      {
        label: "Recovery",
        keyIndex: "recovery",
        render: (v: any) => <>${v}</>,
      },
      {
        label: "Total Order",
        keyIndex: "countachieved",
        render: (v: any) => <>{v}</>,
      },
      {
        label: "Paid Order",
        keyIndex: "countpaid",
        render: (v: any) => <>{v}</>,
      },
      {
        label: "Cancel Order",
        keyIndex: "countcancel",
        render: (v: any) => <>{v}</>,
      },
      {
        label: "Updaid Order",
        keyIndex: "countunpaid",
        render: (v: any) => <>{v}</>,
      },
      {
        label: "Recovery Order",
        keyIndex: "countrecovery",
        render: (v: any) => <>{v}</>,
      },
    ];
    return temp;
  }, [profilepath]);

  const commission = useMemo(
    () => [
      {
        title: "Sr. No.",
        dataIndex: "row_id",
        render: (v: any, _: any, index: any) => parseInt(`${index + 1}`),
      },
      {
        title: "Commission Amount",
        dataIndex: "finalcommisionamount",
        render: (v: any) => <>${v}</>,
      },
      {
        title: "Recovery Amount",
        dataIndex: "finalrecoveryamount",
        render: (v: any) => <>${v}</>,
      },
      {
        title: "Paid Orders",
        dataIndex: "finalpaidorders",
        render: (v: any) => <>{v}</>,
      },
      {
        title: "Recovery Orders",
        dataIndex: "finalrecoveryorders",
        render: (v: any) => <>{v}</>,
      },
      {
        title: "Commission Rate",
        dataIndex: "finalrate",
        render: (v: any) => <>${v}</>,
      },
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
        render: (v: any) => v,
      },
    ],
    []
  );
  const onSearchByText: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      setFilterText(e.target.value);
    }, []);

  const rowClassName = useCallback(
    //@ts-ignore
    (v: any, rowIndex) => {
      return `row-hover ${
        v.date === targetAchievedDate ? "row-highlight" : ""
      }`;
    },
    [targetAchievedDate]
  );

  const onBackdrop = useCallback(() => {
    if (router.asPath.split("#")[1]) {
      router.replace({ pathname: router.pathname, query: router.query });
    }
  }, [router]);

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
              Campaign Report
            </h4>
          </div>
          <div className="col-lg-1">
            <Icon name={"arrow-left"} onClick={() => router.back()} />
          </div>
          <div className="col-lg"></div>
          <div className="col-lg-3">
            {orderType ? (
              <Dropdown
                className={styles.abcdedgropdown}
                style={{ width: "100%" }}
                placeholder="Select Order Type"
                defaultKey="ordertype_id"
                options={orderType}
                name="ordertype_id"
                type="light"
                onItemClick={(orderTypeID) => handleordertype(orderTypeID)}
                value={orderTypeID.toString()}
              />
            ) : null}
          </div>
          <div className="col-lg-3">
            <RangePicker
              style={{ width: "100%" }}
              size="large"
              placeholder={["Start Date", "End Date"]}
              onChange={onChangePickDate}
            />
          </div>
        </div>
        <div className="container">
          <div className="row mt-2">
            <div
              className="col-lg"
              style={{
                border: "none",
                boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
                borderRadius: "5px",
                margin: "1rem",
              }}
            >
              <div style={{ float: "right", marginTop: "1rem" }}>
                <h5 style={{ margin: "0px", fontSize: "15px" }}>
                  ${" "}
                  {
                    //@ts-ignore
                    sum.sumtarget
                  }
                  .00
                </h5>

                <p style={{ color: "gray" }}>Target</p>
              </div>
            </div>
            <div
              className="col-lg"
              style={{
                border: "none",
                boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
                borderRadius: "5px",
                margin: "1rem",
              }}
            >
              <div style={{ float: "right", marginTop: "1rem" }}>
                <h5 style={{ margin: "0px", fontSize: "15px" }}>
                  ${" "}
                  {
                    //@ts-ignore
                    sum.sumachieved
                  }
                  .00
                </h5>

                <p style={{ color: "gray" }}>Achieved</p>
              </div>
            </div>
            <div
              className="col-lg"
              style={{
                border: "none",
                boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
                borderRadius: "5px",
                margin: "1rem",
              }}
            >
              <div style={{ float: "right", marginTop: "1rem" }}>
                <h5 style={{ margin: "0px", fontSize: "15px" }}>
                  ${" "}
                  {
                    //@ts-ignore
                    sum.sumcancel
                  }
                  .00
                </h5>

                <p style={{ color: "gray" }}>Cancel</p>
              </div>
            </div>
            <div
              className="col-lg"
              style={{
                border: "none",
                boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
                borderRadius: "5px",
                margin: "1rem",
              }}
            >
              <div style={{ float: "right", marginTop: "1rem" }}>
                <h5 style={{ margin: "0px", fontSize: "15px" }}>
                  ${" "}
                  {
                    //@ts-ignore
                    sum.sumchargeback
                  }
                  .00
                </h5>

                <p style={{ color: "gray" }}>Charge back</p>
              </div>
            </div>
            <div
              className="col-lg"
              style={{
                border: "none",
                boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
                borderRadius: "5px",
                margin: "1rem",
              }}
            >
              <div style={{ float: "right", marginTop: "1rem" }}>
                <h5 style={{ margin: "0px", fontSize: "15px" }}>
                  ${" "}
                  {
                    //@ts-ignore
                    sum.sumpaid
                  }
                  .00
                </h5>

                <p style={{ color: "gray" }}>Paid</p>
              </div>
            </div>
            <div
              className="col-lg"
              style={{
                border: "none",
                boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
                borderRadius: "5px",
                margin: "1rem",
              }}
            >
              <div style={{ float: "right", marginTop: "1rem" }}>
                <h5 style={{ margin: "0px", fontSize: "15px" }}>
                  ${" "}
                  {
                    //@ts-ignore
                    sum.sumrecovery
                  }
                  .00
                </h5>

                <p style={{ color: "gray" }}>Recovery</p>
              </div>
            </div>
            <div
              className="col-lg"
              style={{
                border: "none",
                boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
                borderRadius: "5px",
                margin: "1rem",
              }}
            >
              <div style={{ float: "right", marginTop: "1rem" }}>
                <h5 style={{ margin: "0px", fontSize: "15px" }}>
                  ${" "}
                  {
                    //@ts-ignore
                    sum.sumrefund
                  }
                  .00
                </h5>

                <p style={{ color: "gray" }}>Refund</p>
              </div>
            </div>
            <div
              className="col-lg"
              style={{
                border: "none",
                boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
                borderRadius: "5px",
                margin: "1rem",
              }}
            >
              <div style={{ float: "right", marginTop: "1rem" }}>
                <h5 style={{ margin: "0px", fontSize: "15px" }}>
                  ${" "}
                  {
                    //@ts-ignore
                    sum.sumunpaid
                  }
                  .00
                </h5>

                <p style={{ color: "gray" }}>Unpaid</p>
              </div>
            </div>
          </div>
          <div className="row mt-2">
            <div
              className="col-lg"
              style={{
                border: "none",
                boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
                borderRadius: "5px",
                margin: "1rem",
              }}
            >
              <div style={{ float: "right", marginTop: "1rem" }}>
                <h5 style={{ margin: "0px", fontSize: "15px" }}>
                  {
                    //@ts-ignore
                    sum.sumcountachieved
                  }
                </h5>

                <p style={{ color: "gray" }}>Achieved Orders</p>
              </div>
            </div>
            <div
              className="col-lg"
              style={{
                border: "none",
                boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
                borderRadius: "5px",
                margin: "1rem",
              }}
            >
              <div style={{ float: "right", marginTop: "1rem" }}>
                <h5 style={{ margin: "0px", fontSize: "15px" }}>
                  {
                    //@ts-ignore
                    sum.sumcountcancel
                  }
                </h5>

                <p style={{ color: "gray" }}>Cancel Orders</p>
              </div>
            </div>
            <div
              className="col-lg"
              style={{
                border: "none",
                boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
                borderRadius: "5px",
                margin: "1rem",
              }}
            >
              <div style={{ float: "right", marginTop: "1rem" }}>
                <h5 style={{ margin: "0px", fontSize: "15px" }}>
                  {
                    //@ts-ignore
                    sum.sumcountchargeback
                  }
                </h5>

                <p style={{ color: "gray" }}>Charge back Orders</p>
              </div>
            </div>
            <div
              className="col-lg"
              style={{
                border: "none",
                boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
                borderRadius: "5px",
                margin: "1rem",
              }}
            >
              <div style={{ float: "right", marginTop: "1rem" }}>
                <h5 style={{ margin: "0px", fontSize: "15px" }}>
                  {
                    //@ts-ignore
                    sum.sumcountrecovery
                  }
                </h5>

                <p style={{ color: "gray" }}>Recovery Orders</p>
              </div>
            </div>
            <div
              className="col-lg"
              style={{
                border: "none",
                boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
                borderRadius: "5px",
                margin: "1rem",
              }}
            >
              <div style={{ float: "right", marginTop: "1rem" }}>
                <h5 style={{ margin: "0px", fontSize: "15px" }}>
                  {
                    //@ts-ignore
                    sum.sumcountrefund
                  }
                </h5>

                <p style={{ color: "gray" }}>Refund Orders</p>
              </div>
            </div>
            {/* <div
              className="col-lg"
              style={{
                border: "none",
                boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
                borderRadius: "5px",
                margin: "1rem",
              }}
            >
              <div style={{ float: "right", marginTop: "1rem" }}>
                <h5 style={{ margin: "0px", fontSize: "15px" }}>
                  $ {sum.sumrefund}.00
                </h5>

                <p style={{ color: "gray" }}>Refund</p>
              </div>
            </div> */}
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
        <div className="row">
          <div className="col-lg-12">
            <h4 style={{ fontWeight: "bold", fontSize: "16px" }}>
              Sales Agents
            </h4>
          </div>
        </div>

        <Table
          // renderOnRowHover={renderOnRowHover}
          onSortData={(sortKey, direction) =>
            setSortKeys({ [sortKey as keyof IReportListItem]: direction })
          }
          autoSort={true}
          loading={isLoading}
          onRowItemClick={onRowItemClick}
          pageSize={50}
          data={agents}
          columnHeadings={agent}
        />
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
        <div className="row">
          <div className="col-lg-12">
            <h4 style={{ fontWeight: "bold", fontSize: "16px" }}>Designers</h4>
          </div>
        </div>
        <Table
          // renderOnRowHover={renderOnRowHover}
          onSortData={(sortKey, direction) =>
            setSortKeys({ [sortKey as keyof IReportListItem]: direction })
          }
          autoSort={true}
          loading={isLoading}
          onRowItemClick={onRowItemClick}
          pageSize={50}
          data={designers}
          columnHeadings={designer}
        />
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
        <div className="row">
          <div className="col-lg-12">
            <h4 style={{ fontWeight: "bold", fontSize: "16px" }}>Degitizers</h4>
          </div>
        </div>
        <Table
          // renderOnRowHover={renderOnRowHover}
          onSortData={(sortKey, direction) =>
            setSortKeys({ [sortKey as keyof IReportListItem]: direction })
          }
          autoSort={true}
          loading={isLoading}
          onRowItemClick={onRowItemClick}
          pageSize={50}
          data={digitizers}
          columnHeadings={digitizer}
        />
      </Card>

      <Modal
        style={{
          overflow: "scroll",
          minHeight: "470px",
          maxHeight: "630px",
          width: "50rem",
        }}
        show={editTargetModal}
        onBackdrop={() => setEditTargetModal(false)}
      >
        <div className="container">
          <div className="row mt-3">
            <div className="col-lg-12">
              <h4>Commission</h4>
            </div>
          </div>

          <div className="container">
            <div className="mt-3">
              <CTable
                className={styles.table}
                // renderOnRowHover={renderOnRowHover}

                rowClassName={rowClassName}
                loading={isLoading}
                pagination={{
                  pageSize: 50,
                }}
                // onRowItemClick={onRowItemClick}
                //@ts-ignore
                pageSize={50}
                rowKey="date"
                dataSource={commissionreport}
                columns={commission}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
});
export default AutoLeadList;
