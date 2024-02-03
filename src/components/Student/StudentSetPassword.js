import React, { useState } from 'react';
import { Card, CardContent, FormHelperText } from '@mui/material';
import axios from 'axios';
import LOGO from '../../assets/images/LOGO.svg';
import  url  from '../../utils/UrlConstant';
import { isEmpty, isValidEmail, isValidPassword } from '../../utils/Validation';

const StudentSetPassword = (props) => {
    const [student, setStudent] = useState({
        email: props?.location?.state[0],
        newPassword: '',
        id: '',
        role: 'COLLEGE_STUDENT',
    });

    const [cPassword, setCPassword] = useState('');

    const [error, setError] = useState({
        email: false,
        emailErrorMessage: '',
        newPassword: false,
        passwordErrorMessage: '',
        cPassword: false,
        cPasswordErrorMessage: '',
    });

    const [disabled, setDisabled] = useState(false);

    const handleChange = (event, key) => {
        setStudent({
            ...student,
            [key]: event.target.value
        });

        setError({
            ...error,
            [key]: false
        });
    };

    const handleSubmit = (event) => {
        const { email, newPassword } = student;
        const newError = {};

        if (isEmpty(email) || !isValidEmail(email)) {
            newError.email = true;
            newError.emailErrorMessage = isEmpty(email) ? 'Enter Email' : 'Enter valid Email';
        }

        if (isEmpty(newPassword) || !isValidPassword(newPassword)) {
            newError.newPassword = true;
            newError.passwordErrorMessage = isEmpty(newPassword) ? 'Set Password' : '8 - 20 words, a Number and a Special Character';
        }

        if (newPassword !== cPassword) {
            newError.cPassword = true;
            newError.cPasswordErrorMessage = "Password Doesn't Match";
        }

        setError(newError);

        event.preventDefault();

        if (!newError.email && !newError.newPassword && !newError.cPassword) {
            setDisabled(true);
            const user = student;

            axios.post(`${url.COLLEGE_API}/student/set`, user)
                .then(() => props.history.push("/"))
                .catch((err) => errorHandler(err));
        }
    };

    return (
        <div>
            <div className='header'>
                <div className='col-4'>
                    <img className='header-logo' src={LOGO} alt="SkillSort" />
                </div>
            </div>
            <h2 className="font-weight-bold py3" style={{ textAlign: "center" }}>Set Password</h2>
            <div className='row'>
                <CardContent>
                    <Card style={{ width: '760px', marginLeft: '265px', height: '333px' }}>
                        <div className="row" style={{ marginTop: '2rem' }}>
                            <div className="col-6 competitor-login" style={{ height: '3rem' }}>
                                <label className="form-label text-label" for="form12">Email*
                                    <FormHelperText className='helper helper-candidate'>{error.email ? error.emailErrorMessage : null}</FormHelperText></label>
                            </div>
                            <div className="col competitor-input" style={{ paddingLeft: '0' }}>
                                <input className="profile-page" type='email' label='Email' name='email' maxLength="50" value={student.email} id='email' aria-label="default input example" readOnly={true} /><span className='required'></span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6 competitor-login" style={{ height: '3rem' }}>
                                <label className="form-label text-label" for="form12">New Password*
                                    <FormHelperText className='helper helper-candidate'>{error.newPassword ? error.passwordErrorMessage : null}</FormHelperText></label>
                            </div>
                            <div className="col competitor-input" style={{ paddingLeft: '0' }}>
                                <input className="profile-page" autoComplete='current-password' label='Password' type='password' name='password' maxLength="20" min={1} max={100} onChange={(e) => handleChange(e, 'newPassword')} value={student?.newPassword} id='password' aria-label="default input example" /><span className='required'></span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6 competitor-login" style={{ height: '3rem' }}>
                                <label className="form-label text-label" for="form12">Confirm Password*
                                    <FormHelperText className='helper helper-candidate'>{error.cPassword ? error.cPasswordErrorMessage : null}</FormHelperText></label>
                            </div>
                            <div className="col competitor-input" style={{ paddingLeft: '0' }}>
                                <input className="profile-page" autoComplete='current-password' type='password' label='Password' name='password' maxLength="20" min={1} max={100} onChange={(e) => this.setState({ cPassword: e.target.value })} value={cPassword} id='password' aria-label="default input example" /><span className='required'></span>
                            </div>
                        </div>
                        <div className='login-pad'>
                            <button className='login-button' onClick={handleSubmit}>Login</button>
                        </div>
                    </Card>
                </CardContent>
            </div>
        </div>
    );
};

export default StudentSetPassword;
