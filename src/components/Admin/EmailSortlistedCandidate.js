import axios from 'axios';
import React, { Component } from 'react';
import styled from 'styled-components';
import { authHeader, errorHandler } from '../../api/Api';
import { fallBackLoader, toastMessage } from '../../utils/CommonUtils';
import url from '../../utils/UrlConstant';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
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
export default class EmailSortlistedCandidate extends Component {
    state = {
        loader: false,
        email: '',
        password: '',
        message: 'You have been sortlisted to next round, Kindly send your Skype Id to hr@skillsort.com for Next round',
        id: '',
        token: '',
        candidate: {},
        candidateStatus: '',
        subject: 'SKILL SORT- Technical round interview',
    }


    componentDidMount = () => {
        let token = sessionStorage.getItem("token");
        this.setState({
            candidate: this.props.candidate.sendData,
            email: this.props.candidate.sendData.email,
            id: this.props.candidate.sendData.id,
            token: token,
            candidateStatus: this.props.candidate.candidateStatus,
        })

    }

    handleChange = (e, key) => {
        this.setState({ [key]: e.target.value });
    }

    handleSubmit = event => {
        const { candidate } = this.state;
        candidate.candidateStatus = this.state.candidateStatus;
        this.setState({ loader: true, candidate: candidate });
        event.preventDefault();
        let candidateMail = {}
        candidateMail.candidate = this.state.candidate
        candidateMail.message = this.state.message
        candidateMail.subject = this.state.subject
        if (this.state.candidateStatus === "NOTIFIED_TO_SKILL_SORT") {
            axios.post(`${url.ADMIN_API}/candidate/notify`, candidateMail, { headers: authHeader() })
                .then(res => {
                    this.setState({ loader: false });
                    toastMessage('success', res.data.message);
                    this.props.onCloseModal();
                }).catch(error => {
                    errorHandler(error);
                })
        } else {
            axios.post(`${url.ADMIN_API}/candidate/schedule`, candidateMail, { headers: authHeader() })
                .then(res => {
                    this.setState({ loader: false });
                    toastMessage('success', res.data.message);
                    this.props.onCloseModal();
                }).catch(error => {
                    errorHandler(error);
                })
        }
    }

    render() {
        return (
            <div className="modal fade show" id="myModal" role="dialog" style={{ paddingRight: '15px', display: 'block', backgroundColor: 'rgba(0,0,0,0.4)' }} aria-hidden="true">
                <div className="modal-dialog">
                    {fallBackLoader(this.state.loader)}
                    <div className="modal-content" style={{ borderStyle: 'solid', borderColor: '#af80ecd1' }}>
                        <div className="modal-header" style={{ backgroundColor: '#af80ecd1' }}>
                            <h5 className="modal-title" style={{ color: 'white' }}>Sending Invitation</h5>
                            <button type="button" onClick={this.props.onCloseModal} className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={this.handleSubmit}>
                                <div className="form-row">
                                    <div className='form-group col-12'>
                                        <label style={{ fontsize: '10px' }}>Subject</label>
                                        <textarea name="mailMsg" className="form-control"
                                            value={this.state.subject}
                                            onChange={(e) => this.handleChange(e, 'subject')}
                                            id="first" placeholder="Enter Subject" maxlength="300" autocomplete="off" style={{ marginTop: '0px', marginBottom: '0px', height: '50px' }} ></textarea>
                                        <label>Message</label>
                                        {/* <CKEditor
                                            content={this.state.message}
                                            events={{
                                                "change": e => this.setState({ message: e.editor.getData() })
                                            }}
                                            config={{
                                                removePlugins: 'elementspath',
                                                resize_enabled: false
                                            }}
                                        /> */}
                                        <StyledCKEditorWrapper>
                                            <CKEditor
                                                content={this.state.message}
                                                events={{
                                                    "change": e => this.setState({ message: e.editor.getData() })
                                                }}
                                                config={{
                                                    removePlugins: 'elementspath',
                                                    resize_enabled: false
                                                }}
                                            />
                                        </StyledCKEditorWrapper>
                                    </div>
                                    <div className="form-row">
                                    </div>
                                    <div className="col-md-10">
                                        <button type="submit" className="btn btn-nxt btn-sm" >Send Mail</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
//ckeditor balance
