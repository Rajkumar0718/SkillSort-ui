import { FormHelperText } from '@mui/material';
import axios from 'axios';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import '../../assests/css/VerifyOtp.css';
import url from '../../utils/UrlConstant';
import TimeCounter from '../../utils/TimeCounter';
import { sendOtp } from '../../common/SendOtpApi';
import { toastMessage } from '../../utils/CommonUtils';

export default class VerifyOtp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      otp: 0,
      email: this.props.email,
      disableResendOtp: true,
      showTimer: true,
      error: {
        error: false,
        errorMessage: ''
      }
    }
  }

  handleSubmit() {
    axios.post(`${url.ADMIN_API}/admin/verify/company/otp?otp=${this.state.otp}&email=${this.state.email}`).then(res => {
      toast.success("Otp Verified")
      this.props.otpVerify()
    }).catch(error => {
      toast.error("Invalid Otp")
    })
  }

  handleChange = (event) => {
    this.setState({ otp: event.target.value })
  }

  requestOtp =  async () => {
    let res = await sendOtp(this.props.email)
    if(res === 'error') {
      return toastMessage('error', "Error while sending otp")
    }
      this.setState({showTimer: true, disableResendOtp: true})
  }

  otpTimeUp = () => {
    this.setState({disableResendOtp: false,showTimer: false})
  }


  render() {
    return (
      <div style={{ overflow: "hidden",marginTop:'3rem' }}>
        <div class="content" >
          <h1> OTP Verification</h1>
          <div class="instruction">Please enter your OTP code sent to your email ID</div>
          <div class="otp-form-wrapper">
            <h1>{this.state.timer}</h1>
            <form id="otpForm" class="otp-form" >
              <input class="otp-form__code-input" type="tel" min="0" max="9" maxLength={6} onChange={this.handleChange} />
              <FormHelperText >{this.state.error.error ? this.state.error.errorMessage : null}</FormHelperText>
            </form>
            <div style={{ display: 'flex', justifyContent: 'center',marginTop:'1rem' }}>
            {this.state.showTimer && <TimeCounter otpTimeUp = {this.otpTimeUp}/>}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
              <button type="submit" class="btn btn-sm btn-prev" style={{ width: "100px", marginLeft: '1rem' }} onClick={() => this.requestOtp()} disabled={this.state.disableResendOtp}> Resend Otp</button>
              <button type="submit" class="btn btn-sm btn-nxt" style={{ width: "100px", marginLeft: '10rem' }} onClick={() => this.handleSubmit()}> Verify</button>

            </div>
            <div id="verificationResult" class="verification-message"></div>
          </div>
        </div>
      </div>
    )
  }
}