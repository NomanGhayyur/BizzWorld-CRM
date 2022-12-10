import { Avatar, Card } from 'elements';
import React from 'react';
import { ITaskMembers } from '../../../model/task';

type propType = {
  members: ITaskMembers | undefined;
};
const MemberList = ({ members }: propType) => {
  return (
    <Card style={{ border: 'none' }}>
      <div style={{ height: '40%', overflowY: 'scroll' }}>
        {members?.memberdetail.map((member) => (
          <div key={member.taskmember_id}>
            <Card
              className="d-flex"
              style={{
                marginBottom: '3px',
                borderRadius: '5px',
              }}
            >
              <div
                className="d-flex justify-content-between"
                style={{ alignItems: 'end' }}
              >
                <div className="imgdiv m-2 d-flex">
                  <Avatar
                    src={`${members?.memberpath}${member.user_picture}`}
                    style={{
                      width: 40,
                      height: 40,
                      transform: 'translateY(4px)',
                    }}
                    className="rounded-circle"
                  />
                  <div className="imgtitlediv m-2">
                    <p style={{ paddingLeft: '10px', height: '1px' }}>
                      {member.user_name}
                    </p>
                    <p
                      style={{
                        paddingLeft: '10px',
                        height: '1px',
                        fontSize: '10px',
                        color: 'rgb(68, 168, 228)',
                      }}
                    >
                      {member.role_name}
                    </p>
                  </div>
                </div>

                <div className="m-2">
                  <p
                    style={{
                      color: 'red',
                    }}
                  >
                    {member.ismanager}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default React.memo(MemberList);
