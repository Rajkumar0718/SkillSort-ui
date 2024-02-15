import FormHelperText  from '@mui/material/FormHelperText';
import axios from 'axios';
import React, { Component } from 'react';
import { authHeader, errorHandler } from '../../api/Api';
import { toastMessage, withLocation } from '../../utils/CommonUtils';
import url  from '../../utils/UrlConstant';
import { isEmpty, isRoleValidation, isValidEmail, isValidMobileNo } from '../../utils/Validation';

const role = isRoleValidation();
 class Profile extends Component {

    state = {
        admin: {
            company: {},
            email: '',
            phone: '',
            userName: '',
            id: '',
            authId: '',
            password: '',
            status: '',
        },
        logo: '',
        base64Logo: '',
        displayLogo: '',
        disable: false,
        error: {
            email: false,
            emailErrorMessage: "",
            phone: false,
            phoneErrorMessage: "",
            userName: false,
            userNameErrorMessage: "",
            company: false,
            companyErrorMessage: "",
            location: false,
            locationErrorMessage: ""
        }
    }

    componentWillMount() {
        let user = JSON.parse(localStorage.getItem("user"));
        let id = user.id;
        const value = role === "ADMIN" || role === "TRIAL_ADMIN" ?
            axios.get(`${url.ADMIN_API}/admin/profile?id=${id}`, { headers: authHeader() }) :
            axios.get(`${url.ADMIN_API}/hr/profile?id=${id}`, { headers: authHeader() });

        value.then(res => {
            this.setState({ admin: res.data.response }, () => this.getLogo())
        })
    }

    handleChange = (e, key) => {
        const { admin } = this.state
        if (key === 'admin') {
            admin[e.target.name] = e.target.value
        } else {
            admin.company[e.target.name] = e.target.value
        }
        this.setState({ admin })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const { admin, error } = this.state
        if (isEmpty(admin.email) || !isValidEmail(admin.email)) {
            error.email = true;
            error.emailErrorMessage = isEmpty(admin.email) ? "Field Required !" : "Enter a valid Email";
            this.setState({ error })
        } else {
            error.email = false;
            this.setState({ error })
        }
        if (isEmpty(admin.phone) || !isValidMobileNo(admin.phone)) {
            error.phone = true;
            error.phoneErrorMessage = isEmpty(admin.phone) ? "Field Required !" : "Enter a valid Phone Number";
            this.setState({ error })
        } else {
            error.phone = false;
            this.setState({ error })
        }
        if (isEmpty(admin.userName)) {
            error.userName = true;
            error.userNameErrorMessage = "Field Required !";
            this.setState({ error })
        } else {
            error.userName = false;
            this.setState({ error })
        } if (isEmpty(admin.company.location)) {
            error.location = true;
            error.locationErrorMessage = "Field Required !";
            this.setState({ error })
        } else {
            error.location = false;
            this.setState({ error })
        }
        if (!error.email && !error.phone && !error.userName && !error.company && !error.location) {
            this.setState({disable : true})
            axios.post(`${url.ADMIN_API}/admin/update`, this.state.admin, { headers: authHeader() })
                .then( res => {
                    this.updateCompany()
                    toastMessage('success', 'Profile Updated Successfully..!');
                    this.props.navigate(`/admin/vacancy`)
                })
                .catch(error => {
                    errorHandler(error);
                    this.setState({ disable: false })
                })
        }
    }

    updateCompany = () => {
        const company = this.state.admin.company
        const formData = new FormData();
        formData.append('company', JSON.stringify(company))
        formData.append('companyLogo', this.state.logo);
        axios.post(` ${url.ADMIN_API}/company/save`, formData, { headers: authHeader() })
            .then(res => { })
            .catch(error => {
                console.log('in company');
                errorHandler(error)
            })
    }

    uploadLogo = (event) => {
        this.setState({ logo: event.target.files[0], displayLogo: '' }, () => this.setDisplayLogo());
    }

    setDisplayLogo = () => {
        if (this.state.logo) {
            this.setState({ displayLogo: URL.createObjectURL(this.state.logo) });
        }
    }

    getLogo = () => {
        axios.get(`${url.ADMIN_API}/company/logo/${this.state.admin.company.id}`, { headers: authHeader() })
            .then(res => {
                this.setState({ base64Logo: res.data.message })
            })
            .catch(err => errorHandler(err))
    }

    render() {
        return (
            <div>
                <div className='row' style={{ margin: '1rem 2rem 0rem 2rem' }}>
                    <div className="col-6">
                        <h4>Profile Info
                        </h4>
                    </div>
                    <div className="col-6">
                        <h4>Company Info
                        </h4>
                    </div>
                </div>
                <div className="row" style={{ margin: '2rem' }} >
                    <div className='col-6'>
                        <form>
                            <div >
                                <label className="labels">User Name
                                    <FormHelperText className='helper helper-candidate'>{this.state.error.userName ? this.state.error.userNameErrorMessage : null}</FormHelperText></label>
                                <input type="text" name='userName' className="form-control" placeholder="User Name" onChange={(e) => this.handleChange(e, 'admin')} value={this.state.admin.userName}></input>
                            </div>
                            <div >
                                <label className="labels">Phone
                                    <FormHelperText className='helper helper-candidate'>{this.state.error.phone ? this.state.error.phoneErrorMessage : null}</FormHelperText></label>
                                <input type="text" name='phone' className="form-control" placeholder="phone number" onChange={(e) => this.handleChange(e, 'admin')} value={this.state.admin.phone} />
                            </div>
                            <div >
                                <label className="labels">Email</label>
                                <input readOnly={true} type="text" className="form-control" name='email' placeholder="email id" value={this.state.admin.email} />
                            </div>
                            <div>
                                <label className="labels">Company</label>
                                <input readOnly={true} type="text" className="form-control" placeholder="Company" value={this.state.admin.company.name} />
                            </div>
                        </form>

                    </div>
                    <div className='col-6'>
                        <form>
                            <div>
                                <label className="labels">Company Name</label>
                                <input type="text" readOnly={true} className="form-control" placeholder="User Name" value={this.state.admin.company.name}></input>
                            </div>
                            <div>
                                <label className="labels">Location
                                    <FormHelperText className='helper helper-candidate'>{this.state.error.location ? this.state.error.locationErrorMessage : null}</FormHelperText></label>
                                <input type="text" className="form-control" placeholder="phone number" name='location' onChange={(e) => this.handleChange(e, 'company')} value={this.state.admin.company.location} />
                            </div>
                            <div style={{ marginTop: '1rem' }}>
                                {this.state.displayLogo && <img style={{ width: '180px', height: '180px' }} alt='logo' src={this.state.displayLogo} ></img>}
                                {!this.state.displayLogo && this.state.base64Logo && <img style={{ width: '200px' }} alt='logo' src={`data:image/png;base64,${this.state.base64Logo}`} />}
                                <label for='files' className='btn btn-sm btn-prev' style={{ marginLeft: '20px' }}>{this.state.admin.company.companyLogo ? "Update Logo" : "Upload Logo"}</label>
                                <input type='file' id='files' style={{ visibility: 'hidden' }} accept="image/x-png,image/jpeg" onChange={(e) => this.uploadLogo(e)} />

                            </div>
                            <div className="mt-5 text-center">
                                <button className="btn btn-sm btn-nxt pull-right m-0" disabled={this.state.disable} onClick={this.handleSubmit} >Update Profile</button>
                            </div>
                        </form>
                    </div>
                </div >
            </div >
        );
    }
}
export default withLocation(Profile)
