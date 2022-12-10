import { Button, Card, Icon, Uploader } from "elements";
import router from "next/router";
import React, { useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { getBlobFile } from "../../../api/app";
import { submitWork } from "../../../api/task";
import { attachmentType } from "../../../constant/app";
import { getExtention } from "../../../helper/utility";
import { ITaskDetails } from "../../../model/task";
import { AppThunkDispatch } from "../../../redux/types";

type propType = {
  uploadwork: ITaskDetails["basicdetail"] | undefined;
  orderId: string | number;
  closeModal: () => void;
};
const UploadWork = ({ uploadwork, closeModal, orderId }: propType) => {
  const dispatch = useDispatch<AppThunkDispatch>();
  const formRef = useRef<HTMLFormElement>(null);
  //   const { taskId } = router.query;
  const onSubmit: React.FormEventHandler = useCallback(
    async (e) => {
      e.preventDefault();

      const submit = async () => {
        if (formRef.current) {
          const params = {
            order_id: orderId,
            data: new FormData(formRef.current),
          };
          params.data.append("task_token", `${uploadwork?.task_token}`);
          params.data.append("task_id", `${uploadwork?.task_id}`);
          params.data.append("order_id", `${orderId}`);
          await dispatch(submitWork(params));
          closeModal();
        }
      };

      if (formRef.current) {
        try {
          if (uploadwork?.task_id) {
            submit();
          } else {
          }
        } catch (e) {
          console.error(e);
        }
      }
    },

    [closeModal, dispatch, uploadwork?.task_id, uploadwork?.task_token]
  );

  return (
    <Card
      style={{
        borderRadius: "5px",
        border: "none",
      }}
    >
      <div
        className="container"
        style={{ border: "none", textAlign: "center", wordBreak: "break-all" }}
      >
        <h4
          style={{
            height: "16px",
            fontSize: "16px",
            color: "gray",
            fontWeight: "bold",
          }}
        >
          Upload Your works
        </h4>
        <form className="workattachments" ref={formRef} onSubmit={onSubmit}>
          <Uploader
            name={`attachment[]`}
            block
            multiple={true}
            showList
            size="normal"
            title="Choose Files"
            type="primary"
          />
          <div className="row mt-3">
            <div className="col-lg-12">
              <Button className="btn btn-primary btn-md" htmlType="submit">
                Submit
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default React.memo(UploadWork);
