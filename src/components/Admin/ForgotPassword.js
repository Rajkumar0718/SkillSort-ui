import { Button, FormHelperText, TextField } from '@mui/material';
import axios from 'axios';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { errorHandler } from '../../api/Api';
import skillSort from '../../assests/images/skill-sort.png';
import { toastMessage, withLocation } from '../../utils/CommonUtils';
import  url  from '../../utils/UrlConstant';
import { isEmpty, isValidEmail } from '../../utils/Validation';


class ForgetPassword extends Component {
  constructor() {
    super()
    this.state = {
      field: {
        email: '',
        otp: '',
      },
      password: {
        newPassword: '',
        confirmPassword: '',
      },
      disable: false,
      showOtpField: false,
      error: {
        email: false,
        emailErrorMessage: '',
        otp: false,
        otpErrorMessage: '',
        newPassword: false,
        newPasswordErrorMessage: '',
        confirmPassword: false,
        confirmPasswordErrorMessage: '',
      },
    }
  }

  handleChange = (event, key) => {
    const { field, error } = this.state
    field[key] = event.target.value;
    error[key] = false;
    this.setState({ field, error })
  }

  handlePasswordChange = (event, key) => {
    const { password, error } = this.state
    password[key] = event.target.value;
    error[key] = false;
    this.setState({ password, error })
  }

  handleOTP = (event) => {
    const { field, error } = this.state
    if (isEmpty(field.email) || !isValidEmail(field.email)) {
      error.email = true;
      error.emailErrorMessage = isEmpty(field.email) ? "Field Required!" : 'Enter Valid Email!!!'
      this.setState({ field, error })
    } else {
      this.setState({ error })
    }
    event.preventDefault();
    if (!error.email) {
      axios.post(` ${url.ADMIN_API}/admin/forgot-password?email=${field.email}`)
        .then(() => {
          toast.success('Verification OTP has sent to your Email');
          this.setState({ showOtpField: true });
        }).catch(error => {
          errorHandler(error);
        })
    }
  }

  handleVerifyOTP = (event) => {
    const { field, password, error } = this.state
    if (isEmpty(field.email)) {
      error.email = true;
      error.emailErrorMessage = "Enter Email!!!";
      this.setState({ error })
    } else {
      error.email = false;
      this.setState({ error })
    }
    if (isEmpty(password.newPassword)) {
      error.newPassword = true;
      error.newPasswordErrorMessage = "Enter Password!!!";
      this.setState({ error })
    } else {
      error.newPassword = false;
      this.setState({ error })
    }
    if (isEmpty(password.confirmPassword)) {
      error.confirmPassword = true;
      error.confirmPasswordErrorMessage = "Enter Password!!!";
      this.setState({ error })
    } else {
      error.confirmPassword = false;
      this.setState({ error })
    }
    if (password.newPassword !== password.confirmPassword) {
      error.confirmPassword = true;
      error.confirmPasswordErrorMessage = "Password Doesn't Match!!!"
      this.setState({ error })
    } else {
      error.confirmPassword = false;
      this.setState({ error })
    }
    if (isEmpty(field.otp)) {
      error.otp = true;
      error.otpErrorMessage = 'Please Enter OTP!!!'
      this.setState({ field, error })
    } else {
      this.setState({ field, error })
    }
    event.preventDefault();
    if (!error.otp && !error.newPassword && !error.confirmPassword && !error.email) {
      let pwdObj = {};
      pwdObj.email = field.email;
      pwdObj.newPassword = password.newPassword;
      pwdObj.confirmPassword = password.confirmPassword;
      pwdObj.otp = field.otp;
      axios.post(` ${url.ADMIN_API}/admin/verify-otp`, pwdObj)
        .then(() => {
          toastMessage('success', 'Password Reset Successfully');
          this.props.navigate('/');
        }).catch(error => {
          errorHandler(error)
        })
    }
  }

  otpVerification = () => {
    const { error } = this.state
    return <>
      <div className="p-2">
        <h4>Forgot your password?</h4>
        <small>Enter Your Email to get Verification OTP.</small>
      </div>
      <div className="p-2">
        <form onSubmit={this.handleVerifyOTP}>
          <div style={{ height: '4rem' }}>
            <TextField size="small" className="col-6 mb-2" id="outlined-basic" label="Enter Your Email" variant="outlined" onChange={(event) => this.handleChange(event, 'email')} /><br></br>
            <FormHelperText style={{ textAlign: 'center' }} className='helper '>{error.email ? error.emailErrorMessage : null}</FormHelperText>
          </div>
          {this.state.showOtpField ?
            <div>
              <div className='forgot-password'>
                <TextField size="small" className="col-6 mb-2" id="outlined-basic" label="Enter OTP here" variant="outlined" onChange={(event) => this.handleChange(event, 'otp')} /><br></br> <FormHelperText style={{ textAlign: 'center' }} className='helper'>{error.otp ? error.otpErrorMessage : null}</FormHelperText>
              </div>
              <div className='forgot-password'>
                <TextField size="small" className="col-6 mb-2" id="outlined-basic" label="New Password" name='newPassword' type='password' variant="outlined" onChange={(event) => this.handlePasswordChange(event, 'newPassword')} /><br></br> <FormHelperText style={{ textAlign: 'center' }} className='helper'>{error.newPassword ? error.newPasswordErrorMessage : null}</FormHelperText>
              </div>
              <div className='forgot-password'>
                <TextField size="small" className="col-6 mb-2" id="outlined-basic" label="Confirm Password" name='confirmPassword' type='password' variant="outlined" onChange={(event) => this.handlePasswordChange(event, 'confirmPassword')} /><br></br> <FormHelperText style={{ textAlign: 'center' }} className='helper'>{error.confirmPassword ? error.confirmPasswordErrorMessage : null}</FormHelperText></div>
            </div> : ''}
          {!this.state.showOtpField ?
            <>
              <Button className="col-6" style={{ marginTop: '0.5rem' }} disabled={this.state.disable} onClick={this.handleOTP} variant="contained">Send confirmation</Button><br></br>
            </> : <>
              {/* <Button className="col-6" style={{ marginTop: '0.5rem' }} onClick={this.handleVerifyOTP} variant="contained" >Click to Continue</Button><br></br> */}
              <button type='sumbit' className='col-6 btn btn-sm btn-nxt' style={{ marginTop: '0.5rem' }}>Click to Continue</button>
            </>}
        </form>
      </div>
    </>
  }

  render() {
    return (
      <div className="container">
        <div className='row'>
          <div className="col  ">
            <div className="text-center mt-5">
              <br></br>
              <img src={skillSort} style={{ width: '8.5rem', height: '4rem' }} alt='skillSort' />
              {this.otpVerification()}
              <div className="ml-2">
                <a href="/" style={{ textDecoration: 'none' }}> <small>{"<<"} Back to login</small></a>
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }

}
export default withLocation(ForgetPassword);