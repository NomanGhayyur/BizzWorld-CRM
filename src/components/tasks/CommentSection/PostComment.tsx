import { Avatar, Badge, Button, Card, Icon } from 'elements';
import React, { useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { postTaskComments } from '../../../api/task';
import { IUser } from '../../../model/user';
import { AppThunkDispatch } from '../../../redux/types';
import { MentionsInput, Mention } from 'react-mentions';
import { ITaskMembers } from '../../../model/task';
import merge from 'lodash/merge';
import mentionsInputStyle from './styles';

type propType = {
  user: IUser | null;
  taskId: string | string[] | undefined;
  refetchComments: (() => void) | undefined;
  memebers: ITaskMembers['memberdetail'] | undefined;
};

let customStyle = merge({}, mentionsInputStyle, {
  input: {
    height: '100%',
    overflow: 'auto',
  },
  highlighter: {
    height: '100%',
    overflow: 'hidden',
    boxSizing: 'border-box',
  },
});

const PostComment = ({ user, taskId, refetchComments, memebers }: propType) => {
  const [commentText, setCommentText] = useState('');
  const [mentionedText, setMentionedText] = useState('');
  const commentRef = useRef(null);
  const dispatch = useDispatch<AppThunkDispatch>();
  const postComment = async () => {
    const params = {
      params: {
        taskcomment_comment: commentText,
        task_id: taskId,
      },
    };
    const response = await dispatch(postTaskComments(params));
    setCommentText('');
    if (refetchComments) refetchComments();
  };
  const mentionUsers: { id: string | number; display?: string }[] | undefined =
    useMemo(
      () =>
        memebers &&
        memebers.map((member) => {
          return (
            {
              id: member.user_id,
              display: member.user_username.split(' ').join(''),
            } || {}
          );
        }),
      [memebers]
    );

  const handleCommentText = (e: { target: { value: string } }): void => {
    setCommentText(e.target.value);
  };
  const handleAdd = (id: string | number, name: string): void => {
    const fullText = commentText + name;
    const replaceText = fullText.replace(name, `<span>${name}</span>`);
    // setMentionedText(replaceText)
    // console.log(replacedText)
    // setMentionedText(replacedText)
  };
  return (
    <div>
      <Card
        style={{
          borderRadius: '5px',
        }}
      >
        <div className="row">
          <div className="col-lg-1 text-center justify-content-center ">
            {user && (
              <Avatar
                src={user?.path + user?.user_picture}
                className=""
                style={{
                  border: '1px solid black',
                  marginTop: '5px',
                  marginBottom: '5px',
                  marginLeft: '5px',
                  width: 40,
                  height: 40,
                }}
              />
            )}
          </div>

          <div
            className="col-lg-11 d-flex align-items-center "
            style={{
              marginTop: '5px',
              marginBottom: '5px',
            }}
          >
            <MentionsInput
              value={commentText}
              onChange={handleCommentText}
              style={{ ...customStyle, width: '90%' }}
            >
              <Mention
                trigger="@"
                data={
                  mentionUsers ? mentionUsers : [{ id: 0, display: 'No User' }]
                }
                onAdd={handleAdd}
                markup="@__display__"
                displayTransform={(id, display) => `@${display}`}
              />
            </MentionsInput>

            <Button
              onClick={postComment}
              style={{
                borderTopLeftRadius: '0px',
                borderTopRightRadius: '5px',
                borderBottomRightRadius: '5px',
                borderBottomLeftRadius: '0px',
                marginRight: '4px',
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
      </Card>
    </div>
  );
};

export default React.memo(PostComment);
