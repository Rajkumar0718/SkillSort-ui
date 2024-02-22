import { Divider } from '@mui/material';
import axios from 'axios';
import _ from 'lodash';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { authHeader, errorHandler } from '../../api/Api';
import { toastMessage } from '../../utils/CommonUtils';
import url from '../../utils/UrlConstant';
import CkEditor from '../../common/CkEditor';
import styled from 'styled-components';
const StyledCKEditorWrapper = styled.div`
.ck.ck-editor {
  width:max-content;
  margin-left:2rem;
}
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
export default function MailModalForShortListed(props) {
  const [mailMsg, setMailMsg] = useState('')
  const exam = props.exams



  const sendExamLink = (e) => {
    if ((props.remainingTest > 0 && _.size(props.emails) <= props.remainingTest)) {
      exam.message = mailMsg;
      axios.post(`${url.ADMIN_API}/onlineTest/send/examLink?emails=${props.emails}`, exam, { headers: authHeader() })
        .then(_res => {
          toastMessage('success', "Emails sent Successfully..!");
          props?.onCloseModal(e)

        }).catch(error => {
          errorHandler(error);
        })
    }
    else {
      toast(`You are about to exceed max limit${props.remainingTest ? ` (${props.remainingTest})` : ''}`,
        { style: { backgroundColor: 'rgb(255, 244, 229)', color: 'rgb(102, 60, 0)' }, autoClose: 5000, closeOnClick: true })
    }
  }
  const handleEditorChange = (newData) => {
    setMailMsg(newData)

  };
  return (
    <div className="modal fade show" onClick={(e) => { props.onCloseModal(e) }} id="myModal" role="dialog" style={{ paddingRight: '15px', display: 'flex', justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.90)' }} aria-hidden="true">
      <div className="modal-dialog" style={{ width: "700px", maxWidth: "770px" }}>
        <div className="modal-content" style={{ borderStyle: 'solid', borderColor: '#af80ecd1', borderRadius: "32px",height:"30rem" }}>
          <div className="modal-header" style={{ padding: "2rem 2rem 0 1.8rem", border: "none" }}>
            {<h5 className="setting-title" style={{ paddingLeft: '0.5rem' }}><span style={{ color: '#F05A28' }}>{props.remainingTest}</span> Test Credits Available</h5>}
            <button type="button" onClick={props.onCloseModal} className="close" data-dismiss="modal">&times;</button>
          </div>
          <Divider  sx={{opacity:"1"}}/>
          <div className='card-body' style={{ paddingTop: "10px" }}>
            <div style={{ marginLeft: '2rem'}} >
              <p>Exam Name: <b>{props.examName}</b></p>
            </div>
            <div className="form-row" style={{ marginTop: '1rem' }}>
              <div className='form-group col-12'>
                <StyledCKEditorWrapper>
                  <CkEditor data={mailMsg} onChange={handleEditorChange} />
                </StyledCKEditorWrapper>
              </div>
              <div className="col-md-11" style={{ display: "flex", justifyContent: "flex-end",position:"relative",top:"-3rem" }}>
                <button disabled={!mailMsg} type="button" className="btn btn-sm btn-nxt closeModal" onClick={(e) => sendExamLink(e)} >Send Mail</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
