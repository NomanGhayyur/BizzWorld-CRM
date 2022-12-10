import React from 'react'
import { Icon } from 'elements';
import styles from './activities.module.css'
import Card from '../shared/Card';


const Activities = () => {
  return (
    <Card className='mt-3'>
            <div className="row">
                <div className={`recentactivities col-lg-12 ${styles.recentactivities}`}>
                    <div className="row">
                        <div className="col-lg-10">
                            <h4 className='text-center'><strong>Recent Project</strong></h4>
                            </div>
                        {/* <div className="col-lg-2"><a href="">View all</a></div> */}
                    </div>
                    <div className="text-center">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Date</th>
                                <th scope="col">Created by</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <th scope="row">1</th>
                                <td>CRM</td>
                                <td>2022 July 10</td>
                                <td>SYEDA A. Moiz</td>
                                </tr>
                                <tr>
                                <th scope="row">2</th>
                                <td>EMAIL</td>
                                <td>2022 July 20</td>
                                <td>NOORULAIN KHAN</td>
                                </tr>
                                <tr>
                                <th scope="row">3</th>
                                <td>HRM</td>
                                <td>2022 July 25</td>
                                <td>ALI RAZA</td>
                                </tr>
                                <tr>
                                <th scope="row">4</th>
                                <td>CHAT</td>
                                <td>2022 August 10</td>
                                <td>MAHA KHAN</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
    </Card>
  )
}

export default Activities