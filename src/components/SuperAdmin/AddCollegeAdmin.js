import FormHelperText from '@mui/material/FormHelperText';
import axios from 'axios';
import _ from 'lodash';
import React, { Component } from 'react';
import { authHeader, errorHandler } from '../../api/Api';
import { toastMessage, withLocation } from '../../utils/CommonUtils';
import url from '../../utils/UrlConstant';
import { isEmpty, isValidEmail, isValidMobileNo } from "../../utils/Validation";
import './SuperAdmin.css';
import StatusRadioButton from '../../common/StatusRadioButton';

class AddCollegeAdmin extends Component {
  constructor() {
    super();
    this.state = {
      collegeAdmin: {
        name: '',
        email: '',
        phone: '',
        authId: '',
        role: '',
        token: '',
        college: {},
        createdBy: '',
        status: 'ACTIVE',
        disabled: false
      },
      colleges: [],
      error: {
        name: false,
        nameErrorMessage: '',
        email: false,
        emailErrorMessage: '',
        phone: false,
        phoneErrorMessage: '',
        password: false,
        passwordErrorMessage: '',
        college: false,
        collegeErrorMessage: ''

      }
    }
  }

  handleChange = (event, key) => {
    const { collegeAdmin, error } = this.state
    collegeAdmin[key] = event.target.value
    error[key] = false
    this.setState({ collegeAdmin, error });
  }

  handleObjChange = (index, key) => {
    const { collegeAdmin, error } = this.state
    collegeAdmin[key] = this.state.colleges[index.target.value]
    error[key] = false
    this.setState({ collegeAdmin, error })
  }

  handleSubmit = (event) => {
    const { collegeAdmin, error } = this.state
    if (isEmpty(collegeAdmin.name?.trim())) {
      error.name = true;
      error.nameErrorMessage = isEmpty(collegeAdmin.name) ? "Field Required !" : "Enter Valid Input";
      this.setState({ error })
    } else {
      error.name = false;
      this.setState({ error })
    }
    if (isEmpty(collegeAdmin.email?.trim()) || !isValidEmail(collegeAdmin.email)) {
      error.email = true;
      error.emailErrorMessage = isEmpty(collegeAdmin.email) ? "Field Required !" : "Enter Valid Input";
      this.setState({ error })
    } else {
      error.email = false;
      this.setState({ error })
    }
    if (isEmpty(collegeAdmin.college)) {
      error.college = true;
      error.collegeErrorMessage = "Field Required !";
      this.setState({ error })
    }
    if (isEmpty(collegeAdmin.phone) || !isValidMobileNo(collegeAdmin.phone)) {
      error.phone = true;
      error.phoneErrorMessage = isEmpty(collegeAdmin.phone) ? "Field Required !" : "Enter Valid Input";
      this.setState({ error })
    } else {
      error.phone = false;
      this.setState({ error })
    }
    event.preventDefault();
    if (!error.name && !error.email && !error.phone && !error.password) {
      this.setState({ disabled: true })
      axios.post(` ${url.COLLEGE_API}/admin/save`, this.state.collegeAdmin, { headers: authHeader() })
        .then(res => {
          if (this.props.location.pathname.indexOf('edit') > -1) {
            toastMessage('success', 'College Admin Details Updated Successfully..!');
          } else {
            toastMessage('success', 'College Admin Added Successfully..!');
          }
          console.log(this.props);
         this.props.navigate('/collegeadmin/admin');
        })
        .catch(error => {
          this.setState({ disabled: false })
          errorHandler(error)
        })
    }
  }

  componentWillMount() {
    console.log(this.props, "this.props.location.pathname")
    if (this.props.location.pathname.indexOf('edit') > -1) {
      let collegeAdmin = this.props.location.state.collegeAdmin;
      let collegeData = this.state.collegeAdmin;
      collegeData.id = collegeAdmin.id;
      collegeData.authId = collegeAdmin.authId;
      collegeData.role = collegeAdmin.role;
      collegeData.name = collegeAdmin.name;
      collegeData.college = collegeAdmin.college;
      collegeData.email = collegeAdmin.email;
      collegeData.phone = collegeAdmin.phone;
      collegeData.password = collegeAdmin.password;
      collegeData.status = collegeAdmin.status;
      this.setState({ collegeAdmin: collegeData });
    }
  }

  componentDidMount() {
    let token = localStorage.getItem('token');
    const { collegeAdmin } = this.state;
    collegeAdmin.token = token;
    this.setState({ token: collegeAdmin })
    axios.get(` ${url.COLLEGE_API}/college/list?status=${this.state.collegeAdmin.status}`, { headers: authHeader() })
      .then((res) => {
        this.setState({ colleges: res.data.response });
      })

      .catch(error => {
        errorHandler(error);
      })
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
              <span>{action !== null ? 'Update' : 'Add'} College Admin</span>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="table-border-cr">
                  <form className="email-compose-body" onSubmit={this.handleSubmit}>
                    <div className="send-header">
                      <div className="row">
                        <div className="col-lg-6 col-6 col-sm-6 col-md-6">
                          <div className='row' >
                            <div className='col-3 col-sm-3 col-md-3 col-lg-3'>
                              <label className="form-label input-label" >Name<span className='required'></span>
                                <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{this.state.error.name ? this.state.error.nameErrorMessage : null}</FormHelperText>
                              </label>
                            </div>
                            <div className='col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9'>
                              <input className="profile-page" onChange={(e) => this.handleChange(e, 'name')}
                                value={this.state.collegeAdmin.name}
                                name='name' id='process' autoComplete="off" maxLength="50" type="text" placeholder='Enter User Name' />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 col-6 col-sm-6 col-md-6">
                          <div className='row'>
                            <div className='col-3 col-sm-3 col-md-3 col-lg-3'>
                              <label className="form-label input-label" for="inputSection">Email<span className='required'></span>
                                <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{this.state.error.email ? this.state.error.emailErrorMessage : null}</FormHelperText>
                              </label>
                            </div>
                            <div className='col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9'>
                              <input className="profile-page" onChange={(e) => this.handleChange(e, 'email')}
                                value={this.state.collegeAdmin.email}
                                name='email' id='process' autoComplete="off" maxLength="50" type="text" placeholder='Enter email' />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 col-6 col-sm-6 col-md-6">
                          <div className='row'>
                            <div className='col-3 col-sm-3 col-md-3 col-lg-3'>
                              <label className="form-label input-label" for="inputSection">Phone<span className='required'></span>
                                <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{this.state.error.phone ? this.state.error.phoneErrorMessage : null}</FormHelperText>
                              </label></div>
                            <div className='col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9'>
                              <input className="profile-page" onChange={(e) => this.handleChange(e, 'phone')}
                                value={this.state.collegeAdmin.phone}
                                name='phone' id='process' autoComplete="off" maxLength="10" type="number" placeholder='Enter phone' />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 col-6 col-sm-6 col-md-6">
                          <div className='row'>
                            <div className='col-3 col-sm-3 col-md-3 col-lg-3'>
                              <label className="form-label input-label" for="inputSection">College<span className='required'></span>
                                <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{this.state.error.college ? this.state.error.collegeErrorMessage : null}</FormHelperText>
                              </label></div>
                            <div className='col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9' >
                              {action == null ?
                                <select className='profile-page' style={{}}
                                  required='true'
                                  onChange={(e) => this.handleObjChange(e, 'college')} value={_.findIndex(this.state.colleges, college => college?.collegeName === this.state.collegeAdmin.college?.collegeName)}>
                                  <option hidden selected value="" >{action ? this.state.collegeAdmin.college?.collegeName : 'Select college'}</option>
                                  {this.state.colleges.map((college, index) => {
                                    return <option value={index}>{college.collegeName}</option>
                                  })}
                                </select> : <input className="profile-page" readOnly={true}
                                  value={this.state.collegeAdmin.college?.collegeName}
                                />
                              }
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 col-6 col-sm-6 col-md-6">
                          <div className='row'>
                          <StatusRadioButton
                                  handleChange={this.handleChange}
                                  status={this.state.collegeAdmin.status}
                                  style={{ marginTop: "0.6rem" }}
                                />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div style={{ paddingLeft: "90%", }}>
                          {/* <Link className="btn btn-default" to="/collegeadmin/admin">Cancel</Link> */}
                          <button type="submit" disabled={this.state.disabled} className="btn btn-sm btn-prev">{action !== null ? 'Update' : 'Add'}</button>
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

export default withLocation(AddCollegeAdmin)