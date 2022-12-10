import { NextPage } from "next";
import React, { useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import useOutsideClick from "../hooks/useOutsideClick";
import SideNav from "../components/layout/SideNav/SideNav";
import { RootState } from "../redux/types";
import styles from "./layout.module.css";
import NavBar from "../components/layout/NavBar";
import { Button, Avatar, Progress, Spinner } from "elements";
import LayoutContext, { useLayoutReducer } from "./layout.context";
import Image from "next/image";
import LargeLogo from "../../public/images/BizzWorld_Logo2.png";
import LogoIcon from "../../public/images/BizzWorld_Logo.svg";
import AccountPopup, {
  IAccountPopupInstance,
} from "../components/layout/AccountPopup/AccountPopup";
import { progressRef } from "../helper/progress";
import { useProtectedRoute } from "../hooks/useRouteProtections";
import Profile from "../components/layout/SideNav/profile";

const MainLayout: NextPage<React.PropsWithChildren<{}>> = (props) => {
  const user = useSelector((store: RootState) => store.auth.user);
  const [state, dispatch] = useLayoutReducer();
  const accountPopupRef = useRef<IAccountPopupInstance>(null);

  const onClickOutside = useCallback((e: MouseEvent) => {
    accountPopupRef.current?.showPopup(false);
  }, []);

  const popupWrapperRef = useOutsideClick(onClickOutside);
  useProtectedRoute();

  return (
    <LayoutContext.Provider value={[state, dispatch]}>
      <div className={styles.main__container}>
        <div
          className={`${styles.main__sideNav} ${
            !state.fullSideNav ? styles.sideNav__collapsed : ""
          }`}
        >
          <div className={`${styles.main__logoContainer}`}>
            <div className={` ${styles.logo}`}>
              <Image
                src={LargeLogo}
                alt="Bizz World Communications"
                style={{}}
              />
            </div>
            {/* <div className="m-3 logo-small">
              <Image src={Logo} alt="ArcInventador" />
            </div> */}
          </div>
          <div className={`${styles.icon__logoContainer}`}>
            <div className={`${styles.icon}`}>
              <Image src={LogoIcon} alt="Bizz World Communications" />
            </div>
          </div>
          <SideNav />

          {/* <Profile /> */}
        </div>
        <div className={styles.main__bodyContainer}>
          {/* <NavBar className={styles.main__header}>
            <div className={styles.header__left}></div>
            <div className={styles.header__right}>
              <div ref={popupWrapperRef} className={styles.header__account}>
                <Button
                  onClick={() => accountPopupRef.current?.showPopup((e) => !e)}
                  style={{ background: 'none' }}
                >
                  <Avatar name={user?.user_name || ''} />
                </Button>
                <AccountPopup ref={accountPopupRef} />
              </div>
            </div>
          </NavBar> */}
          <Progress
            animated
            striped
            style={{ height: "0.5rem", borderRadius: 0 }}
            type="info"
            ref={progressRef}
          />
          <div className={`${styles.main__body}`}>{props.children}</div>
        </div>
      </div>
    </LayoutContext.Provider>
  );
};

export default MainLayout;
