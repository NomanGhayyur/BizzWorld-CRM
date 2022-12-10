import { Icon } from 'elements';
import React from 'react';
import Card from '../../shared/Card';
import styles from './statisticcard.module.css';
import Image from 'next/image';

type propType = {
  className?: string;
  style?: React.CSSProperties;
};

const StatisticCard = React.memo<React.PropsWithChildren<propType>>((props) => {
  return (
    <div className="container" style={{ marginTop: '34px' }}>
      <div className="row">
        <div className="col-sm-4 p-1 pt-0 pb-0">
          <div className={` ${styles.card}`}>
            <div className="card-body">
              <div
                className="d-flex"
                style={{ justifyContent: 'space-between' }}
              >
                <div>
                  <Image
                    src="/images/icon1 (1).svg"
                    width={60}
                    height={40}
                    alt=""
                  />
                </div>
                <div className="">
                  <Icon name="three-dots-vertical" />
                </div>
              </div>
              <div
                className="d-flex"
                style={{ justifyContent: 'space-between' }}
              >
                <div>
                  {' '}
                  <h5
                    className="text-muted fw-normal mt-0"
                    style={{ paddingTop: '4px', paddingLeft: '4px' }}
                    title="Number of Orders"
                  >
                    Income
                  </h5>
                </div>
                <div>
                  {' '}
                  <Icon
                    name="shuffle"
                    style={{ color: 'green', marginTop: '' }}
                  />
                </div>
              </div>
              <h4
                className=""
                style={{
                  marginTop: '-16px',
                  paddingLeft: '4px',
                  marginBottom: '5px',
                }}
              >
                $45.7k
              </h4>
            </div>
          </div>
        </div>

        <div className="col-sm-4 p-1 pt-0 pb-0">
          <div className={` ${styles.card}`}>
            <div className="card-body">
              <div
                className="d-flex"
                style={{ justifyContent: 'space-between' }}
              >
                <div>
                  <Image
                    src="/images/icon1 (2).svg"
                    width={60}
                    height={40}
                    alt=""
                  />
                </div>
                <div className="">
                  <Icon name="three-dots-vertical" />
                </div>
              </div>
              <div
                className="d-flex"
                style={{ justifyContent: 'space-between' }}
              >
                <div>
                  {' '}
                  <h5
                    className="text-muted fw-normal mt-0"
                    style={{ paddingTop: '4px', paddingLeft: '4px' }}
                    title="Number of Orders"
                  >
                    Upcoming
                  </h5>
                </div>
                <div>
                  {' '}
                  <Icon
                    name="shuffle"
                    style={{ color: 'green', marginTop: '' }}
                  />
                </div>
              </div>
              <h4
                className=""
                style={{
                  marginTop: '-16px',
                  paddingLeft: '4px',
                  marginBottom: '5px',
                }}
              >
                $45.7k
              </h4>
            </div>
          </div>
        </div>

        <div className="col-sm-4 p-1 pt-0 pb-0">
          <div className={` ${styles.card}`}>
            <div className="card-body">
              <div
                className="d-flex"
                style={{ justifyContent: 'space-between' }}
              >
                <div>
                  <Image
                    src="/images/icon1 (3).svg"
                    width={60}
                    height={40}
                    alt=""
                  />
                </div>
                <div className="">
                  <Icon name="three-dots-vertical" />
                </div>
              </div>
              <div
                className="d-flex"
                style={{ justifyContent: 'space-between' }}
              >
                <div>
                  {' '}
                  <h5
                    className="text-muted fw-normal mt-0"
                    style={{ paddingTop: '4px', paddingLeft: '4px' }}
                    title="Number of Orders"
                  >
                    Upcoming
                  </h5>
                </div>
                <div>
                  {' '}
                  <Icon
                    name="shuffle"
                    style={{ color: 'green', marginTop: '' }}
                  />
                </div>
              </div>
              <h4
                className=""
                style={{
                  marginTop: '-16px',
                  paddingLeft: '4px',
                  marginBottom: '5px',
                }}
              >
                $45.7k
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default StatisticCard;
