import { Table, Highlighter, IModalRef } from "elements";
import { NextPage } from "next";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppThunkDispatch, RootState } from "../../../redux/types";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { getTaskList } from "../../../api/task";
import Loader from "../Loader";
import { ITask } from "../../../model/task";
import StatusHighlight from "../StatusHighligh/StatusHighlight";
import { IAdmin } from "../../../model/admindashboard";

type propTypes = {
  task?: Array<ITask>;
  className?: string;
  style?: React.CSSProperties;
  paymentdata?: IAdmin;
  isLoading: any;
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

const BrandPaymentList = ({ style, paymentdata, isLoading }: propTypes) => {
  // const BrandPaymentList: NextPage = React.memo<propTypes>(() => {
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
      {
        label: "ID",
        keyIndex: "task_id",
        render: (v: any, _: any, index: any) => parseInt(`${index + 1}`),
      },
      {
        label: "Order Title",
        keyIndex: "order_title",
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterText} />
        ),
      },
      {
        label: "Payment Title",
        keyIndex: "orderpayment_title",
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterText} />
        ),
      },
      {
        label: "Amount",
        keyIndex: "orderpayment_amount",
        render: (v: any) => (
          <p style={{ margin: "0px" }}>
            $ <Highlighter text={`${v}`.trim()} searchText={filterText} />
          </p>
        ),
      },

      {
        label: "Creator",
        keyIndex: "user_name",
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterText} />
        ),
      },
    ];

    return temp;
  }, [filterText]);

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
    <div className="container">
      <div className="row">
        <div className="col-lg-3 mt-1">
          <h5 style={{ fontWeight: "bold", fontSize: "16px" }}>Payment List</h5>
        </div>
      </div>
      <div>
        <>
          <Table
            autoSort={false}
            loading={isLoading}
            onRowItemClick={onRowItemClick}
            //@ts-ignore
            data={paymentdata}
            columnHeadings={columns}
            key={"task_id"}
          />
        </>
      </div>
    </div>
  );
};
export default React.memo(BrandPaymentList);
