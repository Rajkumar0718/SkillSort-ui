import axios from 'axios';
import React, { Component ,useState } from 'react';
import CKEditor from "react-ckeditor-component";
import { authHeader } from '../../api/Api';
import { toastMessage } from '../../utils/CommonUtils';
import  url  from '../../utils/UrlConstant';

const FeedbackModel = () => {
    const [skillSortCandidate, setSkillSortCandidate] = useState(props.modelSection.skillSortCandidate);

    const handleSubmit = () => {
      if (!skillSortCandidate.skillSortFeedBack) {
        const updatedValue = { ...skillSortCandidate };
        updatedValue.skillSortFeedBack = updatedValue.panelistFeedBack;
        setSkillSortCandidate(updatedValue);
      }
  
      axios.put(`${url.ADMIN_API}/superadmin/save`, skillSortCandidate, { headers: authHeader() })
        .then(res => {
          toastMessage('success', res.data.response.message);
          props.onCloseModal();
        });
    };
  
    const handleChange = (e) => {
      const updatedValue = { ...skillSortCandidate };
      updatedValue.skillSortFeedBack = e.editor.getData();
      setSkillSortCandidate(updatedValue);
    };
  
    const setStatusColor = (status) => {
      if (!status) return "white";
      if (status === 'SELECTED') return 'green';
      if (status === 'REJECTED') return 'red';
      if (status === 'NO_SHOW') return 'black';
    };

  return (
    <div >
                <div className="modal fade show" id="myModal" role="dialog" style={{ paddingRight: '15px', display: 'flex', backgroundColor: 'rgba(0,0,0,0.90)', justifyContent: 'center', alignItems: 'center' }} aria-hidden="true">
                    <div className="col-md-8">
                        <div className="modal-content" style={{ borderStyle: 'solid', borderColor: '#3b489e', borderRadius: "32px" }}>
                            <div className="modal-header" style={{ padding: "2rem 2rem 0 1.90rem", border: "none" }}>
                                <h5 className="setting-title" >Feedback</h5>
                                <button type="button" onClick={props.onCloseModal} className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body" >
                                <div className='container'>
                                    <div className='row'>
                                        <div className='col-lg-4'>
                                            <label className='form-group '>Panelist: &nbsp;</label>
                                            <span><b>{skillSortCandidate.panelist?.firstName}</b></span>
                                        </div>
                                        <div className='col-lg-4'>
                                            <label className='form-group'>Candidate:&nbsp;</label>
                                            <span><b>{skillSortCandidate.candidate?.firstName}</b></span>
                                        </div>
                                        <div className='col-lg-4'>
                                            <label className='form-group'>Status: &nbsp;</label>
                                            <span style={{ color: setStatusColor(skillSortCandidate?.panelistCandidateStatus?.toUpperCase()) }}>{skillSortCandidate.panelistCandidateStatus?.toUpperCase()}</span>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-lg-12 col-md-12 col-sm-12' style={{ paddingBottom: '15px' }}>
                                            <label className='form-group'>Feedback&nbsp;</label>
                                            {skillSortCandidate.skillSortFeedBack === null ?
                                                <CKEditor
                                                    activeclassName="p10"
                                                    content={skillSortCandidate.panelistFeedBack}
                                                    events={{
                                                        "blur": onBlur,
                                                        "afterPaste": afterPaste,
                                                        "change": (e) => handleChange(e)
                                                    }}
                                                    config={{
                                                        removePlugins: 'elementspath',
                                                        resize_enabled: false
                                                    }}
                                                />
                                                :
                                                <CKEditor
                                                    activeclassName="p10"
                                                    content={skillSortCandidate.skillSortFeedBack}
                                                    events={{
                                                        "blur": onBlur,
                                                        "afterPaste": afterPaste,
                                                        "change": (e) => handleChange(e)
                                                    }}
                                                    config={{
                                                        removePlugins: 'elementspath',
                                                        resize_enabled: false
                                                    }}
                                                />
                                            }
                                        </div>
                                    </div>
                                    {skillSortCandidate.skillsSortStatus === "FEEDBACK_RECEIVED" ?
                                        <div className='row'>
                                            <div className='col-lg-12 col-sm-12 col-md-12'>
                                                <button type="submit" onClick={() => handleSubmit()} className="btn btn-sm btn-nxt" style={{ float: 'right' }}>Submit</button>
                                            </div>
                                        </div>
                                        : ""}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
  )
}

export default FeedbackModel