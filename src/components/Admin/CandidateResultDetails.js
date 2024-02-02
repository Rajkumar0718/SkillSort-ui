import { Avatar, Grid, List } from '@mui/material';
import axios from 'axios';
import _ from 'lodash';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { authHeader, errorHandler } from '../../api/Api';
import '../../assests/css/candidateDetails/CandidateDetails.css';
import qualification from '../../assests/images/degree.png';
import LOGO from '../../assests/images/LOGO.svg';
import profile from '../../assests/images/profileCandidate.png';
import '../../common/Common.css';
import url  from '../../utils/UrlConstant';
import ScreenShotModal from './ScreenShotModal';
import ViewProfile from './ViewProfile';

const statusColors = {
  SCHEDULED: '#28a745',
  NOTIFIED_TO_SKILL_SORT: '#28a745',
  SELECTED: '#28a745',
  PENDING: '#17a2b8',
  REJECTED: 'red',
  HOLD: '#ffc107'
}

const path = window.location.pathname.replace('/admin/result/candidate/details/', '');
export default class CandidateResultDetails extends Component {
  constructor(props) {
    super(props);
    let data = {}
    if (localStorage.getItem(path)) {
      sessionStorage.setItem(path, localStorage.getItem(path));
      localStorage.removeItem(path);
    }
    data = JSON.parse(sessionStorage.getItem(path));
    let l = data.results
    _.map(l,e=>{
      l.push(e)
    })
    _.map(data.results,r=>{
      l.push(r)
    })
    this.state = {
      results: l,
      user: data.candidate,
      id: '',
      pdfData: {},
      numPages: 1,
      pageNumber: 1,
      resume: '',
      examId: data.examId,
      category: [],
      viewProfile: false,
      totalResult: data,
      examMonitor: {},
      candidateStatus: data.candidate.candidateStatus !== 'PENDING' ? true : false,
      screenShot: {},
      screenShotModal: false,
      mcqScreenShots: [],
      skillSetModal: false
    }
  }
  componentDidMount() {
    axios.get(` ${url.ADMIN_API}/candidate/resume/${this.state.user?.id}`, { headers: authHeader(), responseType: 'blob' })
      .then(res => {
        const pdf = {}
        let url = window.URL.createObjectURL(res.data);
        pdf.data = url.concat("#toolbar=0")
        this.setState({ pdfData: pdf })
      }).catch(e => {
        errorHandler(e);
      })
    axios.get(` ${url.ADMIN_API}/exam/${this.state.examId}`, { headers: authHeader() })
      .then(res => {
        this.setState({ category: res.data.response.categories, id: this.state.user?.id })
        let data = JSON.parse(sessionStorage.getItem(path))
        data.isProgrammingCamera = res.data.response.isProgrammingCamera
        sessionStorage.setItem(path, JSON.stringify(data))
      }).catch(e => {
        errorHandler(e);
      })
    this.getExamMonitor();
    this.getScreenShot();
    // this.getMcqQuestionIds()
  }

  getMcqQuestionIds = () => {
    let questionIds = []
    let mcqScreenShots = []
    _.map(this.state.totalResult.submittedExam, res => {
      if (res.question?.questionType === 'MCQ')
        questionIds.push(res.question.id)
    })
    _.map(this.state.screenShot?.base64String, r => {
      if (questionIds.includes(r.questionId)) {
        mcqScreenShots.push(r)
        this.setState({ mcqScreenShots: mcqScreenShots })
      }
    })
  }

  getExamMonitor = () => {
    axios.get(`${url.CANDIDATE_API}/candidate/exam-monitor/${this.state.examId}/${this.state.user?.email}`, { headers: authHeader() })
      .then(res => this.setState({ examMonitor: res.data.response }))
      .catch(e => errorHandler(e));
  }

  handleStatusChange = (event) => {
    const user = this.state.user;
    user.candidateStatus = event.target.value;
    this.setState({ user: user });
  }

  getScreenShot = () => {
    axios.get(`${url.ADMIN_API}/onlineTest/getScreenShot?candidateId=${path}&examId=${this.state.examId}`, { headers: authHeader() })
      .then(res => {
        this.setState({ screenShot: res.data.response }, () => this.getProfilePic())
      }
      ).catch(er =>
        errorHandler(er))
  }

  getProfilePic = () => {
    this.getMcqQuestionIds()
    if (this.state.screenShot) {
      axios.get(`${url.ADMIN_API}/onlineTest/getScreenShotImage?path=${this.state.screenShot?.profilePath}`, { headers: authHeader() })
        .then(res => {
          this.setState({ profilePic: res.data.message })
        })
    }
  }

  enlargeImg() {
    let img = document.getElementById("img");
    img.style.transform = "scale(2.5)";
    img.style.transition = "transform 0.25s ease";
    img.style.zIndex = 100
  }

  reSizeImg = () => {
    let img = document.getElementById("img");
    img.style.width = "180";
    img.style.height = "180";
    img.style.transform = "";
    img.style.transition = "";
  }

  handleSubmit = () => {
    axios.post(`${url.ADMIN_API}/candidate/update/status`, this.state.user, { headers: authHeader() })
      .then(res => {
        let id = path;
        localStorage.removeItem(id)
        window.close();
      })
      .catch(error => errorHandler(error));
  }


  setCandidate = () => {
    if (!localStorage.getItem(path)) {
      let data = JSON.parse(sessionStorage.getItem(path));
      data['screenShot'] = this.state.screenShot;
      localStorage.setItem(path, JSON.stringify(data));
    }
    localStorage.setItem("examMonitor", JSON.stringify(this.state.examMonitor));
  }

  getColorsForSkill = (cat,res)=>{
    let r = this.calculateSkill(cat,res);
    if(r ==='Need to improve'){
      return 'red'
    }
    else if(r ==='Good' || r==='Very Good'){
      return '#1b9403'
    }
    else return 'blue'
  }

  calculateSkill = (category,result)=>{
    let takenPercantage = ((result.totalMarks) / (category.totalInSection) * 100).toFixed(0)
    if(takenPercantage < 60){
      return "Need to improve"
    }
    else if(takenPercantage >=60 && takenPercantage <= 70){
      return "Good"
    }
    else if(takenPercantage >70 && takenPercantage <= 80){
      return "Very Good"
    }
    else{
      return "Excellent"
    }
  }

  renderTable = () => {
    return (this.state.category?.length > 0 ? _.map(this.state.category, (category) => {
      return (
        this.state.results?.length > 0 ? _.map(this.state.results, (result) => {
          if (result.section === category.sectionName && result.section !== 'PROGRAMMING') {
            return (
              <tr className='rowdesign' style={{ paddingLeft: '15px' }}>
                <td style={{ color: '#000000' }}>{result.section}</td>
                <td style={{ color: '#000000', fontWeight: '400', fontSize: '13px' }}>{category.simple !== 0 ? (((result.easy) / (category.simple) * 100).toFixed(0)) : 0}</td>
                <td style={{ fontWeight: '400', color: '#000000', fontSize: '13px' }}>{category.medium !== 0 ? (((result.medium) / (category.medium) * 100).toFixed(0)) : 0}</td>
                <td style={{ fontWeight: '400', color: '#000000', fontSize: '13' }}>{category.complex !== 0 ? (((result.hard) / (category.complex) * 100).toFixed(0)) : 0}</td>
                <td style={{ fontWeight: '400', color: '#000000', fontSize: '13px', paddingLeft: '0px' }}>{category.totalInSection !== 0 ? (((result.totalMarks) / (category.totalInSection) * 100).toFixed(0)) : 0}</td>
                <td style={{ fontWeight: '400', color: this.getColorsForSkill(category,result), fontSize: '13px', paddingLeft: '0px' }}><b>{this.calculateSkill(category,result)}</b></td>
              </tr>)
          }
        }) : null)
    }) : null)
  }
  programRender = () => {
    return (
      this.state.results?.length > 0 ? _.map(this.state.results, (program) => {
        if (program.section === 'PROGRAMMING') {
          return (
            // <div className='col-4 col-lg-4'>
            <Link style={{color:'#3b489e'}} to={{ pathname: '/admin/result/candidate/programResult/' + this.state.user.id }} onClick={() => this.setCandidate()} target={'_blank'}>View program and Images</Link>
            // </div>
          )
        }
      }) : null)
  }

  openModal = () => {
    this.setState({ screenShotModal: true })
  }

  onClickOpenModel = (e) => {
    if (!this.state.viewProfile) {
      document.addEventListener("click", this.handleOutSideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutSideClick, false)
    }
    this.setState({ viewProfile: !this.state.viewProfile })
  }

  handleOutSideClick = (e) => {
    if (e.target.className === "modal fade show") {
      this.setState({ viewProfile: !this.state.viewProfile })
    }
  }

  close = () => {
    this.setState({viewProfile: false})
  }

  onCloseModal = () => {
    this.setState({ screenShotModal: false })
  }

  screenShotRender = () => {
    return (
      this.state.mcqScreenShots?.length > 0 ?
        // <div className='col-4 col-lg-4'>
        <Link onClick={() => this.openModal()} >View MCQ Images</Link>
        : null
    )
  }


  render() {
    const data = JSON.parse(sessionStorage.getItem(path)) || {};
    const isSelected = this.state.user.candidateStatus === "SCHEDULED" || this.state.user.candidateStatus === "NOTIFIED_TO_SKILL_SORT"
    return (
      <div>
        <div className="d-flex" id="wrapper">
          <div id="page-content-wrapper" style={{ position: 'absolute', paddingLeft: '0px' }}>
            <div className='header'>
              <img className='header-logo' src={LOGO} alt="SkillSort" />
              <div className='header-right'>
                <div className='header-right-a header-name-content'>
                </div>
              </div>
            </div>
            <div className="modal-content" style={{ overflowY: 'auto', height: 'calc(100vh - 60px)', paddingRight: '30px' }}>
              <div className="modal-header" style={{ border: 'none' }} onClick={this.state.profilePic ? this.reSizeImg : null}>
                <h6 style={{ fontSize: '50px', paddingTop: '5px', fontFamily: 'Baskervville', color: '#000000', paddingLeft: '130px' }}>Candidate Result</h6>
                <div>
                  <p style={{ marginBottom: "0px", marginTop: '15px', fontSize: '30px', color: statusColors[data.candidate.candidateStatus], fontFamily: 'Baskervville', paddingRight: '110px' }}>
                    {isSelected ? "SELECTED" : (data.candidate && data.candidate.candidateStatus !== 'PENDING' ? data.candidate.candidateStatus : '')}
                  </p>
                </div>
              </div>
              <div className="backPic">
                <div className="modal-body" style={{overflowX:'hidden'}}>
                  <div>
                    <div className="row m-l-0 m-r-0">
                      <div className="col-sm-4 user-profile">
                        <div className='row' style={{ display: 'contents' }}>
                          <div className="card-block content-align" style={{marginLeft:"-2rem"}} >
                            {this.state.profilePic ? <Avatar id='img' onClick={this.enlargeImg} style={{ width: 180, height: 180 }} src={`data:image/png;base64,${this.state.profilePic}`} alt="profile" /> :
                              <img src={profile} alt="profile" />
                            }
                            <h4 className="f-w-600 mt-4" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', lineHeight: '1.2', color: '#3B489E', fontFamily: 'Montserrat' }}>{this.state.user.firstName} {this.state.user.lastName}</h4>
                            <h5 style={{ fontWeight: '400', color: '#000000', fontSize: '13px', marginBottom: '18px' }}><img src={qualification} alt="" style={{ width: '30px', marginLeft: '-36px' }} /> {this.state.user.qualification}</h5>
                            <p style={{ fontWeight: '400', color: '#000000', fontSize: '13px', marginBottom: '0px' }}>{this.state.user.email}</p>
                            <p style={{ fontWeight: '400', color: '#000000', fontSize: '13px', marginBottom: '0px' }}>{this.state.user.phone}</p>
                          </div>
                        </div>
                        <div className='row' style={{ display: 'contents' }}>
                          <div className='card-block content-align' style={{ paddingTop: '0px' }}>
                            <button onClick={this.onClickOpenModel} className='btn btn-sm btn-nxt' style={{ fontFamily: 'Montserrat' }}>View Resume</button>
                          </div>
                        </div>
                      </div>
                      <div className='verticalline' style={{marginLeft:"28rem",marginTop:"-25rem"}}>
                      </div>

                      <div onClick={this.state.profilePic ? this.reSizeImg : null} className="card-block" style={{marginLeft:"30.5rem",marginTop:"-29rem"}}>
                        <h6 className="m-b-20 p-b-5 b-b-default f-w-600" style={{ border: 'none', color: '#fc3f06' }}>ACADAMIC</h6>
                        <div className="row">
                          <div className="col-sm-2" style={{width:"5rem"}}>
                            <p className="m-b-10 f-w-400">SSLC</p>
                            <h6 className="f-w-600">{this.state.user.sslcPercentage}%</h6>
                          </div>
                          <div className="col-sm-2" style={{width:"5rem"}}>
                            <p className="m-b-10 f-w-400" >HSC</p>
                            <h6 className="f-w-600">{this.state.user.hscPercentage}%</h6>
                          </div>
                          <div className="col-sm-2" style={{width:"5rem"}}>
                            <p className="m-b-10 f-w-400">UG</p>
                            <h6 className="f-w-600">{this.state.user.ugPercentage}%</h6>
                          </div>
                          {this.state.user.pgPercentage ? <div className="col-sm-2">
                            <p className="m-b-10 f-w-400">PG</p>
                            <h6 className="f-w-600">{this.state.user.pgPercentage}%</h6>
                          </div> : ''}
                          <div className="col-sm-6">
                            <p className="m-b-10 f-w-400">Institution</p>
                            <h6 className="f-w-600">{this.state.user.institution}</h6>
                          </div>
                        </div>
                        <h6 className="m-b-20 m-t-40 p-b-5 b-b-default f-w-600" style={{ border: 'none', color: '#fc3f06', marginBottom: '0px', marginTop: '50px' }}>ONLINE TEST SCORE</h6>
                        <div className="row" style={{ paddingLeft: '15px', width: '46rem' }}>
                          <table className="table table-hover" style={{ opacity: '65%', marginBottom: '0px' }}>
                            <thead style={{ backgroundColor: '#E0E1EA' }}>
                              <tr style={{textAlign:'left' }}>
                                <th className='thdesign' style={{ fontWeight: '2000', color: '#000000'}}>Section</th>
                                <th className='thdesign' style={{ fontWeight: '2000', color: '#000000' }}>Simple %</th>
                                <th className='thdesign' style={{ fontWeight: '2000', color: '#000000' }}>Medium %</th>
                                <th className='thdesign' style={{ fontWeight: '2000', color: '#000000' }}>Complex %</th>
                                <th className='thdesign' style={{ fontWeight: '2000', color: '#000000' }}>Total %</th>
                                <th className='thdesign' style={{ fontWeight: '2000', color: '#000000' }}>Analysis</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.renderTable()}
                            </tbody>
                          </table>
                          <Grid container spacing={1}>
                            <Grid item xs={8}>
                              <List>
                                {this.programRender()}
                                {_.size(_.filter(this.state.results, res => res.section === 'PROGRAMMING')) > 0 ? <br /> : ''}
                                {this.screenShotRender()}
                              </List>
                            </Grid>
                            {/* <Grid item xs={2}>
                              <p className='pull-right' style={{paddingRight:'1rem'}}><strong>{this.percentageCal()}</strong></p>
                            </Grid> */}
                          </Grid>
                          <div style={{ width: '45rem', display: 'flex', justifyContent: 'flex-end' }}>
                            {!isSelected ? <select name='setting' style={{ marginTop: '15px', border: '1px solid #3B489E', borderRadius: '8px', padding: '0 8px 0 10px', background: 'none' }} onChange={(e) => this.handleStatusChange(e)} value={this.state.user.candidateStatus || ''}>
                              <option hidden value='PENDING'>STATUS</option>
                              <option value='SELECTED'>SELECTED</option>
                              <option value='HOLD'>HOLD</option>
                              <option value='REJECTED'>REJECTED</option>
                            </select> : ""}
                            {!isSelected ? (!this.state.candidateStatus ?
                              <button onClick={() => this.handleSubmit()} className='btn btn-sm btn-prev' style={{ marginTop: '15px', marginLeft: '10px' }}>Submit</button> :
                              <button type="button" onClick={() => this.handleSubmit()} className='btn btn-sm btn-prev' style={{ marginTop: '15px', marginLeft: '10px' }}>Update</button>
                            ) : ''}
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {this.state.viewProfile ? <ViewProfile pdfData={this.state.pdfData.data} onClose={this.close} />: null}
        {this.state.screenShotModal ?
          <div>
            <ScreenShotModal screenShots={this.state.mcqScreenShots} onCloseModal={this.onCloseModal} />
          </div> : ''
        }
      </div>
    );
  }
}
