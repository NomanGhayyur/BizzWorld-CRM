import React from 'react'
import {

  Progress
} from 'elements';


const Balancesheet = () => {
  return (
    <div className="container-fluid" style={{background:'#fff',borderRadius:'5px',boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.12)'}}>
      <div className="row">
        <h4 style={{paddingTop:'20px',height:'1px',fontSize:'14px'}}>Balancesheet</h4>
      </div>
      <div className="row" style={{alignItems:'baseline',borderBottom:'1px solid #D3D3D3'}}>
        <div className="col-4"><h5>Item</h5></div>
        <div className="col-4"><h5>Balance</h5></div>
        <div className="col-4"></div>
</div>
<div className="row" style={{alignItems:'baseline',borderBottom:'1px solid #D3D3D3'}}>
        <div className="col-4"><p style={{paddingTop:'10px'}}>Subtotals</p></div>
        <div className="col-4"><p style={{paddingTop:'10px'}}>$853953</p></div>
        <div className="col-4"><Progress progress={80} total={100} type="warning" /></div>
</div>
<div className="row" style={{alignItems:'baseline',borderBottom:'1px solid #D3D3D3'}}>
        <div className="col-4"><p style={{paddingTop:'10px'}}>Assets</p></div>
        <div className="col-4"><p style={{paddingTop:'10px'}}>$853953</p></div>
        <div className="col-4"><Progress progress={75} total={100} type="warning" /></div>
</div>
<div className="row" style={{alignItems:'baseline',borderBottom:'1px solid #D3D3D3'}}>
        <div className="col-4"><p style={{paddingTop:'10px'}}>Assets Less Liabilities & Equility</p></div>
        <div className="col-4"><p style={{paddingTop:'10px'}}>$853953</p></div>
        <div className="col-4"><Progress progress={35} total={100} type="warning" /></div>
</div>
<div className="row" style={{alignItems:'baseline',borderBottom:'1px solid #D3D3D3'}}>
        <div className="col-4"><p style={{paddingTop:'10px'}}>Liabilities & Equility</p></div>
        <div className="col-4"><p style={{paddingTop:'10px'}}>$853953</p></div>
        <div className="col-4"><Progress progress={65} total={100} type="warning" /></div>
</div>
    </div>

  )
}

export default Balancesheet