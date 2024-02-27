import { Button, Card, CardContent, FormHelperText, Grid, List, Step, StepLabel, Stepper } from '@mui/material';
import axios from 'axios';
import _ from 'lodash';
import React, { Component } from 'react';
import { errorHandler } from '../../api/Api';
import LOGO from '../../assests/images/LOGO.svg';
import { sendOtp } from '../../common/SendOtpApi';
import { toastMessage, withLocation } from '../../utils/CommonUtils';
import url from '../../utils/UrlConstant';
import { isEmpty, isValidEmail, isValidMobileNo } from '../../utils/Validation';
import VerifyOtp from './VerifyOtp';



 class CompanyRegister extends Component {
  constructor() {
    super();
    this.state = {
      activeStep: 0,
      submitButtonDisabled: false,
      companyRegister: {
        company: {},
        admin: {}
      },
      isOtpRequested: false,
      otpVerified: false,
      error: {}
    }
  }

  steps = this.getSteps();

  getSteps() {
    return ["Company Register", "Sign Up"];
  }

  handleNext = () => {
    const companyRegister = this.state.companyRegister
    const company = companyRegister.company;
    const admin = companyRegister.admin
    const { error } = this.state

    if (this.state.activeStep === 0) {
      if (isEmpty(company.name?.trim())) {
        error.name = true;
        error.nameMsg = isEmpty(company.name) ? "Field Required !" : "Enter Valid Input"
        this.setState({ error })
      } else {
        error.name = false;
        this.setState({ error })
      }
      if (isEmpty(company.domain?.trim())) {
        error.domain = true;
        error.domainErrorMsg = isEmpty(company.domain) ? "Field Required !" : "Enter Valid Input"
        this.setState({ error })
      } else {
        error.domain = false;
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
      if (isEmpty(admin.phone) || !isValidMobileNo(admin.phone)) {
        error.phone = true;
        error.phoneErrorMessage = isEmpty(admin.phone) ? "Field Required !" : "Enter valid Input";
        this.setState({ error })
      } else {
        error.phone = false;
        this.setState({ error })
      }
      if (isEmpty(admin.email?.trim()) || !isValidEmail(admin.email)) {
        error.email = true;
        error.emailErrorMessage = isEmpty(admin.email) ? "Field Required !" : "Enter valid Input";
        this.setState({ error })
      } else {
        error.email = false;
        this.setState({ error })
      }

      if (error.name || error.domain || error.userName || error.phone || error.email) {
        return
      }
      else if (!this.state.isOtpRequested || localStorage.getItem("otpTimeUp")) {
        this.setState({ isOtpRequested: true }, () => {
          this.requestOtp(admin.email);
        });
        return;
      }
      else {
        this.setState((prevState) => ({
          activeStep: prevState.activeStep + 1,
        }));
        return;
      }
    }

    if (this.state.activeStep === 1) {
      this.setState((prevState) => ({
        activeStep: prevState.activeStep + 1,
      }));
      return;
    }
  }

  requestOtp = async (email) => {
    let resp = await sendOtp(email);
    if (resp === 'error') {
      return toastMessage('error', "Error while sending otp")
    }
    this.setState((prevState) => {
      if (prevState.activeStep < 1) {
        return {
          activeStep: prevState.activeStep + 1,
        };
      }
    });
  }

  handleBack = () => {
    this.setState((prevState) => ({
      activeStep: prevState.activeStep - 1,
    }));
  };

  handleChange = (event, key) => {
    const companyRegister = this.state.companyRegister
    const company = companyRegister.company;
    const admin = companyRegister.admin;
    company.examAccessType = 'MCQ'
    key === 'company' ? company[event.target.name] = event.target.value : admin[event.target.name] = event.target.value
    this.setState({ companyRegister: companyRegister });
  }

  setOtpverifed = () => {
    this.setState({ otpVerified: true })
  }

  getStepContent(stepIndex) {
    const companyRegister = this.state.companyRegister
    const company = companyRegister.company;
    const admin = companyRegister.admin;
    switch (stepIndex) {
      case 0:
        return (
          <CardContent>
            <Card style={{ width: '75rem', height: '20rem', marginLeft: '15px' }}>
              <form className="email-compose-body">
                <div className="send-header" style={{ marginLeft: '10rem', width: '70%', marginTop: '2rem' }}>
                  <div className="row">
                    <div className="col-2 competitor-input" style={{ height: '5rem' }}>
                      <label className="form-label text-label" for="form12">Company Name*
                        <FormHelperText className='helper helper-candidate'>{this.state.error.name ? this.state.error.nameMsg : null}</FormHelperText></label>
                    </div>
                    <div className="col-4 competitor-input">
                      <input className="profile-page" type='name' label='Company Name' name='name' maxLength="50" onChange={(e) => this.handleChange(e, 'company')} value={company?.name} aria-label="default input example"></input>
                    </div>
                    <div className="col-2 competitor-input" style={{ height: '5rem' }}>
                      <label className="form-label text-label" for="form12">Domain*
                        <FormHelperText className='helper helper-candidate'>{this.state.error.domain ? this.state.error.domainErrorMsg : null}</FormHelperText></label>
                    </div>
                    <div className="col-4 competitor-input">
                      <input className="profile-page" type='name' label='Domain' name='domain' maxLength="50" onChange={(e) => this.handleChange(e, 'company')} value={company?.domain} aria-label="default input example"></input>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-2 competitor-input" style={{ height: '5rem' }}>
                      <label className="form-label text-label" for="form12">Name*
                        <FormHelperText className='helper helper-candidate'>{this.state.error.userName ? this.state.error.userNameErrorMessage : null}</FormHelperText></label>
                    </div>
                    <div className="col-4 competitor-input">
                      <input className="profile-page" type='name' label='User Name' name='userName' maxLength="50" onChange={(e) => this.handleChange(e, 'admin')} value={admin?.userName} aria-label="default input example"></input>
                    </div>
                    <div className="col-2 competitor-input" style={{ height: '5rem' }}>
                      <label className="form-label text-label" for="form12">Email*
                        <FormHelperText className='helper helper-candidate'>{this.state.error.email ? this.state.error.emailErrorMessage : null}</FormHelperText></label>
                    </div>
                    <div className="col-4 competitor-input">
                      <input className="profile-page" type='name' label='email' name='email' onChange={(e) => this.handleChange(e, 'admin')} value={admin?.email} aria-label="default input example" /><span className='required'></span>
                    </div>
                    <div className="col-2 competitor-input" style={{ height: '5rem' }}>
                      <label className="form-label text-label" for="form12">Phone*
                        <FormHelperText className='helper helper-candidate'>{this.state.error.phone ? this.state.error.phoneErrorMessage : null}</FormHelperText></label>
                    </div>
                    <div className="col-4 competitor-input">
                      <input className="profile-page" type='number' label='Phone' name='phone' maxLength="12" placeholder='Enter Phone' value={admin?.phone} onChange={(e) => this.handleChange(e, 'admin')} aria-label="default input example" /><span className='required'></span>
                    </div>
                  </div>
                </div>

              </form>
            </Card>
          </CardContent>
        )

      case 1:
        return (
          <>

            <CardContent>
              {this.state.otpVerified === false ?
                <VerifyOtp back={this.handleBack} email={admin?.email} next={this.handleNext} requestOtp={this.requestOtp} otpVerify={this.setOtpverifed} />
                : (<>
                  <h2 className="setting-title" style={{ textAlign: "center" }}>Set Password</h2>
                  <Card style={{ width: '75rem', marginLeft: '15px', height: '15rem', marginTop: '3rem' }}>
                    <div className="row">
                      <div className="col-6 competitor-login" style={{ height: '3rem' }}>
                        <label className="form-label text-label" for="form12">Password*
                          <FormHelperText className='helper helper-candidate'>{this.state.error.password ? this.state.error.passwordErrorMessage : null}</FormHelperText></label>
                      </div>
                      <div className="col competitor-input" style={{ paddingLeft: '0' }}>
                        <input className="profile-page" autoComplete='current-password' label='Password' type='password' name='password' maxLength="20" min={1} max={100} onChange={(e) => this.setState({ password: e.target.value })} value={this.state.password} id='password' aria-label="default input example" /><span className='required'></span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6 competitor-login" style={{ height: '3rem' }}>
                        <label className="form-label text-label" for="form12">Confirm Password*
                          <FormHelperText className='helper helper-candidate'>{this.state.error.cPassword ? this.state.error.cPasswordErrorMessage : null}</FormHelperText></label>
                      </div>
                      <div className="col competitor-input" style={{ paddingLeft: '0' }}>
                        <input className="profile-page" autoComplete='current-password' type='password' label='Password' name='password' maxLength="20" min={1} max={100} onChange={(e) => this.setState({ cPassword: e.target.value })} value={this.state.cPassword} id='password' aria-label="default input example" /><span className='required'></span>
                      </div>
                    </div>
                  </Card>
                </>)
              }
            </CardContent>
          </>
        )

      default:
        this.handleSubmit();
        return "Unknown Step";
    }
  }

  handleSubmit = () => {
    const { error } = this.state;

    if (this.state.password !== this.state.cPassword) {
      error.cPassword = true;
      error.cPasswordErrorMessage = "Password Doesn't Match"
      this.setState({ error })
    }
    else {
      error.cPassword = false;
      this.setState({ error })

    }
    if (isEmpty(this.state.password)) {
      error.password = true;
      error.passwordErrorMessage = "FieldRequired"
      this.setState({ error })

    }
    else {
      error.password = false;
      this.setState({ error })

    }

    if (!error.password && !error.cPassword) {
      this.setState({ submitButtonDisabled: true })
      const formData = new FormData();
      const companyRegister = this.state.companyRegister
      const admin = companyRegister.admin
      const company = companyRegister.company
      company["isTrialCompany"] = true
      company.domain.trim()
      admin['password'] = this.state.password
      formData.append('company', JSON.stringify(this.state.companyRegister))
      formData.append('companyLogo', null);
      axios.post(`${url.ADMIN_API}/freecredit/signIn`, formData).then(res => {
        toastMessage('success', 'company registered successfully')
        localStorage.clear();
        this.props.navigate('/')
        this.setState({ submitButtonDisabled: false })

      }).catch(err => {
        this.setState({ submitButtonDisabled: false })
        errorHandler(err)
      })
    }
  }

  render() {
    return (
      <div className='bg-image'>
        <div className='header'>
          <div className='col-4'>
            <img className='header-logo' src={LOGO} alt="SkillSort" />
          </div>
          <div className='col' style={{ paddingLeft: '3.75rem' }}>
            <span className='user-header'>Company Registration</span>
          </div>
        </div>
        <div className='row' style={{ display: 'flex', flexWrap: 'nowrap' }}>
          {/* <a style={{ padding: '.5rem 0 0 1rem' }} href='https://skillsort.in/'> <i style={{ fontSize: '2rem', color: '#3B489E' }} class="fa fa-home" aria-hidden="true"></i></a> */}
          <Stepper activeStep={this.state.activeStep} alternativeLabel style={{ width: '100%', paddingBottom: '0' ,marginTop:'2rem',}}
          sx={{
            '& .MuiStepIcon-root': {
              color: '#3f51b5', 
            },
            '& .MuiStepIcon-active': {
              color: '#3f51b5',
            },
            '& .MuiStepIcon-completed': {
              color: '#3f51b5',
            },
          }}
          
          >
            {_.map(this.steps, (label) => (
              <Step key={label} >
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>
        <Grid container spacing={2} style={{ justifyContent: 'center' }}>
          <Grid item xs={10}>
            <List>
              <CardContent style={{ display: 'flex', justifyContent: 'center' }}>
                {this.getStepContent(this.state.activeStep)}
              </CardContent>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {this.state.activeStep === 0 ?
                  < Button variant="contained" color="primary" sx={{backgroundColor:'#3f51b5'}} onClick={(event) => {
                    event.persist(); // Call event.persist() to remove synthetic event pooling
                    this.handleNext();
                  }}
                    disabled={this.state.disabled}
                    style={this.state.activeStep === 0 ?
                      { width: "10ch", height: '30px' } :
                      { height: '30px' }}>Next
                  </Button> : null}
                {
                  this.state.activeStep === 1 && this.state.otpVerified ?
                    < Button variant="contained" color="primary" sx={{backgroundColor:'#3f51b5'}} onClick={(event) => {
                      this.handleSubmit()
                    }}
                      disabled={this.state.submitButtonDisabled}
                      style={this.state.activeStep === 0 ?
                        { width: "10ch", height: '30px' } :
                        { height: '30px' }}>Submit
                    </Button> : null
                }
              </div>
            </List>
          </Grid>
        </Grid>
      </div >
    )
  }
}

export default withLocation(CompanyRegister)