import FormHelperText from '@mui/material/FormHelperText';
import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { authHeader, errorHandler } from '../../api/Api';
import { toastMessage, withLocation } from '../../utils/CommonUtils';
import { url } from '../../utils/UrlConstant';
import { isEmpty } from "../../utils/Validation";
import './SuperAdmin.css';

class AddCompany extends Component {

  state = {
    logo: '',
    base64Logo: '',
    displayLogo: '',
    disabled: false,
    company: {
      name: '',
      sector: '',
      location: '',
      authUserId: '',
      examAccessType: '',
      status: 'ACTIVE',
      domain: ''
    },
    error: {
      name: false,
      companyNameErrorMessage: '',
      sector: false,
      sectorErrorMessage: '',
      location: false,
      domain: false,
      locationErrorMessage: '',
      examAccessType: false,
      examAccessTypeErrorMessage: '',
      logo: false,
      logoErrorMessage: '',
      domainErrorMessage: ''
    }
  }

  handleChange = (event, key) => {
    const { company, error } = this.state
    company[key] = event.target.value
    error[key] = false
    this.setState({ company, error });
  }

  handleSubmit = (event) => {
    const { company, error } = this.state
    if (isEmpty(company.name?.trim())) {
      error.name = true;
      error.companyNameErrorMessage = isEmpty(company.name) ? "Field Required !" : "Enter Valid Input"
      this.setState({ error })
    } else {
      error.name = false;
      this.setState({ error })
    }
    if (isEmpty(company.sector?.trim())) {
      error.sector = true;
      // error.sectorErrorMessage = "Field Required !";
      error.sectorErrorMessage = isEmpty(company.sector) ? "Field Required !" : "Enter Valid Input"
      this.setState({ error })
    } else {
      error.sector = false;
      this.setState({ error })
    }
    if (isEmpty(company.location?.trim())) {
      error.location = true;
      error.locationErrorMessage = "Field Required !";
      this.setState({ error })
    } else {
      error.location = false;
      this.setState({ error })
    }
    if (isEmpty(company.examAccessType)) {
      error.examAccessType = true;
      error.examAccessTypeErrorMessage = "Field Required !";
      this.setState({ error })
    } else {
      error.examAccessType = false;
      this.setState({ error })
    }
    if (isEmpty(company.domain)) {
      error.domain = true;
      error.domainErrorMessage = "Field Required !";
      this.setState({ error })
    } else {
      error.domain = false;
      this.setState({ error })
    }
    if (isEmpty(this.state.logo) && isEmpty(company.companyLogo)) {
      error.logo = true;
      error.logoErrorMessage = "Field Required !";
      this.setState({ error })
    }
    else {
      error.logo = false;
      this.setState({ error })

    }

    event.preventDefault();
    if (!error.name && !error.sector && !error.location && !error.logo && !error.examAccessType && !error.domain) {
      this.setState({ disabled: true })
      const formData = new FormData();
      formData.append('company', JSON.stringify(company))
      formData.append('companyLogo', this.state.logo);
      axios.post(` ${url.ADMIN_API}/company/save`, formData, { headers: authHeader() })
        .then(res => {
          if (this.props.location.pathname.indexOf('edit') > -1) {
            toastMessage('success', 'Company Details Updated Successfully..!');
            this.props.navigate('/companyadmin')
          } else {
            toastMessage('success', 'Company Added Successfully..!');
            this.props.navigate('/companyadmin')
          }
        })
        .catch(error => {
          this.setState({ disabled: false })
          errorHandler(error)
        })
    }
  }
  resetCompanyForm() {
    this.setState({
      name: '',
      sector: '',
      location: '',
      examAccessType: ''
    })
  }
  uploadLogo = (event) => {
    this.setState({ logo: event.target.files[0], displayLogo: '' }, () => this.setDisplayLogo());
  }
  setDisplayLogo = () => {
    this.setState({ displayLogo: URL.createObjectURL(this.state.logo) });
  }

  componentWillMount() {
    if (this.props?.location?.pathname.indexOf('edit') > -1) {
      const { company } = this.props?.location?.state
      this.setState(prevState => {
        let companyData = { ...prevState.company };
        companyData.id = company.id;
        companyData.authUserId = company.authUserId;
        companyData.name = company.name;
        companyData.sector = company.sector;
        companyData.location = company.location;
        companyData.status = company.status;
        companyData.examAccessType = company.examAccessType;
        companyData.companyLogo = company.companyLogo;
        return { company };
      }, () => this.getLogo());
    }
  }

  getLogo = () => {
    console.log(this.state?.company?.id)
    axios.get(`${url.ADMIN_API}/company/logo/${this.state?.company?.id}`, { headers: authHeader() })
      .then(res => {
        this.setState({ base64Logo: res.data.message })
      })
      .catch(err => errorHandler(err))
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
              <span>{action !== null ? 'Update' : 'Add'} Company</span>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="table-border-cr">
                  <form className="email-compose-body" onSubmit={this.handleSubmit}>
                    <div className="send-header">
                      <div className="row">
                        <div className='col-6 col-lg-6 col-sm-6 col-xl-6'>
                          <div className='row'>
                            <div className='col-4 col-lg-4 col-md-4 col-sm-4'>
                              <label className="form-label input-label">Company Name<span className='required'></span><FormHelperText className="helper helper-candidate" style={{ paddingLeft: "0px", marginTop: '5px' }}>{this.state.error.name ? this.state.error.companyNameErrorMessage : null}</FormHelperText></label>
                            </div>
                            <div className='col-8 col-lg-8 col-md-8 col-sm-8'>
                              <input className="profile-page input-mini" maxLength="50"
                                onChange={(e) => this.handleChange(e, 'name')}
                                value={this.state.company.name}
                                name='name' id='company' autoComplete="off" type="text" placeholder='Enter Company Name' />
                            </div>
                          </div>
                        </div>
                        <div className='col-6 col-lg-6 col-sm-6 col-xl-6'>
                          <div className='row'>
                            <div className='col-4 col-lg-4 col-md-4 col-sm-4'>
                              <label className="form-label input-label">Sector<span className='required'></span><FormHelperText className="helper helper-candidate" style={{ paddingLeft: "0px", marginTop: '5px' }}>{this.state.error.sector ? this.state.error.sectorErrorMessage : null}</FormHelperText></label>
                            </div>
                            <div className='col-8 col-lg-8 col-md-8 col-sm-8'>
                              <input className="profile-page input-mini" maxLength="50"
                                onChange={(e) => this.handleChange(e, 'sector')}
                                value={this.state.company.sector}
                                name='sector' id='company' type="text" autoComplete="off" placeholder='Enter Sector' />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className='col-6 col-lg-6 col-sm-6 col-xl-6'>
                          <div className='row'>
                            <div className='col-4 col-lg-4 col-md-4 col-sm-4'>
                              <label className="form-label input-label">Location<FormHelperText className="helper helper-candidate" style={{ paddingLeft: "0px", marginTop: '5px' }}>{this.state.error.location ? this.state.error.locationErrorMessage : null}</FormHelperText></label>
                            </div>
                            <div className='col-8 col-lg-8 col-md-8 col-sm-8'>
                              <input className="profile-page input-mini" maxLength="50"
                                onChange={(e) => this.handleChange(e, 'location')}
                                value={this.state.company.location}
                                name='location' id='company' type="text" autoComplete="off" placeholder='Enter Location' />
                            </div>
                          </div>
                        </div>
                        <div className='col-6 col-lg-6 col-sm-6 col-xl-6'>
                          <div className='row'>
                            <div className='col-4 col-lg-4 col-md-4 col-sm-4'>
                              <label className="form-label input-label" for="inputSection">Test Access Type<span className='required'></span><FormHelperText className="helper helper-candidate" style={{ paddingLeft: "0px", marginTop: '5px' }}>{this.state.error.examAccessType ? this.state.error.examAccessTypeErrorMessage : null}</FormHelperText></label>
                            </div>
                            <div className='col-8 col-lg-8 col-md-8 col-sm-8'>
                              <select className='profile-page input-mini'
                                onChange={(e) => this.handleChange(e, 'examAccessType')} value={this.state.company.examAccessType}>
                                <option hidden selected value="" >Select Test Type</option>
                                <option value="MCQ">Only MCQ</option>
                                <option value="PROGRAMMING">Only Programming</option>
                                <option value="BOTH">Both</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className='col-6 col-lg-6 col-sm-6 col-xl-6'>
                          <div className='row'>
                            <div className='col-4 col-lg-4 col-md-4 col-sm-4'>
                              <label className="form-label input-label">Domain<FormHelperText className="helper helper-candidate" style={{ paddingLeft: "0px", marginTop: '5px' }}>{this.state.error.domain ? this.state.error.domainErrorMessage : null}</FormHelperText></label>
                            </div>
                            <div className='col-8 col-lg-8 col-md-8 col-sm-8'>
                              <input className="profile-page input-mini" maxLength="50"
                                onChange={(e) => this.handleChange(e, 'domain')}
                                value={this.state.company.domain}
                                name='domain' id='company' type="text" autoComplete="off" placeholder='Enter Domain' />
                            </div>
                          </div>
                        </div>
                        <div className='col-6 col-lg-6 col-sm-6 col-xl-6'>
                          <div className='row'>
                            <div className='col-4 col-lg-4 col-md-4 col-sm-4'>
                              <label className='form-label input-label'>Company Logo:<FormHelperText className="helper helper-candidate" style={{ paddingLeft: "0px", marginTop: '5px' }}>{this.state.error.logo ? this.state.error.logoErrorMessage : null}</FormHelperText></label>
                              {this.state.displayLogo && <img style={{ width: '200px', height: '200px' }} alt='logo' src={this.state.displayLogo} ></img>}
                              {!this.state.displayLogo && this.state.base64Logo && <img style={{ width: '200px' }} alt='logo' src={`data:image/png;base64,${this.state.base64Logo}`} />}
                            </div>
                            <div className='col-8 col-lg-8 col-md-8 col-sm-8'>
                              <label for='files' className='btn btn-sm btn-prev' style={{ margin: '0px' }}>{this.state.company.logo ? "Update Logo" : "Upload Logo"}</label>
                              <input type='file' id='files' style={{ visibility: 'hidden' }} accept="image/x-png,image/jpeg" onChange={(e) => this.uploadLogo(e)} />

                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                      </div>
                      <div className="form-group row">
                        <div className="col-md-12">
                          <div className='row' style={{ float: "right", paddingRight: '4.375rem' }}>
                            <div className='col-lg-6 col-sm-6 xol-md-6'>
                              <button type="submit" disabled={this.state.disabled} className="btn btn-sm btn-prev" style={{ paddingRight: '0.5rem' }}>{action !== null ? 'Update' : 'Add'}</button>
                            </div>
                            <div className='col-lg-6 col-sm-6 xol-md-6'>
                              <Link className="btn btn-sm btn-nxt" to="/companyadmin">Cancel</Link>
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

export default withLocation(AddCompany)