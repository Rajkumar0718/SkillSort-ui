import FormHelperText from '@mui/material/FormHelperText';
import axios from 'axios';
import _ from 'lodash';
import React, { Component } from 'react';
import CreatableSelect from 'react-select/creatable';
import { authHeader, errorHandler } from '../../api/Api';
import close from '../../assests/images/close.png';
import { toastMessage } from '../../utils/CommonUtils';
import { isEmpty, isValidName } from "../../utils/Validation";
import url from '../../utils/UrlConstant';

export default class SettingModel extends Component {
  state = {
    setting: {
      min: '',
      max: '',
      setting: [],
      searchKey: 'ACTIVE',
      qualifications: [],
      first: "",
      second: "",
      period: ['Month(s)', 'Week(s)', 'Day(s)'],
      interval: 'month(s)',
      number: '',
      errormsg: '',
      maxerrormsg: '',
      countError: false,
      id: '',
      name: '',
      sslcPercentage: '',
      hscPercentage: '',
      ugPercentage: '',
      pgPercentage: '',
      companyId: JSON.parse(localStorage.getItem("user")).companyId,
      options: []
    },
    error: {
      name: false,
      nameErrorMessage: '',
      min: false,
      minErrorMessage: '',
      max: false,
      maxErrorMessage: '',
      qualifications: false,
      qualificationsErrorMessage: '',
      sslcPercentage: false,
      sslcErrorMessage: '',
      hscPercentage: false,
      hscErrorMessage: '',
      ugPercentage: false,
      ugErrorMessage: '',
      number: false,
      examIntervalErrorMessage: ''
    }
  }

  handleChange = (event, key) => {
    const { setting, error } = this.state;
    if ((event.target.value <= 100 && event.target.value > 0 && event.target.value.length < 7 && key !== 'name') || event.target.value === "") {
      setting[key] = event.target.value;
      error[key] = false;
      this.setState({ setting, error });
    }
    if (key === 'name' && isValidName(event.target.value)) {
      setting[key] = event.target.value;
      error[key] = false;
      this.setState({ setting, error });
    }
  }

  msgChange = (event, key) => {
    const { setting, error } = this.state;
    if ((event.target.value <= 24 && event.target.value > 0 && event.target.value.length < 3) || event.target.value === "") {
      setting[key] = event.target.value;
      error[key] = false;
      this.setState({ setting, error });
    }
  }
  errorMsgUI = () => { }

  onMinAge = (event, key) => {
    const { setting, error } = this.state;
    if (event.target.value <= 60) {
      let minvalue;
      minvalue = Number(event.target.value);
      if (minvalue > this.state.setting.max) {
        setting.countError = true;
        setting.maxerrormsg = '';
        setting[key] = event.target.value;
        setting.errormsg = 'min value should be lesser than max';
        error[key] = false;
        this.setState({ setting, error });
        this.errorMsgUI = () => {
          return (
            <FormHelperText style={{ color: 'tomato' }}>{this.state.setting.errormsg}</FormHelperText>)
        }
      }
      else {
        const { setting } = this.state;
        setting.countError = false;
        setting.errormsg = '';
        setting.min = event.target.value;
        this.setState({ setting });
      }
    }
  }
  maxMsgUI = () => { }

  onMaxAge = (event, key) => {
    const { setting } = this.state;
    if (event.target.value <= 60) {
      let maxvalue;
      maxvalue = Number(event.target.value);
      if (this.state.setting.min > maxvalue) {
        setting.countError = true;
        setting.errormsg = '';
        setting[key] = event.target.value;
        setting.maxerrormsg = 'max value should be greater than min';
        this.setState({ setting });
        this.maxMsgUI = () => {
          return (
            <FormHelperText style={{ color: 'tomato' }}>{this.state.setting.maxerrormsg}</FormHelperText>)
        }
      }
      else {
        const { setting } = this.state;
        setting.errormsg = '';
        setting.maxerrormsg = '';
        setting.countError = false;
        setting.max = event.target.value;
        this.setState({ setting });
      }
    }
  }

  handleDropDown = (e, key) => {
    const { setting } = this.state;
    setting.interval = e.target.value;
    this.setState({ setting })
  }

  handleMultiSelect = (e) => {
    const { setting, error } = this.state;
    error.qualifications = false;
    var qualifications = [];
    _.map(e || [], val => qualifications.push(val.label));
    setting.qualifications = qualifications;
    this.setState({ setting, error });
  }

  handleSubmit = event => {
    const { setting, error } = this.state
    if (isEmpty(setting.name)) {
      error.name = true;
      error.nameErrorMessage = "Field Required !";
      this.setState({ error })
    } else {
      error.name = false;
      this.setState({ error })
    }
    if (isEmpty(setting.min)) {
      error.min = true;
      error.minErrorMessage = "Field Required !";
      this.setState({ error })
    } else {
      error.min = false;
      this.setState({ error })
    }
    if (isEmpty(setting.max)) {
      error.max = true;
      error.maxErrorMessage = "Field Required !";
      this.setState({ error })
    } else {
      error.max = false;
      this.setState({ error })
    }
    if (isEmpty(setting.qualifications)) {
      error.qualifications = true;
      error.qualificationsErrorMessage = "Field Required !";
      this.setState({ error })
    } else {
      error.qualifications = false;
      this.setState({ error })
    }
    if (isEmpty(setting.sslcPercentage)) {
      error.sslcPercentage = true;
      error.sslcErrorMessage = "Field Required !";
      this.setState({ error })
    } else {
      error.sslcPercentage = false;
      this.setState({ error })
    }
    if (isEmpty(setting.hscPercentage)) {
      error.hscPercentage = true;
      error.hscErrorMessage = "Field Required !";
      this.setState({ error })
    } else {
      error.hscPercentage = false;
      this.setState({ error })
    }
    if (isEmpty(setting.ugPercentage)) {
      error.ugPercentage = true;
      error.ugErrorMessage = "Field Required !";
      this.setState({ error })
    } else {
      error.ugPercentage = false;
      this.setState({ error })
    }
    if (isEmpty(setting.number)) {
      error.number = true;
      error.examIntervalErrorMessage = "Field Required !";
      this.setState({ error })
    } else {
      error.number = false;
      this.setState({ error })
    }
    event.preventDefault();
    if (!error.name && !error.max && !error.min && !error.qualifications && !error.sslcPercentage && !error.hscPercentage
      && !error.ugPercentage && !error.number) {
      if (this.state.setting.sslcPercentage > 100 || this.state.setting.hscPercentage > 100 ||
        this.state.setting.ugPercentage > 100 || this.state.setting.pgPercentage > 100) {
        return;
      }
      event.preventDefault();
      axios.post(` ${url.ADMIN_API}/setting/save`, this.state.setting, { headers: authHeader() })
        .then(res => {
          toastMessage('success', "Setting saved Successfully..!")
          this.props.onCloseModal();
        })
        .catch(error => {
          errorHandler(error);
        })
    }
  }

  render() {
    return (
      <div className="modal fade show" id="myModal" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.90)' }} aria-hidden="true">
        <div className="modal-dialogs" >
          <div className="modal-content" style={{ borderStyle: 'solid', borderColor: '#af80ecd1', borderRadius: "32px", height: "550px", width: "789px", verticalAlign: "center" }}>
            <div className="modal-header" style={{ padding: "2rem 2rem 0 3.85rem", border: "none" }}>
              <h5 className="setting-title"> Minimum Qualification</h5>
              <button type='button' onClick={this.props.onCloseModal} className="close" data-dismiss="modal" style={{ border: 'none',backgroundColor:"initial"}}>
                <img src={close} alt="" />
              </button>
            </div>
            {/* <div> <h6> Minimum Qualification</h6> </div> */}
            <div className="modal-body" style={{ overflow: "hidden", fontWeight: '400', height: "453px" }}>
              <form onSubmit={this.handleSubmit}>
                <div className='form-group row'>
                  <label className="col-md-3 col-sm-3 col-lg-3 col-form-label lable-text" >Name
                    <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{this.state.error.name ? this.state.error.nameErrorMessage : null}</FormHelperText></label>
                  <input type="text" className="name" style={{ marginLeft: '100px' , width:'457px' }} maxLength="50" autoComplete="off" value={this.state.setting.name} onChange={(e) => this.handleChange(e, 'name')} />
                </div>
                <div className='form-group' style={{ display: 'flex', position: 'relative', right: '12px', top: '8px', marginTop: "0.5rem" }}>
                  <label for='age-limit' className="col-md-3 col-sm-3 col-lg-3 col-form-label lable-text" >Age limit
                    <FormHelperText className="helper">{this.state.error.min ? this.state.error.minErrorMessage : null}</FormHelperText></label>
                  <input type='number' className="form-control-mini" min="1" autoComplete="off" value={this.state.setting.min} onChange={(e) => this.onMinAge(e, 'min')} style={{ transform: 'translate(100px,5px)' }} />
                  <span className='' style={{ transform: 'translate(100px,20px)' }}>to</span>
                  <input type='number' className="form-control-mini" min="1" autoComplete="off" value={this.state.setting.max} onChange={(event) => this.onMaxAge(event, 'max')} style={{ transform: 'translate(110px,5px)' }} />
                </div>
                <div style={{ marginTop: "2.5rem",fontFamily:'"Montserrat", "Times New Roman", Times, serif !important',fontSize: '0.775rem',fontWeight: '400',lineHeight: '0.5', marginLeft:'3.2rem'}}>
                  <label>Min SSLC %
                    <FormHelperText className="helper">{this.state.error.sslcPercentage ? this.state.error.sslcErrorMessage : null}</FormHelperText></label>
                  <input type='number' min="1" value={this.state.setting.sslcPercentage} autoComplete="off" onChange={(event) => this.handleChange(event, 'sslcPercentage')} style={{border: 'none',borderBottom: '1.5px solid black', marginLeft:'3.4rem',outline:'none'}}/>
                  <label style={{marginLeft:'1rem'}}>Min HSC %
                    <FormHelperText className="helper">{this.state.error.hscPercentage ? this.state.error.hscErrorMessage : null}</FormHelperText></label>
                  <input type='number'  min="1" value={this.state.setting.hscPercentage} autoComplete="off" onChange={(event) => this.handleChange(event, 'hscPercentage')}  style={{border: 'none',borderBottom: '1.5px solid black', marginLeft:'1rem',outline:'none'}}/>
                </div>
                <div style={{marginTop: "2rem", fontFamily: '"Montserrat", "Times New Roman", Times, serif !important', fontSize: '0.775rem', fontWeight: '400', lineHeight: '0.5', marginLeft: '3.2rem' }}>
                  <label>Min UG %
                    <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{this.state.error.ugPercentage ? this.state.error.ugErrorMessage : null}</FormHelperText></label>
                  <input type='number' min="1" value={this.state.setting.ugPercentage} autoComplete="off" onChange={(event) => this.handleChange(event, 'ugPercentage')} style={{ border: 'none', borderBottom: '1.5px solid black', marginLeft: '4.1rem', outline: 'none' }} />
                  <label style={{ marginLeft: '1rem' }}>Min PG %</label>
                  <input type='number' min="1" value={this.state.setting.pgPercentage} autoComplete="off" onChange={(event) => this.handleChange(event, 'pgPercentage')} style={{ border: 'none', borderBottom: '1.5px solid black', marginLeft: '1.6rem', outline: 'none' }} />
                </div>
                <div>
                  <div style={{marginTop: "2rem", fontFamily: '"Montserrat", "Times New Roman", Times, serif !important', fontSize: '0.775rem', fontWeight: '400', lineHeight: '0.5', marginLeft: '3.2rem' }}>
                    <label required>Test Interval
                      <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{this.state.error.number ? this.state.error.examIntervalErrorMessage : null}</FormHelperText></label>
                    <input  onChange={(e) => this.msgChange(e, 'number')}
                      value={this.state.setting.number} autoComplete="off"
                      name='name' id='section' type="text" style={{ border: 'none', borderBottom: '1.5px solid black', marginLeft: '3rem', outline: 'none', width:'100px'}} >
                    </input>
                    <select style={{ width: '6.9rem', padding: "0px",border: 'none', borderBottom: '1.5px solid black', marginLeft: '1rem', outline: 'none',backgroundColor:"initial",color:"#3b489e" }}
                      value={this.state.setting.interval}
                      onChange={(e) => this.handleDropDown(e, 'interval')}>
                      {this.state.setting.period.map((key, value) => {
                        return <option value={key}>{key}</option>
                      })}
                    </select>
                  </div>
                </div>
                <div  style={{ marginBottom: "0px" }}>
                  <div style={{marginTop: "3rem", fontFamily: '"Montserrat", "Times New Roman", Times, serif !important', fontSize: '0.775rem', fontWeight: '400', lineHeight: '0.5', marginLeft: '3.2rem' }}>
                    <label>Qualifications
                      <FormHelperText className="helper" style={{ paddingLeft: "0px", width: "11.80rem" }}>{this.state.error.qualifications ? this.state.error.qualificationsErrorMessage : null}</FormHelperText></label>
                  </div>
                  <div style={{maxWidth:'41.6667%', marginTop:'-25px', marginLeft:'11rem'}}>
                    <CreatableSelect isMulti onChange={this.handleMultiSelect} options={this.state.setting.options} styles />
                  </div>
                  <div style={{ position:'relative',left:'35rem'}}>
                    <button disabled={this.state.setting.countError} type="submit" className="btn btn-sm btn-nxt">Save</button>
                  </div>
                </div>



                {/* <div className="form-group row">
                                    <div className="col-md-11">
                                        <div style={{ float: "right" }}>
                                            <button disabled={this.state.setting.countError} type="submit" className="btn btn-sm btn-nxt">Save</button>
                                        </div>
                                    </div>
                                </div> */}
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
