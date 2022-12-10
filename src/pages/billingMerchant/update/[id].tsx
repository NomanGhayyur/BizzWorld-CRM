import React, { useRef, useCallback, useState, useMemo } from "react";
import {
  Icon,
  Input,
  Uploader,
  Dropdown,
  IDropdownItem,
  Spinner,
  unmarshalFormData,
  Avatar,
} from "elements";
import styles from "../../../styles/brand/Brand.module.css";
import Card from "../../../components/shared/Card";
import {
  createBrandDetail,
  getBrandDetail,
  getBrandType,
  updateBrandDetail,
} from "../../../api/brand";
import { useDispatch } from "react-redux";
import { AppThunkDispatch } from "../../../redux/types";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { IMerchant } from "../../../model/merchant";
import { useQuery } from "react-query";
import { IApiParam } from "../../../helper/api";
import { text } from "stream/consumers";
import Loader from "../../../components/shared/Loader";
import { getMerhantDetail, updatemerchantDetail } from "../../../api/merhchant";

type propTypes = {
  style?: React.CSSProperties;
  className?: string;
  onSuccess?: () => void;
  merchantID?: string;
};

const MerchantUpdate = React.memo(
  (props: React.PropsWithChildren<propTypes>) => {
    const dispatch = useDispatch<AppThunkDispatch>();
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();
    const { id } = router.query;
    const [merchantLogoImage, setBrandLogoImage] = useState<File>();

    const { data: merchant, isLoading } = useQuery<IMerchant>(
      `Merchant_${id}`,
      async () => {
        const params: IApiParam = {
          params: {
            billingmerchant_id: id,
          },
        };
        const response = await dispatch(getMerhantDetail(params));
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
            params.data.append("billingmerchant_id", `${id}`);
            await dispatch(updatemerchantDetail(params));
          }
          router.push(`/billingMerchant/`);
        };

        if (formRef.current) {
          try {
            if (id) {
              updateBrand();
            } else {
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

    if (isLoading) {
      return (
        <div
          className="d-flex justify-cntent-center align-items-center"
          style={{ height: "100vh" }}
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
                  style={{ background: "rgba(0,0,0,.03)" }}
                >
                  <div className="row">
                    <div className="col-lg-2">
                      <h4
                        className={styles.createbrandheading}
                        style={{ paddingLeft: "30px" }}
                      >
                        Update Merchant
                      </h4>
                    </div>
                    <div className="col-lg-6">
                      <Icon
                        name={"arrow-left"}
                        onClick={() => router.back()}
                        style={{ marginTop: "13px" }}
                      />
                    </div>
                    <div className="col-lg-4"></div>
                  </div>
                </div>

                <div style={{ margin: "20px" }}>
                  <div className="card-body">
                    <form onSubmit={onSubmit} ref={formRef}>
                      <input
                        type="hidden"
                        value={merchant?.data?.billingmerchant_id}
                        name="brand_id"
                      />
                      <div className="row">
                        <div className="col-lg-6 d-flex">
                          <div>
                            <Avatar
                              iconName="person"
                              src={
                                merchantLogoImage
                                  ? URL.createObjectURL(merchantLogoImage)
                                  : `${merchant?.logopath}`
                              }
                              style={{
                                fontSize: "2rem",
                                height: "5rem",
                                width: "5rem",
                              }}
                            />
                          </div>
                          <div style={{ marginLeft: "25px" }}>
                            <legend
                              style={{
                                color: "var( --bs-body-color)",
                                fontSize: "16px",
                                fontWeight: "400",
                                fontFamily: "inherit",
                              }}
                            >
                              Merchant Logo
                            </legend>
                            <Uploader
                              name="billingmerchant_logo"
                              multiple={false}
                              type="info"
                              showList={false}
                              accept={[".png"]}
                              onChange={fileChangedHandler}
                              className={styles.coverbutton}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row mt-4">
                        <div className="col-4">
                          {/* <label className={styles.inputlabel}>Brand Name</label> */}
                          <Input
                            defaultValue={merchant?.data?.billingmerchant_title}
                            className={styles.inputfield}
                            name="billingmerchant_title"
                            type="floating"
                            label="Merchant Title"
                            labelClass="inputlabel"
                            required
                          />
                        </div>
                        <div className="col-4">
                          {/* <label className={styles.inputlabel}>Brand Email</label> */}
                          <Input
                            defaultValue={merchant?.data?.billingmerchant_email}
                            className={styles.inputfield}
                            name="billingmerchant_email"
                            htmlType="Email"
                            type="floating"
                            label="Merchant Email"
                            labelClass="inputlabel"
                            required
                          />
                        </div>

                        <div className="col-4">
                          {/* <label className={styles.inputlabel}>Brand Website</label> */}
                          <Input
                            defaultValue={
                              merchant?.data?.billingmerchant_website
                            }
                            className={styles.inputfield}
                            name="billingmerchant_website"
                            htmlType="Website"
                            type="floating"
                            label="Merchant Website"
                            labelClass="inputlabel"
                            required
                          />
                        </div>
                      </div>
                      <div className="row mt-4">
                        <div className="col-lg-6">
                          <Input
                            defaultValue={
                              merchant?.data?.billingmerchant_openingbalance
                            }
                            className={styles.inputfield}
                            name="billingmerchant_openingbalance"
                            htmlType="number"
                            type="floating"
                            label="Opening Balance"
                            labelClass="inputlabel"
                            required
                          />
                        </div>
                        <div className="col-lg-6">
                          <Input
                            defaultValue={merchant?.data?.billingmerchant_fee}
                            className={styles.inputfield}
                            name="billingmerchant_fee"
                            htmlType="number"
                            type="floating"
                            label="Fee"
                            labelClass="inputlabel"
                            required
                          />
                        </div>
                      </div>
                      <div className="row mt-4">
                        <div className="col-12">
                          {/* <label className={styles.inputlabel}>Description</label> */}
                          <Input
                            name="billingmerchant_otherinfo"
                            defaultValue={
                              merchant?.data?.billingmerchant_otherinfo
                            }
                            style={{
                              height: "150px",
                              border: " 1px solid #cbc8d0",
                            }}
                            type="floating-textarea"
                            label="Other Info"
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
  }
);

export default MerchantUpdate;
