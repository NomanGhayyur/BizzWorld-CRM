import React from 'react'
import './overview.module.css'
import { Icon, Dropdown } from 'elements';
import DateRangePickerComp from '../DateRangePicker/DateRange';




function Overview()  {

  return (
    <>
    <div className=' mt-3'>
        <h4 className='m-0'><strong>Overview</strong></h4> 
        <div className="row">
            <div className="col-lg-3 mt-0">
                <p>Monthly Account Statistics.</p>
            </div>
            <div className="col-lg-9 overview-btn text-right mb-0">

            <form className="" role="search">
                <DateRangePickerComp />

            </form>
            </div>
        </div>
        
    </div>
    </>
    
  )
}

export default Overview