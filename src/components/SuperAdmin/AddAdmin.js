import FormHelperText from '@mui/material/FormHelperText';
import axios from 'axios';
import _ from 'lodash';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { authHeader, errorHandler } from '../../api/Api';
import { toastMessage, withLocation } from '../../utils/CommonUtils';
import { url } from '../../utils/UrlConstant';
import { isEmpty, isValidEmail, isValidMobileNo } from "../../utils/Validation";
import './SuperAdmin.css';
import StatusRadioButton from '../../common/StatusRadioButton';



class AddAdmin extends Component {
  state = {
    admin: {
      userName: '',
      email: '',
      phone: '',
      company: {},
      status: 'ACTIVE',
      companies: [],
      disabled: false
    },
    error: {
      email: false,
      emailErrorMessage: "",
      phone: false,
      phoneErrorMessage: "",
      userName: false,
      userNameErrorMessage: "",
      company: false,
      companyErrorMessage: "",
    },
    readOnly: {
      status: true
    }
  }

  handleChange = (event, key) => {
    const { admin, error } = this.state
    key === 'email' ? admin[key] = event.target.value.trim() : admin[key] = event.target.value
    error[key] = false
    this.setState({ admin, error });
  }

  handleObjChange = (index, key) => {
    const { admin, error } = this.state
    admin[key] = this.state.admin.companies[index.target.value]
    error[key] = false
    this.setState({ admin, error })
  }

  handleSubmit = (event) => {
    const { admin, error } = this.state
    if (isEmpty(admin.email?.trim()) || !isValidEmail(admin.email)) {
      error.email = true;
      error.emailErrorMessage = isEmpty(admin.email) ? "Field Required !" : "Enter valid Input";
      this.setState({ error })
    } else {
      error.email = false;
      this.setState({ error })
    }
    if (isEmpty(admin.phone) || !isValidMobileNo(admin.phone)) {
      error.phone = true;
      error.phoneErrorMessage = isEmpty(admin.phone) ? "Field Required !" : "Enter valid Input";
      this.setState({ error })
    } else {
      error.phone = false;
      this.setState({ error })
    }
    if (isEmpty(admin.userName?.trim())) {
      error.userName = true;
      error.userNameErrorMessage = isEmpty(admin.userName) ? "Field Required !" : "Enter valid Input";
      this.setState({ error })
    } else {
      error.userName = false;
      this.setState({ error })
    }
    if (admin.company.id === null) {
      error.company = true;
      error.companyErrorMessage = "Select Company";
      this.setState({ error })
    } else {
      error.company = false;
      this.setState({ error })
    }
    event.preventDefault();
    if (!error.email && !error.phone && !error.userName && !error.company) {
      this.setState({ disabled: true })
      axios.post(` ${url.ADMIN_API}/admin/save`, this.state.admin, { headers: authHeader() })
        .then(() => {
          if (this.props.location.pathname.indexOf('edit') > -1) {
            toastMessage('success', 'Company Admin Details Updated Successfully..!');
            this.props.navigate('/companyadmin/admin')
          } else {
            toastMessage('success', 'Company Admin Added Successfully..!');
            this.resetAdminForm();
            this.props.navigate('/companyadmin/admin')
          }
        })
        .catch(err => {
          this.setState({ disabled: false })
          errorHandler(err)
        })
    }
  }

  resetAdminForm() {
    this.setState({
      userName: '',
      email: '',
      phone: '',
      company: ''
    })
  }

  componentDidMount() {
    axios.get(` ${url.ADMIN_API}/company/get-company`, { headers: authHeader() })
      .then((res) => {
        this.setState(prevState => {
          let admin = { ...prevState.admin };
          admin.companies = res.data.response;
          return { admin };
        })
      })
      .catch((error) => {
        errorHandler(error);
      });
  }

  componentWillMount() {
    if (this.props.location.pathname.indexOf('edit') > -1) {
      const { Admin } = this.props.location.state
      this.setState(prevState => {
        let admin = { ...prevState.admin };
        admin.id = Admin.id;
        admin.authId = Admin.authId;
        admin.userName = Admin.userName;
        admin.email = Admin.email;
        admin.company = Admin.company;
        admin.phone = Admin.phone;
        admin.status = Admin.status;
        return { admin };
      });
    }
  }

  render() {
    let action = null;
    if (this.props.location.pathname.indexOf('edit') > -1) {
      action = this.props.location.state;
    }
    return (
      <main className="main-content bcg-clr">
        <div>
          <div className="container-fluid cf-1">
            <div className="card-header-new">
              <span>
                {action !== null ? 'Update' : 'Add'} Admin
              </span>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="table-border-cr">
                  <form className="email-compose-body" onSubmit={this.handleSubmit}>
                    <div className="send-header">
                      <div className="row">
                        <div className="col-2">
                          <label className="form-label input-label" for="inputSection">User Name<span className='required'></span>
                            <FormHelperText className="helper" style={{ paddingLeft: "0", marginTop: '5px' }}>{this.state.error.userName ? this.state.error.userNameErrorMessage : null}</FormHelperText></label>
                        </div>
                        <div className='col-4'>
                          <input className="profile-page" onChange={(e) => this.handleChange(e, 'userName')}
                            value={this.state.admin.userName}
                            name='name' id='section' autoComplete="off" maxLength="50" type="text" placeholder='Enter User Name' />
                        </div>
                        <div className="col-2">
                          <label className="form-label input-label" for="inputSection">Email<span className='required'></span>
                            <FormHelperText className="helper" style={{ paddingLeft: '0', marginTop: '5px' }}>{this.state.error.email ? this.state.error.emailErrorMessage : null}</FormHelperText></label>
                        </div>
                        <div className='col-4'>
                          <input className="profile-page" onChange={(e) => this.handleChange(e, 'email')}
                            value={this.state.admin.email}
                            name='name' id='section' autoComplete="off" type="text" maxLength="254" placeholder='Enter Email' />

                        </div>
                      </div>
                      <div className='row'>
                        <div className="col-2">
                          <label className="form-label input-label" for="inputSection">Phone<span className='required'></span>
                            <FormHelperText className="helper" style={{ paddingLeft: "0", marginTop: '5px' }}>{this.state.error.phone ? this.state.error.phoneErrorMessage : null}</FormHelperText></label>
                        </div>
                        <div className='col-4'>
                          <input className="profile-page" onChange={(e) => this.handleChange(e, 'phone')}
                            value={this.state.admin.phone}
                            name='name' id='section' autoComplete="off" type="number" placeholder='Enter Phone' maxLength="12" />
                        </div>
                        <div className="col-2">
                          <label className="form-label input-label" for="inputSection">Company<span className='required'></span>
                            <FormHelperText className="helper" style={{ paddingLeft: "0", marginTop: '5px' }}>{this.state.error.company ? this.state.error.companyErrorMessage : null}</FormHelperText></label>
                        </div>
                        <div className='col-4'>
                          {action == null ?
                            <select className='profile-page' style={{ marginTop: '5px' }} value={_.findIndex(this.state.admin.companies, { "name": this.state.admin.company?.name })}
                              onChange={(e) => this.handleObjChange(e, 'company')} >
                              <option hidden selected value="" >Select Company</option>
                              {this.state.admin.companies.map((company, index) => {
                                return <option value={index}>{company.name}</option>
                              })}
                            </select> : <input className="profile-page" readOnly={true}
                              value={this.state.admin.company.name}
                            />
                          }

                        </div>

                      </div>
                    </div>
                    <div className='row'>
                      <div className="col-2 col-sm-3 col-md-2 col-lg-2">
                        <label style={{ padding: "0px" }} className="form-label input-label">
                          Status
                        </label>
                      </div>
                      <div className="col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9">
                        <div className="d-flex align-items-center ml-3 radio">
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              id="active"
                              type="radio"
                              onChange={(e) => this.handleChange(e, "status")}
                              value="ACTIVE"
                              name="status"
                              checked={this.state.admin.status === "ACTIVE" || this.state.admin.status === ""}
                            />
                            <label className="form-check-label" for="active">
                              Active
                            </label>
                          </div>
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              id="inactive"
                              type="radio"
                              onChange={(e) => this.handleChange(e, "status")}
                              value="INACTIVE"
                              name="status"
                              checked={this.state.admin.status === "INACTIVE"}
                            />
                            <label className="form-check-label" for="inactive">
                              Inactive
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className='row' style={{ float: "right", paddingRight: '7rem' }}>
                          <div className='col-lg-6 col-sm-6 xol-md-6'>
                            <button type="submit" disabled={this.state.disabled} className="btn btn-sm btn-prev" style={{ marginLeft: '10px' }}>{action !== null ? 'Update' : 'Add'}</button>
                          </div>
                          <div className='col-lg-6 col-sm-6 xol-md-6'>
                            <Link className="btn btn-sm btn-nxt" to="/companyadmin/admin">Cancel</Link>
                          </div>
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
    );
  }
}
export default withLocation(AddAdmin)