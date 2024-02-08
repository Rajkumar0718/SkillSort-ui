import { Avatar } from '@mui/material';
import axios from 'axios';
import _ from 'lodash';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { authHeader, errorHandler } from '../../api/Api';
import qualification from '../../assests/images/degree.png';
import LOGO from '../../assests/images/LOGO.svg';
import profile from '../../assests/images/profileCandidate.png';
import ViewProfile from '../Admin/ViewProfile';
import  url from "../../utils/UrlConstant";

const path = window.location.pathname.replace('/examResult/', '')
export default class TestResults extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showProgramBtn: false,
      certificateData:[],
      profilePic: {}
    }
    let data = {}
    if (localStorage.getItem(path)) {
      sessionStorage.setItem(path, localStorage.getItem(path));
      localStorage.removeItem(path);
    }
    data = JSON.parse(sessionStorage.getItem(path));
    this.state = {
      user: data
    }
  }

  componentDidMount() {
    axios.get(`${url.ADMIN_API}/company/exam-results/${path}`, { headers: authHeader() })
      .then(res => {
        const results = res.data.response;
        const screenShot = _.filter(results, "screenShot")
        if (_.size(screenShot) > 0) {
          localStorage.setItem("candidateId", screenShot[0].screenShot.id.candidateId)
          this.setState({ candidateId: screenShot[0].screenShot.candidateId })
        }
        this.setState({ results: res.data.response, programmingRound: _.filter(res.data.response, (r) => r.programmingRound),sqlRound: _.filter(res.data.response, (r) => r.sqlRound) }, () => this.getExamMonitor())
      }).catch((er) =>
        errorHandler(er)
      )
    this.getResume()
    this.getCertificate()
  }

  getProfilePic = () => {
    if (_.size(this.state.results) === 3 && (this.state.programmingRound[0]?.screenShot || this.state.sqlRound[0]?.screenShot)) {
      const path = this.state.programmingRound[0]?.screenShot ? this.state.programmingRound[0]?.screenShot.profilePath : this.state.sqlRound[0]?.screenShot.profilePath
      axios.get(`${url.ADMIN_API}/onlineTest/getScreenShotImage?path=${path}`, { headers: authHeader() })
        .then(res => {
          this.setState({ profilePic: res.data.message })
        })
    }
  }

  getExamMonitor = () => {
    return _.map(this.state.results, (r) => {
      return r.programmingRound || r.sqlRound ? axios.get(`${url.CANDIDATE_API}/candidate/exam-monitor/${r.examId}/${this.state.user.email}`, { headers: authHeader() })
        .then(res => {
          this.setState({ examMonitor: res.data.response }, () => this.getProfilePic())
          localStorage.setItem('examId', res.data.response.examId)
        }
        )
        .catch(e => errorHandler(e)) : null
    })
  }


  getResume = () => {
    axios.get(` ${url.ADMIN_API}/company/resume/${this.state.user?.id}`, { headers: authHeader(), responseType: 'blob' })
      .then(res => {
        const pdf = {}
        let url = window.URL.createObjectURL(res.data);
        pdf.data = url.concat("#toolbar=0")
        this.setState({ pdfData: pdf })
        console.log(pdf,"pdf");
      }).catch(e => {
        errorHandler(e);
      })
  }

  close = () => {
    this.setState({ viewProfile: false })
  }

  getCertificate=()=>{
    axios.get(`${url.COLLEGE_API}/certificate?studentId=${this.state.user?.id}`,{headers:authHeader()})
    .then(res=>{
      this.setState({ certificateData: res.data.response })
    }).catch(e => {
      errorHandler(e);
    })
  }

  renderTable = () => {
    return _.size(this.state.results) > 0 ?
      _.map(this.state.results, (result, index) => {
        if (index !== "3") {
          return _.map(result.results, (res) => {
            return (
              <tr className='rowdesign' style={{ paddingLeft: '15px' }}>
                <td style={{ color: '#000000' }}>{res.section}</td>
                <td style={{ color: '#000000', fontWeight: '400', fontSize: '13px' }}>{res.easy !== 0 ? (((res.easy) / (res.totalInEasy) * 100).toFixed(0)) : 0}</td>
                <td style={{ fontWeight: '400', color: '#000000', fontSize: '13px' }}>{res.medium !== 0 ? (((res.medium) / (res.totalInMedium) * 100).toFixed(0)) : 0}</td>
                <td style={{ fontWeight: '400', color: '#000000', fontSize: '13' }}>{res.hard !== 0 ? (((res.hard) / (res.totalInHard) * 100).toFixed(0)) : 0}</td>
                <td style={{ fontWeight: '400', color: '#000000', fontSize: '13px', paddingLeft: '0px' }}>{res.totalInSection !== 0 ? (((res.totalMarks) / (res.totalInSection) * 100).toFixed(0)) : 0}</td>
              </tr>)
          })
        }
      })
      : null

  }

  percentageCal() {
    let totalMark = 0;
    let totalQuestion = 0;
    let marks = 0;
    _.map(this.state.results, (result, index) => {
      if (index !== "3") {
        _.map(result.results, (res) => {
          totalMark += res.totalMarks;
          totalQuestion += res.totalInSection;
        })
      }
    })
    marks = ((totalMark / totalQuestion) * 100).toFixed(0);
    return isNaN(marks) ? "-" : marks + "%";
  }

  setCandidate = () => {
    let user = localStorage.getItem(path)
    if (!user) {
      user = JSON.parse(sessionStorage.getItem(path))
      user.submittedExam = this.state.programmingRound[0].submittedExam || this.state.sqlRound[0].submittedExam;
      user.screenShot = this.state.programmingRound[0]?.screenShot || this.state.sqlRound[0]?.screenShot;
      user.sqlRound = _.size(this.state.sqlRound) > 0;
      user.programmingRound = _.size(this.state.programmingRound) > 0
      localStorage.setItem(path, JSON.stringify(user));
    }
    localStorage.setItem("examMonitor", JSON.stringify(this.state.examMonitor));
  }

  programRender = () => {
    return _.map(this.state.results, (r) => {
      return r.programmingRound || r.sqlRound ? <Link className='btn btn-sm btn-prev' to={{ pathname: '/admin/result/candidate/programResult/' + path }} onClick={() => this.setCandidate()} target={'_blank'}>{!r.sqlRound ? 'VIEW PROGRAMMING' :'VIEW SQL'}</Link> : null
    })
  }

  setCandidateId = () => {
    let id = localStorage.getItem('candidateId')
    if (!id) {
      localStorage.setItem('candidateId', this.state.candidateId)
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

  render() {
    return (
      <div >
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
              <div className="modal-header" style={{ border: 'none', padding:"1rem 1rem" }} onClick={this.state.profilePic ? this.reSizeImg : null} >
                <h6 style={{ fontSize: '50px', paddingTop: '5px', fontFamily: 'Baskervville', color: '#000000', paddingLeft: '130px' }}>Test Result</h6>
                <div className="score-card">
                  <span className="username"> Skillsort Score :</span> <span className="score">{this.state.user.skillSortScore}</span>
                </div>
              </div>
              <div className="backPic">
                <div className="modal-body">
                  <div>
                    <div style={{display:"flex"}}>
                      <div className="col-sm-4 user-profile">
                          <div className="card-block content-align" >
                            {this.state.profilePic ? <Avatar onClick={this.enlargeImg} id='img' style={{ width: 180, height: 180 }} src={`data:image/png;base64,${this.state.profilePic}`} alt="profile" /> :
                              <img src={profile} alt="profile" />
                            }
                            <h4 className="f-w-600 mt-4" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', lineHeight: '1.2', color: '#3B489E', fontFamily: 'Montserrat' }}>{this.state.user.firstName} {this.state.user.lastName}</h4>
                            <h5 style={{ fontWeight: '400', color: '#000000', fontSize: '13px', marginBottom: '18px' }}><img src={qualification} alt="" style={{ width: '30px', marginLeft: '-36px' }} /> {this.state.user.qualification}</h5>
                            <p style={{ fontWeight: '400', color: '#000000', fontSize: '13px', marginBottom: '0px' }}>{this.state.user.email}</p>
                            <p style={{ fontWeight: '400', color: '#000000', fontSize: '13px', marginBottom: '0px' }}>{this.state.user.phone}</p>
                          </div>
                        <div className='row' style={{ display: 'flex',float:'right' }}>
                          <div className='card-block content-align' style={{ paddingTop: '0px' }}>
                            <button onClick={() => this.setState({ viewProfile: !this.state?.viewProfile,type:'resume'})} className='btn btn-sm btn-nxt' style={{ fontFamily: 'Montserrat' }}>View Resume</button>
                          </div>
                          {_.size(this.state.certificateData) >0 ? <div className='card-block content-align' style={{ paddingTop: '0px' }}>
                            <button onClick={() => this.setState({ viewProfile: !this.state.viewProfile,type:'certificate'})} className='btn btn-sm btn-nxt' style={{ fontFamily: 'Montserrat' }} >View Certificate</button>
                          </div> : null}
                        </div>
                      </div>  




                      <div className='verticalline'>
                      </div>

                      <div onClick={this.state.profilePic ? this.reSizeImg : null} className="card-block">
                        <h6 className="m-b-20 p-b-5 b-b-default f-w-600" style={{ border: 'none', color: '#fc3f06' }}>ACADAMIC</h6>
                        <div className="row">
                          <div className="col-sm-2">
                            <p className="m-b-10 f-w-400">SSLC</p>
                            <h6 className="f-w-600">{this.state.user.sslc}%</h6>
                          </div>
                          <div className="col-sm-2">
                            <p className="m-b-10 f-w-400">HSC</p>
                            <h6 className="f-w-600">{this.state.user.hsc}%</h6>
                          </div>
                          <div className="col-sm-2">
                            <p className="m-b-10 f-w-400">UG</p>
                            <h6 className="f-w-600">{this.state.user.ug}%</h6>
                          </div>
                          {this.state.user.pgPercentage ? <div className="col-sm-2">
                            <p className="m-b-10 f-w-400">PG</p>
                            <h6 className="f-w-600">{this.state.user.pg}%</h6>
                          </div> : ''}
                        </div>
                        <h6 className="m-b-20 m-t-40 p-b-5 b-b-default f-w-600" style={{ border: 'none', color: '#fc3f06', marginBottom: '0px', marginTop: '50px' }}>ONLINE TEST SCORE</h6>
                        <div className="row" style={{ paddingLeft: '15px', width: '46rem' }}>
                          <table className="table table-hover" style={{ opacity: '65%', marginBottom: '0px' }}>
                            <thead style={{ backgroundColor: '#E0E1EA' }}>
                              <th className='col-lg-4 thdesign' style={{ fontWeight: '2000', color: '#000000' }}>Section</th>
                              <th className='col-lg-2 thdesign' style={{ fontWeight: '2000', color: '#000000' }}>Simple %</th>
                              <th className='col-lg-2 thdesign' style={{ fontWeight: '2000', color: '#000000' }}>Medium %</th>
                              <th className='col-lg-2 thdesign' style={{ fontWeight: '2000', color: '#000000' }}>Complex %</th>
                              <th className='col-lg-2 thdesign' style={{ fontWeight: '2000', color: '#000000' }}>Total %</th>
                            </thead>
                            <tbody>
                              {this.renderTable()}
                            </tbody>
                          </table>
                          <div className='row' style={{ width: '710px', marginTop: '5px' }}>
                            <div className='col-7 col-lg-7'>
                              {this.programRender()}
                            </div>
                            <div className='col-5 col-lg-5'>
                              <p style={{ textAlign: 'center', marginLeft: '145px' }}><strong>{this.percentageCal()}</strong></p>
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
          {this.state.viewProfile ?
            <div>
              <ViewProfile type={this.state.type} certificateData={this.state.certificateData} pdfData={this.state.pdfData?.data} onClose={this.close} />
            </div> : ''
          }
        </div >
      </div >
    )
  }
}
