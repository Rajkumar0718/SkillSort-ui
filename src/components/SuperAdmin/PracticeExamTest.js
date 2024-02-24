import { Checkbox } from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';
import axios from 'axios';
import _ from "lodash";
import React, { Component } from 'react';
import { authHeader, errorHandler } from '../../api/Api';
import { toastMessage, withLocation } from '../../utils/CommonUtils';
import url from '../../utils/UrlConstant';
import { isEmpty, isRoleValidation } from '../../utils/Validation';
import AddSectionModal from '../TestAdmin/AddSectionModal';
import AutoComplete from '../../common/AutoComplete';
import StatusRadioButton from '../../common/StatusRadioButton';
import styled from 'styled-components';
import CkEditor from '../../common/CkEditor';



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
class PracticeExamTest extends Component {
  constructor(props) {
    super(props);
    const user = JSON.parse(localStorage.getItem("user"));
    this.state = {
      companyId: user.companyId,
      name: '',
      duration: '',
      programmingDuration: '',
      sqlDuration: '',
      totalQuestions: 0,
      startDateTime: new Date(),
      status: 'ACTIVE',
      examSubmitMessage: '',
      candidateInstruction: '',
      selectedGroup: '',
      tabsArray: [],
      categories: [],
      sections: [],
      groupQuestionType: ['MCQ', 'programming', 'SQL'],
      displayOrder: 0,
      error: {
        easyStatus: false,
        easyMsg: '',
        mediumStatus: false,
        mediumMsg: '',
        hardStatus: false,
        hardMsg: '',
        duration: false,
        durationMsg: '',
        name: false,
        examNameMsg: '',
        candidateInstruction: false,
        candidateInstructionMsg: '',
        examSubmitMessage: false,
        examSubmitMessageMsg: '',
        programmingDuration: false,
        programmingDurationMsg: '',
        sqlDuration: false,
        sqlDurationMsg: '',
        selectedGroup: false,
        selectedGroupMsg: '',
        displayOrder: false,
        displayOrderMsg: ''
      }
    }
  }
  componentDidMount() {
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

  getQuestionCount = () => {
    axios.get(`${url.ADMIN_API}/question/getQuestionCountByGroup?groupType=${this.state.selectedGroup}&questionType=${this.state.groupQuestionType}`, { headers: authHeader() })
      .then(res => {
        this.setState({
          sections: res.data.response
        })
      }).catch(error => {
        errorHandler(error)
      })
  }

  setCategories = (questonType) => {
    return {
      sectionName: '',
      groupType: this.state.selectedGroup,
      groupQuestionType: questonType,
      easyStatus: false,
      mediumStatus: false,
      hardStatus: false
    };
  }

  editorOnChange = (event, editor) => {
    this.setState({ candidateInstruction: editor.getData() })
  }

  editorTestSubmitOnChange = (newData) => {
    this.setState({ examSubmitMessage:newData })
  }

  handleChange = (event, key) => {
    if (key === "name" || key === "duration" || key === "level") {
      const { error } = this.state;
      error[key] = false
    }

    this.setState({ [key]: event.target.value })
  }

  handleTabs = (event, key) => {
    const { categories } = this.state;
    const existQtType = categories.find(c => c.groupQuestionType === key)
    if (existQtType) {
      _.remove(categories, c => c.groupQuestionType === key)
      this.setState({ categories: categories })
    }
    else {
      const cat = this.setCategories(key);
      categories.push(cat)
      this.setState({ categories: categories })
    }
  }

  handleGroupType = (value) => {
    console.log(value, "value");
    this.setState({ selectedGroup: value?.name }, () => {
      this.getQuestionCount();
      this.handleClearDuration()
    });

  }

  handleClearDuration = () => {
    if (isEmpty(this.state.selectedGroup)) {
      this.setState({
        duration: '',
        programmingDuration: '',
        sqlDuration: ''
      })
    }
  }
  handleSubmit = (event) => {
    const { error } = this.state;
    const mcq = this.state.categories.find(c => c.groupQuestionType === 'MCQ')
    const programming = this.state.categories.find(c => c.groupQuestionType === 'programming')
    const sql = this.state.categories.find(c => c.groupQuestionType === 'sql')
    if (isEmpty(this.state.name)) {
      error.name = true;
      error.examNameMsg = "Field Required !";
      this.setState({ error })
    } else {
      error.name = false;
      this.setState({ error })
    }

    if ((isEmpty(this.state.duration) || this.state.duration === 0) && mcq) {
      error.duration = true;
      error.durationMsg = "Field Required !";
      this.setState({ error })
    } else {
      error.duration = false;
      this.setState({ error })
    }

    if (isEmpty(this.state.displayOrder) || this.state.displayOrder <= 0) {
      error.displayOrder = true;
      error.displayOrderMsg = this.state.displayOrder <= 0 ? "Display order ought to be higher than 0 !" : "Field Required !";
      this.setState({ error })
    } else {
      error.displayOrder = false;
      this.setState({ error })
    }

    if (isEmpty(this.state.selectedGroup)) {
      error.selectedGroup = true;
      error.selectedGroupMsg = "Field Required !";
      this.setState({ error })
    } else {
      error.selectedGroup = false;
      this.setState({ error })
    }

    if ((isEmpty(this.state.programmingDuration) || this.state.programmingDuration === 0) && programming) {
      error.programmingDuration = true;
      error.programmingDurationMsg = "Field Required !";
      this.setState({ error })
    } else {
      error.programmingDuration = false;
      this.setState({ error })
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

    if ((isEmpty(this.state.sqlDuration) || this.state.sqlDuration === 0) && sql) {
      error.sqlDuration = true;
      error.sqlDurationMsg = "Field Required !";
      this.setState({ error })
    } else {
      error.sqlDuration = false;
      this.setState({ error })
    }

    event.preventDefault();
    if (!error.duration && !error.programmingDuration && !error.name && !error.displayOrder && !error.selectedGroup
      && !error.candidateInstruction && !error.examSubmitMessage && !error.sqlDuration) {
      this.saveExam()
    }
  }

  saveExam = () => {

    axios.post(`${url.COLLEGE_API}/practiceExam`, this.state, { headers: authHeader() })
      .then(() => {
        if (this.props.location.pathname.indexOf('view') > -1) {
          toastMessage('success', 'Test Details Updated Successfully..!');
          (isRoleValidation() === "SUPER_ADMIN" &&
            this.props.navigate('/settings/practiceExam'))

        } else {
          toastMessage('success', 'Test Added Successfully..!');
          (isRoleValidation() === "SUPER_ADMIN" &&
            this.props.navigate('/settings/practiceExam'))


        }
      }).catch(error => {
        errorHandler(error);
      })
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

    }
  }

  onCloseModal = () => {
    this.setState({ openModal: !this.state.openModal });
    this.getGroupType()
  }

  componentWillMount() {
    if (this.props.location.pathname.indexOf('view') > -1) {
      const { practiceExam } = this.props.location.state
      this.setState({
        categories: practiceExam.categories,
        name: practiceExam.name,
        candidateInstruction: practiceExam.candidateInstruction,
        examSubmitMessage: practiceExam.examSubmitMessage,
        duration: practiceExam.duration,
        status: practiceExam.status,
        programmingDuration: practiceExam.programmingDuration,
        selectedGroup: practiceExam.categories[0].groupType,
        id: practiceExam.id,
        sqlDuration: practiceExam.sqlDuration,
        displayOrder: practiceExam.displayOrder
      })

    }
  }

  disableCheckBox = (key) => {
    const section = this.state.sections.find(s => s.groupQuestionType === key)
    return section?.totalInSection === 0;
  }
   handleEditorChange = (newData) => {
    this.setState({ candidateInstruction: newData })

  };
  render() {
    let action = null;
    if (this.props.location.pathname.indexOf('view') > -1) {
      action = this.props.location.state;
    }
    return (
      <>
        {this.state.openModal ? <AddSectionModal type={'Group'} modalSection={{ action: 'Add' }} onCloseModalAdd={this.onCloseModal} /> : ''}

        <main className="main-content bcg-clr">
          <div>
            <div className="container-fluid cf-1">
              <div className="card-header-new">
                <span>
                  {action ? 'View' : 'Add'} PracticeExam
                </span>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="table-border-cr">
                    <div className="form-row">
                      <div className="row">
                        <form onSubmit={this.handleSubmit}>
                          <div className="row" style={{ lineHeight: '3' }}>
                            <div className="col-md-6">
                              <div className="form-group">
                                <label className="form-label-row"><b>Name</b><span style={{ color: 'red' }}>*</span></label>
                                {!action ? <input style={{ display: "block", padding: ".4rem .75rem", border: "1px solid #ced4da", marginLeft: "2.2rem", lineHeight: "1", width: "350px", fontSize: "0.875rem" }} value={this.state.name} type='text' maxLength="50" onChange={(e) => this.handleChange(e, 'name')} placeholder='Name' /> : <input style={{ display: "block", padding: ".4rem .75rem", border: "1px solid #ced4da", marginLeft: "2.2rem", lineHeight: "1", width: "350px", fontSize: "0.875rem" }} value={this.state.name} type='text' maxLength="50" ></input>}
                                {this.state.error.name && <FormHelperText className="helper" style={{ paddingLeft: "35px" }}>{this.state.error.examNameMsg}</FormHelperText>}
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <label className="form-label-row"><b>Display Order</b><span style={{ color: 'red' }}>*</span></label>
                                <input style={{ display: "block", padding: ".4rem .75rem", border: "1px solid #ced4da", marginLeft: "2.2rem", lineHeight: "1", width: "350px", fontSize: "0.875rem" }} value={this.state.displayOrder} type='number' onChange={(e) => this.handleChange(e, 'displayOrder')} placeholder='displayOrder' />
                                {this.state.error.displayOrder && <FormHelperText className="helper" style={{ paddingLeft: "35px" }}>{this.state.error.displayOrderMsg}</FormHelperText>}
                              </div>
                            </div>
                            {!action ? <label className="form-label-row"><b>GroupType</b><span style={{ color: 'red' }}>*</span></label> : null}
                            {!action ? <div className='form-group col-12' >
                              <div className=" form-group col-12" >
                                <div style={{ display: 'flex' }}>
                                  <button type="button" onClick={this.onClickOpenModel} style={{ marginTop: '-5px', width: '40px', height: '40px' }} data-toggle="tooltip" data-placement="top" title="Add GroupType" className="btn btn-outline-primary ml-1 border-0 rounded-circle"><i className="fa fa-plus-circle fa-1x " aria-hidden="true"></i></button>
                                  <div >
                                    <AutoComplete
                                      displayLabel={"Select GroupType"}
                                      width={250}
                                      value={this.state.selectedGroup}
                                      isObject={true}
                                      selectExam={this.handleGroupType}
                                      data={this.state.groupTypes}
                                      displayValue={"name"}>
                                    </AutoComplete>
                                    {this.state.error.selectedGroup && <FormHelperText className="helper" style={{ paddingLeft: "35px" }}>{this.state.error.selectedGroupMsg}</FormHelperText>}
                                  </div>
                                </div>
                              </div></div> : <div className='form-group col-12' style={{ left: '0rem' }}>
                              <label className="form-label-row"><b>Selected GroupType</b></label>
                              <div style={{ marginLeft: "4rem" }}>
                                <span className="ml-1"><li>{this.state.selectedGroup}</li></span>
                              </div>
                            </div>}

                            {this.state.selectedGroup && !action ? <div className="col-md-12" style={{ paddingLeft: "2.5rem" }}>
                              <div className='row'>
                                <div className='mT-col-lg-5 col-sm-5 xol-md-5'>
                                  <span>Select Question Type</span>

                                </div>
                                <div className='col-lg-2 col-sm-2 xol-md-2'>
                                  <div className="form-group">
                                    <span>MCQ</span>
                                    <Checkbox disabled={this.disableCheckBox('MCQ')} onChange={(e) => this.handleTabs(e, 'MCQ')} />
                                  </div>
                                </div>
                                <div className='col-lg-3 col-sm-3 xol-md-3'>
                                  <div className="form-group">
                                    <span>Programing</span>
                                    <Checkbox disabled={this.disableCheckBox('programming')} onChange={(e) => this.handleTabs(e, 'programming')} />
                                  </div>
                                </div>
                                <div className='col-lg-2 col-sm-2 xol-md-2'>
                                  <div className="form-group">
                                    <span>SQL</span>
                                    <Checkbox disabled={this.disableCheckBox('SQL')} onChange={(e) => this.handleTabs(e, 'SQL')} />
                                  </div>
                                </div>
                              </div>
                            </div> : ''}
                            {this.state.selectedGroup ? <>{this.state.categories.find(q => q.groupQuestionType === 'MCQ') ?
                              <div className="col-md-6">
                                <div className="form-group">
                                  <label className="form-label-row"><b>MCQ Duration </b><span style={{ color: 'red' }}>*</span></label>
                                  {<input className='form-control-row col-7' value={this.state.duration} type='number' max="480" onChange={(e) => this.handleChange(e, 'duration')} placeholder='Duration (In minutes)' />}
                                  <FormHelperText className="helper" style={{ paddingLeft: "35px" }}>{this.state.error.duration ? this.state.error.durationMsg : null}</FormHelperText>
                                </div>
                              </div> : ""}
                              <div className="col-md-6">
                                {this.state.categories.length > 1 || this.state.categories.find(q => q.groupQuestionType === 'programming') ?
                                  <div className="form-group">
                                    <label className="form-label-row"><b>Programming Duration</b><span style={{ color: 'red' }}>*</span></label>
                                    {<input className='form-control-row col-7' value={this.state.programmingDuration} type='number' max="480" onChange={(e) => this.handleChange(e, 'programmingDuration')} placeholder='Duration (In minutes)' />}
                                    <FormHelperText className="helper" style={{ paddingLeft: "35px" }}>{this.state.error.programmingDuration ? this.state.error.programmingDurationMsg : null}</FormHelperText>
                                  </div>
                                  : this.state.categories.find(q => q.groupQuestionType === 'SQL') ?
                                    <div className="form-group">
                                      <label className="form-label-row"><b>SQL Duration</b><span style={{ color: 'red' }}>*</span></label>
                                      {<input className='form-control-row col-7' value={this.state.sqlDuration} type='number' max="480" onChange={(e) => this.handleChange(e, 'sqlDuration')} placeholder='Duration (In minutes)' />}
                                      <FormHelperText className="helper" style={{ paddingLeft: "35px" }}>{this.state.error.sqlDuration ? this.state.error.sqlDurationMsg : null}</FormHelperText>
                                    </div> : ''}
                              </div></> : ''}
                            <div className="form-group col-12">
                              <FormHelperText className="helper" style={{ paddingLeft: "60px" }}>{this.state.errormessage}</FormHelperText>
                            </div>
                            <div className='form-group col-12'>
                              <div className="mT-30">
                                <label for="question"><b>Candidate Instruction </b><span style={{ color: 'red' }}>*</span></label>
                                <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{this.state.error.candidateInstruction ? this.state.error.candidateInstructionMsg : null}</FormHelperText>
                                <StyledCKEditorWrapper>
                                  <CkEditor  data={this.state.candidateInstruction} onChange={this.handleEditorChange}/>
                                </StyledCKEditorWrapper>
                              </div>
                            </div>
                            <div className='form-group col-12' style={{marginTop:'-5rem'}}>
                              <div className="mT-30">
                                <label for="question"><b>Test Submit Message </b><span style={{ color: 'red' }}>*</span></label>
                                <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{this.state.error.examSubmitMessage ? this.state.error.examSubmitMessageMsg : null}</FormHelperText>
                                <StyledCKEditorWrapper>
                                <CkEditor  data={this.state.examSubmitMessage} onChange={this.editorTestSubmitOnChange}/>
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

                          {action ? <div style={{ marginLeft: '85%' }}>
                            <button disabled={this.state.countError} type="submit" className="btn btn-sm btn-prev">Update</button>
                          </div> : <div style={{ marginLeft: '85%' }}>
                            <button disabled={this.state.countError} type="submit" className="btn btn-sm btn-prev" style={{ marginTop: "-4rem" }}>ADD</button>
                          </div>}
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
    )
  }
}

export default withLocation(PracticeExamTest)
