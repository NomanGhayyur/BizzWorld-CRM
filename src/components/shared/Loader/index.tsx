import Image from "next/image";
import React from "react";
import styles from "./loader.module.css";
type propType = {
  fullPage?: boolean;
  icon?: boolean;
};

const Loader = ({ fullPage = false, icon }: propType) => {
  if (icon)
    return <div className="spinner-border text-primary" role="status" />;
  if (icon && fullPage)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100%", width: "100%" }}
      >
        <div className="spinner-border text-primary" role="status" />
      </div>
    );

  if (fullPage) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100%", width: "100%" }}
      >
        <Image
          src={"/images/BizzWorld_Logo.svg"}
          alt="loader"
          width={100}
          height={100}
          className={styles.loader}
        />
      </div>
    );
  } else {
    return (
      <Image
        src={"/images/loader-01.svg"}
        alt="loader"
        width={50}
        height={50}
        className={styles.loader}
      />
    );
  }
};
export default Loader;
