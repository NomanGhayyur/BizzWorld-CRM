import React from 'react'
import {

  Progress,
  Icon
} from 'elements';


const History = () => {
  return (
    <div className="container-fluid mt-4" style={{background:'#fff',borderRadius:'5px',boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.12)'}}>
      <div className="row" style={{alignItems:'baseline',borderBottom:'1px solid #D3D3D3'}}>
        <div className="col-6"><h4 style={{fontSize:'15px'}}>History</h4></div>
        <div className="col-6"><h5 className='text-right'>View all</h5></div>
</div>
<div className="row" style={{alignItems:'baseline',borderBottom:'1px solid #D3D3D3'}}>
        <div className="col-1"><Icon name='credit-card-2-back' style={{color:'4646ea',fontSize:'24px',fontWeight:'bold'}}/></div>
        <div className="col-3"><h6>Pay Starbuck Coffe</h6></div>
        <div className="col-3"><p>Aug 9,2022 at 9:08 PM</p></div>
        <div className="col-2"><p className='text-right' style={{fontWeight:'bold'}}>Payment</p></div>
        <div className="col-2"><p className='text-danger text-right'>$70</p></div>
        <div className="col-1"><Icon name='three-dots-vertical' /></div>
</div>
<div className="row" style={{alignItems:'baseline',borderBottom:'1px solid #D3D3D3'}}>
        <div className="col-1"><Icon name='receipt-cutoff' style={{color:'red',fontSize:'24px'}}/></div>
        <div className="col-3"><h6>Electricity Bill</h6></div>
        <div className="col-3"><p>Aug 9,2022 at 9:08 PM</p></div>
        <div className="col-2"><p className='text-right' style={{fontWeight:'bold'}}>Payment</p></div>
        <div className="col-2"><p className='text-success text-right'>$70</p></div>
        <div className="col-1"><Icon name='three-dots-vertical' /></div>
</div>
<div className="row" style={{alignItems:'baseline',borderBottom:'1px solid #D3D3D3'}}>
        <div className="col-1"><Icon name='paypal' style={{color:'red',fontSize:'24px'}}/></div>
        <div className="col-3"><h6>Online Payment</h6></div>
        <div className="col-3"><p>Aug 9,2022 at 9:08 PM</p></div>
        <div className="col-2"><p className='text-right' style={{fontWeight:'bold'}}>Payment</p></div>
        <div className="col-2"><p className='text-danger text-right'>$70</p></div>
        <div className="col-1"><Icon name='three-dots-vertical' /></div>
</div>
<div className="row" style={{alignItems:'baseline',borderBottom:'1px solid #D3D3D3'}}>
        <div className="col-1"><Icon name='credit-card-2-back' style={{color:'red',fontSize:'24px'}}/></div>
        <div className="col-3"><h6>Pay Pay Clothes</h6></div>
        <div className="col-3"><p>Aug 9,2022 at 9:08 PM</p></div>
        <div className="col-2"><p className='text-right' style={{fontWeight:'bold'}}>Payment</p></div>
        <div className="col-2"><p className='text-success text-right' style={{fontWeight:'bold'}}>$70</p></div>
        <div className="col-1"><Icon name='three-dots-vertical' /></div>
</div>
    </div>

  )
}

export default History