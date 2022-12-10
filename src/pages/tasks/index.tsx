import React, { useCallback, useContext, useState } from "react";
import layoutContext from "../../layout/layout.context";

import { useQuery } from "react-query";
import { statusWiseTask } from "../../api/task";
import { useDispatch, useSelector } from "react-redux";
import { AppThunkDispatch, RootState } from "../../redux/types";
import Loader from "../../components/shared/Loader";
import TaskCard from "../../components/tasks/TaskCard/TaskCard";
import { IStatus, IUserList } from "../../model/task";
import ScrumBoardHeader from "../../components/tasks/ScrumBoardHeader/ScrumBoardHeader";
import { getUserBrandList, getUserList } from "../../api/user";
import { IBrandListItem } from "../../model/brand";
import { IUser } from "../../model/user";

const colorObject: any = {
  Approved: "#FED7D7",
  Cancel: "#f06060",
  Doing: "#D0F1DD",
  Done: "#FED7D7",
  Halt: "#f9f3a5",
  "To Do": "#CCEBF8",
  "Sent To Client": "#f1f5b0",
  "Edit By Client": "#f9b6a5",
  "Edit Fixed": "#dcf9a5",
};

const Task = () => {
  const dispatch = useDispatch<AppThunkDispatch>();
  const [{ fullSideNav }] = useContext(layoutContext);
  const user = useSelector((store: RootState) => store.auth.user);
  const [activeBrandID, setActiveBrandId] = useState<number | string>(
    user?.brand1 || 1
  );
  const [data, setData] = useState();
  const onChangeBrand = useCallback((brandId: string | number) => {
    setActiveBrandId(brandId);
  }, []);

  const getTasksList = useCallback(
    async (id: string | number) => {
      const params = {
        params: {
          brand_id: id,
        },
      };
      const response = await dispatch(statusWiseTask(params));
      setData(response.data);
      return response.data;
    },
    [dispatch]
  );
  const {
    data: allStatus,
    isLoading,
    refetch: refetchStatus,
  } = useQuery<IStatus>(
    [`OrderList_${activeBrandID}`, activeBrandID],
    () => getTasksList(activeBrandID),
    {
      enabled: !!activeBrandID && !!user?.user_id,
    }
  );

  const { data: brandList } = useQuery<Array<IBrandListItem>>(
    `BrandList`,
    async () => {
      const response = await dispatch(getUserBrandList());
      return response.data;
    },
    {
      enabled: !!user?.user_id,
    }
  );

  const { data: userList } = useQuery<Array<IUser>>(
    `UserListScrum`,
    async () => {
      const params = {
        params: {
          brand_id: activeBrandID,
        },
      };
      let response = await dispatch(getUserList(params));
      return response.data;
    },
    {
      enabled: !!user?.user_id,
    }
  );

  const refecthList = useCallback(() => {
    refetchStatus();
  }, [refetchStatus]);

  if (isLoading) {
    return <Loader fullPage />;
  }
  return (
    <>
      <ScrumBoardHeader
        brandList={brandList}
        onChangeBrand={onChangeBrand}
        activeBrandId={activeBrandID}
        Branduser={userList}
      />
      <div
        className=""
        style={{
          position: "absolute",
          width: "100%",
          backgroundColor: "rgb(29, 29, 29)",
          height: "100%",
        }}
      >
        <div className="px-0">
          <div
            style={{
              position: "absolute",
              display: "flex",
              flexDirection: "row",
              overflow: "scroll",
              // width: `${
              //   fullSideNav ? 'calc(100% - 16rem)' : 'calc(100% - 4rem)'
              // }`,
              width: `${
                fullSideNav ? "calc(100% - 0rem)" : "calc(100% - 4rem)"
              }`,
            }}
          >
            {Object.keys(allStatus || {})?.map((status) => {
              return (
                <div
                  key={status}
                  className="card"
                  style={{
                    background: "white",
                    minWidth: "20rem",
                    height: "calc(100vh - 85px)",
                    margin: "8px",
                    marginLeft: "0px",
                    paddingBottom: "10px",
                    flex: 1,
                    borderRadius: "5px",
                    border: "none",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: colorObject[status] || "black",
                      borderTopLeftRadius: "5px",
                      borderTopRightRadius: "5px",
                    }}
                  >
                    <h5
                      style={{
                        paddingLeft: "15px",
                        color: "#000",
                        height: "1px",
                        marginTop: "15px",
                        marginBottom: "30px",
                      }}
                    >
                      {status}
                    </h5>
                  </div>
                  <div style={{ overflowY: "auto", minHeight: "95%" }}>
                    {allStatus && allStatus[status].data.length > 0 ? (
                      allStatus[status].data.map((task) => {
                        return (
                          <TaskCard
                            key={task.task_id}
                            title={task.task_title}
                            date={task.task_deadlinedate}
                            description={task.task_description}
                            href={task.task_id.toString()}
                            refecthList={refecthList}
                            noman={allStatus[status].data}
                          />
                        );
                      })
                    ) : (
                      <p className="text-center">No Tasks are available</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Task;
