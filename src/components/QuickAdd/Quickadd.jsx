import React from 'react'
import { Icon } from 'elements';
import Card from '../shared/Card';
import styles from './quickadd.module.css'


const Quickadd = () => {
  return (
    <div className='mt-3'>
        <Card>
                <div className={`add ${styles.add}`}>
                    <h4 className='text-center'><strong>Top Sales Agent</strong></h4>
                    <div className="row">
                        <div className="col-lg-6">
                        <Icon
                            name="dot"
                            // className={styles.sideNav__itemIcon}
                        />
                        SYEDA A. Moiz
                        </div>
                        <div className="col-lg-6">
                            {/* <h6>0.465432BTC</h6> */}
                            <p>$ 10,000</p>
                        </div>
                    </div>
                    <hr className={`divider ${styles.divider}`} />
                    <br />
                    <div className="row">
                        <div className="col-lg-6">
                        <Icon
                            name="dot"
                            // className={styles.sideNav__itemIcon}
                        />
                        MAHA KHAN
                        </div>
                        <div className="col-lg-6">
                            {/* <h6>0.465432BTC</h6> */}
                            <p>$ 7,500</p>
                        </div>
                    </div>
                    <hr className={`divider ${styles.divider}`} />
                    <br />
                    <div className="row">
                        <div className="col-lg-6">
                        <Icon
                            name="dot"
                            // className={styles.sideNav__itemIcon}
                        />
                         <span>NOORULAIN KHAN</span>
                        </div>
                        <div className="col-lg-6">
                            {/* <h6>0.465432BTC</h6> */}
                            <p>$ 8,700</p>
                        </div>
                    </div>
                    <hr className={`divider ${styles.divider}`} />
                    <br />
                    <div className="row">
                        <div className="col-lg-6">
                        <Icon
                            name="dot"
                            // className={styles.sideNav__itemIcon}
                        />
                        ALI RAZA
                        </div>
                        <div className="col-lg-6">
                            {/* <h6>0.465432BTC</h6> */}
                            <p>$ 12,000</p>
                        </div>
                    </div>
                    <br />
                </div>
            </Card>
        </div>
  )
}

export default Quickadd