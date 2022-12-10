import React from 'react';
import { useSelector } from 'react-redux';
type ComponentProps = {
  style: React.CSSProperties;
};

const CurrencyIcons = ({ style }: ComponentProps) => {
  return (
    <div className="app_currency">
      <div className="" style={style}>
        <span>$</span>
      </div>
    </div>
  );
};
export default React.memo(CurrencyIcons);
