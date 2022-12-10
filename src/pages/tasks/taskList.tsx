import { Table, Highlighter, Icon, Input, IModalRef } from "elements";
import { NextPage } from "next";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "../../styles/brand/Brand.module.css";
import Card from "../../components/shared/Card";
import { useDispatch, useSelector } from "react-redux";
import { AppThunkDispatch, RootState } from "../../redux/types";
import { useQuery } from "react-query";

import { useRouter } from "next/router";
import {
  APPROVED,
  CANCEL,
  DOING,
  DONE,
  HALT,
  Roles,
  SENT_TO_CLIENT,
  TODO,
} from "../../constant/app";
import { deleteTask, getTaskList } from "../../api/task";
import Loader from "../../components/shared/Loader";
import { ITask } from "../../model/task";
import StatusHighlight from "../../components/shared/StatusHighligh/StatusHighlight";
import Image from "next/image";
import Delete from "../../../public/icons/delete.svg";
import Update from "../../../public/icons/update.svg";

type propTypes = {
  task?: Array<ITask>;
  className?: string;
  style?: React.CSSProperties;
};

type pageDetailsProps = {
  perPage: number | undefined;
  currentPage: string | number;
  total: number | undefined;
};

const colorObject: any = {
  Approved: "#FED7D7",
  Complete: "#CCEBC8",
  Cancel: "#82d7fa",
  Doing: "#D0F1DD",
  Done: "#FED7D7",
  Halt: "#c5fab9",
  "To Do": "#CCEBF8",
  "Sent To Client": "#f1f5b0",
};
const TasksList: NextPage = React.memo<propTypes>(() => {
  const dispatch = useDispatch<AppThunkDispatch>();
  const [filterText, setFilterText] = useState<string>("");
  const user = useSelector((store: RootState) => store.auth.user);
  const modalRef = useRef<IModalRef>(null);
  const [page, setPage] = useState(1);
  const router = useRouter();
  const [pageDetails, setPageDetails] = useState<pageDetailsProps>();
  const getTasks = async (pageId: string | number) => {
    const params = {
      params: {
        page: pageId,
      },
    };
    const response = await dispatch(getTaskList(params));
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
    data: tasksList,
    isLoading,
    refetch,
  } = useQuery<Array<ITask>>([`TaskList`, page], () => getTasks(page), {
    keepPreviousData: true,
  });
  useEffect(() => {
    if (router.asPath.split("#")[1]) {
      modalRef.current?.showModal(true);
    } else {
      modalRef.current?.showModal(false);
    }
  }, [router]);

  const onRowItemClick = useCallback(
    (task: ITask) => {
      router.push(`/tasks/${task.task_id}`);
    },
    [router]
  );

  const onDelete = useCallback(
    async (
      taskId: ITask["task_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      try {
        const params = {
          data: {
            task_id: taskId,
          },
        };
        await dispatch(deleteTask(params));
        refetch();
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, refetch]
  );

  const onEdit = useCallback(
    (
      taskId: ITask["task_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      router.push(`/tasks/update/${taskId}`);
    },
    [router]
  );

  const onRestore = useCallback(
    async (
      taskId: ITask["task_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
    },
    []
  );
  const columns = useMemo(() => {
    const temp = [
      {
        label: "ID",
        keyIndex: "task_id",
        render: (v: any, _: any, index: any) => parseInt(`${index + 1}`),
      },
      {
        label: "Title",
        keyIndex: "task_title",
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterText} />
        ),
        sortIndex: "task_title",
        sortable: true,
      },
      {
        label: "Status",
        keyIndex: "taskstatus_name",
        render: (v: any) => (
          <StatusHighlight bgColor={colorObject[v]}>
            <Highlighter text={`${v}`.trim()} searchText={filterText} />
          </StatusHighlight>
        ),
        sortIndex: "taskstatus_name",
        sortable: true,
      },

      {
        label: "Created By",
        keyIndex: "creator",
        render: (v: any) => (
          <Highlighter text={v || ""} searchText={filterText} />
        ),
      },
      {
        label: "Deadline Date",
        keyIndex: "task_deadlinedate",
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
        keyIndex: "task_id,deleted_at",
        render: (v: any) => (
          <>
            {!v.deleted_at ? (
              <span
                style={{
                  marginLeft: "3px",
                  marginRight: "3px",
                }}
                title="Delete"
                onClick={onDelete.bind(this, v.task_id)}
              >
                <Image src={Delete} alt="Alt" width={"25px"} />
              </span>
            ) : (
              <span className="arrowclockwise">
                <Icon
                  className="m-1"
                  name="arrow-counterclockwise"
                  onClick={onRestore.bind(this, v.task_id)}
                />
              </span>
            )}
            <span
              style={{
                marginLeft: "3px",
                marginRight: "3px",
              }}
              title="Edit"
              onClick={onEdit.bind(this, v.order_id)}
            >
              <Image src={Update} alt="Alt" width={"25px"} />
            </span>
          </>
        ),
      });
    }
    return temp;
  }, [filterText, onDelete, onRestore, onEdit, user]);

  const onSearchByText: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      setFilterText(e.target.value);
    }, []);

  const filtered: Array<ITask> = useMemo(() => {
    if (filterText) {
      return (
        tasksList?.filter((v: ITask) => {
          return (
            v.task_name?.toLowerCase()?.includes(filterText.toLowerCase()) ||
            v.task_email?.toLowerCase()?.includes(filterText.toLowerCase()) ||
            v.taskstatus_name
              ?.toLowerCase()
              ?.includes(filterText.toLowerCase()) ||
            `${v.tasktype_id}`.toLowerCase()?.includes(filterText.toLowerCase())
          );
        }) || []
      );
    }
    return tasksList || [];
  }, [tasksList, filterText]);

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
    <Card
      className={styles.brandList__container}
      style={{
        border: "none",
        boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
        borderRadius: "5px",
      }}
    >
      <div className="row">
        <div className="col-lg-3 mt-1">
          <h5 style={{ fontWeight: "bold", fontSize: "16px" }}>Tasks List</h5>
        </div>
        <div className="col-lg-1">
          <Icon
            name={"arrow-left"}
            onClick={() => router.back()}
            style={{ marginTop: "13px" }}
          />
        </div>
        <div className="col-lg-2"></div>
        <div className="col-lg-6 d-flex justify-content-right">
          <div className="ml-6 col-6">
            <Input
              style={{ marginTop: "20px" }}
              placeholder="Search Task"
              onChange={onSearchByText}
            />
          </div>
          <div className={styles.createbrandheading}></div>
          <div className={`text-right ${styles.brandtableiconsswitchdiv}`}>
            {/* {!borderView ? (
              <Icon name="table" onClick={setBorderView.bind(this, true)} />
            ) : (
              <Icon name="list" onClick={setBorderView.bind(this, false)} />
            )} */}
          </div>
        </div>
      </div>
      <div className={`table_card ${styles.dataWrapper}`}>
        <>
          <Table
            autoSort={false}
            loading={isLoading}
            onRowItemClick={onRowItemClick}
            onPageChange={(p) => setPage(p)}
            data={filtered}
            columnHeadings={columns}
            pageSize={pageDetails?.perPage}
            currentPage={page}
            total={pageDetails?.total}
            key={"task_id"}
          />
        </>
      </div>
    </Card>
  );
});
export default TasksList;
