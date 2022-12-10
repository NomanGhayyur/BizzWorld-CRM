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
import Profile from "./profile";

const SideNav = () => {
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

  const renderMenu = useMemo(() => {
    const renderLink = (
      linkKey: keyof SideNavItem | string,
      navItem: SideNavItem,
      id: string
    ) => {
      const hasChildrens =
        navItem.children && Object.keys(navItem.children).length > 0;
      return (
        <Link href={linkKey || "#"} passHref>
          <a aria-controls={id}>
            <Icon
              name={navItem.iconName || "dot"}
              className={styles.sideNav__itemIcon}
            />
            {state.fullSideNav ? navItem.heading : null}
            {hasChildrens ? (
              <Icon
                name={"chevron-down"}
                className={styles.sideNav__itemIcon}
              />
            ) : null}
          </a>
        </Link>
      );
    };

    const renderCollapse = (navItem: SideNavItem, id: string) => {
      const hasChildrens =
        navItem.children && Object.keys(navItem.children).length > 0;
      const title = (
        <>
          <Icon
            name={navItem.iconName || "dot"}
            className={styles.sideNav__itemIconn}
          />
          {state.fullSideNav ? navItem.heading : null}
          {hasChildrens && state.fullSideNav ? (
            <Icon name={"chevron-down"} className={styles.sideNav__itemIcone} />
          ) : null}
        </>
      );
      return (
        <Collapse title={title}>
          {hasChildrens ? (
            <ul
              key={id}
              className={`${styles.sideNav__listContainer} ${styles.sideNav__nestedListContainer}`}
            >
              {Object.keys(navItem.children || {}).map((key) =>
                renderItem(key, navItem.children)
              )}
            </ul>
          ) : null}
        </Collapse>
      );
    };
    const renderItem = (
      linkKey: keyof SideNavItem | string,
      activeRoutes?: { [link in string]: SideNavItem }
    ) => {
      if (!activeRoutes) return null;
      const nav: SideNavItem = activeRoutes[linkKey];
      if (
        nav.roles &&
        nav.roles.length > 0 &&
        user &&
        !nav.roles?.includes(user.role_id)
      )
        return null;
      const id = toKebabCase(linkKey || nav.heading);
      const hasChildrens = nav.children && Object.keys(nav.children).length > 0;
      return (
        <li
          key={id}
          className={router.route == linkKey ? styles.sideNav__active : ""}
        >
          {hasChildrens
            ? renderCollapse(nav, id)
            : renderLink(linkKey, nav, id)}
        </li>
      );
    };

    return Object.keys(routes).map((key) => renderItem(key, routes));
  }, [router.route, state.fullSideNav, user]);

  return (
    <div id="overflowTest">
      <div className="text-right">
        <button
          onClick={onNavClick}
          style={{
            alignItems: "center",
            background: "linear-gradient(to top, #ff9933 -200%, #298ECE 100%)",
            // opacity: '0.8',
            color: "white",
            position: "absolute",
            // margin: '-12px',
            marginTop: "-15px",
            marginLeft: "-10px",
            border: "none",
            height: "25px",
            width: "25px",
          }}
          className={`rounded-circle ${styles.roundedCircle}`}
          type="button"
          aria-controls="navbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          {/* <Icon name="chevron-right" /> */}
        </button>
      </div>
      <ul className={styles.sideNav__listContainer}> {renderMenu} </ul>
      {/* <div className="container">
        <div
          className="asd"
          style={{
            position: 'fixed',
            bottom: '0px',
          }}
        >
          <div
            className="row rounded"
            style={{
              alignItems: 'center',
              background: '#000',
              bottom: '0px',
              margin: '0px',
              padding: '0px',
              height: '60px',
              marginBottom: '10px',
              width: '230px',
            }}
          >
            <div
              className="col-lg-3"
              onClick={() => accountPopupRef.current?.showPopup((e) => !e)}
            >
              <Avatar
                name={user?.user_picture || ''}
                src={`${user?.path}${user?.user_picture}`}
                style={{
                  fontSize: '2rem',
                  height: '2.5rem',
                  width: '2.5rem',
                }}
              />
            </div>
            <div className="col-lg-6 mt-1">
              <h6
                style={{
                  marginTop: '10px',
                  fontSize: '10px',
                  color: '#fff',
                  height: '1px',
                  marginBottom: '0px',
                }}
              >
                {user?.user_name}
              </h6>
              <p style={{ marginTop: '10px', fontSize: '10px', color: '#fff' }}>
                {user?.role_name}
              </p>
            </div>
            <div className="col-lg-2">
              <Icon
                onClick={() => accountPopupRef.current?.showPopup((e) => !e)}
                style={{
                  background: 'none',
                  color: '#fff',
                  textAlign: 'right',
                }}
                name="three-dots-vertical"
              />
            </div>
          </div>
        </div>
      </div>
      <AccountPopup ref={accountPopupRef} />*/}
      <Profile />
    </div>
  );
};

export default SideNav;
