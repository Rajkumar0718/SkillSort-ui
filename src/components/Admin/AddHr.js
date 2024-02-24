import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { authHeader, errorHandler } from '../../api/Api';
import { toastMessage, withLocation } from '../../utils/CommonUtils';
import { isEmpty, isValidEmail, isValidMobileNo } from "../../utils/Validation";
import { FormHelperText } from '@mui/material';
import url from '../../utils/UrlConstant';

class AddHr extends Component {
  state = {
    hr: {
      userName: '',
      qualification: '',
      experience: '',
      email: '',
      phone: '',
      status: 'ACTIVE',
      role: '',
      createdDate: '',
      createdBy: '',
      companyId: '',
    },
    disabled: false,
    error: {
      email: false,
      emailErrorMessage: "",
      phone: false,
      phoneErrorMessage: "",
      userName: false,
      userNameErrorMessage: "",
      company: false,
      companyErrorMessage: "",
      qualification: false,
      qualificationErrorMessage: "",
      experience: false,
      experienceErrorMessage: "",
      role: false,
      roleErrorMessage: ""
    }
  }

  handleChange = (event, key) => {
    if (key === "experience" && (event.target.value > 70 || event.target.value < 0)) {
      const { error } = this.state
      error.experience = true;
      error.experienceErrorMessage = "Enter a valid experience"
      this.setState({ error });
    } else {
      const { hr, error } = this.state || {}
      error[key] = false;
      hr[key] = event.target.value;
      this.setState({ hr, error });
    }
  }

  handleSubmit = event => {
    const { hr, error } = this.state
    if (isEmpty(hr.email) || !isValidEmail(hr.email)) {
      error.email = true;
      error.emailErrorMessage = isEmpty(hr.email) ? "Field Required !" : "Enter Valid Input";
      this.setState({ error })
    } else {
      error.email = false;
      this.setState({ error })
    }
    if (isEmpty(hr.phone) || !isValidMobileNo(hr.phone)) {
      error.phone = true;
      error.phoneErrorMessage = isEmpty(hr.phone) ? "Field Required !" : "Enter Valid Input";
      this.setState({ error })
    } else {
      error.phone = false;
      this.setState({ error })
    }
    if (isEmpty(hr.userName?.trim())) {
      error.userName = true;
      error.userNameErrorMessage = isEmpty(hr.userName) ? "Field Required !" : "Enter Valid Input";
      this.setState({ error })
    } else {
      error.userName = false;
      this.setState({ error })
    }
    if (isEmpty(hr.qualification?.trim())) {
      error.qualification = true;
      error.qualificationErrorMessage = isEmpty(hr.qualification) ? "Field Required !" : "Enter Valid Input";
      this.setState({ error })
    } else {
      error.qualification = false;
      this.setState({ error })
    }
    if (isEmpty(hr.experience)) {
      error.experience = true;
      error.experienceErrorMessage = "Field Required !";
      this.setState({ error })
    } else {
      error.experience = false;
      this.setState({ error })
    }
    if (isEmpty(hr.role)) {
      error.role = true;
      error.roleErrorMessage = "Select Role!";
      this.setState({ error })
    } else {
      error.role = false;
      this.setState({ error })
    }
    event.preventDefault();
    if (!error.email && !error.phone && !error.userName && !error.qualification) {
      this.setState({ disabled: true })
      axios.post(` ${url.ADMIN_API}/hr/save`, this.state.hr, { headers: authHeader() })
        .then(res => {
          if (this.props?.location?.pathname?.indexOf('edit') > -1) {
            toastMessage('success', 'HR User Details Updated Successfully..!');
            this.props.navigate('/admin/hr')
          } else {
            toastMessage('success', 'HR User Added Successfully..!');
            this.resetExamForm();
            this.props.navigate('/admin/hr')
          }
        })
        .catch(error => {
          this.setState({ disabled: false })
          errorHandler(error)
        })
    }
  }

  resetExamForm() {
    this.setState({
      userName: '',
      qualification: '',
      experience: '',
      email: '',
      phone: '',
      status: 'ACTIVE',
      role: '',
      createdDate: '',
      createdBy: '',
    })
  }

  componentWillMount() {
    if (this.props?.location?.pathname?.indexOf('edit') > -1) {
      const { Hr } = this.props?.location?.state
      this.setState(prevState => {
        let hr = { ...prevState.hr };
        hr.id = Hr.id;
        hr.userName = Hr.userName;
        hr.qualification = Hr.qualification;
        hr.experience = Hr.experience;
        hr.phone = Hr.phone;
        hr.status = Hr.status;
        hr.email = Hr.email;
        hr.companyId = Hr.companyId;
        hr.authId = Hr.authId;
        hr.role = Hr.role;
        hr.createdDate = Hr.createdDate;
        hr.createdBy = Hr.createdBy;
        return { hr };
      });
    }
  }



  render() {
    let action = null;
    if (this.props?.location?.pathname?.indexOf('edit') > -1) {
      action = this.props.location.state;
    }
    return (
      <main className="main-content bcg-clr">
        <div>
          <div className="container-fluid cf-1">
            <div className="card-header-new">
              <span>
                {action !== null ? 'Update' : 'Add'} HR User
              </span>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="table-border-cr">
                  <form className="email-compose-body" onSubmit={this.handleSubmit}>
                    <div className="send-header">
                      <div className="row">
                        <div className="col-2">
                          <label className="form-label input-label" for="inputSection">Name<span className='required'></span>
                            <FormHelperText style={{ paddingLeft: '0px' }} className="helper">{this.state.error.userName ? this.state.error.userNameErrorMessage : null}</FormHelperText></label>
                        </div>
                        <div className='col-4'>
                          <input type="text" onKeyDown={(e) => {
                            if (!/[a-zA-Z\s]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }} className="profile-page" onChange={(e) => this.handleChange(e, 'userName')}
                            value={this.state.hr.userName || ''} name='name' maxLength="50" id='section' autocomplete="new-username" placeholder='Enter Name' />
                        </div>
                        <div className='col-2'>
                          <label className="form-label input-label" for="inputSection">Qualification<span className='required'></span>
                            <FormHelperText className="helper helper-candidate">{this.state.error.qualification ? this.state.error.qualificationErrorMessage : null}</FormHelperText></label>
                        </div>
                        <div className='col-4'>
                          <input type="text" className="profile-page" onChange={(e) => this.handleChange(e, 'qualification')}
                            value={this.state.hr.qualification} name='name' maxLength="35" id='section' autocomplete="off" placeholder='Enter Qualification' />
                        </div>
                      </div>
                      <div className='row'>
                        <div className="col-2">
                          <label className="form-label input-label" for="inputSection">Email
                            <FormHelperText className="helper helper-candidate">{this.state.error.email ? this.state.error.emailErrorMessage : null}</FormHelperText></label>
                        </div>
                        <div className='col-4'>
                          <input type="email" className="profile-page"
                            onChange={(e) => this.handleChange(e, 'email')} value={this.state.hr.email}
                            name='name' maxLength="254" id='section' autocomplete="off" placeholder='Enter Email' />
                        </div>
                        <div className="col-2">
                          <label className="form-label input-label" for="inputSection">Phone Number<span className='required'></span>
                            <FormHelperText className="helper helper-candidate">{this.state.error.phone ? this.state.error.phoneErrorMessage : null}</FormHelperText></label>
                        </div>
                        <div className='col-4'>
                          <input className="profile-page"
                            onChange={(e) => this.handleChange(e, 'phone')} value={this.state.hr.phone}
                            name='name' id='section' autocomplete="off"  onKeyDown={(e) => {
                              if (!/[0-9]/.test(e.key) && ![8,  9,  13,  27,  37,  39].includes(e.keyCode)) {
                                  e.preventDefault();
                              }
                          }}  type="tel" maxLength="10" placeholder='Enter PhoneNumber' />
                        </div>
                      </div>
                      <div className='row'>
                        <div className="col-2">
                          <label className="form-label input-label" for="inputSection">Role<span className='required'></span>
                            <FormHelperText className='helper helper-candidate'>{this.state.error.role ? this.state.error.roleErrorMessage : null}</FormHelperText>
                          </label>
                        </div>
                        <div className='col-4'>
                          <select type="text" className="profile-page" onChange={(event) => this.handleChange(event, "role")} value={this.state.hr.role} defaultValue={""}>
                            <option value="">Select Role</option>
                            <option value="HR">HR Executive</option>
                            <option value="HR_MANAGER">HR MANAGER</option>
                          </select>
                        </div>
                        <div className='col-2' style={{ display: 'flex', width: '28rem', gap: '6.5rem' }}>
                          <label className="form-label input-label" for="inputSection">Status</label>
                          <div className="custom-control custom-radio custom-control-inline ml-3 radio" style={{ display: 'flex', alignItems: 'center', height: '2rem', gap: '0.5rem' }}>
                            <input className="custom-control-input"
                              id="active"
                              type="radio"
                              onChange={(e) => this.handleChange(e, 'status')}
                              value="ACTIVE" name="status"
                              checked={this.state.hr.status === "ACTIVE" || this.state.hr.status === ""} />
                            <label
                              className="custom-control-label"
                              for="active"
                            >
                              Active
                            </label>
                          </div>
                          <div className="custom-control custom-radio custom-control-inline ml-3 radio" style={{ display: 'flex', alignItems: 'center', height: '2rem', gap: '0.5rem' }}>
                            <input className="custom-control-input"
                              id="inactive"
                              type="radio"
                              onChange={(e) => this.handleChange(e, 'status')}
                              value="INACTIVE" name="status"
                              checked={this.state.hr.status === "INACTIVE"} />
                            <label
                              className="custom-control-label"
                              for="inactive"
                            >
                              Inactive
                            </label>
                          </div>
                        </div>

                      </div>
                      <div className="form-group row">
                        <div className="col-md-12">
                          <div className='row' style={{ float: "right", paddingRight: '7rem' }}>
                            <div className='col-lg-6 col-sm-6 xol-md-6'>
                              <button disabled={this.state.disabled} type="submit" className="btn btn-sm btn-prev" style={{ paddingRight: '0.5rem' }}>{action !== null ? 'Update' : 'Add'}</button>
                            </div>
                            <div className='col-lg-6 col-sm-6 xol-md-6'>
                              <Link className="btn btn-sm btn-nxt" to="/admin/hr">Cancel</Link>
                            </div>
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

export default withLocation(AddHr)