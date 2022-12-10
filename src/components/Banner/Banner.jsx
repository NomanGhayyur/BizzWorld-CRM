
import React from 'react'
import { Icon } from 'elements'
import Card from '../shared/Card'
import styles from './banner.module.css'

const Banner = () => {
  return (
    <>
        <Card>
            <div className={`incomebanner container d-flex  ${styles.incomebanner}`}>
                <div className={`income-ban-card col-lg-3 mt-3 ${styles.banContent}`}>
                    <h5 className='m-0'>Gross</h5>
                    <h2 className={`heading m-0 ${styles.heading}`}><strong>$10000</strong></h2>
                    <p className='m-1'>3.78 <span> <Icon className='m-1' name="caret-up-fill"/> </span> This month</p>
                </div>
                <div className={`income-ban-card col-lg-3 mt-3 ${styles.banContent}`}>
                <h5 className='m-0'>Paid</h5>
                    <h2 className={`heading m-0 ${styles.heading}`}><strong>$7000</strong></h2>
                    <p className='m-1'>2.7 <span> <Icon className='m-1' name="caret-up-fill"/> </span> This month</p>
                </div>
                <div className={`income-ban-card col-lg-3 mt-3 ${styles.banContent}`}>
                <h5 className='m-0'>Unpaid</h5>
                    <h2 className={`heading m-0 ${styles.heading}`}><strong>$2500</strong></h2>
                    <p className='m-1'>4.47 <span> <Icon className='m-1' name="caret-up-fill"/> </span> This month</p>
                </div>
                <div className={`income-ban-card col-lg-3 mt-3 ${styles.banContent}`}>
                <h5 className='m-0'>Cancel</h5>
                    <h2 className={`heading m-0 ${styles.heading}`}><strong>$500</strong></h2>
                    <p className='m-1'>1.54 <span> <Icon className='m-1' name="caret-up-fill"/> </span> This month</p>
                    
                </div>
            </div>
        </Card>
    </>
  )
}

export default Banner