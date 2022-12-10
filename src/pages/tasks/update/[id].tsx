import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  AutoComplete,
  Button,
  Card,
  Dropdown,
  Icon,
  IDropdownItem,
  Input,
  Uploader,
} from 'elements';
import { useDispatch } from 'react-redux';
import { AppThunkDispatch } from '../../../redux/types';
import { useQuery } from 'react-query';
import { getAllUserList } from '../../../api/user';
import styles from '../../../styles/Taskform.module.css';
import { NextPage } from 'next';
import router, { useRouter } from 'next/router';
import { getOrderDetail } from '../../../api/order';
import { IApiParam } from '../../../helper/api';
import Notify from '../../../components/shared/Notify';
import { createNewTask, taskDetails, updateTask } from '../../../api/task';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { IOrderListItem } from '../../../model/order';
import { ITask, ITaskDetails } from '../../../model/task';
import AttachmentView from '../../../components/shared/AttachmentView';

const UpdateTask: NextPage = () => {
  const dispatch = useDispatch<AppThunkDispatch>();
  const [startDate, setStartDate] = useState<Date>();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const { id } = router.query;
  const [membersId, setMembersId] = useState<Array<string | number>>([]);
  const [managerId, setManagerId] = useState<string | number | undefined>();

  const handlemanager = (managerId: string | number | undefined) => {
    setManagerId(managerId);
  };

  const {
    data: task,
    isLoading,
    refetch,
  } = useQuery<ITaskDetails>(
    `Task_${id}`,
    async () => {
      const params: IApiParam = {
        params: {
          task_id: id,
        },
      };
      let response = await dispatch(taskDetails(params));
      response = {
        ...response.data,
        attachment: response.attachmentdetail,
        basicdetail: response.basicdetail,
        taskpath: response.taskpath,
        memberpath: response.memberpath,
      };
      return response;
    },
    {
      enabled: !!id,
    }
  );

  const { data: users } = useQuery(
    `UserList`,
    async () => {
      const response = await dispatch(getAllUserList());
      const { data, ...meta } = response.data;
      return data;
    },
    {}
  );
  const userOptions = useMemo(() => {
    return users?.reduce(
      (
        result: { [x: string]: { label: any } },
        users: { user_id: string | number; user_name: any }
      ) => {
        result[users.user_id] = {
          label: users.user_name,
        };
        return result;
      },
      {} as { [key in string]: IDropdownItem }
    );
  }, [users]);

  const onSubmit: React.FormEventHandler = useCallback(
    async (e) => {
      e.preventDefault();
      if (formRef.current) {
        const params = {
          data: new FormData(formRef.current),
        };
        params.data.append('task_id', `${id}`);
        params.data.append(`task_manager`, `${managerId}`);

        await dispatch(updateTask(params));
        router.push('/tasks/taskList');
      }
    },
    [dispatch, id, managerId, router]
  );

  function handleSelectedAttachment(value: string | number) {}

  return (
    <div>
      <div className="container-fluid">
        <div className="row align-items-center mt-5">
          <div
            className={`col-12 mx-auto ${styles.cardcontainermarginpadding}`}
          >
            <div className="card shadow border">
              <div
                className="card-header"
                style={{ background: 'rgba(0,0,0,.03)' }}
              >
                <h4
                  className={styles.createtaskformheading}
                  style={{ paddingLeft: '20px' }}
                >
                  Update Task
                </h4>
              </div>
              <div style={{ margin: '20px' }}>
                <div className="card-body">
                  <form className="" ref={formRef} onSubmit={onSubmit}>
                    <div className="row mt-5">
                      <div className="col-lg-3 col-12 mt-2">
                        <Input
                          type="floating"
                          name="task_title"
                          label="Title"
                          labelClass="inputlabel"
                          className={styles.inputfield}
                          defaultValue={task?.basicdetail?.task_title}
                        />
                      </div>
                      <div className="col-lg-3">
                        <div style={{ borderBottom: '1px solid #cbc8d0' }}>
                          <DatePicker
                            selected={startDate}
                            dateFormat="yyyy/MM/dd"
                            onChange={(date: Date) => setStartDate(date)}
                            placeholderText="Task Deadline Date"
                            name="task_deadlinedate"
                            className={styles.dateinputfield}
                            value={`${task?.basicdetail?.task_deadlinedate}`}
                            required
                          ></DatePicker>
                        </div>
                      </div>
                      <div className="col-lg-3 mt-4" style={{}}>
                        {/* <label className={styles.inputlabel}>Role</label> */}
                        <Dropdown
                          options={userOptions}
                          name="user_name"
                          type="light"
                          className={styles.userlistdropdown}
                          placeholder="Select Task Manager"
                          onItemClick={(managerId) => handlemanager(managerId)}
                          value={`${task?.basicdetail?.task_manager}`}
                        />
                      </div>
                    </div>

                    <div className="row mt-4">
                      <div className="col-12">
                        <Input
                          name="task_description"
                          style={{
                            height: '150px',
                            border: ' 1px solid #cbc8d0',
                          }}
                          type="floating-textarea"
                          label="Description"
                          labelClass="inputlabel"
                          defaultValue={task?.basicdetail?.task_description}
                        />
                      </div>
                    </div>

                    <div className="row mt-4 mb-3">
                      <div className="col-lg-12">
                        <Button
                          className="btn btn-primary btn-md"
                          htmlType="submit"
                        >
                          Submit
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateTask;
