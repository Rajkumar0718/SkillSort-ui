import React, { Component } from 'react';



export default class NotifiedCandidateFeedbackModel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            skillSortCandidate: this.props.modelSection.skillSortCandidate,
            action: this.props.modelSection.action,

            config: { readonly: true }
        }
    }


    setFontColor = (status, skillsort) => {
        if (skillsort === null) return "#6c757d"
        if (status === 'SELECTED') return 'green'
        if (status === 'REJECTED') return 'red'
        if (status === 'NO_SHOW') return 'black'
    }

    render() {
        return (
            <div>
                <div className="modal fade show" id="myModal" role="dialog" style={{ paddingRight: '15px', display: 'flex', backgroundColor: 'rgba(0,0,0,0.90)', justifyContent: 'center', alignItems: 'center' }} aria-hidden="true">
                    <div className="col-md-8">
                        <div className="modal-content" style={{ borderStyle: 'solid', borderColor: '#af80ecd1', borderRadius: "32px" }}>
                            <div className="modal-header" style={{ padding: "2rem 2rem 0 2rem", border: "none" }}>
                                <h5 className="setting-title" >Feedback</h5>
                                <button type="button" onClick={this.props.onCloseModal} className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body" style={{ paddingTop: "5px" }}>
                                <div className='container'>
                                    <div className='row' style={{ paddingLeft: "16px" }}>
                                        <label className='form-group'>Status: &nbsp;</label>
                                        <span style={{ color: this.setFontColor(this.state.skillSortCandidate.panelistCandidateStatus?.toUpperCase(), this.state.skillSortCandidate.skillSortFeedBack) }}>{this.state.skillSortCandidate.skillSortFeedBack ? this.state.skillSortCandidate.panelistCandidateStatus?.toUpperCase() : 'PENDING'}</span>
                                    </div>
                                    <label className='form-group'>Skill Sort Feedback&nbsp;</label>
                                    {/* <CKEditor
                                        content={this.state.skillSortCandidate.skillSortFeedBack}
                                        config={{
                                            readOnly: true,
                                            removePlugins: 'elementspath',
                                            resize_enabled: false,
                                            removeButtons: 'About,Cut,Copy,Paste,Undo,Redo,Anchor,Underline,Strike,Subscript,Superscript,Link,Unlink,Image,Source,Bold',
                                            copyFormatting_allowedContexts: false,
                                            removeDialogTabs: 'link:advanced'
                                        }}
                                    /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
//ck editor want to put
