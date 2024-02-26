import React, {Component } from "react";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import _ from "lodash";
import Confetti from 'react-confetti';
import { PiCertificateBold } from 'react-icons/pi';
import { Link } from "react-router-dom";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { authHeader, errorHandler } from "../../api/Api";
import { fallBackLoader, toastMessage } from "../../utils/CommonUtils";
import { isEmpty, isRoleValidation } from "../../utils/Validation";
import SocialMediaShareModal from "./SocialMediaShareModal";
import url from "../../utils/UrlConstant";
import { Tooltip } from 'react-tooltip'



const paidLevelBgColor = {
    0: 'card-body bg-bef-noresult',
    1: 'card-body bg-box-color',
    2: 'card-body bg-bef-test',
    3: 'card-body bg-bef-level'
};

export default class StudentTestList extends Component  {
    state = {
      role: isRoleValidation(),
      user: JSON.parse(localStorage.getItem("user")),
      levels: [],
      loader: true,
      result: [],
      results: [],
      totalWeightage: [],
      credits: [],
      isStudentProfileUpdated: true,
      openModal: false,
      isRefreshEnable: false,
      shortlistedCount: 0,
      isValidExamTime: false,
      openForLevel3: false,
      openCongratsModal: false,
      inProgressTests: [],
      skillSortScore: {},
      disabled: false,
      examMonitor: {},
      hasWebcam: false,
      cameraPermission: true,
      certificateType:"",
    }
  
    componentDidMount() {
      this.handlePageViewEventForStudent()
      this.getStudentMarks();
      if (this.state.role === 'COLLEGE_STUDENT') this.getStudent();
      this.getSkillSortMark();
      this.getLevels();
      this.getResults();
      this.getShortlistedCount();
      this.getScholarShipStatus();
    }
  
    handlePageViewEventForStudent = ()=>{
      window.dataLayer.push({
        event: 'Student_TestList_PageView',
        pagePath:window.location.href
      });
    }
  
    componentWillUnmount() {
      clearInterval();
    }
  
    certificateTypeSet=()=>{
    let marks=Math.round(this.state.skillSortScore?.skillsortScore);
        // let marks=0;
        // let marks=85;
    if(marks>59 && marks<80){
      this.setState({certificateType:"basic"});
    }
    if(marks>79){
      this.setState({certificateType:"advance"});
    }
    }
  
    getLevels = () => {
      const basePath = (this.state.role === "COMPETITOR" || this.state.role === 'DEMO_ROLE') ? `${url.COMPETITOR_API}/competitor/user-test` : `${url.COLLEGE_API}/level/get-level-list`;
      axios.get(basePath, { headers: authHeader() }).then((res) => this.setState({ levels: _.orderBy(res.data.response, ["level"]) }))
        .catch(err => {
          this.setState({ loader: false })
          errorHandler(err)
        })
    }
  
    getResults = () => {
      const basePath = (this.state.role === "COMPETITOR" || this.state.role === 'DEMO_ROLE') ? `${url.COMPETITOR_API}/testcompetitor` : `${url.COLLEGE_API}/test`;
      axios.get(`${basePath}/results`, { headers: authHeader() })
        .then((res) => this.setState({ results: _.orderBy(res.data.response || [], ['level', 'createdDate']) }))
        .catch(err => errorHandler(err))
    }
  
    getStudent() {
      axios.get(` ${url.COLLEGE_API}/student/getStudent?email=${this.state.user.email}`, { headers: authHeader() })
        .then(res => { if (!res.data.response?.resume) this.setState({ isStudentProfileUpdated: false }) })
        .catch(err => errorHandler(err))
    }
  
    getSkillSortMark = () => {
      const basePath = (this.state.role === "COMPETITOR" || this.state.role === 'DEMO_ROLE') ? `${url.COMPETITOR_API}/competitor` : `${url.COLLEGE_API}/student`;
      axios.get(`${basePath}/skillsort-score/${this.state.user.id}`, { headers: authHeader() })
        .then(res => this.setState({ skillSortScore: res.data.response }, this.getTestCredits))
        .catch(err => errorHandler(err))
    }
  
    getStudentMarks = () => {
      const basePath = (this.state.role === "COMPETITOR" || this.state.role === 'DEMO_ROLE') ? `${url.COMPETITOR_API}/competitor/user` : `${url.COLLEGE_API}/onlineTest/student`;
      axios.get(`${basePath}/get-result/${this.state.user?.id}`, { headers: authHeader() })
        .then((res) => this.setState({ result: res.data.response, loader: false }))
        .catch(err => {
          this.setState({ loader: false })
          errorHandler(err)
        })
    }
  
    getTestCredits = () => {
      axios.get(`${url.ADMIN_API}/testCredit/credit`, { headers: authHeader() })
        .then((res) => this.setState({ credits: res.data.response || [] },()=>{this.certificateTypeSet()}))
        .catch(err => errorHandler(err))
    }
  
    updateTestCredits = () => {
      this.setState({ disabled: true })
      axios.post(`${url.ADMIN_API}/testCredit/purchase`, {}, { headers: authHeader() })
        .then(_res => {
          this.setState({ openModal: false })
          this.setState({ disabled: false })
          toastMessage('success', 'Credits Updated Successfully');
          this.getTestCredits();
        })
        .catch(err => {
          errorHandler(err)
          this.setState({ openModal: false })
          this.setState({ disabled: false })
        })
    }
  
    getScholarShipStatus = () => {
      const basePath = (this.state.role === "COMPETITOR" || this.state.role === 'DEMO_ROLE') ? `${url.COMPETITOR_API}/competitor/open-for-level3` : `${url.COLLEGE_API}/student/open-for-level3`;
      axios.get(basePath, { headers: authHeader() })
        .then(res =>
          this.setState({ openForLevel3: res.data.response }))
        .catch(err => {
          errorHandler(err)
        })
    }
  
    takeTest = (level, index) => {
      if (!this.state.isStudentProfileUpdated) return;
      this.clearStorage();
      const user = JSON.parse(localStorage.getItem('user'))
      const URL = (this.state.role === "COMPETITOR" || this.state.role === 'DEMO_ROLE') ? `${url.COMPETITOR_API}/testcompetitor/create-test` : `${url.COLLEGE_API}/test/create-test`;
      level.attempt = index + 1;
      axios.post(URL, level, { headers: authHeader() }).then((res) => {
        const response = res.data.response || {}
        localStorage.setItem("level", JSON.stringify(response));
        localStorage.setItem("exam", JSON.stringify(response));
        localStorage.setItem("examId", response.id);
        localStorage.setItem("examSubmitMessage", response.examSubmitMessage);
        localStorage.setItem("jwtToken", localStorage.getItem("token"));
        if (this.state.role === 'COLLEGE_STUDENT')
          localStorage.setItem("collegeId", this.state.user.companyId);
        this.setState({ isValidExamTime: true }, () => this.checkOnGoingExam(user.email, response.id, level, index));
      }).catch((error) => {
        errorHandler(error)
      })
    }
  
    checkTestFinishOrInProgress = async (level, index, isInProgress) => {
      if (isInProgress) {
        const basePath = (this.state.role === "COMPETITOR" || this.state.role === 'DEMO_ROLE') ? `${url.COMPETITOR_API}/testcompetitor` : `${url.COLLEGE_API}/test`;
        const response = await axios.get(`${basePath}/results`, { headers: authHeader() })
        const results = _.orderBy(response.data.response || [], ['level', 'createdDate'])
        const result = _.filter(results || [], r => r.level === level.level);
        if (isEmpty(result[index])) {
          this.takeTest(level, index)
        } else {
          this.setState({ results, inProgressTests: [] }, () => this.getSkillSortMark())
        }
      } else {
        const { inProgressTests } = this.state
        let inProgressTest = {};
        inProgressTest.level = level.level;
        inProgressTest.index = index;
        inProgressTests.push(inProgressTest);
        this.setState({ inProgressTests })
        this.takeTest(level, index);
      }
  
    }
  
    getResultUntilItDone = async (level, index) => {
      const basePath = (this.state.role === "COMPETITOR" || this.state.role === 'DEMO_ROLE') ? `${url.COMPETITOR_API}/testcompetitor` : `${url.COLLEGE_API}/test`;
      while (true) {
        const response = await axios.get(`${basePath}/results`, { headers: authHeader() })
        const results = _.orderBy(response.data.response || [], ['level', 'createdDate'])
        const result = _.filter(results || [], r => r.level === level.level);
        if (!isEmpty(result[index])) {
          this.setState({ results, inProgressTests: [], isResultInProgress: false }, () => this.getSkillSortMark())
          break;
        }
      }
    }
  
    checkOnGoingExam = (email, examId, level, index) => {
      const exam = JSON.parse(localStorage.getItem('level'))
      const baseUrl = (this.state.role === "COMPETITOR" || this.state.role === 'DEMO_ROLE') ? `${url.COMPETITOR_API}/onGoingTest/exam` : `${url.COLLEGE_API}/onlineTest/onGoing/exam`
      axios.get(`${baseUrl}?email=` + email + `&examId=` + examId, { headers: authHeader() })
        .then((res) => {
          if (!res.data.response && (level.isMcqCamera || level.isProgrammingCamera || level.isSqlCamera)) {
            if (_.size(_.filter(level.categories, c => c.sectionName === 'SQL')) > 0) {
              localStorage.setItem('havingSql', true)
            }
            return (
              (this.state.role === "COMPETITOR" || this.state.role === 'DEMO_ROLE') ? this.props.history.push('/competitor/test/takePicture') : this.props.history.push('/student/test/takePicture')
            )
          }
          else if (!res.data.response) {
            if (_.size(_.filter(level.categories, c => c.sectionName === 'SQL')) > 0) {
              return (this.state.role === "COMPETITOR" || this.state.role === 'DEMO_ROLE') ? window.open(`${url.UI_URL}/competitor/test/selectTech`, "", "width=1450px,height=900px") : window.open(`${url.UI_URL}/student/test/selectTech`, "", "width=1450px,height=900px")
            }
            else {
              return window.open(`${url.UI_URL}/candidateinstruction`, "", "width=1450px,height=900px")
            }
          }
          const response = res.data.response || {}
          if (response.isExamSubmitted) {
            this.setState({ isResultInProgress: true })
            return this.getResultUntilItDone(level, index)
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
          if (_.size(_.filter(response.categories, c => c.sectionName === 'SQL')) > 0) {
            localStorage.setItem("examDuration", response.isSqlCompleted ? exam.programmingDuration : exam.sqlDuration)
            const programming = _.filter(response.categories, { 'sectionName': 'PROGRAMMING' }).length > 0;
            const path = programming && response.isSqlCompleted ? '/program' : '/sql'
            window.open(`${url.UI_URL}${path}`, "", "width=1450px,height=900px");
            return
          }
          const programming = _.filter(response.categories, { 'sectionName': 'PROGRAMMING' }).length > 0 ? true : false;
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
  
    getShortlistedCount = () => {
      const basePath = (this.state.role === "COMPETITOR" || this.state.role === 'DEMO_ROLE') ? `${url.COMPETITOR_API}/competitor/getShortlistedCount` : `${url.COLLEGE_API}/student/shortlisted-companies`;
      axios.get(basePath, { headers: authHeader() })
        .then(res => {
          this.setState({ shortlistedCount: res.data.response })
        }).catch((error) => {
          errorHandler(error)
        })
    }
  
    clearStorage = () => {
      const keysToRemove = ["examSubmitMessage", "candidateInstruction", "examId", "jwtToken", "exam", "count", "startDate", "startTime", "onGoingExamId", "examDuration", "AnsweredState", "languageId", "languageName", "examTimeUp", "count", "practiceExamId"];
      keysToRemove.forEach(k => localStorage.removeItem(k))
    }
  
    examTestCase = (value) => {
      return value.totalTestCasePass + "/" + (value.totalTestCaseInEasy + value.totalTestCaseInMedium + value.totalTestCaseInHard) + " (Test Cases Passed)";
    }
  
    sqlTestCase = (value) => {
      return value.totalMarks + "/" + (value.totalInEasy + value.totalInMedium + value.totalInHard) + " (Test Cases Passed)";
    }
  
    deleteExamResults = () => {
      axios.get(`${url.ADMIN_API}/exam/deleteExamResult`, { headers: authHeader() })
        .then(res => {
          window.location.reload()
        })
    }
  
    levelWiseScores = (level) => {
      const results = _.filter(this.state.results || [], r => r.level === level.level);
      const credit = _.find(this.state.credits || [], c => c.level === level.level);
      const levelType = ["APTITUDE", "TECHNICAL", "PROGRAMMING"];
      const levelColor = level.level > 1 ? '#FFFFFF' : '#3B489E';
      return <div className="row level-cards">
        <div className={paidLevelBgColor[level.level || 0]}>
          <h5 className="level-title" style={{ color: levelColor, position:'relative', top:'1rem' }}>Level {level.level}</h5>
          <div style={{ textAlign: 'center' }}><span style={{ color: levelColor, position:'relative', top:'0.5rem' }}> {levelType[level.level - 1]}</span></div>
          <hr style={{ backgroundColor: 'rgb(255, 255, 255)', width:'15rem', position:'relative', left:'1.8rem', color:'white', height:'2px' }}></hr>
          <p className="level-info" style={{ color: levelColor }}>You have {credit?.available_credits && credit?.available_credits >= 0 ? credit.available_credits : 0} credits Available.
          </p>
          {this.sectionWiseResult(credit, results, level)}
        </div>
        {level.level === 3 && isRoleValidation().includes('DEMO_ROLE') ? <button style={{ marginTop: '1rem',width:'10rem' }} onClick={() => this.deleteExamResults()} className="btn btn-sm btn-prev" >Clear Exam Results</button> : null}
      </div>
    }
  
    isTakeTestButtonDisabled = (index, results) => {
      if (index === 0 && isEmpty(results[index])) return false
      console.log(isEmpty(results[index - 1]));
      return isEmpty(results[index - 1])
    }
  
    getProgrammingPercentage = (result) => {
      let programmingSection = _.filter(result, r => r.section === 'PROGRAMMING')
      return ((programmingSection[0].totalTestCasePass / (programmingSection[0].totalTestCaseInEasy + programmingSection[0].totalTestCaseInMedium + programmingSection[0].totalTestCaseInHard)) * 100)?.toFixed(0)
    }
  
    getSqlPercentage = (result) => {
      let sqlSection = _.filter(result, r => r.section === 'SQL')
      return ((sqlSection[0].totalMarks || 0) / sqlSection[0].totalInSection * 100).toFixed(0) + '%'
    }
  
    setCandidate = (data) => {
      this.getExamMonitor(data.examId)
      this.getScreenShot(data);
    }
  
    getExamMonitor = (examId) => {
      axios.get(`${url.CANDIDATE_API}/candidate/exam-monitor/${examId}/${this.state.user.email}`, { headers: authHeader() })
        .then(res => {
          localStorage.setItem('examMonitor', JSON.stringify(res.data.response))
        })
        .catch(e => errorHandler(e));
    }
  
    getScreenShot = (data) => {
      let user = JSON.parse(localStorage.getItem('user'));
      axios.get(`${url.ADMIN_API}/onlineTest/getScreenShot?candidateId=${user?.id}&examId=${data.examId}`, { headers: authHeader() })
        .then(res => {
          data['screenShot'] = res.data.response;
          let candidate = JSON.stringify(data)
          localStorage.removeItem(data.candidateId)
          localStorage.setItem(data.candidateId, candidate)
        }
        ).catch(er =>
          errorHandler(er))
    }
  
    onCloseModal = () => {
      this.setState({ openModal: !this.state.openModal });
    };
  
    handleOutsideClick = (e) => {
      if (e.target.className === "modal fade show") {
        this.setState({ openModal: !this.state.openModal });
        this.setState({certificateType:""})
      }
    };
    sectionWiseResult = (credit, results, level) => {
        const { skillSortScore } = this.state || {};
        const purchaseTestButton = <button disabled={skillSortScore.skillsortScore < skillSortScore.scholarShip || this.state.disabled} className="paid-taketest" onClick={this.updateTestCredits}>Claim your Reward</button>
        return level.level === 3 && (!credit || !credit?.total_credits) ?
          <div className='paid-content'>
            <p className='paid-levels' style={{ fontWeight: '300', fontSize: '1.5rem' }} >To get <br />free credits<br />your over all <br /> Skillsort Score <br /> should be <br /> more than {skillSortScore.scholarShip} %</p>
            <div style={{ marginTop: '2.5rem' }}>{purchaseTestButton}</div>
          </div> :
          <div className="row" style={{ height: '19rem', overflow: 'hidden auto' }}>
            {_.map(_.range(credit.total_credits || 0), (index) => {
              const result = results[index] || {}
              const isInProgress = _.size(_.filter(this.state.inProgressTests, test => (test.level === level.level && test.index === index))) > 0;
              return <div key={index} className="container" style={{width:'305px'}}>
                <div className="card-body-testCard">
                  <div className="row" style={{ textAlign: 'center', alignItems: 'center' }}>
                    <div className="col-md test-card">
                      <p className="p tag1">{index + 1}</p>
                      <p className="p tag2"><b>Test</b></p>
                    </div>
                    <span className="vertical"></span>
                    {!_.isEmpty(result) ?
                      <div className="col-md test-card" style={{ verticalAlign: 'middle' }}>
                        <p className="p tag1" data-tooltip-id={"section " + result.id}>
                          {level.level !== 3 ? ((((result.totalMarks || 0) / (result.totalQuestion || 1)) * 100).toFixed(0)) + '%' : isRoleValidation().includes('DEMO_ROLE') ? <Link onClick={() => this.setCandidate(result)} target={'_blank'} to={{ pathname: '/admin/result/candidate/programResult/' + result.candidateId }}><button style={{ background: "#3B489E", color: 'white', border: 'none', width: '6rem', height: '50px', fontSize: '13px' }}
                            type="button" className="btn" >View program</button></Link> : result.programmingRound ? this.getProgrammingPercentage(result.results) + '%' : this.getSqlPercentage(result.results)}</p>
                        {isRoleValidation() === "COLLEGE_STUDENT" ? <p className="p tag2">Score</p> : null}
                        <Tooltip id={"section " + result.id} place="top"  style={{backgroundColor:'#F05A28',borderColor:'#f15e32',paddingLeft:'0px',type:'warning',effect:'solid'}} >
                          <div className="questionAdmin" style={{ color: 'white', width: 'fit-content', marginLeft: '-15px', paddingRight: '20px', }}>
                            <div style={{display:'flex',justifyContent:'center', marginLeft:'2rem', fontSize:'15px'}}><b>Score for Test {index + 1}</b></div>
                            {level.level !== 3 ? _.map(result.results, (list, key) =>
                              <div key={key} className="quesOption">
                                <div style={{display:'flex', flexDirection:'row', fontSize:'12px'}}>
                                  <div><b>{list.section}</b></div>&nbsp;:&nbsp;
                                  <div>{(list.totalMarks / list.totalInSection * 100).toFixed(0) + '%'}</div>
                                </div>
                              </div>) :_.filter(result.results, r => result.programmingRound ? r.section === 'PROGRAMMING' : r.section === 'SQL').map(res =>
                                <div className="quesOption" key={res.section}>
                                  <div style={{display:'flex', flexDirection:'row', fontSize:'12px'}}>
                                    <div><b>{res.section}</b></div>&nbsp; :&nbsp;
                                    <div>{res.section === 'PROGRAMMING' ? this.examTestCase(res) : this.sqlTestCase(res)}</div>
                                  </div>
                                </div>
                              )
                            }
                          </div>
                          </Tooltip>

                      </div> :
                      <div className="col-md test-card" style={{ verticalAlign: 'middle' }}>
                        {this.state.isResultInProgress && isInProgress ? <CircularProgress style={{ color: '#3B489E' }} /> : <button style={{ background: "#3B489E", color: 'white', border: 'none', width: '5rem', height: '50px', fontSize: '13px' }}
                          type="button" className="btn" disabled={this.isTakeTestButtonDisabled(index, results, isInProgress) || (!isEmpty(this.state.inProgressTests) && !isInProgress)} onClick={() => this.checkTestFinishOrInProgress(level, index, isInProgress)}>{isInProgress ? 'In Progress' : 'Take Test'}</button>}</div>}
                  </div>
                </div>
              </div>
            })}
          </div>
      }
  
    render() {
      return this.state.isRefreshEnable ?
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
          <div>
            <i style={{ color: "#FC3F06", fontSize: "4rem", cursor: "pointer" }} className="fa fa-repeat rotate" aria-hidden="true"
              onClick={() => window.location.reload()} ></i>
            <h3 className="setting-title">Refresh to see the Result</h3>
          </div>
        </div> :
        <>
          <div style={{ paddingLeft: '0.5rem', height: "calc(100vh - 5rem)", overflowY: 'auto',overflowX:'hidden' }}>
            {fallBackLoader(this.state.loader)}
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0.5rem 3rem' }}>
               <div className="score-card">
                <span className="username"> OverAll SkillSort Score  :</span> <span className="score">{Math.round(this.state.skillSortScore.skillsortScore)}%</span>
             </div>
              <div className="score-card">
                <span className="username"> Shortlisted Companies  :</span> <span className="score">{this.state.shortlistedCount}</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center',transform:'translate(-15px,-70px)'}}>
              {this.state.role === 'COLLEGE_STUDENT' ?<><button disabled={this.state.certificateType?false:true} className="btn btn-sm btn-prev pull-right m-0" onClick={this.onCloseModal} title={this.state.certificateType?"View Certificate":null} style={{cursor:this.state.certificateType?'pointer':null}}>View Certificate</button><PiCertificateBold style={{width:'60px',height:'30px',transform:'translate(2px,2px)'}}/></>:null}
                </div>
            {this.state.skillSortScore.skillsortScore >= this.state.skillSortScore.scholarShip && _.size(this.state.credits) !== 3 ? <div style={{ padding: '1rem 1rem' }}>
              <span style={{ color: '#F05A28' }} className='setting-title'>Congrats..!{` `}</span>
              <span className='offer-card-content setting-title'>You are rewarded with level<span>&nbsp;3</span> free credits..!</span>
              <Confetti
                recycle={false} />
            </div> : null}
  
            {this.state.isStudentProfileUpdated ? <div className="row cards" style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-around' }}>
              {this.state.loader ? null : _.isEmpty(this.state.levels) ? <div>No Test Available</div> :
                _.map(this.state.levels || [], (level, key) => (
                  <div key={key} className="col-md-6 col-lg-4 col-sm-6 col-12 col-xl-4" style={{ borderRadius: '1rem', textAlign: 'center', margin: "2rem 0" }}>
                    {_.size(this.state.credits) > 0 && this.levelWiseScores(level)}
                  </div>))}
            </div> : <h3 style={{ textAlign: 'center', color: 'red', padding: '1rem' }}>Please Update your profile to take test</h3>}
            {this.state.openModal ?<SocialMediaShareModal close={this.onCloseModal}  handleOutside={this.handleOutsideClick} certificateType={this.state.certificateType} examType={"nonPractice"} candidateName={this.state.user.username?this.state.user.username:null} />:null}
          </div>
  
          </>
    }
  }
