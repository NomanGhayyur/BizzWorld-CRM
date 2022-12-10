import { Card, Icon } from 'elements';
import React from 'react';
import { useDispatch } from 'react-redux';
import { getBlobFile } from '../../../api/app';
import { attachmentType } from '../../../constant/app';
import { getExtention } from '../../../helper/utility';
import { ITaskDetails } from '../../../model/task';
import { AppThunkDispatch } from '../../../redux/types';

type propType = {
  attachments: ITaskDetails['attachmentdetail'] | undefined;
  forwardedtaskpath: string | undefined;
};
const ForwardedTaskAttachment = ({
  attachments,
  forwardedtaskpath,
}: propType) => {
  const dispatch = useDispatch<AppThunkDispatch>();
  const downloadAttachment = async (path: string, name = 'file.txt') => {
    const response = await dispatch(getBlobFile({ path }));
    const blobUrl = URL.createObjectURL(response);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = name;
    a.click();
    a.remove();
  };

  return (
    <Card
      style={{
        borderRadius: '5px',
        border: 'none',
      }}
    >
      <Card style={{ border: 'none' }}>
        <div>
          {attachments &&
            attachments.map((attachment) => {
              const typeOfAttachment = getExtention(
                attachment.taskattachment_name
              );
              return (
                <div key={attachment.taskattachment_id}>
                  <Card
                    style={{
                      marginBottom: '3px',
                      borderRadius: '5px',
                    }}
                  >
                    <div className="d-flex">
                      <div className="imgdiv m-2">
                        <div
                          style={{
                            cursor: 'pointer',
                          }}
                          onClick={() =>
                            downloadAttachment(
                              `${forwardedtaskpath}${attachment.taskattachment_name}`,
                              attachment.taskattachment_name
                            )
                          }
                        >
                          {attachmentType.image.includes(typeOfAttachment) ? (
                            <Icon
                              name="file-earmark-image"
                              style={{
                                fontSize: '25px',
                                color: '#5e66ff',
                              }}
                            />
                          ) : (
                            <Icon
                              name="file-earmark-text"
                              style={{
                                fontSize: '25px',
                                color: '#ff5e5e',
                              }}
                            />
                          )}
                        </div>
                      </div>
                      <div className="m-2">
                        <p
                          style={{
                            fontSize: '12px',
                            overflow: 'hidden',
                            // wordBreak: 'break-all',
                            marginBottom: '0px',
                          }}
                        >
                          {attachment.taskattachment_name}
                        </p>
                        {/* <p
                          style={{
                            paddingLeft: '10px',
                            height: '1px',
                            fontSize: '10px',
                            color: 'rgb(68, 168, 228)',
                          }}
                        >
                          {attachment.user_name}
                        </p> */}
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

export default React.memo(ForwardedTaskAttachment);
