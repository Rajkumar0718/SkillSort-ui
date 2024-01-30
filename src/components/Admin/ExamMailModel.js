import axios from 'axios';
import { saveAs } from 'file-saver';
import _ from 'lodash';
import React, { Component } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { authHeader, errorHandler, logOut } from '../../api/Api';
import { fallBackLoader, toastMessage } from '../../utils/CommonUtils';
import { url } from '../../utils/UrlConstant';
export default class ExamMailModel extends Component {
  state = {
    loader: false,
    validMailButton: false,
    id: '',
    mailMsg: '',
    selectedFile: null,
    validUploadButton: true,
    shortListedCandidates:[],
    csvImportObject: {
      section: '',
      questionType: '',
      difficulty: "",
      examType: '',
      mailOpenModal: false,
      mailModalSection: "",
    },
    questionType: ['MCQ', 'True/False', 'programming'],
    examType: ['MOCK', 'ACTUAL']
  }

  componentWillMount() {
    if (this.props.modalSection.type === "Question") {
      return null;
    }
    if (this.props.modalSection.type === "Email") {
      if(this.props.mailModalSection?.exam){
        this.setState({ mailMsg: this.props.mailModalSection?.exam?.message });
      }
      else this.getExam(this.props.examId)
    }
    if(this.props.shortListedCandidates){
      this.setState({shortListedCandidates:this.props.shortListedCandidates})
    }
  }

  getExam =  (examId) => {
		axios.get(`${url.CANDIDATE_API}/candidate/exam/instruction?examId=${examId}`, { headers: authHeader() }
		).then(res =>{
			const exam = res.data.response
      this.setState({ mailMsg: exam.message,exam:exam});
		})
		  .catch(() => toastMessage('error', 'Error while fetching exam'))
	  }

  sendExamLink = (data) => {
    data.message = this.state.mailMsg;
    data.positionId = this.props.positionId;
    this.setState({ validMailButton: true, loader: true });
    let formData = new FormData();
    formData.append("file",this.state.selectedFile)
    formData.append("exam",JSON.stringify(data))
    formData.append("candidateEmails",_.map(this.state.shortListedCandidates,s=>s.id))
    axios.post(`${url.ADMIN_API}/onlineTest/send/link`, formData, { headers: authHeader()})
      .then(_res => {
        this.setState({ validMailButton: false, loader: false });
        toastMessage('success', "Emails sent Successfully..!");
        this.props.onCloseModal()
        this.setState({ mailOpenModal: true });
      }).catch(error => {
        this.setState({ validMailButton: false, loader: false });
        if (error.response?.status === 401) {
          logOut();
          this.props.history.push('/login');
        }
        errorHandler(error);
      })
  }

  onFileChange = event => {
    this.setState({ selectedFile: event.target.files[0], validUploadButton: false });
  };

  importSampleFile = () => {
    // eslint-disable-next-line default-case
    switch (this.props.modalSection.type) {
      case 'Email':
        saveAs(new Blob(['S.NO', ',', 'EMAIL'], { type: "text/plain" }), `candidate_email.csv`);
        break;
      case 'Student':
        saveAs(new Blob(['S.NO', ',', 'FIRST_NAME', ',', 'LAST_NAME', ',', 'EMAIL', ',', 'PHONE'], { type: "text/plain" }), 'student.csv');
        break;
      case 'Question':
        let header;
        if (this.state.csvImportObject.questionType === 'MCQ') {
          header = ['SECTION,QUESTION TYPE,EXAM TYPE,DIFFICULTY,QUESTION,ANSWER,OPTION-A,OPTION-B,OPTION-C,OPTION-D,OPTION-E'];
        } else {
          header = ['SECTION,QUESTION TYPE,EXAM TYPE,DIFFICULTY,QUESTION,ANSWER,OPTION-A,OPTION-B'];
        }
        let str = '';
        let row = 'S.NO,';
        let line = '';
        for (let index in header) {
          row += header[index].toString().toUpperCase() + ',';
        }
        row = row.slice(0, -1);
        str += row + '\r\n';
        line = '1,' + this.state.csvImportObject.section + ',' + this.state.csvImportObject.questionType + ',' + this.state.csvImportObject.examType;
        str += line + '\r\n';
        saveAs(new Blob([str], { type: "text/plain" }), `question.csv`);
        break;
    }
  }
  handleChange = (e, key) => {
    const { csvImportObject } = this.state;
    csvImportObject[key] = e.target.value;
    this.setState({ csvImportObject });
  }

  renderQuestionTemplate = () => {
    // eslint-disable-next-line default-case
    switch (this.props.modalSection.type) {
      case 'Question':
        return <div className="row" style={{ display: "flex", flexDirection: "row", transform:'translate(25px, -40px)' }}>
          <div className="col" style={{ paddingLeft: "21px" }}>
            <select className='form-control-mini' name='section' style={{ width: "200px" }}
              value={this.state.csvImportObject.section}
              onChange={(e) => this.handleChange(e, 'section')}>
              <option hidden selected value="">Section</option>
              {_.map(this.props.modalSection?.sections, (value) => {
                return <option value={value.name}>{value.name}</option>
              })}
            </select>
          </div>
          <div className="col" style={{}}>
            <select className='form-control-mini' style={{ width: "150px" }}
              value={this.state.csvImportObject.questionType}
              onChange={(e) => this.handleChange(e, 'questionType')}>
              <option hidden selected value="">Type</option>
              {_.map(this.state.questionType, (key) => {
                return <option value={key}>{key}</option>
              })}
            </select>
          </div>
          <div className="col" style={{}}>
            <select className='form-control-mini' style={{ width: "110x" }}
              value={this.state.csvImportObject.examType}
              onChange={(e) => this.handleChange(e, 'examType')}>
              <option hidden selected value="">Type</option>
              {_.map(this.state.examType, (key) => {
                return <option value={key}>{key}</option>
              })}
            </select>
          </div>
          <div style={{ paddingTop: "10px", marginLeft: "8px" }}>
            <button className='btn btn-sm btn-nxt' disabled={(this.state.csvImportObject?.section !== '' && this.state.csvImportObject?.questionType !== '') ? false : true} onClick={this.importSampleFile} ><i className="fa fa-download" aria-hidden="true"></i> Sample Template</button>
            <strong className='ml-2' style={{ color: '#3b489e', position:'relative', left:'1rem' }}>( *must upload this file format )</strong>
          </div>
        </div>
      case 'Email':
        return <button className='btn btn-sm btn-nxt' style={{ marginLeft: "5px" }} onClick={this.importSampleFile} ><i className="fa fa-download" aria-hidden="true"></i> Sample Template</button>

      case 'Student':
        return <button className='btn btn-sm btn-nxt' style={{ marginLeft: "5px" }} onClick={this.importSampleFile} ><i className="fa fa-download" aria-hidden="true"></i> Sample Template</button>
    }
  }

  onFileUpload = () => {
    this.setState({ validUploadButton: true, loader: true });
    // Create an object of formData
    const formData = new FormData();
    // Update the formData object
    formData.append('file', this.state.selectedFile);
    // eslint-disable-next-line default-case
    switch (this.props.modalSection.type) {
      case 'Email':
        formData.append('examId', this.props.modalSection?.exam?.id);
        axios.post(` ${url.ADMIN_API}/examUsers/upload`, formData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }).then(res => {
          this.setState({ loader: false });
          this.setState({ mailOpenModal: true });
          toastMessage('success', res.data.message);
        }).catch(error => {
          this.setState({ validUploadButton: false, loader: false });
          toastMessage('error', error.response?.data?.message);
        })
        break;
      case 'Question':
        axios.post(` ${url.ADMIN_API}/question/bulk/question/`, formData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }).then(res => {
          this.setState({ loader: false });
          this.props.onCloseModal();
          toastMessage('success', "Questions uploaded successfully..!!");
        }).catch(error => {
          this.setState({ validUploadButton: false, loader: false });
          toastMessage('error', error);
        })
        break;
      case 'Student':
        axios.post(` ${url.COLLEGE_API}/student/bulk/save`, formData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }).then(res => {
          this.setState({ loader: false });
          this.props.onCloseModal();
          toastMessage('success', res.data.message);
        }).catch(error => {
          this.setState({ validUploadButton: false, loader: false });
          toastMessage('error', error.response?.data?.message || 'Something went wrong while uploading')
        })
    }
  };


  render() {
    const questionType = this.props.modalSection.type === 'Email';
    return (
      <div className="modal fade show" id="myModal" role="dialog" style={{ paddingRight: '15px', display: 'flex', justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.90)' }} aria-hidden="true">
        {fallBackLoader(this.state.loader)}
        <div className="modal-dialog" style={{ width: "700px", maxWidth: "770px" }}>
          <div className="modal-content" style={{ borderStyle: 'solid', borderColor: '#af80ecd1', borderRadius: "32px" }}>
            <div className="modal-header" style={{ border: "none" }}>
              <h5 className="setting-title" style={{marginLeft:'1rem'}}>Upload {this.props.modalSection?.type === "Email" ? "Candidates" : this.props.modalSection?.type }</h5>
              {this.props.modalSection?.type === "Email" ? <h5 className="setting-title" style={{ paddingLeft: '0.5rem' }}><span style={{ color: '#F05A28' }}>{this.props.remainingTest}</span>   Credits Available</h5> : ''}
              <button type="button" onClick={this.props.onCloseModal} className="close" data-dismiss="modal" style={{ border: "none" }}>&times;</button>
            </div>
            <div className='card-body' style={{ paddingTop: "10px" }}>
              <div>
                {this.renderQuestionTemplate()}
                {(this.props.mailModalSection?.exam===null && this.props.modalSection.type === "Email") || this.props.modalSection?.type === "Student"? <strong className='ml-2' style={{ color: '#3b489e' }}>( *must upload this file format )</strong> : this.props.modalSection?.type !== "Question" && this.props.modalSection?.type !== "Student"  ?  <strong className='ml-2' style={{ color: '#3b489e' }}>( *You can add more candidates, but the file must be in CSV format )</strong> : null}
                <hr className="rounded" style={{position:'relative', bottom:'2rem',width:'92%', left:'2rem'}}></hr>
                <div style={{ display: 'flex', justifyContent: "space-between", paddingLeft: "30px",position:'relative', bottom:'2rem', }}>
                  <input style={{ color: "#3b489e" }} id='files' type="file" onChange={this.onFileChange} accept={".csv"} />
                  {!questionType && <button className="btn btn-sm btn-nxt" style={{position:'relative',right:'2rem'}} disabled={this.state.validUploadButton} onClick={this.onFileUpload}>Upload</button>}
                </div>
                {questionType && <form onSubmit={this.handleSubmit}>
                  <div className="form-row" style={{ marginTop: '1rem' }}>
                    <div className='form-group col-12'>
                      <CKEditor
                        content={this.state.mailMsg}
                        events={{
                          "change": newContent => { this.setState({ mailMsg: newContent.editor.getData() }) }
                        }}
                        config={{
                          removePlugins: 'elementspath',
                          resize_enabled: false
                        }}
                      />
                    </div>
                    <div className="col-md-11" style={{ display: "flex",justifyContent: "flex-end" }}>
                      <button disabled={!this.state.selectedFile && this.props.mailModalSection?.exam===null } type="button" onClick={() => this.sendExamLink(this.props.mailModalSection.exam || this.state.exam)} className="btn btn-sm btn-nxt" >Send Mail</button>
                    </div>
                  </div>
                </form>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}