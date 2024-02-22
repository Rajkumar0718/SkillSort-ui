import React, { Component } from 'react';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
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
    handleEditorChange = (updatedData, keyName) => {

        console.log(`Updated data for ${keyName}:`, updatedData);

      };

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
                            <div className="modal-body" style={{ paddingTop: "5px" ,height:"20rem"}}>
                                <div className='container'>
                                    <div style={{position:"relative",bottom:"19px"}} >
                                        <label className='form-group'>Status: &nbsp;</label>
                                        <span style={{ color: this.setFontColor(this.state.skillSortCandidate.panelistCandidateStatus?.toUpperCase(), this.state.skillSortCandidate.skillSortFeedBack) }}>{this.state.skillSortCandidate.skillSortFeedBack ? this.state.skillSortCandidate.panelistCandidateStatus?.toUpperCase() : 'PENDING'}</span>
                                    </div>
                                    <label className='form-group' style={{position:"relative",bottom:"9px"}}>Skill Sort Feedback&nbsp;</label>
                                    <StyledCKEditorWrapper>
                                    <CkEditor data={this.state.skillSortCandidate.skillSortFeedBack}  onChange={this.handleEditorChange}/>
                                    </StyledCKEditorWrapper>
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
