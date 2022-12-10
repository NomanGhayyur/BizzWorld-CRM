import React, {
  useState,
  useCallback,
  useMemo,
  useImperativeHandle,
  useEffect,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./accountpopup.module.css";
import { AppThunkDispatch, RootState } from "../../../redux/types";
import Link from "next/link";
import { Button, Avatar, Icon, IconNames, useOutsideClick } from "elements";
import { logout } from "../../../api/auth";
import { Roles } from "../../../constant/app";
import { useRouter } from "next/router";

type NavListItem = {
  route?: string;
  action?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  title: string;
  iconName: IconNames;
};

type propTypes = {};

export interface IAccountPopupInstance {
  showPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const AccountPopup = React.forwardRef<IAccountPopupInstance, propTypes>(
  (props: React.PropsWithChildren<propTypes>, ref) => {
    const [show, showPopup] = useState(false);
    const user = useSelector((store: RootState) => store.auth.user);
    const dispatch = useDispatch<AppThunkDispatch>();
    const router = useRouter();

    const onLogout = useCallback(async () => {
      try {
        await dispatch(logout());
        showPopup(false);
      } catch (e) {
        console.log(e);
      }
    }, [dispatch]);

    const navList: Array<NavListItem> = useMemo(() => {
      const routes: Array<NavListItem> = [
        // {
        //   route: '/settings',
        //   title: 'Settings',
        //   iconName: 'gear',
        // },
      ];

      if (user?.role_id == Roles.SUPER_ADMIN) {
        routes.push({
          route: "/routes",
          title: "Route Manager",
          iconName: "signpost-split",
        });
      }

      return routes;
    }, [user]);

    const renderActions = useMemo(() => {
      return navList.map((item, index) => {
        if (item.action) {
          return (
            <Button iconName={item.iconName} key={index} onClick={item.action}>
              {item.title}
            </Button>
          );
        }
        return (
          <Link key={item.route || index} href={item.route || ""} passHref>
            <a>
              <Icon name={item.iconName} />
              {item.title}
            </a>
          </Link>
        );
      });
    }, [navList]);

    useImperativeHandle(
      ref,
      () => {
        return {
          showPopup,
        };
      },
      []
    );

    useEffect(() => {
      showPopup(false);
    }, [router]);

    return (
      <>
        {show ? (
          <div className={styles.container}>
            <div className="conatiner">
              <div className="row">
                <div className="col-lg-9"></div>
                <div className="col-lg-1">
                  <Icon
                    onClick={() => showPopup(false)}
                    style={{
                      background: "none",
                      color: "#298ECE",
                      textAlign: "right",
                    }}
                    name="x-lg"
                  />
                </div>
              </div>
            </div>
            <div className={styles.profileDetail}>
              <Avatar
                name={user?.user_picture || ""}
                src={`${user?.path}${user?.user_picture}`}
              />
              <h4 style={{ color: "lightgray" }}>{user?.user_name}</h4>
              <p
                style={{
                  wordBreak: "break-all",
                  whiteSpace: "normal",
                  color: "lightgray",
                }}
              >
                {user?.user_email}
              </p>
            </div>
            <div className={styles.accountNavList}>{renderActions}</div>
            <Button
              iconName="box-arrow-in-left"
              className={styles.logout}
              onClick={onLogout}
            >
              Logout
            </Button>
          </div>
        ) : null}
      </>
    );
  }
);

export default AccountPopup;
