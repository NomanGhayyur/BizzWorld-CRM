import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Button,
  Input,
  Dropdown,
  Uploader,
  Icon,
  IDropdownItem,
  AutoComplete,
} from "elements";
import Card from "../../components/shared/Card";
import styles from "../../styles/order.module.css";
import { useDispatch } from "react-redux";
import {
  createOrderDetail,
  getOrderDetail,
  getOrderoptionDetail,
  getOrderQuestionDetail,
  updateOrderDetail,
} from "../../api/order";
import { AppThunkDispatch } from "../../redux/types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useQuery } from "react-query";
import { IBrandListItem } from "../../model/brand";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { IApiParam } from "../../helper/api";
import { AttachmentType, IOrder } from "../../model/order";
import AttachmentView from "../../components/shared/AttachmentView";
import LeadDetail from "../lead/[id]";
import { getLeadDetail } from "../../api/lead";
import { ILeadListItem } from "../../model/lead";
import Loader from "../../components/shared/Loader";
import { message } from "antd";

type InputType = {
  firstName: string;
  lastName: string;
};
type Refrence = {
  refrencetitle: string;
  refrencelink: string;
};
type Order = {
  formId: string;
};
type Additional = {
  additionaltitle: string;
  additionalimage: string;
};
type Question = {
  questiontitle: string;
  questionanswer: string;
};

const OrderCreate: NextPage = () => {
  const [startDate, setStartDate] = useState<Date>();
  const dispatch = useDispatch<AppThunkDispatch>();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const { id, lead_id } = router.query;
  const [allquestion, setQuestionResponse] = useState([] || 0);

  const { data: lead } = useQuery<ILeadListItem>(
    `Lead_${lead_id}`,
    async () => {
      const params: IApiParam = {
        params: {
          lead_id: id,
        },
      };
      const response = await dispatch(getLeadDetail(params));
      return response.data;
    },
    {
      enabled: !!id,
    }
  );
  const onGetOrderDetail = async () => {
    const params: IApiParam = {
      params: {
        order_id: id,
      },
    };
    const response = await dispatch(getOrderDetail(params));
    setRefrenceList(response.refrencedetail);
    return response;
  };

  const { data: order, isLoading } = useQuery<IOrder>(
    `Order_${id}`,
    onGetOrderDetail,
    {
      enabled: !!id,
    }
  );

  const { data: orders } = useQuery(
    `OrderList`,
    async () => {
      const response = await dispatch(getOrderoptionDetail());
      return response.data;
    },
    {
      // enabled: !!user?.user_id
    }
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const submit = [
    { orderstatus_id: "Out", orderstatus_title: "Outsource" },
    { orderstatus_id: "In", orderstatus_title: "Inhouse" },
  ];

  const submitOptions = useMemo(() => {
    return submit?.reduce(
      (
        result: { [x: string]: { label: any } },
        submit: { orderstatus_id: string | number; orderstatus_title: any }
      ) => {
        result[submit.orderstatus_id] = {
          label: submit.orderstatus_title,
        };
        return result;
      },
      {} as { [key in string]: IDropdownItem }
    );
  }, [submit]);

  const orderOptions = useMemo(() => {
    return orders?.reduce(
      (
        result: { [x: string]: { label: any } },
        orders: { ordertype_id: string | number; ordertype_name: any }
      ) => {
        result[orders.ordertype_id] = {
          label: orders.ordertype_name,
        };
        return result;
      },
      {} as { [key in string]: IDropdownItem }
    );
  }, [orders]);

  const handleordertype = useCallback(
    async (orderTypeID: string) => {
      const response = await dispatch(
        getOrderQuestionDetail({ params: { ordertype_id: orderTypeID } })
      );
      setQuestionResponse(response.data);
    },
    [dispatch]
  );

  const orderQuestion = useMemo(() => {
    return allquestion?.reduce(
      (
        result: { [x: string]: { label: any } },
        orderQ: {
          orderquestion_id: string | number;
          orderquestion_name: any;
        }
      ) => {
        result[orderQ.orderquestion_id] = {
          label: orderQ.orderquestion_name,
        };
        return result;
      },
      {} as { [key in string]: IDropdownItem }
    );
  }, [allquestion]);

  const [inputList, setInputList] = useState<Array<InputType>>([
    { firstName: "", lastName: "" },
  ]);

  const [refrence, setRefrenceList] = useState<Array<Refrence>>([
    { refrencetitle: "", refrencelink: "" },
  ]);
  const [masterOrder, setOrderArrayList] = useState<Array<Order>>([
    { formId: "" },
  ]);

  const [qadetail, setqadetail] = useState<Array<Question>>([
    { questiontitle: "", questionanswer: "" },
  ]);

  const onSubmit: React.FormEventHandler = useCallback(
    async (e) => {
      e.preventDefault();
      const updateOrder = async () => {
        if (formRef.current) {
          refrence.forEach((ref, i) => {});
          // return;
          const params = {
            data: new FormData(formRef.current),
            order_id: id,
            orderpayment_id: order?.paymentdetail?.orderpayment_id,
          };
          // params.data.append(
          //   'orderpayment_id',
          //   `${order?.paymentdetail?.orderpayment_id}`
          // );
          params.data.append(
            "order_token",
            `${order?.basicdetail?.order_token}`
          );
          for (let i = 0; i < inputList.length; i++) {
            params.data.append(
              `payment[${i}][orderpayment_id]`,
              order?.paymentdetail[i]?.orderpayment_id || "-"
            );
          }
          // inputList.forEach((ref, i) => {
          //   params.data.append(
          //     `payment[${i}][orderpayment_id]`,
          //     order?.paymentdetail[i].orderpayment_id
          //   );
          // });
          for (let i = 0; i < refrence.length; i++) {
            params.data.append(
              `refrence[${i}][orderrefrence_id]`,
              order?.refrencedetail[i]?.orderrefrence_id || "-"
            );
          }

          if (qadetail.length < 0) {
            for (let i = 0; i < qadetail.length; i++) {
              params.data.append(
                `question[${i}][orderqa_id]`,
                order?.qadetail[i]?.orderqa_id || "-"
              );
            }
          } else {
          }

          // params.data.append('orderpayment_id', ${order?.paymentdetail[i].orderpayment_id})
          params.data.append("order_id", `${id}`);
          params.data.append("order_token", "-");
          await dispatch(updateOrderDetail(params));
        }

        router.push(`/order/${id}`);
      };

      const createOrder = async () => {
        if (formRef.current) {
          const params = {
            data: new FormData(formRef.current),
          };
          params.data.append("lead_id", `${lead_id}`);
          params.data.delete("order_id");
          const response = await dispatch(createOrderDetail(params));
        }

        router.push(`/order/allorderlist/`);
      };

      if (formRef.current) {
        try {
          if (id) {
            updateOrder();
          } else {
            createOrder();
          }
        } catch (e) {
          console.error(e);
        }
      }
    },

    [
      dispatch,
      id,
      inputList.length,
      lead_id,
      qadetail.length,
      refrence,
      order,
      router,
    ]
  );

  // handle click event of the Remove button
  const handleRemoveClick = (index: number) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setInputList([...inputList, { firstName: "", lastName: "" }]);
  };
  // const handleAddFormClick = () => {
  //   setInputList([...masterOrder, { formId: "" }]);
  // };

  // handle click event of the Add button
  const orderhandleAddClick = () => {
    setOrderArrayList([...masterOrder, { formId: "" }]);
  };
  const orderhandleRemoveClick = (index: number) => {
    const list = [...masterOrder];
    list.splice(index, 1);
    setOrderArrayList(list);
  };
  // handle click event of the Remove button
  const refrencehandleRemoveClick = (index: number) => {
    const list = [...refrence];
    list.splice(index, 1);
    setRefrenceList(list);
  };

  // handle click event of the Add button
  const refrencehandleAddClick = () => {
    setRefrenceList([...refrence, { refrencetitle: "", refrencelink: "" }]);
  };

  // handle click event of the Remove button
  const questionremove = (index: number) => {
    const list = [...qadetail];
    list.splice(index, 1);
    setqadetail(list);
  };

  // handle click event of the Add button
  const questionadd = () => {
    if (qadetail.length < allquestion.length) {
      setqadetail([...qadetail, { questiontitle: "", questionanswer: "" }]);
    }
  };

  if (isLoading && !order) {
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
                <div className="row">
                  <div className="col-lg-3">
                    {" "}
                    <h4
                      className={styles.createorderformheading}
                      style={{ paddingLeft: "20px" }}
                    >
                      {order?.basicdetail?.order_id
                        ? "Update Order"
                        : "Create Order"}
                    </h4>
                  </div>
                  <div className="col-lg-1">
                    <Icon
                      name={"arrow-left"}
                      style={{ marginTop: "13px" }}
                      onClick={() => router.back()}
                    />
                  </div>
                  <div className="col-lg"></div>
                </div>
              </div>
              <div style={{ margin: "20px" }}>
                <div className="card-body">
                  <div
                    className="container-fluid"
                    style={{
                      background: "#CCE5FF",
                      height: "220px",
                      overflowY: "scroll",
                    }}
                  >
                    <label
                      className={styles.mainlabel}
                      style={{
                        color: "#002752",
                        fontWeight: "bold",
                        marginTop: "20px",
                        marginBottom: "5px",
                      }}
                    >
                      Lead Details
                    </label>
                    <div className="row mt-4">
                      <div className="col-lg-3">
                        <div className="">
                          <p style={{ color: "#002752", fontWeight: "bold" }}>
                            Name:
                          </p>
                          <p>{lead?.lead_name}</p>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="">
                          <p style={{ color: "#002752", fontWeight: "bold" }}>
                            Email:
                          </p>
                          <p>{lead?.lead_email}</p>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="">
                          <p style={{ color: "#002752", fontWeight: "bold" }}>
                            Alternative Email:
                          </p>
                          <p>{lead?.lead_altemail}</p>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="">
                          <p style={{ color: "#002752", fontWeight: "bold" }}>
                            Phone:
                          </p>
                          <p>{lead?.lead_phone}</p>
                        </div>
                      </div>

                      <div className="col-lg-3">
                        <div className="">
                          <p style={{ color: "#002752", fontWeight: "bold" }}>
                            Bussiness Name:
                          </p>
                          <p>{lead?.lead_bussinessname}</p>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="">
                          <p style={{ color: "#002752", fontWeight: "bold" }}>
                            Bussiness Email:
                          </p>
                          <p>{lead?.lead_bussinessemail}</p>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="">
                          <p style={{ color: "#002752", fontWeight: "bold" }}>
                            Bussiness Website:
                          </p>
                          <p>{lead?.lead_bussinesswebsite}</p>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="">
                          <p style={{ color: "#002752", fontWeight: "bold" }}>
                            Bussiness Phone:
                          </p>
                          <p>{lead?.lead_bussinessphone}</p>
                        </div>
                      </div>

                      <div className="col-lg-3">
                        <div className="">
                          <p style={{ color: "#002752", fontWeight: "bold" }}>
                            Country:
                          </p>
                          <p>{lead?.country_name}</p>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="">
                          <p style={{ color: "#002752", fontWeight: "bold" }}>
                            State:
                          </p>
                          <p>{lead?.state_name}</p>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div>
                          <p style={{ color: "#002752", fontWeight: "bold" }}>
                            City:
                          </p>
                          <p>{lead?.city_name}</p>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div>
                          <p style={{ color: "#002752", fontWeight: "bold" }}>
                            Zip:
                          </p>
                          <p>{lead?.lead_zip}</p>
                        </div>
                      </div>

                      <div className="col-lg-3">
                        <div>
                          <p style={{ color: "#002752", fontWeight: "bold" }}>
                            Address:
                          </p>
                          <p>{lead?.lead_address}</p>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div>
                          <p style={{ color: "#002752", fontWeight: "bold" }}>
                            Lead Other Details:
                          </p>
                          <p>{lead?.lead_otherdetails}</p>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div>
                          <p style={{ color: "#002752", fontWeight: "bold" }}>
                            Phone:
                          </p>
                          <p>{lead?.lead_phone}</p>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div>
                          <p style={{ color: "#002752", fontWeight: "bold" }}>
                            Brand:
                          </p>
                          <p>{lead?.brand_name}</p>
                        </div>
                      </div>
                      <div className="col-lg-8">
                        <div>
                          <p style={{ color: "#002752", fontWeight: "bold" }}>
                            Description:
                          </p>
                          <p>{lead?.lead_otherdetails}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <form className="orderform" ref={formRef} onSubmit={onSubmit}>
                    {masterOrder.map((_x, oi) => {
                      return (
                        <div key={oi}>
                          <div className="row mt-4">
                            <label className={styles.mainlabel}>
                              Basic Info
                            </label>
                          </div>
                          <div className="row">
                            <div className="col-lg-4 col-12 mt-3">
                              <Input
                                name={`masterOrder[${oi}][order_title]`}
                                className={styles.inputfield}
                                defaultValue={order?.basicdetail?.order_title}
                                required
                                type="floating"
                                labelClass={styles.inputlabel}
                                label="Title"
                              />
                            </div>
                            {orderOptions ? (
                              <div
                                className="col-lg-4"
                                style={{ borderBottom: "1px solid #cbc8d0" }}
                              >
                                <Dropdown
                                  placeholder="Select Order Type"
                                  defaultKey={order?.basicdetail?.ordertype_id}
                                  options={orderOptions}
                                  name={`masterOrder[${oi}][ordertype_id]`}
                                  type="light"
                                  className={styles.ordertypedropdown}
                                  onItemClick={(orderTypeID) =>
                                    handleordertype(orderTypeID)
                                  }
                                />
                              </div>
                            ) : null}
                            <div className="col-lg-4 col-12 mt-1">
                              <div>
                                <DatePicker
                                  selected={startDate}
                                  dateFormat="yy/MM/dd"
                                  onChange={(date: Date) => setStartDate(date)}
                                  placeholderText="Order Deadline Date"
                                  name={`masterOrder[${oi}][order_deadlinedate]`}
                                  className={styles.dateinputfield}
                                  required
                                ></DatePicker>
                              </div>
                            </div>
                          </div>
                          <div className="row mt-4">
                            <div className="col-lg-4">
                              <label className={styles.mainlabel}>
                                Refrences
                              </label>
                            </div>
                            <div className="col-lg-4"></div>
                            <div className="col-lg-3">
                              <div
                                style={{ position: "absolute", right: "9%" }}
                              >
                                <Button onClick={refrencehandleAddClick}>
                                  Add More
                                </Button>
                              </div>
                            </div>
                            <div className="col-lg-1"></div>
                          </div>
                          {refrence.map((_x, i) => {
                            return (
                              <div
                                key={i}
                                className="row mt-2"
                                style={{ alignItems: "baseline" }}
                              >
                                <div className="col-lg-6">
                                  <Input
                                    name={`masterOrder[${oi}][refrence][${i}][orderrefrence_title]`}
                                    // defaultValue={
                                    //   order?.refrencedetail[i]?.orderrefrence_title
                                    // }
                                    className={styles.inputfield}
                                    type="floating"
                                    labelClass={styles.inputlabel}
                                    label="Title"
                                  />
                                </div>
                                <div className="col-lg-5 mt-2">
                                  <Input
                                    name={`masterOrder[${oi}][refrence][${i}][orderrefrence_link]`}
                                    className={styles.inputfield}
                                    // defaultValue={
                                    //   order?.refrencedetail[i]?.orderrefrence_link
                                    // }
                                    type="floating"
                                    labelClass={styles.inputlabel}
                                    label="Link"
                                  />
                                </div>
                                <div className={`col-lg-1 ${styles.btnbox}`}>
                                  {refrence.length !== 1 && (
                                    <Icon
                                      onClick={() =>
                                        refrencehandleRemoveClick(i)
                                      }
                                      name={"trash"}
                                      className={styles.trashicon}
                                    />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                          <div className="row mt-4">
                            <div className="col-lg-4">
                              <label className={styles.mainlabel}>
                                Payment Info
                              </label>
                            </div>
                            <div className="col-lg-4"></div>
                            <div className="col-lg-3">
                              <div
                                style={{ position: "absolute", right: "9%" }}
                              >
                                <Button
                                  className={`btn-md btn-primary  ${styles.addmorebtn}`}
                                  onClick={handleAddClick}
                                >
                                  Add More
                                </Button>
                              </div>
                            </div>
                            <div className="col-lg-1"></div>
                          </div>
                          {inputList.map((_x, i) => {
                            return (
                              <div className="row mt-2" key={_x.firstName}>
                                <div className="col-lg-6 col-12 ">
                                  <Input
                                    name={`masterOrder[${oi}][payment][${i}][orderpayment_title]`}
                                    className={styles.inputfield}
                                    defaultValue={
                                      (order?.paymentdetail &&
                                        order?.paymentdetail[i]
                                          ?.orderpayment_title) ||
                                      "-"
                                    }
                                    type="floating"
                                    labelClass={styles.inputlabel}
                                    label="Title"
                                  />
                                </div>
                                <div className="col-lg col-12">
                                  <Input
                                    name={`masterOrder[${oi}][payment][${i}][orderpayment_amount]`}
                                    defaultValue={
                                      (order?.paymentdetail &&
                                        order?.paymentdetail[i]
                                          ?.orderpayment_amount) ||
                                      "-"
                                    }
                                    className={styles.inputfield}
                                    labelClass={styles.inputlabel}
                                    type="floating"
                                    htmlType="number"
                                    label="Amount"
                                  />
                                </div>
                                <div className="col-lg col-12 mt-4">
                                  <Input
                                    name={`masterOrder[${oi}][payment][${i}][orderpayment_duedate]`}
                                    defaultValue={
                                      (order?.paymentdetail &&
                                        order?.paymentdetail[i]
                                          ?.orderpayment_duedate) ||
                                      "-"
                                    }
                                    className={styles.inputfield}
                                    labelClass={styles.inputlabel}
                                    htmlType="date"
                                    required
                                  />
                                </div>
                                <div className="col-lg-1">
                                  {inputList.length !== 1 && (
                                    <Icon
                                      onClick={() => handleRemoveClick(i)}
                                      name={"trash"}
                                      className={styles.trashicon}
                                    />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                          {Object.keys(orderQuestion).length > 0 && (
                            <>
                              <div className="row mt-4">
                                <div className="col-lg-4">
                                  <label className={styles.mainlabel}>
                                    Question/Answers
                                  </label>
                                </div>
                                <div className="col-lg-4"></div>
                                <div className="col-lg-3">
                                  <div
                                    style={{
                                      position: "absolute",
                                      right: "9%",
                                    }}
                                  >
                                    <Button
                                      className={`btn-md btn-primary  ${styles.addmorebtn}`}
                                      onClick={questionadd}
                                      disabled={
                                        qadetail.length == allquestion.length
                                      }
                                    >
                                      Add More
                                    </Button>
                                  </div>
                                </div>
                                <div className="col-lg-1"></div>
                              </div>

                              {qadetail.map((_x: any, i: number) => {
                                return (
                                  <>
                                    <div
                                      className="row"
                                      style={{ alignItems: "baseline" }}
                                    >
                                      {orderQuestion ? (
                                        <div className="col-lg-6">
                                          <Dropdown
                                            placeholder="Select Question"
                                            className={
                                              styles.questiontypedropdown
                                            }
                                            options={orderQuestion}
                                            name={`masterOrder[${oi}][question][${i}][orderquestion_id]`}
                                            type="light"
                                          />
                                        </div>
                                      ) : null}
                                      <div className="col-lg-5 col-12">
                                        <Input
                                          name={`masterOrder[${oi}][question][${i}][orderqa_answer]`}
                                          className={styles.inputfield}
                                          labelClass={styles.inputlabel}
                                          type="floating"
                                          label="Answer"
                                        />
                                      </div>
                                      <div className="col-lg-1">
                                        {qadetail.length !== 1 && (
                                          <Icon
                                            onClick={() => questionremove(i)}
                                            name={"trash"}
                                            className={styles.trashicon}
                                          />
                                        )}
                                      </div>
                                    </div>
                                  </>
                                );
                              })}
                            </>
                          )}
                          <div className="row mt-3">
                            <div className="col-11">
                              <Input
                                name={`masterOrder[${oi}][order_description]`}
                                label="Description"
                                type="floating-textarea"
                                className={`${styles.orderstextfield}`}
                                style={{
                                  height: "150px",
                                  border: " 1px solid #cbc8d0",
                                  width: "100%",
                                }}
                                defaultValue={
                                  order?.basicdetail?.order_description
                                }
                                required
                              />
                            </div>
                          </div>

                          <div className="row mt-4">
                            <div className="col-lg-6">
                              <label className={styles.inputlabeluploader}>
                                Attachments
                              </label>
                              <Uploader
                                name={`masterOrder[${oi}][attachment][]`}
                                multiple={true}
                                className={styles.uploadbtnn}
                                // defaultValue={order?.attachmentdetail?.orderattachment_name}
                              />
                              {order?.attachmentdetail?.map(
                                (attachment: AttachmentType) => (
                                  <AttachmentView
                                    key={attachment.orderattachment_id}
                                    attachmentName={
                                      attachment.orderattachment_name
                                    }
                                    onDelete={() => ""}
                                  />
                                )
                              )}
                            </div>
                            <div className="col-lg-5">
                              {submitOptions ? (
                                <div
                                  className={`col-lg-4 ${styles.selectoptiondiv}`}
                                >
                                  {/* <label className={styles.inputlabel}>Select OrderType</label> */}
                                  <br />
                                  <Dropdown
                                    placeholder="Assign to"
                                    defaultKey={JSON.stringify(
                                      order?.basicdetail?.ordertype_id
                                    )}
                                    options={submitOptions}
                                    name={`masterOrder[${oi}][order_assignto]`}
                                    type="light"
                                    className={styles.ordertypedropdown}
                                    style={{ width: "100%" }}
                                    // onItemClick={(orderstatus_id) =>
                                    //   handleordertype(orderstatus_id)
                                    // }
                                  />
                                </div>
                              ) : null}
                            </div>
                          </div>

                          <div className="row mt-4">
                            <div className="col-lg-4">
                              <Button
                                className="btn btn-primary btn-md"
                                htmlType="submit"
                              >
                                Submit
                              </Button>
                            </div>
                          </div>
                          <hr />
                          <div className="row">
                            <div className="col-lg"></div>

                            <div className="col-lg-2">
                              <Button
                                style={{ float: "right" }}
                                className={`btn-md btn-primary  ${styles.formaddmorebtn}`}
                                onClick={orderhandleAddClick}
                              >
                                Add More
                              </Button>
                            </div>
                            {masterOrder.length !== 1 && (
                              <div className="col-lg-1">
                                <Icon
                                  style={{ float: "right" }}
                                  onClick={() => orderhandleRemoveClick(oi)}
                                  name={"trash"}
                                  className={styles.formtrashicon}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCreate;
