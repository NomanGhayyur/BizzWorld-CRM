import { Table, Highlighter, IModalRef, Card } from "elements";
import { NextPage } from "next";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppThunkDispatch, RootState } from "../../../../redux/types";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { getTaskList } from "../../../../api/task";
import Loader from "../../Loader";
import { ITask } from "../../../../model/task";
import StatusHighlight from "../../StatusHighligh/StatusHighlight";
import { IAdmin } from "../../../../model/admindashboard";

type propTypes = {
  task?: Array<ITask>;
  className?: string;
  style?: React.CSSProperties;
  taskdata?: IAdmin;
};

const colorObject: any = {
  Approved: "#EFD8D8",
  Complete: "#CCEBC8",
  Cancel: "#82d7fa",
  Doing: "#D0F1DD",
  Done: "#FED7D7",
  Halt: "#c5fab9",
  "To Do": "#CCEBF8",
  "Sent To Client": "#f1f5b0",
};

const DashboardTaskList = ({ style, taskdata }: propTypes) => {
  // const DashboardTaskList: NextPage = React.memo<propTypes>(() => {
  const dispatch = useDispatch<AppThunkDispatch>();
  const [filterText, setFilterText] = useState<string>("");
  const user = useSelector((store: RootState) => store.auth.user);
  const modalRef = useRef<IModalRef>(null);
  const router = useRouter();

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

  const columns = useMemo(() => {
    const temp = [
      //   {
      //     label: 'ID',
      //     keyIndex: 'task_id',
      //     render: (v: any, _: any, index: any) => parseInt(`${index + 1}`),
      //   },
      {
        label: "Task Title",
        keyIndex: "task_title",
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterText} />
        ),
      },
      {
        label: "Creator",
        keyIndex: "creator",
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterText} />
        ),
      },
      {
        label: "Status",
        keyIndex: "taskstatus_name",
        render: (v: any) => (
          <StatusHighlight bgColor={colorObject[v]}>
            <Highlighter text={`${v}`.trim()} searchText={filterText} />
          </StatusHighlight>
        ),
      },

      {
        label: "Deadline",
        keyIndex: "task_deadlinedate",
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterText} />
        ),
      },
    ];

    return temp;
  }, [filterText]);

  //   if (isLoading) {
  //     return (
  //       <div
  //         className="d-flex justify-cntent-center align-items-center"
  //         style={{ height: '100vh' }}
  //       >
  //         <Loader fullPage />
  //       </div>
  //     );
  //   }
  return (
    <Card
      style={{
        border: "none",
        borderRadius: "5px",
        marginTop: "1rem",
        height: "33rem",
      }}
    >
      <div className="row">
        <div className="col-lg-3 mt-1">
          <h3
            style={{ margin: "1rem", marginBottom: "0px", fontWeight: "700" }}
          >
            Tasks
          </h3>
        </div>
      </div>
      <div
        className="container-fluid"
        style={{
          borderRadius: "5px",
          boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",

          height: "25rem",
          width: "95%",
        }}
      >
        <div style={{ marginTop: "1rem" }}>
          <div className="row" style={{ height: "2rem" }}>
            <div className="col-lg-12"></div>
          </div>
          <>
            <Table
              autoSort={false}
              onRowItemClick={onRowItemClick}
              //@ts-ignore
              data={taskdata}
              columnHeadings={columns}
              key={"task_id"}
            />
          </>
        </div>
      </div>
    </Card>
  );
};
export default React.memo(DashboardTaskList);
