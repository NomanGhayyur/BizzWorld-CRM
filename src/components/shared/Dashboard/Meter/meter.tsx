import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { IAdmin } from "../../../../model/admindashboard";

type propType = {
  className?: string;
  style?: React.CSSProperties;
  data?: IAdmin;
};

const Meter = ({ data }: propType) => {
  const achieved = data?.totalachieve;
  const target = data?.totaltarget;
  //@ts-ignore
  const percentage = (achieved / target) * 100;

  function currencyFormat(num: number) {
    return num.toFixed().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  return (
    <div style={{ display: "flex" }}>
      <div className="" style={{ margin: "auto", marginLeft: "-0.3rem" }}>
        <h4 style={{ fontWeight: "500", margin: "0px" }}>Total Target</h4>
        <span
          style={{
            display: "flex",
            color: "gray",
            fontSize: "20px",
            marginBottom: "1rem",
          }}
        >
          ${" "}
          <span style={{ fontSize: "20px", margin: "0px" }}>
            {
              //@ts-ignore
              currencyFormat(parseInt(data?.totaltarget))
            }
            {/* {data?.totaltarget} */}
          </span>
        </span>
      </div>
      <div className="" style={{ width: 160, height: 160, margin: "auto" }}>
        {/* {target == achieved ? (
          <CircularProgressbar
            value={achieved}
            maxValue={target}
            text={`${100}%`}
          />
        ) : target < achieved ? (
          <CircularProgressbar
            value={achieved}
            maxValue={target}
            text={`${100}%`}
          />
        ) : (
          <CircularProgressbar
            value={achieved}
            maxValue={target}
            text={`${percentage}%`}
          />
        )} */}
        {
          //@ts-ignore
          target < achieved ? (
            <CircularProgressbar
              //@ts-ignore
              value={achieved}
              maxValue={target}
              text={`${100}%`}
            />
          ) : (
            <CircularProgressbar
              //@ts-ignore
              value={achieved}
              maxValue={target}
              text={`${percentage}%`}
            />
          )
        }
      </div>
    </div>
  );
};

export default Meter;
