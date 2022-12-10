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
  Icon,
  IModalRef,
  Modal,
} from "elements";
import styles from "./updateuser.module.css";
import { useDispatch, useSelector } from "react-redux";
import { IUser } from "../../../model/user";
import { AppThunkDispatch, RootState } from "../../../redux/types";

import {
  deleteUserFromBrand,
  getRemainingBrandList,
  getUserDetail,
  updateUserDetail,
} from "../../../api/user";
import { useQuery } from "react-query";
import { IApiParam } from "../../../helper/api";
import { IBrand, IBrandListItem } from "../../../model/brand";
import router from "next/router";
import Loader from "../../../components/shared/Loader";

type propTypes = {
  style?: React.CSSProperties;
  className?: string;
  onSuccess?: () => void;
  userId?: string;
};

const UpdateUser = React.memo((props: React.PropsWithChildren<propTypes>) => {
  const [userProfile, setUserProfile] = useState<File>();
  const [coverImage, setUserCover] = useState<File>();
  const formRef = useRef<HTMLFormElement>(null);
  const btnRef = useRef<HTMLButtonElement & IButtonRef>(null);
  const dispatch = useDispatch<AppThunkDispatch>();
  const roles = useSelector((store: RootState) => store.app.roles);
  const { id } = router?.query;
  const [brandLogoImage, setBrandLogoImage] = useState<File | undefined>();
  const [brandCoverImage, setbrandCoverImage] = useState<File>();
  const [brandsId, setbrandsId] = useState<Array<number | string>>([]);
  const [active, setActive] = useState<Array<number | string> | null>(null);
  const modalRef = useRef<IModalRef>(null);
  const [confirmation, setConfirmation] = useState(false);
  const [brand_id, setbrandId] = useState<number | string | undefined>();
  const [brandList, setBrandList] = useState({});

  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery<IUser>(
    `User_${router?.query?.id}`,
    async () => {
      const params: IApiParam = {
        params: {
          edituser_id: router?.query?.id,
        },
      };
      let response = await dispatch(getUserDetail(params));
      response = {
        ...response.data,
        brands: response.brands,
        profilepath: response.profilepath,
        coverpath: response.coverpath,
      };
      return response;
    },
    {
      enabled: !!router?.query?.id,
    }
  );

  // const { data: brands } = useQuery<Array<IBrandListItem>>(
  //   `BrandList`,
  //   async () => {
  //     const params: IApiParam = {
  //       params: {
  //         edituser_id: id,
  //       },
  //     };

  //     const response = await dispatch(getRemainingBrandList(params));
  //     return response.data;
  //   },
  //   {
  //     // enabled: !!user?.user_id
  //   }
  // );
  const { data: brands } = useQuery<Array<IBrandListItem>>(
    `BrandList`,
    async () => {
      const params: IApiParam = {
        params: {
          edituser_id: router?.query?.id,
        },
        // refetch();
      };
      const response = await dispatch(getRemainingBrandList(params));
      return response.data;
    },
    {
      // enabled: !!user?.user_id
    }
  );

  const handleConfirmationState = useCallback(
    (state: boolean, brand_id: number | string) => {
      // if (router.asPath.split('#')[1]) {
      //   router.replace({ pathname: router.pathname, query: router.query });
      // }
      if (state) {
        setbrandId(brand_id);
      }
      setConfirmation(state);
    },
    []
  );
  const onCheck = useCallback(
    async (
      brandId: IBrand["brand_id"] | undefined,
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      e.preventDefault();
      try {
        const params = {
          data: {
            edituser_id: router?.query?.id,
            brand_id: brandId || "",
          },
        };
        await dispatch(deleteUserFromBrand(params));
        handleConfirmationState(false, "");
        refetch();
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, handleConfirmationState, refetch]
  );

  // const onSuccessCreate = useCallback(() => {
  //   onBackdrop();
  // }, [onBackdrop]);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      e.preventDefault();

      const updateUser = async () => {
        if (formRef.current) {
          const params = {
            data: new FormData(formRef.current),
          };
          params.data.append("edituser_id", `${router?.query?.id}`);
          await dispatch(updateUserDetail(params));
          router.replace(`/user`);
        }
      };

      if (formRef.current) {
        btnRef.current?.setLoader(true);
        try {
          if (id) {
            updateUser();
          } else {
          }
        } catch (e) {
          console.error(e);
        }
        btnRef.current?.setLoader(false);
      }
    },
    [dispatch, id]
  );

  const onChangeProfileImage = useCallback((files: File[]) => {
    if (files?.[0]) setUserProfile(files?.[0]);
  }, []);

  const onChangeCoverImage = useCallback((files: File[]) => {
    if (files?.[0]) setUserCover(files?.[0]);
  }, []);

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

  if (id && isLoading) {
    return <Spinner loader={true} />;
  }

  const fileChangedHandler = (files: File[]) => {
    setBrandLogoImage(files[0]);
  };

  const fileCoverChangedHandler = (files: File[]) => {
    setbrandCoverImage(files[0]);
  };
  const cardHeader = (
    // <p className="lead m-0 text-center">{user?.user_id ? "Update User" : "Create User"}</p>
    <h4 className="text-left">Create User</h4>
  );

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

  const ids = user?.brands.map((object) => object.id);

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
                <h4 className={styles.createuserformheading}>Update User</h4>
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
                            // src={
                            //   brandLogoImage &&
                            //   URL.createObjectURL(brandLogoImage):
                            //   user?.profilepath
                            //     ? `${user?.profilepath}${user?.user_picture}`

                            // }
                            src={
                              brandLogoImage
                                ? URL.createObjectURL(brandLogoImage)
                                : `${user?.profilepath}${user?.user_picture}`
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
                            // src={
                            //   user?.profilepath
                            //     ? `${user?.coverpath}${user?.user_coverpicture}`
                            //     : brandCoverImage &&
                            //       URL.createObjectURL(brandCoverImage)
                            // }
                            src={
                              brandCoverImage
                                ? URL.createObjectURL(brandCoverImage)
                                : `${user?.coverpath}${user?.user_coverpicture}`
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
                        {/* <label className={styles.inputlabel}>Name</label> */}
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
                        {/* <label className={styles.inputlabel}>User Name</label> */}
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
                        {/* <label className={styles.inputlabell}>Target</label> */}
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
                        {/* <label className={styles.inputlabel}>Role</label> */}
                        <Dropdown
                          options={roleOptions}
                          defaultKey={`${user?.role_id}`}
                          name="role_id"
                          type="light"
                          className={styles.userlistdropdown}
                          placeholder="Select Role"
                        />
                      </div>
                    </div>

                    <div className="row mt-3">
                      <div className="col-lg-6">
                        {/* <label className={styles.inputlabel}>Email Address</label> */}
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

                      <div className="col-lg-6">
                        {/* <label className={styles.inputlabel}>Password</label> */}
                        <Input
                          className={styles.inputfield}
                          htmlType="password"
                          label="Password"
                          type="floating"
                          name="user_password"
                          defaultValue={user?.user_password}
                          required
                        />
                      </div>
                    </div>
                    <div className="row mt-3">
                      {brandOptions && (
                        <div className="col-lg-6">
                          <AutoComplete
                            // defaultVa={user?.brand_id}
                            // defaultValue={user?.brand_id}
                            multiple
                            options={brandOptions}
                            style={{
                              borderBottom: "1px solid #cbc8d0",
                              width: "100%",
                            }}
                            // key={user?.brands.id}
                            // values={user?.brands?.id || ['0']}
                            // values={ids:string[] || ['0']}
                            name={"brand"}
                            label="Select Brand"
                            type="secondary"
                            className={styles.brandautocomplete}
                          />
                        </div>
                      )}
                      <div className="col-lg-1"></div>
                      <div
                        className="col-lg-4
                      "
                      >
                        <span>Already Selected Brands:</span>
                        {user?.brands?.map((brand) => (
                          <li
                            key={brand.id}
                            className="branduserlists"
                            style={{ height: "25px" }}
                          >
                            <span className="col-lg-3">{brand.name}</span>
                            <span className="col-lg-3 ">
                              <span
                                onClick={() =>
                                  handleConfirmationState(true, brand.id)
                                }
                              >
                                <Icon className="m-1" name="x-square-fill" />
                              </span>
                            </span>
                          </li>
                        )) || <div>No Brand Selected</div>}
                      </div>
                    </div>
                    <div className="row">
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
      <Modal
        style={{ minHeight: "100px !important" }}
        show={confirmation}
        onBackdrop={() => handleConfirmationState(false, 0)}
      >
        <div className="conatiner">
          <span>Are You Sure, You want to delete this Brand?</span>
          <Icon
            className="m-1 "
            name="check-square-fill"
            onClick={(e) => onCheck(brand_id, e)}
          />
          <Icon
            className="m-1 "
            name="x-square-fill"
            onClick={() => handleConfirmationState(false, "")}
          />
        </div>
      </Modal>
    </div>
  );
});

export default UpdateUser;
