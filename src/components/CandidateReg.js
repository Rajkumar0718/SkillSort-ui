import { FormControl, FormHelperText } from "@mui/material";
import { LocalizationProvider, DatePicker as MuiDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from "axios";
import _ from 'lodash';
import moment from "moment";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { errorHandler } from "../api/Api";
import LOGO from '../assests/images/LOGO.svg';
import  url  from "../utils/UrlConstant";
import { isEmpty, isValidEmail, isValidMobileNo, isValidName } from "../utils/Validation";
import ExamTimeOver from "./Candidate/ExamTimeOver";
import TakePicture from "./Candidate/TakePicture";
import { withLocation } from "../utils/CommonUtils";

const FIELD_REQUIRED = 'Field is Required!';

const CandidateReg = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [timeOver, setTimeOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isValidExamTime, setIsValidExamTime] = useState(false);
  const [loadPage, setLoadPage] = useState(false)
  const [disable, setDisable] = useState(false);
  const [examId, setExamId] = useState("");
  const [setting, setSetting] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [mcqHasCamera, setMcqHasCamera] = useState(false);
  const [programmingHasCamera, setProgrammingHasCamera] = useState(false);
  const [exam, setExam] = useState({});
  const companyId = params.companyId;
  const [startDate, setStartDate] = useState(new Date())

  // User state should be an object with useState
  const [user, setUser] = useState({
    companyId: params.companyId,
    email: location.state,
    firstName: "",
    lastName: "",
    phone: "",
    password: null,
    dob: null,
    gender: "",
    qualification: "",
    institution: "",
    sslcPercentage: "",
    hscPercentage: "",
    ugPercentage: "",
    pgPercentage: "",
  });
  // Error state should be an object with useState
  const [error, setError] = useState({
    email: false,
    helperTxtMail: "",
    firstName: false,
    helperTxtFirstName: "",
    lastName: false,
    helperTxtLastName: "",
    phone: false,
    helperTxtPhone: "",
    dob: false,
    helperTxtDob: "",
    gender: false,
    helperTxtGender: "",
    qualification: false,
    helperTxtQualification: "",
    institution: false,
    helperTxtInstitution: "",
    sslcPercentage: false,
    helperTxtSslcPercentage: "",
    hscPercentage: false,
    helperTxtHscPercentage: "",
    ugPercentage: false,
    helperTxtUgPercentage: "",
    pgPercentage: false,
    helperTxtPgPercentage: "",
    resumeFile: false,
    helperTxtResumeFile: "",
  });

  useEffect(() => {
    getExamIdByLink();
    getCandidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const getExamIdByLink = () => {
    const companyId = params.companyId;
    const hascode = params.examId;
    axios.get(`${url.CANDIDATE_API}/candidate/find-exam-by-hascode?hashCode=${companyId}/${hascode}`)
      .then(res => {
        const exam = res.data.response;
        setExam(exam);
        setExamId(exam.id)
        setSetting(exam.setting);
        setMcqHasCamera(exam.isMcqCamera);
        setProgrammingHasCamera(exam.isProgrammingCamera);
        setStartDate(new Date(exam.startDateTime));
      }).catch((er) => {
        toast.error("Something went wrong!");
      });
  };

  const getCandidate = () => {
    axios.get(`${url.CANDIDATE_API}/candidate/public/findByCompanyId-byEmail?email=${user.email}&companyId=${companyId}`)
      .then(res => {
        setUser(res.data.response);
      }).catch((err) => console.log(err));
  };

  useEffect(() => {
    if (examId) {
      checkIsValidExamTime();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId]);

  useEffect(() => {
    if (exam.startDateTime && exam.tokenValidity) {
      checkExamTimeOverOrNot()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exam.startDateTime, exam.tokenValidity])

  const checkExamTimeOverOrNot = () => {
    const startDate = new Date(exam.startDateTime)
    const expiryDate = new Date(startDate.setDate(startDate.getDate() + exam.tokenValidity))
    if (new Date() > expiryDate) {
      setTimeOver(true)
    } else {
      setTimeOver(false)
    }
  }
  const checkIsValidExamTime = () => {
    checkAlreadyRegistered();
    localStorage.clear()
    localStorage.setItem("examId", examId);
    axios.get(`${url.CANDIDATE_API}/candidate/` + examId + `/public/check`
    ).then((res) => {
      checkValidExamTime(res);
    }).catch((err) => {
      toast.error("Something went wrong !")
    });

  }

  const checkValidExamTime = (res) => {
    if (res.data.message === "true") {
      setIsValidExamTime(true)
      setLoadPage(true)
    } else {
      setIsValidExamTime(false)
      setLoadPage(true)
    }
  }

  const checkAlreadyRegistered = () => {
    axios.get(`${url.CANDIDATE_API}/candidate/check-public-user-written-exam?email=${user.email}&examId=${examId}&companyId=${companyId}`
    ).then((response) => {
      if (response.data.response === true) {
        return navigate('/candidate/re-exam-request', { state: { email: user.email, examId: examId, companyId: companyId } })
      }
      if (exam.languageName && exam.languageId !== "") {
        localStorage.setItem("languageName", exam.languageName);
        localStorage.setItem("languageId", exam.languageId);
      }
      checkOnGoingExam();
    }).catch((err) => {
      errorHandler(err)
    });
  }

  const checkOnGoingExam = () => {
    axios.get(`${url.CANDIDATE_API}/candidate/public/onGoing/exam?email=${user.email}&examId=${examId}&companyId=${companyId}`).then((res) => {
      const ongoingExam = res.data.response
      if (!ongoingExam) {
        return;
      }
      if (ongoingExam.isExamSubmitted) {
        return navigate('/candidate/re-exam-request', { state: { email: user.email, examId: examId, companyId: companyId } })
      }
      localStorage.setItem("jwtToken", ongoingExam.candidate.jwtToken);
      localStorage.setItem("onGoingExamId", res.data.response.id);
      localStorage.setItem("user", JSON.stringify(ongoingExam.candidate));
      localStorage.setItem('publicExam', true)
      if (ongoingExam.startDate) {
        localStorage.setItem("startDate", ongoingExam.startDate);
      }
      if (ongoingExam.preferredLanguage) {
        localStorage.setItem("languageName", ongoingExam.preferredLanguage);
        localStorage.setItem("languageId", ongoingExam.preferredLanguage);
      }

      if (ongoingExam.categories) {
        exam["categories"] = ongoingExam.categories;
        localStorage.setItem("AnsweredState", JSON.stringify(exam));
      }
      localStorage.setItem("examSubmitMessage", exam.examSubmitMessage);
      let startTime = new Date(ongoingExam.startDate);
      localStorage.setItem("startTime", startTime);
      localStorage.setItem("startDate", startTime);
      sessionStorage.setItem("startDate", startTime);
      sessionStorage.setItem("startTime", startTime);
      let duration = ongoingExam.isAppsCompleted ? exam.programmingDuration : exam.projectDuration ? exam.projectDuration : exam.duration
      localStorage.setItem("examDuration", duration)
      let programming = _.filter(ongoingExam.categories, { 'sectionName': 'PROGRAMMING' }).length > 0;
      const pathname = `${programming && ongoingExam.isAppsCompleted ? '/program' : exam.projectDuration ? '/project' : '/test'}`
      // this.props.history.push(`/candidate/register/${companyId}/${this.props.match.params.examId}`)
      navigate(pathname)
    }).catch((err) => console.log(err))
  }

  const dobValidation = () => {
    let maxAge = setting.max;
    let minAge = setting.min;
    let yyyy = new Date().getFullYear();
    let minDob = "01/01/" + (yyyy - maxAge);
    let maxDob = "31/12/" + (yyyy - minAge);
    let enteredDate = new Date(user.dob);
    let textError = "";
    if ((enteredDate.getFullYear() >= (yyyy - maxAge)) && (enteredDate.getFullYear() <= (yyyy - minAge))) {
      return "";
    } else {
      if (enteredDate.getFullYear() < (yyyy - maxAge)) {
        textError = "DOB must on or after " + minDob;
      } else if (enteredDate.getFullYear() > (yyyy - minAge)) {
        textError = "DOB must on or before " + maxDob;
      }
      textError = "Enter a valid date";
      return textError;
    }
  }

  const validateFields = () => {
    let isValid = true;
    let updatedError = { ...error };

    const validateField = (field, condition, errorMessage) => {
      if (condition) {
        updatedError[field] = true;
        updatedError[`helperTxt${field.charAt(0).toUpperCase() + field.slice(1)}`] = errorMessage || FIELD_REQUIRED;
        isValid = false;
      } else {
        updatedError[field] = false;
      }
    };

    validateField('email', isEmpty(user.email) || !isValidEmail(user.email), 'Please enter a valid email');
    validateField('firstName', isEmpty(user.firstName) || user.firstName.trim() === '', FIELD_REQUIRED);
    validateField('lastName', isEmpty(user.lastName) || user.lastName.trim() === '', FIELD_REQUIRED);
    validateField('phone', isEmpty(user.phone) || !isValidMobileNo(user.phone), 'Please enter a valid phone number');
    validateField('gender', isEmpty(user.gender), 'Please select a gender');
    const dobError = dobValidation();
    if(dobError){
      isValid = false
      updatedError['dob']=true
      updatedError['helperTxtDob'] = dobError
    } else{
      updatedError['dob'] = false
    }
    validateField('qualification', isEmpty(user.qualification), 'Please select a qualification');
    validateField('institution', isEmpty(user.institution) || user.institution.trim() === '', FIELD_REQUIRED);
    validateField('sslcPercentage', isEmpty(user.sslcPercentage) || user.sslcPercentage <= setting.sslcPercentage || user.sslcPercentage > 100, `SSLC% must within ${setting.sslcPercentage}% and 100%`);
    validateField('hscPercentage', isEmpty(user.hscPercentage) || user.hscPercentage <= setting.hscPercentage || user.hscPercentage > 100, `HSC% must within ${setting.hscPercentage}% and 100%`);
    validateField('ugPercentage', isEmpty(user.ugPercentage) || user.ugPercentage <= setting.ugPercentage || user.ugPercentage > 100, `UG% must within ${setting.ugPercentage}% and 100%`);
    validateField('pgPercentage', (user.pgPercentage && (user.pgPercentage <= setting.pgPercentage || user.pgPercentage > 100)), `PG% must within ${setting.pgPercentage}% and 100%`);
    validateField('resumeFile', selectedFile === null, FIELD_REQUIRED);

    if (
      (isEmpty(user.email) || !isValidEmail(user.email) || isEmpty(user.firstName) || user.firstName.trim() === '' ||
        isEmpty(user.lastName) || user.lastName.trim() === '' || isEmpty(user.phone) || !isValidMobileNo(user.phone) ||
        isEmpty(user.gender) || dobError)
    ) {
      setError(updatedError);
      return isValid;
    }

    if (
      isEmpty(user.qualification) || isEmpty(user.institution) || user.institution.trim() === '' ||
      isEmpty(user.sslcPercentage) || user.sslcPercentage <= setting.sslcPercentage || user.sslcPercentage > 100 ||
      isEmpty(user.hscPercentage) || user.hscPercentage <= setting.hscPercentage || user.hscPercentage > 100 ||
      isEmpty(user.ugPercentage) || user.ugPercentage <= setting.ugPercentage || user.ugPercentage > 100 ||
      ((user.pgPercentage && user.pgPercentage <= setting.pgPercentage) || user.pgPercentage > 100) ||
      (selectedFile === null)
    ) {
      setError(updatedError);
      return isValid;
    }

    return isValid;
  };

  const saveCandidate = (formData) => {
    axios.post(`${url.CANDIDATE_API}/candidate/public/save?examId=${examId}`,
      formData)
      .then((res) => {
        const response = res.data.response;
        localStorage.setItem("jwtToken", response.jwtToken);
        localStorage.setItem("user", JSON.stringify(response));
        localStorage.setItem('publicExam', true)
        if (mcqHasCamera || programmingHasCamera) {
          setOpenModal(true)
        }
        else {
          navigate('/candidateinstruction')
        }
      }).catch((err) =>
        errorHandler(err),
        setDisable(false)
      )
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    setDisable(true)
    if (!validateFields()) {
      setDisable(false)
      return;
    }


    const formData = new FormData();
    axios.get(`${url.CANDIDATE_API}/candidate/csrf-token`).then((res) => {
      formData.append('resume', selectedFile);
      formData.append('candidate', JSON.stringify(user));
      saveCandidate(formData); // Make sure to define saveCandidate
    });
  };

  const handleTextInput = (event, key) => {
    if (isValidName(event.target.value) || event.target.value === "") {
      handleInput(event, key)
    }
  }

  const handleMarkInput = (event, key) => {
    if ((event.target.value <= 100 && event.target.value >= 0)) {
      handleInput(event, key)
    }
  }

  const onFileChange = event => {
    if (event.target.files[0].size <= 1048576) {
      if (event.target.files[0].type === 'application/pdf') {
        setSelectedFile(event.target.files[0])
        setError(prevState => ({ ...prevState, resumeFile: false, helperTextResumeFile: "" }))
      } else {
        setSelectedFile(null)
        setError(prevState => ({ ...prevState, resumeFile: true, helperTxtResumeFile: "please upload only .pdf file" }))
      }
    } else {
      setSelectedFile(null)
      setError(prevState => ({ ...prevState, resumeFile: true, helperTxtResumeFile: "please upload resume size less then 1MB" }))
    }
  };

  const onCloseModal = () => {
    setOpenModal(false)
    setDisable(false)
    window.close();
  }


  const handleInput = (event, key) => {
    // Update the user state and error state
    setUser((prevUser) => ({
      ...prevUser,
      [key]: event.target.value
    }));
    setError((prevError) => ({
      ...prevError,
      [key]: false
    }));
  };

  const handleDateChange = (date) => {
    setUser((prevUser) => ({
      ...prevUser,
      "dob": date
    }));
  };

  const convertStringToDate = (date) => {
    if (date && typeof date === 'string') {
      return moment(date).toDate();
    }
    return date;
  }

  if (isValidExamTime && loadPage) {
    return (timeOver ? <ExamTimeOver /> :
      <div className='bg-image' style={{ height: '100vh', backgroundPosition: 'right 2% bottom 2%' }}>
        <main className="main-content bcg-clr">
          <div className='header'>
            <img className='header-logo' src={LOGO} alt="SkillSort" />
          </div>
          <div className='card-header-new' style={{ display: 'flex', justifyContent: 'center' }}>
            <span>Candidate Details</span>
          </div>
          <div className="row">
            <div className="col-md-12">
              <form className="email-compose-body" onSubmit={handleSubmit}>
                <div className="row" style={{ height: '100%', overflow: 'hidden', marginTop: '1rem' }}>
                  <div className="send-header" style={{ marginLeft: '12rem', width: '70%' }}>
                    <div className="row">

                      <div className="col-2 candidate-col">
                        <label className="form-label text-label" htmlFor="form12">First Name*</label>
                      </div>
                      <div className="col-4">
                        <input className="profile-page" type='name' label='First Name' name='username' maxLength="50" value={user.firstName} onChange={(e) => handleTextInput(e, 'firstName')} aria-label="default input example"></input>
                        {error.firstName && <FormHelperText className="helper helper-login">{error.firstName ? error.helperTxtFirstName : null}</FormHelperText>}
                      </div>
                      <div className="col-2 candidate-col">
                        <label className="form-label text-label" htmlFor="form12">Qualification*</label>
                      </div>
                      <FormControl variant="outlined" className="col-4" size="small"
                        onChange={(event) => handleInput(event, "qualification")} error={error.qualification}>
                        <select value={user.qualification} className='profile-page' style={{ marginLeft: '0.8rem', borderBottom: '1px solid black' }}>
                          <option hidden selected value="" >Select Qualification</option>
                          {_.map(setting.qualifications, (value) => {
                            return (<option value={value}>{value}</option>)
                          })}
                        </select>
                        <FormHelperText>{error.qualification ? error.helperTxtQualification : null}</FormHelperText>
                      </FormControl>
                      <div className="col-2 candidate-col">
                        <label className="form-label text-label" htmlFor="form12">Last Name*</label>
                      </div>
                      <div className="col-4">
                        <input className="profile-page" type='name' label='Last Name' name='lastName' maxLength="50" value={user.lastName} onChange={(e) => handleTextInput(e, 'lastName')} id='lastName' aria-label="default input example"></input><span className='required'></span>
                        {error.lastName && <FormHelperText className="helper helper-login">{error.lastName ? error.helperTxtLastName : null}</FormHelperText>}
                      </div>
                      <div className="col-2 candidate-col">
                        <label className="form-label text-label" htmlFor="form12">Institution*</label>
                      </div>
                      <div className="col-4">
                        <input className="profile-page" type='name' label='College Name' name='collegeName' maxLength="50" onChange={(e) => handleInput(e, 'institution')} id='collegeName' value={user.institution} aria-label="default input example" ></input>
                        {error.institution && <FormHelperText className="helper helper-login">{error.institution ? error.helperTxtInstitution : null}</FormHelperText>}
                      </div>
                      <div className="col-2 candidate-col">
                        <label className="form-label text-label" htmlFor="form12">Email*</label>
                      </div>
                      <div className="col-4">
                        <input className="profile-page" type='email' label='Email' name='email' maxLength="50" value={user.email} id='email' aria-label="default input example" readOnly></input>
                        <FormHelperText className="helper helper-login" style={{ paddingLeft: "0px", marginTop: "5px" }}>{error.email ? error.helperTxtMail : null}</FormHelperText>
                      </div>
                      <div className="col-2 candidate-col">
                        <label className="form-label text-label" htmlFor="form12">SSLC*</label>
                      </div>
                      <div className="col-4">
                        <input className="profile-page" type='name' label='SSLC %' name='sslcPercentage' maxLength="5" min={1} max={100} onChange={(e) => handleMarkInput(e, 'sslcPercentage')} value={user.sslcPercentage} id='SSLC' aria-label="default input example" ></input>
                        {error.sslcPercentage && <FormHelperText className="helper helper-login">{error.sslcPercentage ? error.helperTxtSslcPercentage : null}</FormHelperText>}
                      </div>
                      <div className="col-2 candidate-col">
                        <label className="form-label text-label" htmlFor="form12">Phone*</label>
                      </div>
                      <div className="col-4">
                        <input className="profile-page" type='number' label='Phone' name='phone' maxLength="10" value={user.phone} onChange={(e) => handleInput(e, 'phone')} id='phone' aria-label="default input example" ></input>
                        {error.phone && <FormHelperText className="helper helper-login">{error.phone ? error.helperTxtPhone : null}</FormHelperText>}
                      </div>
                      <div className="col-2 candidate-col">
                        <label className="form-label text-label" htmlFor="form12">HSC*</label>
                      </div>
                      <div className="col-4">
                        <input className="profile-page" type='name' label='HSC' name='hscPercentage' maxLength="5" min={1} max={100} onChange={(e) => handleMarkInput(e, 'hscPercentage')} value={user.hscPercentage} id='hscPercentage' aria-label="default input example"></input>
                        {error.hscPercentage && <FormHelperText className="helper helper-login">{error.hscPercentage ? error.helperTxtHscPercentage : null}</FormHelperText>}
                      </div>
                      <div className="col-2 candidate-col">
                        <label className="form-label text-label">Date of Birth*</label>
                      </div>
                      <div className="col-4">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <MuiDatePicker
                            value={user.dob === '' ? '' : convertStringToDate(user.dob)}
                            onChange={handleDateChange}
                            format="dd/MM/yyyy"
                            slotProps={{
                              textField: {
                                helperText: error.dob ? error.helperTxtDob : null,
                                variant: 'filled',
                                size: 'small',
                                sx: {
                                  '& .MuiInputBase-input': {
                                    paddingTop: 0,
                                    paddingLeft: '5px',
                                    color: 'black',
                                    fontSize: '13px',
                                  },
                                  '&. MuiFormHelperText-root':{
                                    color: 'red !important'
                                  },
                                  '& .MuiFormControl-root':{
                                    fontSize: '13px',
                                    fontWeight: 400,
                                    color: 'black',
                                  }
                                },
                                className: 'profile-page',
                                placeholder: 'dd/mm/yyyy'
                              }
                            }}
                          />
                        </LocalizationProvider>
                      </div>
                      <div className="col-2 candidate-col">
                        <label className="form-label text-label" htmlFor="form12">UG*</label>
                      </div>
                      <div className="col-4">
                        <input className="profile-page" type='name' label='UG %' name='ugPercentage' maxLength="5" min={1} max={100} onChange={(e) => handleMarkInput(e, 'ugPercentage')} value={user.ugPercentage} id='hscPercentage' aria-label="default input example"></input>
                        <FormHelperText className="helper helper-login">{error.ugPercentage ? error.helperTxtUgPercentage : null}</FormHelperText>
                      </div>
                      <div className="col-2 candidate-col">
                        <label className="form-label text-label">Gender*</label>
                      </div>
                      <div className='col-4' style={{ paddingLeft: '1rem'}}>
                        <div className="form-check form-check-inline">
                          <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="MALE" checked={user.gender === "MALE"} onClick={(event) => { handleInput(event, "gender") }} />
                          <label className="form-check-label text-label" htmlFor="inlineRadio1">Male</label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="FEMALE" checked={user.gender === "FEMALE"} onClick={(event) => { handleInput(event, "gender") }} />
                          <label className="form-check-label text-label" htmlFor="inlineRadio2">Female</label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="OTHERS" checked={user.gender === "OTHERS"} onClick={(event) => { handleInput(event, "gender") }} />
                          <label className="form-check-label text-label" htmlFor="inlineRadio3">Others</label>
                        </div>
                        {error.gender && <FormHelperText className="helper helper-login">{error.gender ? error.helperTxtGender : null}</FormHelperText>}
                      </div>

                      <div className="col-2 candidate-col">
                        <label className="form-label text-label" htmlFor="form12">PG</label>
                      </div>
                      <div className="col-4">
                        <input className="profile-page" type='name' label='PG %' name='pgPercentage' maxLength="5" min={1} max={100} onChange={(e) => handleMarkInput(e, 'pgPercentage')} value={user.pgPercentage ? user.pgPercentage : ''} id='pgPercentage' aria-label="default input example" ></input>
                        {error.pgPercentage && <FormHelperText className="helper helper-login">{error.pgPercentage ? error.helperTxtPgPercentage : null}</FormHelperText>}
                      </div>
                      <div className="col-2 candidate-col">
                        <label className="form-label text-label">Resume*<span className={selectedFile ? "" : "required"}></span></label>
                      </div>
                      <div className="col-4">
                        <input type="file" className="custom-file-input" onChange={onFileChange} accept={"application/pdf"} style={{ width: '311px', marginLeft: '5px' }} />
                        <label className="custom-file-label text-label" style={{ width: '255px', marginLeft: '14px' }}>{selectedFile ? selectedFile.name : "Upload Resume"}</label>
                        {error.resumeFile && <FormHelperText className="helper helper-login" style={{ paddingLeft: "15px" }}>{error.resumeFile ? error.helperTxtResumeFile : null}</FormHelperText>}
                      </div>
                      <div className='col-4'>
                        <button type="submit" className="btn btn-sm btn-nxt" disabled={disable} style={{ margin: 'auto auto auto 10.5rem' }}>Continue</button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            {openModal ? <TakePicture onCloseModal={onCloseModal} ></TakePicture> : null}
          </div>
        </main>
      </div>
    )
  } else if (!isValidExamTime && loadPage) {
    return (
      <div className="container-wapper d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="row">
          <div className="col text-center">
            <h3>
              <small className="text-muted">Exam Starts At {moment(startDate).format('DD-MM-YYYY HH:mm')}</small>
            </h3>
          </div>
        </div>
      </div>

    );
  }

}

export default withLocation(CandidateReg);
