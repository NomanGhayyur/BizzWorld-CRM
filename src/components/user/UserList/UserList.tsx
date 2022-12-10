//@ts-nocheck
import moment from "moment";
import { useRouter } from "next/router";
import React, {
  useCallback,
  useMemo,
  useEffect,
  useState,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Table,
  Highlighter,
  Modal,
  IModalRef,
  IColumnHeading,
  Icon,
  Dropdown,
  IDropdownItem,
  Input,
  IButtonRef,
} from "elements";
import { IUser } from "../../../model/user";
import { AppThunkDispatch, RootState } from "../../../redux/types";
import styles from "./userlist.module.css";
import { useQuery } from "react-query";
import { addCommission, deleteUser, getUserBrandList } from "../../../api/user";
import { DATE_FORMAT, Roles } from "../../../constant/app";
import CreateUser from "../CreateUser";
import { getBrandUserList } from "../../../api/brand";
import { getRoleList } from "../../../api/role";
import Loader from "../../shared/Loader";
import UserDetail from "../userdetails/userdetail";
import Image from "next/image";
import Delete from "../../../../public/icons/delete.svg";
import Update from "../../../../public/icons/update.svg";
import Commission from "../../../../public/icons/list.svg";
import { commissionList } from "../../../api/report";
import { IUserList } from "../../../model/task";

type propTypes = {
  users?: Array<IUser>;
  className?: string;
  style?: React.CSSProperties;
};
type Refrence = {
  refrencetitle: string;
  refrencelink: string;
};

const UsersList = React.memo<propTypes>((props) => {
  const dispatch = useDispatch<AppThunkDispatch>();
  const formRef = useRef<HTMLFormElement>(null);
  const btnRef = useRef<HTMLButtonElement & IButtonRef>(null);
  const [sortKeys, setSortKeys] =
    useState<{ [key in string]: "asc" | "desc" }>();
  const [filterText, setFilterText] = useState<string>("");
  const user = useSelector((store: RootState) => store.auth.user);
  const router = useRouter();
  const modalRef = useRef<IModalRef>(null);
  const [userDetailsModal, setUserDetailsModal] = useState(false);
  const [commissionModal, setCommissionModal] = useState(false);
  const [userID, setUserID] = useState(0);
  const [commission, setCommissionList] = useState<Array<Refrence>>([
    { refrencetitle: "", refrencelink: "" },
  ]);

  const onSearchByText: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      setFilterText(e.target.value);
    }, []);

  const [brandID, setbrandId] = useState<number | string>(user?.brand1 || 1);
  const [roleID, setroledId] = useState<number | string | null>(null);
  const [acvtiveUserId, setActiveUserId] = useState(0);

  const handlebrand = async (brandID: string) => {
    setbrandId(brandID);
  };

  const handlerole = async (roleID: string) => {
    setroledId(roleID);
  };
  const getList = async (id: string | number) => {
    const params = {
      data: {
        brand_id: id,
      },
    };
    const response = await dispatch(getBrandUserList(params));

    return response.data;
  };

  const {
    data: users,
    isFetching,
    isLoading,
    refetch,
  } = useQuery<Array<IUser>>(
    [`UsersList_${brandID}`, brandID],
    () => getList(brandID),
    {
      enabled: !!brandID && !!user?.user_id,
      keepPreviousData: true,
    }
  );

  const { data: commissions } = useQuery<Array<IUserList>>(
    `CommissionList_${userID}`,
    async () => {
      const params = {
        data: {
          id: userID,
        },
      };
      const response = await dispatch(commissionList(params));
      return response.commissiondata;
    },
    {
      enabled: !!user?.user_id,
    }
  );

  const { data: brands } = useQuery(
    `BrandList`,
    async () => {
      const response = await dispatch(getUserBrandList());
      return response.data;
    },
    {
      // enabled: !!user?.user_id,
    }
  );
  const userBrand = useMemo(() => {
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

  const { data: roles } = useQuery(
    `Roles`,
    async () => {
      const response = await dispatch(getRoleList());
      return response.data;
    },
    {
      // enabled: !!user?.user_id,
    }
  );
  const userRole = useMemo(() => {
    return roles?.reduce(
      (
        result: { [x: string]: { label: any } },
        roles: { role_id: string | number; role_name: any }
      ) => {
        result[roles.role_id] = {
          label: roles.role_name,
        };
        return result;
      },
      {} as { [key in string]: IDropdownItem }
    );
  }, [roles]);

  useEffect(() => {
    if (router.asPath.split("#")[1]) {
      modalRef.current?.showModal(true);
    } else {
      modalRef.current?.showModal(false);
    }
  }, [router]);

  const onRowItemClick = (v: IUser) => {
    setActiveUserId(v.user_id);
    setUserDetailsModal(true);
  };

  const onDelete = useCallback(
    async (
      userId: IUser["user_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      try {
        const params = {
          data: {
            edituser_id: userId,
          },
        };
        await dispatch(deleteUser(params));
        refetch();
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, refetch]
  );

  const onEdit = useCallback(
    (
      userId: IUser["user_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      router.push(`/user/update/${userId}`);
    },
    [router]
  );

  const onCommission = useCallback(
    async (
      userId: IUser["user_id"],
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      try {
        event.stopPropagation();
        setUserID(userId);
        setCommissionModal(true);
      } catch (e) {
        console.error(e);
      }
    },
    []
  );

  const columns = useMemo(() => {
    const temp: Array<IColumnHeading> = [
      {
        label: "ID",
        keyIndex: "user_id",
        render: (v: any, _: any, index: any) => parseInt(`${index + 1}`),
      },
      {
        label: "Name",
        keyIndex: "user_name",
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterText} />
        ),
        sortable: true,
        sortIndex: "user_name",
      },

      {
        label: "Role",
        keyIndex: "role_name",
        render: (v: any) => (
          <Highlighter text={v || ""} searchText={filterText} />
        ),
      },
      {
        sortable: true,
        label: "Created At",
        keyIndex: "created_at",
        render: (v: any) => moment(v).format(DATE_FORMAT),
      },
    ];

    if (
      user &&
      ![Roles.SALES_AGENT, Roles.MARKETING_AGENT].includes(user?.role_id)
    ) {
      temp.push({
        label: "Actions",
        keyIndex: "user_id,deleted_at",
        render: (v: any) => (
          <>
            <span
              style={{
                marginLeft: "3px",
                marginRight: "3px",
              }}
              title="Delete"
              onClick={onDelete.bind(this, v.user_id)}
            >
              <Image src={Delete} alt="Alt" width={"25px"} />
            </span>
            <span
              style={{
                marginLeft: "3px",
                marginRight: "3px",
              }}
              title="Edit"
              onClick={onEdit.bind(this, v.user_id)}
            >
              <Image src={Update} alt="Alt" width={"25px"} />
            </span>
            <span
              style={{
                marginLeft: "3px",
                marginRight: "3px",
              }}
              title="View Commission"
              onClick={onCommission.bind(this, v.user_id)}
            >
              <Image src={Commission} alt="Alt" width={"25px"} />
            </span>
          </>
        ),
      });
    }
    return temp;
  }, [filterText, onCommission, onDelete, onEdit, user]);

  const commissionColumns = useMemo(() => {
    const temp: Array<IColumnHeading> = [
      {
        label: "ID",
        keyIndex: "user_id",
        render: (v: any, _: any, index: any) => parseInt(`${index + 1}`),
      },
      {
        label: "Name",
        keyIndex: "user_name",
        render: (v: any) => (
          <Highlighter text={`${v}`.trim()} searchText={filterText} />
        ),
      },

      {
        label: "From",
        keyIndex: "commission_from",
        render: (v: any) => (
          <Highlighter text={v || ""} searchText={filterText} />
        ),
      },
      {
        label: "To",
        keyIndex: "commission_to",
        render: (v: any) => (
          <Highlighter text={v || ""} searchText={filterText} />
        ),
      },
      {
        label: "Rate",
        keyIndex: "commission_rate",
        render: (v: any) => (
          <Highlighter text={v || ""} searchText={filterText} />
        ),
      },
    ];

    return temp;
  }, [filterText]);

  const filtered = useMemo(() => {
    if (filterText) {
      return users
        ?.flat()
        .filter((v: { user_name: string; role_id: any; role_name: string }) => {
          return (
            v.user_name?.toLowerCase()?.includes(filterText.toLowerCase()) ||
            v.role_name?.toLowerCase()?.includes(filterText.toLowerCase())
          );
        });
    } else if (roleID) {
      return users?.filter(
        (v: { user_name: string; role_id: any; role_name: string }) => {
          return v.role_id == roleID;
        }
      );
    } else if (filterText && roleID) {
      return users
        ?.flat()
        .filter((v: { user_name: string; role_id: any; role_name: string }) => {
          return (
            v.user_name?.toLowerCase()?.includes(filterText.toLowerCase()) ||
            v.role_name?.toLowerCase()?.includes(filterText.toLowerCase())
          );
        })
        .filter((v: { user_name: string; role_id: any; role_name: string }) => {
          return v.role_id == roleID;
        });
    }
    return users?.flat();
  }, [users, filterText, roleID]);

  const onAddCommission: React.FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      e.preventDefault();

      const updateStatus = async () => {
        if (formRef.current) {
          const params = {
            data: new FormData(formRef.current),
          };

          params.data.append("id", `${userID}`);

          await dispatch(addCommission(params));
        }
      };

      if (formRef.current) {
        btnRef.current?.setLoader(true);
        try {
          if (userID) {
            updateStatus();
            setCommissionModal(false);
            // refetchPickedPayments();
          } else {
          }
        } catch (e) {
          console.error(e);
        }
        btnRef.current?.setLoader(false);
      }
    },
    [dispatch, userID]
  );

  const onBackdrop = useCallback(() => {
    if (router.asPath.split("#")[1]) {
      router.replace({ pathname: router.pathname, query: router.query });
    }
  }, [router]);

  const onSuccessCreate = useCallback(() => {
    onBackdrop();
  }, [onBackdrop]);

  const rowClassGenerator = useCallback(
    (row: IUser) => (row?.deleted_at ? "table__rowStrike" : ""),
    []
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

  // handle click event of the Add button
  const refrencehandleAddClick = () => {
    setCommissionList([
      ...commission,
      //@ts-ignore
      { commission_from: "", commission_to: "", commission_rate: "" },
    ]);
  };
  // handle click event of the Remove button
  const refrencehandleRemoveClick = (index: number) => {
    const list = [...commission];
    list.splice(index, 1);
    setCommissionList(list);
  };
  return (
    <>
      <Modal
        style={{ overflow: "hidden" }}
        show={userDetailsModal}
        onBackdrop={() => setUserDetailsModal(false)}
      >
        <UserDetail userId={acvtiveUserId || 0} />
      </Modal>
      <div className="row" style={{}}>
        <div className="col-lg-2">
          <h4 style={{ fontWeight: "bold", fontSize: "16px" }}>User List</h4>
        </div>
        <div className="col-lg-1">
          {" "}
          <Icon
            name={"arrow-left"}
            onClick={() => router.back()}
            style={{ marginTop: "13px" }}
          />
        </div>

        <div className="col-lg-9 d-flex justify-content-right">
          <div className="col-3" style={{ marginRight: "10px" }}>
            {userBrand ? (
              <Dropdown
                style={{
                  width: "100%",
                  height: "52px",
                  marginTop: "15px",
                }}
                placeholder="Select Brand"
                defaultKey="brand_id"
                options={userBrand}
                name="brand_id"
                type="light"
                className={styles.selectbrandoptioninusertable}
                onItemClick={(brandID) => handlebrand(brandID)}
                value={brandID.toString()}
              />
            ) : null}
          </div>
          <div className="col-3" style={{ marginRight: "10px" }}>
            {userRole ? (
              <Dropdown
                style={{
                  width: "100%",
                  height: "52px",
                  marginTop: "15px",
                }}
                placeholder="Select Role"
                defaultKey="role_id"
                options={userRole}
                name="role_id"
                type="light"
                className={styles.selectbrandoptioninusertable}
                onItemClick={(roleID) => handlerole(roleID)}
              />
            ) : null}
          </div>
          <div className="col-3" style={{ marginRight: "10px" }}>
            <Input
              style={{ marginTop: "15px" }}
              placeholder="Search User"
              onChange={onSearchByText}
            />
          </div>
          <div className={`text-right ${styles.brandtableiconsswitchdiv}`}>
            <Button
              iconName="plus"
              onClick={() => modalRef.current?.showModal(true)}
              style={{ marginTop: "15px", marginLeft: "15px" }}
            >
              Create User
            </Button>
          </div>
        </div>
      </div>
      <Table
        onSortData={(sortKey, direction) =>
          setSortKeys({ [sortKey as keyof IUser]: direction })
        }
        autoSort={true}
        loading={isLoading}
        onRowItemClick={onRowItemClick}
        data={props.users || filtered || []}
        rowClass={rowClassGenerator}
        columnHeadings={columns}
        pageSize={30}
      />
      <Modal ref={modalRef} onBackdrop={onBackdrop}>
        <CreateUser
          userId={router.asPath.split("#")[1]}
          onSuccess={onSuccessCreate}
        />
      </Modal>
      <Modal
        style={{
          overflow: "hidden",
          minHeight: "20rem",
          maxHeight: "40rem",
          minWidth: "20rem",
          maxWidth: "80rem",
          overflowY: "scroll",
        }}
        show={commissionModal}
        onBackdrop={() => setCommissionModal(false)}
      >
        <div className="container-fluid" style={{ marginTop: "2rem" }}>
          <div style={{ display: "flex" }}>
            <div className="col-lg-8">
              <h4 style={{ margin: "0rem" }}>Add Commission</h4>
            </div>
          </div>

          <form ref={formRef} onSubmit={onAddCommission}>
            <div className="row">
              <div className="col-lg"></div>
              <div className="col-lg-2">
                <Button
                  style={{ float: "right" }}
                  onClick={refrencehandleAddClick}
                >
                  Add More
                </Button>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                {commission.map((_x, i) => {
                  return (
                    <div
                      key={i}
                      className="row mt-2"
                      style={{ alignItems: "baseline" }}
                    >
                      <div className="col-lg">
                        <Input
                          name={`commission[${i}][commission_from]`}
                          className={styles.inputfield}
                          type="floating"
                          labelClass={styles.inputlabel}
                          label="From"
                          htmlType="number"
                        />
                      </div>
                      <div className="col-lg">
                        <Input
                          name={`commission[${i}][commission_to]`}
                          className={styles.inputfield}
                          type="floating"
                          labelClass={styles.inputlabel}
                          label="To"
                          htmlType="number"
                        />
                      </div>
                      <div className="col-lg">
                        <Input
                          name={`commission[${i}][commission_rate ]`}
                          className={styles.inputfield}
                          type="floating"
                          labelClass={styles.inputlabel}
                          label="Rate"
                          htmlType="number"
                        />
                      </div>
                      {commission.length !== 1 && (
                        <div className={`col-lg-1 ${styles.btnbox}`}>
                          <Icon
                            onClick={() => refrencehandleRemoveClick(i)}
                            name={"trash"}
                            className={styles.trashicon}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="row">
              <div className="col-lg"></div>
              <div className="col-lg-2">
                <Button
                  className=""
                  style={{
                    background: "var(--bs-primary)",
                    marginTop: "1.44rem",
                    float: "right",
                  }}
                  ref={btnRef}
                  htmlType="submit"
                >
                  Add Commission
                </Button>
              </div>
            </div>
          </form>
          <div style={{ marginTop: "1rem" }}>
            <Table
              onSortData={(sortKey, direction) =>
                setSortKeys({ [sortKey as keyof IUser]: direction })
              }
              autoSort={true}
              loading={isLoading}
              onRowItemClick={onRowItemClick}
              //@ts-ignore
              data={commissions}
              rowClass={rowClassGenerator}
              columnHeadings={commissionColumns}
              pageSize={30}
            />
          </div>
        </div>
      </Modal>
    </>
  );
});

export default UsersList;
