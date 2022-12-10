import { Button, Icon, Input } from 'elements';
import Image from 'next/image';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { getBrandUserList } from '../../../api/brand';
import { AppThunkDispatch, RootState } from '../../../redux/types';
import { ITaskMembers, ITaskUser } from '../../../model/task';
import { addMemberToTask, removeMemberToTask } from '../../../api/task';
import { useRouter } from 'next/router';
import Notify from '../../../components/shared/Notify';
import Loader from '../../shared/Loader';
type propType = {
  members: ITaskMembers | undefined;
  // addMember: (taskmember_id:number)=> void,
  // removeMember: (taskmember_id:number)=> void,
};

const UserList = ({ members }: propType) => {
  const [searchName, setSearchName] = useState('');
  const dispatch = useDispatch<AppThunkDispatch>();
  const user = useSelector((store: RootState) => store.auth.user);
  const router = useRouter();
  const { id } = router.query;
  const {
    data: userList,
    isLoading: usersLoading,
    refetch,
  } = useQuery<ITaskUser>(
    `UserList`,
    async () => {
      const params = {
        data: {
          brand_id: 1,
        },
      };
      // params.data.append('brand_id', `${brandId}`);
      const response = await dispatch(getBrandUserList(params));
      return response;
    },
    {
      enabled: !!user?.user_id,
    }
  );
  const [availableUsers, setAvailableUsers] = useState<number[] | undefined>(
    members?.memberdetail.map((member) => member.user_id)
  );

  const addMember = async (member_id: string | number) => {
    const response = await dispatch(
      addMemberToTask({
        params: { task_id: id, member_id },
      })
    );
    if (response.member_id) {
      setAvailableUsers((allUsers) => [
        ...(allUsers || []),
        +response.member_id,
      ]);
    }
  };

  const removeMember = async (taskmember_id: string | number) => {
    const response = await dispatch(
      removeMemberToTask({
        params: { task_id: id, taskmember_id },
      })
    );
    if (response.member_id) {
      setAvailableUsers((allUsers) =>
        allUsers?.filter((userId) => userId !== +response.member_id)
      );
    }
  };
  if (usersLoading) return <Loader fullPage />;
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="mt-3">
              <Input
                placeholder="Search Members"
                style={{ height: '40px' }}
                onChange={(e) => setSearchName(e.target.value)}
                autoFocus
              />
            </div>
          </div>
        </div>
        {userList?.data
          ?.filter(
            (member) =>
              member.user_name
                .toLowerCase()
                .indexOf(searchName.toLocaleLowerCase()) >= 0
          )
          .map((user) => {
            return (
              <div className="row mt-3" key={user.user_id}>
                <div className="col-lg-9 d-flex align-items-center">
                  <div>
                    <Image
                      src={`${userList.profilepath}${user.user_picture}`}
                      width={50}
                      height={50}
                      alt="user picture"
                    />
                  </div>
                  <div style={{ marginLeft: '10px' }}>
                    <p>{user.user_name}</p>
                  </div>
                </div>
                <div className="col-lg-3 d-flex align-items-center justify-content-end">
                  <div className="d-flex">
                    {availableUsers?.includes(user.user_id) ? (
                      <Icon
                        name="trash"
                        className="m1 trash"
                        onClick={() => removeMember(user.user_id)}
                      ></Icon>
                    ) : (
                      <Icon
                        name="plus"
                        className="m1 pencil"
                        onClick={() => addMember(user.user_id)}
                      ></Icon>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default React.memo(UserList);
