//@ts-nocheck
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Avatar,
  Button,
  Dropdown,
  Input,
  Spinner,
  IButtonRef,
  IDropdownItem,
  Uploader,
  AutoComplete,
} from "elements";
import styles from "./createuser.module.css";
import { useDispatch, useSelector } from "react-redux";
import { IUser } from "../../../model/user";
import { AppThunkDispatch, RootState } from "../../../redux/types";

import {
  createNewUser,
  getUserBrandList,
  getUserDetail,
} from "../../../api/user";
import { useQuery } from "react-query";
import { IApiParam } from "../../../helper/api";
import { IBrandListItem } from "../../../model/brand";
import router from "next/router";
import Loader from "../../shared/Loader";

type propTypes = {
  style?: React.CSSProperties;
  className?: string;
  onSuccess?: () => void;
  userId?: string;
};

const CreateUser = React.memo((props: React.PropsWithChildren<propTypes>) => {
  const formRef = useRef<HTMLFormElement>(null);
  const btnRef = useRef<HTMLButtonElement & IButtonRef>(null);
  const dispatch = useDispatch<AppThunkDispatch>();
  const roles = useSelector((store: RootState) => store.app.roles);
  const [brandLogoImage, setBrandLogoImage] = useState<File>();
  const [brandCoverImage, setbrandCoverImage] = useState<File>();

  const { data: user, isLoading } = useQuery<IUser>(
    `User_${props.userId}`,
    async () => {
      const params: IApiParam = {
        params: {
          edituser_id: props.userId,
        },
      };
      const response = await dispatch(getUserDetail(params));
      return response.data;
    },
    {
      enabled: !!props.userId,
    }
  );

  const { data: brands } = useQuery<Array<IBrandListItem>>(
    `BrandList`,
    async () => {
      const response = await dispatch(getUserBrandList());
      return response.data;
    },
    {
      enabled: !!user?.user_id,
    }
  );

  const onSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      e.preventDefault();

      const CreateUser = async () => {
        if (formRef.current) {
          const editId = {
            edituser_id: props.userId,
          };
          const params = {
            data: new FormData(formRef.current),
          };
          params.data.delete("user_id");
          await dispatch(createNewUser(params));
          if (props?.onSuccess) props?.onSuccess();
        }
        router.push(`/user/`);
      };

      if (formRef.current) {
        btnRef.current?.setLoader(true);
        try {
          if (props.userId) {
          } else {
            CreateUser();
          }
        } catch (e) {
          console.error(e);
        }
        btnRef.current?.setLoader(false);
      }
    },
    [dispatch, props]
  );

  const roleOptions = useMemo(() => {
    return roles.reduce((result, role) => {
      result[role.role_id] = {
        label: role.role_name,
      };
      return result;
    }, {} as { [key in string]: IDropdownItem });
  }, [roles]);

  const brandOptions = useMemo(() => {
    return brands?.reduce((result, brand) => {
      result[`${brand.brand_id}`] = { label: brand.brand_name };
      return result;
    }, {} as { [key in string]: IDropdownItem });
  }, [brands]);

  if (props.userId && isLoading) {
    return <Spinner loader={true} />;
  }

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
        style={{ height: "100vh" }}
      >
        <Loader fullPage />
      </div>
    );
  }

  return (
    <div style={{ overflow: "hidden" }}>
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
                <h4 className={styles.createuserformheading}>
                  {user?.user_id ? "Update User" : "Create User"}
                </h4>
              </div>
              <div style={{ margin: "20px" }}>
                <div className="card-body">
                  <form
                    ref={formRef}
                    onSubmit={onSubmit}
                    className={`${styles.createUser__container} ${
                      props.className || ""
                    }`.trim()}
                  >
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
                          <legend className={styles.inputlabeluploader}>
                            User Logo
                          </legend>
                          <Uploader
                            name="user_picture"
                            multiple={false}
                            type="info"
                            className={styles.uploadbtnn}
                            showList={false}
                            accept={[".png"]}
                            onChange={fileChangedHandler}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 d-flex">
                        <div>
                          <Avatar
                            src={
                              brandCoverImage
                                ? URL.createObjectURL(brandCoverImage)
                                : ""
                            }
                            iconName="person"
                            style={{
                              fontSize: "2rem",
                              height: "5rem",
                              width: "5rem",
                            }}
                          />
                        </div>
                        <div style={{ marginLeft: "25px" }}>
                          <legend className={styles.inputlabeluploader}>
                            User Cover
                          </legend>
                          <Uploader
                            name="user_coverpicture"
                            multiple={false}
                            type="info"
                            className={styles.uploadbtnn}
                            showList={false}
                            accept={[".png"]}
                            onChange={fileCoverChangedHandler}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-lg-6">
                        <Input
                          className={styles.inputfield}
                          type="floating"
                          label="Name"
                          name="user_name"
                          defaultValue={user?.user_name}
                          required
                        />
                      </div>
                      <div className="col-lg-6">
                        <Input
                          className={styles.inputfield}
                          type="floating"
                          label="User Name"
                          name="user_username"
                          defaultValue={user?.user_username}
                          required
                        />
                      </div>
                    </div>

                    <div className="row mt-3">
                      <div className={`col-lg-6 ${styles.selectrolediva}`}>
                        <Input
                          className={styles.inputfield}
                          type="floating"
                          label="Target"
                          name="user_target"
                          defaultValue={user?.user_target}
                          htmlType="Number"
                          required
                        />
                      </div>
                      <div
                        className="col-lg-6 mt-3"
                        style={{ borderBottom: "1px solid #cbc8d0" }}
                      >
                        <Dropdown
                          options={roleOptions}
                          defaultKey={JSON.stringify(user?.role_id)}
                          name="role_id"
                          type="light"
                          className={styles.userlistdropdown}
                          placeholder="Select Role"
                        />
                      </div>
                    </div>

                    <div className="row mt-3">
                      <div className="col-lg-6">
                        <Input
                          className={styles.inputfield}
                          type="floating"
                          label="Email"
                          name="user_email"
                          htmlType="Email"
                          defaultValue={user?.user_email}
                          required
                        />
                      </div>
                      {!user?.user_id ? (
                        <div className="col-lg-6">
                          <Input
                            className={styles.inputfield}
                            htmlType="Password"
                            label="Password"
                            type="floating"
                            name="user_password"
                            defaultValue={user?.user_password}
                            required
                          />
                        </div>
                      ) : null}
                    </div>
                    <div className="row mt-3">
                      <div className="col-lg-6">
                        <AutoComplete
                          multiple
                          options={brandOptions}
                          style={{
                            borderBottom: "1px solid #cbc8d0",
                            width: "100%",
                          }}
                          name={"brand"}
                          label="Select Brand"
                          type="secondary"
                          className={styles.brandautocomplete}
                        />
                      </div>
                    </div>
                    <div className="row mt-5">
                      <div className="col-lg-12">
                        <Button
                          className="mt-3"
                          style={{ background: "var(--bs-primary)" }}
                          ref={btnRef}
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

export default CreateUser;
