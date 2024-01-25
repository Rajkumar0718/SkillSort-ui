import React, { useState, useEffect } from 'react';
import { FormHelperText } from '@mui/material';
import { isEmpty } from '../../utils/Validation';
import { authHeader, errorHandler } from '../../api/Api';
import { toastMessage } from '../../utils/CommonUtils';
import axios from 'axios';
import { url } from '../../utils/UrlConstant';

const FreeCredits = () => {
    const [freeCredits, setFreeCredits] = useState({
        id: '',
        test: '',
        interview: '',
        resume: '',
        validity: '',
    });

    const [disabled, setDisabled] = useState(false);

    const [error, setError] = useState({
        test: false,
        interview: false,
        resume: false,
        validity: false,
        simpleErrorMsg: '',
        mediumErrorMsg: '',
        complexErrorMsg: '',
    });

    const handleChange = (event, key) => {
        setFreeCredits((prevFreeCredits) => ({
            ...prevFreeCredits,
            [key]: event.target.value,
        }));

        setError((prevError) => ({
            ...prevError,
            [key]: false,
            simpleErrorMsg: '',
            mediumErrorMsg: '',
            complexErrorMsg: '',
        }));
    };

    useEffect(() => {
        axios
            .get(`${url.ADMIN_API}/freecredit`, { headers: authHeader() })
            .then((res) => {
                if (res.data.response) setFreeCredits(res.data.response);
            })
            .catch((err) => errorHandler(err));
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        const { test, interview, resume, validity } = freeCredits;

        setError({
            test: isEmpty(test),
            interview: isEmpty(interview),
            resume: isEmpty(resume),
            validity: isEmpty(validity),
            simpleErrorMsg: isEmpty(test) ? 'Field Required!' : '',
            mediumErrorMsg: isEmpty(interview) ? 'Field Required!' : '',
            complexErrorMsg: isEmpty(resume) ? 'Field Required!' : '',
            validityErrorMsg: isEmpty(validity) ? 'Field Required!' : '',
        });

        if (!isEmpty(test) && !isEmpty(interview) && !isEmpty(resume) && !isEmpty(validity)) {
            setDisabled(true);

            axios
                .post(`${url.ADMIN_API}/freecredit`, freeCredits, { headers: authHeader() })
                .then(() => {
                    setDisabled(false);
                    toastMessage('success', 'FreeCredits added Successfully');
                })
                .catch((errorResponse) => {
                    setDisabled(false);
                    errorHandler(errorResponse);
                });
        }
    };

    return (
        <div>
            <>
                <main className="main-content bcg-clr">
                    <div>
                        <div className="container-fluid cf-1">
                            <div className="card-header-new">
                                <span>
                                    FreeCredits
                                </span>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="table-border">
                                        <form className="email-compose-body" onSubmit={handleSubmit} >
                                            <div className="send-header">
                                                <div className="row" >
                                                    <div className="col-lg-6 col-6 col-sm-6 col-md-6 col-xl-6">
                                                        <div className="row" >
                                                            <div className="col-4 col-sm-4 col-md-4 col-lg-4" >
                                                                <label className="form-label input-label" for="inputSection">Test<span className='required'></span>
                                                                    <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{error.test ? error.simpleErrorMsg : null}</FormHelperText>
                                                                </label></div>
                                                            <div className="col-8 col-sm-8 col-md-8 col-lg-8 col-xl-8">
                                                                <input type="tel" className="profile-page" onChange={(e) => handleChange(e, 'test')} value={freeCredits.test}
                                                                    name='test' autoComplete="off" placeholder='Enter FreeCredits' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6 col-6 col-sm-6 col-md-6 col-xl-6">
                                                        <div className="row">
                                                            <div className="col-4 col-sm-4 col-md-4 col-lg-4">
                                                                <label className="form-label input-label" for="inputSection">Interview<span className='required'></span>
                                                                    <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{error.interview ? error.mediumErrorMsg : null}</FormHelperText>
                                                                </label></div>
                                                            <div className="col-8 col-sm-8 col-md-8 col-lg-8 col-xl-8">
                                                                <input type="tel" className="profile-page" onChange={(e) => handleChange(e, 'interview')} value={freeCredits.interview} name='interview' autoComplete="off" placeholder='Enter FreeCredits' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6 col-6 col-sm-6 col-md-6 col-xl-6">
                                                        <div className="row">
                                                            <div className="col-4 col-sm-4 col-md-4 col-lg-4">
                                                                <label className="form-label input-label" for="inputSection">Resume<span className='required'></span>
                                                                    <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{error.resume ? error.complexErrorMsg : null}</FormHelperText>
                                                                </label></div>
                                                            <div className="col-8 col-sm-8 col-md-8 col-lg-8 col-xl-8">
                                                                <input type="tel" className="profile-page" onChange={(e) => handleChange(e, 'resume')} value={freeCredits.resume} autoComplete="off"
                                                                    name='resume' placeholder='Enter FreeCredits' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6 col-6 col-sm-6 col-md-6 col-xl-6">
                                                        <div className="row">
                                                            <div className="col-4 col-sm-4 col-md-4 col-lg-4">
                                                                <label className="form-label input-label" for="inputSection">Validity In Days<span className='required'></span>
                                                                    <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{error.validity ? error.validityErrorMsg : null}</FormHelperText>
                                                                </label></div>
                                                            <div className="col-8 col-sm-8 col-md-8 col-lg-8 col-xl-8">
                                                                <input type="tel" className="profile-page" onChange={(e) => handleChange(e, 'validity')} value={freeCredits.validity} autoComplete="off"
                                                                    name='validity' placeholder='Enter Validity' />
                                                            </div>
                                                        </div>
                                                    </div>


                                                </div>
                                                <div className="form-group row" >
                                                    <div className="col-md-11 col-lg-11 col-sm-11 col-11" style={{ paddingRight: '2.5rem' }}>
                                                        <button disabled={disabled} style={{ float: 'right' }} type="submit" className="btn btn-sm btn-prev">{freeCredits.id ? "Update" : "Add"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </>
        </div>

    )
}

export default FreeCredits;