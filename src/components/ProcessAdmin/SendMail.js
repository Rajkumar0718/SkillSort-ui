import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import FormHelperText from '@mui/material/FormHelperText';
import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { authHeader, errorHandler } from '../../api/Api';
import CustomDatePick from '../../common/CustomDatePick';
import { toastMessage, withLocation } from '../../utils/CommonUtils';
import url from '../../utils/UrlConstant';
import { isEmpty } from '../../utils/Validation';
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

class SendMail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      panalists: [],
      mail: {
        candidate: this.props.location?.state?.candidate,
        skillSortId: this.props.location?.state?.skillSortId,
        jobDescription: localStorage.getItem("jobDescription"),
        panalists: [],
        panelist: {},
        link: '',
        duration: '',
        startDate: new Date(),
        candidateInstruction: '',
        skillsortInstruction: '',
        subject: '',
      },
      error: {
        candidateInstruction: false,
        candidateInstructionMsg: '',
        skillsortInstruction: false,
        skillsortInstructionMsg: '',
        subject: false,
        emailSubjectMsg: '',
        panelist: false,
        panalistMsg: '',
        link: false,
        linkMsg: ''
      }
    }
  }

  componentDidMount() {
    axios.get(` /api1/recruiter/list/interview?statusType=ACTIVE&verifiedStatus=VERIFIED`, { headers: authHeader() })
      .then(res => {
        this.setState({ panalists: res.data.response });
        console.log(res.data.response, "dsvfjshdfbhdf")
      }).catch(error => {
        errorHandler(error);
      })
  }

  handlePanalistChange = (e) => {
    const mail = this.state.mail;
    mail.panelist = this.state.panalists[e.target.value];
    this.setState({ mail: mail });
  }

  handleDateChange = (date) => {
    const mail = this.state.mail;
    mail.startDate = date;
    this.setState({ mail: mail });
  }

  handleChange = (event, key) => {
    const error = this.state.error;
    error[key] = false
    const mail = this.state.mail
    if (key === 'candidateInstruction' || key === 'skillsortInstruction') {
      mail[key] = event;
    } else {

      mail[key] = event.target.value;
    }
    this.setState({ mail: mail, error: error });
  }

  handleSubmit = (event) => {
    const error = this.state.error;
    if (Object.keys(this.state.mail.panelist).length === 0) {
      error.panelist = true;
      error.panalistMsg = "Please Select The Panalist!";
      this.setState({ error })
    } else {
      error.panelist = false;
      this.setState({ error })
    }
    if (isEmpty(this.state.mail.link)) {
      error.link = true;
      error.linkMsg = "Field Required!";
      this.setState({ error })
    } else {
      error.link = false;
      this.setState({ error })
    }
    if (isEmpty(this.state.mail.skillsortInstruction)) {
      error.skillsortInstruction = true;
      error.skillsortInstructionMsg = "Field Required!";
      this.setState({ error })
    } else {
      error.skillsortInstruction = false;
      this.setState({ error })
    }
    if (isEmpty(this.state.mail.candidateInstruction)) {
      error.candidateInstruction = true;
      error.candidateInstructionMsg = "Field Required!";
      this.setState({ error })
    } else {
      error.candidateInstruction = false;
      this.setState({ error })
    }
    if (isEmpty(this.state.mail.subject)) {
      error.subject = true;
      error.emailSubjectMsg = "Field Required!";
      this.setState({ error })
    } else {
      error.subject = false;
      this.setState({ error })
    }
    if (!error.candidateInstruction && !error.skillsortInstruction && !error.subject && !error.link && !error.panelist) {
      axios.post(` ${url.ADMIN_API}/superadmin/skillsort/sendmail`, this.state.mail, { headers: authHeader() })
        .then(res => {
          toastMessage('success', res.data.message);
          this.props.navigate('/processadmin/company/test/candidate');
        })
        .catch(error => {
          errorHandler(error);
        })
    }
  }

  render() {
    return (
      <main className="main-content bcg-clr">
        <div className="container-fluid">
          <div className="card-header-new">
            <span>
              Send Mail
            </span>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="table-border-process">
                <div className="row">
                  <div className=" col-6 col-lg-6 col-sm-6 col-xl-6">
                    <div className="row">
                      <div className="col-lg-4 col-4 col-sm-4 col-xl-4">
                        <label className="form-label text-input-label">Candidate Name<span style={{ color: 'red' }}>*</span></label></div>
                      <div className="col-lg-8 col-8 col-sm-8 col-xl-8">
                        <input className='profile-page' value={this.state?.mail?.candidate?.firstName + ' ' + this.state.mail.candidate.lastName} type='text' maxLength="50" readOnly />
                      </div>
                    </div>
                  </div>
                  <div className=" col-6 col-lg-6 col-sm-6 col-xl-6">
                    <div className='row'>
                      <div className="col-lg-4 col-4 col-sm-4 col-xl-4">
                        <label className="form-label text-input-label">Panalist<span style={{ color: 'red' }}>*</span></label></div>
                      <div className="col-lg-8 col-8 col-sm-8 col-xl-8">
                        <select className='profile-page' name='setting'
                          onChange={(e) => this.handlePanalistChange(e)}>
                          <option hidden selected value="">Select Panalist</option>
                          {(this.state.panalists || []).map((panelist, index) => {
                            return <option value={index}>{panelist.userName}</option>
                          })}
                        </select>
                        <FormHelperText className="helper " style={{ paddingLeft: '0px', marginTop: '5px' }}>{this.state.error.panelist ? this.state.error.panalistMsg : null}</FormHelperText>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='row'>
                  <div className=" col-6 col-lg-6 col-sm-6 col-xl-6">
                    <div className='row'>
                      <div className="col-lg-4 col-4 col-sm-4 col-xl-4">
                        <label className="form-label text-input-label">Interview Date<span style={{ color: 'red' }}>*</span></label></div>
                      <div className="col-lg-8 col-8 col-sm-8 col-xl-8">
                        <CustomDatePick
                          onChange={this.handleDateChange}
                          value={this.state.mail.startDate}
                          objectKey='startDate'
                          minDate={this.state.position?.startDate}
                          maxDate={this.state.position?.endDate}
                          required='true'
                          format={'MMMM dd yyyy, h:mm aa'}
                        />
                      </div>
                    </div>
                  </div>
                  <div className=" col-6 col-lg-6 col-sm-6 col-xl-6">
                    <div className='row'>
                      <div className="col-lg-4 col-4 col-sm-4 col-xl-4">
                        <label className="form-label text-input-label">Email Subject<span style={{ color: 'red' }}>*</span></label></div>
                      <div className="col-lg-8 col-8 col-sm-8 col-xl-8">
                        <input className='profile-page' onChange={(e) => this.handleChange(e, 'subject')} type='text' maxLength="100" />
                        <FormHelperText className="helper " style={{ paddingLeft: '0px', marginTop: '5px' }}>{this.state.error.subject ? this.state.error.emailSubjectMsg : null}</FormHelperText>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='row'>
                  <div className=" col-6 col-lg-6 col-sm-6 col-xl-6">
                    <div className='row'>
                      <div className="col-lg-4 col-4 col-sm-4 col-xl-4">
                        <label className="form-label text-input-label">Interview Link<span style={{ color: 'red' }}>*</span></label></div>
                      <div className="col-lg-8 col-8 col-sm-8 col-xl-8">
                        <input className='profile-page' onChange={(e) => this.handleChange(e, 'link')} type='text' />
                        <FormHelperText className="helper" style={{ paddingLeft: '0px', marginTop: '5px' }}>{this.state.error.link ? this.state.error.linkMsg : null}</FormHelperText></div>
                    </div>
                  </div>
                </div>
                <div className='form-group col-12'>
                  <div style={{ margin: '0px 0px 0px -3px' }}>
                    <label for="question">Candidate Instruction<span style={{ color: 'red' }}>*</span></label>
                    <StyledCKEditorWrapper>
                      <CKEditor
                        editor={ClassicEditor}
                        data={this.state.mail.candidateInstruction}
                        onReady={editor => {
                          ClassicEditor
                            .create(editor.editing.view.document.getRoot(), {
                              removePlugins: ['Heading', 'Link', 'CKFinder'],
                              toolbar: ['bold', 'italic', 'bulletedList', 'numberedList', 'blockQuote'],
                            })
                            .then(() => {
                              console.log('Editor is ready to use!', editor);
                            })
                            .catch(error => {
                              console.error(error);
                            });
                        }}
                        onChange={(event, editor) => {
                          this.handleChange(editor.getData(), 'candidateInstruction')
                        }}
                        onBlur={(event, editor) => {
                          console.log('Blur.', editor);
                        }}
                        onFocus={(event, editor) => {
                          console.log('Focus.', editor);
                        }}
                      />
                    </StyledCKEditorWrapper>
                    <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{this.state.error.candidateInstruction ? this.state.error.candidateInstructionMsg : null}</FormHelperText>
                  </div>
                </div>
                <div className='form-group col-12'>
                  <div style={{ margin: '0px 0px 0px -3px' }}>
                    <label for="question">Panlist Instruction<span style={{ color: 'red' }}>*</span></label>
                    <StyledCKEditorWrapper>
                      <CKEditor
                        editor={ClassicEditor}
                        data={this.state.mail.skillsortInstruction}
                        onReady={editor => {

                          ClassicEditor
                            .create(editor.editing.view.document.getRoot(), {
                              removePlugins: ['Heading', 'Link', 'CKFinder'],
                              toolbar: ['bold', 'italic', 'bulletedList', 'numberedList', 'blockQuote'],
                            })
                            .then(() => {
                              console.log('Editor is ready to use!', editor);
                            })
                            .catch(error => {
                              console.error(error);
                            });
                        }}

                        onChange={(event ,editor) => {
                          this.handleChange(editor.getData(), 'skillsortInstruction')

                        }}

                        onBlur={(event, editor) => {
                          console.log('Blur.', editor);
                        }}
                        onFocus={(event, editor) => {
                          console.log('Focus.', editor);
                        }}
                      />
                    </StyledCKEditorWrapper>
                    <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{this.state.error.skillsortInstruction ? this.state.error.skillsortInstructionMsg : null}</FormHelperText>
                  </div>
                </div>
                <div style={{ float: 'right', position: 'relative', bottom: '2rem' }}>
                  <button type="submit" onClick={() => this.handleSubmit()} className="btn btn-primary">Send Email</button>
                  <Link className="btn btn-default" to="/processadmin/company/test/candidate">Cancel</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default withLocation(SendMail)