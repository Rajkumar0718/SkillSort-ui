import { FormHelperText } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { errorHandler } from '../../api/Api';
import '../../assests/css/Login.css';
import "../../assests/css/ReactToast.css";
import skillsort from '../../assests/images/Frame.png';
import { toastMessage } from '../../utils/CommonUtils';
import  url  from '../../utils/UrlConstant';
import { isEmpty, isValidEmail, isValidPassword } from '../../utils/Validation';


const AdminLogin = () => {
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const role = 'COLLEGE_STUDENT'
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState('');
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);

  const navigate = useNavigate;

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'email') setEmail(value);
    if (name === 'newPassword') setNewPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
  }

  useEffect(()=>{
    validatePassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[newPassword])

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setNewPassword(newPassword);
    validatePassword();
  }
    useEffect(()=>{
        validateConfirmPassword();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[confirmPassword])

  const handleConfirmPasswordChange = (event) => {
    const confirmPassword = event.target.value;
    setConfirmPassword(confirmPassword);
    validateConfirmPassword();
  }

  // Password and Confirm Password validation part
  const validatePassword = () => {
    let passwordErrorMessage = '';
    if (!newPassword) {
      passwordErrorMessage = 'Password is required';
    } else if (!isValidPassword(newPassword)) {
      passwordErrorMessage = 'Password must be at least 8 - 20 characters, a Number and a Special Character ';
    }
    setPasswordErrorMessage(passwordErrorMessage);
  }

  const validateConfirmPassword = () => {
    let confirmPasswordErrorMessage = '';
    if (!confirmPassword) {
      confirmPasswordErrorMessage = 'Confirm password is required';
    } else if (newPassword !== confirmPassword) {
      confirmPasswordErrorMessage = 'Passwords do not match';
    }
    setConfirmPasswordErrorMessage(confirmPasswordErrorMessage);
  }

  // Password Shoe and Hide Part
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  }

  const handleNextClick = (event) => {
    event.preventDefault();
    let emailErrorMessage = '';
    if (isEmpty(email)) {
      emailErrorMessage = 'Enter Email';
    }
    else if(!isValidEmail(email)){
      emailErrorMessage = 'Enter valid Email';
    }else{
      axios.get(`${url.COLLEGE_API}/student/find-student/${email}`)
      .then(res => {
        if(res.data === null){
            toastMessage('error',"User Id doesn't exist please contact your placement co-ordinator");
          } else {
            setStep(2);
          }
        })
        .catch((error) => {
          errorHandler(error);
        });
    }
    setEmailErrorMessage(emailErrorMessage);
  };

  const handleSignUpClick = (event) => {
    event.preventDefault();

    if (step === 2) {
      validatePassword();
      validateConfirmPassword();

      if (newPassword === confirmPassword && (!isEmpty(newPassword) && !isEmpty(confirmPassword))) {
        setDisableBtn(true)
        axios.post(`${url.COLLEGE_API}/student/set`, {
          email: email,
          newPassword: newPassword,
          role: role,
        }).then((response) => {
          navigate("/")
        }).catch((error) => {
            setDisableBtn(false)
            errorHandler(error);
        });
      }
    }
  };

  return (
    <>
        <div className='login-background'>
            <div className='container dp'>
                <div>
                    <p className='login-content' >
                        Matching <br />Fresh talents<br /> to great opportunities
                    </p>
                </div>
                <div className='login-box' style={{marginRight:"50px"}}>
                    <div><img src={skillsort} alt='SkillSort' /></div>
                    <div>
                        <form className='sign-in'>
                            {step === 1 && (
                                <>
                                    <div className='text-pad'>
                                        <div>
                                            <input className='login-textfield input-text' placeholder='Email' type='email' name="email" onChange={handleChange} value={email} style={{marginTop:"25px", marginLeft:"10px", fontSize:"18px", WebkitTextFillColor: 'white' }} />
                                            <FormHelperText style={{ color:'white', position:"fixed", marginLeft:"15px", fontSize:"15px" }} className='helper helper-candidate'>{emailErrorMessage && <span style={{ color: 'red' }}>{emailErrorMessage}</span>}</FormHelperText>
                                        </div>
                                            <br />
                                        <div className='login-pad' style={{marginBottom:"50px"}}>
                                            <button type='submit' className='btn-sm btn btn-prev' style={{ width: '9rem', fontSize:"18px"}} onClick={handleNextClick}>Next</button>
                                        </div>
                                        <div style={{marginBottom:"20px"}}>
                                            <label style={{ color:'white', fontSize:'15px', marginLeft:'10px'}}>Already have an account ? - </label>
                                            <a className='login-a' href='/login' style={{ color: '#3b489e', marginLeft:'10px' }}>Login</a>
                                            {/* <Link style={{ color:'#3b489e', fontSize:'15spx', marginLeft:'10px'}} to="/login">Login</Link> */}
                                        </div>
                                    </div>
                                </>
                            )}
                            {step === 2 && (
                                <>
                                    <div style={{ height: '40px' }} className='text-pad'>
                                        <input className='login-textfield input-text' type={showPassword ? 'text' : 'password'} placeholder='Password' value={newPassword} name="newPassword" onChange={handlePasswordChange} style={{ fontSize:"18px", marginTop:'30px', WebkitTextFillColor: 'white' }} />
                                        <span onClick={togglePasswordVisibility} style={{ display:"flex",cursor: "pointer",fontSize:"10px",marginLeft:"215px",marginTop:"-21px",fontWeight:"600",  color:"white" }}>
                                            {showPassword ? <FaEye style={{fontSize:'18px', marginTop:'-5px'}} /> : <FaEyeSlash style={{fontSize:'18px', marginTop:'-5px'}} />}
                                        </span>
                                        <FormHelperText style={{ color: 'white', position:"fixed", fontSize:"12px", width:'18rem', marginTop:'12px'}} className='helper helper-studentLogin'>{passwordErrorMessage && <span style={{ color: 'red' }}>{passwordErrorMessage}</span>}</FormHelperText>
                                    </div><br></br>
                                    <div style={{ height: '40px', marginTop:'30px'}} className='text-pad'>
                                        <input className='login-textfield input-text' type={showConfirmPassword ? 'text' : 'password'} placeholder='Confirm Password' value={confirmPassword} name="confirmPassword" onChange={handleConfirmPasswordChange} style={{ fontSize:"18px", marginTop:'25px', WebkitTextFillColor: 'white' }} />
                                        <span onClick={toggleConfirmPasswordVisibility} style={{ display:"flex",cursor: "pointer",fontSize:"10px",marginLeft:"215px",marginTop:"-21px",fontWeight:"600", color:"white" }}>
                                            {showConfirmPassword ? <FaEye style={{fontSize:'18px', marginTop:'-5px'}}/> : <FaEyeSlash style={{fontSize:'18px', marginTop:'-5px'}} />}
                                        </span>
                                        <FormHelperText style={{ color: 'white', position:"fixed", fontSize:"15px", marginTop:'12px' }} className='helper helper-studentLogin'>{confirmPasswordErrorMessage && <span style={{ color: 'red' }}>{confirmPasswordErrorMessage}</span>}</FormHelperText>
                                    </div><br></br>
                                    <div className='login-pad' style={{display:'flex'}}>
                                        <button type='submit' className='login-button' style={{ width: '9rem', fontSize:"18px",marginBottom:"30px"}} disabled= {disableBtn} onClick={handleSignUpClick}>Set Password</button>
                                    </div>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </>
);

}

export default AdminLogin;



