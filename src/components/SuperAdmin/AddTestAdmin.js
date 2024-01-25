import FormHelperText from '@mui/material/FormHelperText';
import axios from 'axios';
import React, { Component } from 'react';
import { authHeader, errorHandler } from '../../api/Api';
import { toastMessage, withLocation } from '../../utils/CommonUtils';
import { url } from '../../utils/UrlConstant';
import { isEmpty, isValidEmail, isValidMobileNo, isValidName } from "../../utils/Validation";
import './SuperAdmin.css';
import StatusRadioButton from '../../common/StatusRadioButton';

class AddTestAdmin extends Component {
  constructor() {
    super();
    this.state = {
      testAdmin: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        authId: '',
        status: 'ACTIVE',
      },
      disabled: false,
      error: {
        firstName: false,
        firstNameErrorMessage: '',
        lastName: false,
        lastNameErrorMessage: '',
        email: false,
        emailErrorMessage: '',
        phone: false,
        phoneErrorMessage: '',
      }
    }
  }



  handleChange = (event, key) => {
    if (key === 'phone' && event.target.value.length > 10)
      return
    const { testAdmin, error } = this.state
    testAdmin[key] = event.target.value
    error[key] = false
    this.setState({ testAdmin, error });

  }

  handleSubmit = (company) => {
    const { testAdmin, error } = this.state
    if (isEmpty(testAdmin.firstName?.trim()) || !isValidName(testAdmin.firstName)) {
      error.firstName = true;
      error.firstNameErrorMessage = isEmpty(testAdmin.firstName) ? "Field Required !" : "Enter Valid Input";
      this.setState({ error })
    } else {
      error.firstName = false;
      this.setState({ error })
    }
    if (isEmpty(testAdmin.lastName?.trim()) || !isValidName(testAdmin.lastName)) {
      error.lastName = true;

      error.lastNameErrorMessage = isEmpty(testAdmin.lastName) ? "Field Required !" : "Enter Valid Input";
      this.setState({ error })
    } else {
      error.firstName = false;
      this.setState({ error })
    }

    if (isEmpty(testAdmin.email) || !isValidEmail(testAdmin.email)) {
      error.email = true;
      error.emailErrorMessage = isEmpty(testAdmin.email) ? "Field Required" : "Enter Valid Input";
      this.setState({ error })
    } else {
      error.email = false;
      this.setState({ error })
    }

    if (isEmpty(testAdmin.phone) || !isValidMobileNo(testAdmin.phone)) {
      error.phone = true;
      error.phoneErrorMessage = "Enter valid number !";
      this.setState({ error })
    } else {
      error.phone = false;
      this.setState({ error })
    }
    company.preventDefault();
    if (!error.firstName && !error.lastName && !error.email && !error.phone) {
      this.setState({ disabled: true })
      axios.post(` ${url.ADMIN_API}/testadmin/save`, this.state.testAdmin, { headers: authHeader() })
        .then(res => {
          if (this.props.location.pathname.indexOf('edit') > -1) {
            toastMessage('success', 'Test Admin Details Updated Successfully..!');
          } else {
            toastMessage('success', 'Test Admin Added Successfully..!');
          }
          this.props.navigate('/skillsortadmin/testadmin');
        })
        .catch(error => {
          this.setState({ disabled: false })
          errorHandler(error);
        })
    }
  }

  componentWillMount() {
    if (this.props.location.pathname.indexOf('edit') > -1) {
      let testAdmin = this.props.location.state.testAdmin;
      let testData = this.state.testAdmin;
      testData.id = testAdmin.id;
      testData.authId = testAdmin.authId;
      testData.firstName = testAdmin.firstName;
      testData.lastName = testAdmin.lastName;
      testData.email = testAdmin.email;
      testData.phone = testAdmin.phone;
      testData.password = testAdmin.password;
      testData.status = testAdmin.status;
      this.setState({ testAdmin: testData });
    }
  }

  render() {
    let action = null;
    if (this.props.location.pathname.indexOf('edit') > -1) {
      action = this.props.location.state.action;
    }
    return (
      <main className="main-content bcg-clr">
        <div>
          <div className="container-fluid cf-1">
            <div className="card-header-new">
              <span>{action !== null ? 'Update' : 'Add'} Test Admin</span>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="table-border-cr">
                  <form className="email-compose-body" onSubmit={this.handleSubmit}>
                    <div className="send-header">
                      <div className="row">
                        <div className="col-lg-6 col-6 col-sm-6 col-xl-6">
                          <div className='row'>
                            <div className="col-lg-3 col-3 col-sm-3 col-xl-3">
                              <label className="form-label text-input-label" for="inputSection">First Name<span className='required'></span></label></div>
                            <div className="col-lg-9 col-9 col-sm-9 col-xl-9">
                              <input className="profile-page" onChange={(e) => this.handleChange(e, 'firstName')}
                                value={this.state.testAdmin.firstName}
                                name='firstname' id='testAdmin' autoComplete="off" maxLength="50" type="text" placeholder='Enter first Name' />
                              <FormHelperText className="helper" style={{ paddingLeft: "0px", marginTop: "5px" }}>{this.state.error.firstName ? this.state.error.firstNameErrorMessage : null}</FormHelperText>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 col-6 col-sm-6 col-xl-6">
                          <div className='row'>
                            <div className="col-lg-3 col-3 col-sm-3 col-xl-3">
                              <label className="form-label text-input-label" for="inputSection">Last Name<span className='required'></span></label>
                            </div>
                            <div className="col-lg-9 col-9 col-sm-9 col-xl-9">
                              <input className="profile-page" onChange={(e) => this.handleChange(e, 'lastName')}
                                value={this.state.testAdmin.lastName} style={{ marginRight: "15px" }}
                                name='phone' id='section' autoComplete="off" type="text" maxLength="20" placeholder='Enter Last Name' />
                              <FormHelperText className="helper" style={{ paddingLeft: "0px", marginTop: "5px" }}>{this.state.error.lastName ? this.state.error.lastNameErrorMessage : null}</FormHelperText>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='row'>
                        <div className="col-lg-6 col-6 col-sm-6 col-xl-6">
                          <div className='row'>
                            <div className="col-lg-3 col-3 col-sm-3 col-xl-3">
                              <label className="form-label text-input-label" for="inputSection">Phone<span className='required'></span></label>
                            </div>
                            <div className="col-lg-9 col-9 col-sm-9 col-xl-9">
                              <input className="profile-page" onChange={(e) => this.handleChange(e, 'phone')}
                                value={this.state.testAdmin.phone}
                                name='phone' id='testAdmin' autoComplete="off" maxLength={10} type="number" placeholder='Enter phone' />
                              <FormHelperText className="helper" style={{ paddingLeft: "0px", marginTop: "5px" }}>{this.state.error.phone ? this.state.error.phoneErrorMessage : null}</FormHelperText>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 col-6 col-sm-6 col-xl-6">
                          <div className='row'>
                            <div className="col-lg-3 col-3 col-sm-3 col-xl-3">
                              <label className="form-label text-input-label" for="inputSection">Email<span className='required'></span></label>
                            </div>
                            <div className="col-lg-9 col-9 col-sm-9 col-xl-9">
                              <input className="profile-page" onChange={(e) => this.handleChange(e, 'email')}
                                value={this.state.testAdmin.email}
                                name='email' id='testAdmin' autoComplete="off" maxLength="50" type="text" placeholder='Enter email' />
                              <FormHelperText className="helper" style={{ paddingLeft: "0px", marginTop: "5px" }}>{this.state.error.email ? this.state.error.emailErrorMessage : null}</FormHelperText>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">

                            <StatusRadioButton
                              handleChange={this.handleChange}
                              status={this.state.testAdmin.status}
                              style={{ marginTop: "0.4rem",marginLeft:"-2rem  " }}
                            />
                          </div>
                      <div className="row">
                        <div style={{ padding: "0px 0px 0px 10px", marginLeft: "53rem" }}>
                          <button type="submit" disabled={this.state.disabled} className="btn btn-primary">{action !== null ? 'Update' : 'Add'} Test Admin</button>
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

export default withLocation(AddTestAdmin)