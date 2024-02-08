import axios from 'axios';
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { authHeader, errorHandler } from '../../api/Api';
import { toastMessage } from '../../utils/CommonUtils';
import url  from '../../utils/UrlConstant';


export default class CandidateEdit extends Component {
  state = {
    userName: '',
    qualification: '',
    email: '',
    gender: '',
    institution: '',
    phone: '',
    dob: '',
    examId: '',
    latestExam: 'No Exams',
    examDate: '',
    permission: "false",
    candidates: {
      adminPermission: false
    }
  }



  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  componentDidMount() {

    axios.get(`${url.ADMIN_API}/exam/${this.state.examId}`, { headers: authHeader() })
      .then(res => {
        if (res.data.response !== null) {
          this.setState({
            latestExam: res.data.response.name,
            examDate: new Date(res.data.response.startDateTime).getDate() + '-' + this.months[new Date(res.data.response.startDateTime).getMonth()] + '-' + new Date(res.data.response.startDateTime).getFullYear()
          })
        }
      }).catch((error) => {
        errorHandler(error);
      });
  }

  componentWillMount() {
    if (this.props.location.pathname.indexOf('edit') > -1) {
      const { candidate } = this.props.location.state;
      this.setState({
        candidates: candidate,
        userName: candidate.firstName + "  " + candidate.lastName,
        qualification: candidate.qualification,
        email: candidate.email,
        gender: candidate.gender,
        institution: candidate.institution,
        phone: candidate.phone,
        dob: new Date(candidate.dob).getDate() + '-' + this.months[new Date(candidate.dob).getMonth()] + '-' + new Date(candidate.dob).getFullYear(),
        examId: candidate.examId,

      })
    }
  }

  handleSubmit = event => {
    event.preventDefault();
    axios.put(` ${url.ADMIN_API}/candidate/update`, this.state.candidates, { headers: authHeader() })
      .then(res => {
        if (res.data.response.adminPermission === true) {
          toastMessage('success', 'Permission Granted !');
        } else {
          toastMessage('success', 'Permission Denied !');
        }
      })
      .catch(error => {
        errorHandler(error);
      })
  }

  handleChange(event, key) {
    this.setState({ [key]: event.target.value })
    if (event.target.value === "true") {
      this.setState(prevState => {
        let candidates = { ...prevState.candidates };
        candidates.adminPermission = true;
        return { candidates };
      })
    } else {
      this.setState(prevState => {
        let candidates = { ...prevState.candidates };
        candidates.adminPermission = false;
        return { candidates };
      })
    }
  }

  render() {
    return (
      <main className="main-content bcg-clr">
        <div>
          <div className="container-fluid cf-1">
            <div className="card-header-new">
              Candidate Details
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="table-border-cr">
                  <form className="email-compose-body" onSubmit={this.handleSubmit}>
                    <div className="send-header">
                      <div className="row">
                        <div className="mc-3">
                          <label className="form-label-row">Candidate Name</label>
                          <input className='form-control-row'
                            value={this.state.userName}
                            name='name' id='candidate' autocomplete="off" />
                        </div>
                        <div className="mc-3">
                          <label className="form-label-row">Qualification</label>
                          <input className='form-control-row'
                            value={this.state.qualification}
                            name='name' id='candidate' autocomplete="off" />
                        </div>
                        <div className="mc-3">
                          <label className="form-label-row">Email</label>
                          <input className='form-control-row'
                            value={this.state.email}
                            name='name' id='candidate' autocomplete="off" />
                        </div>
                        <div className="mc-3">
                          <label className="form-label-row">Gender</label>
                          <input className='form-control-row'
                            value={this.state.gender}
                            name='name' id='candidate' autocomplete="off" />
                        </div>
                        <div className="mc-3">
                          <label className="form-label-row">Institution</label>
                          <input className='form-control-row'
                            value={this.state.institution}
                            name='name' id='candidate' autocomplete="off" />
                        </div>
                        <div className="mc-3">
                          <label className="form-label-row">PhoneNumber</label>
                          <input className='form-control-row'
                            value={this.state.phone}
                            name='name' id='candidate' autocomplete="off" />
                        </div>
                        <div className="mc-3">
                          <label className="form-label-row">Date of Birth</label>
                          <input className='form-control-row'
                            value={this.state.dob}
                            name='name' id='candidate' autocomplete="off" />
                        </div>
                        <div className="mc-3">
                          <label className="form-label-row">Latest Test</label>
                          <input className='form-control-row'
                            value={this.state.latestExam}
                            name='name' id='candidate' autocomplete="off" />
                        </div>
                        <div className="mc-3">
                          <label className="form-label-row">Test Date</label>
                          <input className='form-control-row'
                            value={this.state.examDate}
                            name='name' id='candidate' autocomplete="off" />
                        </div>
                        <div className="mc-3">
                          <div>
                            <label className="form-label-row" ><strong>Permission status </strong></label>
                          </div>
                          <div className="custom-control custom-radio custom-control-inline ml-3">
                            <input className="custom-control-input"
                              id="false"
                              type="radio"
                              onChange={(e) => this.handleChange(e, 'permission')}
                              value="false" name="permission"
                              checked={this.state.permission === "false" || this.state.permission === ""} />
                            <label
                              className="custom-control-label"
                              for="false"
                            >
                              Not Permitted
                            </label>
                          </div>
                          <div className="custom-control custom-radio custom-control-inline ml-3">
                            <input className="custom-control-input"
                              id="true"
                              type="radio"
                              onChange={(e) => this.handleChange(e, 'permission')}
                              value="true" name="permission"
                              checked={this.state.permission === "true"} />
                            <label
                              className="custom-control-label"
                              for="true"
                            >
                              Permitted
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-md-12">
                          <div style={{ float: "right" }}>
                            <button type="submit" className="btn btn-primary">update</button>
                            <Link className="btn btn-default" to="/admin/candidates">Cancel</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    );
  }
}
