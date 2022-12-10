import React from 'react'
import Card from '../shared/Card'


const Earnings = () => {
  return (
    <div className=' mt-3'>
        <Card>
            <div className="row">
                <div className="recent-activities col-lg-12">
                    <div className="mt-2 row">
                        <div className="col-lg-10"><h4 className='text-center'><strong>Brand Wise Earnings</strong></h4></div>
                        {/* <div className="col-lg-2"><a href="">View all</a></div> */}
                    </div>
                    <div className="text-center">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                <th scope="col">#</th>
                                <th scope="col">Brand</th>
                                <th scope="col">Leads</th>
                                <th scope="col">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <th scope="row">1</th>
                                <td>Innova Design Hub</td>
                                <td>Bella</td>
                                <td>$ 50,000</td>
                                </tr>
                                <tr>
                                <th scope="row">2</th>
                                <td>Innova Design Hub 2</td>
                                <td>Alex</td>
                                <td>$ 30,500</td>
                                </tr>
                                <tr>
                                <th scope="row">3</th>
                                <td>Innova Design Hub 3</td>
                                <td>Jhon</td>
                                <td>$ 40,000</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Card>
    </div>
  )
}

export default Earnings