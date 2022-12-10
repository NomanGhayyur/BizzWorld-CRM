import React, { ReactComponentElement } from "react"
import styles from "./statusHightlight.module.css"
type propType = {
  className?: string
  style?: React.CSSProperties
  bgColor?: string
}
const StatusHighlight = React.memo<React.PropsWithChildren<propType>>(
  (props) => {
    return (
      <div
        style={{ backgroundColor: props.bgColor ? props.bgColor : "lightgrey" }}
        className={styles.container}
      >
        {props.children}
      </div>
    )
  }
)
export default StatusHighlight
