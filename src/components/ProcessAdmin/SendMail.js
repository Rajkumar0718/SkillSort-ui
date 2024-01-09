import DateFnsUtils from '@date-io/date-fns';
import FormHelperText from '@material-ui/core/FormHelperText';
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import axios from 'axios';
import React, { Component , useState } from 'react';
import CKEditor from "react-ckeditor-component";
import { Link } from 'react-router-dom';
import { authHeader, errorHandler } from '../../api/Api';
import { toastMessage } from '../../utils/CommonUtils';
import { url } from '../../utils/UrlConstant';
import { isEmpty } from '../../utils/Validation';

const SendMail = () => {
    const [panalists, setPanalists] = useState([]);
    const [mail, setMail] = useState({
      candidate: location.candidate,
      skillSortId: location.skillSortId,
      jobDescription: localStorage.getItem("jobDescription"),
      panalists: [],
      panelist: {},
      link: '',
      duration: '',
      startDate: new Date(),
      candidateInstruction: '',
      skillsortInstruction: '',
      subject: '',
    });
    const [error, setError] = useState({
      candidateInstruction: false,
      candidateInstructionMsg: '',
      skillsortInstruction: false,
      skillsortInstructionMsg: '',
      subject: false,
      emailSubjectMsg: '',
      panelist: false,
      panalistMsg: '',
      link: false,
      linkMsg: ''
    });
  
    useEffect(() => {
      axios.get(`/api1/recruiter/list/interview?statusType=ACTIVE&verifiedStatus=VERIFIED`, { headers: authHeader() })
        .then(res => {
          setPanalists(res.data.response);
        })
        .catch(err => {
          errorHandler(err);
        });
    }, []);
  
    const handlePanalistChange = (e) => {
      const updatedMail = { ...mail, panelist: panalists[e.target.value] };
      setMail(updatedMail);
    };
  
    const handleDateChange = (date) => {
      const updatedMail = { ...mail, startDate: date };
      setMail(updatedMail);
    };
  
    const handleChange = (event, key) => {
      const updatedError = { ...error };
      updatedError[key] = false;
  
      const updatedMail = { ...mail };
      if (key === 'candidateInstruction' || key === 'skillsortInstruction') {
        updatedMail[key] = event.editor.getData();
      } else {
        updatedMail[key] = event.target.value;
      }
  
      setMail(updatedMail);
      setError(updatedError);
    };
  
    const handleSubmit = () => {
      const updatedError = { ...error };
  
      if (Object.keys(mail.panelist).length === 0) {
        updatedError.panelist = true;
        updatedError.panalistMsg = "Please Select The Panalist!";
      } else {
        updatedError.panelist = false;
      }
  
      if (isEmpty(mail.link)) {
        updatedError.link = true;
        updatedError.linkMsg = "Field Required!";
      } else {
        updatedError.link = false;
      }
  
      if (isEmpty(mail.skillsortInstruction)) {
        updatedError.skillsortInstruction = true;
        updatedError.skillsortInstructionMsg = "Field Required!";
      } else {
        updatedError.skillsortInstruction = false;
      }
  
      if (isEmpty(mail.candidateInstruction)) {
        updatedError.candidateInstruction = true;
        updatedError.candidateInstructionMsg = "Field Required!";
      } else {
        updatedError.candidateInstruction = false;
      }
  
      if (isEmpty(mail.subject)) {
        updatedError.subject = true;
        updatedError.emailSubjectMsg = "Field Required!";
      } else {
        updatedError.subject = false;
      }
  
      setError(updatedError);
  
      if (!updatedError.candidateInstruction && !updatedError.skillsortInstruction && !updatedError.subject && !updatedError.link && !updatedError.panelist) {
        axios.post(`${url.ADMIN_API}/superadmin/skillsort/sendmail`, mail, { headers: authHeader() })
          .then(res => {
            toastMessage('success', res.data.message);
            history.push('/processadmin/company/test/candidate');
          })
          .catch(err => {
            errorHandler(err);
          });
      }
    };
  return (

    <main className="main-content bcg-clr">
                <div>
                    <div className="container-fluid">
                        <div className="card-header-new">
                            <span>
                                Send Mail
                            </span>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="table-border-process">
                                    <div className="row">
                                        <div className=" col-6 col-lg-6 col-sm-6 col-xl-6">
                                            <div className="row">
                                                <div className="col-lg-4 col-4 col-sm-4 col-xl-4">
                                                    <label className="form-label text-input-label">Candidate Name<span style={{ color: 'red' }}>*</span></label></div>
                                                <div className="col-lg-8 col-8 col-sm-8 col-xl-8">
                                                    <input className='profile-page' value={mail.candidate.firstName + ' ' + mail.candidate.lastName} type='text' maxLength="50" readOnly />
                                                </div>
                                            </div>
                                        </div>
                                        <div className=" col-6 col-lg-6 col-sm-6 col-xl-6">
                                            <div className='row'>
                                                <div className="col-lg-4 col-4 col-sm-4 col-xl-4">
                                                    <label className="form-label text-input-label">Panalist<span style={{ color: 'red' }}>*</span></label></div>
                                                <div className="col-lg-8 col-8 col-sm-8 col-xl-8">
                                                    <select className='profile-page' name='setting'
                                                        onChange={(e) => handlePanalistChange(e)}>
                                                        <option hidden selected value="">Select Panalist</option>
                                                        {(panalists || []).map((panelist, index) => {
                                                            return <option value={index}>{panelist.userName}</option>
                                                        })}
                                                    </select>
                                                    <FormHelperText className="helper " style={{ paddingLeft: '0px', marginTop: '5px' }}>{error.panelist ? error.panalistMsg : null}</FormHelperText>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className=" col-6 col-lg-6 col-sm-6 col-xl-6">
                                            <div className='row'>
                                                <div className="col-lg-4 col-4 col-sm-4 col-xl-4">
                                                    <label className="form-label text-input-label">Interview Date<span style={{ color: 'red' }}>*</span></label></div>
                                                <div className="col-lg-8 col-8 col-sm-8 col-xl-8">
                                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                        <KeyboardDateTimePicker
                                                            className='profile-page'
                                                            value={mail.startDate}
                                                            onChange={handleDateChange}
                                                            minDate={new Date()}
                                                            required='true'
                                                        />
                                                    </MuiPickersUtilsProvider>
                                                </div>
                                            </div>
                                        </div>
                                        <div className=" col-6 col-lg-6 col-sm-6 col-xl-6">
                                            <div className='row'>
                                                <div className="col-lg-4 col-4 col-sm-4 col-xl-4">
                                                    <label className="form-label text-input-label">Email Subject<span style={{ color: 'red' }}>*</span></label></div>
                                                <div className="col-lg-8 col-8 col-sm-8 col-xl-8">
                                                    <input className='profile-page' onChange={(e) => handleChange(e, 'subject')} type='text' maxLength="100" />
                                                    <FormHelperText className="helper " style={{ paddingLeft: '0px', marginTop: '5px' }}>{error.subject ? error.emailSubjectMsg : null}</FormHelperText>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className=" col-6 col-lg-6 col-sm-6 col-xl-6">
                                            <div className='row'>
                                                <div className="col-lg-4 col-4 col-sm-4 col-xl-4">
                                                    <label className="form-label text-input-label">Interview Link<span style={{ color: 'red' }}>*</span></label></div>
                                                <div className="col-lg-8 col-8 col-sm-8 col-xl-8">
                                                    <input className='profile-page' onChange={(e) => handleChange(e, 'link')} type='text' />
                                                    <FormHelperText className="helper" style={{ paddingLeft: '0px', marginTop: '5px' }}>{error.link ? error.linkMsg : null}</FormHelperText></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='form-group col-12'>
                                        <div style={{ margin: '0px 0px 0px -3px' }}>
                                            <label for="question">Candidate Instruction<span style={{ color: 'red' }}>*</span></label>

                                            {/* <JoditEditor
                                                value={mail.candidateInstruction}
                                                onChange={(e) => handleChange(e, 'candidateInstruction')}
                                            /> */}
                                            <CKEditor
                                                content={mail.candidateInstruction}
                                                events={{
                                                    "change": (e) => handleChange(e, 'candidateInstruction')
                                                }}
                                                config={{
                                                    removePlugins: 'elementspath',
                                                    resize_enabled: false
                                                }}
                                            />
                                            <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{error.candidateInstruction ? error.candidateInstructionMsg : null}</FormHelperText>
                                        </div>
                                    </div>
                                    <div className='form-group col-12'>
                                        <div style={{ margin: '0px 0px 0px -3px' }}>
                                            <label for="question">Panalist Instruction<span style={{ color: 'red' }}>*</span></label>

                                            {/* <JoditEditor
                                                value={mail.skillsortInstruction}
                                                onChange={(e) => handleChange(e, 'skillsortInstruction')}
                                            /> */}

                                            <CKEditor
                                                content={mail.skillsortInstruction}
                                                events={{
                                                    "change": (e) => handleChange(e, 'skillsortInstruction')
                                                }}
                                                config={{
                                                    removePlugins: 'elementspath',
                                                    resize_enabled: false
                                                }}
                                            />
                                            <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{error.skillsortInstruction ? error.skillsortInstructionMsg : null}</FormHelperText>
                                        </div>
                                    </div>
                                    <div className="col-md-10" style={{ margin: '0px 0px 0px 60rem' }}>
                                        <button type="submit" onClick={() => handleSubmit()} className="btn btn-primary">Send Email</button>
                                        <Link className="btn btn-default" to="/processadmin/company/test/candidate">Cancel</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
  )
}

export default SendMail