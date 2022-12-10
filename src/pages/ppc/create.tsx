import React, { useRef, useCallback, useMemo, useState } from 'react';
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
import {
  createNewPPC,
  getPPCDetail,
  getPPCMonth,
  updatePPC,
} from '../../api/ppc';
import { IPPC } from '../../model/ppc';
import { getUserBrandList } from '../../api/user';
import CurrencyIcons from '../../components/shared/CurrencyIcons/currencyIcons';

const PPCCreate: NextPage = () => {
  const dispatch = useDispatch<AppThunkDispatch>();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [monthresponse, setMonthResponse] = useState();
  const { id } = router.query;

  const { data: brands } = useQuery(
    `BrandList`,
    async () => {
      const response = await dispatch(getUserBrandList());
      return response.data;
    },
    {
      // enabled: !!user?.user_id
    }
  );

  const handlemonth = useCallback(
    async (month: string) => {
      const response = await dispatch(
        getPPCMonth({ params: { assignppc_month: month } })
      );
      setMonthResponse(response.budget);
    },
    [dispatch]
  );
  console.log(monthresponse, 'month');

  const brandOptions = useMemo(() => {
    return brands?.reduce(
      (
        result: { [x: string]: { label: any } },
        brands: { brand_id: string | number; brand_name: any }
      ) => {
        result[(brands.brand_name, brands.brand_id)] = {
          label: brands.brand_name,
        };
        return result;
      },
      {} as { [key in string]: IDropdownItem }
    );
  }, [brands]);

  const { data: ppc, isLoading } = useQuery<IPPC>(
    `PPCDetails_${id}`,
    async () => {
      const params: IApiParam = {
        params: {
          ppc_id: id,
        },
      };
      const response = await dispatch(getPPCDetail(params));
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
        router.push(`/ppc/${id}`);
      };

      const createPPC = async () => {
        if (formRef.current) {
          const params = {
            data: new FormData(formRef.current),
          };
          params.data.delete('ppc_id');
          await dispatch(createNewPPC(params));
        }
        router.push(`/ppc/`);
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
                      Create PPC
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
                    <input
                      type="hidden"
                      value={ppc?.data?.ppc_id}
                      name="brand_id"
                    />
                    <div className="row mt-4">
                      {brandOptions ? (
                        <div
                          className={`col-lg-4 mt-0 ${styles.selectbrandoptiondiv}`}
                        >
                          <Dropdown
                            style={{
                              marginTop: '7px',
                            }}
                            defaultKey={JSON.stringify(ppc?.data?.brand_id)}
                            placeholder="Select Brand"
                            options={brandOptions}
                            name="brand_id"
                            type="light"
                            className={styles.brandtypedropdown}
                          />
                        </div>
                      ) : null}

                      <div
                        className={`col-lg-4 mt-0 ${styles.selectbrandoptiondiv}`}
                      >
                        <Input
                          defaultValue={ppc?.data?.ppc_amount}
                          className={styles.inputfield}
                          name="ppc_month"
                          htmlType="month"
                          type="floating"
                          label="Month"
                          labelClass="inputlabel"
                          required
                          onChange={(e) => handlemonth(e.target.value)}
                        />
                      </div>
                      <div
                        className={`col-lg-4 mt-0 d-flex ${styles.selectbrandoptiondiv}`}
                      >
                        <CurrencyIcons
                          style={{ marginTop: '27px', fontSize: '20px' }}
                        />
                        <Input
                          className={styles.inputfield}
                          value={monthresponse}
                          type="floating"
                          label="Assigned Budget"
                          labelClass="inputlabel"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div
                        className="col-4 d-flex"
                        style={{
                          marginTop: '7px',
                        }}
                      >
                        <CurrencyIcons
                          style={{ marginTop: '27px', fontSize: '20px' }}
                        />
                        <Input
                          defaultValue={ppc?.data?.ppc_amount}
                          className={styles.inputfield}
                          name="ppc_amount"
                          htmlType="number"
                          max={monthresponse}
                          type="floating"
                          label="PPC Amount"
                          labelClass="inputlabel"
                          required
                        />
                      </div>
                      <div className="col-4 mt-2">
                        <div>
                          <Input
                            defaultValue={ppc?.data?.ppc_date}
                            className={styles.inputfield}
                            name="ppc_date"
                            htmlType="date"
                            type="floating"
                            label="PPC Date"
                            labelClass="inputlabel"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row mt-4">
                      <div className="col-12">
                        <Input
                          name="ppc_description"
                          defaultValue={ppc?.data?.ppc_description}
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

export default PPCCreate;
