import FormHelperText from '@mui/material/FormHelperText';
import axios from 'axios';
import _ from 'lodash';
import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import { toast } from 'react-toastify';
import { authHeader, errorHandler } from '../../api/Api';
import { toastMessage, withLocation } from '../../utils/CommonUtils';
import { url } from '../../utils/UrlConstant';
import { isEmpty, isValidEmail, isValidMobileNo, isValidName } from "../../utils/Validation";
import './SuperAdmin.css';
import Select from '@mui/material/Select';
import StatusRadioButton from '../../common/StatusRadioButton';
import MultiSelectDropDown from '../../utils/MultiSelectDropDown';



class AddProcessAdmin extends Component {
  constructor() {
    super();
    this.state = {
      process: {
        userName: '',
        email: '',
        phone: '',
        authId: '',
        role: '',
        companies: [],
        createdBy: '',
        token: localStorage.getItem("token"),
        status: 'ACTIVE',
      },
      disabled: false,
      companies: [],
      selectedCompanies: [],
      selectedCompanyObjects: [],
      pendingCompanyIds: [],
      error: {
        name: false,
        nameErrorMessage: '',
        email: false,
        emailErrorMessage: '',
        phone: false,
        phoneErrorMessage: '',
        password: false,
        passwordErrorMessage: '',
        selectedCompanies: false,
        selectedCompaniesErrorMessage: ''

      }
    }
  }

  handleChange = (company, key) => {
    if (key === 'phone' && company.target.value.length > 10)
      return
    const { process, error } = this.state
    process[key] = company.target.value
    error[key] = false
    this.setState({ process, error });
  }

  handleSubmit = (company) => {
    const { process, error } = this.state
    if (isEmpty(process.userName?.trim()) || !isValidName(process.userName)) {
      error.name = true;
      error.nameErrorMessage = isEmpty(process.userName) ? "Field Required !" : "Enter Valid Name";
      this.setState({ error })
    } else {
      error.name = false;
      this.setState({ error })
    }
    if (isEmpty(process.email) || !isValidEmail(process.email)) {
      error.email = true;
      error.emailErrorMessage = isEmpty(process.email) ? "Field Required" : "Enter valid Email";
      this.setState({ error })
    } else {
      error.email = false;
      this.setState({ error })
    }
    if (isEmpty(process.phone) || !isValidMobileNo(process.phone)) {
      error.phone = true;
      error.phoneErrorMessage = isEmpty(process.phone) ? "Field Required !" : "Enter Vaild PhoneNumber";
      this.setState({ error })
    } else {
      error.phone = false;
      this.setState({ error })
    }

    company.preventDefault();
    this.setCompany();
    if (!error.name && !error.email && !error.phone) {
      this.setState({ disabled: true })
      axios.post(` ${url.ADMIN_API}/process/save`, this.state.process, { headers: authHeader() })
        .then(res => {
          if (this.props.location.pathname.indexOf('edit') > -1) {
            toastMessage('success', 'Process Admin Details Updated Successfully..!');
          } else {
            toastMessage('success', 'Process Admin Added Successfully..!');
          }
          this.props.navigate('/skillsortadmin');
        })
        .catch(error => {
          this.setState({ disabled: false })
          errorHandler(error);
        })
    }
  }

  setCompany() {
    let companies = this.state.process.companies;
    _.map(this.state.selectedCompanyObjects, company => {
      companies.push(company);
    })
    let process = this.state.process;
    process.companies = companies;
    this.setState({ process: process });
  }

  componentWillMount() {
    if (this.props.location.pathname.indexOf('edit') > -1) {
      let process = this.props.location.state.processAdmin;
      let processData = this.state.process;
      processData.id = process.id;
      processData.authId = process.authId;
      processData.role = process.role;
      processData.userName = process.userName;
      processData.companies = process.companies;
      processData.email = process.email;
      processData.phone = process.phone;
      processData.password = process.password;
      processData.status = process.status;
      this.setState({ process: processData });
    }
  }

  componentDidMount() {
    let id = this.state.process.id;
    axios.get(` ${url.ADMIN_API}/process/companylist?${id ? "processAdminId=" + id : ""}`, { headers: authHeader() })
      .then(res => {
        this.setState({ companies: res.data?.response?.company, pendingCompanyIds: res.data.response.pendingCompanyIds })
      })
      .catch(error => {
        errorHandler(error);
      })
  }

  updateCompanies = (company, index) => {
    if (!this.state.pendingCompanyIds.includes(company.id)) {
      let companies = this.state.companies;
      companies.push(company);
      let process = this.state.process;
      let pcompany = process.companies;
      pcompany.splice(index, 1);
      process.companies = pcompany;
      this.setState({ process: process, companies: companies })
    } else {
      toast.warning("in progress");
    }


  }

  handleMultiSelect = (e) => {
    let value = e.target.value;
    let comp = this.state.companies.filter(com => value?.includes(com.name))
    let updatedArray = comp;
    if (_.size(value) === 0) {
      updatedArray = []
    }
    this.setState({ selectedCompanies: value ? value : [], selectedCompanyObjects: updatedArray });
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
              <span>{action !== null ? 'Update' : 'Add'} Process Admin</span>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="table-border-cr">
                  <form className="email-compose-body" onSubmit={this.handleSubmit}>
                    <div className="send-header">
                      <div className="row">
                        <div className=" col-6 col-lg-6 col-sm-6 col-xl-6">
                          <div className="row">
                            <div className="col-lg-3 col-3 col-sm-3 col-xl-3">
                              <label className="form-label text-input-label" for="inputSection">Name<span className='required'></span></label>
                            </div>
                            <div className="col-lg-9 col-9 col-sm-9 col-xl-9">
                              <input className="profile-page" onChange={(e) => this.handleChange(e, 'userName')}
                                value={this.state.process.userName}
                                name='name' id='process' autoComplete="off" maxLength="50" type="text" placeholder='Enter User Name' />
                              <FormHelperText className="helper" style={{ paddingLeft: "0px", marginTop: "5px" }}>{this.state.error.name ? this.state.error.nameErrorMessage : null}</FormHelperText>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 col-6  col-sm-6 col-xl-6">
                          <div className="row">
                            <div className="col-lg-3 col-3 col-sm-3 col-xl-3">
                              <label className="form-label text-input-label" for="inputSection">Email<span className='required'></span></label>
                            </div>
                            <div className="col-lg-9 col-9 col-sm-9 col-xl-9">
                              <input className="profile-page" onChange={(e) => this.handleChange(e, 'email')}
                                value={this.state.process.email}
                                name='email' id='process' autoComplete="off" maxLength="50" type="text" placeholder='Enter email' />
                              <FormHelperText className="helper" style={{ paddingLeft: "0px", marginTop: "5px" }}>{this.state.error.email ? this.state.error.emailErrorMessage : null}</FormHelperText>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6 col-6  col-sm-6 col-xl-6">
                          <div className="row">
                            <div className="col-lg-3 col-3  col-sm-3 col-xl-3">
                              <label className="form-label text-input-label" for="inputSection">Phone<span className='required'></span></label>
                            </div>
                            <div className="col-lg-9 col-9  col-sm-9 col-xl-9">
                              <input className="profile-page" onChange={(e) => this.handleChange(e, 'phone')}
                                value={this.state.process.phone}
                                name='phone' id='process' autoComplete="off" maxLength="50" type="number" placeholder='Enter phone' />
                              <FormHelperText className="helper" style={{ paddingLeft: "0px", marginTop: "5px" }}>{this.state.error.phone ? this.state.error.phoneErrorMessage : null}</FormHelperText>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 col-6  col-sm-6 col-xl-6">
                          <div className="row">
                            <StatusRadioButton
                              handleChange={this.handleChange}
                              status={this.state.process.status}
                              style={{ marginTop: "0.5rem",marginLeft:"4rem " }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className='row'>
                        <div className="col-lg-6 col-6  col-sm-6 col-xl-6">
                          <div className="row" >
                            <div className="col-lg-4 col-4 col-sm-4 col-xl-4" style={{ paddingLeft: '0px', paddingTop: '10px' }}>
                              <label className="form-label text-input-label" >Select Companies<span className='required'></span></label>
                            </div>
                            <div className="col-lg-6 col-6 col-sm-6 col-xl-6" style={{ paddingRight: '10px', paddingTop: '10px', marginLeft: '-56px' }}>

                              <MultiSelectDropDown
                                value={this.state.selectedCompanies}
                                list={this.state.companies}
                                handleChange={this.handleMultiSelect}
                                isObject={true}
                                keyValue={'name'}
                                displayValue={'name'}
                                placeholder={"Select Companies"}
                              />
                              <FormHelperText className="helper" style={{ paddingLeft: "0px", marginTop: "5px" }}>{this.state.error.selectedCompanies ? this.state.error.selectedCompaniesErrorMessage : null}</FormHelperText>
                            </div>
                          </div>
                        </div>
                        {this.state.process.companies?.length > 0 ?
                          <div className="col-5" style={{ padding: "2px 0px 0px 50px" }}>
                            <div className="card">
                              <div className="card-header">Alloted Companies</div>
                              <div className="card-body" style={{ overflowY: 'auto', maxHeight: '200px' }}>
                                <Table responsive="sm" style={{ "borderWidth": "1px", 'borderColor': "#aaaaaa", 'borderStyle': 'solid' }}>
                                  <thead>
                                    <tr>
                                      <th>CompanyName</th>
                                      <th>Action</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {_.map(this.state.process.companies, (company, index) => {
                                      return (
                                        <tr>
                                          <td style={{ paddingBottom: '0px' }}>{company.name}</td>
                                          <td style={{ paddingBottom: '0px' }}><button type="button" onClick={() => this.updateCompanies(company, index)} className="btn btn ml-1"><i className="fa fa-trash-o" aria-hidden="true"></i></button></td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </Table>
                              </div>
                            </div>
                          </div> : ""
                        }

                      </div>
                      <div className="row">
                        <div style={{ padding: "0px 0px 0px 10px", marginLeft: '53rem' }}>
                          <button type="submit" disabled={this.state.disabled} className="btn btn-sm btn-prev">{action !== null ? 'Update' : 'Add'} Process Admin</button>
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

export default withLocation(AddProcessAdmin)