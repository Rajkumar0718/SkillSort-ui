import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { authHeader, errorHandler } from '../../api/Api';
import { toastMessage } from '../../utils/CommonUtils';
import url from '../../utils/UrlConstant';
import { isEmpty, isRoleValidation, isValidEmail, isValidSmtpHost } from '../../utils/Validation';
import '../SuperAdmin/SuperAdmin.css';
import FormHelperText from '@mui/material/FormHelperText';


const SMTPConfig = () => {
    const [smtpConfig, setSmtpConfig] = useState({
        smtpUserName: '',
        smtpPassword: '',
        smtpHost: '',
        smtpPort: '',
        status: 'ACTIVE',
    });

    const [disabled, setDisabled] = useState(false);
    const [update, setUpdate] = useState(true);
    const [error, setError] = useState({
        smtpUserName: false,
        smtpPassword: false,
        smtpHost: false,
        smtpPort: false,
        smtpUserNameErrorMsg: '',
        smtpPasswordErrorMsg: '',
        smtpHostErrorMsg: '',
        smtpPortErrorMsg: '',
    });

    useEffect(() => {
        const api = isRoleValidation() === 'COLLEGE_ADMIN' ? `${url.COLLEGE_API}/smtp/config` : `${url.ADMIN_API}/smtp/config`;
        axios.get(api, { headers: authHeader() })
            .then((res) => {
                if (res.data.response !== null) {
                    setSmtpConfig(res.data.response);
                } else {
                    setUpdate(false);
                }
            })
            .catch(() => {
                setUpdate(false);
            });
    }, []);

    const handleChange = (event, key) => {
        if (key === 'smtpPort' && event.target.value > 9999) {
            const newError = { ...error };
            newError.smtpPort = true;
            newError.smtpPortErrorMsg = 'Not a Valid SMTP Port';
            setError(newError);
        } else {
            const newSmtpConfig = { ...smtpConfig };
            const newError = { ...error };
            newError[key] = false;
            newSmtpConfig[key] = event.target.value;
            setSmtpConfig(newSmtpConfig);
            setError(newError);
        }
    };

    const handleSmtpHost = (event, key) => {
        if (isValidSmtpHost(event.target.value)) {
            const newSmtpConfig = { ...smtpConfig };
            newSmtpConfig[key] = event.target.value;
            setSmtpConfig(newSmtpConfig);
        }
    };

    const handleSubmit = (event) => {
        const newError = { ...error };
        if (isEmpty(smtpConfig.smtpUserName) || !isValidEmail(smtpConfig.smtpUserName)) {
            newError.smtpUserName = true;
            newError.smtpUserNameErrorMsg = isEmpty(smtpConfig.smtpUserName) ? 'Field Required !' : 'Enter a valid SMTP Username';
        } else {
            newError.smtpUserName = false;
        }
        ['smtpPassword', 'smtpHost', 'smtpPort'].forEach((key) => {
            if (isEmpty(smtpConfig[key])) {
                newError[key] = true;
                newError[`${key}ErrorMsg`] = 'Field Required !';
            } else {
                newError[key] = false;
            }
        });

        setDisabled(true);
        axios.post((isRoleValidation() === 'COLLEGE_ADMIN' ? `${url.COLLEGE_API}/smtp/save` : `${url.ADMIN_API}/smtp/save`), smtpConfig, { headers: authHeader() })
            .then(() => {
                toastMessage('success', 'SMTP Configured Successfully..!');
                setDisabled(false);
            })
            .catch((errorResponse) => {
                setDisabled(false);
                errorHandler(errorResponse);
            });

        event.preventDefault();
    };
    const smtpConfigFields = [
        { label: 'SMTP User Name', name: 'smtpUserName', type: 'text', placeholder: 'Enter SMTP Username', value: smtpConfig.smtpUserName },
        { label: 'SMTP Password', name: 'smtpPassword', type: 'password', placeholder: 'Enter SMTP Password', value: smtpConfig.smtpPassword },
        { label: 'SMTP Host', name: 'smtpHost', type: 'password', placeholder: 'Enter SMTP Host', value: smtpConfig.smtpHost },
        { label: 'SMTP Port', name: 'smtpPort', type: 'password', placeholder: 'Enter SMTP Port', value: smtpConfig.smtpPort },

    ];


    return (
        <>
            <main className="main-content bcg-clr">
                <div>
                    <div className="container-fluid cf-1">
                        <div className="card-header-new">
                            <span>
                                SMTP Configuration
                            </span>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="table-border">
                                    <form className="email-compose-body" onSubmit={handleSubmit}>
                                        <div className="send-header">
                                            <div className="row" style={{ marginLeft: "1px" }} >
                                                {smtpConfigFields.map((field, index) => (
                                                    <div className="col-lg-6 col-6 col-sm-6 col-md-6 col-xl-6" key={index}>
                                                        <div className="row" style={{ lineHeight: '2.5rem' }}>
                                                            <div className="col-4 col-sm-4 col-md-4 col-lg-4">
                                                                <label className="form-label input-label" htmlFor={field.name}>{field.label}<span className='required'></span>
                                                                    <FormHelperText className="helper" style={{ paddingLeft: "0px", color: 'red' }}>{error[field.name] ? error[field.name + 'ErrorMsg'] : null}</FormHelperText>
                                                                </label></div>
                                                            <div className="col-8 col-sm-8 col-md-8 col-lg-8 col-xl-8">
                                                                <input type={field.type} className="profile-page" onChange={(e) => handleChange(e, field.name)} value={field.value || ''} name='name' autoComplete="off" placeholder={field.placeholder} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                            </div>
                                            <div className="form-group row" >
                                                <div className="col-md-11 col-lg-11 col-sm-11 col-11" style={{ paddingRight: '2.5rem' }}>
                                                    <button disabled={disabled} style={{ float: 'right' }} type="submit" className="btn btn-primary">
                                                        {update === false ? "Add" : "Update"}
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
    )
}
export default SMTPConfig;