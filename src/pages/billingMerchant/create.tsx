import React, { useRef, useCallback, useState, useMemo } from "react";
import {
  Icon,
  Input,
  Uploader,
  Spinner,
  Avatar,
  IDropdownItem,
  Dropdown,
} from "elements";
import styles from "../../styles/merchant/Brand.module.css";
import { useDispatch } from "react-redux";
import { AppThunkDispatch } from "../../redux/types";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { IMerchant } from "../../model/merchant";
import { useQuery } from "react-query";
import { IApiParam } from "../../helper/api";
import Loader from "../../components/shared/Loader";
import {
  createNewMerchant,
  getMerhantDetail,
  updatemerchantDetail,
} from "../../api/merhchant";
import { getUserBrandList } from "../../api/user";

const MerchantCreate: NextPage = () => {
  const dispatch = useDispatch<AppThunkDispatch>();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const { id } = router.query;
  const [brandLogoImage, setBrandLogoImage] = useState<File>();

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

  const onSubmit: React.FormEventHandler = useCallback(
    async (e) => {
      e.preventDefault();

      const updateMerchant = async () => {
        if (formRef.current) {
          const params = {
            data: new FormData(formRef.current),
          };
          await dispatch(updatemerchantDetail(params));
        }
      };

      const createMerchant = async () => {
        if (formRef.current) {
          const params = {
            data: new FormData(formRef.current),
          };
          params.data.delete("billingmerchant_id");
          await dispatch(createNewMerchant(params));
        }
        router.push(`/billingMerchant/`);
      };

      if (formRef.current) {
        try {
          if (id) {
            updateMerchant();
          } else {
            createMerchant();
          }
        } catch (e) {
          console.error(e);
        }
      }
    },
    [dispatch, id, router]
  );

  // if (id && isLoading) return <Spinner loader={true} />;

  const fileChangedHandler = (files: File[]) => {
    setBrandLogoImage(files[0]);
  };

  // if (isLoading) {
  //   return (
  //     <div
  //       className="d-flex justify-cntent-center align-items-center"
  //       style={{ height: "100vh" }}
  //     >
  //       <Loader fullPage />
  //     </div>
  //   );
  // }
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
                      Add Merchant
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
                      // value={merchant?.billingmerchant_id}
                      name="billingmerchant_id"
                    />
                    <div className="row">
                      <div className="col-lg-6 d-flex">
                        <div>
                          <Avatar
                            iconName="person"
                            src={
                              brandLogoImage
                                ? URL.createObjectURL(brandLogoImage)
                                : ""
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
                        <Input
                          className={styles.inputfield}
                          name="billingmerchant_title"
                          type="floating"
                          label="Title"
                          labelClass="inputlabel"
                          required
                        />
                      </div>
                      <div className="col-4">
                        <Input
                          className={styles.inputfield}
                          name="billingmerchant_email"
                          htmlType="Email"
                          type="floating"
                          label="Email"
                          labelClass="inputlabel"
                          required
                        />
                      </div>

                      <div className="col-4">
                        <Input
                          className={styles.inputfield}
                          name="billingmerchant_website"
                          htmlType="Website"
                          type="floating"
                          label="Website"
                          labelClass="inputlabel"
                          required
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-4">
                        <Input
                          className={styles.inputfield}
                          name="billingmerchant_openingbalance"
                          htmlType="number"
                          type="floating"
                          label="Opening Balance"
                          labelClass="inputlabel"
                          required
                        />
                      </div>
                      <div className="col-lg-4">
                        <Input
                          className={styles.inputfield}
                          name="billingmerchant_fee"
                          htmlType="number"
                          type="floating"
                          label="Fee"
                          labelClass="inputlabel"
                          required
                        />
                      </div>
                      <div className="col-lg-4">
                        {brandOptions ? (
                          <div
                            style={{
                              borderBottom: "1px solid #cbc8d0",
                              marginTop: "1rem",
                            }}
                          >
                            <Dropdown
                              style={{ width: "20rem" }}
                              className={styles.leadbranddropdown}
                              placeholder="Select Brand"
                              // value={`${lead?.brand_id}`}
                              options={brandOptions}
                              name="brand_id"
                              type="light"
                            />
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="row mt-4">
                      <div className="col-12">
                        {/* <label className={styles.inputlabel}>Description</label> */}
                        <Input
                          name="billingmerchant_otherinfo"
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
};

export default MerchantCreate;
function useObjectURL(file: any): { objectURL: any } {
  throw new Error("Function not implemented.");
}
