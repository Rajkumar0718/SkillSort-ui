import { Box, Button, Checkbox, FormHelperText, Grid, Step, StepLabel, Stepper, Tab, TextareaAutosize } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/ext-beautify";
import "ace-builds/src-noconflict/ext-keybinding_menu";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-prompt";
import "ace-builds/src-noconflict/keybinding-vscode";
import "ace-builds/src-noconflict/mode-c_cpp";
import 'ace-builds/src-noconflict/mode-csharp';
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/snippets/c_cpp";
import "ace-builds/src-noconflict/snippets/csharp";
import "ace-builds/src-noconflict/snippets/java";
import "ace-builds/src-noconflict/snippets/python";
import "ace-builds/src-noconflict/theme-monokai";
import 'ace-builds/src-noconflict/theme-one_dark';
import 'ace-builds/src-noconflict/theme-tomorrow_night';
import 'ace-builds/src-noconflict/theme-tomorrow_night_blue';
import 'ace-builds/src-noconflict/theme-tomorrow_night_bright';
import axios from 'axios';
import _ from "lodash";
import React, { Component } from 'react';
import AceEditor from "react-ace";
import { Link } from 'react-router-dom';
import { authHeader, errorHandler } from '../../api/Api';
import { toastMessage, withLocation } from '../../utils/CommonUtils';
import EditTextarea from '../../utils/EditableTextArea';
import { url } from '../../utils/UrlConstant';
import { isEmpty, isRoleValidation } from "../../utils/Validation";
import "../Candidate/Compiler.css";
import "../Candidate/Programming.css";
import AddSectionModal from './AddSectionModal';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { style } from '@mui/system';
import { color } from 'echarts';
class AddQuestion extends Component {

  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      masterSection: [],
      groupTypes: [],
      maxOption: 2,
      tempOptions: [{ name: 'A', value: '', }, { name: 'B', value: '', }],
      expectedAnswer: [{ input: '', output: '' }],
      selectExamType: ["MOCK", "ACTUAL"],
      selectDifficulty: ['SIMPLE', 'MEDIUM', 'COMPLEX'],
      selectSection: [],
      questionType: ['MCQ', 'True/False', 'programming', 'Fillups', 'SQL','Project'],
      isTimeBased: false,
      status: "ACTIVE",
      tabName: "java",
      mainClassBoxExpand: false,
      userFunctionBoxExpand: false,
      input: '',
      output: '',
      questionObject: {
        section: "",
        groupType: "",
        questionType: '',
        actualQuery: '',
        examType: '',
        difficulty: '',
        question: "",
        options: [],
        hint: "",
        answer: '',
        questionRoles: 'CANDIDATE',
        status: "ACTIVE",
        input: [],
        output: [],
        methodName: '',
        userFunctionJava: '',
        userFunctionPython: '',
        userFunctionCsharp: '',
        programInput: [],
        pseudoCode: "",
        parameters: [],
        programmingHint: "",
        mainClassName: ''
      },

      questionError: false,
      questionErrorMessage: 'Field Required !',
      questionTypeError: false,
      questionTypeErrorMsg: 'Select QuestionType',
      questionSectionError: false,
      questionSectionErrorMsg: 'Select QuestionSection',
      questionGroupError: false,
      questionGroupErrorMsg: 'Select Question GroupType',
      testTypeError: false,
      testTypeErrorMsg: 'Select TestType',
      difficultyError: false,
      difficultyErrorMsg: 'Select Difficult Type',
      error: {},
      functionNameError: false,
      functionNameErrorMsg: 'Field Required',
      dataTypes: ['byte', 'short', 'int', 'long', 'float', 'double', 'boolean', 'char', 'String', 'byte[]', 'short[]', 'int[]', 'long[]', 'float[]', 'double[]', 'boolean[]', 'char[]', 'String[]'],
      dataTypeExceedErrorMsg: '7 Parameter Only Allowed',
      returnTypeError: false,
      returnTypeErrorMsg: 'Fileld Required',
      parameterError: false,
      parameterErrorMsg: 'Enter the value In All Field',
      testCaseError: false,
      testCaseErrorMsg: 'Add TestCase',
      returnType: "",
      functionName: "",
      parameters: [{ dataType: '', name: '' }],
      javaCode: "",
      pythonCode: "",
      cSharpCode: "",
      testCase: [{ values: {}, output: '' }],
      testCaseShow: 0,
      addTestCaseExceed: false,
      activeStep: 0,
      addTestcaseModal: false,
      manualStructure: false,
      generateStructure: true

    }

    this.tabJson = [
      {
        value: "java",
        key: "mainClassJava",
        mode: "java"
      }, {
        value: "python",
        key: "mainClassPython",
        mode: "python"
      }, {
        value: "c#",
        key: "mainClassCsharp",
        mode: "csharp"
      }
    ]

    this.userFunction = [
      {
        value: "java",
        key: "javaCode",
        mode: "java"
      }, {
        value: "python",
        key: "pythonCode",
        mode: "python"
      }, {
        value: "c#",
        key: "cSharpCode",
        mode: "csharp"
      }
    ]
  }

  setQuestions = () => {
    console.log("setQuestion", this.props.location?.pathname.indexOf('edit'));
    if (this.props.location?.pathname?.indexOf('edit') > -1) {
      const { questions } = this.props.location.state
      let questionObject = questions;
      questionObject.javaCode = questions.userFunctionJava;
      questionObject.pythonCode = questions.userFunctionPython;
      questionObject.cSharpCode = questions.userFunctionCsharp;
      questionObject.groupType = questions.groupType
      this.setState({
        tempOptions: questions.options,
        javaCode: questions.userFunctionJava,
        pythonCode: questions.userFunctionPython,
        cSharpCode: questions.userFunctionCsharp,
        returnType: questions.returnType,
        name: questions.section,
        status: questions.status,
        questionObject: questionObject,
        manualStructure: !questions.programInput || false,
        generateStructure: questions.programInput || false,
        input: questions.input ? questions.input[0] : '',
        output: questions.output ? questions.output[0] : ''
      });
      if (questions.programInput) {
        let testCase = _.map(questions.programInput, (inpu, index) => {
          return { values: inpu, output: questions.output[index] }
        })
        this.setState({ testCase: testCase })
      }
      if (questions.parameters) {
        let parameter = [];
        let num = 0;
        _.map(questions.parameters, (item, index) => {
          parameter[num] = { name: index, dataType: item }
          num++;
        })
        this.setState({ parameters: parameter })
      }
    }
  }

  componentDidMount() {
    let AllowedTestCase = isRoleValidation() === "TEST_ADMIN" ? 5 : 4;
    this.setState(prevState => ({
      testCase: [...prevState.testCase, ...Array.from({ length: AllowedTestCase }, () => ({
        values: {}, output: '',
      }))]
    }));
    this.setQuestions()
    axios.get(` ${url.ADMIN_API}/section/list?sectionRoles=CANDIDATE&status=${'ACTIVE'}&page=${1}&size=${100}`, { headers: authHeader() })
      .then(res => {
        let selectSection = [];
        for (let key in res.data.response.content) {
          selectSection.push(res.data.response.content[key]['name']);
        }
        this.setState({ selectSection: selectSection, masterSection: selectSection }, () => this.setSelectedSection(this.state?.questionObject?.questionType));
      }).catch(error => {
        errorHandler(error);
      })
    this.getGroupType()
  }

  getGroupType = () => {
    axios.get(`${url.COLLEGE_API}/practiceExam/getGroupType`, { headers: authHeader() })
      .then(res => {
        this.setState({ groupTypes: res.data.response })
      })
      .catch(error => {
        console.log(error.response?.data?.message);
        errorHandler(error)
      })
  }

  handleHintChange = (e, key) => {
    const { questionObject } = this.state;
    questionObject[key] = e.target.value;
    this.setState({ questionObject });
  }

  getSection = (questionType) => {
    if (questionType === 'programming') {
      return 'PROGRAMMING';
    } else if (questionType === 'Fillups') {
      return 'FILLUPS';
    } else if (questionType === 'SQL') {
      return 'SQL';
    } else if (questionType === 'Project'){
      return 'PROJECT';
    }
     else {
      return '';
    }
  }

  handleChange = (e, key) => {
    if (key === 'question' || key === 'staticFunction') {
      const { questionObject } = this.state;
      questionObject[key] = e;
      this.setState({ questionObject });
    } else if (key === 'methodName') {
      const { questionObject } = this.state;
      questionObject[key] = e.target.value.replace(/ /g, '');
      this.setState({ questionObject });

    }
    else if (key === 'questionType') {
      const { questionObject } = this.state;
      questionObject[key] = e.target.value;
      questionObject.section = this.getSection(questionObject.questionType);
      this.setState({ questionObject });
      if (e.target.value === 'True/False') {
        this.setState({ maxOption: 2 }, () => this.setSelectedSection(e.target.value));
      }
      if (e.target.value === 'MCQ') {
        this.setState({
          maxOption: 5
        }, () => this.setSelectedSection(e.target.value));
      }
    } else {
      const { questionObject } = this.state;
      questionObject[key] = e.target.value;
      this.setState({ questionObject });
      if (e.target.value === 'programming') {
        this.setSelectedSection(e.target.value)
      }
      if (e.target.value === 'SQL') {
        this.setSelectedSection(e.target.value)
      }
    }

  }
  setSelectedSection = (qType) => {
    if (qType !== 'programming' && qType !== 'SQL') {

      let selectSection = _.clone(this.state.masterSection)
      let idx = selectSection.indexOf("PROGRAMMING")
      if (idx > -1) {
        selectSection.splice(idx, 1)
        let idx_sql = selectSection.indexOf("SQL")
        selectSection.splice(idx_sql, 1)
        this.setState({ selectSection: selectSection })
      }
      idx = selectSection.indexOf('FILLUPS')
      if (idx > -1) {
        selectSection.splice(idx, 1)
      }
      this.setState({ selectSection: selectSection })
    } else if (qType === 'SQL') {
      let section = [];
      section.push("SQL")
      this.setState({ selectSection: section })
    } else {
      let section = [];
      section.push("PROGRAMMING")
      this.setState({ selectSection: section })
    }

  }

  handleStatusChange = (e, key) => {
    this.setState({ [key]: e.target.value })
  }

  async handleOptionChange(i, e) {
    const { name, value } = e.target;
    let tempOptions = [...this.state.tempOptions];
    tempOptions[i] = { ...tempOptions[i], [name]: value };
    this.setState({ tempOptions });
  }


  handleTestCaseChange = (params) => {
    const { field, id, props } = params;
    if (field !== 'output') {
      let testCase = [...this.state.testCase];
      testCase[id].values = { ...testCase[id].values, [field]: props.value.replace(/"/g, "") }
      this.setState({ testCase });
    }
    else if (field === 'output') {
      let testCase = [...this.state.testCase];
      testCase[id] = { ...testCase[id], [field]: props.value.replace(/"/g, "") };
      this.setState({ testCase })
    }
  }
  getmapParameters = () => {
    let obj = {};
    _.map(this.state.parameters, p => {
      obj[p.name] = p.dataType;
    })
    return obj
  }


  handleValueChange = (event, newValue) => {
    this.setState({ tabName: newValue })
  };

  handleExpand = (key) => {
    key === 'mainClass' ?
      this.setState({ mainClassBoxExpand: !this.state.mainClassBoxExpand }) : this.setState({ userFunctionBoxExpand: !this.state.userFunctionBoxExpand })
  }


  handleSubmit = async event => {
    event.preventDefault()
    if (this.state.questionObject.questionType === 'programming' && this.state.generateStructure)
      await this.generateProgramCode()
    let { questionError } = this.state
    let { questionErrorMessage } = this.state
    const { error } = this.state
    if (isEmpty(this.state.questionObject.question)) {
      questionError = true
      questionErrorMessage = "Field Required !"
      this.setState({ questionError, questionErrorMessage })
    } else {
      questionError = false
      questionErrorMessage = ""
      this.setState({ questionError, questionErrorMessage })
    }
    if(this.state.questionObject.questionType === 'programming') {
    if (isEmpty(this.state.questionObject.methodName) && this.state.generateStructure) {
      error.mainClassError = true
      this.setState({ error })
    } else {
      error.mainClassError = false
      this.setState({ error })
    }
    if (this.state.manualStructure && (!this.state.questionObject.mainClassJava || !this.state.questionObject.mainClassPython || !this.state.questionObject.mainClassCsharp)) {
      error.mainClassError = true
      error.mainClassErrorMsg = 'Field Required !'
      this.setState({ error })
    } else {
      error.mainClassError = false
      error.mainClassErrorMsg = ''
      this.setState({ error })
    }
    if (this.state.manualStructure && (_.isEmpty(this.state.questionObject.javaCode) || _.isEmpty(this.state.questionObject.pythonCode) || _.isEmpty(this.state.questionObject.cSharpCode))) {
      error.userClassError = true
      error.userClassErrorMsg = 'Field Required !'
      this.setState({ error })
    } else {
      error.userClassError = false
      error.userClassErrorMsg = ''
      this.setState({ error })
    }
    if (this.state.manualStructure && (_.isEmpty(this.state.questionObject.mainClassName))) {
      error.mainClassName = true
      error.mainClassNameErrorMsg = 'Field Required !'
      this.setState({ error })
    } else {
      error.mainClassName = false
      error.mainClassNameErrorMsg = ''
      this.setState({ error })
    }

    if (error.mainClassError || error.userClassError || error.mainClassName|| questionError) {
      return;
    }
  }
    this.submitQuestion()
  }

  submitQuestion = () => {
    const { questionObject } = this.state;
    questionObject['options'] = this.state.tempOptions;
    questionObject['status'] = this.state.status;
    if (questionObject.questionType === 'programming') {
      questionObject['methodName'] = questionObject.methodName?.replace(/\s/g, '_');
      if (this.state.generateStructure) {
        questionObject['programInput'] = _.map(this.state.testCase, 'values');
        questionObject['output'] = this.state.testCase.map(p => p.output);
        questionObject['userFunctionJava'] = this.state.javaCode;
        questionObject['userFunctionPython'] = this.state.pythonCode;
        questionObject['userFunctionCsharp'] = this.state.cSharpCode;
        questionObject['parameters'] = this.getmapParameters(questionObject);
        questionObject['returnType'] = this.state.returnType;
        delete questionObject.mainClassName;
      }
      else {
        questionObject.output.pop()
        questionObject.output.push(this.state.output);
        questionObject.input.pop()
        questionObject.input.push(this.state.input)
        questionObject['userFunctionJava'] = questionObject.javaCode;
        questionObject['userFunctionPython'] = questionObject.pythonCode;
        questionObject['userFunctionCsharp'] = questionObject.cSharpCode;
        delete questionObject.programInput;
        delete questionObject.parameters;
      }
    } else {
      questionObject.parameters = null;
    }
    if ((questionObject.questionType === 'SQL' && questionObject.groupType === 'SQL')|| questionObject.groupType ) {
      questionObject['section'] = '';
    }
    console.log(questionObject)
    axios.post(` /api2/question/save`, questionObject, { headers: authHeader() })
      .then(() => {
        this.setState({ activeStep: 0 })
        if (this.props.location?.pathname?.indexOf('edit') > -1) {
          toastMessage('success', 'Question Updated Successfully..!');
          this.props.history.push({
            pathname: isRoleValidation() === "TEST_ADMIN" ? "/testadmin/question" : "/admin/questions",
            state: { difficulty: this.props.location?.state?.difficulty, section: this.props.location?.state?.section }
          })
          this.props.history.push(isRoleValidation() === "TEST_ADMIN" ? "/testadmin/question" : "/admin/questions");
        } else {
          toastMessage('success', 'Question Added Successfully..!');
          this.resetQuestionForm();
        }
      }).catch(error => {
        errorHandler(error);
      })
  }

  resetQuestionForm = () => {
    this.setState({
      status: "ACTIVE",
      tempOptions: [{
        name: 'A',
        value: '',
      },
      {
        name: 'B',
        value: '',
      }],
      questionObject: {
        section: '',
        questionType: '',
        difficulty: '',
        question: '',
        options: [],
        hint: '',
        answer: '',
        programInput: [],
        programOutput: [],
        javaCode: '',
        pythonCode: '',
        csharpCode: '',
        pseudoCode: "",
        parameters: [],
        programmingHint: "",
        returnType: '',
        examType: ''
      },
      name: '',
      description: '',
      returnType: "",
      parameters: [{ dataType: '', name: '' }],
      javaCode: "",
      pythonCode: "",
      cSharpCode: "",
      testCase: [{ values: [{ name: '', value: '' }], output: '' }],
      testCaseShow: 0,
    });
  }

  addOption = () => {
    if (this.state.tempOptions && this.state.tempOptions?.length < this.state.maxOption && this.state.questionObject?.questionType !== 'programming') {
      this.setState(prevState => ({ tempOptions: [...prevState.tempOptions, { name: String.fromCharCode(this.state.tempOptions[this.state.tempOptions.length - 1].name.charCodeAt(0) + 1), value: '' }] }));
    } else {
      this.setState(prevState => ({ expectedAnswer: [...prevState.expectedAnswer, { input: '', output: '' }] }));
    }
  }

  mcqRemoveOption = () => {
    if (this.state.tempOptions?.length > 2 && this.state.questionObject?.questionType !== 'programming') {
      let tempOptions = [...this.state.tempOptions];
      tempOptions.pop();
      this.setState({ tempOptions });

    } else {
      let expectedAnswer = [...this.state.expectedAnswer];
      expectedAnswer.pop();
      this.setState({ expectedAnswer });
    }
  }

  deleteInputsByIndex = (index, questionType) => {
    if (questionType === 'programming') {
      let selectedOption = this.state.expectedAnswer[index]
      let expectedAnswer = _.remove(this.state.expectedAnswer, function (option) {
        return option !== selectedOption;
      })
      this.setState({ expectedAnswer })
    }
    else {
      let selectedOption = this.state.tempOptions[index]
      let tempOptions = _.remove(this.state.tempOptions, function (option) {
        return option !== selectedOption;
      })
      this.setState({ tempOptions })
    }
  }

  handleInputChange(e) {
    const { name, value } = e.target;
    let input = this.state.input
    let output = this.state.output
    if (name === 'input') {
      input = value
      this.setState({ input })
    } else {
      output = value
      this.setState({ output })
    }
  }

  createDynamicInput() {
    if (this.state.questionObject.questionType !== 'programming' && this.state.questionObject.questionType !== 'Fillups' && this.state.questionObject.questionType !== 'SQL') {
      return _.map(this.state.tempOptions, (el, i) => (
        <div className='row' style={{ marginLeft: '0.25rem' }}>
          <div className="col-6 col-lg-6 col-sm-6 col-xl-6" key={i}>
            <div className="row">
              <div className="col-3 col-lg-3 col-sm-3 col-xl-3">
                <label className="form-label text-input-label">{el.name}</label></div>
              <div className="col-7 col-lg-7 col-sm-7 col-xl-7">
                <input className="profile-page" required autoComplete="off" placeholder={'option-' + el.name} name="value" value={el.value || ''} onChange={this.handleOptionChange.bind(this, i)} /></div>
              <div className='col-2 col-lg-2 col-sm-2 col-xl-2'>
                {i > 1 ? <i class="fa fa-trash" aria-hidden="true" style={{ color: 'red', marginTop: '1rem' }} onClick={() => this.deleteInputsByIndex(i, this.state.questionObject.questionType)} ></i> : null}
              </div>
            </div></div></div>

      ))
    } else if (this.state.questionObject.questionType === 'programming' && this.state.manualStructure) {
      return <>
        <div className='row'><div className=" col-6 col-lg-6 col-sm-6 col-xl-6" key={"input"}>
          <div className='row'>
            <div className=" col-3 col-lg-3 col-sm-3 col-xl-3">
              <label className="form-label text-input-label"><b>Input</b></label></div>
            <div className=" col-9 col-lg-9 col-sm-9 col-xl-9">
              <textarea name="input" className="profile-page"
                value={this.state.input || ''}
                onChange={(e) => this.handleInputChange(e)}
                placeholder="Input" autoComplete="off" />
            </div></div></div>
          <div className=" col-6 col-lg-6 col-sm-6 col-xl-6" key={"output"}>
            <div className='row'>
              <div className="col-3 col-lg-3 col-sm-3 col-xl-3">
                <label className="form-label text-input-label"><b>Expected output</b></label></div>
              <div className=" col-7 col-lg-7 col-sm-7 col-xl-7">
                <textarea name="output" className="profile-page"
                  value={this.state.output || ''}
                  onChange={(e) => this.handleInputChange(e)}
                  placeholder="Expected output" autoComplete="off" />
              </div>
            </div>
          </div></div>
      </>
    }
  }
  onClickOpenModel = (type) => {
    if (!this.state.openModal) {
      document.addEventListener('click', this.handleOutsideClick, false);
    } else {
      document.removeEventListener('click', this.handleOutsideClick, false);
    }
    this.setState({ openModal: !this.state.openModal, type: type });
  }

  handleOutsideClick = (e) => {
    if (e.target.className === 'modal fade show') {
      this.setState({ openModal: !this.state.openModal });
    }
  }

  onCloseModal = () => {
    this.setState({ openModal: !this.state.openModal });
    this.componentDidMount();
  }

  beautify = (editor) => {
    const session = editor.session;
    console.log(session.getMode())
    session.setValue(session.getValue(), {
      indent_size: 2
    })
  }

  handleMainClass = (value, key) => {
    const { questionObject } = this.state;
    questionObject[key] = value;
    this.setState({ questionObject });
  }

  renderAceEditor = (key, mode) => {
    return <AceEditor style={{ height: '80%', width: '100%', marginLeft: '5px' }}
      mode={mode}
      theme="monokai"
      value={this.state.questionObject[key] || this.state[key]}
      onChange={(value) => this.handleMainClass(value, key)}
      fontSize={14}
      showPrintMargin={false}
      showGutter={false}
      commands={[
        {
          name: "beautify",
          bindKey: { win: 'Ctrl-Shift-I', mac: 'Command-Shift-I' },
          exec: (ses) => this.beautify(ses),
        }
      ]}
      key={key}
      highlightActiveLine={true}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        showLineNumbers: true,
        tabSize: 2,
      }} />
  }

  setProgramStub = (e, key) => {

    if (key === 'returnType') {
      this.setState({ returnType: e.target.value })
    }
  }
  addParameter = () => {
    if (this.state.parameters.length <= 7)
      this.setState(prevState => ({ parameters: [...prevState.parameters, { dataType: '', name: '' }] }));
  }

  handleDataTypeChange = (e, i) => {
    const { name, value } = e.target;
    if (this.props.location.pathname.indexOf('edit') > -1 && name === 'name') {
      let testCase = this.state.testCase.map((obj) => {
        obj.values[value] = obj.values[this.state.parameters[i].name];
        delete obj.values[this.state.parameters[i].name];
        return obj;
      });
      this.setState({ testCase: testCase })
    }
    let spaceRemoveval = value.replace(/ /g, '')
    let parameters = [...this.state.parameters];
    parameters[i] = { ...parameters[i], [name]: spaceRemoveval };
    this.setState({ parameters });

  }



  createDynamicAddingData = () => {
    return _.map(this.state.parameters, (el, i) => (
      <>
        {i < 7 ?
          <Grid container spacing={2} style={{ marginLeft: '10px', marginBottom: '10px' }}>
            <Grid item sm={6}>
              <div key={"dataType" + i} style={{ marginBottom: '10px' }}>
                <select className='profile-page' name='dataType' required style={{ background: 'none' }}
                  value={el.dataType || ''}
                  onChange={(e) => this.handleDataTypeChange(e, i)}>
                  <option hidden selected value="">Select DataType</option>
                  {_.map(this.state.dataTypes, (key, value) => {
                    return <option value={key}>{key}</option>
                  })}
                </select>
              </div>
            </Grid>
            <Grid item sm={6}>
              <div>
                <div key={"name" + i}>
                  <input name="name" className="profile-page"
                    placeholder='Parameter Name'
                    value={el.name || ''}
                    onChange={(e) => this.handleDataTypeChange(e, i)}
                    autoComplete="off" />
                  {i !== 0 ? <i class="fa fa-trash" aria-hidden="true" style={{ color: 'red', cursor: 'pointer' }} onClick={() => this.deleteDataTypesByIndex(i)} ></i> : null}
                </div>
              </div>
            </Grid>
          </Grid> : i === 7 ? <div><FormHelperText style={{ marginLeft: '10px' }} className="helper">{this.state.dataTypeExceedErrorMsg}</FormHelperText></div> : null}

      </>
    ))
  }
  deleteDataTypesByIndex = (index) => {
    let selectedOption = this.state.parameters[index]
    let parameters = _.remove(this.state.parameters, function (option) {
      return option !== selectedOption;
    })
    this.setState({ parameters })
  }
  generateProgramCode = () => {
    this.generatejavaCode()
    this.generatePythonCode()
    this.generateCsharpCode()

  }
  generatejavaCode = () => {
    let mainClass = `public class Solution {  \n \t public static ${this.state.returnType} ${this.state.questionObject.methodName}(`
    let codeJava = ""
    _.map(this.state.parameters, (key, value) => {
      codeJava += `${key?.dataType} ${key?.name}${(this.state.parameters.length - 1) === value ? "){ \n   }\n}" : ","}`
    })
    let code = mainClass + codeJava;
    this.setState({ javaCode: code });
    console.log(code);
  }
  generatePythonCode = () => {
    let mainclass = `def ${this.state.questionObject.methodName}(`
    let codePython = ""
    _.map(this.state.parameters, (key, value) => {
      codePython += `${key?.name}${(this.state.parameters.length - 1) === value ? "):" : ","}`
    })
    let code = mainclass + codePython;
    this.setState({ pythonCode: code })
  }

  generateCsharpCode = () => {
    let mainClass = "class Solution{  \n \t public static " + this.state.returnType.toLowerCase() + " " + this.state.questionObject.methodName + "("
    let codecsharp = ""
    _.map(this.state.parameters, (key, value) => {
      codecsharp += `${key?.dataType?.toLowerCase()} ${key?.name}${(this.state.parameters.length - 1) === value ? "){ \n     }\n}" : ","}`
    })
    let code = mainClass + codecsharp;
    this.setState({ cSharpCode: code });

  }

  handleNext = async () => {
    let { activeStep } = this.state
    if (activeStep === 0) {
      if (isEmpty(this.state.questionObject.questionType)) {
        this.setState({ questionTypeError: true })
      } else {
        this.setState({ questionTypeError: false })
      }
      if (isEmpty(this.state.questionObject.section)) {
        this.setState({ questionSectionError: true })
      } else {
        this.setState({ questionSectionError: false })
      }
      if (isEmpty(this.state.questionObject.groupType)) {
        this.setState({ questionGroupError: true })
      }
      else {
        this.setState({ questionGroupError: false })
      }
      if (isEmpty(this.state.questionObject.examType)) {
        this.setState({ testTypeError: true })
      } else {
        this.setState({ testTypeError: false })
      }
      if (isEmpty(this.state.questionObject.difficulty)) {
        this.setState({ difficultyError: true })
      } else {
        this.setState({ difficultyError: false })
      }
      if (isEmpty(this.state.questionObject.question)) {
        this.setState({ questionError: true })
      } else {
        this.setState({ questionError: false })
      }
      if (!isEmpty(this.state.questionObject.groupType) && (this.state.questionObject.section === 'PROGRAMMING')) {
        const { questionObject } = this.state;
        questionObject.section = "";
        this.setState({ questionObject });
      }
      if (!isEmpty(this.state.questionObject.questionType) && (!isEmpty(this.state.questionObject.section) || !isEmpty(this.state.questionObject.groupType)) && !isEmpty(this.state.questionObject.examType) && !isEmpty(this.state.questionObject.difficulty) && !isEmpty(this.state.questionObject.question)) {
        this.setState((prevState) => ({
          activeStep: prevState.activeStep + 1,
        }));
        this.setState({ questionError: false, difficultyError: false, testTypeError: false, questionSectionError: false, questionGroupError: false, questionTypeError: false })
      }
    }
    else if (activeStep === 1 && this.state.questionObject.questionType === 'programming') {
      const obj = this.state.parameters
      let emptyStr = false
      for (const key in obj) {
        const isEmptyName = _.isEmpty(obj[key].name);
        const isEmptyDataType = _.isEmpty(obj[key].dataType)
        if (isEmptyName || isEmptyDataType) {
          emptyStr = true;
          break;
        }
      }
      if (isEmpty(this.state.questionObject.methodName)) {
        this.setState({ functionNameError: true })
      } else {
        this.setState({ functionNameError: false })
      }
      if (isEmpty(this.state.returnType)) {
        this.setState({ returnTypeError: true })
      } else {
        this.setState({ returnTypeError: false })
      }
      if (isEmpty) {
        this.setState({ parameterError: true })
      } else {
        this.setState({ parameterError: false })
      }
      if (!isEmpty(this.state.questionObject.methodName) && !isEmpty(this.state.returnType) && !emptyStr) {
        this.setState((prevState) => ({
          activeStep: prevState.activeStep + 1,
        }));
        this.setState({ parameterError: false, returnTypeError: false, functionNameError: false, })
      }
    }
    else if (activeStep === 2) {
      if (this.state.testCase.length < 5) {
        this.setState({ testCaseError: true })
      } else {
        this.setState({ testCaseError: false })
        this.setState((prevState) => ({
          activeStep: prevState.activeStep + 1,
        }));
      }
    }
  };

  handleBack = () => {
    this.setState((prevState) => ({
      activeStep: prevState.activeStep - 1,
    }));
  };

  handleCellKeyDown = (params, event) => {
    if (!params && !params.value)
      return
    if (event.key === 'Enter' && params.cellMode === 'edit') {
      console.log(params)
      event.preventDefault();
      params.api.setEditCellValue(
        { id: params.id, field: params.field, value: params.value.concat('\n') }
      );
    }
  }

  selectStructureType = (key) => {
    if(key === 'Manual' && !this.state.manualStructure) {
      this.setState({manualStructure : true, generateStructure : false})
    } else if (key !== 'Manual' && !this.state.generateStructure) {
      this.setState({generateStructure : true, manualStructure: false})
    }
  }


  render() {
    const { questionObject } = this.state;
    let { activeStep } = this.state;
    const questionType = questionObject.questionType;
    const steps = questionType === 'programming' && this.state.generateStructure ? ['Type', 'Code Stub', 'TestCase', 'Submit'] : questionType !== 'programming' && !this.state.manualStructure ? ['Type', 'Submit'] : [];
    let action = null;
    if (this.props.location.pathname.indexOf('edit') > -1) {
      action = this.props.location.state;
    }
    const columns= [
      { field: 'testCase', headerName: 'TestCase', width: 150, editable: false },
      ...this.state.parameters.map((p) => ({
        field: p.name,
        headerName: p.name,
        width: 150,
        editable: true,
        valueFormatter: (params) => params.row[p.name] ? params.row[p.name] : 'Enter param value',
        renderEditCell: (params) => <EditTextarea {...params} />,
      })),
      {
        field: 'output',
        headerName: 'Output',
        width: 150,
        editable: true,
        valueFormatter: (params) => params.row['output'] ? params.row['output'] : 'Enter value',
        renderEditCell: (params) => <EditTextarea {...params} />,
      },
    ];

    const rows = _.map(this.state.testCase, (t, index) => ({
      id: index,
      testCase: `TestCase ${index + 1}`,
      ...t.values,
      output: t.output,
    }));
    return (
      <>
        {this.state.openModal ? <AddSectionModal type={this.state.type} modalSection={{ action: 'Add' }} onCloseModalAdd={this.onCloseModal} /> : ''}
        <main className="main-content bcg-clr">
          <div>
            <div className="container-fluid cf-1">
              <div className="card-header-new">
                <span>
                  {action !== null ? 'Update' : 'Add'} Question
                </span>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <div className="table-border-cr">
                    <form onSubmit={this.handleSubmit}>
                    <div  style={{marginTop:'20px'}}>
                      <Stepper activeStep={activeStep}>
                        {steps.map((label) => (
                          <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                          </Step>
                        ))}
                      </Stepper>
                      </div>
                      {activeStep === 0 && (
                        <div>
                          <div className="row" style={{marginTop:'25px'}}>
                            <div className=" col-6 col-lg-6 col-sm-6 col-xl-6">
                              <div className='row' >
                                <div className=" col-3 col-lg-3 col-sm-3 col-xl-3">
                                  <label className="form-label text-input-label">Question Type <span className='required'></span></label>
                                </div>
                                <div className=" col-9 col-lg-9 col-sm-9 col-xl-9">
                                  <div>
                                    <select className='profile-page' required
                                      value={questionObject.questionType}
                                      onChange={(e) => this.handleChange(e, 'questionType')} style={{ background: 'none' }}>
                                      <option hidden selected value="">Select Question Type</option>
                                      {_.map(this.state.questionType, (key, value) => {
                                        return <option value={key}>{key}</option>
                                      })}
                                    </select>
                                    <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{this.state.questionTypeError ? this.state.questionTypeErrorMsg : null}</FormHelperText>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {!questionObject.groupType && questionObject.questionType === 'MCQ' ? <div className=" col-6 col-lg-6 col-sm-6 col-xl-6">
                              <div className='row'>
                                <div className=" col-3 col-lg-3 col-sm-3 col-xl-3">
                                  <label className="form-label text-input-label">Section<span className='required'></span></label></div>
                                <div className=" col-9 col-lg-9 col-sm-9 col-xl-9" style={{ marginLeft: '-40px' }}>
                                  <div>
                                    <button type="button" onClick={() => this.onClickOpenModel('Section')} style={{ marginTop: '-5px' }} data-toggle="tooltip" data-placement="top" title="Add Section" className="btn btn-outline-primary ml-1 border-0 rounded-circle"><i className="fa fa-plus-circle fa-1x " aria-hidden="true"></i></button>
                                    <select className='profile-page' required name='section'
                                      value={questionObject.section}
                                      onChange={(e) => this.handleChange(e, 'section')} style={{ background: 'none' }}>
                                      <option hidden selected value="">Select section</option>
                                      {_.map(this.state.selectSection, (key, value) => {
                                        return <option value={key}>{key}</option>;
                                      })}
                                    </select>
                                    <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{this.state.questionSectionError ? this.state.questionSectionErrorMsg : null}</FormHelperText>
                                  </div></div>
                              </div>
                            </div> : null}
                          </div>
                          <div className='row'>
                            <div className=" col-6 col-lg-6 col-sm-6 col-xl-6">
                              <div className='row'>
                                <div className=" col-3 col-lg-3 col-sm-3 col-xl-3">
                                  <label className="form-label text-input-label">Test Type <span className='required'></span></label></div>
                                <div className=" col-9 col-lg-9 col-sm-9 col-xl-9">
                                  <div>
                                    <select className='profile-page' required name='section'
                                      value={questionObject.examType}
                                      onChange={(e) => this.handleChange(e, 'examType')} style={{ background: 'none' }}>
                                      <option hidden selected value="">Select Test Type</option>
                                      {_.map(this.state.selectExamType, (key, value) => {
                                        return <option value={key}>{key}</option>;
                                      })}
                                    </select>
                                    <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{this.state.testTypeError ? this.state.testTypeErrorMsg : null}</FormHelperText>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className=" col-6 col-lg-6 col-sm-6 col-xl-6">
                              <div className='row'>
                                <div className=" col-3 col-lg-3 col-sm-3 col-xl-3">
                                  <label className="form-label text-input-label">Difficulty<span className='required'></span></label></div>
                                <div className=" col-9 col-lg-9 col-sm-9 col-xl-9">
                                  <div>
                                    <select style={{ background: 'none' }} className='profile-page' required name="difficulty"
                                      value={questionObject.difficulty}
                                      onChange={(e) => this.handleChange(e, 'difficulty')}
                                    >
                                      <option hidden selected value="">Select difficulty</option>
                                      {_.map(this.state.selectDifficulty, (key, value) => {
                                        return <option value={key}>{key}</option>;
                                      })}
                                    </select>
                                    <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{this.state.difficultyError ? this.state.difficultyErrorMsg : null}</FormHelperText>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {(!questionObject.section || questionObject.questionType === 'programming' || questionObject.questionType === 'SQL') && (!(isRoleValidation() === 'HR_MANAGER' || isRoleValidation() === 'ADMIN')) ?
                              <div className=" col-6 col-lg-6 col-sm-6 col-xl-6">
                                <div className='row'>
                                  <div className=" col-3 col-lg-3 col-sm-3 col-xl-3">
                                    <label className="form-label text-input-label">Group Type<span className='required'></span></label></div>
                                  <div className=" col-9 col-lg-9 col-sm-9 col-xl-9" style={{ marginLeft: '-40px' }}>
                                    <div>
                                      <button type="button" onClick={() => this.onClickOpenModel('Group')} style={{ marginTop: '-5px' }} data-toggle="tooltip" data-placement="top" title="Add GroupType" className="btn btn-outline-primary ml-1 border-0 rounded-circle"><i className="fa fa-plus-circle fa-1x " aria-hidden="true"></i></button>
                                      <select className='profile-page' required name='groupType'
                                        value={questionObject.groupType}
                                        onChange={(e) => this.handleChange(e, 'groupType')} style={{ background: 'none' }}>
                                        <option hidden selected value="">Select Group</option>
                                        {_.map(this.state.groupTypes, (key, value) => {
                                          return <option value={key.name}>{key.name}</option>;
                                        })}
                                      </select>
                                      <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{this.state.questionGroupError ? this.state.questionGroupErrorMsg : null}</FormHelperText>
                                    </div></div>
                                </div>
                              </div> : null}
                          </div>
                          {questionObject.questionType === 'programming' ?
                            <div className="col-md-12">
                              <div className='row'>
                                <div className='col-6 col-lg-6 col-sm-6 col-xl-6'>
                                  <span>Select Program Structure</span>
                                </div>
                                <div className='col-lg-3 col-sm-3 xol-md-3'>
                                  <div className="form-group">
                                    <span>Manual</span>
                                    <Checkbox checked={this.state.manualStructure} onChange={() => this.selectStructureType('Manual')} />
                                  </div>
                                </div>
                                <div className='col-lg-3 col-sm-3 xol-md-3'>
                                  <div className="form-group">
                                    <span>Generate</span>
                                    <Checkbox checked={this.state.generateStructure} onChange={() => this.selectStructureType('Generate')} />
                                  </div>
                                </div>
                              </div>
                            </div>
                            : null}
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <label className="form-label-select" style={{ marginLeft: '-18px' }}>Question<span className='required'></span></label>
                              <CKEditor
                            editor={ClassicEditor}
                            data=""
                            onReady={editor => {
                              
                              ClassicEditor
                                .create(editor.editing.view.document.getRoot(), {
                                         removePlugins: ['Heading', 'Link', 'CKFinder'],
                                   toolbar: ['bold', 'italic', 'bulletedList', 'numberedList', 'blockQuote']
                                      })
                                    .then(() => {
                                  console.log('Editor is ready to use!', editor);
                                      })
                               .catch(error => {
                                 console.error(error);
                                     });
                            }}
                            onChange={(event, editor) => {
                              const data = editor?.getData();
                              console.log('Typed text:', data);
                              // let val = extractTextFromHtml(data)
                              this.handleChange(data, 'question')
                              console.log(data, "after")
                            }}

                            onBlur={(event, editor) => {
                              console.log('Blur.', editor);
                            }}
                            onFocus={(event, editor) => {
                              console.log('Focus.', editor);
                            }}
                          />
                              <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{this.state.questionError ? this.state.questionErrorMessage : null}</FormHelperText>
                            </Grid>
                            <Grid item xs={6}>
                              <label className="form-label-select" style={{ marginLeft: '-9px' }} >Preview</label>
                              <div className="fs-left-pane" style={{ maxHeight: '310px', height: '310px', overflowY: 'auto', border: '1px solid #d1d1d1' }}>
                                <div className="left-pane-container">
                                  <span className="q-text">Question Preview</span>
                                  <div style={{ padding: '1rem' }} >
                                    <p className="instructions" dangerouslySetInnerHTML={{ __html: questionObject.question }}></p>
                                  </div>
                                </div>
                              </div>
                            </Grid>
                          </Grid>
                          {questionType === 'programming' && this.state.manualStructure ?
                            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                              <Grid item xs={(!this.state.mainClassBoxExpand && !this.state.userFunctionBoxExpand) ? 6 : this.state.mainClassBoxExpand && !this.state.userFunctionBoxExpand ? 9 : 3}>
                                <div className='form-group col-lg-12 col-12 col-sm-12' style={{ height: "calc(100vh - 30px)" }}>
                                  <label className="form-label-select" style={{ marginLeft: '-1.5rem' }}>Main Class <span className='required'></span></label>
                                  <Box sx={{ width: '100%', typography: 'body1', height: '100%' }}>
                                    <TabContext value={this.state.tabName}>
                                      <Box sx={{ borderBottom: 1, borderColor: 'divider' , width: 500}}>
                                        <TabList onChange={this.handleValueChange} variant="fullWidth" aria-label="full width tabs example" textColor="inherit"  indicatorColor="secondary" sx={{"& .MuiTabs-indicator": {backgroundColor: "red", },}} >
                                          <Tab label="Java" value="java"  />
                                          <Tab label="Python" value="python" />
                                          <Tab label="C#" value="c#" />
                                        </TabList>
                                      </Box>
                                      {!this.state.userFunctionBoxExpand ?
                                        <div onClick={() => this.handleExpand('mainClass')} style={{ float: 'right', marginRight: '1.2rem' }}>
                                          <i style={{ cursor: 'pointer' }} className={!this.state.mainClassBoxExpand ? "fa fa-expand" : "fa fa-compress"} aria-hidden="true"></i>
                                        </div> : null}
                                      {_.map(this.tabJson, json => <>
                                        <TabPanel value={json.value} style={{ height: '100%' }}>{this.renderAceEditor(json.key, json.mode)}</TabPanel>
                                      </>)}
                                    </TabContext>
                                  </Box>
                                </div>
                                <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{this.state.error.mainClassError ? this.state.error.mainClassErrorMsg : null}</FormHelperText>
                              </Grid>
                              <Grid item xs={(!this.state.mainClassBoxExpand && !this.state.userFunctionBoxExpand) ? 6 : this.state.userFunctionBoxExpand && !this.state.mainClassBoxExpand ? 9 : 3}>
                                <div className='form-group col-lg-12 col-12 col-sm-12' style={{ height: "calc(100vh - 30px)" }}>
                                  <label className="form-label-select" style={{ marginLeft: '-30px' }}>User Function <span className='required'></span></label>
                                  <Box sx={{ width: '100%', typography: 'body1', height: '100%' }}>
                                    <TabContext value={this.state.tabName}>
                                      <Box sx={{ borderBottom: 1, borderColor: 'divider', width: 500}}>
                                        <TabList onChange={this.handleValueChange} variant="fullWidth" aria-label="full width tabs example" textColor="inherit"  indicatorColor="secondary" sx={{"& .MuiTabs-indicator": {backgroundColor: "red", },}} >
                                          <Tab label="Java" value="java" />
                                          <Tab label="Python" value="python" />
                                          <Tab label="C#" value="c#" />
                                        </TabList>
                                      </Box>
                                      {!this.state.mainClassBoxExpand ?
                                        <div onClick={() => this.handleExpand('userFunction')} style={{ float: 'right', marginRight: '1.2rem' }}>
                                          <i style={{ cursor: 'pointer' }} className={!this.state.userFunctionBoxExpand ? "fa fa-expand" : "fa fa-compress"} aria-hidden="true"></i>
                                        </div> : null}
                                      {_.map(this.userFunction, json => <>
                                        <TabPanel value={json.value} style={{ height: '100%' }}>{this.renderAceEditor(json.key, json.mode)}</TabPanel>
                                      </>)}
                                    </TabContext>
                                  </Box>
                                </div>
                                <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{this.state.error.userClassError ? this.state.error.userClassErrorMsg : null}</FormHelperText>
                              </Grid>
                            </Grid> : null
                          }
                        </div>)}
                      {questionType === 'programming' && this.state.manualStructure ? this.createDynamicInput() : null}
                      {questionType !== 'programming' ? activeStep === 1 && (
                        <div>
                          <div className='row'>
                            {questionType === 'MCQ' ? <div className=" col-6 col-lg-6 col-sm-6 col-xl-6" style={{ marginLeft: '0.25rem' , marginTop:'20px' }}>
                              <label>Options<span className='required'></span></label>
                              <button type="button" data-toggle="tooltip" data-placement="top" title="Add more option" onClick={this.addOption.bind(this)} className="btn btn-outline-primary ml-1 border-0 rounded-circle"><i className="fa fa-plus-circle fa-1x " aria-hidden="true"></i></button>
                              <button type="button" data-toggle="tooltip" data-placement="top" title="Delete option" onClick={this.mcqRemoveOption.bind(this)} className="btn btn-outline-danger ml-1 border-0 rounded-circle"><i className="fa fa-minus-circle fa-1x" aria-hidden="true"></i></button>
                            </div> : null}
                          </div>
                          {(questionType === 'MCQ' || questionType === 'SQL') && this.createDynamicInput()}
                          {questionType !== 'Project' ? <div className='row' style={{ marginLeft: '0.25rem' }}> <div className=" col-6 col-lg-6 col-sm-6 col-xl-6">
                            <div className='row'>
                              <div className=" col-3 col-lg-3 col-sm-3 col-xl-3">
                                <label className="form-label text-input-label">Answer <span className='required'></span></label></div>
                              <div className=" col-9 col-lg-9 col-sm-9 col-xl-9">
                                {questionType === 'Fillups' || 'SQL' ? <textarea name="hint" className="profile-page"
                                  value={questionType === 'SQL' ? questionObject.actualQuery : questionObject.answer}
                                  onChange={(e) => this.handleChange(e, questionType === 'SQL' ? 'actualQuery' : 'answer')}
                                  id="answer" placeholder="Enter the Answer" maxLength="1000" autoComplete="off" style={{ marginTop: '0px', marginBottom: '0px', height: '38px' }}></textarea> :
                                  <select style={{ background: 'none' }} className='profile-page' required
                                    value={questionObject.answer}
                                    onChange={(e) => this.handleChange(e, 'answer')}>
                                    <option hidden selected value="">Select answer</option>
                                    {_.map(this.state.tempOptions, (el) => {
                                      return <option value={el.name}>{el.name}</option>;
                                    })}
                                  </select>}
                              </div></div>
                          </div> <div className="col-6 col-lg-6 col-sm-6 col-xl-6">
                              <div className='row'>
                                <div className="col-3 col-lg-3 col-sm-3 col-xl-3">
                                  <label className="form-label text-input-label">Hint (optional)</label></div>
                                <div className="col-9 col-lg-9 col-sm-9 col-xl-9">
                                  <textarea name="hint" className="profile-page"
                                    value={questionObject.hint}
                                    onChange={(e) => this.handleChange(e, 'hint')}
                                    id="hint" placeholder="Enter the hint" maxLength="1000" autoComplete="off" style={{ marginTop: '0px', marginBottom: '0px', height: '38px' }}></textarea>
                                </div></div></div></div> : null}
                          <div className="col-md-12" style={{display:'flex', marginTop:'20px'}}  >
                            <label for="question"><strong>Status <span className='required'></span></strong></label>
                            <div className="custom-control custom-radio custom-control-inline ml-3 radio" style={{marginLeft:'20px'}}>
                              <input className="custom-control-input" id="active" type="radio" onChange={(e) => this.handleStatusChange(e, "status")}
                                value="ACTIVE" name="status" checked={this.state.status === "ACTIVE" || this.state.status === ""} />
                              <label className="custom-control-label" for="active" style={{marginLeft:'13px'}} >  Active  </label>
                            </div>
                            <div className="custom-control custom-radio custom-control-inline ml-3 radio" style={{marginLeft:'20px'}}>
                              <input className="custom-control-input" id="inactive" type="radio" onChange={(e) => this.handleStatusChange(e, "status")}
                                value="INACTIVE" name="status" checked={this.state.status === "INACTIVE"} />
                              <label className="custom-control-label" for="inactive" style={{marginLeft:'13px'}}  >InActive </label>
                            </div>
                          </div>

                          <div className="mt-4" style={{ display: 'flex', justifyContent: 'flex-end', paddingLeft: '50rem' }}>
                            <div className="col-md-10">
                              <button type="submit" className="btn btn-primary">{action !== null ? 'Update ' : 'Add '} Question</button>
                              <Link className="btn btn-default" to={{ pathname: isRoleValidation() === "TEST_ADMIN" ? "/testadmin/question" : "/admin/questions", state: { difficulty: this.props.location?.state?.difficulty, section: this.props.location?.state?.section, questionType: this.props.location?.state?.questionType, status: this.props.location?.state?.status } }}>Back</Link>
                            </div>
                          </div>

                        </div>
                      ) : activeStep === 1 && questionObject.questionType === 'programming' &&
                      <div>
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                          <Grid item xs={6}>
                            <div>
                              <div className='row'>
                                <div style={{ paddingTop: '30px', paddingBottom: '10px', paddingLeft: '10px' , marginTop:'20px' }}><h5>Code Stub</h5></div>
                              </div>
                              <div className='row' style={{ marginLeft: '8px', marginBottom: '10px' }}>
                                <div className='col-4 col-lg-4 col-sm-4 col-xl-4'>
                                  <label>Function Name<span className='required' /></label>
                                </div>
                                <div className='col-3 col-lg-3 col-sm-3 col-xl-3'>
                                  <div>
                                    <input className="profile-page" value={questionObject.methodName} onChange={(e) => this.handleChange(e, 'methodName')} />
                                    <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{this.state.functionNameError ? this.state.functionNameErrorMsg : null}</FormHelperText>
                                  </div>
                                </div>
                              </div>
                              <div className='row' style={{ marginLeft: '8px', marginBottom: '10px' }}>
                                <div className='col-4 col-lg-4 col-sm-4 col-xl-4'>
                                  <label>Return Type<span className='required' /></label>
                                </div>
                                <div className='col-3 col-lg-3 col-sm-3 col-xl-3'>
                                  <div>
                                    <select className='profile-page' required style={{ background: 'none' }}
                                      value={this.state.returnType}
                                      onChange={(e) => this.setProgramStub(e, 'returnType')}>
                                      <option hidden selected value="">Select Return Type</option>
                                      {_.map(this.state.dataTypes, (key, value) => {
                                        return <option value={key}>{key}</option>
                                      })}
                                    </select>
                                    <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{this.state.returnTypeError ? this.state.returnTypeErrorMsg : null}</FormHelperText>
                                  </div>
                                </div>
                              </div>
                              <div className='row' style={{ marginLeft: '8px', marginBottom: '10px' }}>
                                <div className='col-5 col-lg-5 col-sm-5 col-xl-5'>
                                  <div>
                                    <label>Function Parameter<span className='required' /></label>
                                    <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{this.state.parameterError ? this.state.parameterErrorMsg : null}</FormHelperText>
                                  </div>
                                </div>
                                <div className='col-3 col-lg-3 col-sm-3 col-xl-3'>
                                  <button type='button' className="btn btn-primary" onClick={this.addParameter.bind(this)}>Add</button>
                                </div>
                              </div>
                              {this.createDynamicAddingData()}
                              <div className='row' style={{ marginLeft: '10px', marginBottom: '10px' }}>
                                <div className='col-6 col-lg-6 col-sm-6 col-xl-6'>
                                  <button type='button' className="btn btn-primary" onClick={() => this.generateProgramCode()}>Generate Code</button>
                                </div>
                              </div>
                            </div>
                          </Grid>
                          <Grid item xs={6}>
                            <div className='form-group col-lg-12 col-12 col-sm-12' style={{ height: "calc(100vh - 20vh)" }}>
                              <label className="form-label-select" style={{ marginLeft: '-30px' }}>Code</label>
                              <Box sx={{ width: '100%', typography: 'body1', height: '100%' }}>
                                <TabContext value={this.state.tabName}>
                                  <Box sx={{ borderBottom: 1, borderColor: 'divider' , width: 500  }}>
                                    <TabList onChange={this.handleValueChange} variant="fullWidth" aria-label="full width tabs example" textColor="inherit"  indicatorColor="secondary" sx={{"& .MuiTabs-indicator": {backgroundColor: "red", },}}  >
                                      <Tab label="Java" value="java" />
                                      <Tab label="Python" value="python" />
                                      <Tab label="C#" value="c#" />
                                    </TabList>
                                  </Box>
                                  {_.map(this.userFunction, json => <>
                                    <TabPanel value={json.value} style={{ height: '100%' }}>{this.renderAceEditor(json.key, json.mode)}</TabPanel>
                                  </>)}
                                </TabContext>
                              </Box>
                              <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{this.state.questionError ? this.state.questionErrorMessage : null}</FormHelperText>
                            </div>
                          </Grid>
                        </Grid></div>}
                      {activeStep === 2 && (<div><div className='row'>
                        <div className=" col-6 col-lg-6 col-sm-6 col-xl-6" >
                          <div>
                            <label style={{marginTop:'20px'}}>Add TestCase<span className='required'></span></label>
                            <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{this.state.testCaseError ? this.state.testCaseErrorMsg : null}</FormHelperText>
                          </div>
                        </div>
                      </div>
                      <DataGrid
                          columns={[
                            {
                              field: 'testCase', headerName: 'TestCase', flex: 1, editable: false ,headerClassName:'data-head'
                            },
                            ...this.state.parameters.map(p => ({ field: p.name, headerName: p.name, flex: 1, headerClassName:'data-head',editable: true,sortable:false,
                            valueFormatter: (params) => params.value ? params.value : 'Enter param value', 
                            renderEditCell: (params) => <EditTextarea {...params}/> })),
                            {
                              field: 'output', headerName: 'Output', flex: 1, headerClassName:'data-head', 
                              editable: true,
                              sortable:false,
                              valueFormatter:(params) =>  params.value ? params.value :'Enter value',
                              renderEditCell:(params) => <EditTextarea {...params}/>
                            },                            
                          ]}
                           sx={{marginTop:'10px'}}
                          style={{color:'#3b489e!important'}}
                          rows={_.map(this.state.testCase,(t, index) => ({
                            id: index,
                            testCase: `TestCase ${index + 1}`,
                            ...t.values,
                            output: t.output,
                          }))}

                          autoHeight={true}
                          disableSelectionOnClick
                          editable
                          hideFooter={true}
                          onCellKeyDown={this.handleCellKeyDown}
                          onEditCellPropsChange={this.handleTestCaseChange}
                          hideFooterPagination={true}
                          hideFooterRowCount={true}
                          disableColumnMenu={true}
                        />
                      </div>)}
                      {questionType === 'programming' && this.state.manualStructure ?
                        <>
                          <div className='row'> <div className=" col-6 col-lg-6 col-sm-6 col-xl-6">
                            <div className='row'>
                              <div className="col-3 col-lg-3 col-sm-3 col-xl-3">
                                <label className="form-label text-input-label"><b>Main class Name <span className='required'></span></b></label></div>
                              <div className="col-9 col-lg-9 col-sm-9 col-xl-9">
                                <input className="profile-page"
                                  value={questionObject.mainClassName}
                                  onChange={(e) => this.handleChange(e, 'mainClassName')}
                                  id="hint" placeholder="Enter the class name" maxlength="30" autocomplete="off" style={{ marginTop: '0px', marginBottom: '0px', height: '38px' }} /></div>
                              <FormHelperText className="helper" style={{ paddingLeft: "10px" }}>{this.state.error.mainClassName ? this.state.error.mainClassNameErrorMsg : null}</FormHelperText>
                            </div></div></div>
                        </>
                        : null}
                      {activeStep === 3 || (this.state.manualStructure && questionObject.questionType === 'programming') ? (<div>
                        <Grid container spacing={2} style={{ marginBottom: '1rem' ,marginTop:'15px' }}>
                          {_.map([{ key: "programmingHint", name: "Hint" }, { key: "pseudoCode", name: "Pseudocode" }], item => {
                            return <Grid item xs={6}>
                              <label className="form-label-select" style={{ marginLeft: '-9px' }} >{item.name}</label>
                              <TextareaAutosize minRows={10} maxRows={10} style={{ width: '100%', padding: '.7rem', backgroundColor: '#F8F8F8', borderColor: '#d1d1d1' }} onChange={(e) => this.handleHintChange(e, item.key)} value={this.state.questionObject[item.key]} />
                            </Grid>
                          })}
                        </Grid>
                        <div className="col-md-12" style={{display:'flex' , alignItems:'center'}} >
                          <label for="question"><strong>Status <span className='required'></span></strong></label>
                          <div className="custom-control custom-radio custom-control-inline ml-3 radio" style={{marginLeft:'18px'}}>
                            <input className="custom-control-input" id="active" type="radio" onChange={(e) => this.handleStatusChange(e, "status")}
                              value="ACTIVE" name="status" checked={this.state.status === "ACTIVE" || this.state.status === ""} />
                            <label className="custom-control-label" for="active" style={{marginLeft:'10px'}}  >  Active  </label>
                          </div>
                          <div className="custom-control custom-radio custom-control-inline ml-3 radio" style={{marginLeft:'25px'}} >
                            <input className="custom-control-input" id="inactive" type="radio" onChange={(e) => this.handleStatusChange(e, "status")}
                              value="INACTIVE" name="status" checked={this.state.status === "INACTIVE"} />
                            <label className="custom-control-label" for="inactive" style={{marginLeft:'10px'}} >InActive </label>
                          </div>
                        </div>
                        <div className="mt-4" style={{ display: 'flex', justifyContent: 'flex-end', paddingLeft: '50rem' }}>
                          <div className="col-md-10">
                            <button type="submit" className="btn btn-primary">{action !== null ? 'Update ' : 'Add '} Question</button>
                            <Link className="btn btn-default" to={{ pathname: isRoleValidation() === "TEST_ADMIN" ? "/testadmin/question" : "/admin/questions", state: { difficulty: this.props.location?.state?.difficulty, section: this.props.location?.state?.section, questionType: this.props.location?.state?.questionType, status: this.props.location?.state?.status } }}>Back</Link>
                          </div>
                        </div>
                      </div>) : null}
                      {questionType === 'programming' && this.state.manualStructure ? null :
                        <>
                          <Button disabled={activeStep === 0} onClick={this.handleBack} style={{ marginTop: '1rem' }}>Back</Button>
                          <Button variant="contained" color="primary" disabled={questionObject?.questionType === 'programming' ? activeStep === 3 : activeStep === 1} style={{ marginTop: '1rem' }} onClick={this.handleNext}>Next</Button>
                        </>
                      }
                    </form>
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


export default withLocation(AddQuestion);