/* eslint-disable no-useless-concat */
/* eslint-disable default-case */

import axios from 'axios';
import { saveAs } from 'file-saver';
import React, { Component } from 'react';
import { authHeader, logOut } from '../../api/Api';
import { fallBackLoader, toastMessage } from '../../utils/CommonUtils';
import { url } from '../../utils/UrlConstant';
import { isRoleValidation } from '../../utils/Validation';

export default class BulkUploadModel extends Component {
    state = {
        loader: false,
        validMailButton: false,
        id: '',
        mailMsg: '',
        selectedFile: null,
        validUploadButton: true,
        csvImportObject: {
            section: '',
            questionType: '',
            competitorQuestionType: '',
            difficulty: "",
            bulkUploadOpenModal: false,
            mailModalSection: "",
        },
        questionType: ['MCQ', 'True/False'],
        competitorQuestionType: ['MOCK', 'ACTUAL']
    }

    componentWillMount() {
        if (this.props.modalSection.type === "Question") {
            return null;
        }
        this.setState({ mailMsg: this.props.mailModalSection.exam.message });
    }

    handleMsg = (e, key) => {
        this.setState({ [key]: e.target.value });
    }


    sendExamLink = (data) => {
        data.message = this.state.mailMsg;
        this.setState({ validMailButton: true });
        axios.post((isRoleValidation() === 'COLLEGE_ADMIN' || isRoleValidation() === "COLLEGE_STAFF") ? `${url.COLLEGE_API}/onlineTest/send/link` : ` ${url.ADMIN_API}/onlineTest/send/link`, data, { headers: authHeader() })
            .then(res => {
                this.setState({ validMailButton: false });
                toastMessage('success', "Email sent Successfully..!");
                this.props.onCloseModal()
                this.props.onMailCloseModal();
                this.setState({ bulkUploadOpenModal: true });
            }).catch(error => {
                this.setState({ validMailButton: false });
                if (error.response.status === 401) {
                    logOut();
                    this.props.history.push('/login');
                }
                toastMessage('error', 'Oops something went wrong..!')
            })
    }

    onFileChange = event => {
        this.setState({ selectedFile: event.target.files[0], validUploadButton: false });
    };

    importSampleFile = () => {
        // eslint-disable-next-line default-case
        switch (this.props.modalSection.type) {
            case 'Email':
                saveAs(new Blob(['S.NO', ',', 'EMAIL'], { type: "text/plain" }), `email.csv`);
                break;
            case 'Question':
                let header;
                if (this.state.csvImportObject.questionType === 'MCQ') {
                    header = ['SECTION' + ',' + 'QUESTION TYPE' + ',' + 'QUESTION ROLE' + ',' + 'COMPETITOR QUESTION TYPE' + ',' + 'DIFFICULTY' + ',' + 'QUESTION' + ',' + 'ANSWER' + ',' + 'OPTION-A' + ',' + 'OPTION-B' + ',' + 'OPTION-C' + ',' + 'OPTION-D' + ',' + 'OPTION-E'];
                } else {
                    header = ['SECTION' + ',' + 'QUESTION TYPE' + ',' + 'QUESTION ROLE' + ',' + 'COMPETITOR QUESTION TYPE' + ',' + 'DIFFICULTY' + ',' + 'QUESTION' + ',' + 'ANSWER' + ',' + 'OPTION-A' + ',' + 'OPTION-B'];
                }
                let str = '';
                let row = 'S.NO,';
                let line = '';
                for (let index in header) {
                    row += header[index].toString().toUpperCase() + ',';
                }
                row = row.slice(0, -1);
                str += row + '\r\n';
                // eslint-disable-next-line no-useless-concat
                line = '1' + ',' + this.state.csvImportObject.section + ',' + this.state.csvImportObject.questionType + ',' + 'COMPETITOR' + ',' + this.state.csvImportObject.competitorQuestionType;
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
            switch (this.props.modalSection.type) {
                case 'Question':
                    return <div className="row">
                        <div className="col">
                            <select className='form-control' name='section'
                                value={this.state.csvImportObject.section}
                                onChange={(e) => this.handleChange(e, 'section')}>
                                <option hidden selected value="">Section</option>
                                {(this.props.modalSection?.sections || []).map((value) => {
                                    return <option key={value.name} value={value.name}>{value.name}</option>
                                })}
                            </select>
                        </div>
                        <div className="col">
                            <select className='form-control'
                                value={this.state.csvImportObject.questionType}
                                onChange={(e) => this.handleChange(e, 'questionType')}>
                                <option hidden selected value="">Type</option>
                                {(this.state.questionType || []).map((key) => {
                                    return <option key={key} value={key}>{key}</option>
                                })}
                            </select>
                        </div>
                        <div className="col">
                            <select className='form-control'
                            value={this.state.csvImportObject.competitorQuestionType}
                            onChange={(e) => this.handleChange(e, 'competitorQuestionType')}>
                            <option hidden selected value="">Type</option>
                            {(this.state.competitorQuestionType || []).map((key) => {
                                return <option key={key} value={key}>{key}</option>
                            })}
                        </select>
                    </div>
                    <div className="col">
                        <button className='btn btn-secondary' disabled={(this.state.csvImportObject.section !== '' && this.state.csvImportObject.questionType !== '') ? false : true} onClick={this.importSampleFile} ><i className="fa fa-download" aria-hidden="true"></i> File</button>
                    </div>
                </div>
            case 'Email':
                return <button className='btn btn-secondary' onClick={this.importSampleFile} ><i className="fa fa-download" aria-hidden="true"></i> File</button>
        }
    }

    onFileUpload = () => {
        this.setState({ validUploadButton: true, loader: true });
        // Create an object of formData
        const formData = new FormData();
        // Update the formData object
        formData.append('file', this.state.selectedFile);
        switch (this.props.modalSection.type) {
            case 'Email':
                formData.append('examId', this.props.modalSection.exam.id);
                axios.post(` ${url.ADMIN_API}/examUsers/upload`, formData, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(res => {
                    this.setState({ loader: false });
                    this.setState({ bulkUploadOpenModal: true });
                    toastMessage('success', res.data.message);
                }).catch(error => {
                    this.setState({ validUploadButton: false, loader: false });
                    toastMessage('error', error);
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
                    toastMessage('success', res.data.message);
                }).catch(error => {
                    this.setState({ validUploadButton: false, loader: false });
                    toastMessage('error', error);
                })
                break;
        }
    };

    onMailCloseModal = () => {       //THIS METHOD IS TO CLOSE THE MESSAGE POPUP BOX WHEN WE CLICK 'X' SYMBOL ON TOP CORNER...
        this.setState({ bulkUploadOpenModal: !this.state.bulkUploadOpenModal });
        this.props.onCloseModal();
    }

    render() {
        if (!this.state.bulkUploadOpenModal) {
            return (
                <div className="modal fade show" id="myModal" role="dialog" style={{ paddingRight: '15px', display: 'block', backgroundColor: 'rgba(0,0,0,0.4)' }} aria-hidden="true">
                    {fallBackLoader(this.state.loader)}
                    <div className="modal-dialog">
                        <div className="modal-content" style={{ borderStyle: 'solid', borderColor: '#808080' }}>
                            <div className="modal-header" style={{ backgroundColor: '#808080' }}>
                                <h5 className="modal-title" style={{ color: 'white' }}>Add {this.props.modalSection.type}</h5>
                                <button type="button" onClick={this.props.onCloseModal} className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className='card-body'>
                                <div>
                                    {this.renderQuestionTemplate()}
                                    {/* <button className='btn btn-secondary mt-2' onClick={this.importSampleFile} ><i className="fa fa-download" aria-hidden="true"></i> File</button> */}
                                    <strong className='ml-2' style={{ color: 'tomato' }}>( *must upload this file format )</strong>
                                    <hr className="rounded"></hr>
                                    <input type="file" onChange={this.onFileChange} accept={".csv"} />
                                    <button className="btn btn-secondary" disabled={this.state.validUploadButton} onClick={this.onFileUpload}>Upload</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        else {
            return (
                <div className="modal fade show" id="myModal" role="dialog" style={{ paddingRight: '15px', display: 'block', backgroundColor: 'rgba(0,0,0,0.4)' }} aria-hidden="true">
                    <div className="modal-dialog">
                        {fallBackLoader(this.state.validMailButton)}
                        <div className="modal-content" style={{ borderStyle: 'solid', borderColor: '#af80ecd1' }}>
                            <div className="modal-header" style={{ backgroundColor: '#af80ecd1' }}>
                                <h5 className="modal-title" style={{ color: 'white' }}>Test Link Message</h5>
                                <button type="button" onClick={this.onMailCloseModal} className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-row">
                                        <div className='form-group col-12'>
                                            <label for="first-option">Message</label>
                                            <textarea name="mailMsg" className="form-control"
                                                value={this.state.mailMsg}
                                                onChange={(e) => this.handleMsg(e, 'mailMsg')}
                                                id="first" placeholder="Enter the Message" maxlength="1000" autocomplete="off" style={{ marginTop: '0px', marginBottom: '0px', height: '120px' }} ></textarea>
                                        </div>
                                        <div className="form-row">
                                        </div>
                                        <div className="col-md-10">
                                            <button type="button" disabled={this.state.validMailButton} onClick={() => this.sendExamLink(this.props.mailModalSection.exam)} className="btn btn-info" >Send Mail</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}
