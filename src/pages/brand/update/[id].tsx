import React, { useRef, useCallback, useState, useMemo } from 'react';
import {
  Icon,
  Input,
  Uploader,
  Dropdown,
  IDropdownItem,
  Spinner,
  unmarshalFormData,
  Avatar,
} from 'elements';
import styles from '../../../styles/brand/Brand.module.css';
import Card from '../../../components/shared/Card';
import {
  createBrandDetail,
  getBrandDetail,
  getBrandType,
  updateBrandDetail,
} from '../../../api/brand';
import { useDispatch } from 'react-redux';
import { AppThunkDispatch } from '../../../redux/types';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { IBrand } from '../../../model/brand';
import { useQuery } from 'react-query';
import { IApiParam } from '../../../helper/api';
import { text } from 'stream/consumers';
import Loader from '../../../components/shared/Loader';

const orderTypeOptions: { [key in string]: IDropdownItem } = {
  logo: {
    label: 'Logo',
  },
  web: {
    label: 'Website',
  },
};

const BrandUpdate: NextPage = () => {
  const dispatch = useDispatch<AppThunkDispatch>();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const { id } = router.query;
  const [movieData, setMovieData] = useState([]);
  const [brandLogoImage, setBrandLogoImage] = useState<File>();
  const [brandCoverImage, setbrandCoverImage] = useState<File>();

  const { data: brands } = useQuery(
    `BrandList`,
    async () => {
      const response = await dispatch(getBrandType());
      return response.data;
    },
    {
      // enabled: !!user?.user_id
    }
  );

  // const [movieData, setMovieData] = useState([]);

  const brandOptions = useMemo(() => {
    return brands?.reduce(
      (
        result: { [x: string]: { label: any } },
        brands: { brandtype_id: string | number; brandtype_name: any }
      ) => {
        result[(brands.brandtype_name, brands.brandtype_id)] = {
          label: brands.brandtype_name,
        };
        return result;
      },
      {} as { [key in string]: IDropdownItem }
    );
  }, [brands]);

  const { data: brand, isLoading } = useQuery<IBrand>(
    `Brand_${id}`,
    async () => {
      const params: IApiParam = {
        params: {
          brand_id: id,
        },
      };
      const response = await dispatch(getBrandDetail(params));
      return response;
    },
    {
      enabled: !!id,
    }
  );

  const onSubmit: React.FormEventHandler = useCallback(
    async (e) => {
      e.preventDefault();

      const updateBrand = async () => {
        if (formRef.current) {
          const params = {
            data: new FormData(formRef.current),
          };
          await dispatch(updateBrandDetail(params));
        }
        router.push(`/brand/${id}`);
      };

      const createBrand = async () => {
        if (formRef.current) {
          const params = {
            data: new FormData(formRef.current),
          };
          params.data.delete('brand_id');
          await dispatch(createBrandDetail(params));
        }
        router.push(`/brand/`);
      };

      if (formRef.current) {
        try {
          if (id) {
            updateBrand();
          } else {
            createBrand();
          }
        } catch (e) {
          console.error(e);
        }
      }
    },
    [dispatch, id, router]
  );

  if (id && isLoading) return <Spinner loader={true} />;

  const fileChangedHandler = (files: File[]) => {
    setBrandLogoImage(files[0]);
  };

  const fileCoverChangedHandler = (files: File[]) => {
    setbrandCoverImage(files[0]);
  };

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
                      Update Brand
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
                      value={brand?.data?.brand_id}
                      name="brand_id"
                    />
                    <div className="row">
                      <div className="col-lg-6 d-flex">
                        <div>
                          <Avatar
                            iconName="person"
                            src={
                              brandLogoImage
                                ? URL.createObjectURL(brandLogoImage)
                                : `${brand?.logopath}${brand?.data?.brand_logo}`
                            }
                            style={{
                              fontSize: '2rem',
                              height: '5rem',
                              width: '5rem',
                            }}
                          />
                        </div>
                        <div style={{ marginLeft: '25px' }}>
                          <legend
                            style={{
                              color: 'var( --bs-body-color)',
                              fontSize: '16px',
                              fontWeight: '400',
                              fontFamily: 'inherit',
                            }}
                          >
                            Brand Logo
                          </legend>
                          <Uploader
                            name="brand_logo"
                            multiple={false}
                            type="info"
                            showList={false}
                            accept={['.png']}
                            onChange={fileChangedHandler}
                            className={styles.coverbutton}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 d-flex">
                        <div>
                          <Avatar
                            src={
                              brandCoverImage
                                ? URL.createObjectURL(brandCoverImage)
                                : `${brand?.coverpath}${brand?.data?.brand_cover}`
                            }
                            iconName="person"
                            style={{
                              fontSize: '2rem',
                              height: '5rem',
                              width: '5rem',
                            }}
                          />
                        </div>
                        <div style={{ marginLeft: '25px' }}>
                          <legend
                            style={{
                              color: 'var( --bs-body-color)',
                              fontSize: '16px',
                              fontWeight: '400',
                              fontFamily: 'inherit',
                            }}
                          >
                            Brand Cover
                          </legend>
                          <Uploader
                            name="brand_cover"
                            multiple={false}
                            type="info"
                            showList={false}
                            onChange={fileCoverChangedHandler}
                            accept={['.png']}
                            className={styles.coverbutton}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row mt-4">
                      <div className="col-6">
                        {/* <label className={styles.inputlabel}>Brand Name</label> */}
                        <Input
                          defaultValue={brand?.data?.brand_name}
                          className={styles.inputfield}
                          name="brand_name"
                          type="floating"
                          label="Brand Name"
                          labelClass="inputlabel"
                          required
                        />
                      </div>
                      <div className="col-6">
                        {/* <label className={styles.inputlabel}>Brand Email</label> */}
                        <Input
                          defaultValue={brand?.data?.brand_email}
                          className={styles.inputfield}
                          name="brand_email"
                          htmlType="Email"
                          type="floating"
                          label="Brand Email"
                          labelClass="inputlabel"
                          required
                        />
                      </div>
                    </div>
                    <div className="row mt-4">
                      {brandOptions ? (
                        <div
                          className={`col-lg-6 mt-2 ${styles.selectbrandoptiondiv}`}
                        >
                          {/* <label style={{color: 'var( --bs-body-color)',fontSize: '16px',fontWeight: '700',}}>Select Brand</label> */}
                          <Dropdown
                            defaultKey={JSON.stringify(
                              brand?.data?.brandtype_id
                            )}
                            placeholder="Select Brand Type"
                            options={brandOptions}
                            name="brandtype_id"
                            type="light"
                            className={styles.brandtypedropdown}
                          />
                        </div>
                      ) : null}
                      <div className="col-6 mt-2">
                        {/* <label className={styles.inputlabel}>Brand Website</label> */}
                        <Input
                          defaultValue={brand?.data?.brand_website}
                          className={styles.inputfield}
                          name="brand_website"
                          htmlType="Website"
                          type="floating"
                          label="Brand Website"
                          labelClass="inputlabel"
                          required
                        />
                      </div>
                    </div>
                    <div className="row mt-4">
                      <div className="col-12">
                        {/* <label className={styles.inputlabel}>Description</label> */}
                        <Input
                          name="brand_description"
                          defaultValue={brand?.data?.brand_description}
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

export default BrandUpdate;
