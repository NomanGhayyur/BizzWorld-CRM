import moment from "moment";
import { NextPage } from "next";
import React, { useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { AppThunkDispatch } from "../redux/types";
import styles from "../styles/Login.module.css";
import { Input, Button, IButtonRef, Video, Card } from "elements";
import { login } from "../api/auth";
import Loader from "../components/shared/Loader";
import Image from "next/image";
import Logo from "../../public/images/BizzWorld_Logo2.png";

const Login: NextPage = () => {
  const dispatch = useDispatch<AppThunkDispatch>();
  const formRef = useRef<HTMLFormElement>(null);
  const loginBtn = useRef<HTMLButtonElement & IButtonRef>(null);
  const [isLoading, setLoading] = useState<Boolean>(false);

  const onLogin: React.FormEventHandler = useCallback(
    async (e) => {
      setLoading(true);
      if (formRef.current) {
        try {
          const params = {
            data: new FormData(formRef.current),
          };
          const response = await dispatch(login(params));
          setLoading(false);
        } catch (e: unknown) {
          console.error(e);
          setLoading(false);
        }
      }
    },
    [dispatch]
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
  return (
    <div className={styles.mainlogindiv}>
      <video
        loop
        autoPlay
        muted
        src={"/videos/bg.mp4"}
        style={{
          zIndex: "-1",
          width: "100%",
          objectFit: "cover",
          height: "100%",
        }}
      />

      <div
        className="container"
        style={{ position: "absolute", top: "0", left: "0", right: "0" }}
      >
        <div className="row" style={{ marginTop: "100px" }}>
          <div className="col-lg"></div>
          <div className={`col-lg-5`}>
            <Card
              style={{
                background: "none",
                border: "1px solid white",
                marginTop: "3rem",
                height: "30rem",
                width: "30rem",
                borderRadius: "5px",
              }}
            >
              <form
                ref={formRef}
                onSubmit={onLogin}
                className={styles.loginform}
              >
                <div className="row" style={{ marginTop: "5rem" }}>
                  <div className="col-lg"></div>
                  <div className="col-lg-6">
                    <Image src={Logo} alt="Alt" width={230} height={50} />
                  </div>
                  <div className="col-lg"></div>
                </div>

                <div className="row" style={{ marginTop: "3rem" }}>
                  <div className="col-lg"></div>
                  <div className="col-lg-9">
                    <div style={{}}>
                      <label className={styles.inputlabel}>Email</label>
                      <Input
                        className={styles.inputfield}
                        name="email"
                        defaultValue="admin@arcinventador.com"
                        htmlType="email"
                      />
                    </div>
                  </div>
                  <div className="col-lg"></div>
                </div>

                <div className="row" style={{ marginTop: "0.5rem" }}>
                  <div className="col-lg"></div>
                  <div className={`col-lg-9 ${styles.abcdef}`}>
                    <div className={styles.ghe} style={{}}>
                      <label
                        className={styles.inputlabel}
                        style={{ borderBottom: "none" }}
                      >
                        Password
                      </label>
                      <Input
                        className={styles.password}
                        name="password"
                        defaultValue="aicrm2022"
                        htmlType="password"
                      />
                    </div>
                  </div>
                  <div className="col-lg"></div>
                </div>

                <div className="row mt-4">
                  <div className="col-lg"></div>
                  <div className="col-lg-9">
                    <div style={{}}>
                      <div className="text-center">
                        {" "}
                        <Button
                          className={styles.loginbtn}
                          htmlType="button"
                          ref={loginBtn}
                          onClick={onLogin}
                          style={{ marginBottom: "4rem" }}
                        >
                          Login
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg"></div>
                </div>
              </form>
            </Card>
          </div>

          <div className="col-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Login);
