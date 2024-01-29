import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import axios from "axios";
import React from "react";
import { useLocation } from "react-router";
import { errorHandler } from "../../api/Api";
import { toastMessage } from "../../utils/CommonUtils";
import url from "../../utils/UrlConstant";

const ReExamRequest = (props) => {
  const location = useLocation()
  const state = {
    examId: localStorage.getItem("examId"),
    examUserId: location.state.examUserId,
    requestStatus: "",
    isPublicExam: location.state.examUserId
  };

  const handleSend = () => {
    state.isPublicExam === undefined ? handleSendForPublicCandidate() :
      axios.post(`${url.CANDIDATE_API}/candidate/re-exam`, {
        examId: state.examId,
        examUserId: state.examUserId
      }, {
        headers: { Authorization: "Bearer " + location.state.token },
      }).then(res => {
        toastMessage('success', res.data.message);
      }).catch((error) => {
        errorHandler(error);
      })
  }

  const handleSendForPublicCandidate = () => {
    axios.post(`${url.CANDIDATE_API}/candidate/public/re-exam`, {
      examId: state.examId,
      companyId: location.state.companyId,
      email: location.state.email
    }).then(res => {
      toastMessage('success', res.data.message);
    }).catch((error) => {
      errorHandler(error);
    })
  }


  return (
    <div style={{ backgroundColor: 'rgba(0,0,0,0.8)', height: "100vh" }}>
      <div className="d-flex justify-content-center">
        <div className='split-card'>
          <div className="card-header" style={{ border: "none", borderTopLeftRadius: '32px', borderTopRightRadius: '32px' }}>
            <div className="form-group row">
              <h3 className="setting-title" style={{ margin: "auto", paddingTop: "15px", width: 'auto' }}>Candidate Re-Test Request</h3>
            </div>
          </div>
          <div className='row'>
            <div className='col-12'>
              <div className='col-12'>
                <div className='row' style={{ alignContent: 'center' }}>
                  <div className='col-12' style={{ textAlign: 'center', paddingTop: '10px', backgroundColor: "('74, 183, 255')" }}>
                    <Typography>
                      <p style={{ marginBottom: '0px', color: '#fc0303' }}>You have already taken the test within the last 3 months, If you want to take the test again you need to send a request to our admin for permission.</p><br />
                      <p style={{ marginBottom: '5px' }}> please , click on send button for creating the request for test link . In case of approval, you will get the exam link through your registered email..! </p>
                    </Typography>
                  </div>
                </div>
                <div className='row' style={{ height: '60px', alignContent: 'center' }}>
                  <div className='col-12'>
                    <Button
                      onClick={handleSend}
                      className="btn btn-sm btn-nxt"
                      style={{
                        width: "10ch",
                        margin: '0',
                        left: '40%',
                      }}
                    >
                      send
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReExamRequest;
