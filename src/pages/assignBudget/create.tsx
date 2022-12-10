import React, { useRef, useCallback, useMemo } from 'react';
import { Icon, Input, Dropdown, IDropdownItem, Spinner } from 'elements';
import styles from '../../styles/ppc/PPC.module.css';

import { useDispatch } from 'react-redux';
import { AppThunkDispatch } from '../../redux/types';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { IApiParam } from '../../helper/api';
import Loader from '../../components/shared/Loader';
import 'react-datepicker/dist/react-datepicker.css';
import { updatePPC } from '../../api/ppc';
import { IPPC } from '../../model/ppc';
import {
  assignPPCBudget,
  getPPCBudgetDetail,
  getRoleWiseUserList,
} from '../../api/budget';

const AssignBudget: NextPage = () => {
  const dispatch = useDispatch<AppThunkDispatch>();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const { id } = router.query;

  const { data: users } = useQuery(
    `RoleWiseList`,
    async () => {
      const response = await dispatch(getRoleWiseUserList());
      return response.data;
    },
    {
      // enabled: !!user?.user_id
    }
  );

  const userOptions = useMemo(() => {
    return users?.reduce(
      (
        result: { [x: string]: { label: any } },
        users: { user_id: string | number; user_name: any }
      ) => {
        result[(users.user_name, users.user_id)] = {
          label: users.user_name,
        };
        return result;
      },
      {} as { [key in string]: IDropdownItem }
    );
  }, [users]);

  const { data: ppcBudget, isLoading } = useQuery<IPPC>(
    `AssignPPC_${id}`,
    async () => {
      const params: IApiParam = {
        params: {
          assignppc_id: id,
        },
      };
      const response = await dispatch(getPPCBudgetDetail(params));
      return response;
    },
    {
      enabled: !!id,
    }
  );

  const onSubmit: React.FormEventHandler = useCallback(
    async (e) => {
      e.preventDefault();

      const update = async () => {
        if (formRef.current) {
          const params = {
            data: new FormData(formRef.current),
          };
          await dispatch(updatePPC(params));
        }
        router.push(`/assignBudget/${id}`);
      };

      const createPPC = async () => {
        if (formRef.current) {
          const params = {
            data: new FormData(formRef.current),
          };
          params.data.delete('assignppc_id');
          await dispatch(assignPPCBudget(params));
        }
        router.push(`/assignBudget/`);
      };

      if (formRef.current) {
        try {
          if (id) {
            update();
          } else {
            createPPC();
          }
        } catch (e) {
          console.error(e);
        }
      }
    },
    [dispatch, id, router]
  );

  if (id && isLoading) return <Spinner loader={true} />;

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
                <div className="row">
                  <div className="col-lg-2">
                    <h4
                      className={styles.createbrandheading}
                      style={{ paddingLeft: '30px' }}
                    >
                      Assign PPC Budget
                    </h4>
                  </div>
                  <div className="col-lg-6">
                    <Icon
                      name={'arrow-left'}
                      onClick={() => router.back()}
                      style={{ marginTop: '13px' }}
                    />
                  </div>
                  <div className="col-lg-4"></div>
                </div>
              </div>

              <div style={{ margin: '20px' }}>
                <div className="card-body">
                  <form onSubmit={onSubmit} ref={formRef}>
                    <div className="row mt-4">
                      {userOptions ? (
                        <div
                          className={`col-lg-4 mt-0 ${styles.selectbrandoptiondiv}`}
                        >
                          <Dropdown
                            defaultKey={JSON.stringify(
                              ppcBudget?.data?.assignuser_id
                            )}
                            placeholder="Select User"
                            options={userOptions}
                            name="assignuser_id"
                            type="light"
                            className={styles.brandtypedropdown}
                          />
                        </div>
                      ) : null}
                      <div className="col-4">
                        <Input
                          defaultValue={ppcBudget?.data?.assignppc_amount}
                          className={styles.inputfield}
                          name="assignppc_amount"
                          htmlType="number"
                          type="floating"
                          label="Budget"
                          labelClass="inputlabel"
                          required
                        />
                      </div>

                      <div className="col-4 mt-2">
                        <div style={{ marginTop: '0px' }}>
                          <Input
                            defaultValue={ppcBudget?.data?.assignppc_month}
                            className={styles.inputfield}
                            name="assignppc_month"
                            htmlType="month"
                            type="floating"
                            label="Month"
                            labelClass="inputlabel"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row mt-4">
                      <div className="col-12">
                        <Input
                          name="assignppc_description"
                          defaultValue={ppcBudget?.data?.assignppc_description}
                          style={{
                            height: '150px',
                            border: ' 1px solid #cbc8d0',
                          }}
                          type="floating-textarea"
                          label="Description"
                          labelClass="inputlabel"
                          required
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="text-left mt-4 mb-3">
                        <button type="submit" className="btn btn-primary ">
                          Submit
                        </button>
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

export default AssignBudget;
