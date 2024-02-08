import FormHelperText from '@mui/material/FormHelperText';
import { Checkbox } from '@mui/material';
import axios from 'axios';
import ReactEcharts from "echarts-for-react";
import _ from "lodash";
import React, { Component } from 'react';
import { Tab, Tabs } from '@mui/material';
import TabList from '@mui/lab/TabList';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import { authHeader, errorHandler } from '../../api/Api';
import { toastMessage, withLocation } from '../../utils/CommonUtils';
import url from '../../utils/UrlConstant';
import { isEmpty, isRoleValidation, isVaildnum } from '../../utils/Validation';
import SettingModel from '../Admin/SettingModel';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import StatusRadioButton from '../../common/StatusRadioButton';
import styled from 'styled-components';



const StyledCKEditorWrapper = styled.div`
  .ck-editor__editable {
    &.ck-rounded-corners.ck-editor__editable_inline.ck-focused {
      overflow-y: auto;
      height: 12rem;
    }
    &.ck-rounded-corners.ck-editor__editable_inline.ck-blurred {
      overflow-y: auto;
      height:  12rem;
    }

  }
`;

class Test extends Component {

  constructor() {
    super();
    const user = JSON.parse(localStorage.getItem("user"));
    this.state = {
      companyId: user.companyId,
      name: '',
      duration: '',
      level: '',
      programmingDuration: '',
      sqlDuration: '',
      tabsArray: [],
      totalQuestions: 0,
      categories: [],
      selectSection: ['APTITUDE', 'TECHNICAL', 'PROGRAMMING', 'SQL'],
      aptitudeSection: [],
      startDateTime: new Date(),
      link: '',
      authTenantId: '',
      languageName: "",
      languageId: '',
      candidateInstruction: '',
      examSubmitMessage: '',
      jobDescription: '',
      errormessage: '',
      sections: [],
      datas: [],
      programmingRound: false,
      colorChange: false,
      max: 3,
      status: "ACTIVE",
      isMcqCamera: false,
      isProgrammingCamera: false,
      isSqlCamera: false,
      isCopyPaste: false,
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
        level: false,
        levelMsg: '',
        entry: '',
        entryMsg: false,

        candidateInstruction: false,
        candidateInstructionMsg: '',
        examSubmitMessage: false,
        examSubmitMessageMsg: '',
        jobDescription: false,
        jobDescriptionMsg: '',
        programmingDuration: false,
        programmingDurationMsg: '',
        sqlDuration: false,
        sqlDurationMsg: ''
      },
      countError: false,
      settings: [],
      setting: {},
      openModal: false,
      tooltipSetting: '',
    }
  }

  componentDidMount() {
    axios.get(` ${url.LIST_SECTION}?status=${'ACTIVE'}&page=${1}&size=${100}`, { headers: authHeader() })
      .then(test => {
        let aptitudeSection = _.filter(test.data.response.content, { 'description': 'Aptitude' })?.map(section => section.name);

        this.setState({ aptitudeSection: aptitudeSection });
      }).catch(error => {
        errorHandler(error);
      })
  }

  editorOnChange = (event, editor) => {
    this.setState({ candidateInstruction: editor.getData() })
  }


  editorTestSubmitOnChange = (event, editor) => {
    this.setState({ examSubmitMessage: editor.getData() })
  }

  editorSubmitOnChange = (event, editor) => {
    this.setState({ jobDescription: editor.getData() })
  }
  setMcqRoundCamera = (value) => {
    this.setState({ isMcqCamera: value });
  }

  setProgrammingRoundCamera = (value) => {
    this.setState({ isProgrammingCamera: value });
  }

  setCopyPaste = (value) => {
    this.setState({ isCopyPaste: value })
  }

  setSqlRoundCamera = (value) => {
    this.setState({ isSqlCamera: value })
  }

  handleTabs = (event) => {

    const tabsArray = this.state.tabsArray;
    if (event.target.value === 'APTITUDE' && tabsArray.includes('LOGICAL REASONING')) {
      _.map(this.state.aptitudeSection, (section) => {
        this.spliceAnArray(tabsArray, section);
      })
    }

    else if (tabsArray.includes(event.target.value)) {
      this.spliceAnArray(tabsArray, event.target.value);
      if (event.target.value === 'PROGRAMMING') {
        this.setState({ programmingDuration: '' })
        if (tabsArray.length === 0) {
          this.setState({ duration: '' })
        }
      } else if (tabsArray.length === 0) {
        this.setState({ duration: '' })
      }
    }

    else if (event.target.value === 'APTITUDE') {
      _.map(this.state.aptitudeSection, (section) => {
        const categories = this.setCategories(section);
        tabsArray.push(section);
        this.state.categories.push(categories);
        this.getQuestionCount(section);
      })
    }
    else {
      const categories = this.setCategories(event.target.value);
      tabsArray.push(event.target.value);
      this.state.categories.push(categories);
      this.getQuestionCount(event.target.value);
    }
    this.setState({ tabsArray })

    this.addTotalQuestions();

  }

  spliceAnArray = (tabsArray, section) => {
    const index = tabsArray.indexOf(section);
    if (index > -1) {
      tabsArray.splice(index, 1);
      this.state.categories.splice(index, 1);
      this.state.sections.splice(index, 1);
    }
  }

  setCategories = (section) => {
    return {
      sectionName: section,
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
  }

  getQuestionCount = (section) => {
    axios.get(`${url.ADMIN_API}/question/getQuestionCount?sections=${section}`, { headers: authHeader() })
      .then(res => {
        this.setState({
          section: this.state.sections.push({
            name: res.data.response[0]?.sectionName,
            simple: res.data.response[0]?.simple,
            medium: res.data.response[0]?.medium,
            complex: res.data.response[0]?.complex
          })
        })
      }).catch(error => {
        toastMessage('error', error.response?.data?.message)
      })
  }

  async onSumSection(event, key, index) {

    const { sections } = this.state;
    const { categories } = this.state;
    categories[index][key] = Number(event.target.value);
    categories[index]['totalInSection'] = Number(this.state.categories[index]['simple']) + Number(this.state.categories[index]['medium']) + Number(this.state.categories[index]['complex']);

    if (key === "simple" && categories[index].sectionName !== "TECHNICAL") {
      if (event.target.value > sections[index][key] || event.target.value === null) {
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

    if (key === "medium" && categories[index].sectionName !== "TECHNICAL") {
      if (event.target.value > sections[index][key] || event.target.value === null) {
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

    if (key === "complex" && categories[index].sectionName !== "TECHNICAL") {
      if (event.target.value > sections[index][key] || event.target.value === 0) {
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
    if (isEmpty(this.state.name)) {
      error.name = true;
      error.examNameMsg = "Field Required !";
      this.setState({ error })
    } else {
      error.name = false;
      this.setState({ error })
    }

    if (isEmpty(this.state.level) || isVaildnum(this.state.level)) {
      error.level = true;
      error.levelMsg = "Enter Only Number !";
      this.setState({ error })
    } else {
      error.level = false;
      this.setState({ error })
    }


    if ((isEmpty(this.state.duration) || this.state.duration === 0 || this.state.tabsArray.length === 0)) {
      if (((!this.state.tabsArray.includes("PROGRAMMING") && !this.state.tabsArray.includes("SQL") && this.state.tabsArray.length <= 2) //to select !(PROGRAMMNING && SQL)
        || ((this.state.tabsArray.includes("PROGRAMMING") || this.state.tabsArray.includes("SQL")) && this.state.tabsArray.length !== 1)) //to select PROGRAMMING || SQL
        && (!(this.state.tabsArray.includes("PROGRAMMING") && this.state.tabsArray.includes("SQL") && this.state.tabsArray.length === 2))) //to select PROGRAMMING && SQL
      {
        error.duration = true;
        error.durationMsg = "Field Required !";
        this.setState({ error })
      } else {
        error.duration = false;
        this.setState({ error })
      }
    }

    if (isEmpty(this.state.candidateInstruction)) {
      error.candidateInstruction = true;
      error.candidateInstructionMsg = "Field Required !";
      this.setState({ error })
    } else {
      error.candidateInstruction = false;
      this.setState({ error })
    }
    if (isEmpty(this.state.examSubmitMessage)) {
      error.examSubmitMessage = true;
      error.examSubmitMessageMsg = "Field Required !";
      this.setState({ error })
    } else {
      error.examSubmitMessage = false;
      this.setState({ error })
    }
    if (isEmpty(this.state.jobDescription)) {
      error.jobDescription = true;
      error.jobDescriptionMsg = "Field Required !";
      this.setState({ error })
    } else {
      error.jobDescription = false;
      this.setState({ error })
    }

    if (this.state.tabsArray.includes("PROGRAMMING") && isEmpty(this.state.programmingDuration)) {
      error.programmingDuration = true;
      error.programmingDurationMsg = "Field Required !";
      this.setState({ error })

    } else {
      error.programmingDuration = false;
      this.setState({ error })
    }

    if (this.state.tabsArray.includes("SQL") && isEmpty(this.state.sqlDuration)) {
      error.sqlDuration = true;
      error.sqlDurationMsg = "Field Required !";
      this.setState({ error })

    } else {
      error.sqlDuration = false;
      this.setState({ error })
    }

    event.preventDefault();
    if (this.state.totalQuestions !== 0 && !error.duration && !error.examName
      && !error.candidateInstruction && !error.examSubmitMessage && !error.jobDescription && !error.level && !error.programmingDuration && !error.sqlDuration) {
      this.setState({
        ...this.state,
        programmingRound: this.state.sections[0].name === 'PROGRAMMING' ? true : false
      }, () => { this.saveExam() });
    }
    else if (this.state.totalQuestions === 0) {
      this.setState({ errormessage: 'Must set a question' });
    }
  }
  saveExam = () => {
    axios.post(` ${url.COLLEGE_API}/level`, this.state, { headers: authHeader() })
      .then(() => {
        if (this.props.location.pathname.indexOf('view') > -1) {
          toastMessage('success', 'Test Details Updated Successfully..!');
          (isRoleValidation() === "SUPER_ADMIN" ?
            this.props.navigate('/settings/test') :
            this.props.navigate('/admin/test'))
        } else {
          toastMessage('success', 'Test Added Successfully..!');
          (isRoleValidation() === "SUPER_ADMIN" ?
            this.props.history.push('/settings/test') :
            this.props.history.push('/admin/test'))
          this.resetExamForm();
        }
      }).catch(error => {
        errorHandler(error);
      })
  }
  resetExamForm() {
    this.setState({
      name: '',
      duration: '',
      tabsArray: [],
      totalQuestions: 0,
      categories: [],
      candidateInstruction: '',
      examSubmitMessage: '',
      setting: {}
    })
  }


  handleChange = (event, key) => {
    if (key === "name" || key === "duration" || key === "level") {
      const { error } = this.state;
      error[key] = false
    }

    this.setState({ [key]: event.target.value })
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
      this.componentDidMount();
    }
  }

  onCloseModal = () => {
    this.setState({ openModal: !this.state.openModal });
    this.componentDidMount();
  }

  handleSelect(list) {
    let category = _.filter(this.state.categories, { 'sectionName': list });
    return (Number(category[0]?.simple) === 0 && Number(category[0]?.medium) === 0 && Number(category[0]?.complex) === 0)
  }

  createTabsUI = (action) => {
    return (
      this.state.tabsArray?.length > 0 ?
        // <div className='row'>
        <div className='col-12'>
          <div className="mT-30">
            <TabContext>
              <Tabs>
                <TabList>
                  {_.map(this.state.tabsArray, (list) =>
                    <Tab>{list} <span className={this.handleSelect(list) ? 'required' : ''}></span> {this.handleSelect(list)}</Tab>
                  )}
                </TabList>
                {
                  _.map(this.state.categories, (category, key) =>
                    <TabPanel>
                      <div className='row'>
                        <div className='col'>
                          <div style={{ marginLeft: '-15px' }}>
                            <div className='col mb-2' >
                              <label for="question">Simple</label> &nbsp;
                              <strong style={{ color: 'tomato' }}>{category.easyMsg}</strong>
                              <input className='form-control-row' id="simple" min='0' value={category.simple} onChange={(e) => this.onSumSection(e, 'simple', key)} type='number' placeholder='Simple' />
                            </div>
                            <div className='col mb-2' >
                              <label for="question">Medium</label> &nbsp;
                              <strong style={{ color: 'tomato' }}>{category.mediumMsg}</strong>
                              <input errormessage="NONE" className='form-control-row' id="medium" min="0" value={category.medium} onChange={(e) => this.onSumSection(e, 'medium', key)} type='number' placeholder='Medium' />

                            </div>
                            <div className='col mb-2' >
                              <label for="question">Complex</label> &nbsp;
                              <strong style={{ color: 'tomato' }}>{category.hardMsg}</strong>
                              <input className='form-control-row' id="complex" min='0' value={category.complex} onChange={(e) => this.onSumSection(e, 'complex', key)} type='number' placeholder='Complex' />
                            </div>
                            <div className='col mb-2' >
                              <label for="question">Total of This Section</label>
                              <input className='form-control-row' min='1' value={category.totalInSection} type='number' placeholder='Total' tabindex="1" tabstop="false" readOnly={true} />
                            </div>
                          </div>
                        </div>
                        <div className='col-6'>
                          {this.state.sections.length > 0 && !this.state.sections.sectionName === 'TECHNICAL' ? <ReactEcharts option={this.getOption(category.sectionName)} style={{ height: 300 }} /> : ''}
                        </div>

                      </div>
                    </TabPanel>)
                }
              </Tabs>
            </TabContext>
            <div className='row'>
              <div className='col'>
                <div style={{ marginLeft: '-15px', width: '570px' }}>
                  <div className='col mb-2'>
                    <label for="question">Total Questions</label>
                    <input className='form-control-row' value={this.state.totalQuestions} placeholder='Total Questions' tabindex="1" tabstop="false" readOnly={true} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> : ''
      // </div>
    );
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
          name: "Questions",
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
    if (this.props.location.pathname.indexOf('view') > -1) {
      const { test } = this.props.location.state
      this.setState({
        id: test.id,
        name: test.level,
        duration: test.duration,
        tabsArray: _.map(test.categories, (category) => category.sectionName),
        totalQuestions: test.totalQuestions,
        startDateTime: test.startDateTime,
        candidateInstruction: test.candidateInstruction,
        jobDescription: test.jobDescription,
        examSubmitMessage: test.examSubmitMessage,
        languageName: test.languageName,
        languageId: test.languageId,
        status: test.status,
        categories: test.categories,
        link: test.link,
        authTenantId: test.authTenantId,
        setting: test.setting,
        level: test.level,
        programmingDuration: test.programmingDuration,
        sqlDuration: test.sqlDuration,
        isMcqCamera: test.isMcqCamera,
        isProgrammingCamera: test.isProgrammingCamera,
        isSqlCamera: test.isSqlCamera,
        isCopyPaste: test.isCopyPaste
      })

      _.map(test.categories, (category) => {
        this.getQuestionCount(category.sectionName)
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
    }

  }

  handleDateChange = (date) => {
    this.setState({ startDateTime: date });
  }

  render() {
    let action = null;
    if (this.props.location.pathname.indexOf('view') > -1) {
      action = this.props.location.state;
    }
    return (
      <>
        {this.state.openModal ? <SettingModel onCloseModal={this.onCloseModal} /> : ''}
        <main className="main-content bcg-clr">
          <div>
            <div className="container-fluid cf-1">
              <div className="card-header-new">
                <span>
                  {action ? 'View' : 'Add'} Level
                </span>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="table-border-cr">
                    <div className="form-row">
                      <div className="row">
                        <form onSubmit={this.handleSubmit}>
                          <div className="form-row" >
                            <div className="col-md-6" >
                              <div className="form-group">
                                <label className="form-label-row"><b>Level</b><span style={{ color: 'red' }}>*</span></label>
                                {!action ? <input className='form-control-row-input col-7' value={this.state.level} type='text' maxLength="50" onChange={(e) => this.handleChange(e, 'level')} placeholder='Level' /> : <input className='form-control-row-input col-7' value={this.state.level} type='text' maxLength="50" ></input>}
                                {this.state.error.level && <FormHelperText className="helper" style={{ paddingLeft: "35px" }}>{this.state.error.levelMsg}</FormHelperText>}
                              </div>
                            </div>
                            <div className='col-md-6'></div>
                            <label className="form-label-row"><b>Sections</b><span style={{ color: 'red' }}>*</span></label>
                            {this.state.tabsArray.includes("PROGRAMMING") && this.state.tabsArray.length === 1 ? <div className="col-md-4"></div> : ""}
                            {!action ? <div className='form-group col-12' style={{ marginLeft: '2.3rem' }}>

                              {_.map(this.state.selectSection, (section) => {
                                return <div>
                                  <label className="checkbox">
                                    <input type="checkbox" value={section} onChange={(e) => this.handleTabs(e, { section })}
                                      checked={this.state.tabsArray.includes(section) ? true : (this.state.tabsArray.includes("LOGICAL REASONING") && section === "APTITUDE") ? true : false}
                                      required={this.state.tabsArray.length > 0 ? false : true} />
                                    <span className="ml-1">{section}</span>
                                  </label>
                                </div>
                              })}
                            </div> : <div className='form-group col-12' style={{ left: '0rem' }}>
                              <label className="form-label-row"><b>Selected Sections</b></label>
                              {_.map(this.state.tabsArray, (section) => {
                                return <div style={{ marginLeft: "4rem" }}>
                                  <span className="ml-1"><li>{section}</li></span>
                                </div>
                              })}
                            </div>}
                            {/* </div> */}

                            {((this.state.tabsArray.includes("PROGRAMMING") || this.state.tabsArray.includes("SQL")) && this.state.tabsArray.length === 1) || ((this.state.tabsArray.includes("PROGRAMMING") && this.state.tabsArray.includes("SQL")) && this.state.tabsArray.length === 2) ? "" :
                              <div className="col-md-6">
                                <div className="form-group">
                                  <label className="form-label-row"><b>MCQ Duration </b><span style={{ color: 'red' }}>*</span></label>
                                  <input className='form-control-row-input col-7' style={{width:'25rem'}} value={this.state.duration} type='number' max="480" onChange={(e) => this.handleChange(e, 'duration')} placeholder='Duration (In minutes)' />
                                  <FormHelperText className="helper" style={{ paddingLeft: "35px" }}>{this.state.error.duration ? this.state.error.durationMsg : null}</FormHelperText>
                                </div>
                              </div>}
                            {this.state.tabsArray.includes("SQL") || (this.state.selectSection.length === 1 && this.state.selectSection.includes("SQL")) ?
                              <div className="col-md-6">
                                <div className="form-group">
                                  <label className="form-label-row"><b>SQL Duration</b><span style={{ color: 'red' }}>*</span></label>
                                  <input className='form-control-row-input col-7' value={this.state.sqlDuration} type='number' max="480" onChange={(e) => this.handleChange(e, 'sqlDuration')} placeholder='Duration (In minutes)' />
                                  <FormHelperText className="helper" style={{ paddingLeft: "35px" }}>{this.state.error.sqlDuration ? this.state.error.sqlDurationMsg : null}</FormHelperText>
                                </div>
                              </div>
                              : ''}
                            <div className="col-md-6">
                              {this.state.tabsArray.includes("PROGRAMMING") || (this.state.selectSection.length === 1 && this.state.selectSection.includes("PROGRAMMING")) ?
                                <div className="form-group">
                                  <label className="form-label-row"><b>Programming Duration</b><span style={{ color: 'red' }}>*</span></label>
                                  <input className='form-control-row col-7' value={this.state.programmingDuration} type='number' max="480" onChange={(e) => this.handleChange(e, 'programmingDuration')} placeholder='Duration (In minutes)' />
                                  <FormHelperText className="helper" style={{ paddingLeft: "35px" }}>{this.state.error.programmingDuration ? this.state.error.programmingDurationMsg : null}</FormHelperText>
                                </div>
                                : ''}
                            </div>
                            <div className='col-md-12' style={{ paddingLeft: "1.8rem", marginBottom: '10px' }}>
                              {(this.state.tabsArray.length !== 0) ? <span>Select Camera Access</span> : <span></span>}
                            </div>
                            {((this.state.tabsArray.includes("SQL") && this.state.tabsArray.includes("PROGRAMMING") && this.state.tabsArray.length > 2)
                              || (!this.state.tabsArray.includes("SQL") && !this.state.tabsArray.includes("PROGRAMMING") && this.state.tabsArray.length >= 1)
                              || (((this.state.tabsArray.includes("SQL") && !this.state.tabsArray.includes("PROGRAMMING")) ||
                                (!this.state.tabsArray.includes("SQL") && this.state.tabsArray.includes("PROGRAMMING"))) && this.state.tabsArray.length >= 2)
                              || (this.state.tabsArray.length === 1 && (!this.state.tabsArray.includes("SQL") && !this.state.tabsArray.includes("PROGRAMMING"))))
                              ? <div className="col-md-12" style={{ paddingLeft: "2.5rem" }}>
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
                                </div>
                              </div> : null}
                            {this.state.tabsArray.includes("PROGRAMMING") || (this.state.selectSection.length === 1 && this.state.selectSection.includes("PROGRAMMING")) ? <div className="col-md-12" style={{ paddingLeft: "2.5rem" }}>
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
                              </div>
                            </div> : null}
                            {this.state.tabsArray.includes("SQL") || (this.state.selectSection.length === 1 && this.state.selectSection.includes("SQL")) ? <div className="col-md-12" style={{ paddingLeft: "2.5rem" }}>
                              <div className='row'>
                                <div className='col-lg-6 col-sm-6 xol-md-6'>
                                  <span>SQL Round Camera Access</span>
                                </div>
                                <div className='col-lg-3 col-sm-3 xol-md-3'>
                                  <div className="form-group">
                                    <span>Yes<Checkbox style={{ color: this.state.isSqlCamera ? '#f15a2d' : '' }} onChange={() => this.setSqlRoundCamera(true)} checked={this.state.isSqlCamera} /></span>
                                  </div>
                                </div>
                                <div className='col-lg-3 col-sm-3 xol-md-3'>
                                  <div className="form-group">
                                    <span>No<Checkbox style={{ color: !this.state.isSqlCamera ? '#f15a2d' : '' }} onChange={() => this.setSqlRoundCamera(false)} checked={!this.state.isSqlCamera} /></span>
                                  </div>
                                </div>
                              </div>
                            </div> : ''}
                            <div className='col-md-12' style={{ paddingLeft: "2.5rem" }}>
                              <div className='row'>
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
                            <div className="form-group col-12">
                              {this.createTabsUI(action)}
                              <FormHelperText className="helper" style={{ paddingLeft: "60px" }}>{this.state.errormessage}</FormHelperText>
                            </div>
                            <div className='form-group col-12'>
                              <div className="mT-30">
                                <label for="question"><b>Candidate Instruction </b><span style={{ color: 'red' }}>*</span></label>
                                <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{this.state.error.candidateInstruction ? this.state.error.candidateInstructionMsg : null}</FormHelperText>
                                <StyledCKEditorWrapper>
                                  <CKEditor
                                    editor={ClassicEditor}
                                    data={this.state.candidateInstruction || ""}
                                    onChange={(event, editor) => this.editorOnChange(event, editor)}
                                    onReady={(editor) => {
                                      const container = editor.ui.view.element;
                                      ClassicEditor.create(
                                        editor.editing.view.document.getRoot(),
                                        {
                                          removePlugins: ["Heading", "Link", "CKFinder"],
                                          toolbar: [
                                            "style",
                                            "bold",
                                            "italic",
                                            "bulletedList",
                                            "numberedList",
                                            "blockQuote",
                                          ],

                                        }
                                      )
                                        .then(() => {
                                          console.log("Editor is ready to use!", editor);
                                        })
                                        .catch((error) => {
                                          console.error(error);
                                        });
                                    }}
                                  />
                                </StyledCKEditorWrapper>
                              </div>
                            </div>
                            <div className='form-group col-12' style={{marginTop:'-5rem'}}>
                              <div className="mT-30">
                                <label for="question"><b>Test Submit Message </b><span style={{ color: 'red' }}>*</span></label>
                                <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{this.state.error.examSubmitMessage ? this.state.error.examSubmitMessageMsg : null}</FormHelperText>
                                <StyledCKEditorWrapper>
                                  <CKEditor
                                    editor={ClassicEditor}
                                    data={this.state.examSubmitMessage || ""}
                                    onChange={(event, editor) => this.editorTestSubmitOnChange(event, editor)}
                                    onReady={(editor) => {
                                      const container = editor.ui.view.element;
                                      ClassicEditor.create(
                                        editor.editing.view.document.getRoot(),
                                        {
                                          removePlugins: ["Heading", "Link", "CKFinder"],
                                          toolbar: [
                                            "style",
                                            "bold",
                                            "italic",
                                            "bulletedList",
                                            "numberedList",
                                            "blockQuote",
                                          ],

                                        }
                                      )
                                        .then(() => {
                                          console.log("Editor is ready to use!", editor);
                                        })
                                        .catch((error) => {
                                          console.error(error);
                                        });
                                    }}
                                  />
                                </StyledCKEditorWrapper>

                              </div>
                            </div>
                            <div className='form-group col-12' style={{marginTop:'-5rem'}}>
                              <div className="mT-30">
                                <label for="question"><b>Job Description </b><span style={{ color: 'red' }}>*</span></label>
                                <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{this.state.error.jobDescription ? this.state.error.jobDescriptionMsg : null}</FormHelperText>
                                <StyledCKEditorWrapper>
                                  <CKEditor
                                    editor={ClassicEditor}
                                    data={this.state.jobDescription || ""}
                                    onChange={(event, editor) => this.editorSubmitOnChange(event, editor)}
                                    onReady={(editor) => {
                                      const container = editor.ui.view.element;
                                      ClassicEditor.create(
                                        editor.editing.view.document.getRoot(),
                                        {
                                          removePlugins: ["Heading", "Link", "CKFinder"],
                                          toolbar: [
                                            "style",
                                            "bold",
                                            "italic",
                                            "bulletedList",
                                            "numberedList",
                                            "blockQuote",
                                          ],

                                        }
                                      )
                                        .then(() => {
                                          console.log("Editor is ready to use!", editor);
                                        })
                                        .catch((error) => {
                                          console.error(error);
                                        });
                                    }}
                                  />
                                </StyledCKEditorWrapper>
                              </div>
                            </div>
                            <div className="col-lg-6 col-6 col-sm-6 col-md-6" style={{marginTop:'-5rem'}}>
                              <div className="row" style={{ lineHeight: '2', marginTop: '3rem', marginLeft: '0.6rem' }}>
                                <StatusRadioButton
                                  handleChange={this.handleChange}
                                  status={this.state.status}
                                  style={{ marginTop: "0.5rem" }}
                                />
                              </div>
                            </div>
                            <div className="form-group col-4">
                            </div>
                          </div>

                          <div style={{ marginLeft: '85%' }}>
                            <button disabled={this.state.countError} type="submit" className="btn btn-sm btn-prev">{action ? 'UPDATE' : 'ADD'}</button>
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
export default withLocation(Test);