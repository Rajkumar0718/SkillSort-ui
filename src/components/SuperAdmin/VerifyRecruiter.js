import axios from 'axios';
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { authHeader, errorHandler } from '../../api/Api';
import { toastMessage, withLocation } from '../../utils/CommonUtils';
import ContactPanelist from './ContactPanelist';
import StatusRadioButton from '../../common/StatusRadioButton';

class VerifyRecruiter extends Component {
    state = {
        id: '',
        verifiedStatus: '',
        openModel: false,
        sendData: '',
        panelist: '',
        status: 'ACTIVE',
    }

    componentDidMount() {
        const { recruiter } = this.props.location.state;
        this.setState(prevState => {
            let panelist = { ...prevState.recruiter }
            panelist = recruiter;
            return { panelist };
        })
        this.setState({
            userName: recruiter.userName,
            qualification: recruiter.qualification,
            email: recruiter.email,
            gender: recruiter.gender,
            industryType: recruiter.industryType.name,
            experience: recruiter.experience,
            phone: recruiter.phone,
            id: recruiter.id,
            authUserId: recruiter.authUserId,
            verifiedStatus: recruiter.verifiedStatus,
        })
    }

    handleChange(event, key) {
        this.setState({ [key]: event.target.value })
    }

    handleSubmit = event => {
        event.preventDefault();
        axios.post(`/api1/recruiter/verify`, this.state, { headers: authHeader() })
            .then(res => {
                if (res.data.response.verifiedStatus === "VERIFIED") {
                    this.setState({ verifiedStatus: res.data.response.verifiedStatus });
                    toastMessage('success', "Successfully Verified");
                } else {
                    toastMessage('error', "Failed to Verify");
                }
            })
            .catch(error => {
                errorHandler(error);
            })
    }

    onClickOpenModel = (data) => {
        if (!this.state.openModel) {
            document.addEventListener("click", this.handleOutSideClick, false);
        } else {
            document.removeEventListener("click", this.handleOutSideClick, false)
        }
        this.setState({ openModel: !this.state.openModel })
        this.setState({ sendData: data });
    }

    handleOutSideClick = (e) => {
        if (e.target.className === "modal fade show") {
            this.setState({ openModel: !this.state.openModel })
            this.componentDidMount();
        }
    }

    onCloseModal = () => {
        this.setState({ openModel: !this.state.openModel });
        this.componentDidMount();
    }

    handleResume = () => {
        axios.get(`/api1/recruiter/resume?recruiterId=${this.state.id}`, { headers: authHeader(), responseType: 'blob' })
            .then(res => {
                var url = window.URL.createObjectURL(res.data);
                let anchor = document.createElement('a');
                anchor.href = url;
                // let typeData = res.data.type.replace("application/", "") === 'pdf' ? 'pdf' : 'docx';
                anchor.download = this.state.userName + ".".concat(res.data.type.replace("application/", "") === 'pdf' ? 'pdf' : 'docx')
                anchor.click();
            }) .catch(error => {
                errorHandler(error);
            })
    }

    render() {
        return (
            <div className="card">
                <div className="card-header text-secondary">
                    Panelist Details
                </div>
                <div className='row'>
                    <div className="col-md-12">
                        <div className="card-body">
                            <form onSubmit={this.handleSubmit}>
                                <div className="row">
                                    <div className="col-6 col-xl-6 col-lg-6 col-sm-6">
                                        <div className='row'>
                                            <div className='col-3 col-xl-3 col-lg-3 col-sm-3'>
                                                <label for="question" className='form-label text-input-label'>Panelist Name</label>
                                            </div>
                                            <div className='col-9 col-xl-9 col-lg-9 col-sm-9'>
                                                <input className='profile-page'
                                                    value={this.state.userName}
                                                    name='name' id='candidate' autocomplete="off" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6 col-xl-6 col-lg-6 col-sm-6">
                                        <div className='row'>
                                            <div className="col-3 col-xl-3 col-lg-3 col-sm-3">
                                                <label for="question" className='form-label text-input-label'>Qualification</label>
                                            </div>
                                            <div className='col-9 col-xl-9 col-lg-9 col-sm-9'>
                                                <input className='profile-page'
                                                    value={this.state.qualification}
                                                    name='name' id='candidate' autocomplete="off" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="col-6 col-xl-6 col-lg-6 col-sm-6">
                                        <div className='row'>
                                            <div className="col-3 col-xl-3 col-lg-3 col-sm-3">
                                                <label for="question" className='form-label text-input-label'>Email</label></div>
                                            <div className='col-9 col-xl-9 col-lg-9 col-sm-9'>
                                                <input className='profile-page'
                                                    value={this.state.email}
                                                    name='name' id='candidate' autocomplete="off" /></div>
                                        </div>
                                    </div>
                                    <div className="col-6 col-xl-6 col-lg-6 col-sm-6">
                                        <div className='row'>
                                            <div className="col-3 col-xl-3 col-lg-3 col-sm-3">
                                                <label for="question" className='form-label text-input-label'>Gender</label></div>
                                            <div className='col-9 col-xl-9 col-lg-9 col-sm-9'>
                                                <input className='profile-page'
                                                    value={this.state.gender}
                                                    name='name' id='candidate' autocomplete="off" /></div>
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="col-6 col-xl-6 col-lg-6 col-sm-6">
                                        <div className='row'>
                                            <div className="col-3 col-xl-3 col-lg-3 col-sm-3">
                                                <label for="question" className='form-label text-input-label'>Industry Type</label></div>
                                            <div className='col-9 col-xl-9 col-lg-9 col-sm-9'>
                                                <input className='profile-page'
                                                    value={this.state.industryType}
                                                    name='name' id='candidate' autocomplete="off" /></div>
                                        </div>
                                    </div>
                                    <div className="col-6 col-xl-6 col-lg-6 col-sm-6">
                                        <div className='row'>
                                            <div className="col-3 col-xl-3 col-lg-3 col-sm-3">
                                                <label for="question" className='form-label text-input-label'>Experience</label></div>
                                            <div className='col-9 col-xl-9 col-lg-9 col-sm-9'>
                                                <input className='profile-page'
                                                    value={this.state.experience}
                                                    name='name' id='candidate' autocomplete="off" /></div>
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="col-6 col-xl-6 col-lg-6 col-sm-6">
                                        <div className='row'>
                                            <div className="col-3 col-xl-3 col-lg-3 col-sm-3">
                                                <label for="question" className='form-label text-input-label'>Phone Number</label></div>
                                            <div className='col-9 col-xl-9 col-lg-9 col-sm-9'>
                                                <input className='profile-page'
                                                    value={this.state.phone}
                                                    name='name' id='candidate' autocomplete="off" /></div>
                                        </div>
                                    </div>
                                    <div className="col-6 col-xl-6 col-lg-6 col-sm-6">  
                                        <div className='row'>
                                            <div className='col-4 col-xl-4 col-lg-4 col-sm-4'>
                                                <Link to="/panelists/timeSlot" state={{id: this.state.id}} ><button className="btn btn-success">Time slot</button></Link>
                                            </div>

                                            <div className='col-4 col-xl-4 col-lg-4 col-sm-4'>
                                                <i className="fa fa-download " title="Download Resume" type='button' aria-hidden="true" onClick={() => this.handleResume()} data-toggle="modal" data-target="#exampleModalCenter"> Resume</i>
                                            </div>
                                            <div className='col-3 col-xl-3 col-lg-3 col-sm-3'>
                                                <button type="button" data-toggle="tooltip" data-placement="top" title="Add emails" onClick={() => this.onClickOpenModel(this.state.panelist)} className="btn btn ml-1"><i className="fa fa-paper-plane" aria-hidden="true"> Send Mail</i></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-6'>
                                        <div className='row'>
                                            <div className='col-3'>
                                                <label className='form-label text-input-label'>Verify Panelist</label>
                                            </div>
                                            <div className='col-6'>
                                                <div className="custom-control custom-radio custom-control-inline ml-3">
                                                    <input className="custom-control-input"
                                                        id="false"
                                                        type="radio"
                                                        onChange={(e) => this.handleChange(e, 'verifiedStatus')}
                                                        value="VERIFIED"
                                                        checked={this.state.verifiedStatus === "VERIFIED"} />
                                                    <label
                                                        className="custom-control-label"
                                                        for="false"
                                                    >
                                                        Verify
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6 col-xl-6 col-lg-6 col-sm-6">
                                        <div style={{ display: "flex", marginTop: "1rem" }}>
                                            <StatusRadioButton
                                                handleChange={(e)=> this.handleChange(e,"status")}
                                                status={this.state.status}
                                                style={{ marginTop: "0.1rem" }}
                                            />
                                        </div>
                                       
                                    </div>
                                </div>

                                <div className='col'>
                                    <div className='row'>
                                        <div className="col-md-11" style={{ display: 'flex', justifyContent: 'flex-end' }}><br></br>
                                            <button type="submit" className="btn btn-primary">Verify</button>
                                            <Link className="btn btn-default" to="/panelists" >Cancel</Link>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                {this.state.openModel ? (
                    <ContactPanelist
                        panelist={{ sendData: this.state.sendData }} onCloseModal={this.onCloseModal} />
                ) : ("")}
            </div>
        );
    }
}
export default withLocation(VerifyRecruiter)
