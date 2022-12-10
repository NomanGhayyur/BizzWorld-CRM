import React from 'react';
import styles from './generator.module.css';
type propTypes = {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  data: any;
  headings: headingType;
  brands?: string[];
  innerStyle?: React.CSSProperties;
};

export type headingValue =
  | string
  | { key: string; transform?: (value: any) => string | JSX.Element | null };
export type headingType = {
  [key: string]: headingValue;
};

const OverviewGenerator = React.memo<propTypes>((props: propTypes) => {
  const renderItem = (value: headingValue) => {
    if (!props.data) return null;
    if (value === 'brands?') {
      return props.brands?.map((brandName: string) => (
        <p key={brandName} className="d-inline">
          {brandName}
        </p>
      ));
    }
    if (typeof value == 'string') {
      return (
        <p className="lead mb-0">
          {value
            .split(',')
            .map((v) => props.data?.[v])
            .join(' ')}
        </p>
      );
    } else {
      if (!value.transform)
        return (
          <p className="lead mb-0">
            {value.key
              .split(',')
              .map((v) => props.data?.[v])
              .join(' ')}
          </p>
        );
      return value.key
        .split(',')
        .map((v) => value?.transform?.(props.data?.[v]));
    }
  };

  return (
    <div id={props.id} style={props.style} className={props.className}>
      {Object.keys(props.headings).map((key: string) => {
        const value = props.headings[key];
        if (value) {
          return (
            <div
              key={key}
              style={{
                marginLeft: '20px',
                marginRight: '20px',
                marginBottom: '10px',
              }}
            >
              <div
                style={{ height: '35px' }}
                className={`d-block d-flex flex-row align-items-center`}
                key={key}
              >
                <div className="gutter-row" style={{ flex: 0.35 }}>
                  <h5 className="mb-0">{key}:</h5>
                </div>
                <div className="gutter-row mt-4" style={{ flex: 0.65 }}>
                  {renderItem(value)}
                </div>
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
});

export default OverviewGenerator;
