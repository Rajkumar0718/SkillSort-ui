import FormHelperText from '@mui/material/FormHelperText';
import DatePick from '../../common/DatePick';
import axios from 'axios';
import moment from 'moment';
import React, { Component } from 'react';
import { authHeader, errorHandler } from '../../api/Api';
import skillsort from '../../assests/images/ProfilePic.png';
import { toastMessage } from '../../utils/CommonUtils';
import States from '../../utils/StatesAndDistricts';
import url from "../../utils/UrlConstant";
import { isEmpty, isValidMobileNo } from "../../utils/Validation";
import _ from "lodash";
export default class CompetitorUpdate extends Component {

  constructor() {
    super();
    const user = JSON.parse(localStorage.getItem('user'));
    this.state = {
      competitor: {
        state: '',
        district: '',
      },
      districts: [],
      departments: [],
      resume: null,
      department: "",
      user: user,
      disabled: false,
      profilePicture: skillsort,
      yearOfPassing: moment().format('YYYY'),
      error: {
        username: false,
        usernameErrorMessage: '',
        email: false,
        emailErrorMessage: '',
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
        phone: false,
        phoneErrorMessage: '',
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
      }
    }
  }

  componentWillMount() {

    axios.get(` ${url.COMPETITOR_API}/testcompetitor/getCompetitor?email=${this.state.user?.email}`, { headers: authHeader() })
      .then(res => {
        if ((this.props.location.pathname === '/competitor')) {
          this.props.navigate('/competitor/testlist');
        }
        else {
          this.setState({ competitor: res.data.response }, () => { this.setProfile(this.state.competitor?.profilePicture) });
        }
      })
  }

  setProfile = (profile) => {
    if (profile) {
      let pic = profile.concat('?').concat(new Date())
      this.setState({ profilePicture: pic });
    }
  }

  componentDidMount() {
    axios.get(` ${url.ADMIN_API}/department?status=ACTIVE`)
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
    const { competitor, error } = this.state;
    // competitor.department = this.state.department
    if (isEmpty(competitor.department)) {
      error.department = true;
      error.departmentErrorMessage = "Select department";
    } else {
      error.department = false;
    }
    if (isEmpty(competitor.resume)) {
      if (this.state.resume == null) {
        error.resume = true;
        error.resumeErrorMessage = "Resume required";
      } else {
        error.resume = false;
      }
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
    if (isEmpty(competitor.phone) && !isValidMobileNo(competitor.phone)) {
      error.phone = true;
      error.phoneErrorMessage = 'Field Required!'
    } else {
      error.phone = false;
    }
    if (isEmpty(competitor.firstName)) {
      error.username = true;
      error.usernameErrorMessage = "Field Required!"
      this.setState({ error })
    }
    else {
      error.username = false;
      this.setState({ error })
    }
    if (isEmpty(competitor.hsc)) {
      error.hscPercentage = true;
      error.hscErrorMessage = "Field Required!"
    }
    else {
      error.hscPercentage = false;
      this.setState({ error })
    }
    if (isEmpty(competitor.sslc)) {
      error.sslcPercentage = true;
      error.sslcErrorMessage = "Field Required!"
    }
    else {
      error.sslcPercentage = false;
      this.setState({ error })
    }
    if (isEmpty(competitor.ug)) {
      error.ugPercentage = true;
      error.ugErrorMessage = "Field Required!"
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
    if (isEmpty(competitor.email)) {
      error.email = true;
      error.emailErrorMessage = "Field Required!"
    }
    else {
      error.email = false;
      this.setState({ error })
    }

    this.setState({ error })
    event.preventDefault();
    if (!error.department && !error.gender && !error.resume && !error.phone && !error.district && !error.state && !error.email && !error.username && !error.hscPercentage && !error.ugPercentage && !error.college) {
      this.setState({ disabled: true })
      const formData = new FormData();
      // competitor.department = this.state.department
      if (!_.isNumber(competitor.yop))
        competitor.yop = moment(competitor.yop).year();
      else
        competitor.yop = competitor.yop === 0 ? moment().year() : competitor.yop;
      formData.append('resume', this.state.resume);
      formData.append('competitor', JSON.stringify(competitor));
      axios.post(` ${url.COMPETITOR_API}/competitor/register`, formData, { headers: authHeader() })
        .then(() => {
          toastMessage('success', "Profile Updated successfully..!");
          this.props.navigate('/competitor/testList');
          let user = JSON.parse(localStorage.getItem('user'))
          user.username = competitor.firstName + ' ' + competitor.lastName
          localStorage.removeItem('user')
          localStorage.setItem('user', JSON.stringify(user))
          window.location.reload()
        })
        .catch(err => {
          this.setState({ disabled: false })
          errorHandler(err);
        })
    }
  }

  getDateFromYop = () => {
    let currentYear = new Date().getFullYear();
    let studentYop = this.state.competitor.yop;

    if (_.isDate(studentYop)) return studentYop;

    if (studentYop) {
      let diff = currentYear - studentYop;
      if (diff < 0) {
        // If studentYop is a future year, create a new Date with that year
        return new Date(studentYop, 0);
      } else {
        // If studentYop is a past or present year, subtract the diff from the current year
        return moment().subtract(diff, 'years').toDate();
      }
    }

    // If studentYop is not defined, return the current date
    return new Date();
  }


  render() {

    return (
      <div className='bg-image'>
        <main className="main-content bcg-clr">
          <div className='card-header-new'>
            <span>Update Your Profile!</span>
          </div>
          <div className="row" style={{ lineHeight: '3rem' }}>
            <div className="col-md-12">
              <form className="email-compose-body" onSubmit={(e) => this.handleSubmit(e)}>
                <div className="row" style={{ height: '100%', overflow: 'hidden' }}>
                  {/* <div className="col-1" style={{ padding: "0.75rem 2rem" }}>
                                        <img src={this.state.profilePicture} className="img-responsive" style={{ height: '12rem', width: '10rem' }} alt="..." />
                                        <div>
                                            <label for='files' style={{ width: '10rem', backgroundColor: '#3B489E', color: 'white', fontWeight: '300', fontSize: '0.9rem', padding: '0' }} className='btn profile-btn'>{this.state.profilePicture === skillsort ? "Upload Profile Picture" : "Update Profile Picture"}</label>
                                            <input type='file' id='files' style={{ visibility: 'hidden' }} accept="image/x-png,image/jpeg" onChange={(e) => this.updateProfilePic(e)} />
                                        </div>
                                    </div> */}
                  <div className="send-header" style={{ marginLeft: '12rem', width: '70%' }}>
                    <div className="row">
                      <div className="col-2 competitor-input" style={{ height: '3rem' }}>
                        <label className="form-label text-label" for="form12">First Name
                          <FormHelperText className='helper helper-candidate'>{this.state.error.username ? this.state.error.usernameErrorMessage : null}</FormHelperText></label>
                      </div>
                      <div className="col-4 competitor-input">
                        <input className="profile-page" type='name' label='First Name' name='username' maxLength="50" value={this.state.competitor?.firstName} onChange={(e) => this.handleChange(e, 'firstName')} aria-label="default input example"></input>
                      </div>
                      <div className="col-2 competitor-input" style={{ height: '3rem' }}>
                        <label className="form-label text-label" for="form12">SSLC*
                          <FormHelperText className='helper helper-candidate'>{this.state.error.sslcPercentage ? this.state.error.sslcErrorMessage : null}</FormHelperText></label>
                      </div>
                      <div className="col-4 competitor-input">
                        <input className="profile-page" type='number' label='SSLC %' name='sslcPercentage' maxLength="5" min={1} max={100} onChange={(e) => this.handleChange(e, 'sslc')} value={this.state.competitor?.sslc} id='SSLC' aria-label="default input example" />
                      </div>
                      <div className="col-2 competitor-input" style={{ height: '3rem' }}>
                        <label className="form-label text-label" for="form12">Last Name</label>
                      </div>
                      <div className="col-4 competitor-input">
                        <input className="profile-page" type='name' label='Last Name' name='lastName' maxLength="50" value={this.state.competitor?.lastName} onChange={(e) => this.handleChange(e, 'lastName')} id='lastName' aria-label="default input example" />
                      </div>
                      <div className="col-2 competitor-input" style={{ height: '3rem' }}>
                        <label className="form-label text-label" for="form12">HSC%
                          <FormHelperText className='helper helper-candidate'>{this.state.error.hscPercentage ? this.state.error.hscErrorMessage : null}</FormHelperText></label>
                      </div>
                      <div className="col-4 competitor-input">
                        <input className="profile-page" type='number' label='HSC %' name='hscPercentage' maxLength="5" min={1} max={100} onChange={(e) => this.handleChange(e, 'hsc')} value={this.state.competitor?.hsc} id='hscPercentage' aria-label="default input example" />
                      </div>
                      <div className="col-2 competitor-input" style={{ height: '3rem' }}>
                        <label className="form-label text-label" for="form12">Email
                          <FormHelperText className='helper helper-candidate'>{this.state.error.email ? this.state.error.emailErrorMessage : null}</FormHelperText></label>
                      </div>
                      <div className="col-4 competitor-input">
                        <input className="profile-page" type='email' label='Email' name='email' maxLength="50" onChange={(e) => this.handleChange(e, 'email')} value={this.state.user?.email} id='email' aria-label="default input example" />
                      </div>
                      <div className="col-2 competitor-input" style={{ height: '3rem' }}>
                        <label className="form-label text-label" for="form12">UG*
                          <FormHelperText className='helper helper-candidate'>{this.state.error.ugPercentage ? this.state.error.ugErrorMessage : null}</FormHelperText></label>
                      </div>
                      <div className="col-4 competitor-input">
                        <input className="profile-page" type='number' label='UG %' name='ugPercentage' maxLength="5" min={1} max={100} onChange={(e) => this.handleChange(e, 'ug')} value={this.state.competitor?.ug} id='hscPercentage' aria-label="default input example" />
                      </div>
                      <div className="col-2 competitor-input" style={{ height: '3rem' }}>
                        <label className="form-label text-label" for="form12">Phone*
                          <FormHelperText className='helper helper-candidate'>{this.state.error.phone ? this.state.error.phoneErrorMessage : null}</FormHelperText></label>
                      </div>
                      <div className="col-4 competitor-input">
                        <input className="profile-page" type='name' label='Phone' name='phone' maxLength="10" value={this.state.competitor?.phone} onChange={(e) => this.handleChange(e, 'phone')} id='phone' aria-label="default input example" />
                      </div>
                      <div className="col-2 competitor-input" style={{ height: '3rem' }}>
                        <label className="form-label text-label" for="form12">PG</label>
                      </div>
                      <div className="col-4 competitor-input">
                        <input className="profile-page" type='number' label='PG %' name='pgPercentage' maxLength="5" min={1} max={100} onChange={(e) => this.handleChange(e, 'pg')} value={this.state.competitor?.pg} id='pgPercentage' aria-label="default input example" ></input>
                      </div>
                      <div className="col-2 competitor-input" style={{ height: '3rem' }}>
                        <label className="form-label text-label" for="form12">State
                          <FormHelperText className="helper helper-candidate">{this.state.error.state ? this.state.error.stateErrorMessage : null}</FormHelperText></label>
                      </div>
                      <div className="col-4 competitor-input">
                        <select className='profile-page' onChange={(e) => this.handleStateChange(e, 'state')} value={this.state.competitor?.state}>
                          <option hidden selected value="">Select State</option>
                          {Object.keys(States).map((state => {
                            return <option value={this.competitor?.state}>{state}</option>
                          }))}
                        </select>
                      </div>
                      <div className="col-2 competitor-input" style={{ height: '3rem' }}>
                        <label className="form-label text-label" for="form12">Year Of Passing
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
                          onChange={(year) => this.setState({ yop: year })}
                        />
                      </div>
                      <div className="col-2 competitor-input" style={{ height: '3rem' }}>
                        <label className="form-label text-label" for="form12">District
                          <FormHelperText className="helper helper-candidate">{this.state.error.district ? this.state.error.districtErrorMessage : null}</FormHelperText></label>
                      </div>
                      <div className="col-4 competitor-input">
                        <select className='profile-page' onChange={(e) => this.handleDistrictChange(e, 'district')} value={this.state.competitor?.district}>
                          <option selected hidden value="">{this.state.competitor?.district ? this.state.competitor?.district : 'Select District'}</option>
                          {this.state.districts.map((district => {
                            return <option value={district}>{district}</option>
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
                            return <option value={department.departmentName}>{department.departmentName}</option>
                          })}
                        </select> :
                          <input className="profile-page" maxLength="50"
                            value={this.state.competitor?.department} aria-label="default input example"
                            name='department' id='department' autoComplete='off' type="text" placeholder='Select Department' />
                        }
                      </div>
                      <div className="col-2 competitor-input" style={{ height: '3rem' }}>
                        <label className="form-label text-label" >Gender*
                          <FormHelperText className="helper helper-candidate">{this.state.error.gender ? this.state.error.genderErrorMessage : null}</FormHelperText></label>
                      </div>
                      <div className="col-4 competitor-input" style={{ paddingLeft: '1rem', height: '48px' }}>
                        <div className="form-check form-check-inline">
                          <input className="form-check-input" type="radio" name="customRadioInline1" id="customRadioInline1" checked={this.state.competitor?.gender === "MALE"} value="MALE" onClick={(event) => { this.handleChange(event, "gender") }} />
                          <label className="form-check-label text-label" for="inlineRadio1" style={{ display: 'flex' }}>Male</label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="FEMALE" checked={this.state.competitor?.gender === "FEMALE"} onClick={(event) => { this.handleChange(event, "gender") }} />
                          <label className="form-check-label text-label" for="inlineRadio2" style={{ display: 'flex' }}>Female</label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="OTHERS" checked={this.state.competitor?.gender === "OTHERS"} onClick={(event) => { this.handleChange(event, "gender") }} />
                          <label className="form-check-label text-label" for="inlineRadio3" style={{ display: 'flex' }}>Others</label>
                        </div>
                      </div>
                      <div className="col-2 competitor-input" style={{ height: '3rem' }}>
                        <label className="form-label text-label" for="form12">College*
                          <FormHelperText className="helper helper-candidate">{this.state.error.college ? this.state.error.collegeErrorMessage : null}</FormHelperText>
                        </label>
                      </div>
                      <div className="col-4 competitor-input">
                        <input className="profile-page" type='name' label='College Name' name='collegeName' maxLength="50" onChange={(e) => this.handleChange(e, 'college')} id='collegeName' value={this.state.competitor?.collegeName} aria-label="default input example" />
                      </div>
                      <div className="col-2 competitor-input" style={{ height: '3rem' }}>
                        <label className="form-label text-label">Job Nature*<FormHelperText className="helper helper-candidate" >{this.state.error.natureOfJob ? this.state.error.jobNatureErrorMessage : null}</FormHelperText></label>
                      </div>
                      <div className="col-4 competitor-input">
                        <select className='profile-page' onChange={(e) => this.handleChange(e, 'natureOfJob')} value={this.state.competitor?.natureOfJob}>
                          <option selected hidden value="">Nature Of Job</option>
                          {["INTERN", "FULL TIME", "BOTH"].map((district => {
                            return <option value={district}>{district}</option>
                          }))}
                        </select>
                      </div>
                      <div className="col-2 competitor-input" style={{ height: '3rem' }}>
                        <label className="form-label text-label">Resume*<FormHelperText className="helper helper-candidate" >{this.state.error.resume ? this.state.error.resumeErrorMessage : null}</FormHelperText></label>
                      </div>
                      <div className="col-4 competitor-input" style={{ marginTop: '0.5rem' }}>
                        {/* <input type="file" className="custom-file-input" onChange={(e) => this.onFileChange(e, 'resume')} accept={"application/pdf"} style={{ width: '311px', marginLeft: '5px' }} /> */}
                        <input type="file" style={{ width: '250px' }} class="form-control" id="inputGroupFile02" onChange={(e) => this.onFileChange(e, 'resume')} accept={"application/pdf"}  ></input>
                        {/* <label className="custom-file-label text-label" style={{ width: '255px', marginLeft: '14px' }} value={this.state.competitor?.resume}>{this.state.resume ? this.state.resume?.name : "pdf only"}</label> */}
                      </div>
                      <div className='col-12' style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1.86rem', paddingRight: '2.7rem' }}>
                        <button type="submit" className="btn btn-sm btn-nxt" disabled={this.state.disabled} >Update</button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  }
}