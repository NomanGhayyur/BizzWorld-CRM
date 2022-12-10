import React from "react"
import styles from "./iconStatus.module.css"

type propType = {
  titleOnHover?: string
}
const IconHover = React.memo<React.PropsWithChildren<propType>>((props) => {
  return (
    <div className={styles.container} data-title={props.titleOnHover}>
      {props.titleOnHover && (
        <span className={styles.title}>{props.titleOnHover}</span>
      )}
      {props.children}
    </div>
  )
})
export default IconHover
