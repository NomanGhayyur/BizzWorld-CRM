import React from 'react'
import { Icon } from 'elements';
import Card from '../shared/Card';
import styles from './portfolio.module.css';

const Portfolio = () => {
  return (
    
        <Card>
                <div className={`portfolio ${styles.portfolio}`}>
                        {/* <h6><strong>Your Portfolio</strong></h6> */}
                        <br />
                        <div className="row text-center">
                            <h4><strong>$1,105,00</strong></h4>
                            <span className={`portfoliobalance ${styles.portfoliobalance}`}>Total Receivable</span>
                        </div>
                        <hr className={`divider ${styles.divider}`} />     
                        <br />                   
                        <div className="row ">
                            <div className="col-lg-6 text-center">
                            
                            <p><Icon
                                name="dot"
                                // className={styles.sideNav__itemIcon}
                            /> Innova Design Hub</p>
                            </div>
                            <div className={`col-lg-6 portfoliorightcol text-center ${styles.portfoliorightcol}`}>
                                {/* <h6>0.465432BTC</h6> */}
                                <b><p>$ 50,000</p></b>
                            </div>
                        </div>
                        <hr className={`divider ${styles.divider}`} />  
                        <br />                      
                        <div className="row">
                            <div className="col-lg-6 text-center">
                            <p><Icon
                                name="dot"
                                // className={styles.sideNav__itemIcon}
                            /> Innova Design Hub 2</p>
                            </div>
                            <div className={`col-lg-6 portfoliorightcol text-center ${styles.portfoliorightcol}`}>
                                {/* <h6>0.465432BTC</h6> */}
                                <b><p>$ 30,500</p></b>
                            </div>
                        </div>
                        <hr className={`divider ${styles.divider}`} />
                        <br />
                        <div className="row">
                            <div className="col-lg-6 text-center">
                            <p><Icon
                                name="dot"
                                // className={styles.sideNav__itemIcon}
                            /> Innova Design Hub 3</p>
                            </div>
                            <div className={`col-lg-6 portfoliorightcol text-center ${styles.portfoliorightcol}`}>
                                {/* <h6>0.465432BTC</h6> */}
                                <b><p>$ 40,000</p></b>
                            </div>
                        </div>
                </div>
                </Card>
            
  )
}

export default Portfolio