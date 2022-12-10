import { Icon, Input } from 'elements';
import React, { useCallback, useState } from 'react';
import { IAdmin } from '../../../model/admindashboard';
import styles from './TopCard.module.css';

type propType = {
  className?: string;
  style?: React.CSSProperties;
  topdata?: IAdmin;
};

const TopCard = ({ topdata }: propType) => {
  // const handledollarrate: React.ChangeEventHandler<HTMLInputElement> =
  //   useCallback((e) => {
  //     setDollarRate(e.target.value);
  //   }, []);
  console.log(topdata, 'topdata');
  return (
    <div
      className="container"
      style={{ marginTop: '20px', marginBottom: '20px' }}
    >
      <div className="row">
        <div className="col-lg-3">
          <div className="row">
            <div className={` ${styles.card}`}>
              <div className="card-body">
                <div className="d-flex">
                  <div
                    style={{
                      background: 'rgba(70, 235, 59,0.2)',
                      borderRadius: '5px',
                    }}
                  >
                    <Icon
                      name="cash-stack"
                      style={{
                        margin: '15px',
                        color: 'rgba(70, 235, 59)',
                      }}
                    />
                  </div>

                  <div
                    className=""
                    style={{
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      {' '}
                      <h5
                        className="text-muted fw-normal mt-0"
                        style={{ paddingTop: '0px', paddingLeft: '8px' }}
                        title="Number of Orders"
                      >
                        Salery Expense
                      </h5>
                      <h4
                        className=""
                        style={{
                          marginTop: '-25px',
                          paddingLeft: '8px',
                          marginBottom: '0px',
                          fontSize: '30px',
                        }}
                      >
                        {topdata?.totalsalary}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3">
          <div className="row">
            <div className={` ${styles.card}`}>
              <div className="card-body">
                <div className="d-flex">
                  <div
                    style={{
                      background: 'rgba(58, 87, 232,0.2)',
                      borderRadius: '5px',
                    }}
                  >
                    <Icon
                      name="currency-exchange"
                      style={{
                        margin: '15px',
                        color: 'blue',
                      }}
                    />
                  </div>

                  <div
                    className=""
                    style={{
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      {' '}
                      <h5
                        className="text-muted fw-normal mt-0"
                        style={{ paddingTop: '0px', paddingLeft: '8px' }}
                        title="Number of Orders"
                      >
                        PPC Expense
                      </h5>
                      <h4
                        className=""
                        style={{
                          marginTop: '-25px',
                          paddingLeft: '8px',
                          marginBottom: '0px',
                          fontSize: '30px',
                        }}
                      >
                        {topdata?.ppcexpenseinrs}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3">
          <div className="row">
            <div className={` ${styles.card}`}>
              <div className="card-body">
                <div className="d-flex">
                  <div
                    style={{
                      background: 'rgba(224, 61, 216,0.2)',
                      borderRadius: '5px',
                    }}
                  >
                    <Icon
                      name="cash-coin"
                      style={{
                        margin: '15px',
                        color: 'rgba(224, 61, 216)',
                      }}
                    />
                  </div>

                  <div
                    className=""
                    style={{
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      {' '}
                      <h5
                        className="text-muted fw-normal mt-0"
                        style={{ paddingTop: '0px', paddingLeft: '8px' }}
                        title="Number of Orders"
                      >
                        Income
                      </h5>
                      <h4
                        className=""
                        style={{
                          marginTop: '-25px',
                          paddingLeft: '8px',
                          marginBottom: '0px',
                          fontSize: '30px',
                        }}
                      >
                        {topdata?.incomeinrs}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3">
          <div className="row">
            <div className={` ${styles.card}`}>
              <div className="card-body">
                <div className="d-flex">
                  <div
                    style={{
                      background: 'rgba(214, 81, 116,0.2)',
                      borderRadius: '5px',
                    }}
                  >
                    <Icon
                      name="graph-up-arrow"
                      style={{
                        margin: '15px',
                        color: 'rgba(214, 81, 116)',
                      }}
                    />
                  </div>

                  <div
                    className=""
                    style={{
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      {' '}
                      <h5
                        className="text-muted fw-normal mt-0"
                        style={{ paddingTop: '0px', paddingLeft: '8px' }}
                        title="Number of Orders"
                      >
                        Loss/Profit
                      </h5>
                      <h4
                        className=""
                        style={{
                          marginTop: '-25px',
                          paddingLeft: '8px',
                          marginBottom: '0px',
                          fontSize: '30px',
                        }}
                      >
                        {topdata?.lossprofit}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopCard;
