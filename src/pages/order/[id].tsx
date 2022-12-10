import {
  Avatar,
  Button,
  RandomImage,
  Tab,
  ITabItem,
  Badge,
  Icon,
} from "elements";
import moment from "moment";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";

import { getLeadDetail } from "../../api/lead";
import { deleteLead } from "../../api/lead";
import { deletOrderDetail, getOrderDetail } from "../../api/order";

import Card from "../../components/shared/Card";
import Loader from "../../components/shared/Loader";
import OverviewGenerator from "../../components/shared/OverviewGenerator";
import { headingType } from "../../components/shared/OverviewGenerator/OverviewGenerator";
import OverviewTable from "../../components/shared/OverviewTable";
import { DATE_FORMAT, Roles } from "../../constant/app";

import { ILead } from "../../model/lead";

import { IOrder } from "../../model/order";
import { AppThunkDispatch, RootState } from "../../redux/types";
import styles from "../../styles/user/Userupdate.module.css";
import AttachmentList from "./attachmentList";
import PaymentList from "./paymentList";
import QAList from "./QAList";
import RefrenceList from "./RefrenceList";
import WorkAttachment from "./workAttachment";

const basicHeadings: headingType = {
  Name: "order_title",
  Deadline: "order_deadlinedate",
  "Order Type": "ordertype_name",
  "Active Since": {
    key: "created_at",
    transform: (created_at) => (
      <p className="lead mb-0">{moment(created_at).format(DATE_FORMAT)}</p>
    ),
  },

  "Updated At": {
    key: "updated_at",
    transform: (updated_at) => (
      <p className="lead mb-0">{moment(updated_at).format(DATE_FORMAT)}</p>
    ),
  },
  Description: {
    key: "order_description",
    transform: (description: IOrder["order_description"]) => {
      return (
        <div className="container">
          <p
            style={{
              position: "absolute",
            }}
          >
            {description}
          </p>
        </div>
      );
    },
  },
};

const OrderDetail: NextPage = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppThunkDispatch>();
  const { id } = router.query;
  const [logoPathPrefix, setLogoPathPrefix] = useState<string>("");
  const [coverPathPrefix, setCoverPathPrefix] = useState<string>("");
  const { order_id } = router.query;

  const user = useSelector((store: RootState) => store.auth.user);

  const {
    data: order,
    isLoading,
    refetch,
  } = useQuery<IOrder>(
    `Order_${id}`,
    async () => {
      const response = await dispatch(
        getOrderDetail({ data: { order_id: id } })
      );
      setLogoPathPrefix(response.profilepath);
      setCoverPathPrefix(response.coverpath);

      return response.basicdetail;
    },
    {
      enabled: !!user?.user_id && !!id,
    }
  );

  const onDelete = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      try {
        const params = {
          data: {
            order_id: order?.order_id,
          },
        };
        await dispatch(deletOrderDetail(params));
        router.replace("/order");
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, router, order]
  );

  const onEdit = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      router.push(`/order/update/${order?.order_id}`);
    },
    [order, router]
  );

  const tabs: ITabItem = useMemo(() => {
    return {
      "Basic Details": (
        <OverviewGenerator headings={basicHeadings} data={order} brands={[]} />
      ),
      Payments: <PaymentList />,
      Refrence: <RefrenceList />,
      "Client Attachments": <AttachmentList />,
      //@ts-ignore
      "Work Attachments": <WorkAttachment />,
      "Q / A": <QAList />,
    };
  }, [order]);

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
      <div style={{ marginBottom: "40px" }}>
        <div className="container-fluid">
          <div className="row align-items-center mt-5">
            <div
              className={`col-12 mx-auto ${styles.cardcontainermarginpadding}`}
            >
              <div className="card shadow border">
                <div
                  className="card-header"
                  style={{ background: "rgba(0,0,0,.03)" }}
                >
                  <div className="row" style={{ alignItems: "baseline" }}>
                    <div className="col-lg-3">
                      <h4
                        className={styles.ordertitleheading}
                        style={{
                          paddingLeft: "20px",
                          textTransform: "capitalize",
                        }}
                      >
                        {`${order?.order_title}`}
                      </h4>
                    </div>
                    <div className="col-lg-6">
                      {" "}
                      <Icon name={"arrow-left"} onClick={() => router.back()} />
                    </div>

                    <div className="col-lg-2">
                      <div className="text-right">
                        {user &&
                        [Roles.PRODUCTION_HEAD, Roles.SUPER_ADMIN].includes(
                          user?.role_id
                        ) ? (
                          <Button
                            iconName="plus"
                            onClick={() =>
                              router.push({
                                pathname: "/tasks/create",
                                query: {
                                  order_id: order?.order_id,
                                  order_token: order?.order_token,
                                },
                              })
                            }
                          >
                            Create Task
                          </Button>
                        ) : null}
                      </div>
                    </div>

                    <div className="col-lg-1">
                      {user &&
                      ![Roles.PRODUCTION_HEAD].includes(user?.role_id) ? (
                        <div>
                          <span className="trash">
                            <Icon
                              name="trash"
                              style={{ fontSize: "18px" }}
                              onClick={onDelete}
                            />
                          </span>
                          <span className="m-1 pencil">
                            <Icon
                              name="pencil-square"
                              style={{ fontSize: "18px" }}
                              onClick={onEdit}
                            />
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div style={{ margin: "20px" }}>
                  <div className="card-body">
                    <div className={`row ${styles.saad}`}>
                      <Tab data={tabs} className={styles.tabheadings} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetail;
