import React, {
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Avatar, Button, Card, Icon } from 'elements';
import { useInfiniteQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import moment from 'moment';

import {
  getTaskComments,
  getTaskReply,
  postTaskReply,
} from '../../../api/task';
import { ITaskComment, ITaskReply } from '../../../model/task';
import { AppThunkDispatch } from '../../../redux/types';
import { IUser } from '../../../model/user';
import styles from '../../../styles/Taskform.module.css';
import Loader from '../../shared/Loader';

type propType = {
  taskId: string | string[] | undefined;
  user: IUser | null;
};
export type commentTorwardedType = {
  refetchComments: () => void;
};

const CommentList = React.forwardRef<commentTorwardedType, propType>(
  ({ taskId, user }, ref) => {
    const [path, setPath] = useState('');

    const [replies, setReplies] = useState<Array<ITaskReply>>([]);
    const dispatch = useDispatch<AppThunkDispatch>();
    const [showReplyField, setReplyField] = useState<string>();
    const replRef = useRef<HTMLTextAreaElement | null>(null);

    const getComments = useCallback(
      async ({ pageParam = 1 }) => {
        const params = { params: { task_id: taskId, page: pageParam } };
        const response = await dispatch(getTaskComments(params));
        const current_page = response.taskcommentdetails.current_page;
        const last_page = response.taskcommentdetails.last_page;
        const hasNextPage = current_page !== last_page;
        setPath(response?.path || '');
        return {
          response: response.taskcommentdetails.data,
          nextPage: hasNextPage ? current_page + 1 : undefined,
        };
      },
      [dispatch, taskId]
    );

    const {
      data: commentsGroups,
      isLoading: isCommentLoading,
      refetch: refetchComments,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage: loadingMoreComments,
    } = useInfiniteQuery([`TaskComments`, { enabled: !!taskId }], getComments, {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    });

    useImperativeHandle(
      ref,
      () => {
        return {
          refetchComments,
        };
      },
      [refetchComments]
    );

    const getReplies = useCallback(
      async (taskcomment_id: string | number) => {
        const params = {
          params: {
            taskcomment_id,
            task_id: taskId,
          },
        };
        const response = await dispatch(getTaskReply(params));
        setReplies(response.replydetail);
      },
      [dispatch, taskId]
    );

    const postReply = useCallback(
      async (taskcomment_id: string | number) => {
        const params = {
          params: {
            taskreply_reply: replRef?.current?.value || '',
            taskcomment_id,
          },
        };
        await dispatch(postTaskReply(params));
        if (replRef?.current) {
          replRef.current.value = '';
        }
        getReplies(taskcomment_id);
      },
      [dispatch, getReplies]
    );

    const onFetchNextPage = () => {
      fetchNextPage();
    };

    if (isCommentLoading) return <Loader fullPage icon />;

    return (
      <Card
        style={{
          border: 'none',
        }}
      >
        {commentsGroups?.pages?.map((group, i) => {
          const comments: ITaskComment[] | any = Object.entries(
            group?.response
          ).map((e) => e[1]);
          return comments?.map((comment: ITaskComment) => (
            <div
              className="postedcomments area mt-3 mb-1"
              key={comment.taskcomment_id}
            >
              <Card
                style={{
                  borderRadius: '5px',
                }}
              >
                <div className="row mt-2">
                  <div className="col-lg-1">
                    <Avatar
                      src={path + comment.user_picture}
                      className="rounded-circle"
                      style={{ width: 40, height: 40 }}
                    />
                  </div>

                  <div
                    className="col-lg-11 d-flex justify-content-between"
                    style={{
                      minHeight: '40px',
                    }}
                  >
                    <div
                      style={{
                        float: 'left',
                      }}
                    >
                      <h6
                        style={{
                          margin: '0px',
                        }}
                      >
                        {comment.user_name}
                      </h6>

                      <p
                        style={{
                          color: '#5069e7',
                          fontSize: '9px',
                        }}
                      >
                        {comment.role_name}
                      </p>
                    </div>
                    <div
                      className="d-flex"
                      style={{
                        marginRight: '2%',
                      }}
                    >
                      <p
                        style={{
                          color: '#5069e7',
                          fontSize: '9px',
                        }}
                      >
                        {comment.taskcomment_date}
                      </p>
                      <p
                        style={{
                          color: '#5069e7',
                          fontSize: '9px',
                        }}
                      >
                        {moment(comment.created_at).format('dddd, h:mm:ss a')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="container">
                      <p
                        style={{
                          textAlign: 'justify',
                          marginBottom: '0px',
                        }}
                        dangerouslySetInnerHTML={{
                          __html: comment.taskcomment_comment,
                        }}
                      ></p>

                      <div>
                        <Button
                          style={{
                            background: 'none',
                            color: '#5069e7',
                            fontSize: '10px',
                            marginTop: '0px',
                            marginLeft: '0px',
                          }}
                          onClick={() => setReplyField(comment.taskcomment_id)}
                        >
                          Reply
                        </Button>
                        <Button
                          style={{
                            background: 'none',
                            color: '#5069e7',
                            fontSize: '10px',
                            marginTop: '0px',
                            marginLeft: '0px',
                          }}
                          onClick={() => getReplies(comment.taskcomment_id)}
                        >
                          View Replies
                        </Button>
                      </div>
                      {showReplyField == comment.taskcomment_id && (
                        <div className="row">
                          <div className="d-flex">
                            <div className="col-lg-1 text-center justify-content-center ">
                              {user && (
                                <Avatar
                                  src={user?.path + user?.user_picture}
                                  className=""
                                  style={{
                                    border: '1px solid black',
                                    marginTop: '5px',
                                    marginBottom: '5px',
                                    width: 40,
                                    height: 40,
                                  }}
                                />
                              )}
                            </div>

                            <div
                              className="col-lg-11 d-flex text-right"
                              style={{
                                marginTop: '5px',
                                marginBottom: '5px',
                              }}
                            >
                              <textarea
                                placeholder="Write your reply"
                                style={{
                                  width: '92%',
                                  border: '1px solid lightgray',
                                  borderTopLeftRadius: '5px',
                                  borderTopRightRadius: '0px',
                                  borderBottomRightRadius: '0px',
                                  borderBottomLeftRadius: '5px',
                                  fontSize: '11px',
                                }}
                                className={styles.writeacomment}
                                ref={replRef}
                              />
                              <Button
                                onClick={() =>
                                  postReply(comment.taskcomment_id)
                                }
                                style={{
                                  borderTopLeftRadius: '0px',
                                  borderTopRightRadius: '5px',
                                  borderBottomRightRadius: '5px',
                                  borderBottomLeftRadius: '0px',
                                  height: '40px',
                                }}
                              >
                                <Icon
                                  name="send-fill"
                                  style={{
                                    fontSize: '20px',
                                    margin: '0px',
                                    padding: '0px',
                                    color: 'white',
                                  }}
                                />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="row">
                        {replies.map((reply) => {
                          if (reply.taskcomment_id == comment.taskcomment_id) {
                            return (
                              <div className="col-lg-12">
                                <Card
                                  style={{
                                    borderRadius: '5px',
                                    margin: '5px',
                                    // marginLeft: "30px",
                                  }}
                                >
                                  <div className="row mt-2">
                                    <div className="col-lg-1">
                                      <Avatar
                                        src={path + comment.user_picture}
                                        className="rounded-circle"
                                        style={{
                                          width: 40,
                                          height: 40,
                                        }}
                                      />
                                    </div>

                                    <div
                                      className="col-lg-11 d-flex justify-content-between"
                                      style={{
                                        minHeight: '40px',
                                      }}
                                    >
                                      <div>
                                        <h6
                                          style={{
                                            margin: '0px',
                                          }}
                                        >
                                          {reply.user_name}
                                        </h6>

                                        <p
                                          style={{
                                            color: '#5069e7',
                                            fontSize: '9px',
                                          }}
                                        >
                                          {reply.role_name}
                                        </p>
                                      </div>
                                      <div
                                        className="d-flex"
                                        style={{
                                          marginRight: '2%',
                                        }}
                                      >
                                        <p
                                          style={{
                                            color: '#5069e7',
                                            fontSize: '9px',
                                          }}
                                        >
                                          {reply.taskreply_date}
                                        </p>
                                        <p
                                          style={{
                                            color: '#5069e7',
                                            fontSize: '9px',
                                          }}
                                        >
                                          {moment(comment.created_at).format(
                                            'dddd, h:mm:ss a'
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      marginLeft: '5px',
                                    }}
                                  >
                                    <p key={reply.taskreply_id}>
                                      {reply.taskreply_reply}
                                    </p>
                                  </div>
                                </Card>
                              </div>
                            );
                          }
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ));
        })}
        <div>
          {hasNextPage && (
            <Button
              style={{
                background: 'none',
                color: '#5069e7',
                fontSize: '12px',
                float: 'right',
              }}
              disabled={!hasNextPage}
              onClick={onFetchNextPage}
            >
              Load more...
            </Button>
          )}
        </div>
      </Card>
    );
  }
);

export default React.memo(CommentList);
