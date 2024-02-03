import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import axios from 'axios';
import _ from 'lodash';
import React, { Component } from 'react';
import { FaAward } from 'react-icons/fa';
import Carousel from 'react-material-ui-carousel';
import { Link } from 'react-router-dom';
import '../../App.css';
import { authHeader, errorHandler } from '../../api/Api';
import gold from '../../assests/images/goldMedal.jpg';
import silver from '../../assests/images/silverMedal.jpg';
import AdvSearch from '../../common/Search';
import { fallBackLoader, withLocation } from '../../utils/CommonUtils';
import TableHeader from '../../utils/TableHeader';
import { isRoleValidation } from '../../utils/Validation';
import SocialMediaShareModal from "./SocialMediaShareModal";
import url from '../../utils/UrlConstant';


class PracticeExamList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: isRoleValidation(),
      searchName: '',
      user: JSON.parse(localStorage.getItem("user")),
      practiceExam: [],
      name: "",
      isStudentProfileUpdated: true,
      status: "ACTIVE",
      loader: true,
      currentPage: 1,
      openModal: false,
      pageSize: 6,
      totalPages: 0,
      fromDate: '',
      toDate: '',
      totalElements: 0,
      numberOfElements: 0,
      startPage: 1,
      endPage: 5,
      advertisement: [],
      filteredExam:[],
      carouselRef: null,
      average: 0,
      certificateType:'',
    };
  }



  componentDidMount() {
    window.addEventListener("focus", this.getResult);
    window.addEventListener("focus", this.getAttemptCount);
    if (this.state.role === 'COLLEGE_STUDENT') this.getStudent();
    this.getResult();
    this.getAttemptCount();
    this.getAdvertisment();
  }


  componentWillUnmount() {
    window.removeEventListener("focus", this.getResult)
    window.removeEventListener("focus", this.getAttemptCount)
  }

  getStudent() {
    axios.get(` ${url.COLLEGE_API}/student/getStudent?email=${this.state.user.email}`, { headers: authHeader() })
      .then(res => { if (!res.data.response?.resume) this.setState({ isStudentProfileUpdated: false }) })
      .catch(err => errorHandler(err))
  }

  getResult = () => {
    axios.get(`${url.COLLEGE_API}/practiceExam/results`, { headers: authHeader() })
      .then(res => {
        this.setState({ results: res.data.response, loader: false }, this.getPracticeExams);
      }).catch(error => {
        this.setState({ loader: false })
        errorHandler(error);
      })
  }

  setResultsForExams = (exam) => {
    const practiceExam = exam.content
    _.map(practiceExam, p => {
      _.map(this.state.results, r => {
        if (p.id === r.practiceExamId) {
          p.results = r
        }
      })
    })
    return practiceExam;
  }



  getPracticeExams = () => {
    axios.get(` ${url.COLLEGE_API}/practiceExam/search?name=${this.state.searchName}`, { headers: authHeader() })
      .then(async res => {
        const practiceExam = this.setResultsForExams(res.data.response);
        this.setState({
          practiceExam: this.state.searchName === ''? _.sortBy(practiceExam, 'displayOrder'):this.state.practiceExam,
          filteredExam: _.sortBy(practiceExam, 'displayOrder'),
          totalPages: res.data.response.totalPages,
          totalElements: res.data.response.totalElements,
        }, this.setAvarage)
      })
      .catch(error => {
        errorHandler(error);
        this.setState({ loader: false });
      })

  }

  getAttemptCount = () => {
    axios.get(`${url.COLLEGE_API}/practiceExam/result/count`, { headers: authHeader() })
      .then(res => {
        this.setState({ attempt: res.data.response })
      }).catch(error => {
        errorHandler(error);
      })

  }
  getAdvertisment = () => {
    axios.get(`${url.ADV_API}/advdetails/getAll`, { headers: authHeader() }).then(res => {
        this.setState({ advertisement: res.data.response })
      }).catch(error => {
        errorHandler(error);
      })
  }

  takeTest = (practiceExam) => {
    this.clearStorage();
    const user = JSON.parse(localStorage.getItem('user'))
    const URL = `${url.COLLEGE_API}/test/create-practiceExam`;
    axios.post(URL, practiceExam, { headers: authHeader() }).then((res) => {
      const response = res.data.response || {}
      localStorage.setItem("exam", JSON.stringify(response));
      localStorage.setItem("practiceExamId", response.practiceExamId)
      localStorage.setItem("examId", response.id);
      localStorage.setItem("examSubmitMessage", response.examSubmitMessage);
      localStorage.setItem("jwtToken", localStorage.getItem("token"));
      if (this.state.role === 'COLLEGE_STUDENT')
        localStorage.setItem("collegeId", this.state.user.companyId);
      this.setState({ isValidExamTime: true }, () => this.checkOnGoingExam(user.email, response.id));
    }).catch((error) => {
      errorHandler(error)
    })
  }
  checkOnGoingExam = (email, examId, index) => {
    const exam = JSON.parse(localStorage.getItem('exam'))
    axios.get(`${url.COLLEGE_API}/onlineTest/onGoing/exam?email=` + email + `&examId=` + examId, { headers: authHeader() })
      .then((res) => {
        if (!res.data.response) {
          return window.open(`${url.UI_URL}/candidateinstruction`, "", "width=1450px,height=900px")
        }
        const response = res.data.response || {}
        if (response.isExamSubmitted) {
          this.setState({ isResultInProgress: true });
          return this.getResultUntilItDone(index)
        }
        localStorage.setItem("onGoingExamId", response.id);
        if (response.startDate) localStorage.setItem("startDate", response.startDate);
        if (response.preferredLanguage) {
          localStorage.setItem("languageName", response.preferredLanguage);
          localStorage.setItem("languageId", response.preferredLanguage);
        }
        exam["categories"] = response.categories;
        if (response.categories) {
          exam["categories"] = response.categories;
          localStorage.setItem("AnsweredState", JSON.stringify(exam));
        }
        this.setStartTime(response.startDate);
        localStorage.setItem("examDuration", response.isAppsCompleted ? exam.programmingDuration : exam.duration)
        if (_.size(_.filter(response.categories, { 'groupQuestionType': 'SQL' })) > 0) {
          localStorage.setItem("examDuration", exam.sqlDuration)
          const path = '/sql'
          window.open(`${url.UI_URL}${path}`, "", "width=1450px,height=900px");
          return
        }
        const programming = _.filter(response.categories, { 'groupQuestionType': 'programming' }).length > 0
        const path = programming && response.isAppsCompleted ? '/program' : '/test'
        window.open(`${url.UI_URL}${path}`, "", "width=1450px,height=900px");
      }).catch((err) => errorHandler(err));
  }

  setStartTime = (startDate) => {
    let startTime = new Date(startDate);
    const keysToSet = ["startTime", "startDate"];
    keysToSet.forEach(k => {
      localStorage.setItem(k, startTime);
    });
  }

  clearStorage = () => {
    const keysToRemove = ["seconds","examSubmitMessage", "candidateInstruction", "examId", "jwtToken", "exam", "count", "startDate", "startTime", "onGoingExamId", "examDuration", "AnsweredState", "languageId", "languageName", "examTimeUp", "count", "practiceExamId","examStartDate","questionId","status"];
    keysToRemove.forEach(k => localStorage.removeItem(k))
  }

  onSearch = (value) => {
    this.setState({ searchName: value }, this.getPracticeExams)
  }

  setMedals = (marks,practice) => {
    if (marks === null) {
      return null;
    }
    if (marks >= 81) {
      return <FaAward style={{ fontSize: '25px', color: '#DAA520' }} />;
    } else if (marks > 60 && marks <= 80) {
      return <FaAward style={{ fontSize: '25px', color: '#71706E' }} />;
    } else if (marks >= 40 && marks <= 60) {
      return <FaAward style={{ fontSize: '25px', color: '#804A00' }} />;
    } else if (marks >= 0 && marks <= 39) {
      return <span onClick={()=>this.getWrongAnswer(practice)} style={{ fontSize: '20px' }}>&#128528;</span>;
    }

    return null;
  }
    setAvarage = () => {
    let totalMarks = 0;
    _.map(this.state.results, r => {
      totalMarks += r.totalMarks + r.totalProgrammingMarks
    })
    const avg = totalMarks / _.size(this.state.practiceExam)
      // const avg = 60;
    // const avg =85;
     if(avg>59 && avg<80){
      this.setState({certificateType:'silver'});
    }
    else if(avg>79){
      this.setState({certificateType:'gold'});
    }
    this.setState({ average: avg })
  }

   onCloseModal = () => {
    this.setState({ openModal: !this.state.openModal });
  };

  handleOutsideClick = (e) => {
    if (e.target.className === "modal fade show") {
      this.setState({ openModal: !this.state.openModal });
    }
  };

  getWrongAnswer = (exam)=>{
    let wrongQuestions = []
    if(exam.results && exam.duration){
      _.map(exam.results.submittedExam,s=>{
        if(s.question.answer && (s.question.answer!==s.selectOption)){
          s.question['selectedAnswer'] = s.selectOption
          wrongQuestions.push(s.question)
        }
      })
    const jsonString = JSON.stringify(wrongQuestions);
    localStorage.removeItem('wrongAnswers')
    localStorage.setItem('wrongAnswers',jsonString)
    return window.open(`/student/wrong-answers/preview`,'_blank')
    }
    return null;
  }

  render() {
    const { isStudentProfileUpdated, loader } = this.state;

    if (!isStudentProfileUpdated) {
      return <>
        <h3 style={{ textAlign: 'center', color: 'red', marginTop: '10rem', padding: '1rem' }}>Please update your profile to take practice exams</h3>
        <i style={{ fontSize: '12rem', textAlign: 'center', display: 'block', color: 'whitesmoke' }} class="fa fa-address-card-o" aria-hidden="true"></i>
      </>;
    }

    if (loader) {
      return null;
    }

    return (
      <>
        <div className='row'>
          <div className='col-9'>
            <TableHeader title="PracticeExams"/>
            {fallBackLoader(this.state.loader)}
            <AdvSearch title="Filter" showSearch={true} placeholder="search by topics" onSearch={this.onSearch} />
            <div style={{ width: '100%', height: 'calc(100vh - -22rem)', position: 'relative', right: '15px', bottom: '10px' }}>
              <Grid container>
                {_.map(this.state.filteredExam, (practice, index) => {
                  const results = practice.results;
                  const mcqRound = practice.categories.find(c => c.groupQuestionType === 'MCQ');
                  const sqlRound = results?.sqlRound;

                  let rating = null;
                  if (results) {
                    rating = 0;
                    if (sqlRound) {
                      rating = (results.totalMarks / results.totalQuestion) * 5;
                    } else if (mcqRound) {
                      rating = (results.totalMarks / (results.totalQuestion - results.totalProgrammingQuestions)) * (results.programmingRound ? 2.5 : 5);
                      if (results.programmingRound) {
                        rating += (results.totalProgrammingMarks / 100) * (mcqRound ? 2.5 : 5);
                      }
                    } else if (results.programmingRound && !mcqRound) {
                      rating = (results.totalProgrammingMarks / 100) * 5;

                    }
                  }

                  return (
                    <Grid item xl={6} lg={6} md={6} sm={12}>
                      <div key={index} style={{ height: '110px', borderRadius: '10px', backgroundColor: 'rgb(224 226 239)', margin: '10px', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', left: '10px' }}>
                        <div style={{ padding: '3px', width: '75%', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                          <h2 style={{ fontSize: '18px', position: 'relative', top: '3px', color: '#3b489e', fontWeight: 'bold', fontFamily: '"Baskervville", sans-serif' }}>{practice.name}</h2>
                          {<p style={{ position: 'absolute', top: '75px', fontSize: '13px', color: '#5e5858' }}>{_.map(practice.categories, p => p.groupQuestionType).join(" and ")}</p>}
                          <div title={'TotalMarks : ' + ((rating?.toFixed() / 5) * 100) + '%'} style={{ marginRight: '2rem' }}>
                            <div>
                              {this.setMedals(rating !== null ? ((rating.toFixed() / 5) * 100) : null,practice)}
                            </div>
                          </div>
                        </div>


                        <div>
                          <button disabled={this.state.attempt[practice.id] ? this.state.attempt[practice.id] >= 3 : false} onClick={() => this.takeTest(practice)}
                            style={{ minWidth: '6rem', fontSize: '15px', marginTop: '47px', backgroundColor: this.state.attempt[practice.id] >= 3 ? 'rgb(225 151 126)' : '#F05A28', color: 'white', position: 'relative', right: '20px', height: '2rem', borderRadius: '5px', border: 'none', cursor: this.state.attempt[practice.id] >= 3 ? 'not-allowed' : 'pointer', }}>
                            {this.state.attempt[practice.id] > 0 ? 'Try Again' : 'Try Now'}</button>
                          <p style={{ fontSize: '13px', color: '#5e5858', marginTop: '7px', marginLeft: '-12px' }}>{'Attempt: ' + (this.state.attempt[practice.id] ? this.state.attempt[practice.id] : 0) + '/3'}</p>
                        </div>
                      </div>
                    </Grid>
                  );
                })}
              </Grid>
            </div>
          </div>
          <div className='col-3'>
            <div style={{ position: 'fixed', padding: '.2rem' }}>
              <div style={{ marginBottom: '.0rem', background: 'none' }}>
                <Card elevation={10} style={{boxShadow:'none'}}>
                  {
                     <div style={{display:'flex',justifyContent:'center'}}>
                      <div>
                    {this.state.average > 60 ? this.state.average < 80 ? <img alt='' src={silver} style={{ height: '140px', width: '200px'}}></img> : <img alt='' src={gold} style={{ height: "140px", widthL: '150px'}}></img> : <img alt='' src={silver} style={{ filter: 'opacity(15%)', height: '150px', width: '180px', display: 'flex', transform: 'translate(15%,0)' }}></img>}
                    </div>
                    <div style={{transform:'translate(0px,30px)'}}>
                        {this.state.role === 'COLLEGE_STUDENT' ?<button disabled={this.state.average>59?false:true} className="btn btn-sm btn-prev pull-right m-0" title={this.state.certificateType?'View Certificate':null} style={{cursor:this.state.certificateType?'pointer':null,height:'42px'}} onClick={this.onCloseModal}>View Certificate</button>:null}
                    </div>
                    </div>
                   }
                </Card>
              </div>
              <Carousel autoPlay={true} ref={this.state.carouselRef} style={{ transform: 'translateY(10%)' }}>
                {this.state.advertisement?.map((item) => {
                  return item?.type !== 'VIDEO' ?
                    <Card key={item.id} elevation={10} >
                      <Link to={{ pathname: '/student/advertisement', state: { adv: item } }}>
                        <img alt='' style={{ height: '220px', width: '100%' }} src={item?.path} />
                      </Link>
                      <CardContent>
                        <div style={{ height: 80, maxWidth: 500, overflow: 'auto', padding: '8px', }} >
                          <Typography sx={{ height: 80, maxWidth: 500 }} variant="body2" color="text.secondary">
                            {item.description}
                          </Typography>
                        </div>
                      </CardContent>
                    </Card>
                    :
                    <Card key={item.id} elevation={10}>
                      <Link to={{ pathname: '/student/advertisement', state: { adv: item } }}>
                        <CardMedia sx={{ height: '220px', width: "100%", backgroundColor: 'black' }}
                          component="video"
                          autoPlay
                          controls
                          src={item?.path}
                        />
                        <CardContent>
                          <div style={{ height: 125, maxWidth: 500, overflow: 'auto', padding: '8px', }}>
                            <Typography sx={{ height: 80, maxWidth: 500 }} variant="body2" color="text.secondary">
                              {item.description}
                            </Typography>
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                })}
              </Carousel>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {_.size(this.state.advertisement) > 0 ? <Link style={{ color: '#4b9df5', border: 'none', background: 'none' }} to='/student/advertisement'  >See More</Link> : null}
              </div>
            </div>
          </div>
        </div>
        {this.state.openModal ? <SocialMediaShareModal close={this.onCloseModal}  handleOutside={this.handleOutsideClick} examType={"practice"} certificateType={this.state.certificateType} candidateName={this.state.user.username?this.state.user.username:null} />:null}
      </>
    );
  }

}

export default withLocation(PracticeExamList)