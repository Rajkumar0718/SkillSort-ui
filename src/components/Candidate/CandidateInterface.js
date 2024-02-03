import React, { useState, useEffect } from 'react';
import _ from "lodash";
import axios from "axios";
import "react-confirm-alert/src/react-confirm-alert.css";
import { browserName, browserVersion, isDesktop, osName, osVersion } from "react-device-detect";
import Webcam from "react-webcam";
import { authHeader } from "../../api/Api";
import LOGO from '../../assests/images/LOGO.svg';
import { logEvent } from '../../utils/Analytics';
import { toastMessage } from "../../utils/CommonUtils";
import TimeCounter from "../../utils/TimeCounter";
import { url } from "../../utils/UrlConstant";
import { isRoleValidation } from "../../utils/Validation";
import Footer from "./Footer";
import InstructionForCamera from "./InstructionForCamera";
import Questions from "./Questions";
import Section from "./Section";
import SubmitPopup from "./SubmitPopup";
import UnplugedModal from "./UnplugedModal";
import './Styles.css'
import { useNavigate } from 'react-router-dom';

export default function CandidateInterface(props) {
  const [start, setStart] = useState(false);
  const [name, setName] = useState("");
  const [exam, setExam] = useState(false);
  const [selectSubject, setSelectSubject] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [jwt, setJwt] = useState("");
  const [isAppsCompleted, setIsAppsCompleted] = useState(false);
  const [programCategory, setProgramCategory] = useState({});
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [induQuestions, setInduQuestions] = useState({});
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [nextQuestionHint, setNextQuestionHint] = useState(false);
  const [QuestionRoles, setQuestionRoles] = useState("CANDIDATE");
  const [examQuestions, setExamQuestions] = useState({
    authTenantId: 0,
    candidateInstruction: "",
    examSubmitMessage: "",
    categories: [
      {
        questions: [
          {
            question: "",
          },
        ],
      },
    ],
    createdDate: null,
    duration: 0,
    id: "",
    link: "",
    name: "",
    startDateTime: "",
    status: "",
    totalQuestions: 0,
    updatedAt: "",
  });
  const [openModal, setOpenModal] = useState(false);
  const [mcqHasCamera, setMcqHasCamera] = useState(false);
  const [programmingHasCamera, setProgrammingHasCamera] = useState(false);
  const [cameraState, setCameraState] = useState('');
  const [screenShortTime, setScreenShortTime] = useState(0);
  const [openFailureSnackBar, setOpenFailureSnackBar] = useState(false)
  const [screenShot, setScreenShot] = useState({});
  const [base64Image, setBase64Image] = useState('');
  const [cameraPermission, setCameraPermission] = useState(true);
  const [hasWebcam, setHasWebcam] = useState(true);
  const [stateOfCamera, setStateOfCamera] = useState('');
  const [examMonitor, setExamMonitor] = useState({
    examId: localStorage.getItem("examId"),
    email: "",
    browserName: browserName,
    browserVersion: browserVersion,
    osName: osName,
    osVersion: osVersion,
    isDesktop: isDesktop,
    mcqStartTime: null,
    mcqEndTime: null,
    mcqHasCamera: false,
    programmingHasCamera: false
  });

  const navigate = useNavigate();
  const exams = () => {
    if (examQuestions && examQuestions.categories && examQuestions.categories[0] && examQuestions.categories[0].questions && examQuestions.categories[0].questions[0]) {
      setInduQuestions(examQuestions.categories[0].questions[0]);
      setExam(true);
    }
  };

  const sessionStart = async () => {
    if (localStorage.getItem("startDate"))
      setStart(true);
    let sessionQuestions = JSON.parse(localStorage.getItem("AnsweredState"));
    let idx = _.findIndex(sessionQuestions?.categories, (c) => c.sectionName === 'PROGRAMMING' || c.groupQuestionType === 'programming');
    let programCategory = sessionQuestions?.categories[idx];
    if (idx !== -1) {
      sessionQuestions.categories.splice(idx, 1)
    }
    setExamQuestions(sessionQuestions);
    setProgramCategory(programCategory);
    exams();
  };
  useEffect(() => {
    // window.addEventListener("unload", handleEventTrackForAbondedExam);
    getExam();
    window.addEventListener("keydown", handleKeyDown);
    window.onbeforeunload = function () {
      return "";
    };

    let sessionQuestions = localStorage.getItem("AnsweredState");
    if (sessionQuestions === null || sessionQuestions === undefined || sessionQuestions === "null") {
      axios
        .get(
          getQuestionApi(),
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        )
        .then((res) => {
          _.map(res.data.response?.categories, o => {
            _.map(o.questions, opt => {
              opt.options = _.shuffle(opt.options)
            })
          })
          localStorage.setItem("examDuration", res.data.response?.duration)
          let questions = _.cloneDeep(res.data.response);

          // Find and replace technical section with user selected section
          let technicalCategory = _.filter(questions.categories, { 'sectionName': 'Technical' });
          if (technicalCategory.length > 0) {
            let technicalCategoryIndex = _.findIndex(questions.categories, { 'sectionName': 'Technical' });
            questions.categories[technicalCategoryIndex].sectionName = localStorage.getItem("technical");
          }

          let indx = _.findIndex(questions.categories, (c) => c.sectionName === 'PROGRAMMING' || c.groupQuestionType === 'programming');
          setProgramCategory(res.data.response.categories[indx]);
          if (indx !== -1) {
            questions.categories.splice(indx, 1);
          }
          setExamQuestions(questions);
          setInduQuestions(questions.categories[0].questions[0]);
          setExam(true);
          localStorage.setItem('questionId', induQuestions.id);
          saveOnGoingExam();
        });
    } else {
      sessionStart();
    }
    if (!localStorage.getItem('jwtToken')) {
      window.close()
    }
  }, []);

  const handleKeyDown = (event) => {
    if (
      (event.ctrlKey && event.shiftKey && event.keyCode === 73) || // Ctrl+Shift+I
      event.keyCode === 123 // F12
    ) {
      event.preventDefault();
    }
  };

  const getExam = async () => {
    axios.get(`${url.CANDIDATE_API}/candidate/exam/instruction?examId=${localStorage.getItem("examId")}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    ).then(res => {
      setMcqHasCamera(res.data.response.isMcqCamera);
      setProgrammingHasCamera(res.data.response.isProgrammingCamera);
      checkCameraAndGetScreenShotTime();
    })
      .catch(error => toastMessage('error', 'Error while fetching exam'));
  };

  const checkCameraAndGetScreenShotTime = () => {
    if (mcqHasCamera) {
      const intervalId = setInterval(() => {
        getCameraState();
        detectWebcam();
      }, 1000);
      setCameraState(intervalId);
      getScreenShortTime();
    }
  };

  const selectedAnswer = (categoryIndex, questionIndex, option) => {
    let selectedQuestion = {
      ...examQuestions.categories[categoryIndex].questions[questionIndex],
      selectedAnswer: option.name,
    };

    let ques = {
      ...examQuestions,
      categories: examQuestions.categories.map((cat, catIndex) =>
        catIndex === categoryIndex
          ? {
            ...cat,
            questions: cat.questions.map((q, qIndex) =>
              qIndex === questionIndex ? selectedQuestion : q
            ),
          }
          : cat
      ),
    };

    setExamQuestions(ques);
    setInduQuestions(selectedQuestion);
    localStorage.setItem("AnsweredState", JSON.stringify(examQuestions));
    saveOnGoingExam();
  };

  const saveOnGoingExam = async () => {
    let answeredState = JSON.parse(localStorage.getItem('AnsweredState'));
    let indx = _.findIndex(answeredState?.categories, (c) => c.sectionName === 'PROGRAMMING' || c.groupQuestionType === 'programming');
    if (indx === -1 && programCategory) {
      answeredState?.categories.push(programCategory);
      localStorage.setItem('AnsweredState', JSON.stringify(answeredState));
    }
    let category = answeredState?.categories
    let sessionUser = JSON.parse(localStorage.getItem('user'));
    if (!localStorage.getItem("startTime")) {
      let startTime = new Date();
      localStorage.setItem("startTime", startTime);
      localStorage.setItem('examStartTime', startTime);
    }
    setDataInExamMonitor(new Date(localStorage.getItem("startTime")), sessionUser);
    const submittedExam = {
      id: localStorage.getItem("onGoingExamId"),
      candidateId: sessionUser.id,
      examId: localStorage.getItem("examId"),
      categories: category,
      isAppsCompleted: isAppsCompleted,
      examMonitor: examMonitor,
    };

    submittedExam["startDate"] = new Date(localStorage.getItem("startTime"));

    if (programCategory && localStorage.getItem("languageName")) {
      submittedExam["preferredLanguage"] = localStorage.getItem("languageName");
    }
    if (localStorage.getItem("level")) {
      const level = JSON.parse(localStorage.getItem("level"))
      submittedExam.level = level?.level
    }

    await axios.post(getAPi() + "onGoingExam", submittedExam, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    }).then((res) => {
      localStorage.setItem("onGoingExamId", res.data.response.id);
      localStorage.setItem("startDate", res.data.response.startDate);
      setStart(true)
      if (isAppsCompleted) {
        localStorage.removeItem("startTime")
        localStorage.removeItem("startDate")
        localStorage.removeItem("seconds")
        localStorage.removeItem("examTimeUp")
        navigate("/program");
      }
    }).catch(() => {
      toastMessage('error', 'Error occured while saving ongoing exam');
    });
  };

  const getAPi = () => {
    if (isRoleValidation().includes("COLLEGE_STUDENT"))
      return `${url.COLLEGE_API}/onlineTest/`;
    else if (isRoleValidation().includes("COMPETITOR") || isRoleValidation().includes("DEMO_ROLE"))
      return `${url.COMPETITOR_API}/onGoingTest/`;

    return `${url.CANDIDATE_API}/candidate/`;
  };

  const getQuestionApi = () => {
    const examId = localStorage.getItem("examId");
    const technical = localStorage.getItem("technical");

    if (isRoleValidation().includes("COLLEGE_STUDENT") && technical) {
      return `${url.COLLEGE_API}/onlineTest/` + examId +
        `/questionList?questionRoles=${QuestionRoles}&technical=${technical}`;
    }
    else if (isRoleValidation().includes("COMPETITOR") || isRoleValidation().includes("DEMO_ROLE")) {
      return `${url.COMPETITOR_API}/onlineTest/` + examId +
        `/questionList?questionRoles=${QuestionRoles}&technical=${technical}`;
    }

    return `${url.CANDIDATE_API}/candidate/` +
      examId +
      `/questionList?questionRoles=${QuestionRoles}&techType=${""}`;
  };

  const pinned = (categoryIndex, questionIndex) => {
    logEvent('Button', 'Click');
    let selectedQuestion = {...examQuestions.categories[categoryIndex]
      .questions[questionIndex],isPinned : true
    };
    let ques = {...examQuestions};
    ques.categories[categoryIndex].questions[questionIndex] = selectedQuestion;
    setExamQuestions(ques);
    setInduQuestions(selectedQuestion)
    localStorage.setItem(
      "AnsweredState",
      JSON.stringify(ques)
    );
  };

  const unPinned = (categoryIndex, questionIndex) => {
    let selectedQuestion = {...examQuestions.categories[categoryIndex]
      .questions[questionIndex],isPinned : false}
    let ques = {...examQuestions};
    ques.categories[categoryIndex].questions[questionIndex] = selectedQuestion;
    setExamQuestions(ques);
    setInduQuestions(selectedQuestion)

    localStorage.setItem(
      "AnsweredState",
      JSON.stringify(ques)
    );
  };





  const move = (categoryIndex, questionIndex) => {
    logEvent('Button', 'Click');
    setCategoryIndex(categoryIndex);
    setQuestionIndex(questionIndex);
    setNextQuestionHint(false);
    let selectedQuestion = {
      ...examQuestions.categories[categoryIndex].questions[questionIndex]
    }
    // let induQuestions = examQuestions.categories[categoryIndex].questions[questionIndex];
    setInduQuestions(selectedQuestion);
    localStorage.setItem('questionId', selectedQuestion.id);
  };


  const onClickOpenModel = () => {
    logEvent('Button', 'Click');
    if (!openModal) {
      document.addEventListener("click", handleOutsideClick, false);
    } else {
      document.removeEventListener("click", handleOutsideClick, false);
    }
    setOpenModal(!openModal);
  };

  const onCloseModal = () => {
    setOpenModal(!openModal);
  };

  const handleOutsideClick = (e) => {
    logEvent('Button', 'Click');
    if (e.target.className === "modal fade show") {
      setOpenModal(!openModal);
    }
  };

  const detectWebcam = async () => {
    let md = navigator.mediaDevices;
    if (!md || !md.enumerateDevices) { setHasWebcam(false) }
    else {
      md.enumerateDevices().then(devices => {
        setHasWebcam(devices.some(device => 'videoinput' === device.kind));
      })
    }
  };

  const getScreenShortTime = () => {
    axios.get(`${url.ADMIN_API}/onlineTest/getScreenShortTimer?status=${'ACTIVE'}`, { headers: authHeader() })
      .then(res => {
        setScreenShortTime(res.data.response.screenShortTimer * 1000);
        takeScreenshot();
      })
  }

  const takeScreenshot = async () => {
    await new Promise(resolve => setTimeout(resolve, hasWebcam ? 1000 : 0));
    const camera = document.getElementById("camera");
    setInterval(() => {
      camera?.click()
    }, screenShortTime)
  };

  const sendScreenShot = async () => {
    await detectWebcam();
    const { screenShot } = screenShot;
    let user = JSON.parse(localStorage.getItem("user"))
    screenShot.id = {}
    screenShot.id.examId = localStorage.getItem("examId")
    screenShot.id.candidateId = user.id
    screenShot.screenShotImageBase64 = base64Image
    screenShot.time = new Date()
    screenShot.questionId = localStorage.getItem('questionId')
    if (cameraPermission && hasWebcam) {
      axios.post(getAPi() + 'save-screenshot', screenShot, { headers: authHeader() })
        .then()
        .catch()
    }
  }

  const getCameraState = async () => {
    await navigator.permissions.query({ name: 'camera' }).then(res => {
      console.log(res.state);
      setStateOfCamera(res.state)
      res.state === 'granted' ? setCameraPermission(true) : setCameraPermission(false)
      return res.state
    })
  }

  useEffect(() => {
    return () => {
      clearInterval(screenShot);
      clearInterval(cameraState);
      // window.removeEventListener('unload', handleEventTrackForAbondedExam);
    }
  }, []);

  const submitExam = (_e) => {
    logEvent('Button', 'Click');
    if (programCategory) {
      let answeredState = JSON.parse(localStorage.getItem('AnsweredState'));
      let indx = _.findIndex(answeredState?.categories, (c) => c.sectionName === 'PROGRAMMING' || c.groupQuestionType === 'programming');
      if (indx === -1) {
        answeredState?.categories.push(programCategory);
        localStorage.setItem('AnsweredState', JSON.stringify(answeredState));
      }
      setIsAppsCompleted(true);
      saveOnGoingExam();
    } else {
      let submitExam = [];
      let sessionUser = JSON.parse(localStorage.getItem('user'));
      setDataInExamMonitor(null, sessionUser)
      const submittedExam = {
        submittedExam: submitExam,
        candidateId: sessionUser.id,
        candidateCreatedBy: sessionUser.createdBy,
        examId: localStorage.getItem("examId"),
        examMonitor: examMonitor,
      };

      if (localStorage.getItem("collegeId")) {
        submittedExam["collegeId"] = localStorage.getItem("collegeId");
      }

      let examQuestions = JSON.parse(localStorage.getItem('AnsweredState'));
      if (examQuestions) {
        pushSubmittedExam(examQuestions?.categories, submitExam);
      } else {
        pushSubmittedExam(examQuestions?.categories, submitExam);
      }

      axios.post(getAPi() + "submitExam", submittedExam, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      })
        .then(() => {
          localStorage.removeItem("examTimeUp");
          localStorage.removeItem("examStartTime")
          navigate('/thankYou');
        })
        .catch(() => {
          toastMessage('error', "Oops something went wrong!");
        });
    }
  }
  const setDataInExamMonitor = (time, value) => {
    let monitor = examMonitor;
    if (isAppsCompleted) {
      monitor.mcqEndTime = new Date();
      setExamMonitor(monitor);
    } else {
      monitor.email = value.email;
      monitor.mcqStartTime = time;
      setExamMonitor(monitor);
    }
  }

  const submittedConfirm = () => {
    let user = JSON.parse(localStorage.getItem("user"));
    let examId = localStorage.getItem("examId");
    let token = localStorage.getItem("jwtToken");
    axios.get(`${url.CANDIDATE_API}/candidate/check/` + user?.id + `/` + examId,
      { headers: { Authorization: "Bearer " + token } }
    ).then(() => {
      toastMessage('error', "Test Already Submitted..!")
      navigate('/thankYou');
    })
      .catch(() => {
        submitExam();
      });
  }

  const pushSubmittedExam = (categories, submitExam) => {
    categories?.forEach((category) => {
      category?.questions.forEach((question) => {
        let selectOption = question.selectedAnswer;
        submitExam.push({ question, selectOption });
      });
    });
  }

  const videoConstraints = {
    width: 150,
    height: 100,
    facingMode: "environment"
  };


  const handleAnswerChange = (e, categoryIndex, questionIndex) => {
    let selectedQuestion = examQuestions.categories[categoryIndex]
      .questions[questionIndex];
    selectedQuestion.selectedAnswer = e.target.value.trim();
    let ques = examQuestions;
    ques.categories[categoryIndex].questions[questionIndex] = selectedQuestion;
    setExamQuestions(ques);
    localStorage.setItem(
      "AnsweredState",
      JSON.stringify(examQuestions)
    );
    saveOnGoingExam();
  }

  const handleRightClick = (event) => {
    // if (!url.UI_URL.includes('demo'))
    //  event.preventDefault();
  }

  const restrictCopy = (event) => {
    event.preventDefault();
    setOpenFailureSnackBar(true)
  }


  return (
    <div onContextMenu={handleRightClick} onCopy={restrictCopy}>
      {exam === true ? (
        <div>
          <nav className="navbar" style={{ backgroundColor: '#3B489E', height: '58px', display: 'flex', justifyContent: 'space-between' }}>
            <img src={LOGO} alt="" style={{ position: "absolute", width: "116.7px", height: "30.2px", left: '2.3rem' }} />
            {start ? <div className="card-body" style={{ marginRight: '2.5rem', textAlign: 'right' }} >
              <TimeCounter
                timeDuration={examQuestions}
                submittedConfirm={submittedConfirm}
              />
            </div> : ''}
          </nav>
          {stateOfCamera === 'prompt' ?
            <div className='container' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
              {<span className='dash-text'>Waiting for camera permission</span>}<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>
            </div> :
            <div className='container-fluid' style={{ height: 'auto', marginTop: "-10px" }}>
              <div style={{display:'flex'}}>
                <div className="mt-2" style={{ width: 'calc(100vw - 14rem)', marginRight: '0.9rem' }} >
                  <div className='examBody'>
                    <div className='line1'>
                      <p className='secondaryTest'>Online Test</p>
                      {mcqHasCamera ? <Webcam style={{ textDecoration: 'none', marginLeft: '1rem', marginTop: '2px' }}
                        videoConstraints={videoConstraints}
                        muted={false}
                        mirrored={true}
                        screenshotFormat='image/jpeg'
                      >
                        {({ getScreenshot }) =>
                          <div id="camera" onClick={() => {
                            setBase64Image(getScreenshot());
                            console.log("imgUrl", base64Image);
                            sendScreenShot();
                          }} />
                        }
                      </Webcam>
                        : null}
                    </div>
                    <Questions
                      questionIndex={questionIndex}
                      categoryIndex={categoryIndex}
                      Question={induQuestions}
                      selectedAnswer={selectedAnswer}
                      pinned={pinned}
                      unPinned={unPinned}
                      nextQuestionHint={nextQuestionHint}
                      totalQuestions={examQuestions}
                      move={move}
                      handleAnswerChange={handleAnswerChange}
                      section={induQuestions?.section?.toUpperCase()}
                    />
                    <div className='card-footer' style={{ border: 'none', padding: '0rem 0rem' }}>
                      <Footer
                        footer={examQuestions}
                        questionIndex={questionIndex}
                        categoryIndex={categoryIndex}
                        totalQuestions={examQuestions}
                        section={induQuestions?.section?.toLowerCase()}
                        move={move}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-2" style={{ width: '13rem', paddingLeft: '0', paddingRight: "0.5rem", paddingTop: '1rem' , marginRight:'-1rem'}}>
                  <Section
                    section={examQuestions}
                    categoryIndex={categoryIndex}
                    move={move}
                    submited={onClickOpenModel}

                  />
                  {openModal ? (<SubmitPopup submit={submittedConfirm} close={onCloseModal} />) : ("")}
                </div>
              </div>
              {!cameraPermission && mcqHasCamera && stateOfCamera !== 'prompt' ? <InstructionForCamera /> : null}
              {!hasWebcam && mcqHasCamera ? <UnplugedModal /> : null}
            </div>
          }
        </div>
      ) : ""}
    </div>
  );
}
