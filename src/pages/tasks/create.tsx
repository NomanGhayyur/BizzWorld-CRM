import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  AutoComplete,
  Button,
  Card,
  Dropdown,
  Icon,
  IDropdownItem,
  Input,
  Uploader,
} from "elements";
import { useDispatch } from "react-redux";
import { AppThunkDispatch } from "../../redux/types";
import { useQuery } from "react-query";
import { getAllUserList, getWorkerUserList } from "../../api/user";
import styles from "../../styles/Taskform.module.css";
import { NextPage } from "next";
import router, { useRouter } from "next/router";
import { getOrderDetail } from "../../api/order";
import { IApiParam } from "../../helper/api";
import Notify from "../../components/shared/Notify";
import { createNewTask } from "../../api/task";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IOrderListItem } from "../../model/order";

const CreateTask: NextPage = () => {
  const dispatch = useDispatch<AppThunkDispatch>();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const { order_id, order_token } = router.query;
  const [membersId, setMembersId] = useState<Array<string | number>>([]);
  const [managerId, setManagerId] = useState<string | number>();
  const [attachments, setAttachments] = useState<Array<string | number>>([]);
  const [brandId, setBrandId] = useState<string | number>();
  console.log(attachments, ";;;;");
  function handleSelectedAttachment(value: string | number) {
    setAttachments((prevAttachments) => {
      return [...prevAttachments, value];
    });
  }

  const handlemanager = async (managerId: string | number) => {
    setManagerId(managerId);
  };

  const { data: orders } = useQuery<IOrderListItem>(
    `OrderDetail`,
    async () => {
      let response = await dispatch(
        getOrderDetail({ data: { order_id: order_id } })
      );
      response = {
        ...response.basicdetail,
        refrencedetail: response.refrencedetail,
        attachmentdetail: response.attachmentdetail,
        path: response.orderpath,
      };
      setBrandId(response.brand_id);
      return response;
    },
    {}
  );

  const { data: users } = useQuery(
    `WorkerList`,
    async () => {
      const params = {
        data: {
          //@ts-ignore
          brand_id: orders?.brand_id,
        },
      };
      const response = await dispatch(getWorkerUserList(params));
      // const { data, ...meta } = response.data;
      return response.data;
    },
    {}
  );
  const userOptions = useMemo(() => {
    return users?.reduce(
      (
        result: { [x: string]: { label: any } },
        users: { user_id: string | number; user_name: any }
      ) => {
        result[users.user_id] = {
          label: users.user_name,
        };
        return result;
      },
      {} as { [key in string]: IDropdownItem }
    );
  }, [users]);

  const onSubmit: React.FormEventHandler = useCallback(
    async (e) => {
      e.preventDefault();
      if (formRef.current) {
        const params = {
          data: new FormData(formRef.current),
        };
        params.data.append("order_id", `${order_id}`);
        params.data.append(`task_manager`, `${managerId}`);
        // params.data.append('order_token', `${order_token}`);
        membersId.forEach((id, i) => {
          params.data.append(`member[${i}][user_id]`, membersId[i].toString());
        });
        [...new Set(attachments)].forEach((id, i) => {
          params.data.append(
            `orderattachment[${i}][orderattachment_id]`,
            attachments[i].toString()
          );
        });
        await dispatch(createNewTask(params));
        router.push("/tasks/taskList");
      }
    },
    [attachments, dispatch, managerId, membersId, order_id, router]
  );

  return (
    <div>
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
                  <div className="col-lg-2">
                    <h4
                      className={styles.createtaskformheading}
                      style={{ paddingLeft: "30px" }}
                    >
                      Create Task
                    </h4>
                  </div>
                  <div className="col-lg-6">
                    <Icon
                      name={"arrow-left"}
                      onClick={() => router.back()}
                      style={{ marginTop: "13px" }}
                    />
                  </div>
                  <div className="col-lg-4"></div>
                </div>
              </div>

              <div style={{ margin: "20px" }}>
                <div className="card-body">
                  <div
                    className="container-fluid"
                    style={{
                      background: "#CCE5FF",
                      height: "240px",
                      overflowY: "scroll",
                    }}
                  >
                    <label
                      className={styles.mainlabel}
                      style={{
                        color: "#002752",
                        fontWeight: "bold",
                        marginTop: "20px",
                      }}
                    >
                      Order Details
                    </label>
                    <div className="row">
                      <div className="col-lg-4">
                        <div className="row">
                          <h6
                            style={{
                              color: "#002752",
                              fontWeight: "bold",
                              fontSize: "14px",
                              height: "1px",
                            }}
                          >
                            Basic Info:
                          </h6>
                        </div>
                        <div className="row">
                          <div className="col-lg">
                            <p
                              style={{
                                color: "#002752",
                                fontWeight: "bold",
                                height: "1px",
                              }}
                            >
                              Title:
                            </p>
                            <p>{orders?.order_title}</p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg">
                            <p
                              style={{
                                color: "#002752",
                                fontWeight: "bold",
                                height: "1px",
                              }}
                            >
                              Order Type:
                            </p>
                            <p>{orders?.ordertype_name}</p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg">
                            <p
                              style={{
                                color: "#002752",
                                fontWeight: "bold",
                                height: "1px",
                              }}
                            >
                              Brand Name:
                            </p>
                            <p>{orders?.brand_name}</p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg">
                            <p
                              style={{
                                color: "#002752",
                                fontWeight: "bold",
                                height: "1px",
                              }}
                            >
                              Lead Name:
                            </p>
                            <p>{orders?.lead_name}</p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg">
                            <p
                              style={{
                                color: "#002752",
                                fontWeight: "bold",
                                height: "1px",
                              }}
                            >
                              Created By:
                            </p>
                            <p>{orders?.creator}</p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg">
                            <p
                              style={{
                                color: "#002752",
                                fontWeight: "bold",
                                height: "1px",
                              }}
                            >
                              Deadline Date:
                            </p>
                            <p>{orders?.order_deadlinedate}</p>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg">
                        <div className="row">
                          <h6
                            style={{
                              color: "#002752",
                              fontWeight: "bold",
                              fontSize: "14px",
                              height: "1px",
                            }}
                          >
                            Refrence Details:
                          </h6>
                        </div>
                        {orders?.refrencedetail?.map(
                          (refrence: {
                            orderrefrence_id: string | number;
                            orderrefrence_title: string;
                            orderrefrence_link: string;
                          }) => (
                            <>
                              <div className="row">
                                <div className="col-lg">
                                  <p
                                    style={{
                                      color: "#002752",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Title:
                                  </p>
                                  <p
                                    key={refrence.orderrefrence_id}
                                    className="branduserlists"
                                    style={{
                                      color: "#444444",
                                      fontWeight: "500",
                                    }}
                                  >
                                    {refrence.orderrefrence_title}
                                  </p>
                                </div>

                                <div className="row">
                                  <div className="col-lg">
                                    <p
                                      style={{
                                        color: "#002752",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Link:
                                      <p>
                                        <u>
                                          <a
                                            key={refrence.orderrefrence_id}
                                            className="branduserlists"
                                            style={
                                              {
                                                // color: '#444444',
                                                // fontWeight: 'bold',
                                              }
                                            }
                                          >
                                            {refrence.orderrefrence_link}
                                          </a>
                                        </u>
                                      </p>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </>
                          )
                        )}
                      </div>
                      <div className="col-lg-4">
                        <div className="row">
                          <h6
                            style={{
                              color: "#002752",
                              fontWeight: "bold",
                              fontSize: "14px",
                              height: "1px",
                            }}
                          >
                            Attachments Details:
                          </h6>
                        </div>
                        {orders?.attachmentdetail?.map(
                          (attachment: {
                            orderattachment_id: string | number;
                            orderattachment_name: string;
                            orderpath: string;
                          }) => (
                            <>
                              <div className="row">
                                <Card
                                  style={{
                                    marginBottom: "3px",
                                    borderRadius: "5px",
                                  }}
                                >
                                  <div className="d-flex">
                                    <div className="imgdiv m-2">
                                      <div
                                        style={{
                                          cursor: "pointer",
                                        }}
                                      >
                                        <Icon
                                          name="file-earmark-image"
                                          style={{
                                            fontSize: "25px",
                                            color: "#5e66ff",
                                          }}
                                        />
                                      </div>
                                    </div>
                                    <div className="m-2">
                                      <p
                                        style={{
                                          fontSize: "12px",
                                          overflow: "hidden",
                                          wordBreak: "break-all",
                                        }}
                                      >
                                        {attachment.orderattachment_name}
                                      </p>
                                    </div>
                                    <div className="m-2">
                                      <div className="topping">
                                        <input
                                          style={{
                                            cursor: "pointer",
                                          }}
                                          type="checkbox"
                                          id="topping"
                                          name="topping"
                                          value={attachment.orderattachment_id}
                                          onChange={(e) =>
                                            handleSelectedAttachment(
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </Card>
                              </div>
                            </>
                          )
                        )}
                      </div>
                      <div className="row">
                        <div className="col-lg-12">
                          <p
                            style={{
                              color: "#002752",
                              fontWeight: "bold",
                              height: "1px",
                            }}
                          >
                            Order Description:
                          </p>
                          <p>{orders?.order_description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <form className="" ref={formRef} onSubmit={onSubmit}>
                    <div className="row mt-5">
                      <div className="col-lg-3 col-12 mt-2">
                        <Input
                          type="floating"
                          name="task_title"
                          label="Title"
                          labelClass="inputlabel"
                          className={styles.inputfield}
                        />
                      </div>
                      <div className="col-lg-3">
                        <div style={{ borderBottom: "1px solid #cbc8d0" }}>
                          <DatePicker
                            selected={startDate}
                            dateFormat="yyyy/MM/dd"
                            onChange={(date: Date) => setStartDate(date)}
                            placeholderText="Task Deadline Date"
                            name="task_deadlinedate"
                            className={styles.dateinputfield}
                            required
                          ></DatePicker>
                        </div>
                      </div>
                      <div className="col-lg-3 mt-4" style={{}}>
                        {/* <label className={styles.inputlabel}>Role</label> */}
                        <Dropdown
                          options={userOptions}
                          name="user_name"
                          type="light"
                          className={styles.userlistdropdown}
                          placeholder="Select Task Manager"
                          onItemClick={(managerId) => handlemanager(managerId)}
                        />
                      </div>
                      {userOptions ? (
                        <div
                          className="col-lg-3"
                          style={{ borderBottom: "1px solid #cbc8d0" }}
                        >
                          <div>
                            <AutoComplete
                              className={styles.memberauto}
                              options={userOptions}
                              type="secondary"
                              label="Select Members"
                              style={{
                                border: "none",
                              }}
                              name="user_name"
                              onItemClick={(id) =>
                                setMembersId([...membersId, id])
                              }
                            />
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <div className="row mt-4">
                      <div className="col-12">
                        <Input
                          name="task_description"
                          style={{
                            height: "150px",
                            border: " 1px solid #cbc8d0",
                          }}
                          type="floating-textarea"
                          label="Description"
                          labelClass="inputlabel"
                        />
                      </div>
                    </div>
                    <div className="row mt-4">
                      <div className="col-lg-2">
                        <label className={styles.inputlabeluploader}>
                          Attachments
                        </label>
                        <Uploader
                          name="attachment[]"
                          multiple={true}
                          className={styles.uploadbtnn}
                        />
                      </div>
                    </div>
                    <div className="row mt-4 mb-3">
                      <div className="col-lg-12">
                        <Button
                          className="btn btn-primary btn-md"
                          htmlType="submit"
                        >
                          Submit
                        </Button>
                      </div>
                    </div>
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

export default CreateTask;
// function dispatch(
//   arg0: (dispatch: import("../../redux/types").AppThunkDispatch) => Promise<any>
// ) {
//   throw new Error("Function not implemented.");
// }
// function updateTaskDetail(params: { data: FormData; }): any {
//   throw new Error("Function not implemented.");
// }

// function order_id(order_id: any): any {
//   throw new Error("Function not implemented.");
// }

// function updateorder(): any {
//   throw new Error("Function not implemented.");
// }
// function createNewTask(params: { data: FormData; }): any {
//   throw new Error("Function not implemented.");
// }
