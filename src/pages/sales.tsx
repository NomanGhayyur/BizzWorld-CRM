import React from 'react'
import { Button, Input } from "elements";
import Card from "../components/shared/Card";
import styles from '../styles/sales.module.css';
function sales() {
    return (
        <div>

            <Card className='container mt-5'>
                <form>
                    <h3>Personal Info</h3>
                    <div className="row mt-3">
                        <div className="col-lg-5 col-12">
                            <Input className={`${styles.salesinputfields}`} name="name" type="floating" label="Name" />
                        </div>
                        <div className="col-lg-5 col-12">
                            <Input className={`${styles.salesinputfields}`} name="password" type="floating" label="Password" />
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-lg-5 col-12">
                            <Input className={`${styles.salesinputfields}`} name="email" type="floating" label="Email" />
                        </div>
                        <div className="col-lg-5 col-12">
                            <Input className={`${styles.salesinputfields}`} name="altemail" type="floating" label="Alt Email" />
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-lg-5 col-12">
                            <Input className={`${styles.salesinputfields}`} name="phone" type="floating" label="Phone" />
                        </div>
                        <div className="col-lg-5 col-12">
                            <Input className={`${styles.salesinputfields}`} name="altphone" type="floating" label="Alt Phone" />
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-lg-5 col-12">
                            <Input className={`${styles.salesinputfields}`} name="city" type="floating" label="City" />
                        </div>
                        <div className="col-lg-5 col-12">
                            <Input className={`${styles.salesinputfields}`} name="state" type="floating" label="State" />
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-lg-5 col-12">
                            <Input className={`${styles.salesinputfields}`} name="country" type="floating" label="Country" />
                        </div>
                        <div className="col-lg-5 col-12">
                            <Input className={`${styles.salesinputfields}`} name="zip" type="floating" label="Zip" />
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-lg-5 col-12">
                            <Input className={`${styles.salesinputfields}`} name="address" type="floating-textarea" label="Address" />
                        </div>
                    </div>

                    <div className="row mt-5">
                        <h3>Company Info</h3>
                        <div className="col-lg-5 col-12 mt-4">
                            <Input className={`${styles.salesinputfields}`} name="companyname" type="floating" label="Company Name" />
                        </div>
                        <div className="col-lg-5 col-12 mt-4">
                            <Input className={`${styles.salesinputfields}`} name="companyemail" type="floating" label="Company Email" />
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-lg-5 col-12">
                            <Input className={`${styles.salesinputfields}`} name="companywebsite" type="floating" label="Company Website" />
                        </div>
                        <div className="col-lg-5 col-12">
                            <Input className={`${styles.salesinputfields}`} name="companyphone" type="floating" label="Company Phone" />
                        </div>
                    </div>



                    <div className="row mt-3">
                        <div className="col-lg-5 col-12">
                            <Input className={`${styles.salesinputfields}`} name="otherdetails" type="floating-textarea" label="Other Details" />
                        </div>
                    </div>
                    <div className='text-left mt-3'>
                        <Button htmlType="submit">Submit</Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}

export default sales;
