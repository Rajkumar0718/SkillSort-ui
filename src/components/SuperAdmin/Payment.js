import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { authHeader, errorHandler } from '../../api/Api';
import { toastMessage } from '../../utils/CommonUtils';

const Payment = () => {
    const [amount, setAmount] = useState('');
    const [hour, setHour] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [recruiterId, setRecruiterId] = useState('');
    const [id, setId] = useState('');

    const handleChange = (e, key) => {
        if (key === 'hour') {
            setHour(e.target.value);
        } else if (key === 'amount') {
            setAmount(e.target.value);
        }
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        const recruiterId = user.id;
        setRecruiterId(recruiterId);

        axios.get(`/api1/payment/get?recruiterId=${recruiterId}`, { headers: authHeader() })
            .then(res => {
                if (res.data.payload !== null) {
                    setAmount(res.data.payload.amount);
                    setHour(res.data.payload.hour);
                    setId(res.data.payload.id);
                }
            })
            .catch(error => {
                errorHandler(error);
            });
    }, []);

    const handleSubmit = event => {
        event.preventDefault();

        axios.post(`/api1/payment/save`, { amount, hour, recruiterId, id }, { headers: authHeader() })
            .then(res => {
                toastMessage('success', 'Added Successfully..!');
            })
            .catch(error => {
                errorHandler(error);
            });
    };

        return (
            <main className="main-content bcg-clr">
                <div>
                    <div className="container-fluid cf-1">
                        <div className="card-header-new">
                            <span>
                                Payment Option
                            </span>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="table-border-cr">
                                    <form className="email-compose-body" onSubmit={handleSubmit}>
                                        <div className="send-header">
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <h6 className="mb-0">Total hours</h6>
                                                </div>
                                                <div className="col-sm-9 text-secondary">
                                                    <input type='number' style={{ marginTop: '0px', marginBottom: '0px', height: '30px', width: '250px', opacity: '0.5' }} value={hour} placeholder='Total hours' onChange={(e) => handleChange(e, 'hour')}></input>
                                                </div>
                                            </div>
                                            <hr className='payment-hr-tag'></hr>
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <h6 className="mb-0">Charge per hour</h6>
                                                </div>
                                                <div className="col-sm-9 text-secondary">
                                                    <input type='number' style={{ marginTop: '0px', marginBottom: '0px', height: '30px', width: '250px', opacity: '0.5' }} value={amount} placeholder='Enter amount' onChange={(e) => handleChange(e, 'amount')}></input>
                                                </div>
                                            </div>
                                            <hr className='payment-hr-tag'></hr>
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <h6 className="mb-0">Total Charge</h6>
                                                </div>
                                                <div className="col-sm-9 text-secondary">
                                                    <input type='number' style={{ marginTop: '0px', marginBottom: '0px', height: '30px', width: '250px', opacity: '0.5' }} value={hour * amount}></input>
                                                </div>
                                            </div>
                                            <hr className='payment-hr-tag'></hr>
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <h6 className="mb-0">Payment mode</h6>
                                                </div>
                                                <div className="col-sm-9 text-secondary">
                                                    <i className="fa fa-university" aria-hidden="true"> select bank</i>
                                                </div>
                                            </div>
                                            <hr className='payment-hr-tag'></hr>
                                        </div>
                                        <div className="form-group row" style={{float:"left"}}>
                                            <button type="submit" className="btn btn-primary" style={{ marginLeft: '12px' }}>Send</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    export default Payment;
