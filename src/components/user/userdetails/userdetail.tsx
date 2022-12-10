//@ts-nocheck
import {
  Avatar,
  Button,
  RandomImage,
  Tab,
  ITabItem,
  Badge,
  Icon,
} from "elements";
import moment from "moment";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetail } from "../../../api/user";
import { deleteUser } from "../../../api/user";
import Card from "../../shared/Card";
import Loader from "../../shared/Loader";
import OverviewGenerator from "../../shared/OverviewGenerator";
import { headingType } from "../../shared/OverviewGenerator/OverviewGenerator";
import UsersList from "../UserList";
import { DATE_FORMAT } from "../../../constant/app";
import { IUser } from "../../../model/user";
import { AppThunkDispatch, RootState } from "../../../redux/types";
import styles from "../../../styles/user/Userupdate.module.css";
// export interface IUser {
//   "user_picture": string | null,
//   "user_coverpicture": string | null,
//
// }

const overviewHeadings: headingType = {
  // Name: "user_name",
  // Username: "user_username",
  Brands: "brands",
  Role: "role_name",
  "User Target": "user_target",
  "Active Since": {
    key: "created_at",
    transform: (created_at) => (
      <p className="lead mb-0">{moment(created_at).format(DATE_FORMAT)}</p>
    ),
  },
  // "Updated At": {
  //   key: "updated_at",
  //   transform: (updated_at) => (
  //     <p className="lead mb-0">{moment(updated_at).format(DATE_FORMAT)}</p>
  //   ),
  // },
};
type propType = {
  userId: number;
};
const UserDetail = ({ userId }: propType) => {
  const router = useRouter();
  const dispatch = useDispatch<AppThunkDispatch>();
  // const { id } = router.query;
  const [logoPathPrefix, setLogoPathPrefix] = useState<string>("");
  const [coverPathPrefix, setCoverPathPrefix] = useState<string>("");
  const [brands, setBrands] = useState<Array<string>>([]);

  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery<IUser>(
    `User_${userId}`,
    async () => {
      let response = await dispatch(
        getUserDetail({ params: { edituser_id: userId } })
      );
      setLogoPathPrefix(response.profilepath);
      setCoverPathPrefix(response.coverpath);
      response = { ...response.data, brands: response.brands };
      return response;
    },
    {
      enabled: !!userId,
    }
  );

  const onDelete = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      try {
        const params = {
          //   data: {
          //     user_id: user?.user_id,
          //   },
        };
        await dispatch(deleteUser({ params: { edituser_id: userId } }));
        router.replace("/user");
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, userId, router]
  );

  const onEdit = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      router.push(`/user/update/${user?.user_id}`);
    },
    [user, router]
  );

  const tabs: ITabItem = useMemo(() => {
    return {
      Overview: (
        <OverviewGenerator
          headings={overviewHeadings}
          data={user}
          brands={brands}
          innerStyle={{ display: "block important" }}
        />
      ),
    };
  }, [brands, user]);

  if (isLoading) {
    return (
      <div
        className="d-flex justify-cntent-center align-items-center"
        style={{ height: "100vh", overflow: "hidden" }}
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
            <div
              className="card shadow border"
              style={{ marginBottom: "40px" }}
            >
              <div
                className="card-header"
                style={{ background: "rgba(0,0,0,.03)" }}
              >
                <div className="row" style={{ alignItems: "baseline" }}>
                  <div className="col-lg-3">
                    <h4
                      className={styles.brandtitleheading}
                      style={{
                        paddingLeft: "20px",
                        textTransform: "capitalize",
                      }}
                    >
                      {`${user?.user_name}`}
                    </h4>
                  </div>
                  <div className="col-lg-3"></div>
                  <div className="col-lg-6">
                    <div
                      className="text-center"
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "2%",
                      }}
                    >
                      <div className="d-flex">
                        <div style={{ marginRight: "10px" }}>
                          <span className="trash">
                            <Icon
                              name="trash"
                              style={{ fontSize: "18px", marginRight: "" }}
                              className="m-1"
                              onClick={onDelete}
                            />
                          </span>
                          <span className="pencil">
                            <Icon
                              name="pencil-square"
                              style={{ fontSize: "18px" }}
                              className="m-1"
                              onClick={onEdit}
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-body">
                <div className="row">
                  <div className="col-lg-12">
                    {user?.user_coverpicture && coverPathPrefix ? (
                      <div
                        className={styles.brandDetail__cover}
                        style={{
                          backgroundImage: `url(${coverPathPrefix}${user?.user_coverpicture})`,
                        }}
                      ></div>
                    ) : (
                      <RandomImage className={styles.brandDetail__cover} />
                    )}
                  </div>
                </div>

                <div className={styles.brandDetail__avatarContainer}>
                  <div className={styles.brandDetail__innerAvatarContainer}>
                    {user?.user_picture ? (
                      <Avatar
                        className={styles.brandDetail__avatar}
                        src={`${logoPathPrefix}${user?.user_picture}`}
                        name={`${user?.user_name}`.trim()}
                      />
                    ) : null}
                    <div className={styles.brandDetail__userNameContainer}>
                      <h2>{`${user?.user_name}`}</h2>
                      <p>{user?.user_email}</p>
                    </div>
                  </div>
                </div>
                <hr
                  style={{
                    color: "	#000",
                    width: "97%",
                    marginLeft: "20px",
                    marginTop: "-10px",
                  }}
                ></hr>

                <div className="container" style={{ marginTop: "-10px" }}>
                  <div className="row mb-4">
                    <div className="col-lg-3">
                      <div style={{ marginLeft: "10px" }}>
                        <h5 style={{ height: "3px" }}>Brands</h5>
                        {user?.brands?.map((brand) => (
                          <li
                            key={brand.id}
                            className="branduserlists"
                            style={{ height: "25px" }}
                          >
                            {brand.name}
                          </li>
                        ))}
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <h5 style={{ height: "3px" }}>Role</h5>
                      <p>{user?.role_name}</p>
                    </div>
                    <div className="col-lg-3">
                      <h5 style={{ height: "3px" }}>User Target</h5>
                      <p>{user?.user_target}</p>
                    </div>
                    <div className="col-lg-3">
                      <h5 style={{ height: "3px" }}>Active Since</h5>
                      <p>{user?.created_at}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    // <Card className={styles.brandDetail__container}>
    //   {user?.user_coverpicture && coverPathPrefix ? (
    //     <div className={styles.brandDetail__cover}>
    //       <Image
    //         objectFit="cover"
    //         layout="fill"
    //         src={`${coverPathPrefix}${user?.user_coverpicture}`}
    //         alt={user.user_name + ' Cover'}
    //       />
    //     </div>
    //   ) : (
    //     <RandomImage className={styles.brandDetail__cover} />
    //   )}

    //   <Card className={styles.brandDetail__headerDetail}>
    //     <div className={styles.brandDetail__avatarContainer}>
    //       <div className={styles.brandDetail__innerAvatarContainer}>
    //         {user?.user_picture ? (
    //           <Avatar
    //             className={styles.brandDetail__avatar}
    //             src={`${logoPathPrefix}${user?.user_picture}`}
    //             name={`${user?.user_name}`.trim()}
    //           />
    //         ) : null}
    //         <div className={styles.brandDetail__userNameContainer}>
    //           <h2>{`${user?.user_name}`}</h2>
    //           <p>{user?.user_email}</p>
    //         </div>
    //       </div>
    //       <div>
    //         <Icon  className="m-1 trash" name="trash" onClick={onDelete} style={{fontSize:'21px'}}  />
    //         <Icon className="m-1 pencil" name="pencil-square" onClick={onEdit} style={{fontSize:'21px'}}/>
    //       </div>
    //     </div>
    //     <Tab data={tabs} />
    //   </Card>
    // </Card>
  );
};

export default UserDetail;
// function deleteUser(params: { data: { user_id: IUser; }; }): any {
//   throw new Error("Function not implemented.");
// }
