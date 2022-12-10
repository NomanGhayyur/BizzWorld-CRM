import moment from 'moment';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Button,
  Modal,
  Table,
  Input,
  Highlighter,
  Icon,
  IModalRef,
} from 'elements';
import CreateUser from '../../components/user/CreateUser';
import FilterUserList from '../../components/user/FilterUserList/FilterUserList';
import { IOrder } from '../../model/order';
import { AppThunkDispatch, RootState } from '../../redux/types';
import styles from '../../styles/order.module.css';
import Card from '../../components/shared/Card';
import { getOrderDetail } from '../../api/order';
import { IOrderListItem } from '../../model/order';
import { useDispatch, useSelector } from 'react-redux';
import { useInfiniteQuery, useQuery } from 'react-query';
import { attachmentType, DATE_FORMAT } from '../../constant/app';
import { IRequestMeta } from '../../model/app';
import Ordercreate from './create';
import app from '../../redux/reducers/app';
import Loader from '../../components/shared/Loader';
import { getBlobFile } from '../../api/app';
import { getExtention } from '../../helper/utility';

type propTypes = {
  users?: Array<IOrder>;
  className?: string;
  style?: React.CSSProperties;
  orderId?: IOrder['order_id'];
};

const AttachmentList = React.memo<propTypes>((props) => {
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

  const user = useSelector((store: RootState) => store.auth.user);
  const router = useRouter();
  const { id, order_id } = router.query;

  const orderId: IOrder['order_id'] = (props.orderId ||
    router.query?.id) as IOrder['order_id'];

  const {
    data: attachments,
    isLoading,
    refetch,
  } = useQuery<IOrder['attachmentdetail']>(
    `orderattachment_${id}`,
    async () => {
      let response = await dispatch(getOrderDetail({ data: { order_id: id } }));

      response = {
        ...response,
        path: response.orderpath,
        attachment: response.attachmentdetail,
      };
      return response;
    },
    {
      enabled: !!user?.user_id && !!id,
    }
  );
  const path = `${attachments?.orderpath}`;

  if (isLoading) {
    return (
      <div
        className="d-flex justify-cntent-center align-items-center"
        style={{ height: '100vh' }}
      >
        <Loader fullPage />
      </div>
    );
  }
  return (
    <Card
      style={{
        borderRadius: '5px',
        border: 'none',
      }}
    >
      <div
        className="row"
        style={{
          margin: 'auto',
          marginTop: '3%',
        }}
      >
        <div className="col-lg-2">
          <Card style={{ border: 'none' }}>
            {attachments &&
              attachments?.attachmentdetail.map(
                (attachment: IOrder['attachmentdetail']) => {
                  const typeOfAttachment = getExtention(
                    attachment.orderattachment_name
                  );
                  return (
                    <div key={attachment.orderattachment_id}>
                      <Card
                        style={{
                          marginBottom: '3px',
                          borderRadius: '5px',
                          width: '350px',
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
                                  `${path}${attachment.orderattachment_name}`,
                                  attachment.orderattachment_name
                                )
                              }
                            >
                              {attachmentType.image.includes(
                                typeOfAttachment
                              ) ? (
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
                              {attachment.orderattachment_name}
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
                }
              )}
          </Card>
        </div>
      </div>
    </Card>
  );
});

export default AttachmentList;
