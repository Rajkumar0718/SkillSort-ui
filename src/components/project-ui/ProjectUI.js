/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Drawer, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import axios from 'axios';
import _ from 'lodash';
import { browserName, browserVersion, isDesktop, osName, osVersion } from 'react-device-detect';
import LOGO from '../../assests/images/LOGO.svg';
// import { logEvent } from '../../utils/Analytics';
import { toastMessage } from '../../utils/CommonUtils';
import TimeCounter from '../../utils/TimeCounter';
import { url } from '../../utils/UrlConstant';
import { isRoleValidation } from '../../utils/Validation';
import ProjectInit from './ProjectInit';
import SubmitPopup from '../Candidate/SubmitPopup';
import { useNavigate } from 'react-router';
import { authHeader } from '../../api/Api';

const ProjectUi = () => {
  const navigate = useNavigate();
  const [openSandBox, setOpenSandBox] = useState(false);
  const [start, setStart] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [examQuestions, setExamQuestions] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [languageName, setLanguageName] = useState('');
  const [ongoingExam, setOngoingExam] = useState({});
  const [openModal, setOpenModal] = useState(false)
  const examMonitor = {
    examId: localStorage.getItem('examId'),
    browserName: browserName,
    browserVersion: browserVersion,
    osName: osName,
    osVersion: osVersion,
    isDesktop: isDesktop,
  }

  useEffect(() => {
    initialCall();
    const sessionQuestions = localStorage.getItem('AnsweredState');
    if (!sessionQuestions) {
      getQuestion();
    } else {
      sessionStart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initialCall = () => {
    let sessionUser = JSON.parse(localStorage.getItem('user'));
    const examId = localStorage.getItem('examId');
    if (localStorage.getItem('publicExam')) {
      axios
        .get(`${url.CANDIDATE_API}/candidate/public/onGoing/exam?email=${sessionUser.email}&examId=${examId}&companyId=${sessionUser.companyId}`)
        .then((res) => {
          setViewForProjectExam(res.data.response);
        })
        .catch((err) => {
          if(err.response?.status === 401) {
              localStorage.clear()
              sessionStorage.clear()
              navigate('/thankYou')
          }
        });
    } else {
      axios
        .get(`${url.CANDIDATE_API}/candidate/onGoing/exam?email=` + sessionUser.email + `&examId=` + examId, {
          headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` },
        })
        .then((res) => {
          setViewForProjectExam(res.data.response);
        })
        .catch((err) => {
          if (err.response?.status === 401) {
            localStorage.clear()
            sessionStorage.clear()
            navigate('/thankYou')
          }
        });
    }
  };

  const setViewForProjectExam = (onGoingExam) => {
    if (onGoingExam) {
      if (onGoingExam.projectFramework) {
        localStorage.setItem('onGoingExamId', onGoingExam.id);
        setLanguageName(onGoingExam.projectFramework);
        setOpenSandBox(true);
        setOngoingExam(onGoingExam);

      }
    }
  };

  const language = (event) => {
    event.preventDefault();
    setLanguageName(event.target.value);
  };

  const sessionStart = () => {
    let sessionQuestions = JSON.parse(localStorage.getItem('AnsweredState'));
    if (localStorage.getItem('onGoingExamId') && !localStorage.getItem('startDate')) {
      saveOnGoingExam();
    } else {
      setInitStateForSession(sessionQuestions);
    }
  };

  const setInitStateForSession = (sessionQuestions) => {
    localStorage.setItem('examDuration', sessionQuestions?.projectDuration);
    setCurrentQuestion(sessionQuestions?.categories[0]?.questions[0]);
    setExamQuestions(sessionQuestions);
    setQuestionsForOngoing();
    if (localStorage.getItem('startDate')) setStart(true);
  };

  const getQuestion = () => {
    axios
      .get(`${url.CANDIDATE_API}/candidate/` + localStorage.getItem('examId') + `/questionList?questionRoles=CANDIDATE&techType=`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      })
      .then((res) => {
        let questionsFlatten = _.flatten(_.map(res.data.response.categories, 'questions'));
        localStorage.setItem('examDuration', res.data.response.projectDuration);
        setExamQuestions(res.data.response);
        setCurrentQuestion(questionsFlatten[0]);
        setQuestionsForOngoing()
      });
  };

  const saveOnGoingExam = () => {
    let answeredState = JSON.parse(localStorage.getItem('AnsweredState'));
    let category = answeredState?.categories;
    let sessionUser = JSON.parse(localStorage.getItem('user'));
    if (!localStorage.getItem('startTime')) {
      let startTime = new Date();
      localStorage.setItem('startTime', startTime);
    }
    const submittedExam = {
      id: localStorage.getItem('onGoingExamId'),
      candidateId: sessionUser?.id,
      examId: localStorage.getItem('examId'),
      categories: category,
      projectFramework: languageName,
    };
    submittedExam['startDate'] = new Date(localStorage.getItem('startTime'));
    axios
      .post(`${getAPi()}onGoingExam`, submittedExam, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      })
      .then((res) => {
        localStorage.setItem('onGoingExamId', res.data.response.id);
        localStorage.setItem('startDate', res.data.response.startDate);
        if (!localStorage.getItem('seconds')) {
          setInitStateForSession(answeredState);
        }
      })
      .catch((err) => {
        toastMessage('error', 'Oops something went wrong!');
      });
  };

  const saveCode = (showToast) => {
    let sandPackFile = localStorage.getItem('filesJson')
    ongoingExam.sandPackFile = sandPackFile
    axios.post(`${url.CANDIDATE_API}/candidate/onGoingExam`, ongoingExam , {
      headers: authHeader()
    }).then(()=>{
      if(typeof showToast !== 'boolean') {
        toastMessage('success','Code Saved Successfully')      
      }
    }).catch((error) => {
      // errorHandler(error)
      toastMessage('error','Error while saving code')
    });
  }

  useEffect(() => {
    setQuestionsForOngoing()
  }, [examQuestions.id])

  const setQuestionsForOngoing = () => {
    let answerState = localStorage.getItem('AnsweredState');
    localStorage.setItem('questionId', currentQuestion?.id);
    if ((!answerState || answerState!=='{}') && examQuestions.id) {
      localStorage.setItem('AnsweredState', JSON.stringify(examQuestions));
    }
  };

  const submittedConfirm = () => {
    if (localStorage.getItem('user')) {
      let user = JSON.parse(localStorage.getItem('user'));
      let email = user?.email;
      let examId = localStorage.getItem('examId');
      let token = localStorage.getItem('jwtToken');
      axios
        .get(`${url.CANDIDATE_API}/candidate/check/` + email + `/` + examId, {
          headers: { Authorization: 'Bearer ' + token },
        })
        .then(() => {
          toastMessage('error', 'Test Already Submitted..!');
          navigate('/thankYou')
        })
        .catch(() => {
          submitExam();
        });
    }
  };

  const getOnGoingExam = () => {
    return new Promise((resolve, reject) => {
      let sessionUser = JSON.parse(localStorage.getItem('user'));
      const examId = localStorage.getItem('examId');
      if (localStorage.getItem('publicExam')) {
        axios
          .get(`${url.CANDIDATE_API}/candidate/public/onGoing/exam?email=${sessionUser.email}&examId=${examId}&companyId=${sessionUser.companyId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` },
          })
          .then((res) => {
            let onGoingExam = res.data.response;
            resolve(onGoingExam?.sandPackFile);
          })
          .catch((err) => {
            reject(err);
          });
      } else {
        axios
          .get(`${url.CANDIDATE_API}/candidate/onGoing/exam?email=${sessionUser.email}&examId=${examId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` },
          })
          .then((res) => {
            let onGoingExam = res.data.response;
            resolve(onGoingExam?.sandPackFile);
          })
          .catch((err) => {
            reject(err);
          });
      }
    });
  };

  const onClickOpenModel = () => {
    if (!openModal) {
      document.addEventListener('click', handleOutsideClick, false);
    } else {
      document.removeEventListener('click', handleOutsideClick, false);
    }
    setStateForModal();
  };

  const setStateForModal = () => {
    setOpenModal((prevOpenModal) => !prevOpenModal);
  };

  const handleOutsideClick = (e) => {
    if (e.target.className === 'modal fade show') {
      setStateForModal();
    }
  };

  const submitExam = async () => {
    let submitExam = [];
    let sandPackFile = {};
    let sessionUser = JSON.parse(localStorage.getItem('user'));
    await getOnGoingExam().then((result) => {
      sandPackFile = result;
    });
    const submittedExam = {
      submittedExam: submitExam,
      candidateId: sessionUser?.id,
      candidateCreatedBy: sessionUser?.createdBy,
      examId: localStorage.getItem('examId'),
      programmingRound: false,
      sqlRound: false,
      examMonitor: examMonitor,
      sandPackFile: sandPackFile,
      frontendLanguage: languageName,
    };

    let examQuestions = JSON.parse(localStorage.getItem('AnsweredState'));
    _.map(examQuestions.categories[0].questions, (question) => {
      submitExam.push({ question });
    });

    axios
      .post(`${getAPi()}/project/submitExam`, submittedExam, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      })
      .then(() => {
        localStorage.removeItem('examStartTime');
        navigate('/thankYou')
      })
      .catch(() => {
        toastMessage('error', 'Oops something went wrong!');
      });
  };

  const getAPi = () => {
    const roles = isRoleValidation();

    if (roles.includes('COLLEGE_STUDENT')) {
      return `${url.COLLEGE_API}/onlineTest/`;
    } else if (roles.includes('COMPETITOR') || roles.includes('DEMO_ROLE')) {
      return `${url.COMPETITOR_API}/onGoingTest/`;
    } else {
      return `${url.CANDIDATE_API}/candidate/`;
    }
  };

  const handleOpenSandBox = () => {
    saveOnGoingExam();
    setOpenSandBox(true);
  };

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
    saveCode(true)
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="full-screen-view">
      <div className='header'>
        <img className='header-logo' src={LOGO} alt="SkillSort" />
        <div className='header-right'>
          {start ? (
            <div className="col-3" style={{ paddingLeft: '0px' }}>
              <TimeCounter timeDuration={examQuestions} submittedConfirm={submittedConfirm} />
            </div>
          ) : ''}
        </div>
      </div>

      {openSandBox ? (
        <>
          <div style={{ display: 'flex', flexDirection: 'row', height: 'calc(100vh - 8rem)' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '3vw', justifyContent: 'center', height: '100%', backgroundColor: '#011627', color: 'white' }} >
              <div style={{ writingMode: 'vertical-lr', cursor: 'pointer' }} onClick={handleDrawerOpen}>
                View Question
              </div>

              <Drawer anchor="left" open={isDrawerOpen} onClose={handleDrawerClose}>
                <div>
                  <IconButton onClick={handleDrawerClose}>
                    <ChevronLeftIcon />
                  </IconButton>
                  <div className="instructions" dangerouslySetInnerHTML={{ __html: currentQuestion.question }}></div>
                </div>
              </Drawer>
            </div>

            <ProjectInit language={languageName} onGoingExam={ongoingExam} />
            <div>
            </div>
          </div>
          <div className='row' style={{marginTop:'0.5rem'}}>
            <div className='col-lg-5 col-md-5 col-xl-5'/>
            <div className='col-lg-4 col-md-4 col-xl-4' style={{display:'flex',justifyContent:'space-evenly'}}>
              <button onClick={saveCode} className="btn btn-sm btn-prev" >Save Code</button>
              <button onClick={onClickOpenModel} className="btn btn-sm btn-nxt" type="submit" >Submit</button>
            </div>
          </div>
          {openModal ? (<SubmitPopup submit={submitExam} close={setStateForModal} />) : null}

        </>
      ) : (
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <div style={{ height: 'calc(100vh - 280px)', overflowY: 'auto' }}>
            <span className="q-text">Q.{1} Project</span>
            <div className="question-head" style={{ color: "#576871", marginLeft: 15 }}>
              <p className="instructions" dangerouslySetInnerHTML={{ __html: currentQuestion.question }}></p>
            </div>
          </div>
          <div style={{ borderLeft: '4px solid #e0e0e0', flex: 1, overflowY: 'auto', marginTop: '2rem' }}>
            <div className="row can-section" style={{ alignItems:'center' }}>
              <div style={{ marginTop: '1rem',fontWeight:'bold', fontSize:'large' }} className="col">
                In which programming Language would you like to create the project?<span className="required"></span>
              </div>
                <div className="col-2 col-md-2 col-lg-2">
                <select
                  style={{ color: '#3B489E' }}
                  value={languageName}
                  onChange={language}
                  className="form-select section"
                >
                  <option value="">Select language</option>
                  <option value="react">REACT-JS</option>
                  <option value="react-ts">REACT-TS</option>
                  <option value="angular">ANGULAR</option>
                  <option value="vue">VUE</option>
                  <option value="vue-ts">VUE-TS</option>
                  <option value="svelte">SVELTE</option>
                  <option value="vanilla">VANILLA</option>
                </select>
              </div>
            </div>
            <div className="row" style={{ marginTop: '2rem' }}>
                <div className='col' style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  disabled={!languageName}
                  onClick={() => handleOpenSandBox()}
                  className="btn btn-sm btn-nxt"
                  style={{ float: 'right', marginRight: '1.8rem', marginTop: '1rem' }}
                >
                  Start
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default ProjectUi