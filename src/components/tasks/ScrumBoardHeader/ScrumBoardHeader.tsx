import { Avatar, Button, Dropdown, Icon, IDropdownItem, Modal } from "elements";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import { IBrandListItem } from "../../../model/brand";
import { IUser } from "../../../model/user";
import styles from "./style.module.css";
type propType = {
  brandList?: IBrandListItem[];
  onChangeBrand: (brandId: string | number) => void;
  activeBrandId: string | number;
  Branduser?: IUser[];
};
const ScrumBoardHeader = ({
  brandList,
  onChangeBrand,
  activeBrandId,
  Branduser,
}: propType) => {
  const userBrand = useMemo(() => {
    return brandList?.reduce(
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
  }, [brandList]);

  const users = Branduser?.slice(0, 5) || [];

  const [showUsers, setShowUsers] = useState(false);
  const onUserListClose = () => {
    setShowUsers(false);
  };
  return (
    <div
      className="container-fluid"
      style={{ backgroundColor: "rgb(29, 29, 29)" }}
    >
      <div className="row">
        <div
          className="d-flex justify-content-between"
          style={{ alignItems: "center" }}
        >
          <div>
            <h3
              className="m-0 px-0 py-2"
              style={{
                fontSize: 18,
                color: "white",
                transform: "translateY(6px)",
              }}
            >
              Task Board
            </h3>
          </div>

          <div className="d-flex" style={{ alignItems: "center" }}>
            <div
              className={`d-flex ${styles.userlist}`}
              style={{ marginRight: "20px" }}
            >
              {users &&
                users?.length > 0 &&
                users.map((user) => (
                  <Avatar
                    key={user.brand_id}
                    name="user picture"
                    src={`http://80.240.16.149/aicrm/public/user_picture/${user?.user_picture}`}
                    style={{
                      width: "35px",
                      height: "35px",
                    }}
                    className={`${styles.avatar}`}
                  />
                  // </div>
                ))}
              <Button
                onClick={() => setShowUsers(true)}
                style={{
                  background: "#e8e8e8",
                  borderRadius: "50%",
                  width: "35px",
                  height: "35px",
                  marginLeft: "-7px",
                }}
              >
                <Icon
                  name="three-dots-vertical"
                  style={{
                    color: "black",
                  }}
                />
              </Button>
            </div>
            <Dropdown
              className={styles.brandDropdownn}
              style={{
                width: "200px",
                height: "52px",
                marginTop: "15px",
                position: "relative",
                float: "right",
                color: "white",
                border: "1px solid #298ECE !important",
              }}
              placeholder="Select Brand"
              defaultKey="brand_id"
              options={userBrand || {}}
              name="brand_id"
              type="primary"
              onItemClick={(brandID) => onChangeBrand(brandID)}
              value={activeBrandId.toString()}
            />
          </div>
        </div>
      </div>
      <Modal
        show={showUsers}
        style={{
          width: "15%",
          maxHeight: "40%",
          top: "-25%",
          left: "30%",
          background: "rgb(29, 29, 29)",
          // border: '1px solid white',
        }}
        onBackdrop={onUserListClose}
      >
        {Branduser?.map((user) => {
          return (
            <React.Fragment key={user.user_id}>
              <div className="conatiner m-2">
                <div className=" d-flex">
                  <div
                    style={{
                      marginLeft: "5px",
                    }}
                  >
                    <Avatar
                      name="user picture"
                      src={`http://80.240.16.149/aicrm/public/user_picture/${user?.user_picture}`}
                      style={{
                        width: "35px",
                        height: "35px",
                      }}
                      className={`${styles.avatar}`}
                    />
                  </div>
                  <div
                    style={{
                      marginLeft: "5px",
                      fontSize: "12px",
                      color: "white",
                    }}
                  >
                    {user.user_name}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </Modal>
    </div>
  );
};

export default React.memo(ScrumBoardHeader);
