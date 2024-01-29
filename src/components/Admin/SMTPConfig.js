import FormHelperText from '@mui/material/FormHelperText';
import axios from 'axios';
import React, { Component } from "react";
import { authHeader, errorHandler } from '../../api/Api';
import { toastMessage } from '../../utils/CommonUtils';
import { url } from '../../utils/UrlConstant';
import { isEmpty, isRoleValidation, isValidEmail, isValidSmtpHost } from "../../utils/Validation";
import '../SuperAdmin/SuperAdmin.css';

export default class SMTPConfig extends Component {

    constructor(props) {
        super(props);
        this.state = {
            smtpConfig: {
                smtpUserName: '',
                smtpPassword: '',
                smtpHost: '',
                smtpPort: '',
                status: 'ACTIVE',
            },
            disabled: false,
            update: true,
            error: {
                smtpUserName: false,
                smtpPassword: false,
                smtpHost: false,
                smtpPort: false,
                smtpUserNameErrorMsg: '',
                smtpPasswordErrorMsg: '',
                smtpHostErrorMsg: '',
                smtpPortErrorMsg: ''
            }
        }
    }

    componentDidMount() {
        const api = isRoleValidation() === 'COLLEGE_ADMIN' ? `${url.COLLEGE_API}/smtp/config` : ` ${url.ADMIN_API}/smtp/config`;
        axios.get(api, { headers: authHeader() })
            .then(res => {
                if (res.data.response !== null) {
                    this.setState({ smtpConfig: res.data.response })
                }
                else {
                    this.setState({ update: false });
                }
            })
            .catch(() => {
                this.setState({ update: false });
            })
    }

    handleChange = (event, key) => {
        if (key === 'smtpPort' && event.target.value > 9999) {
            const { error } = this.state
            error.smtpPort = true
            error.smtpPortErrorMsg = 'Not a Valid SMTP Port'
            this.setState({ error })
        } else {
            const { smtpConfig, error } = this.state;
            error[key] = false
            smtpConfig[key] = event.target.value
            this.setState({ smtpConfig, error })
        }
    }

    handleSmtpHost = (event, key) => {
        if (isValidSmtpHost(event.target.value)) {
            const { smtpConfig } = this.state;
            smtpConfig[key] = event.target.value
            this.setState({ smtpConfig })
        }
    }

    handleSubmit = (event) => {
        const { smtpConfig, error } = this.state
        if (isEmpty(smtpConfig.smtpUserName) || !isValidEmail(smtpConfig.smtpUserName)) {
            error.smtpUserName = true;
            error.smtpUserNameErrorMsg = isEmpty(smtpConfig.smtpUserName) ? "Field Required !" : "Enter a valid SMTP Username";
            this.setState({ error })
        } else {
            error.smtpUserName = false;
            this.setState({ error })
        }
        if (isEmpty(smtpConfig.smtpPassword)) {
            error.smtpPassword = true;
            error.smtpPasswordErrorMsg = "Field Required !";
            this.setState({ error })
        } else {
            error.smtpPassword = false;
            this.setState({ error })
        }
        if (isEmpty(smtpConfig.smtpHost)) {
            error.smtpHost = true;
            error.smtpHostErrorMsg = "Field Required !";
            this.setState({ error })
        } else {
            error.smtpHost = false;
            this.setState({ error })
        }
        if (isEmpty(smtpConfig.smtpPort)) {
            error.smtpPort = true;
            error.smtpPortErrorMsg = "Field Required !";
            this.setState({ error })
        } else {
            error.smtpPort = false;
            this.setState({ error })
        }
        event.preventDefault();
        if (!error.smtpUserName && !error.smtpPassword && !error.smtpHost && !error.smtpPort) {
            this.setState({ disabled: true })
            axios.post((isRoleValidation() === 'COLLEGE_ADMIN' ? `${url.COLLEGE_API}/smtp/save` : `${url.ADMIN_API}/smtp/save`), this.state.smtpConfig, { headers: authHeader() })
                .then(_res => {
                    toastMessage('success', 'SMTP Configured Successfully..!');
                    this.setState({ disabled: false })
                })
                .catch(errorResponse => {
                    this.setState({ disabled: false })
                    errorHandler(errorResponse);
                })
        }
    }

    render() {
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
                                        <form className="email-compose-body" onSubmit={this.handleSubmit}>
                                            <div className="send-header">
                                                <div className="row" >
                                                    <div className="col-lg-6 col-6 col-sm-6 col-md-6 col-xl-6">
                                                        <div className="row" style={{ lineHeight: '2.5rem' }}>
                                                            <div className="col-4 col-sm-4 col-md-4 col-lg-4">
                                                                <label className="form-label input-label" for="inputSection">SMTP User Name<span className='required'></span>
                                                                    <FormHelperText className="helper" style={{ paddingLeft: "0px", color: 'red' }}>{this.state.error.smtpUserName ? this.state.error.smtpUserNameErrorMsg : null}</FormHelperText>
                                                                </label></div>
                                                            <div className="col-8 col-sm-8 col-md-8 col-lg-8 col-xl-8">
                                                                <input type="text" className="profile-page" onChange={(e) => this.handleChange(e, 'smtpUserName')}
                                                                    value={this.state.smtpConfig.smtpUserName || ''} name='name' maxLength="254" autoComplete="off" placeholder='Enter SMTP Username' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6 col-6 col-sm-6 col-md-6 col-xl-6">
                                                        <div className="row">
                                                            <div className="col-4 col-sm-4 col-md-4 col-lg-4">
                                                                <label className="form-label input-label" for="inputSection">SMTP Password<span className='required'></span>
                                                                    <FormHelperText className="helper" style={{ paddingLeft: "0px", color: 'red' }}>{this.state.error.smtpPassword ? this.state.error.smtpPasswordErrorMsg : null}</FormHelperText>
                                                                </label></div>
                                                            <div className="col-8 col-sm-8 col-md-8 col-lg-8 col-xl-8">
                                                                <input type="password" className="profile-page" onChange={(e) => this.handleChange(e, 'smtpPassword')} value={this.state.smtpConfig.smtpPassword || ''} name='name' autoComplete="off" maxLength="50" placeholder='Enter SMTP Password' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6 col-6 col-sm-6 col-md-6 col-xl-6">
                                                        <div className="row">
                                                            <div className="col-4 col-sm-4 col-md-4 col-lg-4">
                                                                <label className="form-label input-label" for="inputSection">SMTP Host<span className='required'></span>
                                                                    <FormHelperText className="helper" style={{ paddingLeft: "0px", color: 'red' }}>{this.state.error.smtpHost ? this.state.error.smtpHostErrorMsg : null}</FormHelperText>
                                                                </label></div>
                                                            <div className="col-8 col-sm-8 col-md-8 col-lg-8 col-xl-8">
                                                                <input type="text" className="profile-page" autoComplete="off"
                                                                    onChange={(e) => this.handleSmtpHost(e, 'smtpHost')} value={this.state.smtpConfig.smtpHost || ''}
                                                                    name='name' maxLength="50" placeholder='Enter SMTP Host' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6 col-6 col-sm-6 col-md-6 col-xl-6">
                                                        <div className="row">
                                                            <div className="col-4 col-sm-4 col-md-4 col-lg-4">
                                                                <label className="form-label input-label" for="inputSection">SMTP Port<span className='required'></span>
                                                                    <FormHelperText className="helper" style={{ paddingLeft: "0px", color: 'red' }}>{this.state.error.smtpPort ? this.state.error.smtpPortErrorMsg : null}</FormHelperText>
                                                                </label></div>
                                                            <div className="col-8 col-sm-8 col-md-8 col-lg-8 col-xl-8">
                                                                <input type="number" className="profile-page"
                                                                    onChange={(e) => this.handleChange(e, 'smtpPort')} value={this.state.smtpConfig.smtpPort || ''}
                                                                    name='name' placeholder='Enter SMTP Port' autoComplete="off" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* <div className="mc-3" style={{paddingLeft:"5rem"}}>
                                                    <div>
                                                        <label className="form-label-row">Status:</label>
                                                    </div>
                                                    <div className="custom-control custom-radio custom-control-inline ml-3 radio">
                                                        <input className="custom-control-input"
                                                            id="active"
                                                            type="radio"
                                                            onChange={(e) => this.handleChange(e, 'status')}
                                                            value="ACTIVE" name="status"
                                                            checked={this.state.smtpConfig.status === "ACTIVE" || this.state.smtpConfig.status === ""} />
                                                        <label
                                                            className="custom-control-label"
                                                            for="active"
                                                        >
                                                            Active
                                                        </label>
                                                    </div>
                                                    <div className="custom-control custom-radio custom-control-inline ml-3 radio">
                                                        <input className="custom-control-input"
                                                            id="inactive"
                                                            type="radio"
                                                            onChange={(e) => this.handleChange(e, 'status')}
                                                            value="INACTIVE" name="status"
                                                            checked={this.state.smtpConfig.status === "INACTIVE"} />
                                                        <label
                                                            className="custom-control-label"
                                                            for="inactive"
                                                        >
                                                            Inactive
                                                        </label>
                                                    </div>
                                                </div> */}
                                                </div>
                                                <div className="form-group row" >
                                                    <div className="col-md-11 col-lg-11 col-sm-11 col-11" style={{ paddingRight: '2.5rem' }}>
                                                        <button disabled={this.state.disabled} style={{ float: 'right' }} type="submit" className="btn btn-primary">
                                                            {this.state.update === false ? "Add" : "Update"}
                                                        </button>
                                                        {/* <Link className="btn btn-default" to="/admin/dashboard">Cancel</Link> */}
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
}