import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useContext, useId, useMemo, useRef } from "react";
import styles from "./sidenav.module.css";
import LayoutContext from "../../../layout/layout.context";
import { toKebabCase } from "../../../helper/utility";
import { SideNavItem } from "../../../model/app";
import { Avatar, Collapse, Icon, useOutsideClick } from "elements";
import routes from "../../../constant/routing";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/types";
import NavBar from "../NavBar";
import AccountPopup, {
  IAccountPopupInstance,
} from "../AccountPopup/AccountPopup";
import { useProtectedRoute } from "../../../hooks/useRouteProtections";

const Profile = () => {
  const router = useRouter();
  const user = useSelector((store: RootState) => store.auth.user);
  const [state, dispatch] = useContext(LayoutContext);
  const onNavClick = () => dispatch({ fullSideNav: !state.fullSideNav });
  const accountPopupRef = useRef<IAccountPopupInstance>(null);

  const onClickOutside = useCallback((e: MouseEvent) => {
    accountPopupRef.current?.showPopup(false);
  }, []);

  const popupWrapperRef = useOutsideClick(onClickOutside);
  useProtectedRoute();
  return (
    <div className="container">
      <div
        className={`${styles.main__sideNav} ${
          !state.fullSideNav ? styles.sideNav__collapsed : ""
        }`}
        style={{
          position: "fixed",
          bottom: "0px",
        }}
      >
        <div
          className={`row rounded ${styles.main__sideNav} ${
            !state.fullSideNav ? styles.sideNav__collapsed : ""
          }`}
          style={{
            alignItems: "center",
            background: "#000",
            bottom: "0px",
            margin: "0px",
            padding: "0px",
            height: "60px",
            marginBottom: "10px",
            width: "230px",
            //@ts-ignore
            background: "linear-gradient(to top, #ff9933 -200%, #298ECE 100%)",
          }}
        >
          <div
            className="col-lg-3"
            onClick={() => accountPopupRef.current?.showPopup((e) => !e)}
          >
            <Avatar
              name={user?.user_picture || ""}
              src={`${user?.path}${user?.user_picture}`}
              style={{
                fontSize: "2rem",
                height: "2.5rem",
                width: "2.5rem",
              }}
            />
          </div>
          <div className={`col-lg-6 mt-1 ${styles.userinfo}`}>
            <h6
              style={{
                marginTop: "10px",
                fontSize: "10px",
                color: "#fff",
                height: "1px",
                marginBottom: "0px",
              }}
            >
              {user?.user_name}
            </h6>
            <div className={`${styles.card_discription}`}>
              <p style={{ marginTop: "10px", fontSize: "10px", color: "#fff" }}>
                {user?.role_name}
              </p>
            </div>
          </div>
          <div className={`col-lg-2 ${styles.userinfo}`}>
            <Icon
              onClick={() => accountPopupRef.current?.showPopup((e) => !e)}
              style={{
                background: "none",
                color: "#fff",
                textAlign: "right",
              }}
              name="three-dots-vertical"
            />
          </div>
        </div>
      </div>
      <AccountPopup ref={accountPopupRef} />
    </div>
  );
};

export default Profile;
