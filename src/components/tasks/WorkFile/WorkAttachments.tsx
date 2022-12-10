import { Card, Icon } from "elements";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { getBlobFile } from "../../../api/app";
import { taskWorkAttachment } from "../../../api/task";
import { attachmentType } from "../../../constant/app";
import { getExtention } from "../../../helper/utility";
import { ITaskDetails } from "../../../model/task";
import { AppThunkDispatch, RootState } from "../../../redux/types";

type propType = {
  taskAttachments: ITaskDetails | undefined;
};
const WorkAttachment = ({ taskAttachments }: propType) => {
  const router = useRouter();
  // const { id } = router.query;
  const user = useSelector((store: RootState) => store.auth.user);
  const dispatch = useDispatch<AppThunkDispatch>();
  const downloadAttachment = async (path: string, name = "file.txt") => {
    window.open(path, "_blank");
    return;

    const response = await dispatch(getBlobFile({ path }));
    const blobUrl = URL.createObjectURL(response);
    // const a = document.createElement('a');
    // a.href = blobUrl;
    // a.download = name;
    // a.click();
    // a.remove();
    console.log(response);
    console.log(blobUrl);
    console.log("haris iqbal");
  };

  const workpath = `${taskAttachments?.taskworkpath}`;
  return (
    <Card
      style={{
        borderRadius: "5px",
        border: "none",
      }}
    >
      <Card style={{ border: "none" }}>
        <div>
          {taskAttachments &&
            taskAttachments.workattachmentdetail.map((taskAttachment) => {
              const typeOfAttachment = getExtention(
                taskAttachment.taskattachment_name
              );
              return (
                <div key={taskAttachment.taskattachment_id}>
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
                          onClick={() =>
                            downloadAttachment(
                              `${workpath}${taskAttachment.task_token}/${taskAttachment?.taskattachment_name}`,
                              taskAttachment.taskattachment_name
                            )
                          }
                        >
                          {attachmentType.image.includes(typeOfAttachment) ? (
                            <Icon
                              name="file-earmark-image"
                              style={{
                                fontSize: "25px",
                                color: "#5e66ff",
                              }}
                            />
                          ) : (
                            <Icon
                              name="file-earmark-text"
                              style={{
                                fontSize: "25px",
                                color: "#ff5e5e",
                              }}
                            />
                          )}
                        </div>
                      </div>
                      <div
                        style={{
                          marginTop: "10px",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "12px",
                            overflow: "hidden",
                            marginBottom: "0px",
                          }}
                        >
                          {taskAttachment?.taskattachment_name}
                        </p>
                        <p
                          style={{
                            // paddingLeft: "10px",
                            fontSize: "10px",
                            color: "#5069e7",
                          }}
                        >
                          Uploaded By {taskAttachment?.user_name}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
        </div>
      </Card>
    </Card>
  );
};

export default React.memo(WorkAttachment);
