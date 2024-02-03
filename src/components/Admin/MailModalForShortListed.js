import { Divider } from '@mui/material';
import axios from 'axios';
import _ from 'lodash';
import React, { useState } from 'react';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { toast } from 'react-toastify';
import { authHeader, errorHandler } from '../../api/Api';
import { toastMessage } from '../../utils/CommonUtils';
import url  from '../../utils/UrlConstant';


export default function MailModalForShortListed(props) {
  const [mailMsg, setMailMsg] = useState('')
  const exam  = props.exams



  const sendExamLink = (e) => {
    if((props.remainingTest > 0 && _.size(props.emails) <= props.remainingTest)){
    exam.message = mailMsg;
    axios.post(`${url.ADMIN_API}/onlineTest/send/examLink?emails=${props.emails}`, exam, { headers: authHeader() })
      .then(_res => {
        toastMessage('success', "Emails sent Successfully..!");
        props?.onCloseModal(e)

      }).catch(error => {
        console.log(error);
        errorHandler(error);
      })
    }
    else{
        toast(`You are about to exceed max limit${props.remainingTest ? ` (${props.remainingTest})` : ''}`,
          { style: { backgroundColor: 'rgb(255, 244, 229)', color: 'rgb(102, 60, 0)' }, autoClose: 5000, closeOnClick: true })
    }
  }

  return (
    <div className="modal fade show" onClick={(e) => { props.onCloseModal(e) }}  id="myModal" role="dialog" style={{ paddingRight: '15px', display: 'flex', justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.90)' }} aria-hidden="true">
      <div className="modal-dialog" style={{ width: "700px", maxWidth: "770px" }}>
        <div className="modal-content" style={{ borderStyle: 'solid', borderColor: '#af80ecd1', borderRadius: "32px" }}>
          <div className="modal-header" style={{ padding: "2rem 2rem 0 1.8rem", border: "none" }}>
            {<h5 className="setting-title" style={{ paddingLeft: '0.5rem' }}><span style={{ color: '#F05A28' }}>{props.remainingTest}</span> Test Credits Available</h5>}
            <button type="button" onClick={props.onCloseModal} className="close" data-dismiss="modal">&times;</button>
          </div>
          <Divider />
          <div className='card-body' style={{ paddingTop: "10px" }}>
            <div style={{ marginTop: '1rem', marginBottom: '1.5rem' }} >
              <p>Exam Name: <b>{props.examName}</b></p>
            </div>
            <div className="form-row" style={{ marginTop: '1rem' }}>
              <div className='form-group col-12'>
                <CKEditor
                  content={mailMsg}
                  events={{
                    "change": newContent => { setMailMsg(newContent.editor.getData()) }
                  }}
                  config={{
                    removePlugins: 'elementspath',
                    resize_enabled: false
                  }}
                />
              </div>
              <div className="col-md-11" style={{ display: "flex", justifyContent: "flex-end" }}>
                <button disabled={!mailMsg} type="button" className="btn btn-sm btn-nxt closeModal" onClick={(e) => sendExamLink(e)} >Send Mail</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
