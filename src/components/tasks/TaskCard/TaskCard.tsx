import { Dropdown, Icon, IDropdownItem, Modal } from "elements";
import Image from "next/image";
import React, { useCallback, useMemo, useState } from "react";

import dash from "../../../../public/images/Mask group.png";
import { AppThunkDispatch } from "../../../redux/types";
import { useDispatch } from "react-redux";
import { ITask } from "../../../model/task";
import { moveTask, taskStatus } from "../../../api/task";
import { useQuery } from "react-query";
import router from "next/router";
import styles from "./taskCard.module.css";
import { Value } from "@prisma/client/runtime";

type propType = {
  title: string;
  date: string | number;
  description: string;
  href: string;
  noman: any;
  refecthList: () => void;
};

const TaskCard = ({
  title,
  date,
  description,
  href,
  noman,
  refecthList,
}: propType) => {
  const dispatch = useDispatch<AppThunkDispatch>();
  const [confirmation, setConfirmation] = useState(false);
  const [taskID, settaskId] = useState<number | string | undefined>();
  console.log(noman, "data");
  const { data: status, refetch } = useQuery(
    `UserList`,
    async () => {
      const response = await dispatch(taskStatus());
      return response.data;
    },
    {}
  );
  const statusOptions = useMemo(() => {
    return status?.reduce(
      (
        result: { [x: string]: { label: any } },
        users: { taskstatus_id: string | number; taskstatus_name: any }
      ) => {
        result[users.taskstatus_id] = {
          label: users.taskstatus_name,
        };
        return result;
      },
      {} as { [key in string]: IDropdownItem }
    );
  }, [status]);

  const taskStatusUpdate = useCallback(
    async (tasstatusId: ITask["taskstatus_id"]) => {
      try {
        const params = {
          data: {
            task_id: href,
            taskstatus_id: tasstatusId,
          },
        };
        await dispatch(moveTask(params));
        refecthList();
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, href, refecthList]
  );

  return (
    <div>
      <div
        className="abc"
        style={{
          border: "1px solid #D2D2D2",
          borderRadius: "5px",
          marginBottom: "5px",
          marginTop: "10px",
          marginLeft: "7px",
          marginRight: "6px",
          padding: 10,
          cursor: "pointer",
          maxHeight: "200px",
        }}
      >
        <div onClick={() => router.push(`tasks/${href}`)}>
          <Image
            className="card-img-top"
            src={dash}
            width={"350"}
            height={"100"}
            alt=""
          />
        </div>
        <div className="card-body">
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ height: "25px" }}
          >
            <div className={`card-title ${styles.card_title}`}>
              <h5 className="" style={{ textTransform: "capitalize" }}>
                {title}
              </h5>
            </div>
            <div
              className="d-flex justify-content-between"
              style={{
                marginLeft: "0px",
                paddingBottom: "",
              }}
            >
              <div className="dateicon">
                {/* <Icon name="calendar-date-fill" style={{color:'#fb5353'}} /> */}
                <span
                  style={{
                    fontSize: "11px",
                    paddingLeft: "4px",
                    color: "#fb5353",
                    fontWeight: "bold",
                  }}
                >
                  {date}
                </span>
              </div>
            </div>
          </div>
          <div
            className="d-flex justify-content-between"
            style={{ alignItems: "flex-end" }}
          >
            <div className={`${styles.card_description}`}>
              <div
                className="card_description"
                style={{ fontSize: "12px", fontStyle: "italic" }}
              >
                {description}
              </div>
            </div>
            <div>
              <span
                className="float-right mt-0"
                style={{
                  position: "relative",
                }}
              >
                <Dropdown
                  className={styles.statusdropdown}
                  options={statusOptions}
                  iconName="arrows-move"
                  onItemClick={(e) => taskStatusUpdate(e)}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TaskCard);
