import React from 'react'
import {

  Progress
} from 'elements';


const Revenuegoalytd = () => {
  return (
    <div className="container-fluid" style={{background:'#fff',borderRadius:'5px',boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.12)'}}>
      <div className="row">
        <h4 style={{paddingTop:'20px',height:'1px',fontSize:'15px'}}>Revenue Goal YTD</h4>
      </div>
      <div className="row" style={{alignItems:'baseline',height:'56px'}}>
        <div className="col-3"><h5 style={{fontWeight:'500',height:'1px'}}>Sales Revenue</h5></div>
        <div className="col-9"><Progress progress={75} total={100} type="info" /></div>
</div>
<div className="row" style={{alignItems:'baseline',height:'56px'}}>
        <div className="col-3"><h5 style={{fontWeight:'500',height:'1px'}}>Targer Revenue</h5></div>
        <div className="col-9"><Progress progress={25} total={100} type="danger" /></div>
</div>
<div className="row" style={{alignItems:'baseline',height:'56px'}}>
        <div className="col-3"><h5 style={{fontWeight:'500',height:'1px'}}>Ytd Revenue</h5></div>
        <div className="col-9"><Progress progress={45} total={100} type="success" /></div>
</div>
    </div>

  )
}

export default Revenuegoalytd