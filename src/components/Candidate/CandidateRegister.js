import { FormControl, FormHelperText } from "@mui/material";
import { LocalizationProvider, DatePicker as MuiDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from "axios";
import _ from "lodash";
import React, { Component } from "react";
import { toast } from "react-toastify";
import LOGO from '../../assests/images/LOGO.svg';
import { toastMessage, withLocation } from "../../utils/CommonUtils";
import url  from "../../utils/UrlConstant";
import { isEmpty, isValidEmail, isValidMobileNo, isValidName } from "../../utils/Validation";
import ExamTimeOver from "./ExamTimeOver";
import TakePicture from "./TakePicture";
import moment from "moment";

const FIELD_REQUIRED = 'Field is Required!';

class CandidateRegister extends Component {
  constructor(props) {
    super(props);
    console.log(props)
    this.state = {
      timeOver: false,
      inputError: "",
      isAppsCompleted: false,
      selectedFile: null,
      isValidExamTime: false,
      isOngoingExamPresent: false,
      examLinkResponse: "",
      activeStep: 0,
      examDuration: 0,
      disabled: false,
      selectedDate: new Date("2021-01-01T21:11:54"),
      jwt: "",
      examId: "",
      examUsersId: "",
      now: new Date(),
      maxDate: new Date("24/02/2003"),
      minDate: new Date("24/02/1971"),
      emailId: "",
      setting: {},
      isSubmitted: false,
      openModal: false,
      mcqHasCamera: false,
      programmingHasCamera: false,
      examQuestions: {
        categories: [
          {
            questions: [
              {
                question: "",
                isPinned: "",
              },
            ],
          },
        ],
      },
      user: {
        email: "",
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
      },
      error: {
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
        helperTextResumeFile: "",
      },
    };
  }

  getCandidate = (token,email) => {
    axios.get(`${url.CANDIDATE_API}/candidate/findByCompanyId-byEmail/?email=${email}`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => {
      this.setState({ user: res.data.response })
    }).catch(err => console.log(err))
  }

  handleTextInput = (event, key) => {
    const { user, error } = this.state;
    if (isValidName(event.target.value) || event.target.value === "") {
      user[key] = event.target.value;
      error[key] = false;
      this.setState({ user, error });
    }
  }

  handleMarkInput = (event, key) => {
    const { user, error } = this.state;
    if ((event.target.value <= 100 && event.target.value >= 0)) {
      user[key] = event.target.value;
      error[key] = false;
      this.setState({ user, error });
    }
  }

  handleInput = (event, key) => {
    const { user, error } = this.state;
    user[key] = event.target.value;
    error[key] = false;
    this.setState({ user, error });
  };

  componentWillMount() {
    let examId = this.props.params.examId;
    let token = this.props.params.token;
    localStorage.clear()
    localStorage.setItem("examId", examId);
    this.setState({
      jwt: token,
      examId: examId,
      examUsersId: this.props.params.examUsersId
    });

    axios.get(`${url.CANDIDATE_API}/candidate/` + this.props.params.examId + `/check`, {
      headers: { Authorization: "Bearer " + token },
    }).then((res) => {
      this.setIsValidExamTime(res);
    }).catch((err) => {
      if (err.response.data?.message?.includes("Authentication Failed")) {
        return this.setState({ timeOver: true });
      }
      this.setState({ isValidExamTime: false });
      toast.error("Something went wrong !")
    });

    this.checkAlreadyRegistered(this.props.params.examUsersId, examId, token);
  }

  checkAlreadyRegistered = (examUserId, examId, token) => {
    axios.get(`${url.CANDIDATE_API}/candidate/check-user-written-exam/${examUserId}`, {
      headers: { Authorization: "Bearer " + token },
    }).then((response) => {

      if (response.data.response === true) {
        localStorage.setItem("examUserId", examUserId);
        localStorage.setItem("token", token);
        this.props.navigate('/candidate/re-exam-request', { state: { examUserId: examUserId, token: this.props.params.token }})
        return;
      }

      axios.get(`${url.CANDIDATE_API}/candidate/examUsers?examUsersId=` + examUserId, {
        headers: { Authorization: "Bearer " + token },
      }).then((res) => {
        const { user } = this.state;
        user["email"] = res.data.response.email;
        user["isFromSkillSort"] = res.data.response.isFromSkillSort;
        this.getCandidate(token,user.email);
        const exam = res.data.response.exam;
        if (exam.languageName && exam.languageId !== "") {
          localStorage.setItem("languageName", exam.languageName);
          localStorage.setItem("languageId", exam.languageId);
        }

        this.setState({ setting: exam.setting, user: user });
        this.checkOnGoingExam(res.data.response.email, examId);
      }).catch((err) => console.log(err));

    })
      .catch((err) => {
        if (!err.response.data?.message?.includes("Authentication Failed")) {
          toastMessage('error', 'Oops! Something went wrong.');
        }
      });
  }

  checkOnGoingExam(email, examId) {
    axios.get(`${url.CANDIDATE_API}/candidate/onGoing/exam?email=` + email + `&examId=` + examId, {
      headers: { Authorization: "Bearer " + this.props.params.token },
    }).then((res) => {
      const ongoingExam = res.data.response
      if (!ongoingExam) {
        return;
      }
      if (ongoingExam.isExamSubmitted) {
        localStorage.setItem("examUserId", this.props.params.examUsersId)
        return this.props.navigate( '/candidate/re-exam-request', {state: { examUserId: this.props.params.examUsersId, token: this.props.params.token } });
      }
      localStorage.setItem("jwtToken", ongoingExam.candidate.jwtToken);
      localStorage.setItem("onGoingExamId", res.data.response.id);
      localStorage.setItem("user", JSON.stringify(ongoingExam.candidate));
      if (ongoingExam.startDate) {
        localStorage.setItem("startDate", ongoingExam.startDate);
      }
      if (ongoingExam.preferredLanguage) {
        localStorage.setItem("languageName", ongoingExam.preferredLanguage);
        localStorage.setItem("languageId", ongoingExam.preferredLanguage);
      }
      this.isOngoingExamPresent();

      axios.get(`${url.CANDIDATE_API}/candidate/exam/` + examId, {
        headers: { Authorization: "Bearer " + this.props.params.token },
      }).then((response) => {
        let exam = response.data.response;
        if (ongoingExam.categories) {
          exam["categories"] = ongoingExam.categories;
          localStorage.setItem("AnsweredState", JSON.stringify(exam));
        }
        localStorage.setItem("examSubmitMessage", response.data.response.examSubmitMessage);

        let startTime = new Date(ongoingExam.startDate);
        localStorage.setItem("startTime", startTime);
        localStorage.setItem("startDate", startTime);
        sessionStorage.setItem("startDate", startTime);
        sessionStorage.setItem("startTime", startTime);
        let duration = ongoingExam.isAppsCompleted ? response.data.response.programmingDuration : response.data.response.projectDuration ? response.data.response.projectDuration : response.data.response.duration
        // const examDuration = duration * 60000000
        localStorage.setItem("examDuration", duration)
        let programming = _.filter(ongoingExam.categories, { 'sectionName': 'PROGRAMMING' }).length > 0 ? true : false;
        const pathname = `${url.UI_URL}/${programming && ongoingExam.isAppsCompleted ? 'program' : response.data.response.projectDuration ? 'project' : 'test'}`
        this.setState({ disabled : true})
        this.props.navigate(pathname);
      }).catch((err) => console.log(err))
    }).catch((err) => console.log(err))
  }

  isOngoingExamPresent() {
    let onGoingExamId = localStorage.getItem("onGoingExamId")
    if (onGoingExamId !== null) {
      this.setState({ isOngoingExamPresent: true })
    } else {
      this.setState({ isOngoingExamPresent: false })
    }
  }


  componentDidMount() {
    this.getExam();
    this.checkExamCameraPermission();
    this.interval = setInterval(() => {
      this.getExam();
    }, 1000);
    localStorage.setItem('pathName', window.location.pathname)
  }

  checkExamCameraPermission = async () => {
    let token = this.props.params.token;
    axios.get(`${url.CANDIDATE_API}/candidate/exam/instruction?examId=${this.state.examId}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    ).then(res => this.setState({ mcqHasCamera: res.data.response.isMcqCamera, programmingHasCamera: res.data.response.isProgrammingCamera, startate: res.data.response.startDateTime }))
      .catch(error => {
        if (error.response.data?.message?.includes("Authentication Failed")) {
          return this.setState({ timeOver: true });
        }
      })

  }

  getExam() {
    let token = this.props.params.token;
    let examLinkResponse = this.state.examLinkResponse;
    let dt = new Date();
    let hours = dt.getHours();
    let AmOrPm = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12;
    let minutes = dt.getMinutes();
    let finalTime = hours + ":" + minutes + " " + AmOrPm;
    let currentTime = finalTime.toUpperCase();

    if (this.state.isValidExamTime) {
      clearInterval(this.interval);
    } else if (examLinkResponse.slice(29) === currentTime) {
      axios
        .get(
          `${url.CANDIDATE_API}/candidate/` +
          this.props.params.examId +
          `/check`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
        .then((res) => {
          this.setIsValidExamTime(res);
        }).catch((err) => {
          this.setState({ isValidExamTime: false });
          toast.error("Something went wrong !")
        });
    }
  }

  setIsValidExamTime(res) {
    if (res.data.message === "true") {
      this.setState({ isValidExamTime: true });
    } else {
      this.setState({ isValidExamTime: false, examLinkResponse: res.data.message });
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleDateChange = (date) => {
    const { user } = this.state;
    user.dob = date;
    this.setState({ user });
  };

  dobValidation = () => {
    const { error } = this.state;
    let maxAge = this.state.setting.max;
    let minAge = this.state.setting.min;
    let yyyy = new Date().getFullYear();
    let minDob = "01/01/" + (yyyy - maxAge);
    let maxDob = "31/12/" + (yyyy - minAge);
    let enteredDate = new Date(this.state.user.dob);
    if ((enteredDate.getFullYear() >= (yyyy - maxAge)) && (enteredDate.getFullYear() <= (yyyy - minAge))) {
      return false;
    } else {
      if (enteredDate.getFullYear() < (yyyy - maxAge)) {
        error.helperTxtDob = "DOB must on or after " + minDob;
        return true;
      } else if (enteredDate.getFullYear() > (yyyy - minAge)) {
        error.helperTxtDob = "DOB must on or before " + maxDob;
        return true;
      }
      error.helperTxtDob = "Enter a valid date";
      return true;
    }
  }

  handleSubmit = (event) => {

    event.preventDefault();
    const { user, error } = this.state;

    if (isEmpty(user.email) || !isValidEmail(user.email)) {
      error.email = true;
      error.helperTxtMail = !isEmpty(user.email)
        ? "Please enter a valid email"
        : FIELD_REQUIRED;
    } else {
      error.email = false;
    }

    if (isEmpty(user.firstName) || user.firstName.trim() === "") {
      error.firstName = true;
      error.helperTxtFirstName = "";
    } else {
      error.firstName = false;
    }

    if (isEmpty(user.lastName) || user.lastName.trim() === "") {
      error.lastName = true;
      error.helperTxtLastName = FIELD_REQUIRED;
    } else {
      error.lastName = false;
    }

    if (isEmpty(user.phone) || !isValidMobileNo(user.phone)) {
      error.phone = true;
      error.helperTxtPhone = !isEmpty(user.phone)
        ? "Please enter a valid phone number "
        : FIELD_REQUIRED;
    } else {
      error.phone = false;
    }

    if (isEmpty(user.gender)) {
      error.gender = true;
      error.helperTxtGender = "Please select a gender";
    } else {
      error.gender = false;
    }

    if (this.dobValidation()) {
      error.dob = true;
    } else {
      error.dob = false;
    }

    if (isEmpty(user.qualification)) {
      error.qualification = true;
      error.helperTxtQualification = "Please select a qualification";
    } else {
      error.qualification = false;
    }

    if (isEmpty(user.institution) || user.institution.trim() === "") {
      error.institution = true;
      error.helperTxtInstitution = FIELD_REQUIRED;
    } else {
      error.institution = false;
    }

    if (isEmpty(user.sslcPercentage)) {
      error.sslcPercentage = true;
      error.helperTxtSslcPercentage = FIELD_REQUIRED;
    } else if (user.sslcPercentage <= this.state.setting.sslcPercentage || user.sslcPercentage > 100) {
      error.sslcPercentage = true;
      error.helperTxtSslcPercentage = "SSLC% must within " + this.state.setting.sslcPercentage + "% and 100%";
    } else {
      error.sslcPercentage = false;
    }

    if (isEmpty(user.hscPercentage)) {
      error.hscPercentage = true;
      error.helperTxtHscPercentage = FIELD_REQUIRED;
    } else if (user.hscPercentage <= this.state.setting.hscPercentage || user.hscPercentage > 100) {
      error.hscPercentage = true;
      error.helperTxtHscPercentage = "HSC% must within " + this.state.setting.hscPercentage + "% and 100%";
    } else {
      error.hscPercentage = false;
    }

    if (isEmpty(user.ugPercentage)) {
      error.ugPercentage = true;
      error.helperTxtUgPercentage = FIELD_REQUIRED;
    } else if (user.ugPercentage <= this.state.setting.ugPercentage || user.ugPercentage > 100) {
      error.ugPercentage = true;
      error.helperTxtUgPercentage = "UG% must within " + this.state.setting.ugPercentage + "% and 100%";
    } else {
      error.ugPercentage = false;
    }

    if ((user.pgPercentage && user.pgPercentage <= this.state.setting.pgPercentage) || user.pgPercentage > 100) {
      error.pgPercentage = true;
      error.helperTxtPgPercentage = "PG% must within " + this.state.setting.pgPercentage + "% and 100%";
    } else {
      error.pgPercentage = false;
    }

    if (this.state.selectedFile === null) {
      error.resumeFile = true;
      error.helperTextResumeFile = FIELD_REQUIRED;
    } else {
      error.resumeFile = false;
    }
    if (
      isEmpty(user.email) ||
      !isValidEmail(user.email) ||
      isEmpty(user.firstName) || user.firstName.trim() === "" ||
      isEmpty(user.lastName) || user.lastName.trim() === "" ||
      isEmpty(user.phone) ||
      !isValidMobileNo(user.phone) ||
      isEmpty(user.gender) || this.dobValidation()
    ) {
      this.setState({ error });
      return;
    }
    if (this.state.activeStep === 0) {
      this.setState({
        error,
        activeStep: this.state.activeStep + 1,
      });
    }

    if (
      isEmpty(user.qualification) ||
      isEmpty(user.institution) || user.institution.trim() === "" ||
      isEmpty(user.sslcPercentage) || user.sslcPercentage <= this.state.setting.sslcPercentage || user.sslcPercentage > 100 ||
      isEmpty(user.hscPercentage) || user.hscPercentage <= this.state.setting.hscPercentage || user.hscPercentage > 100 ||
      isEmpty(user.ugPercentage) || user.ugPercentage <= this.state.setting.ugPercentage || user.ugPercentage > 100 ||
      ((user.pgPercentage && user.pgPercentage <= this.state.setting.pgPercentage) || user.pgPercentage > 100) ||
      (this.state.selectedFile === null)
    ) {
      this.setState({ error });
      return;
    }
    // event.preventDefault();
    this.setState({ disabled : true})
    const formData = new FormData();
    // Update the formData object
    formData.append('resume', this.state.selectedFile);
    formData.append('candidate', JSON.stringify(this.state.user));
    axios
      .post(
        `${url.CANDIDATE_API}/candidate/save?examId=${this.state.examId}`,
        formData,
        { headers: { Authorization: `Bearer ${this.state.jwt}` } }
      )
      .then((res) => {
        localStorage.setItem("jwtToken", res.data.response.jwtToken);
        localStorage.setItem("user", JSON.stringify(res.data.response));
        this.setState({
          jwt: res.data.response.jwtToken,
          isSubmitted: true
        });
        if (this.state.mcqHasCamera || this.state.programmingHasCamera) {
          this.setState({ openModal: true })
        }
        else {
          this.props.navigate('/candidateinstruction')
        }
      }).catch(() => this.setState({ disabled: false }))
  };

  onFileChange = event => {
    // Update the state
    // this.setState({ selectedFile: event.target.files[0] });
    const { error } = this.state;

    if (event.target.files[0].size <= 1048576) {
      if (event.target.files[0].type === 'application/pdf') {
        this.setState({ inputError: "" })
        this.setState({ selectedFile: event.target.files[0] })
        error.resumeFile = false;
        error.helperTextResumeFile = "";
        this.setState({ error: error })
      } else {
        error.resumeFile = true;
        error.helperTextResumeFile = "please upload only .pdf file";
        this.setState({ selectedFile: null })
        this.setState({ error: error })
      }
    } else {
      error.resumeFile = true;
      error.helperTextResumeFile = "please upload resume size less then 1MB"
      this.setState({ selectedFile: null })
      this.setState({ error })
    }
  };

  onCloseModal = () => {
    this.setState({ openModal: false })
    window.close();
  }
  convertStringToDate = (date) => {
    if (date && typeof date === 'string') {
      return moment(date).toDate();
    }
    return date;
  }

  render() {
    const { user, error, timeOver } = this.state;
    if (this.state.isValidExamTime) {
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
                <form className="email-compose-body" onSubmit={this.handleSubmit}>
                  <div className="row" style={{ height: '100%', overflow: 'hidden', marginTop: '1rem' }}>
                    <div className="send-header" style={{ marginLeft: '12rem', width: '70%' }}>
                      <div className="row">

                        <div className="col-2 candidate-col">
                          <label className="form-label text-label" for="form12">First Name*</label>
                        </div>
                        <div className="col-4">
                          <input className="profile-page" type='name' label='First Name' name='username' maxLength="50" value={user.firstName} onChange={(e) => this.handleTextInput(e, 'firstName')} aria-label="default input example"></input>
                          {error.firstName && <FormHelperText className="helper helper-login">{error.firstName ? error.helperTxtFirstName : null}</FormHelperText>}
                        </div>
                        <div className="col-2 candidate-col">
                          <label className="form-label text-label" for="form12">Qualification*</label>
                        </div>
                        <FormControl variant="outlined" className="col-4" size="small"
                          onChange={(event) => this.handleInput(event, "qualification")} error={error.qualification}>
                          <select value={user.qualification} className='profile-page' style={{ marginLeft: '0.8rem', borderBottom: '1px solid black' }}>
                            <option hidden selected value="" >Select Qualification</option>
                            {_.map(this.state.setting.qualifications, (value) => {
                              return (<option value={value}>{value}</option>)
                            })}
                          </select>
                          <FormHelperText>{error.qualification ? error.helperTxtQualification : null}</FormHelperText>
                        </FormControl>
                        <div className="col-2 candidate-col">
                          <label className="form-label text-label" for="form12">Last Name*</label>
                        </div>
                        <div className="col-4">
                          <input className="profile-page" type='name' label='Last Name' name='lastName' maxLength="50" value={user.lastName} onChange={(e) => this.handleTextInput(e, 'lastName')} id='lastName' aria-label="default input example"></input><span className='required'></span>
                          {error.lastName && <FormHelperText className="helper helper-login">{error.lastName ? error.helperTxtLastName : null}</FormHelperText>}
                        </div>
                        <div className="col-2 candidate-col">
                          <label className="form-label text-label" for="form12">Institution*</label>
                        </div>
                        <div className="col-4">
                          <input className="profile-page" type='name' label='College Name' name='collegeName' maxLength="50" onChange={(e) => this.handleInput(e, 'institution')} id='collegeName' value={user.institution} aria-label="default input example" ></input>
                          {error.institution && <FormHelperText className="helper helper-login">{error.institution ? error.helperTxtInstitution : null}</FormHelperText>}
                        </div>
                        <div className="col-2 candidate-col">
                          <label className="form-label text-label" for="form12">Email*</label>
                        </div>
                        <div className="col-4">
                          <input className="profile-page" type='email' label='Email' name='email' maxLength="50" value={user.email} id='email' aria-label="default input example" readOnly></input>
                          <FormHelperText className="helper helper-login" style={{ paddingLeft: "0px", marginTop: "5px" }}>{error.email ? error.helperTxtMail : null}</FormHelperText>
                        </div>
                        <div className="col-2 candidate-col">
                          <label className="form-label text-label" for="form12">SSLC*</label>
                        </div>
                        <div className="col-4">
                          <input className="profile-page" type='name' label='SSLC %' name='sslcPercentage' maxLength="5" min={1} max={100} onChange={(e) => this.handleMarkInput(e, 'sslcPercentage')} value={user.sslcPercentage} id='SSLC' aria-label="default input example" ></input>
                          {error.sslcPercentage && <FormHelperText className="helper helper-login">{error.sslcPercentage ? error.helperTxtSslcPercentage : null}</FormHelperText>}
                        </div>
                        <div className="col-2 candidate-col">
                          <label className="form-label text-label" for="form12">Phone*</label>
                        </div>
                        <div className="col-4">
                          <input className="profile-page" type='number' label='Phone' name='phone' maxLength="10" value={user.phone} onChange={(e) => this.handleInput(e, 'phone')} id='phone' aria-label="default input example" ></input>
                          {error.phone && <FormHelperText className="helper helper-login">{error.phone ? error.helperTxtPhone : null}</FormHelperText>}
                        </div>
                        <div className="col-2 candidate-col">
                          <label className="form-label text-label" for="form12">HSC*</label>
                        </div>
                        <div className="col-4">
                          <input className="profile-page" type='name' label='HSC' name='hscPercentage' maxLength="5" min={1} max={100} onChange={(e) => this.handleMarkInput(e, 'hscPercentage')} value={user.hscPercentage} id='hscPercentage' aria-label="default input example"></input>
                          {error.hscPercentage && <FormHelperText className="helper helper-login">{error.hscPercentage ? error.helperTxtHscPercentage : null}</FormHelperText>}
                        </div>
                        <div className="col-2 candidate-col">
                          <label className="form-label text-label">Date of Birth*</label>
                        </div>
                        <div className="col-4">
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <MuiDatePicker
                              value={user.dob === '' ? '' : this.convertStringToDate(user.dob)}
                              onChange={this.handleDateChange}
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
                                    '&. MuiFormHelperText-root': {
                                      color: 'red !important'
                                    },
                                    '& .MuiFormControl-root': {
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
                          <label className="form-label text-label" for="form12">UG*</label>
                        </div>
                        <div className="col-4">
                          <input className="profile-page" type='name' label='UG %' name='ugPercentage' maxLength="5" min={1} max={100} onChange={(e) => this.handleMarkInput(e, 'ugPercentage')} value={user.ugPercentage} id='hscPercentage' aria-label="default input example"></input>
                          <FormHelperText className="helper helper-login">{error.ugPercentage ? error.helperTxtUgPercentage : null}</FormHelperText>
                        </div>
                        <div className="col-2 candidate-col">
                          <label className="form-label text-label">Gender*</label>
                        </div>
                        <div className='col-4' style={{ paddingLeft: '1rem' }}>
                          <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="MALE" checked={user.gender === "MALE"} onClick={(event) => { this.handleInput(event, "gender") }} />
                            <label className="form-check-label text-label" for="inlineRadio1">Male</label>
                          </div>
                          <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="FEMALE" checked={user.gender === "FEMALE"} onClick={(event) => { this.handleInput(event, "gender") }} />
                            <label className="form-check-label text-label" for="inlineRadio2">Female</label>
                          </div>
                          <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="OTHERS" checked={user.gender === "OTHERS"} onClick={(event) => { this.handleInput(event, "gender") }} />
                            <label className="form-check-label text-label" for="inlineRadio3">Others</label>
                          </div>
                          {error.gender && <FormHelperText className="helper helper-login">{error.gender ? error.helperTxtGender : null}</FormHelperText>}
                        </div>
                        <div className="col-2 candidate-col">
                          <label className="form-label text-label" for="form12">PG</label>
                        </div>
                        <div className="col-4">
                          <input className="profile-page" type='name' label='PG %' name='pgPercentage' maxLength="5" min={1} max={100} onChange={(e) => this.handleMarkInput(e, 'pgPercentage')} value={user.pgPercentage ? user.pgPercentage : ''} id='pgPercentage' aria-label="default input example" ></input>
                          {error.pgPercentage && <FormHelperText className="helper helper-login">{error.pgPercentage ? error.helperTxtPgPercentage : null}</FormHelperText>}
                        </div>
                        <div className="col-2 candidate-col">
                          <label className="form-label text-label">Resume*<span className={this.state.selectedFile ? "" : "required"}></span></label>
                        </div>
                        <div className="col-4">
                          <input type="file" className="custom-file-input" onChange={this.onFileChange} accept={"application/pdf"} style={{ width: '311px', marginLeft: '5px' }} />
                          {error.resumeFile && <FormHelperText className="helper helper-login" style={{ paddingLeft: "35px" }}>{error.resumeFile ? error.helperTextResumeFile : null}</FormHelperText>}
                        </div>
                        <div className='col-4'>
                          <button type="submit" className="btn btn-sm btn-nxt" disabled={this.state.disabled} style={{ margin: 'auto auto auto 10.5rem' }}>Continue</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              {this.state.openModal ? <TakePicture onCloseModal={this.onCloseModal} ></TakePicture> : null}
            </div>
          </main>
        </div>
      );
    } else {
      return (
        <div class="container-wapper">
          <div class="row justify-content-md-center">
            <h3>
              <small class="text-muted">Exam Starts At {moment(this.state.startDate).format('DD-MM-YYYY HH:mm')}</small>
            </h3>
          </div>
        </div>
      );
    }
  }
}

export default withLocation(CandidateRegister);