import React from 'react'
import {Icon}  from 'elements';
import styles from './attachmentView.module.css'
type propType = {
    attachmentName:string
    onDelete: ()=> void
}
function AttachmentView({attachmentName,onDelete}:propType) {
  return (
    <div className={styles.attachment_container}>
        <span className={styles.close} onClick={onDelete}>
            <Icon name='x' width={25} height={25} />
        </span>
        <p>{attachmentName}</p>
    </div>
  )
}

export default AttachmentView