import { sql } from "@codemirror/lang-sql";
import { Card, Grid } from "@mui/material";
import CodeMirror from "@uiw/react-codemirror";
import axios from "axios";
import { EditorView } from "codemirror";
import _ from "lodash";
import React, { Component } from "react";
import { browserName, browserVersion, isDesktop, osName, osVersion } from "react-device-detect";
import enlarge from '../../assests/images/Frameenlarge.png';
import LOGO from '../../assests/images/LOGO.svg';
import minimize from '../../assests/images/Minimize.png';
import QueryOutputTable from "../../common/QueryOutputTable";
import { logEvent } from "../../utils/Analytics";
import { toastMessage } from "../../utils/CommonUtils";
import TimeCounter from "../../utils/TimeCounter";
import { url } from "../../utils/UrlConstant";
import { isRoleValidation } from "../../utils/Validation";
import "./Programming.css";
import SubmitPopup from "./SubmitPopup";
import Webcam from "react-webcam";
import { authHeader } from "../../api/Api";
import UnplugedModal from "./UnplugedModal";
import InstructionForCamera from "./InstructionForCamera";



export default class QueryUi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      result: null,
      isExpand: false,
      questions: [],
      examQuestions: {},
      questionIndex: 0,
      currentQuestion: '',
      disabledOnRun: false,
      start: false,
      copiedText: '',
      outputs: [],
      isSqlCompleted: false,
      openModal: false,
      programCategory: {},
      queryHasCamera: false,
      base64Image: '',
      screenShortTime: 0,
      hasWebcam: true,
      cameraPermission: true,
      isPracticeExam: false,
      screenShot: {},
      examMonitor: {
        examId: localStorage.getItem("examId"),
        browserName: browserName,
        browserVersion: browserVersion,
        osName: osName,
        osVersion: osVersion,
        isDesktop: isDesktop,
        sqlStartTime: "",
        sqlEndTime: "",
        copyPasteContent: [],
        tabSwitchCounts: [],
      }
    }
  }

  componentDidMount() {
    window.addEventListener("unload", this.handleEventTrackForAbondedExam);
    window.addEventListener("blur", this.getTabSwitchCount);
    const sessionQuestions = localStorage.getItem("AnsweredState");
    const exam = JSON.parse(localStorage.getItem('exam'));
    let callbackExecuted = false;
  
    this.setState({ isPracticeExam: exam?.isPracticeExam }, () => {
      if (!callbackExecuted) {
        callbackExecuted = true;
        if (!sessionQuestions) {
          this.getQuestion();
        } else {
          this.sessionStart();
        }
      }
    });
  }
  

  handleEventTrackForAbondedExam = () => {
    localStorage.setItem('status', 'closed')
    window.dataLayer.push({
      event: 'AbandonedExam'
    });
  }

  getQuestion = () => {
    let techType = localStorage.getItem('technology')
    axios.get(`${url.CANDIDATE_API}/candidate/` + localStorage.getItem("examId") + `/questionList?questionRoles=CANDIDATE&techType=${techType ? techType : ''}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    }).then((res) => {
      let questionsFlatten = _.flatten(_.map(res.data.response.categories, 'questions'));
      localStorage.setItem("examDuration", res.data.response.sqlDuration)
      let currentCatQuestion = res.data.response
      let indx = _.findIndex(currentCatQuestion.categories, { 'sectionName': 'PROGRAMMING' });
      this.setState({ programCategory: currentCatQuestion.categories[indx] });
      this.setState({ questions: questionsFlatten, examQuestions: res.data.response, currentQuestion: questionsFlatten[this.state.questionIndex].question, queryHasCamera: res.data.response.isSqlCamera }, 
        () => { 
              this.setInput(); 
              this.checkCameraAndGetScreenShotTime();
              this.setInput(() =>{
                this.saveOnGoingExam();
              })
             });
    })
  }

  componentWillUnmount = () => {
    window.removeEventListener('unload', this.handleEventTrackForAbondedExam);
    window.removeEventListener("blur", this.getTabSwitchCount)
    clearInterval(this.screenshot);
    clearInterval(this.cameraState);
  }

  saveOnGoingExam = () => {
    logEvent('Button', 'Click');
    let answeredState = JSON.parse(localStorage.getItem('AnsweredState'));
    let category = answeredState?.categories
    let sessionUser = JSON.parse(localStorage.getItem('user'));
    if (_.size(_.map(category, this.state.isPracticeExam ? "groupQuestionType" : "sectionName")) > 0 && !localStorage.getItem('startTime')) {
      let startTime = new Date()
      localStorage.setItem("startTime", startTime);
      localStorage.setItem('examStartTime', startTime)
    }
    this.setDataInExamMonitor(new Date(localStorage.getItem('startTime')), sessionUser);
    const submittedExam = {
      id: localStorage.getItem("onGoingExamId"),
      candidateId: sessionUser?.id,
      examId: localStorage.getItem("examId"),
      categories: category,
      examMonitor: this.state.examMonitor,
      practiceExamId: localStorage.getItem("practiceExamId"),
      isSqlCompleted: this.state.isSqlCompleted
    };
    submittedExam["startDate"] = new Date(localStorage.getItem("startTime"));
    if (localStorage.getItem('level')) {
      const level = JSON.parse(localStorage.getItem('level'))
      submittedExam.level = level?.level
    }
    if (this.state.programCategory && localStorage.getItem("languageName")) {
      submittedExam["preferredLanguage"] = localStorage.getItem("languageName");
    }

    axios.post(this.getAPi() + "onGoingExam", submittedExam, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    }).then((res) => {
      localStorage.setItem("onGoingExamId", res.data.response.id);
      localStorage.setItem("startDate", res.data.response.startDate);
      if (this.state.isSqlCompleted) {
        localStorage.removeItem("startTime")
        localStorage.removeItem("startDate")
        localStorage.removeItem("seconds")
        localStorage.removeItem("examTimeUp")
        this.props.history.push("/program");
      }
      if (!localStorage.getItem('seconds')) {
        this.setInitStateForSession(answeredState)
      }
    }).catch((error) => {
      console.log(error)
      toastMessage('error', "Error while saving exam");
    });
  }

  getAPi = () => {
    const roles = isRoleValidation();

    if (roles.includes("COLLEGE_STUDENT")) {
      return `${url.COLLEGE_API}/onlineTest/`;
    } else if (roles.includes("COMPETITOR") || roles.includes("DEMO_ROLE")) {
      return `${url.COMPETITOR_API}/onGoingTest/`;
    } else {
      return `${url.CANDIDATE_API}/candidate/`;
    }
  };


  setDataInExamMonitor = (time, value) => {
    let monitor = this.state.examMonitor;
    if (time === null) {
      monitor.sqlEndTime = new Date();
      this.setState({ examMonitor: monitor })
    } else {
      monitor.email = value.email;
      monitor.sqlStartTime = time;
      this.setState({ examMonitor: monitor })
    }
  }

  async sessionStart() {
    let sessionQuestions = JSON.parse(localStorage.getItem('AnsweredState'));
    this.setState({ queryHasCamera: sessionQuestions.isSqlCamera }, () => { this.checkCameraAndGetScreenShotTime() })
    if (localStorage.getItem('onGoingExamId') && !localStorage.getItem('startDate')) {
      await this.saveOnGoingExam();
    } else {
      this.setInitStateForSession(sessionQuestions)
    }
  }

  setInitStateForSession = (sessionQuestions) => {
    let idx = _.findIndex(sessionQuestions?.categories, { 'sectionName': 'PROGRAMMING' });
    let programCategory = sessionQuestions?.categories[idx];
    localStorage.setItem("examDuration", sessionQuestions?.sqlDuration)
    let sqlQuestions = _.filter(sessionQuestions?.categories, this.state.isPracticeExam ? { groupQuestionType: 'SQL' } : { sectionName: 'SQL' });
    let questions = _.map(sqlQuestions, 'questions')
    let questionsFlatten = _.flatten(questions);
    this.setState({ questions: questionsFlatten, examQuestions: sessionQuestions, currentQuestion: questionsFlatten[this.state.questionIndex].question, programCategory: programCategory }, () => { this.setInput() });
    const startDate = localStorage.getItem('startDate');
    if (startDate)
      this.setState({ start: true })
  }

  setInputQuery = (event) => {
    this.setState({ query: event })
    let examQuestion = this.state.examQuestions;
    let idx = this.getIndexOfSqlQuestions();
    examQuestion.categories[idx].questions[this.state.questionIndex].selectedAnswer = event;
    this.setState({ examQuestions: examQuestion })
    localStorage.setItem("AnsweredState", JSON.stringify(examQuestion));
  }

  getIndexOfSqlQuestions = () => {
    return _.findIndex(
      this.state.examQuestions.categories,
      this.state.isPracticeExam ? { groupQuestionType: 'SQL' } : { sectionName: 'SQL' }
    );
  }

  setInput = () => {
    let answerState = localStorage.getItem("AnsweredState");
    localStorage.setItem('questionId', this.state.questions[this.state.questionIndex]?.id)
    if (answerState && answerState !== "null") {
      answerState = JSON.parse(answerState);
      let sqlCategory = _.filter(answerState.categories, this.state.isPracticeExam ? { groupQuestionType: 'SQL' } : { sectionName: 'SQL' })
      let question = _.map(sqlCategory, 'questions')
      let questionsFlatten = _.flatten(question);
      let qtnIndex = _.findIndex(questionsFlatten, { question: this.state.questions[this.state.questionIndex]?.question })
      let input = questionsFlatten[qtnIndex]?.selectedAnswer
      if (input) {
        this.setState({ query: input })
      } else this.setState({ query: '' })
    }
    else {
      let examQuestion = this.state.examQuestions;
      let idx = this.getIndexOfSqlQuestions();
      if (idx >= 0) {
        examQuestion.categories[idx].questions[this.state.questionIndex].selectedAnswer = "";
      }
      localStorage.setItem("AnsweredState", JSON.stringify(examQuestion));
      this.setState({ query: '', examQuestions: examQuestion })
    }
  }

  handleRun = (query) => {
    this.setState({ results: null, disabledOnRun: true })
    const queryObj = {
      'query': query,
      'questionId': this.state.questions[this.state.questionIndex].id
    }
    axios.post(`${url.QUERY_API}/query/run`, queryObj,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }).then((res) => {
        this.saveOnGoingExam()
        let result = res.data
        result.questionId = this.state.questions[this.state.questionIndex]?.id
        this.setState({ result: result })
        let output = this.state.outputs;
        output = _.remove(output, function (o) {
          return o.questionId !== localStorage.getItem('questionId')
        })
        output.push(result)
        this.setState({ outputs: output, disabledOnRun: false })
      }).catch((error) => {
        if (error?.response?.data) {
          let output = this.state.outputs
          let result = {}
          result.questionId = this.state.questions[this.state.questionIndex]?.id
          result.message = error.response.data
          result.yourOutput = []
          result.expectedOutput = []
          output = _.remove(output, function (o) {
            return o.questionId !== localStorage.getItem('questionId')
          })
          output.push(result)
          this.setState({ result: result, outputs: output, disabledOnRun: false })
        }
        else {
          this.setState({ disabledOnRun: false })
          toastMessage('error', error)
        }

      });
  };

  next = () => {
    logEvent('Button', 'Click');
    let index = this.state.questionIndex + 1;
    this.setCompileOutPut(index)
    let currentQtn = this.state.questions[index].question;
    this.setState({ questionIndex: index, currentQuestion: currentQtn }, () => { this.setInput() });
  }

  previous = () => {
    logEvent('Button', 'Click');
    let index = this.state.questionIndex - 1;
    this.setCompileOutPut(index)
    let currentQuestion = this.state.questions[index].question;
    this.setState({ questionIndex: index, currentQuestion: currentQuestion }, () => { this.setInput() });
  }

  setCompileOutPut = (questionIndex) => {
    let idx = _.findIndex(this.state.outputs, { questionId: this.state.questions[questionIndex]?.id });
    if (idx > -1)
      this.setState({ result: this.state.outputs[idx] })
    else
      this.setState({ result: null })
  }

  copyPasteContent = (event) => {
    event.preventDefault()
    console.log(event, 'paste', event.clipboardData.getData('text/plain'));
    let content = event.clipboardData.getData('text/plain')
    if (content === this.state.copiedText) return;
    const { examMonitor } = this.state;
    let copyPasteContent = {};
    copyPasteContent.time = new Date();
    copyPasteContent.content = content;
    copyPasteContent.questionId = this.state.questions[this.state.questionIndex]?.id;
    examMonitor.copyPasteContent.push(copyPasteContent);
    this.setState({ examMonitor: examMonitor });
  }

  getTabSwitchCount = () => {
    const { examMonitor } = this.state;
    let Qid = this.state.questions[this.state.questionIndex]?.id;
    let switchCount = {};
    switchCount.questionId = Qid;
    switchCount.count = 1;
    examMonitor.tabSwitchCounts.push(switchCount);
    this.saveOnGoingExam();
    _.remove(examMonitor.tabSwitchCounts, tb => tb.questionId === Qid)
  }

  submittedConfirm = () => {
    if (localStorage.getItem("user")) {
      let user = JSON.parse(localStorage.getItem("user"));
      let email = user?.email;
      let examId = localStorage.getItem("examId");
      let token = localStorage.getItem("jwtToken");
      axios.get(`${url.CANDIDATE_API}/candidate/check/` + email + `/` + examId,
        { headers: { Authorization: "Bearer " + token } }
      ).then(() => {
        toastMessage('error', "Test Already Submitted..!")
        this.props.navigate("/thankYou");
      })
        .catch(() => {
          this.submitExam();
        });
    }
  };

  submitExam = () => {
    if (this.state.programCategory) {
      let answeredState = JSON.parse(localStorage.getItem('AnsweredState'));
      let indx = _.findIndex(answeredState?.categories, { 'sectionName': 'PROGRAMMING' });
      if (indx === -1) {
        answeredState?.categories.push(this.state.programCategory);
        localStorage.setItem('AnsweredState', JSON.stringify(answeredState));
      }
      this.setState({ isSqlCompleted: true }, () => { this.saveOnGoingExam() });
    } else {
      let submitExam = [];
      let sessionUser = JSON.parse(localStorage.getItem('user'));
      this.setDataInExamMonitor(null, sessionUser);
      const submittedExam = {
        submittedExam: submitExam,
        candidateId: sessionUser?.id,
        candidateCreatedBy: sessionUser?.createdBy,
        examId: localStorage.getItem("examId"),
        sqlRound: true,
        examMonitor: this.state.examMonitor,
      };

      if (localStorage.getItem("collegeId")) {
        submittedExam["collegeId"] = localStorage.getItem("collegeId");
      }

      let examQuestions = JSON.parse(localStorage.getItem('AnsweredState'));
      let sectionNames = _.map(examQuestions.categories, this.state.isPracticeExam ? 'groupQuestionType' : 'sectionName');
      let sections = _.flatMap(sectionNames);
      let idx = this.getIndexOfSqlQuestions();

      _.map(this.state.examQuestions.categories[idx].questions, (question) => {
        let code = question?.selectedAnswer;
        submitExam.push({ question, code });
      })

      if (sections.length > 1) {
        examQuestions.categories.forEach((category) => {
          category.questions.forEach((question) => {
            if (question.questionType !== 'programming' && question.questionType !== 'SQL') {
              let selectOption = question.selectedAnswer;
              submitExam.push({ question, selectOption });
            }
          });
        });
      }

      axios.post(this.getAPi() + "submitExam", submittedExam, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }).then(() => {
        this.handleEventTrackForExamSubmit()
        this.props.navigate("/thankYou");
      })
        .catch((err) => {
          toastMessage('error', err.data?.message);
        });
    }
  }

  handleEventTrackForExamSubmit = () => {
    const examDuration = localStorage.getItem('examDuration')
    let endTime = new Date();
    let examStartTime = new Date(localStorage.getItem('examStartTime'));
    const timeDifference = Math.abs(examStartTime - endTime);
    const timeTaken = Math.round(timeDifference / (1000 * 60));
    window.dataLayer.push({
      event: 'ExamSubmit',
      eventCategory: 'examSubmit',
      eventLabel: 'Student ExamSubmit',
      duration: `${examDuration} mins`,
      timeTaken: `${timeTaken} mins`,
    });
  }

  output = () => {
    return <>
      <div style={{ marginTop: '1rem', overflowX: 'scroll' }}>
        {this.state.result ? (
          <div>
            <span className="setting-title" style={{ color: this.state.result.message === "Success" ? 'green' : 'red', fontSize: '1.5rem' }}>{this.state.result?.message}</span>
            {this.state.result.message === "Success" || _.size(this.state.result.yourOutput) === 0 ? null : <div style={{ color: 'red' }}>
              <hr className="hr-tag" />
              <span className="setting-title" style={{ fontSize: '1.2rem', color: 'red' }} >Differnce&nbsp;:</span>
              <QueryOutputTable data={this.findTwoDiff(JSON.stringify(this.state.result.yourOutput), JSON.stringify(this.state.result.expectedOutput))} />
            </div>
            }
            {_.size(this.state.result.yourOutput) > 0 ?
              <div>
                <hr className="hr-tag" />
                <span className="setting-title" style={{ fontSize: '1.2rem' }} >Your Output&nbsp;:&nbsp;</span>
                {this.state.result.yourOutput.length > 1 ? <QueryOutputTable data={this.state.result.yourOutput} /> : this.state.result.yourOutput.length === 0 ? "No Data" : this.state.result.yourOutput}
                <hr className="hr-tag" />
                <span className="setting-title" style={{ fontSize: '1.2rem' }} >Expected Output&nbsp;:</span>
                <QueryOutputTable data={this.state.result.expectedOutput} />
              </div> : null
            }
          </div>) : null}
      </div>
    </>
  }

  findTwoDiff = (object1String, object2String) => {
    if (object1String === object2String) {
      return
    } else {
      const diff = this.state.result.expectedOutput.filter(obj => !this.state.result.yourOutput.some(obj2 => JSON.stringify(obj) === JSON.stringify(obj2)));
      if (diff.length === 0) {
        const alterDiff = this.state.result.yourOutput.filter(obj3 => !this.state.result.expectedOutput.some(obj4 => JSON.stringify(obj3) === JSON.stringify(obj4)));
        return alterDiff;
      }

      return diff;
    }
  }

  onClickOpenModel = () => {
    logEvent('Button', 'Click');
    if (!this.state.openModal) {
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }
    this.setState({ openModal: !this.state.openModal });
  };

  onCloseModal = () => {
    this.setState({ openModal: !this.state.openModal });
  };

  handleOutsideClick = (e) => {
    if (e.target.className === "modal fade show") {
      this.setState({ openModal: !this.state.openModal });
    }
  };

  videoConstraints = {
    width: 150,
    height: 100,
    facingMode: "user"
  };

  getCameraState = () => {
    navigator.permissions.query({ name: 'camera' }).then(res => {
      this.setState({ stateOfCamera: res.state })
      res.state === 'granted' ? this.setState({ cameraPermission: true }) : this.setState({ cameraPermission: false })
      return res.state
    })
  }

  checkCameraAndGetScreenShotTime = () => {
    if (this.state.queryHasCamera) {
      this.cameraState = setInterval(() => {
        this.getCameraState();
        this.detectWebcam();
      }, 1000);
      this.getScreenShortTime();
    }
  }

  getScreenShortTime = () => {
    axios.get(`${url.ADMIN_API}/onlineTest/getScreenShortTimer?status=${'ACTIVE'}`, { headers: authHeader() })
      .then(res => {
        this.setState({ screenShortTime: res.data.response.screenShortTimer * 1000 }, () => this.takeScreenshot())
      })
  }

  detectWebcam = () => {
    navigator.mediaDevices.getUserMedia({ video: true }).then().catch(err => console.log(err))
    let md = navigator.mediaDevices;
    if (!md?.enumerateDevices) { this.setState({ hasWebcam: false }) }
    else {
      md.enumerateDevices().then(devices => {
        this.setState({ hasWebcam: devices.some(device => 'videoinput' === device.kind) });
      })
    }
  }

  takeScreenshot = () => {
    const camera = document.getElementById("camera");
    this.screenshot = setInterval(() => {
      camera.click()
    }, this.state.screenShortTime)
  }

  sendScreenShot = async () => {
    const { screenShot } = this.state
    let user = JSON.parse(localStorage.getItem("user"))
    screenShot.id = {}
    screenShot.id.examId = localStorage.getItem("examId")
    screenShot.id.candidateId = user.id
    screenShot.screenShotImageBase64 = this.state.base64Image
    screenShot.time = new Date()
    screenShot.questionId = localStorage.getItem('questionId')
    axios.post(this.getAPi() + 'save-screenshot', screenShot, { headers: authHeader() })
      .then()
      .catch()
  }

  render() {
    return (
      <div className="full-screen-view">
        <div className='header'>
          <img className='header-logo' src={LOGO} alt="SkillSort" />
          <div className='header-right'>
            {this.state.start ? <div className="col-3" style={{ paddingLeft: '0px' }}>
              <TimeCounter timeDuration={this.state.examQuestions} submittedConfirm={() => this.submittedConfirm()} />
            </div> : ''}
          </div>
        </div>
        {this.state.stateOfCamera === 'prompt' ?
          <div className='container' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            {<span className='dash-text'>Waiting for camera permission</span>}<i className="fa fa-spinner fa-spin fa-3x fa-fw"></i>
          </div> :
          <Grid style={{ padding: '1rem' }} container spacing={2} >
            <Grid item xs={this.state.isExpand ? 4 : 5}>
              <div style={{ height: 'calc(100vh  - 200px)', overflow: 'auto' }}>
                <div>
                  {this.state.queryHasCamera ?
                    <Webcam style={{ textDecoration: 'none' }}
                      videoConstraints={this.videoConstraints}
                      muted={false}
                      mirrored={true}
                      imageSmoothing={true}
                      screenshotFormat='image/jpeg'
                    >
                      {({ getScreenshot }) => <div id="camera" onClick={() => {
                        this.setState({ base64Image: getScreenshot() }, () => this.sendScreenShot());
                      }} />
                      }
                    </Webcam>
                    : (
                      <span className="title-text">Online Test</span>
                    )}
                </div>
                <hr className="hr-tag" />
                <span className="q-text">Q.{this.state.questionIndex + 1} DBMS Test</span>
                <div className="question-head" style={{ color: "#576871", marginLeft: 15 }}>
                  <p className="instructions" dangerouslySetInnerHTML={{ __html: this.state.currentQuestion }}></p>
                </div>
                <div style={{ paddingTop: '1rem', paddingLeft: '0.25rem' }}>
                  <div className="container" style={{ position: "absolute", bottom: '5rem', width: this.state.isExpand ? "31%" : "40%" }}>
                    <div className="progress" style={{ height: '0.25rem', backgroundColor: 'rgba(59, 72, 158, 0.5)' }}>
                      <div className="progress-bar" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"
                        style={{ width: `${((this.state.questionIndex + 1) / this.state.questions.length) * 100}%`, backgroundColor: '#F05A28' }}>
                      </div>
                    </div>
                    <div className="footer-btn">
                      <div>
                        <button
                          className="btn btn-sm btn-prev"
                          style={{ cursor: 'pointer' }}
                          onClick={(e) => this.previous(e)}
                          disabled={this.state.questionIndex === 0 || this.state.disabledOnRun}>Previous
                        </button>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: '300' }}>Questions {this.state.questionIndex + 1} of {this.state.questions.length}</span>
                      <div>
                        <button
                          className="btn btn-sm btn-nxt"
                          style={{ cursor: 'pointer' }}
                          disabled={this.state.questionIndex === this.state.questions.length - 1 || this.state.disabledOnRun}
                          onClick={(e) => { this.next(e) }}>
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={this.state.isExpand ? 8 : 7}>
              <Card style={{ height: 'calc(100vh - 100px)', overflow: 'auto', padding: '1rem' }}>
                <div className="container" >
                  <div className="col-lg-2 col-md-2 col-sm-2 col-2 col-xl-2 enlarge">
                    <img src={this.state.isExpand ? minimize : enlarge} alt='enlarge' onClick={() => this.setState({ isExpand: !this.state.isExpand })} style={{ cursor: 'pointer', height: '29.7px', width: '29.7px' }} />
                    <span style={{ fontSize: '13px', paddingLeft: '0.8rem', fontWeight: '300' }}>{this.state.isExpand ? "Minimize" : "Enlarge"}<br />Screen</span>
                  </div>
                  <div className="code-editor-section split" >
                    <CodeMirror
                      theme={"dark"}
                      value={this.state.query}
                      extensions={[sql(), EditorView.lineWrapping]}
                      minHeight="50vh"
                      maxHeight="60vh"
                      placeholder="Write a query here"
                      onChange={(value) => {
                        this.setInputQuery(value);
                      }}
                      onPaste={this.copyPasteContent}
                    />
                  </div>
                  <div style={{ paddingRight: this.state.isExpand ? '3rem' : '2rem', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ paddingLeft: '1.5rem' }}>
                      <button
                        style={{ marginTop: '10px' }}
                        type="submit"
                        className="btn btn-prev btn-sm"
                        onClick={this.onClickOpenModel}
                      >
                        Submit
                      </button>
                      {this.state.openModal ? (<SubmitPopup submit={this.submitExam} close={this.onCloseModal} />) : ("")}
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        style={{ marginTop: '10px' }}
                        type="submit"
                        className="btn btn-prev btn-sm ml-2 mr-2 "
                        onClick={() => this.handleRun(this.state.query)}
                      >
                        Run
                      </button>
                      <button
                        style={{ marginTop: '10px' }}
                        type="submit"
                        className="btn btn-nxt btn-sm ml-2 mr-2 "
                        title="save(ctrl+s)"
                        onClick={() => this.saveOnGoingExam()}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                  {this.output()}
                </div>
              </Card>
            </Grid>
          </Grid>}
        {!this.state.cameraPermission && this.state.queryHasCamera && this.state.stateOfCamera !== 'prompt' ? <InstructionForCamera /> : null}
        {!this.state.hasWebcam && this.state.programmingHasCamera ? <UnplugedModal /> : null}
      </div>
    );
  }



}