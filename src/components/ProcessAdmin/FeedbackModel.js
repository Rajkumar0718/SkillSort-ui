import axios from 'axios';
import React, { Component } from 'react';
import { authHeader } from '../../api/Api';
import { toastMessage } from '../../utils/CommonUtils';
import  url  from '../../utils/UrlConstant';
import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
export default class FeedBackModel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            skillSortCandidate: this.props.modelSection.skillSortCandidate,
            // feedback: ""
        }
    }

    // componentDidMount(){
    //     {this.props.modelSection.skillSortCandidate.skillSortFeedBack === null ?
    //         this.setState({ feedback: this.props.modelSection.skillSortCandidate.panelistFeedBack}) :
    //         this.setState({ feedback: this.props.modelSection.skillSortCandidate.skillSortFeedBack })
    //     }
    // }

    handleSubmit() {
        if (!this.state.skillSortCandidate.skillSortFeedBack) {
            let value = this.state.skillSortCandidate;
            value.skillSortFeedBack = value.panelistFeedBack;
            this.setState({ skillSortCandidate: value })
        }
        axios.put(` ${url.ADMIN_API}/superadmin/save`, this.state.skillSortCandidate, { headers: authHeader() })
            .then(res => {
                toastMessage('success', res.data.response.message)
                this.props.onCloseModal();
            })

    }

    handleChange = (e) => {
        const value = this.state.skillSortCandidate;
        value.skillSortFeedBack = e.editor.getData();
        this.setState({ skillSortCandidate: value })
    }

    setStatusColor(status) {
        if (!status) return "white"
        if (status === 'SELECTED') return 'green'
        if (status === 'REJECTED') return 'red'
        if (status === 'NO_SHOW') return 'black'
    }


    render() {
        return (
            <div >
                <div className="modal fade show" id="myModal" role="dialog" style={{ paddingRight: '15px', display: 'flex', backgroundColor: 'rgba(0,0,0,0.90)', justifyContent: 'center', alignItems: 'center' }} aria-hidden="true">
                    <div className="col-md-8">
                        <div className="modal-content" style={{ borderStyle: 'solid', borderColor: '#3b489e', borderRadius: "32px" }}>
                            <div className="modal-header" style={{ padding: "2rem 2rem 0 1.90rem", border: "none" }}>
                                <h5 className="setting-title" >Feedback</h5>
                                <button type="button" onClick={this.props.onCloseModal} className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body" >
                                <div className='container'>
                                    <div className='row'>
                                        <div className='col-lg-4'>
                                            <label className='form-group '>Panelist: &nbsp;</label>
                                            <span><b>{this.state.skillSortCandidate.panelist?.firstName}</b></span>
                                        </div>
                                        <div className='col-lg-4'>
                                            <label className='form-group'>Candidate:&nbsp;</label>
                                            <span><b>{this.state.skillSortCandidate.candidate?.firstName}</b></span>
                                        </div>
                                        <div className='col-lg-4'>
                                            <label className='form-group'>Status: &nbsp;</label>
                                            <span style={{ color: this.setStatusColor(this.state.skillSortCandidate?.panelistCandidateStatus?.toUpperCase()) }}>{this.state.skillSortCandidate.panelistCandidateStatus?.toUpperCase()}</span>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-lg-12 col-md-12 col-sm-12' style={{ paddingBottom: '15px' }}>
                                            <label className='form-group'>Feedback&nbsp;</label>
                                            {this.state.skillSortCandidate.skillSortFeedBack === null ?
                                                <CKEditor
                                                    activeclassName="p10"
                                                    content={this.state.skillSortCandidate.panelistFeedBack}
                                                    events={{
                                                        "blur": this.onBlur,
                                                        "afterPaste": this.afterPaste,
                                                        "change": (e) => this.handleChange(e)
                                                    }}
                                                    config={{
                                                        removePlugins: 'elementspath',
                                                        resize_enabled: false
                                                    }}
                                                />
                                                :
                                                <CKEditor
                                                    activeclassName="p10"
                                                    content={this.state.skillSortCandidate.skillSortFeedBack}
                                                    events={{
                                                        "blur": this.onBlur,
                                                        "afterPaste": this.afterPaste,
                                                        "change": (e) => this.handleChange(e)
                                                    }}
                                                    config={{
                                                        removePlugins: 'elementspath',
                                                        resize_enabled: false
                                                    }}
                                                />
                                            }
                                        </div>
                                    </div>
                                    {this.state.skillSortCandidate.skillsSortStatus === "FEEDBACK_RECEIVED" ?
                                        <div className='row'>
                                            <div className='col-lg-12 col-sm-12 col-md-12'>
                                                <button type="submit" onClick={() => this.handleSubmit()} className="btn btn-sm btn-nxt" style={{ float: 'right' }}>Submit</button>
                                            </div>
                                        </div>
                                        : ""}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}