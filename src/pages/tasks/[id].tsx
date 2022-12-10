//@ts-nocheck
import Card from "elements/lib/components/Card";
import CardHeader from "elements/lib/components/Card";
import React, { useRef, useState, useCallback } from "react";
import { Button, Icon, Modal } from "elements";
import { useQuery } from "react-query";
import { deleteTask, taskDetails, taskWorkAttachment } from "../../api/task";
import { useDispatch, useSelector } from "react-redux";
import { AppThunkDispatch, RootState } from "../../redux/types";
import { useRouter } from "next/router";
import Loader from "../../components/shared/Loader";
import { getBrandMembers } from "../../api/brand";
import { ITaskDetails, ITaskMembers, ITaskReply } from "../../model/task";
import {
  PostComment,
  CommentList,
} from "../../components/tasks/CommentSection";
import UserList from "../../components/tasks/UserList/UserList";
import { commentTorwardedType } from "../../components/tasks/CommentSection/CommentList";
import MemberList from "../../components/tasks/MemberList/MemberList";
import TaskAttachment from "../../components/tasks/TaskAttachments/TaskAttachments";
import ForwardedTaskAttachment from "../../components/tasks/ForwardedTaskAttachments/ForwardedTaskAttachments";
import WorkAttachments from "../../components/tasks/WorkFile/WorkAttachments";
import UploadWork from "../../components/tasks/UploadWork/uploadWork";
import Image from "next/image";
import Delete from "../../../public/icons/delete.svg";
import Update from "../../../public/icons/update.svg";
import Users from "../../../public/icons/addmember.svg";
import { Roles } from "../../constant/app";

function Detail() {
  const dispatch = useDispatch<AppThunkDispatch>();
  const user = useSelector((store: RootState) => store.auth.user);
  const router = useRouter();
  const [showUsers, setShowUsers] = useState(false);
  const { id } = router.query;
  const commentRef = useRef<commentTorwardedType>(null);
  const [showworkAttachmentModal, setShowworkAttachmentModal] = useState(false);

  const { data: task, isLoading } = useQuery<ITaskDetails>(
    `TaskDetails${id}`,
    async () => {
      const params = { data: { task_id: id } };
      const response = await dispatch(taskDetails(params));
      return response;
    },
    {
      enabled: !!user?.user_id && !!id,
    }
  );

  const {
    data: members,
    isLoading: membersLoading,
    refetch: membersReload,
  } = useQuery<ITaskMembers>(
    `Members`,
    async () => {
      const params = {
        params: {
          task_id: id,
        },
      };
      const response = await dispatch(getBrandMembers(params));
      return response;
    },
    {
      enabled: !!user?.user_id && !!id,
    }
  );

  const {
    data: taskAttachments,
    isLoading: workAttachmentLoading,
    refetch: refetchWorkAttachment,
  } = useQuery<ITaskDetails>(
    `TaskWorkAttachment${id}`,
    async () => {
      const params = { data: { task_id: id } };
      const response = await dispatch(taskWorkAttachment(params));
      return response;
    },
    {
      enabled: !!user?.user_id && !!id,
    }
  );

  const onUserListClose = () => {
    setShowUsers(false);
    membersReload();
  };
  const onworkAttachmentModalClose = useCallback(() => {
    setShowworkAttachmentModal(false);
    refetchWorkAttachment();
  }, [refetchWorkAttachment]);

  const onDelete = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      try {
        const params = {
          data: {
            task_id: task?.basicdetail?.task_id,
          },
        };
        await dispatch(deleteTask(params));
        router.replace("/tasks/taskList");
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, router, task?.basicdetail?.task_id]
  );

  const onEdit = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      router.push(`/tasks/update/${task?.basicdetail?.task_id}`);
    },
    [router, task?.basicdetail?.task_id]
  );

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
      <div
        className=""
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <Modal
          show={showUsers}
          style={{ width: "30%", maxHeight: "60%" }}
          onBackdrop={onUserListClose}
        >
          <UserList members={members} />
        </Modal>
        <CardHeader
          style={{ border: "none", background: "#298ECE", position: "inherit" }}
        >
          <div className="container">
            <div className="row" style={{ alignItems: "center" }}>
              <div className="col-lg-10">
                <h4
                  style={{
                    color: "white",
                    marginTop: "2%",
                    marginBottom: "2%",
                  }}
                >
                  {task?.basicdetail.task_title}
                </h4>
              </div>
              {user &&
              [Roles.SUPER_ADMIN, Roles.UNIT_HEAD].includes(user?.role_id) ? (
                <div className="col-lg-2">
                  <div
                    className="d-flex justify-content-end"
                    style={{ transform: "translateX(-9px)" }}
                  >
                    <span
                      style={{
                        marginLeft: "3px",
                        marginRight: "3px",
                      }}
                      title="Update"
                      onClick={onEdit}
                    >
                      <Image src={Update} alt="Alt" width={"35px"} />
                    </span>
                    <span
                      style={{
                        marginLeft: "3px",
                        marginRight: "3px",
                      }}
                      title="Delete"
                      onClick={onDelete}
                    >
                      <Image src={Delete} alt="Alt" width={"35px"} />
                    </span>
                    {/* <Button
                    className=" trash"
                    iconName="trash"
                    style={{
                      color: 'white',
                      background: '#fb5353',
                      borderRadius: '7px',
                      border: '1px solid #fff',
                    }}
                    onClick={onDelete}
                  /> */}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </CardHeader>
        <Card
          style={{
            position: "inherit",
          }}
        >
          <div className="container">
            <div className="row">
              <div className="col-lg-8">
                <h4
                  style={{
                    height: "16px",
                    fontSize: "16px",
                    color: "gray",
                    fontWeight: "bold",
                  }}
                >
                  Project Description
                </h4>
                <Card
                  style={{
                    borderRadius: "5px",
                    overflowY: "scroll",
                  }}
                >
                  <p
                    style={{
                      color: "#444444",
                      textAlign: "justify",
                      margin: "5px",
                    }}
                  >
                    {task?.basicdetail.task_description}
                  </p>
                </Card>

                <h4
                  style={{
                    height: "16px",
                    fontSize: "16px",
                    color: "gray",
                    fontWeight: "bold",
                  }}
                >
                  Comments Section
                </h4>

                <PostComment
                  taskId={id}
                  user={user}
                  refetchComments={commentRef.current?.refetchComments}
                  memebers={members?.memberdetail}
                />
                {id && <CommentList taskId={id} user={user} ref={commentRef} />}
              </div>

              <div className="col-lg-4">
                <div className="d-flex" style={{ alignItems: "baseline" }}>
                  <h4
                    style={{
                      height: "16px",
                      fontSize: "16px",
                      color: "gray",
                      fontWeight: "bold",
                    }}
                  >
                    Project Members
                  </h4>
                  <span className="float-right">
                    <Icon
                      className="m-1"
                      name="plus-square-fill"
                      style={{ color: "green" }}
                      onClick={() => setShowUsers(true)}
                    />
                  </span>
                </div>
                <MemberList members={members} />

                <h4
                  style={{
                    height: "16px",
                    fontSize: "16px",
                    color: "gray",
                    fontWeight: "bold",
                  }}
                >
                  Client Attachments
                </h4>
                <TaskAttachment
                  attachments={task?.attachmentdetail}
                  attachmentPath={task?.taskpath}
                />
                <ForwardedTaskAttachment
                  attachments={task?.forwardedattachmentdetail}
                  forwardedtaskpath={task?.forwardedtaskpath}
                />

                <h4
                  style={{
                    height: "16px",
                    fontSize: "16px",
                    color: "gray",
                    fontWeight: "bold",
                  }}
                >
                  Work Attachments
                </h4>
                <WorkAttachments taskAttachments={taskAttachments} />
                <div
                  style={{
                    display: "flex",
                    position: "fixed",
                    bottom: "16px",
                    right: "27px",
                  }}
                >
                  <Button
                    style={{
                      width: "350px",
                    }}
                    onClick={() => setShowworkAttachmentModal(true)}
                  >
                    <Icon
                      style={{
                        color: "white",
                      }}
                      name="upload"
                    />
                    <span> Upload Your work </span>
                  </Button>
                </div>
              </div>
            </div>
            <Modal
              style={{
                overflowY: "scroll",
                minHeight: "470px",
                maxHeight: "470px",
                maxWidth: "470px",
              }}
              show={showworkAttachmentModal}
              onBackdrop={onworkAttachmentModalClose}
            >
              <UploadWork
                uploadwork={task?.basicdetail}
                closeModal={onworkAttachmentModalClose}
                orderId={task?.basicdetail?.order_id}
              />
            </Modal>
          </div>
        </Card>
      </div>
    </>
  );
}

export default Detail;
