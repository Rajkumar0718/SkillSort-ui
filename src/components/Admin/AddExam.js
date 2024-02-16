import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { TabContext } from '@mui/lab';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Checkbox } from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';
import Tab from '@mui/material/Tab';
import axios from 'axios';
import ReactEcharts from "echarts-for-react";
import _ from "lodash";
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { authHeader, errorHandler, getCurrentUser } from '../../api/Api';
import CustomDatePick from '../../common/CustomDatePick';
import { toastMessage, withLocation } from '../../utils/CommonUtils';
import url from '../../utils/UrlConstant';
import { isEmpty, isRoleValidation } from '../../utils/Validation';
import '../Candidate/Programming.css';
import SettingModel from './SettingModel';
import styled from 'styled-components';
import CkEditor from '../../common/CkEditor';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import dayjs from 'dayjs';
import CustomizedInputBase from '../../common/CustomizedInputBase';

const StyledCKEditorWrapper = styled.div`
   .MuiInputBase-input {
    font-size:medium !important;
    width:250px ;
  }.MuiTextField-root {
    width:fit-content;
  }
  .MuiInputBase-root.MuiOutlinedInput-root{
height:2.4rem
  }
  .MuiStack-root{
    padding-top:6px
  }
`;
class AddExam extends Component {
  constructor(props) {
    super(props);
    const user = JSON.parse(localStorage.getItem("user"));
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      positionId: props?.location?.state?.position?.id || props?.position?.clonedExam?.positionId || props?.location?.state?.clonedExam?.positionId,
      companyId: user.companyId,
      isSkillSortQuestion: true,
      isMcqCamera: false,
      isProgrammingCamera: false,
      name: '',
      duration: '',
      projectDuration: '',
      programmingDuration: '',
      disabled: false,
      tabsArray: [],
      totalQuestions: 0,
      categories: [],
      selectSection: [],
      startDateTime: new Date(),
      link: '',
      authTenantId: '',
      languageName: "",
      languageId: '',
      candidateInstruction: '',
      examSubmitMessage: '',
      jobDescription: props.location?.state?.position?.jobDescription || props?.position?.jobDescription,
      errormessage: '',
      sections: [],
      programmingRound: false,
      isCopyPaste: false,
      max: 3,
      level: null,
      status: "ACTIVE",
      tabIndex: '',
      examId: props.location?.state?.examId || props.position?.examId,
      generateLinkIconDisabled: false,
      generatedLink: undefined,
      position: props.location?.state?.position || props.position,
      error: {
        easyStatus: false,
        easyMsg: '',
        mediumStatus: false,
        mediumMsg: '',
        hardStatus: false,
        hardMsg: '',
        settingStatus: false,
        settingMsg: '',
        name: false,
        examNameMsg: '',
        duration: false,
        durationMsg: '',
        candidateInstruction: false,
        candidateInstructionMsg: '',
        examSubmitMessage: false,
        examSubmitMessageMsg: '',
        jobDescription: false,
        jobDescriptionMsg: '',
        programmingDuration: false,
        programmingDurationMsg: '',
        projectDuration: false,
        projectDurationMsg: '',
        levelMsg: '',
        level: false,
        tokenValidity: false,
        tokenValidityMsg: '',
      },
      countError: false,
      settings: [],
      setting: {},
      openModal: false,
      tooltipSetting: '',
    }
  }

  componentDidMount() {
    this.initialCall();
    const position = this.state.position;
    const examId = this.state.examId
    if (examId || position?.examId) {
      this.getExam(examId || position?.examId)
    }

  }

  setTabIndex = () => {
    this.setState({ tabIndex: this.state.tabsArray[0] })
  }

  getExam = (examId) => {
    axios.get(`${url.CANDIDATE_API}/candidate/exam/instruction?examId=${examId}`, { headers: authHeader() }
    ).then(res => {
      const exams = res.data.response
      exams.positionId = this.state.positionId
      const hashCode = exams.publicUrlHashcode
      let generatedLink = hashCode ? `${url.UI_URL}/candidate/register/${hashCode}` : undefined
      this.setState({ ...exams, tabsArray: _.map(exams.categories, (category) => category.sectionName), generatedLink: generatedLink })
    })
      .catch(() => toastMessage('error', 'Error while fetching exam'))
  }

  initialCall = () => {
    this.getSections();
    this.getSetting();
  }
  getSections = () => {
    axios.get(`${url.ADMIN_API}/section?isSkillSort=${this.state.isSkillSortQuestion}`, { headers: authHeader() })
      .then(res => {
        let sec = res.data.response;
        let selectSection = [];
        for (let key in sec) {
          if (isRoleValidation() === 'TEST_ADMIN' || getCurrentUser().company?.examAccessType === "BOTH") {
            selectSection.push(sec[key]['name']);
          } else if (getCurrentUser().company?.examAccessType === "PROGRAMMING") {
            if (sec[key]['name'] === "PROGRAMMING") {
              selectSection.push(sec[key]['name']);
            }
          } else {
            let idx = _.findIndex(sec, { 'name': 'PROGRAMMING' })
            if (idx > -1) {
              sec.splice(idx, 1);
            }
            selectSection.push(sec[key]['name']);
          }
        }
        this.setState({ selectSection: selectSection });
      }).catch(error => {
        errorHandler(error);
      })
  }



  getSetting() {
    axios.get(`${url.ADMIN_API}/setting/list?&page=${1}&size=${50}`, {
      headers: authHeader(),
    })
      .then((res) => {
        this.setState({ settings: res.data.response.content })
      }).catch((error) => {
        errorHandler(error);
      });
  }

  handleTabs = (event) => {
    const tabsArray = this.state.tabsArray;
    const error = this.state.error;
    if (tabsArray.includes(event.target.value)) {
      if (event.target.value === 'PROGRAMMING') {
        error.programmingDuration = false;
        error.programmingDurationMsg = ''
      } else if (event.target.value === 'PROJECT') {
        error.projectDuration = false;
        error.projectDurationMsg = ''
      } else {
        error.duration = false;
        error.durationMsg = ''
      }
      const index = tabsArray.indexOf(event.target.value);
      if (index > -1) {
        tabsArray.splice(index, 1);
        this.state.categories.splice(index, 1);
        this.state.sections.splice(index, 1);
        let programmingDuration = event.target.value === 'PROGRAMMING' ? "" : this.state.programmingDuration;
        let duration = tabsArray.length === 0 || (tabsArray.length === 1 && tabsArray.includes("PROGRAMMING")) ? "" : this.state.duration;
        this.setState({ programmingDuration: programmingDuration, duration: duration });
      }
    }

    else {
      const categories = {
        sectionName: event.target.value,
        simple: '',
        medium: '',
        complex: '',
        totalInSection: '',
        easyMsg: '',
        medimMsg: '',
        hardMsg: '',
        easyStatus: false,
        mediumStatus: false,
        hardStatus: false
      };
      tabsArray.push(event.target.value);
      this.state.categories.push(categories);
      const encodedValue = encodeURIComponent(event.target.value);
      axios.get(` ${url.ADMIN_API}/question/${encodedValue}/questionCount?questionRoles=CANDIDATE&skillSortQuestionBank=${this.state.isSkillSortQuestion}`, { headers: authHeader() })
        .then(res => {
          this.setState({
            section: this.state.sections.push({
              name: res.data.response.sectionName,
              simple: res.data.response.simple,
              medium: res.data.response.medium,
              complex: res.data.response.complex,
            }),
            tabIndex: tabsArray[0]
          })
        }).catch(error => {
          errorHandler(error);
        })
    }
    this.setState({ tabsArray })

    this.addTotalQuestions();

  }

  convertToNumber = (num) => {
    let number = parseInt(num);
    number = isNaN(number) ? 0 : number;
    return number;
  }

  async onSumSection(event, key, index) {

    const { sections } = this.state;
    const { categories } = this.state;
    categories[index][key] = Number(event.target.value);
    categories[index]['totalInSection'] = this.convertToNumber(this.state.categories[index]['simple']) + this.convertToNumber(this.state.categories[index]['medium']) + this.convertToNumber(this.state.categories[index]['complex']);

    if (key === "simple") {
      if (event.target.value > sections[index][key]) {
        categories[index]['easyStatus'] = true;
        categories[index]['easyMsg'] = "enter value less than or equal to " + sections[index][key];
      }
      else {
        categories[index]["easyStatus"] = false;
        categories[index]["easyMsg"] = "";

      }
      let e = document.getElementById("simple");
      e.setAttribute("max", sections[index][key])
    }

    if (key === "medium") {
      if (event.target.value > sections[index][key]) {
        categories[index]["mediumStatus"] = true;
        categories[index]["mediumMsg"] = "enter value less than or equal to " + sections[index][key];
      }
      else {
        categories[index]["mediumStatus"] = false;
        categories[index]["mediumMsg"] = '';
      }
      let e = document.getElementById("medium");
      e.setAttribute("max", sections[index][key])
    }

    if (key === "complex") {
      if (event.target.value > sections[index][key]) {
        categories[index]["hardStatus"] = true;
        categories[index]["hardMsg"] = "enter value less than or equal to " + sections[index][key];
      }
      else {
        categories[index]["hardStatus"] = false;
        categories[index]["hardMsg"] = '';
      }
      let e = document.getElementById("complex");
      e.setAttribute("max", sections[index][key])
    }

    await this.setState({ categories });
    this.addTotalQuestions();
  }

  addTotalQuestions() {
    let totalQuestions = 0;
    for (let key in this.state.categories) {
      totalQuestions += Number(this.state.categories[key]['totalInSection']);
    }
    this.setState({ totalQuestions: totalQuestions });
    this.setState({ errormessage: '' });

    for (let key in this.state.categories) {
      this.setState({ countError: false })
      this.state.categories[key]['easyStatus'] ? this.setState({ countError: true }) : this.state.categories[key]['mediumStatus'] ? this.setState({ countError: true }) : this.state.categories[key]['hardStatus'] ? this.setState({ countError: true }) : this.setState({ countError: false });
      if (this.state.countError === true) {
        return;
      }
    }
  }


  handleSubmit = (event) => {
    const { error } = this.state;
    if (this.state.setting.id === null) {
      error.settingStatus = true;
      error.settingMsg = "Please select setting";
    } else {
      error.settingStatus = false;
    }

    if (isEmpty(this.state.name?.trim())) {
      error.name = true;
      error.examNameMsg = isEmpty(this.state.name) ? "Field Required !" : "Enter Valid Input";
    } else {
      error.name = false;
    }

    this.setDurationError(error)


    if (isEmpty(this.state.candidateInstruction)) {
      error.candidateInstruction = true;
      error.candidateInstructionMsg = "Field Required !";
    } else {
      error.candidateInstruction = false;
    }
    if (isEmpty(this.state.examSubmitMessage)) {
      error.examSubmitMessage = true;
      error.examSubmitMessageMsg = "Field Required !";
    } else {
      error.examSubmitMessage = false;
    }
    if (isEmpty(this.state.jobDescription)) {
      error.jobDescription = true;
      error.jobDescriptionMsg = "Field Required !";
    } else {
      error.jobDescription = false;
    }
    if (isRoleValidation() === 'TEST_ADMIN' && isEmpty(this.state.level)) {
      error.level = true;
      error.levelMsg = "Field Required !";
    } else {
      error.level = false;
    }

    this.setState({ error })
    event.preventDefault();
    if (this.state.totalQuestions !== 0 && this.state.setting.id !== null && !error.duration && !error.name && !error.programmingDuration && !error.projectDuration
      && !error.candidateInstruction && !error.examSubmitMessage && !error.jobDescription && !error.level && !error.tokenValidity) {
      this.setState({
        ...this.state, link: `${url.UI_URL}/register/${localStorage.getItem('token')}/`,
        programmingRound: _.isEmpty(_.filter(this.state.categories, { 'sectionName': 'PROGRAMMING' })) ? true : false
      }, () => { this.saveExam() });
    }
    else if (this.state.totalQuestions === 0) {
      this.setState({ errormessage: 'Must set a question' });
    }

  }

  setMCQDurationError = (error) => {
    error.duration = true;
    error.durationMsg = "Field Required !";
  }

  setDurationError = (error) => {
    if (this.state.tabsArray.length >= 1 && this.state.tabsArray.includes("PROGRAMMING")) {
      if (this.state.programmingDuration <= 0 || isEmpty(this.state.programmingDuration)) {
        error.programmingDuration = true;
        error.programmingDurationMsg = "Field Required !";
      }
      if (this.state.tabsArray.length > 1) {
        if (this.checkIsDurationIsEmpty() && !this.state.tabsArray.includes('PROJECT')) {
          this.setMCQDurationError(error);
        }
        if (this.state.tabsArray.includes('PROJECT') && this.checkIsProjectDurationIsEmpty()) {
          error.projectDuration = true;
          error.projectDurationMsg = "Field Required !";
        }
        if ((this.checkIsDurationIsEmpty() && this.state.tabsArray.includes('PROJECT')) && this.state.tabsArray.length > 2) {
          this.setMCQDurationError(error);
        }
      }
    }
    else if ((this.state.tabsArray.length === 0 || this.checkIsDurationIsEmpty()) && !this.state.tabsArray.includes('PROJECT')) {
      this.setMCQDurationError(error)
    }
    else if (this.state.tabsArray.length >= 1 && this.state.tabsArray.includes("PROJECT")) {
      if (this.checkIsProjectDurationIsEmpty()) {
        error.projectDuration = true;
        error.projectDurationMsg = "Field Required !";
      }
      if (this.state.tabsArray.length > 1 && this.checkIsDurationIsEmpty()) {
        this.setMCQDurationError(error);
      }
    }
    else {
      error.programmingDuration = false;
      error.duration = false;
      error.projectDuration = false;
    }

  }

  checkIsDurationIsEmpty = () => {
    return (isEmpty(this.state.duration) || this.state.duration <= 0)
  }

  checkIsProjectDurationIsEmpty = () => {
    return (isEmpty(this.state.projectDuration) || this.state.projectDuration <= 0)
  }

  saveExam = () => {
    this.setState({ loading: true, disabled: true });
    axios.post(` ${url.ADMIN_API}/exam/save`, this.state, { headers: authHeader() })
      .then((res) => {
        if (this.state.position || this.state.examId || this.props?.position?.clonedExam || this.props?.location?.state?.clonedExam) {
          // toastMessage('success', 'Test Details Updated Successfully..!');
          if (isRoleValidation() === "TEST_ADMIN") {
            this.props.navigate('/testadmin');
            toastMessage('success', 'Test Details Updated Successfully..!');
          } else {
            this.props.navigate('/admin/vacancy');
            toastMessage('success', 'Vacancy Details Updated Successfully..!');
          }
          this.setState({ loading: false, disabled: false });
        } else {
          toastMessage('success', 'Test Added Successfully..!');
          this.props.navigate('/admin/vacancy')
          this.setState({ loading: false, disabled: false });
        }
      }).catch(error => {
        this.setState({ loading: false, disabled: false });
        errorHandler(error);
      })
  }

  handleChange = (event, key) => {

    if (key === "name" || key === "duration") {
      const { error } = this.state;
      error[key] = false

    }
    if ((!this.state.position?.examId || !this.state.examId) || key === 'tokenValidity') {
      this.setState({ [key]: event.target.value })
    }
    this.resetError();
  }

  resetError = () => {
    const { error } = this.state;
    error.easyStatus = false;
    error.mediumStatus = false;
    error.hardStatus = false;
    error.settingStatus = false;
    error.name = false;
    error.duration = false;
    error.candidateInstruction = false;
    error.examSubmitMessage = false;
    error.jobDescription = false;
    error.programmingDuration = false;
    error.projectDuration = false;
    error.level = false;
    this.setState({ error })
  }


  handleSettingChange = (index) => {
    this.setState({ setting: this.state.settings[index.target.value] })
    this.settingRender();
  }

  onClickOpenModel = () => {
    if (!this.state.openModal) {
      document.addEventListener('click', this.handleOutsideClick, false);
    } else {
      document.removeEventListener('click', this.handleOutsideClick, false);
    }
    this.setState({ openModal: !this.state.openModal });
  }

  handleOutsideClick = (e) => {
    if (e.target.className === 'modal fade show') {
      this.setState({ openModal: !this.state.openModal });
      this.initialCall();
    }
  }

  onCloseModal = () => {
    this.setState({ openModal: !this.state.openModal });
    this.initialCall();
  }

  tabhandleChange = (event, newValue) => {
    this.setState({ tabIndex: newValue })
  };

  createTabsUI = (action, clonedExam) => {
    console.log(this.state.tabIndex)
    return (
      this.state.tabsArray?.length > 0 ?
        // <div className='row'>
        <div className='col-12'>
          <div className="mT-30">
            <TabContext value={this.state.tabIndex}>
              <TabList onChange={this.tabhandleChange}>
                {_.map(this.state.tabsArray, (list) =>
                  <Tab label={list} value={list} > </Tab>
                )}
              </TabList>
              {
                _.map(this.state.categories, (category, key) =>
                  <TabPanel value={category.sectionName}>
                    <div className='row'>
                      <div className='col'>
                        <div style={{ marginLeft: '-15px' }}>
                          <div className='col mb-2' >
                            <label for="question">Simple</label> &nbsp;
                            <strong style={{ color: 'tomato' }}>{category.easyMsg}</strong>
                            {!action ? <input className='form-control-row' id="simple" min='0' value={category.simple} onChange={(e) => this.onSumSection(e, 'simple', key)} type='number' placeholder='Simple' defaultValue={0} /> : <input className='form-control-row' id="simple" min='0' value={category.simple} type='number' />}
                          </div>
                          <div className='col mb-2' >
                            <label for="question">Medium</label> &nbsp;
                            <strong style={{ color: 'tomato' }}>{category.mediumMsg}</strong>
                            {!action ? <input errormessage="NONE" className='form-control-row' id="medium" min="0" value={category.medium} onChange={(e) => this.onSumSection(e, 'medium', key)} type='number' placeholder='Medium' defaultValue={0} /> : <input errormessage="NONE" className='form-control-row' id="medium" min="0" value={category.medium} type="number" />}

                          </div>
                          <div className='col mb-2' >
                            <label for="question">Complex</label> &nbsp;
                            <strong style={{ color: 'tomato' }}>{category.hardMsg}</strong>
                            {!action ? <input className='form-control-row' id="complex" min='0' value={category.complex} onChange={(e) => this.onSumSection(e, 'complex', key)} type='number' placeholder='Complex' defaultValue={0} /> : <input className='form-control-row' id="complex" min='0' value={category.complex} type="number" />}
                          </div>
                          <div className='col mb-2' >
                            <label for="question">Total of This Section</label>
                            <input className='form-control-row' min='1' value={category.totalInSection} type='number' placeholder='Total' />
                          </div>
                        </div>
                      </div>
                      <div className='col-6'>
                        {this.state.sections.length > 0 ? <ReactEcharts option={this.getOption(category.sectionName)} style={{ height: 300 }} /> : ''}
                      </div>
                    </div>
                  </TabPanel>)
              }
            </TabContext>
          </div>
        </div> : ''
      // </div>
    );
  }

  settingRender() {
    return (
      this.state.setting.id ? (
        <div style={{ position: 'relative', left: '5rem' }}>
          <p className="setting-header">Selected Setting</p>
          <div className="card-setting">
            <p style={{ fontSize: '12px' }}><span style={{ fontWeight: 'bold' }}>Setting Name  :</span> {this.state.setting.name}</p>
            <p style={{ fontSize: '12px' }}><span style={{ fontWeight: 'bold' }}>Age Limit     :</span>   {this.state.setting.min + " - " + this.state.setting.max}</p>
            <p style={{ fontSize: '12px' }}><span style={{ fontWeight: 'bold' }}>Qulifications :</span> {_.map(this.state.setting.qualifications, (value, index) => {
              return <span>{value}{this.state.setting.qualifications?.length === index + 1 ? null : ("/")}</span>
            })}</p>
            <p style={{ fontSize: '12px' }}><span style={{ fontWeight: 'bold' }}>SSLC Score    :</span> {this.state.setting.sslcPercentage}</p>
            <p style={{ fontSize: '12px' }}><span style={{ fontWeight: 'bold' }}>HSC Score     :</span> {this.state.setting.hscPercentage}</p>
            <p style={{ fontSize: '12px' }}><span style={{ fontWeight: 'bold' }}>UG Score      :</span> {this.state.setting.ugPercentage}</p>
          </div>
        </div>
      ) : ""
    )

  }

  getOption = (data) => {
    let section = _.find(this.state.sections, value => value.name === data);
    return {
      title: {
        text: "Question section",
        x: "center"
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: "vertical",
        left: "left",
        data: ["Simple", "Medium", "Complex"]
      },
      series: [
        {
          name: "Question List",
          type: "pie",
          radius: "55%",
          center: ["50%", "60%"],
          data: [
            {
              value: undefined === section ? '' : section.simple,
              name: "Simple"
            },
            {
              value: undefined === section ? '' : section.medium,
              name: "Medium"
            },
            {
              value: undefined === section ? '' : section.complex,
              name: "Complex"
            }
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 20,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        }
      ]
    }
  }


  componentWillMount() {
    if (this.props.location?.state?.clonedExam || this.props.location?.state?.exams) {
      const exams = this.props.location?.state?.clonedExam || this.props.location?.state?.exams
      this.setState({
        id: exams.id,
        name: this.props.location?.state?.clonedExam ? '' : exams.name,
        duration: exams.duration,
        tabIndex: exams.categories[0].sectionName,
        tabsArray: _.map(exams.categories, (category) => category.sectionName),
        totalQuestions: exams.totalQuestions,
        startDateTime: exams.startDateTime,
        candidateInstruction: exams.candidateInstruction,
        jobDescription: exams.jobDescription,
        examSubmitMessage: exams.examSubmitMessage,
        languageName: exams.languageName,
        languageId: exams.languageId,
        status: exams.status,
        categories: exams.categories,
        link: exams.link,
        authTenantId: exams.authTenantId,
        setting: exams.setting,
        level: exams.level,
        programmingDuration: exams.programmingDuration,
        isSkillSortQuestion: exams.isSkillSortQuestion,
        isMcqCamera: exams.isMcqCamera,
        isProgrammingCamera: exams.isProgrammingCamera,
        projectDuration: exams.projectDuration,
        tokenValidity: exams.tokenValidity,
        isCopyPaste: exams.isCopyPaste
      })

      _.map(exams.categories, (category) => {
        axios.get(` ${url.ADMIN_API}/question/${category.sectionName}/questionCount?questionRoles=CANDIDATE&skillSortQuestionBank=${this.state.isSkillSortQuestion}`, { headers: authHeader() })
          .then(res => {
            this.setState({
              section: this.state.sections.push({
                name: res.data.response.sectionName,
                simple: res.data.response.simple,
                medium: res.data.response.medium,
                complex: res.data.response.complex
              })
            })
          })
      })
    }
  }

  language = (event) => {

    event.preventDefault();
    if (event.target.value === 'java') {
      this.setState({ languageName: 'java' })
      this.setState({ languageId: 'java' })
    } else if (event.target.value === 'python') {
      this.setState({ languageName: 'python' })
      this.setState({ languageId: 'python' })
    } else if (event.target.value === 'csharp') {
      this.setState({ languageName: 'csharp' })
      this.setState({ languageId: 'csharp' })
    } else {
      this.setState({ languageName: '' })
      this.setState({ languageId: '' })
    }

  }
  setSkillSortQuestionBank = (value) => {
    this.setState({ isSkillSortQuestion: value, tabsArray: [], categories: [] }, () => this.getSections());
  }
  setMcqRoundCamera = (value) => {
    this.setState({ isMcqCamera: value });
  }
  setProgrammingRoundCamera = (value) => {
    this.setState({ isProgrammingCamera: value });
  }

  setCopyPaste = (value) => {
    this.setState({ isCopyPaste: value });
  }

  handleDateChange = (date) => {
    this.setState({ startDateTime: date });
  }
  handleEditorChange = (newData) => {
    this.setState({ candidateInstruction: newData })
  };
  handleEXamEditorChange = (newData) => {
    this.setState({ examSubmitMessage: newData })
  };
  handleJobDescriptionEditorChange = (newData) => {
    this.setState({ jobDescription: newData })
  };
  generatePublicUrl = () => {
    axios.get(`${url.ADMIN_API}/company/generate-url`, { headers: authHeader() })
      .then(res => {
        let hashCode = res.data.response
        let appUrl = `${url.UI_URL}/candidate/register/${hashCode}`
        this.setState({ generatedLink: appUrl, publicUrlHashcode: hashCode, generateLinkIconDisabled: true })
      }).catch(err => errorHandler(err))
  }

  render() {
    let action = null;
    const examId = this.state.position?.examId || this.props.location?.state?.exams
    const clonedExam = this.props?.location?.state?.clonedExam
    if (examId || this.props?.location?.state?.examId) {
      action = examId || this.props?.location?.state?.examId;
    }
    return (
      <>

        {this.state.openModal ? <SettingModel onCloseModal={this.onCloseModal} /> : ''}
        <main className="main-content bcg-clr">
          <div>
            <div className="container-fluid cf-1">
              <div className="card-header-new">
                <div className="row">
                  <div>
                    <span className='card-title'>
                      {action !== null ? 'Update' : 'Add'} Test
                    </span>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="table-border-cr">
                    <div className="container">
                      <div className="row">
                        <form onSubmit={this.handleSubmit}>
                          <div className="row">
                            <div className="col">
                              <label className="form-label-row">Name <span style={{ color: 'red' }}>*</span></label>
                              {!action ? <input className='add-exam-input col-7' value={this.state.name} style={{ marginTop: '15px' }} type='text' maxLength="40" onChange={(e) => this.handleChange(e, 'name')} placeholder='Test' /> : <input className='add-exam-input col-7' value={this.state.name} type='text' maxLength="40" ></input>}
                              <FormHelperText className="helper" style={{ paddingLeft: "35px" }}>{this.state.error.name ? this.state.error.examNameMsg : null}</FormHelperText>
                            </div>
                            <div className="col">
                              <label className="form-label-row col-6" style={{ marginLeft: '0rem', marginBottom: '0.5rem' }}>Date <span style={{ color: 'red' }}>*</span></label>
                              {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
																	<KeyboardDateTimePicker
																		className='form-control-row col-6'
																		value={this.state.startDateTime}
																		onChange={this.handleDateChange}
																		minDate={this.state.position?.startDate}
																		maxDate={this.state.position?.endDate}
																		required='true'
																		style={{ marginLeft: '30px', color: 'black !important' }}
																	/>
																</MuiPickersUtilsProvider> */}
                              <StyledCKEditorWrapper>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                  <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
                                    <DateTimePicker
                                      onChange={this.handleDateChange}
                                      value={dayjs(this.state.startDateTime)}
                                      objectKey='startDate'
                                      minDate={this.state.position?.startDate}
                                      maxDate={this.state.position?.endDate}
                                      required='true'
                                      inputFormat="MMMM Do hh:mm a"
                                      viewRenderers={{
                                        hours: renderTimeViewClock,
                                        minutes: renderTimeViewClock,
                                        seconds: renderTimeViewClock,
                                      }}
                                    />

                                  </DemoContainer>
                                </LocalizationProvider>
                                {/* <CustomDatePick
                                  onChange={this.handleDateChange}
                                  value={new Date(this.state.startDateTime)}
                                  objectKey='startDate'
                                  minDate={this.state.position?.startDate}
                                  maxDate={this.state.position?.endDate}
                                  required='true'
                                  format={'MMMM dd yyyy, h:mm aa'}
                                /> */}
                              </StyledCKEditorWrapper>
                            </div>
                            <div className="form-group col-12" style={{ marginBottom: '0px' }}>
                              <label className="form-label-row" style={{ marginTop: '25px' }}>Select Questions From</label>
                            </div>
                            <div className="col-md-6" style={{ paddingLeft: "3rem" }}>
                              <div className="form-group">
                                {!action ? <span>Skill Sort Question Bank<Checkbox style={{ color: this.state.isSkillSortQuestion ? '#f15a2d' : '' }} onChange={() => this.setSkillSortQuestionBank(true)} checked={this.state.isSkillSortQuestion} /></span> : <span>Skill Sort Question Bank <Checkbox style={{ color: this.state.isSkillSortQuestion ? '#f15a2d' : '' }} checked={this.state.isSkillSortQuestion} /></span>}
                              </div>
                            </div>
                            <div className='col-md-6'>
                              <div className='form-group'>
                                {!action ? <span>Company Question Bank<Checkbox style={{ color: !this.state.isSkillSortQuestion ? '#f15a2d' : '' }} onChange={() => this.setSkillSortQuestionBank(false)} checked={!this.state.isSkillSortQuestion} /></span> : <span>Company Question Bank<Checkbox style={{ color: !this.state.isSkillSortQuestion ? '#f15a2d' : '' }} checked={!this.state.isSkillSortQuestion} /></span>}
                              </div>
                            </div>

                            {this.state.tabsArray.includes("PROGRAMMING") && this.state.tabsArray.length === 1 ? <div className="col-md-4"></div> : ""}
                            {/* <div className="mT-30"> */}
                            {!action ? <div className='form-group col-12' style={{ marginLeft: '2rem', lineHeight: '2rem', marginTop: '20px' }}>
                              {_.map(this.state.selectSection, (section) => {
                                return <div>
                                  <label className="checkbox">
                                    <input type="checkbox" value={section} onChange={(e) => this.handleTabs(e, { section })} disabled={(this.state.tabsArray.length === 1 && section !== 'PROJECT' && this.state.tabsArray.includes("PROJECT")) || (this.state.tabsArray.length > 0 && section === 'PROJECT' && !this.state.tabsArray.includes('PROJECT'))} checked={this.state.tabsArray.includes(section)} required={this.state.tabsArray.length > 0} />
                                    <span className="ml-1">{section}</span>
                                  </label>
                                </div>
                              })}
                            </div> : <div className='form-group col-12' style={{ left: '0rem' }}>
                              <label className="form-label-row">Selected Section</label>
                              {_.map(this.state.tabsArray, (section) => {
                                return <div style={{ marginLeft: '60px' }}>
                                  <span className="ml-1"><li>{section}</li></span>
                                </div>
                              })}
                            </div>}
                            {(this.state.selectSection.length === 1 && this.state.selectSection.includes("PROGRAMMING")) || (this.state.tabsArray.includes("PROGRAMMING") && this.state.tabsArray.length === 1) || (this.state.selectSection.length === 1 && this.state.selectSection.includes("PROJECT")) || (this.state.tabsArray.includes("PROJECT") && this.state.tabsArray.length === 1) ||
                              (this.state.selectSection.length === 2 && this.state.selectSection.includes("PROGRAMMING", "PROJECT")) || (this.state.tabsArray.length === 2 && (this.state.tabsArray.includes("PROGRAMMING") && this.state.tabsArray.includes("PROJECT"))) || (this.state.tabsArray.length === 1 && (this.state.tabsArray.includes("PROGRAMMING") || this.state.tabsArray.includes("PROJECT"))) ? "" :
                              <div className="col-md-6">
                                <div className="form-group">
                                  <label className="form-label-row">MCQ Duration <span style={{ color: 'red' }}>*</span></label>
                                  {!action ? <input className='form-control-row col-7' value={this.state.duration} type='number' max="480" onChange={(e) => this.handleChange(e, 'duration')} placeholder='Duration (In minutes)' /> : <input className='form-control-row col-7' value={this.state.duration} type='number' max="480" ></input>}
                                  <FormHelperText className="helper" style={{ paddingLeft: "35px" }}>{this.state.error.duration ? this.state.error.durationMsg : null}</FormHelperText>
                                </div>
                              </div>}
                            {this.state.tabsArray.includes("PROGRAMMING") || (this.state.selectSection.length === 1 && this.state.selectSection.includes("PROGRAMMING")) ?
                              <div className="col-md-6">
                                <div className="form-group">
                                  <label className="form-label-row">Programming Duration<span style={{ color: 'red' }}>*</span></label>
                                  {!action ? <input className='form-control-row col-7' value={this.state.programmingDuration} type='number' max="480" onChange={(e) => this.handleChange(e, 'programmingDuration')} placeholder='Duration (In minutes)' /> : <input className='form-control-row col-7' value={this.state.programmingDuration} type='number' max="480"></input>}
                                  <FormHelperText className="helper" style={{ paddingLeft: "35px" }}>{this.state.error.programmingDuration ? this.state.error.programmingDurationMsg : null}</FormHelperText>
                                </div>
                              </div>
                              : ''}
                            {this.state.tabsArray.includes("PROJECT") || (this.state.selectSection.length === 1 && this.state.selectSection.includes("PROJECT")) ?
                              <div className="col-md-6">
                                <div className="form-group">
                                  <label className="form-label-row">Project Duration<span style={{ color: 'red' }}>*</span></label>
                                  {!action ? <input className='form-control-row col-7' value={this.state.projectDuration} type='number' max="480" onChange={(e) => this.handleChange(e, 'projectDuration')} placeholder='Duration (In minutes)' /> : <input className='form-control-row col-7' value={this.state.projectDuration} type='number' max="480"></input>}
                                  <FormHelperText className="helper" style={{ paddingLeft: "35px" }}>{this.state.error.projectDuration ? this.state.error.projectDurationMsg : null}</FormHelperText>
                                </div>
                              </div>
                              : ''}
                            {/* </div> */}
                            <div className='col-md-12' style={{ paddingLeft: "2.5rem", marginBottom: '10px' }}>
                              {(this.state.tabsArray.length !== 0 && (!this.state.tabsArray.includes("PROJECT") || this.state.tabsArray.length > 1)) ? <span>Select Camera Access</span> : <span></span>}
                            </div>
                            <div className="col-md-12" style={{ paddingLeft: "3rem" }}>
                              {!(this.state.tabsArray.length === 1 && (this.state.tabsArray.includes("PROGRAMMING") || this.state.tabsArray.includes("PROJECT"))) && !(this.state.tabsArray.length === 2 && (this.state.tabsArray.includes("PROGRAMMING") && this.state.tabsArray.includes("PROJECT"))) && this.state.tabsArray.length !== 0 ?
                                <div className='row'>
                                  <div className='col-lg-6 col-sm-6 xol-md-6'>
                                    <span>MCQ Round Camera Access</span>
                                  </div>
                                  <div className='col-lg-3 col-sm-3 xol-md-3'>
                                    <div className="form-group">
                                      <span>Yes<Checkbox style={{ color: this.state.isMcqCamera ? '#f15a2d' : '' }} onChange={() => this.setMcqRoundCamera(true)} checked={this.state.isMcqCamera} /></span>
                                    </div>
                                  </div>
                                  <div className='col-lg-3 col-sm-3 xol-md-3'>
                                    <div className="form-group">
                                      <span>No<Checkbox style={{ color: !this.state.isMcqCamera ? '#f15a2d' : '' }} onChange={() => this.setMcqRoundCamera(false)} checked={!this.state.isMcqCamera} /></span>
                                    </div>
                                  </div>
                                </div> : ''}
                            </div>
                            <div className="col-md-12" style={{ paddingLeft: "3rem" }}>
                              {this.state.tabsArray.includes("PROGRAMMING") || (this.state.selectSection.length === 1 && this.state.selectSection.includes("PROGRAMMING")) ?
                                <div className='row'>
                                  <div className='col-lg-6 col-sm-6 xol-md-6'>
                                    <span>Programing Round Camera Access</span>
                                  </div>
                                  <div className='col-lg-3 col-sm-3 xol-md-3'>
                                    <div className="form-group">
                                      <span>Yes<Checkbox style={{ color: this.state.isProgrammingCamera ? '#f15a2d' : '' }} onChange={() => this.setProgrammingRoundCamera(true)} checked={this.state.isProgrammingCamera} /></span>
                                    </div>
                                  </div>
                                  <div className='col-lg-3 col-sm-3 xol-md-3'>
                                    <div className="form-group">
                                      <span>No<Checkbox style={{ color: !this.state.isProgrammingCamera ? '#f15a2d' : '' }} onChange={() => this.setProgrammingRoundCamera(false)} checked={!this.state.isProgrammingCamera} /></span>
                                    </div>
                                  </div>
                                </div> : ''}
                            </div>
                            <div className='col-md-12' style={{ paddingLeft: "3rem", marginTop: '10px' }}>
                              <div className='row' >
                                <div className='col-lg-6 col-sm-6 xol-md-6'>
                                  <span>Copy Paste Access</span>
                                </div>
                                <div className='col-lg-3 col-sm-3 xol-md-3'>
                                  <div className="form-group">
                                    <span>Yes<Checkbox style={{ color: this.state.isCopyPaste ? '#f15a2d' : '' }} onChange={() => this.setCopyPaste(true)} checked={this.state.isCopyPaste} /></span>
                                  </div>
                                </div>
                                <div className='col-lg-3 col-sm-3 xol-md-3'>
                                  <div className="form-group">
                                    <span>No<Checkbox style={{ color: !this.state.isCopyPaste ? '#f15a2d' : '' }} onChange={() => this.setCopyPaste(false)} checked={!this.state.isCopyPaste} /></span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='form-group col-12'>
                              <div className="mT-30">
                                <label for="question">Candidate Instruction<span style={{ color: 'red' }}>*</span></label>
                                <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{this.state.error.candidateInstruction ? this.state.error.candidateInstructionMsg : null}</FormHelperText>
                                <CkEditor data={this.state.candidateInstruction} onChange={this.handleEditorChange} />
                              </div>
                            </div>
                            <div className='form-group col-12'>
                              <div className="mT-30">
                                <label for="question">Test Submit Message<span style={{ color: 'red' }}>*</span></label>
                                <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{this.state.error.examSubmitMessage ? this.state.error.examSubmitMessageMsg : null}</FormHelperText>
                                <CkEditor data={this.state.examSubmitMessage} onChange={this.handleEXamEditorChange} />
                              </div>
                            </div>
                            <div className='form-group col-12'>
                              <div className="mT-30">
                                <label for="question">Job Description<span style={{ color: 'red' }}>*</span></label>
                                <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{this.state.error.jobDescription ? this.state.error.jobDescriptionMsg : null}</FormHelperText>
                                <CkEditor data={this.state.jobDescription} onChange={this.handleJobDescriptionEditorChange} />

                              </div>
                            </div>
                            <div className="form-group col-12">
                              {this.createTabsUI(action, clonedExam)}
                              <FormHelperText className="helper ">{this.state.errormessage}</FormHelperText>
                            </div>
                            <div className="form-group col-md-8">
                              <div style={{ marginRight: '2rem' }}>
                                <label className="form-label-select">Total Questions<span style={{ color: 'red' }}>*</span></label>
                                <input className='form-control-select' value={this.state.totalQuestions} placeholder='Total Questions' readOnly='true' />
                              </div>

                              <div className="form-group col-6 mT-6" style={{ marginTop: '21px' }}>
                                <label className="form-label-select">Minimum Qualification<span style={{ color: 'red' }}>*</span></label>
                                {!action ? <button type="button" onClick={this.onClickOpenModel} style={{ marginTop: '-5px', marginRight: '-6px' }} className="btn btn-outline-primary ml-1 border-0 rounded-circle" data-toggle="tooltip" data-placement="top" title="Add Section" ><i className="fa fa-plus-circle fa-1x " aria-hidden="true"></i></button> : ""}
                                {!action ? <select className='form-control-select' name='setting' value={_.findIndex(this.state.settings, { 'id': this.state.setting?.id })}
                                  onChange={(e) => this.handleSettingChange(e, 'setting')} required>
                                  <option hidden selected value="">Select Minimum Qualification</option>
                                  {_.map(this.state.settings, (setting, index) => {
                                    return <option value={index}>{setting.name}</option>
                                  })}
                                </select> : <select className='form-control-select' name='setting' value={_.findIndex(this.state.settings, { 'id': this.state.setting?.id })}>
                                  <option hidden selected value="">Select Minimum Qualification</option>
                                  {_.map(this.state.settings, (setting, index) => {
                                    return <option value={index}>{setting.name}</option>
                                  })}
                                </select>}
                                <FormHelperText className="helper ">{this.state.error.settingStatus ? this.state.error.settingMsg : null}</FormHelperText>
                              </div>
                              <div className="form-group col-6 mT-6" style={{ marginTop: '21px' }}>
                                <label className="form-label-select">Exam Validity (days)<span style={{ color: 'red' }}>*</span></label>
                                <input className='form-control-select' type='number' value={this.state.tokenValidity} required placeholder='exam validity in days' onChange={(e) => this.handleChange(e, 'tokenValidity')} />
                                <FormHelperText className="helper ">{this.state.error.tokenValidity ? this.state.error.tokenValidityMsg : null}</FormHelperText>
                              </div>
                              {this.state.tabsArray.includes("PROGRAMMING") ?
                                <div className="mT-30">
                                  <label style={{ marginLeft: '-17px' }} className="form-label-select">Programming Language</label>
                                  {!action ? <select style={{ marginLeft: '-16px' }}
                                    value={this.state.languageName}
                                    onChange={this.language}
                                    className='form-control-select'
                                  >
                                    <option value="">Select language</option>
                                    <option value="csharp">C#</option>
                                    <option value="java">Java</option>
                                    <option value="python">Python</option>
                                  </select> : <select style={{ marginLeft: '-16px' }}
                                    value={this.state.languageName}
                                    className='form-control-select'
                                  >
                                    <option value="">Select language</option>
                                    <option value="csharp">C#</option>
                                    <option value="java">Java</option>
                                    <option value="python">Python</option>
                                  </select>}
                                </div>
                                : ''}
                              <div style={{ marginLeft: '0.1rem', marginTop: this.state.tabsArray.includes("PROGRAMMING") ? '30px': '7.5rem'}}>
                                <CustomizedInputBase onClick={this.generatePublicUrl} value={this.state.generatedLink} isLinkDisabled={this.state.generateLinkIconDisabled} />
                              </div>
                              {isRoleValidation() === 'TEST_ADMIN' ? <div className="mT-30">
                                <label className="form-label-select">Level<span style={{ color: 'red' }}>*</span></label>
                                <input className='form-control-select' type='number' value={this.state.level} onChange={(e) => this.handleChange(e, 'level')} placeholder='Enter level' min={1} />
                                <FormHelperText className="helper ">{this.state.error.level ? this.state.error.levelMsg : null}</FormHelperText>
                              </div> : ""}
                              {action !== null ?
                                <>
                                  <div className="mT-30" style={{ display: 'flex', alignItems: 'center' }}>
                                    <label for="question">Status</label>
                                    <div className="custom-control custom-radio custom-control-inline ml-3 radio" style={{ marginLeft: '40px' }}>
                                      <input className="custom-control-input" id="active" type="radio" onChange={(e) => this.handleChange(e, "status")}
                                        value="ACTIVE" name="status" checked={this.state.status === "ACTIVE" || this.state.status === ""} />
                                      <label className="custom-control-label" for="active" >  Active </label>
                                    </div>
                                    <div className="custom-control custom-radio custom-control-inline ml-3 radio" style={{ marginLeft: '40px' }}>
                                      <input className="custom-control-input" id="inactive" type="radio" onChange={(e) => this.handleChange(e, "status")}
                                        value="INACTIVE" name="status" checked={this.state.status === "INACTIVE"} />
                                      <label className="custom-control-label" for="inactive" >  InActive </label>
                                    </div>
                                  </div> </> : ""
                              }
                            </div>
                            <div className="form-group col-4">
                              {this.settingRender()}
                            </div>
                          </div>
                          <div className="form-group row">
                            <div className="col-md-12">
                              <div className='row' style={{ float: "right" }}>
                                <div className='col-lg-6 col-sm-6 xol-md-6'>
                                  <button type="submit" className="btn btn-sm btn-prev" style={{ paddingRight: '0.5rem' }} disabled={this.state.countError}>{action !== null ? 'Update' : 'Add'}</button>
                                </div>
                                <div className='col-lg-6 col-sm-6 xol-md-6'>
                                  <Link className="btn btn-sm btn-nxt" to="/admin/vacancy">Cancel</Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }
}
export default withLocation(AddExam)
