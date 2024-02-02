import { FilledInput, InputAdornment } from "@mui/material";
import Tick from '@mui/icons-material/Check';
import Copy from '@mui/icons-material/FileCopy';
import axios from "axios";
import React,{ useEffect, useState } from "react";
import url from "../../utils/UrlConstant";
import { authHeader, errorHandler } from "../../api/Api";

function CopyClipBoardPopUp(props) {
  const [copied, setCopied] = useState(false)
  const link = props.link
  const examId = props.examId
  const isForResult = window.location.pathname === '/admin/vacancy/result'
  const [examUrl,setExamUrl] = useState(false)

  const copyTextToClipBoard = () => {
    navigator.clipboard.writeText(link? link : examUrl)
    setCopied(true)
  }

  useEffect(()=>{
    if(!link) getPublicExamLink()
    // eslint-disable-next-line
},[])

const getPublicExamLink = ()=>{
  axios.get(`${url.ADMIN_API}/exam/getPublicUrlHashcode/${examId}`,{headers:authHeader()})
  .then(res=>{
    const hashCode = res.data.response
    console.log(res, "hascode");
      setExamUrl(hashCode? `${url.UI_URL}/candidate/register/${hashCode}` : undefined)
    }).catch((er)=>{
      // errorHandler(er)
    })
  }

  return (
    <div className="modal fade show" id="myModal" role="dialog" style={{ paddingRight: '15px', display: 'flex', backgroundColor: 'rgba(0,0,0,0.90)', justifyContent: 'center', alignItems: 'center' }} aria-hidden="true">
      <div className="col-md-5">
        <div className="modal-content" style={{ borderStyle: 'solid', borderColor: '#3b489e', borderRadius: "32px" }}>
          <div className="modal-body" >
            <div className="row">
              <div className="col-12 col-lg-12 col-md-12 col-sm-12" style={{ textAlign: "center", padding: '1rem' }}>
                {<h5 style={{ fontWeight: "400", color: "#3b489e", fontFamily: 'Baskervville', fontSize: '26px' }} >Copy link to share {isForResult ? 'Candidate Results' :'Exam'} </h5>}
              </div>
            </div>
            <div className="row" style={{textAlign:'center'}}>
              <div className="col-lg-9 col-xl-9 col-md-9 col-sm-9" style={{ margin: 'auto' }}>
                {link || examUrl ?
                 <FilledInput
                 value={link ? link :examUrl}
                 endAdornment={<InputAdornment position="end" style={{ cursor: 'pointer' }}>{copied ? <Tick style={{ color: 'green' }} /> : <Copy onClick={() => copyTextToClipBoard()} />}</InputAdornment>}
                 inputProps={{
                   'style': { padding: '15px 12px 10px' },
                 }}
                 disableUnderline={true}
                 fullWidth={true}
               /> :<span style={{ fontWeight: "400", fontFamily: 'Baskervville', fontSize: '20px' }}>Please generate the public exam url </span> }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CopyClipBoardPopUp;
