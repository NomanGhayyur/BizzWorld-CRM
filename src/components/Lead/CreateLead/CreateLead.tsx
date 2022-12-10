import React, {
  useRef,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react';
import {
  Icon,
  Input,
  Uploader,
  Dropdown,
  IDropdownItem,
  IButtonRef,
  Button,
  Spinner,
} from 'elements';
import styles from '../../../styles/lead.module.css';
import Card from '../../../components/shared/Card';
import {
  createNewLead,
  getLeadDetail,
  updateLeadDetail,
} from '../../../api/lead';
import { getBrandDetail } from '../../../api/brand';
import { useDispatch } from 'react-redux';
import { AppThunkDispatch, RootState } from '../../../redux/types';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { ILead } from '../../../model/lead';
import { useQuery } from 'react-query';
import { IApiParam } from '../../../helper/api';
import { getCountryList } from '../../../api/country';
import { getStateList } from '../../../api/state';
import { getCityList } from '../../../api/city';
import { getUserBrandList } from '../../../api/user';
import Loader from '../../shared/Loader';

type propTypes = {
  style?: React.CSSProperties;
  className?: string;
  onSuccess?: (leadData: ILead) => void;
  leadId?: string;
};

const CreateLead = React.memo((props: React.PropsWithChildren<propTypes>) => {
  const router = useRouter();
  const { id, brand_id } = router.query;
  const formRef = useRef<HTMLFormElement>(null);
  const btnRef = useRef<HTMLButtonElement & IButtonRef>(null);
  const dispatch = useDispatch<AppThunkDispatch>();
  const orderTypeOptions: { [key in string]: IDropdownItem } = {};
  const [allStates, setStatesResponse] = useState([]);
  const [allCities, setCitiesResponse] = useState([]);
  const [isLoading, setLoading] = useState<Boolean>(false);
  const { data: lead } = useQuery<ILead>(
    // `Lead_${props.leadId}`,
    `Lead_${id}`,
    async () => {
      const params: IApiParam = {
        params: {
          lead_id: id,
        },
      };
      const response = await dispatch(getLeadDetail(params));
      return response.data;
    },
    {
      enabled: !!id,
    }
  );

  const { data: countries } = useQuery(
    `List`,
    async () => {
      const response = await dispatch(getCountryList());
      return response.data;
    },
    {
      // enabled: !!user?.user_id
    }
  );

  const countryOptions = useMemo(() => {
    return countries?.reduce(
      (
        result: { [x: string]: { label: any } },
        countries: { country_id: string | number; country_name: any }
      ) => {
        result[countries.country_id] = {
          label: countries.country_name,
        };
        return result;
      },
      {} as { [key in string]: IDropdownItem }
    );
  }, [countries]);

  const handlecountry = useCallback(
    async (countryID: number | undefined) => {
      const response = await dispatch(
        getStateList({ params: { country_id: countryID } })
      );
      setStatesResponse(response.data);
    },
    [dispatch]
  );
  const handlestate = useCallback(
    async (stateID: number | undefined) => {
      const response = await dispatch(
        getCityList({ params: { state_id: stateID } })
      );
      setCitiesResponse(response.data);
    },
    [dispatch]
  );

  useEffect(() => {
    handlecountry(lead?.country_id);
    handlestate(lead?.state_id);
  }, [handlecountry, handlestate, lead]);

  const stateOptions = useMemo(() => {
    return allStates?.reduce(
      (
        result: { [x: string]: { label: any } },
        states: { state_id: string | number; state_name: any }
      ) => {
        result[states.state_id] = {
          label: states.state_name,
        };
        return result;
      },
      {} as { [key in string]: IDropdownItem }
    );
  }, [allStates]);

  const cityOptions = useMemo(() => {
    return allCities?.reduce(
      (
        result: { [x: string]: { label: any } },
        cities: { city_id: string | number; city_name: any }
      ) => {
        result[cities.city_id] = {
          label: cities.city_name,
        };
        return result;
      },
      {} as { [key in string]: IDropdownItem }
    );
  }, [allCities]);

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
  const brandOptions = useMemo(() => {
    return brands?.reduce(
      (
        result: { [x: string]: { label: any } },
        brands: { brand_id: string | number; brand_name: any }
      ) => {
        result[brands.brand_id] = {
          label: brands.brand_name,
        };
        return result;
      },
      {} as { [key in string]: IDropdownItem }
    );
  }, [brands]);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      e.preventDefault();

      const updateLead = async () => {
        if (formRef.current) {
          const params = {
            data: new FormData(formRef.current),
          };
          params.data.append('lead_id', `${id}`);
          // params.data.append('brand_id', `${brand_id}`);
          await dispatch(updateLeadDetail(params));
        }
        router.push(`/lead/${id}`);
      };
      const CreateLead = async () => {
        if (formRef.current) {
          // const editId ={
          //     lead_id: id
          // }
          const params = {
            data: new FormData(formRef.current),
          };
          // params.data.append('brand_id', `${brand_id}`);
          params.data.delete('lead_id');
          await dispatch(createNewLead(params));
        }
        router.back();
      };

      if (formRef.current) {
        // btnRef.current?.setLoader(true);
        try {
          if (id) {
            updateLead();
          } else {
            CreateLead();
          }
        } catch (e) {
          console.error(e);
          setLoading(false);
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
                    {' '}
                    <h4
                      className={styles.createleadformheading}
                      style={{ paddingLeft: '20px' }}
                    >
                      {lead?.lead_id ? 'Update Lead' : 'Create Lead'}
                    </h4>
                  </div>
                  <div className="col-lg-1">
                    {' '}
                    <Icon
                      name={'arrow-left'}
                      onClick={() => router.back()}
                      style={{ marginTop: '13px' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ margin: '20px' }}>
                <div className="card-body">
                  <form onSubmit={onSubmit} ref={formRef}>
                    <div className="row mt-3">
                      <div className="col-lg-4">
                        {/* <label className={styles.inputlabel}>Name</label> */}
                        <Input
                          className={styles.inputfield}
                          name="lead_name"
                          type="floating"
                          label="Name"
                          labelClass={styles.inputlabel}
                          required
                          defaultValue={lead?.lead_name}
                        />
                      </div>
                      <div className="col-lg-4">
                        {/* <label className={styles.inputlabel}>Email</label> */}
                        <Input
                          className={styles.inputfield}
                          name="lead_email"
                          htmlType="Email"
                          type="floating"
                          label="Email"
                          labelClass={styles.inputlabel}
                          required
                          defaultValue={lead?.lead_email}
                        />
                      </div>
                      <div className="col-lg-4">
                        {/* <label className={styles.inputlabel}>Alt Email</label> */}
                        <Input
                          className={styles.inputfield}
                          name="lead_altemail"
                          htmlType="Email"
                          type="floating"
                          label="Alt Email"
                          labelClass={styles.inputlabel}
                          defaultValue={lead?.lead_altemail}
                        />
                      </div>
                    </div>

                    <div className="row" style={{ marginTop: '43px' }}>
                      {/* {countryOptions ? ( */}
                      <div className="col-lg-4">
                        <div style={{ borderBottom: '1px solid #cbc8d0' }}>
                          <Dropdown
                            className={styles.countrydropdown}
                            label="Select Country"
                            value={`${lead?.country_id}`}
                            // defaultKey="country_name"
                            options={
                              countryOptions !== undefined
                                ? countryOptions
                                : { 0: { label: '' } }
                            }
                            // options={countryOptions}
                            name="country_id"
                            disabled={countryOptions === undefined}
                            type="light"
                            // key={index}
                            onItemClick={(countryID) =>
                              handlecountry(parseInt(countryID))
                            }
                          />
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div style={{ borderBottom: '1px solid #cbc8d0' }}>
                          <Dropdown
                            className={styles.countrydropdown}
                            label="Select State"
                            // defaultKey="state_id"
                            value={`${lead?.state_id}`}
                            options={
                              Object.keys(stateOptions).length > 0
                                ? stateOptions
                                : { 0: { label: '' } }
                            }
                            name="state_id"
                            type="light"
                            onItemClick={(stateID) =>
                              handlestate(parseInt(stateID))
                            }
                            disabled={!(Object.keys(stateOptions).length > 0)}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div style={{ borderBottom: '1px solid #cbc8d0' }}>
                          <Dropdown
                            className={styles.countrydropdown}
                            label="Select City"
                            value={`${lead?.city_id}`}
                            options={
                              Object.keys(cityOptions).length > 0
                                ? cityOptions
                                : { 0: { label: '' } }
                            }
                            name="city_id"
                            type="light"
                            disabled={!(Object.keys(cityOptions).length > 0)}
                          />
                        </div>
                      </div>
                      {/* ) : null} */}
                    </div>
                    <div className="row mt-3">
                      <div className="col-lg-4">
                        <Input
                          className={styles.inputfield}
                          name="lead_phone"
                          type="floating"
                          label="Phone"
                          labelClass={styles.inputlabel}
                          htmlType="Number"
                          defaultValue={lead?.lead_phone}
                        />
                      </div>
                      <div className="col-lg-4">
                        <Input
                          className={styles.inputfield}
                          name="lead_zip"
                          type="floating"
                          label="Zip Code"
                          labelClass={styles.inputlabel}
                          htmlType="Number"
                          defaultValue={lead?.lead_zip}
                        />
                      </div>
                      <div className="col-lg-4">
                        <Input
                          className={styles.inputfield}
                          name="lead_address"
                          type="floating"
                          label="Address"
                          labelClass={styles.inputlabel}
                          defaultValue={lead?.lead_address}
                        />
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-lg-4">
                        <Input
                          className={styles.inputfield}
                          labelClass={styles.inputlabel}
                          name="lead_bussinessname"
                          type="floating"
                          label="Bussiness Name"
                          defaultValue={lead?.lead_bussinessname}
                        />
                      </div>
                      <div className="col-lg-4">
                        <Input
                          className={styles.inputfield}
                          name="lead_bussinessemail"
                          type="floating"
                          label="Bussiness Email"
                          labelClass={styles.inputlabel}
                          htmlType="Email"
                          defaultValue={lead?.lead_bussinessemail}
                        />
                      </div>
                      <div className="col-lg-4">
                        {/* <label className={styles.inputlabel}>Bussiness Website</label> */}
                        <Input
                          className={styles.inputfield}
                          name="lead_bussinesswebsite"
                          type="floating"
                          label="Bussiness Website"
                          labelClass={styles.inputlabel}
                          htmlType="Website"
                          defaultValue={lead?.lead_bussinesswebsite}
                        />
                      </div>
                    </div>
                    <div
                      className="row mt-3"
                      style={{ alignItems: 'self-end' }}
                    >
                      <div className="col-lg-4">
                        <Input
                          className={styles.inputfield}
                          labelClass={styles.inputlabel}
                          name="lead_bussinessphone"
                          label="Bussiness Phone"
                          type="floating"
                          defaultValue={lead?.lead_bussinessphone}
                        />
                      </div>
                      {brandOptions ? (
                        <div className="col-lg-4">
                          <div style={{ borderBottom: '1px solid #cbc8d0' }}>
                            <Dropdown
                              className={styles.leadbranddropdown}
                              placeholder="Select Brand"
                              value={`${lead?.brand_id}`}
                              options={brandOptions}
                              name="brand_id"
                              type="light"
                            />
                          </div>
                        </div>
                      ) : null}
                    </div>
                    <div className="row mt-4">
                      <div className="col-12">
                        <Input
                          defaultValue={lead?.lead_otherdetails}
                          name="lead_otherdetails"
                          className={`${styles.ordersinputfield}`}
                          type="floating-textarea"
                          label="Description"
                          labelClass={styles.inputlabel}
                          style={{
                            width: '100%',
                            border: '1px solid #cbc8d0',
                            height: '150px',
                          }}
                        />
                      </div>
                    </div>
                    <div className="row mt-3 mb-3">
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
});

export default CreateLead;
