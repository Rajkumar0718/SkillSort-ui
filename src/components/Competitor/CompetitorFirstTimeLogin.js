import React, {  Component } from 'react';
import FormHelperText from '@mui/material/FormHelperText';
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import { authHeader, errorHandler } from '../../api/Api';
import { toastMessage, ToggleStatus } from '../../utils/CommonUtils';
import States from '../../utils/StatesAndDistricts';
import { isEmpty, isVaildnum, isValidEmail, isValidMobileNo, isValidName, isValidPassword } from "../../utils/Validation";
import url from '../../utils/UrlConstant';
import style from '../Candidate/Styles.css';
import LOGO from '../../assests/images/LOGO.svg';
import DatePick from '../../common/DatePick';
import { Button, Card, CardContent, Grid, List, Step, StepLabel, Stepper } from '@mui/material';


export default class CompetitorFirstTimeLogin extends Component {

    constructor() {
      super();
      this.state = {
        competitor: {
          state: '',
          district: '',
  
        },
        districts: [],
        departments: [],
        department: "",
        disabled: false,
        resume: "",
        password: '',
        cPassword: '',
        yop: moment().format('YYYY'),
        activeStep: 0,
        error: {
          firstName: false,
          firstNameErrorMessage: '',
          gender: false,
          genderErrorMessage: '',
          resume: false,
          resumeErrorMessage: '',
          hscPercentage: false,
          hscErrorMessage: '',
          ugPercentage: false,
          ugErrorMessage: '',
          department: false,
          departmentErrorMessage: '',
          contactNumber: false,
          contactNumberErrorMessage: '',
          state: false,
          stateErrorMessage: '',
          district: false,
          districtErrorMessage: '',
          yop: false,
          yopErrorMessage: '',
          sslcPercentage: false,
          sslcErrorMessage: '',
          college: false,
          collegeErrorMessage: '',
          natureOfJob: false,
          jobNatureErrorMessage: ''
        },
        loginError: {
          email: false,
          emailErrorMessage: '',
          password: false,
          passwordErrorMessage: '',
          cPassword: false,
          cPasswordErrorMessage: '',
        }
  
      }
    }
  
    componentDidMount() {
      axios.get(`${url.ADMIN_API}/department?status=ACTIVE`)
        .then(res => {
          this.setState({ departments: res.data.response })
        })
        .catch(error => {
          errorHandler(error);
        })
  
    }
  
    handleStateChange = (event, key) => {
      const { competitor, error } = this.state || {}
      competitor[key] = event.target.value;
      competitor.district = '';
      error[key] = false;
      this.setState({ competitor, error, districts: States[event.target.value] })
    }
  
    handleDistrictChange = (event, key) => {
      const { competitor, error } = this.state || {}
      competitor[key] = event.target.value;
      error[key] = false
      this.setState({ competitor, error });
    }
  
    handleChange = (event, key) => {
      const { competitor, error } = this.state || {}
      competitor[key] = event.target.value
      error[key] = false
      this.setState({ competitor, error });
    }
  
    onFileChange = (event) => {
      const { error } = this.state
      let pdf = event.target.files[0];
      if (pdf?.size > 1048576 || pdf.type !== "application/pdf") {
        this.setState({ resume: null })
        error.resume = true;
        error.resumeErrorMessage = pdf.type !== "application/pdf" ? "Upload Pdf File only" : "File size must less than 1MB";
      } else {
        error.resume = false;
        this.setState({ resume: event.target.files[0], error })
      }
    };
  
    handleSubmit = (event) => {
      const { competitor, loginError } = this.state;
      competitor.password = this.state.password;
  
      if (isEmpty(competitor.password) || !isValidPassword(competitor.password)) {
        loginError.password = true;
        loginError.passwordErrorMessage = isEmpty(competitor.password) ? "Set Password" : "8 - 20 words, a Number and a Special Character";
      }
      else {
        loginError.password = false;
        this.setState({ loginError })
      }
  
      if (competitor.password !== this.state.cPassword) {
        loginError.cPassword = true;
        loginError.cPasswordErrorMessage = "Password Doesn't Match"
      }
      else {
        loginError.cPassword = false;
        this.setState({ loginError })
      }
      this.setState({ loginError })
      event.preventDefault();
      if (!loginError.password && !loginError.cPassword && !loginError.email) {
        this.setState({ disabled: true })
        const formData = new FormData();
        competitor.yop = moment(competitor.yop).year()
        formData.append('resume', this.state.resume);
        formData.append('competitor', JSON.stringify(competitor));
        axios.post(` ${url.COMPETITOR_API}/competitor/register`, formData, { headers: authHeader() })
          .then(() => {
            toastMessage('success', "Profile Created successfully..!");
            this.props.history.push('/');
          })
          .catch(err => {
            this.setState({ disabled: false })
            errorHandler(err);
          })
      }
    }
    handleBack = () => {
      this.setState({
        activeStep: 0,
        resume: "",
      });
    };
  
    handleNext = () => {
      const { competitor, error } = this.state
      competitor.department = this.state.department
      competitor.yop = this.state.yop
  
      if (isEmpty(competitor.department)) {
        error.department = true;
        error.departmentErrorMessage = "Select department";
      } else {
        error.department = false;
      }
      if (isEmpty(this.state.resume)) {
        error.resume = true;
        error.resumeErrorMessage = "Resume required";
      } else {
        error.resume = false;
      }
  
      if (isEmpty(competitor.gender)) {
        error.gender = true;
        error.genderErrorMessage = "Select Gender";
      } else {
        error.gender = false;
      }
      if (isEmpty(competitor.state)) {
        error.state = true;
        error.stateErrorMessage = "Select State";
      } else {
        error.state = false;
      }
      if (isEmpty(competitor.district)) {
        error.district = true;
        error.districtErrorMessage = "Select District";
      } else {
        error.state = false;
      }
      if (isEmpty(competitor.phone) || !isValidMobileNo(competitor.phone)) {
        error.contactNumber = true;
        error.contactNumberErrorMessage = isEmpty(competitor.contactNumber) ? 'Field Required!' : 'Enter Valid Number'
      } else {
        error.contactNumber = false;
      }
      if (isEmpty(competitor.firstName) || !isValidName(competitor.firstName)) {
        error.firstName = true;
        error.firstNameErrorMessage = "Field Required!"
        this.setState({ error })
      }
      else {
        error.firstName = false;
        this.setState({ error })
      }
      if (isEmpty(competitor.hsc) || isVaildnum(competitor.hsc) || competitor.hsc > 100) {
        error.hscPercentage = true;
        error.hscErrorMessage = isEmpty(competitor.hsc) ? "Field Required!" : "Enter Valid Input";
      }
      else {
        error.hscPercentage = false;
        this.setState({ error })
      }
      if (isEmpty(competitor.sslc) || isVaildnum(competitor.sslc) || competitor.sslc > 100) {
        error.sslcPercentage = true;
        error.sslcErrorMessage = isEmpty(competitor.sslc) ? "Field Required!" : "Enter Valid Input";
      }
      else {
        error.sslcPercentage = false;
        this.setState({ error })
      }
      if (isEmpty(competitor.ug) || isVaildnum(competitor.ug) || competitor.ug > 100) {
        error.ugPercentage = true;
        error.ugErrorMessage = isEmpty(competitor.ug) ? "Field Required!" : "Enter Valid Input";
      }
      else {
        error.ugPercentage = false;
        this.setState({ error })
      }
      if (isEmpty(competitor.collegeName)) {
        error.college = true;
        error.collegeErrorMessage = "Field Required!"
      }
      else {
        error.college = false;
        this.setState({ error })
      }
      if (isEmpty(competitor.email) || !isValidEmail(competitor.email)) {
        error.email = true;
        error.emailErrorMessage = isEmpty(competitor.email) ? "Field Required!" : "Enter Valid Mail"
      }
      else {
        error.email = false;
        this.setState({ error })
      }
      if (isEmpty(competitor.natureOfJob)) {
        error.jobNatureErrorMessage = 'Filed Required';
        error.natureOfJob = true
      } else {
        error.natureOfJob = false;
        this.setState({ error })
      }
  
      if (error.department || error.gender || error.resume || error.contactNumber || error.district || error.state || error.email || error.firstName || error.hscPercentage || error.ugPercentage || error.college || error.natureOfJob) {
        return
      }
      if (this.state.activeStep === 0) {
        this.setState({
          error,
          activeStep: this.state.activeStep + 1,
        });
      }
    }
  
    steps = this.getSteps();
  
    getSteps() {
      return ["Sign-Up", "Login"];
    }
    getStepContent(stepIndex) {
  
      switch (stepIndex) {
        case 0:
          return (
            <Card style={{ width: '75rem', height: '25rem'}}>
              <form className="email-compose-body">
                <div className="send-header" style={{ marginLeft: '12rem', width: '70%' }}>
                  <div className="row">
                    <div className="col-2 competitor-input" style={{ height: '3rem' }}>
                      <label className="form-label text-label" for="form12">First Name*
                        <FormHelperText className='helper helper-candidate'>{this.state.error.firstName ? this.state.error.firstNameErrorMessage : null}</FormHelperText></label>
                    </div>
                    <div className="col-4 competitor-input">
                      <input className="profile-page" type='name' label='First Name' name='userName' maxLength="50" onChange={(e) => this.handleChange(e, 'firstName')} value={this.state.competitor?.firstName} aria-label="default input example"></input>
                    </div>
                    <div className="col-2 competitor-input" style={{ height: '3rem' }}>
                      <label className="form-label text-label" for="form12">SSLC%*
                        <FormHelperText className='helper helper-candidate'>{this.state.error.sslcPercentage ? this.state.error.sslcErrorMessage : null}</FormHelperText></label>
                    </div>
                    <div className="col-4 competitor-input">
                      <input className="profile-page" type='number' label='SSLC%' name='sslcPercentage' maxLength="5" min={1} max={5} onChange={(e) => this.handleChange(e, 'sslc')} value={this.state.competitor?.sslc} id='SSLC' aria-label="default input example" />
                    </div>
                    <div className="col-2 competitor-input" style={{ height: '3rem' }}>
                      <label className="form-label text-label" for="form12">Last Name</label>
                    </div>
                    <div className="col-4 competitor-input">
                      <input className="profile-page" type='name' label='Last Name' name='lastName' maxLength="50" value={this.state.competitor?.lastName} onChange={(e) => this.handleChange(e, 'lastName')} id='lastName' aria-label="default input example" />
                    </div>
                    <div className="col-2 competitor-input"t style={{ height: '3rem' }}>
                      <label className="form-label text-label" for="form12">HSC%*
                        <FormHelperText className='helper helper-candidate'>{this.state.error.hscPercentage ? this.state.error.hscErrorMessage : null}</FormHelperText></label>
                    </div>
                    <div className="col-4 competitor-input">
                      <input className="profile-page" type='number' label='HSC %' name='hscPercentage' maxLength="5" min={1} max={5} onChange={(e) => this.handleChange(e, 'hsc')} value={this.state.competitor?.hsc} id='hscPercentage' aria-label="default input example" />
                    </div>
                    <div className="col-2 competitor-input" style={{ height: '3rem' }}>
                      <label className="form-label text-label" for="form12">Email*
                        <FormHelperText className='helper helper-candidate'>{this.state.error.email ? this.state.error.emailErrorMessage : null}</FormHelperText></label>
                    </div>
                    <div className="col-4 competitor-input">
                      <input className="profile-page" type='email' label='Email' name='email' maxLength="50" onChange={(e) => this.handleChange(e, 'email')} value={this.state.competitor?.email} id='email' aria-label="default input example" />
                    </div>
                    <div className="col-2 competitor-input" style={{ height: '3rem' }}>
                      <label className="form-label text-label" for="form12">UG%*
                        <FormHelperText className='helper htelper-candidate'>{this.state.error.ugPercentage ? this.state.error.ugErrorMessage : null}</FormHelperText></label>
                    </div>
                    <div className="col-4 competitor-input">
                      <input className="profile-page" type='number' label='UG%' name='ugPercentage' maxLength="5" min={1} max={5} onChange={(e) => this.handleChange(e, 'ug')} value={this.state.competitor?.ug} id='ugPercentage' aria-label="default input example" />
                    </div>
                    <div className="col-2 competitor-input" style={{ height: '3rem' }}>
                      <label className="form-label text-label" for="form12">Contact Number*
                        <FormHelperText className='helper helper-candidate'>{this.state.error.contactNumber ? this.state.error.contactNumberErrorMessage : null}</FormHelperText></label>
                    </div>
                    <div className="col-4 competitor-input">
                      <input className="profile-page" type='name' label='Phone' name='phone' maxLength="10" value={this.state.competitor?.phone} onChange={(e) => this.handleChange(e, 'phone')} id='phone' aria-label="default input example" />
                    </div>
                    <div className="col-2 competitor-input" style={{ height: '3rem' }}>
                      <label className="form-label text-label" for="form12">PG%</label>
                    </div>
                    <div className="col-4 competitor-input">
                      <input className="profile-page" type='number' label='PG%' name='pgPercentage' maxLength="5" min={1} max={5} onChange={(e) => this.handleChange(e, 'pg')} value={this.state.competitor?.pg} id='pgPercentage' aria-label="default input example" ></input>
                    </div>
                    <div className="col-2 competitor-input" style={{ height: '3rem' }}>
                      <label className="form-label text-label" for="form12">State*
                        <FormHelperText className="helper helper-candidate">{this.state.error.state ? this.state.error.stateErrorMessage : null}</FormHelperText></label>
                    </div>
                    <div className="col-4 competitor-input">
                      <select className='profile-page' onChange={(e) => this.handleStateChange(e, 'state')} value={this.state.competitor?.state}>
                        <option hidden selected value="">Select State</option>
                        {Object.keys(States).map((state => {
                          return <option value={state} key={state}>{state}</option>
                        }))}
                      </select>
                    </div>
                    <div className="col-2 competitor-input" style={{ height: '3rem' }}>
                      <label className="form-label text-label" style={{ marginBottom: '0' }}>Department*
                        <FormHelperText className='helper helper-candidate'>{this.state.error.department ? this.state.error.departmentErrorMessage : null}</FormHelperText></label>
                    </div>
                    <div className="col-4 competitor-input">
                      {isEmpty(this.state.competitor?.department) ? <select className='profile-page' name='setting'
                        onChange={(e) => this.setState({ department: e.target.value })}>
                        <option hidden selected value="" style={{ marginLeft: '-5px' }}>Select Department</option>
                        {(this.state.departments || []).map((department) => {
                          return <option value={department.departmentName} key={department.id}>{department.departmentName}</option>
                        })}
                      </select> :
                        <input className="profile-page" maxLength="50"
                          value={this.state.competitor?.department} aria-label="default input example"
                          name='department' id='department' autoComplete='off' type="text" placeholder='Select Department' />
                      }
                    </div>
                    <div className="col-2 competitor-input" style={{ height: '3rem' }}>
                      <label className="form-label text-label" for="form12">District*
                        <FormHelperText className="helper helper-candidate">{this.state.error.district ? this.state.error.districtErrorMessage : null}</FormHelperText></label>
                    </div>
                    <div className="col-4 competitor-input">
                      <select className='profile-page' onChange={(e) => this.handleDistrictChange(e, 'district')} value={this.state.competitor?.district}>
                        <option selected hidden value="">Select District</option>
                        {this.state.districts.map((district => {
                          return <option value={district} key={district}>{district}</option>
                        }))}
                      </select>
                    </div>
                    <div className="col-2 competitor-input" style={{ height: '3rem' }}>
                      <label className="form-label text-label" for="form12">College*
                        <FormHelperText className="helper helper-candidate">{this.state.error.college ? this.state.error.collegeErrorMessage : null}</FormHelperText>
                      </label>
                    </div>
                    <div className="col-4 competitor-input">
                      <input className="profile-page" type='text' label='College Name' name='college' maxLength="50" onChange={(e) => this.handleChange(e, 'collegeName')} id='college' value={this.state.competitor?.collegeName} aria-label="default input example" />
                    </div>
                    <div className="col-2 competitor-input" style={{ height: '3rem' }}>
                      <label className="form-label text-label" >Gender*
                        <FormHelperText className="helper helper-candidate">{this.state.error.gender ? this.state.error.genderErrorMessage : null}</FormHelperText></label>
                    </div>
  
                    <div className="col-4 competitor-input" style={{ paddingLeft: '1rem', height: '48px',display:'flex'}}>
                      <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="customRadioInline1" id="customRadioInline1" checked={this.state.competitor?.gender === "MALE"} value="MALE" onClick={(event) => { this.handleChange(event, "gender") }} />
                        <label className="form-check-label text-label" for="inlineRadio1">Male</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="FEMALE" checked={this.state.competitor?.gender === "FEMALE"} onClick={(event) => { this.handleChange(event, "gender") }} />
                        <label className="form-check-label text-label" for="inlineRadio2">Female</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="OTHERS" checked={this.state.competitor?.gender === "OTHERS"} onClick={(event) => { this.handleChange(event, "gender") }} />
                        <label className="form-check-label text-label" for="inlineRadio3">Others</label>
                      </div>
                    </div>
                    <div className="col-2 competitor-input" style={{ height: '3rem' }}>
                      <label className="form-label text-label" for="form12">Year Of Passing*
                        <FormHelperText className='helper helper-candidate'>{this.state.error.yop ? this.state.yopErrorMessage : null}</FormHelperText></label>
                    </div>
                    <div className="col-4 competitor-input">
                      <DatePick
                          className='profile-page'
                          style={{ border: 'none' }}
                          views={["year"]}
                          minDate={moment().subtract(10, 'years').toDate()}
                          maxDate={moment().add(1, 'years').toDate()}
                          value={this.state.yop}
                          inputProps={{
                            style: { padding: '0px', paddingBottom: '0.2rem', fontSize: '13px', color: 'black', fontWeight: '500', fontFamily: 'Montserrat' },
                          }}
                          onChange={(year)=>this.setState({yop:year})}
                        />
                    </div>
                    <div className="col-2 competitor-input" style={{ height: '3rem' }}>
                      <label className="form-label text-label">Nature of Job*<FormHelperText className="helper helper-candidate" >{this.state.error.natureOfJob ? this.state.error.jobNatureErrorMessage : null}</FormHelperText></label>
                    </div>
                    <div className="col-4 competitor-input">
                      <select className='profile-page' onChange={(e) => this.handleChange(e, 'natureOfJob')} value={this.state.competitor?.natureOfJob}>
                        <option hidden value=''>Select NatureOfJob</option>
                        {["INTERN", "FULL TIME", "BOTH"].map((natureOfJob => {
                          return <option value={natureOfJob} key={natureOfJob}>{natureOfJob}</option>
                        }))}
                      </select>
                    </div>
                    <div className="col-2 competitor-input" style={{ height: '3rem' }}>
                      <label className="form-label text-label">Resume*<FormHelperText className="helper helper-candidate" >{this.state.error.resume ? this.state.error.resumeErrorMessage : null}</FormHelperText></label>
                    </div>
                    <div className="col-4 competitor-input" style={{ marginTop: '0.5rem' }}>
                    <input type="file" style={{ width: '250px' }} class="form-control" id="inputGroupFile02" onChange={(e)=>this.onFileChange(e)} accept={"application/pdf"} defaultValue={this.state.resume} ></input>
                    </div>
                    {/* <div className='col' style={{display:'flex',justifyContent:'flex-end', margin: '1rem 3.2rem auto auto'}}>
                          <button type="submit" className="btn btn-sm btn-nxt" disabled={this.state.disabled} >Update</button>
                        </div> */}
                  </div>
                </div>
              </form>
            </Card>
          )
        case 1:
          return (
            <CardContent>
              <h2 className="font-weight-bold py3" style={{ textAlign: "center" }}>Set Password</h2>
              <Card style={{ width: '75rem', marginLeft: '15px', height: '15rem' }}>
                <div className="row" style={{ marginTop: '2rem' }}>
                  <div className="col-6 competitor-login" style={{ height: '3rem' }}>
                    <label className="form-label text-label" for="form12">Email*
                      <FormHelperText className='helper helper-candidate'>{this.state.error.email ? this.state.error.emailErrorMessage : null}</FormHelperText></label>
                  </div>
                  <div className="col competitor-input" style={{ paddingLeft: '0' }}>
                    <input className="profile-page" type='email' label='Email' name='email' maxLength="50" value={this.state.competitor?.email} id='email' aria-label="default input example" />
                  </div>
                </div>
                <div className="row">
                  <div className="col-6 competitor-login" style={{ height: '3rem' }}>
                    <label className="form-label text-label" for="form12">New Password*
                      <FormHelperText className='helper helper-candidate'>{this.state.loginError.password ? this.state.loginError.passwordErrorMessage : null}</FormHelperText></label>
                  </div>
                  <div className="col competitor-input" style={{ paddingLeft: '0' }}>
                    <input className="profile-page" autoComplete='current-password' label='Password' type='password' name='password' maxLength="20" min={1} max={100} onChange={(e) => this.setState({ password: e.target.value })} value={this.state.password} id='password' aria-label="default input example" />
                  </div>
                </div>
                <div className="row">
                  <div className="col-6 competitor-login" style={{ height: '3rem' }}>
                    <label className="form-label text-label" for="form12">Confirm Password*
                      <FormHelperText className='helper helper-candidate'>{this.state.loginError.cPassword ? this.state.loginError.cPasswordErrorMessage : null}</FormHelperText></label>
                  </div>
                  <div className="col competitor-input" style={{ paddingLeft: '0' }}>
                    <input className="profile-page" autoComplete='current-password' type='password' label='Password' name='password' maxLength="20" min={1} max={100} onChange={(e) => this.setState({ cPassword: e.target.value })} value={this.state.cPassword} id='password' aria-label="default input example" />
                  </div>
                </div>
              </Card>
            </CardContent>
          )
        default:
          this.handleSubmit();
          return "Unknown Step";
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
              <span className='user-header'>Candidate Registration</span>
            </div>
          </div>
          <Stepper activeStep={this.state.activeStep} alternativeLabel style={{ width: '100%', paddingBottom: '0' , marginTop:'2rem'}}>
            {_.map(this.steps, (label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Grid container spacing={2} style={{justifyContent:'center'}}>
            <Grid item xs={10}>
              <List>
                <CardContent style={{ display: 'flex', justifyContent: 'center' }}>
                  {this.getStepContent(this.state.activeStep)}
                </CardContent>
                <div style={{ display: 'flex', justifyContent: 'center'}}>
                  <Button
                    hidden={this.state.activeStep === 0}
                    onClick={this.handleBack} className={style.backButton}
                    style={{ backgroundColor: "#8c8c8c", color: "white", width: "10ch", height: '30px', marginRight: '2rem' }}>Back</Button>
  
                  <Button variant="contained" color="primary" onClick={this.handleNext}
                    disabled={this.state.disabled}
                    style={this.state.activeStep === 0 ?
                      { width: "10ch", height: '30px' } :
                      { height: '30px' }}>
                    {this.state.activeStep === this.steps.length - 1 ?
                      (<div style={{ color: "white" }} onClick={this.handleSubmit}>Submit</div>) :
                      (<div style={{ color: "white" }} onClick={this.handleNext}>Next</div>)}
                  </Button>
                </div>
              </List>
            </Grid>
          </Grid>
  
  
        </div>
      );
    }
  }