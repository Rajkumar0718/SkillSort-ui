import { Box, Card, CardContent, FormHelperText } from '@mui/material';
import axios from 'axios';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { errorHandler } from '../../api/Api';
import LOGO from '../../assests/images/LOGO.svg';
import { withLocation } from '../../utils/CommonUtils';
import  url  from '../../utils/UrlConstant';
import { isEmpty, isValidEmail } from '../../utils/Validation';

function PublicRegister() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState({})
  const navigate = useNavigate();
  const { companyId } = useParams()
  const { examId } = useParams()
  const [company, setCompany] = useState({})
  const [companyLogo, setCompanyLogo] = useState('')

  const handleNext = () => {
    let err = _.clone(error)
    if (isEmpty(email) || !isValidEmail(email)) {
      err['email'] = true;
      err['emailErrorMessage'] = isEmpty(email) ? "Field Required !" : "Enter Valid Email";
      setError(err)
    } else {
      err['email'] = false;
      setError(err)
      navigate(`/public-candidate/register/${companyId}/${examId}`, {state: email })
    }
  }

  const handleEnterKeyPress = (e) => {
    // Check if the pressed key is Enter (key code 13)
    if (e.key === 'Enter') {
      handleNext();
    }
  }

  useEffect(() => {
    localStorage.clear()
    getCompany()
    getLogo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getCompany = () => {
    axios.get(`${url.ADMIN_API}/company/company-id/${companyId}`)
      .then(res => {
        setCompany(res.data.response)
      }).catch(err => errorHandler(err));
  }

  const getLogo = () => {
    axios.get(`${url.ADMIN_API}/company/logo/${companyId}`)
      .then(res => {
        setCompanyLogo(res.data.message)
      })
      .catch(err => errorHandler(err))
  }

  return (
    <>
      <div className='header'>
        <img className='header-logo' src={LOGO} alt="SkillSort" />
        <div className='header-right'>
        </div>
      </div>
      <div className='container' style={{ height: '100vh' }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          flexDirection='column'
        >
          <Card elevation={15} style={{ height: '15rem', width: '40rem', backgroundColor: 'rgb(194 195 200 / 39%)' }}>
            <div style={{ textAlign: 'center', transform: 'translateX(30px)', marginTop: '1rem', width: '90%', overflow: 'hidden', whiteSpace: 'nowrap' }} >
              <span title={company.name} style={{ textOverflow: 'ellipsis', display: 'block', overflow: ' ' }} className='setting-title'>{company.name}</span>
            </div>
            <img style={{ width: '100px', height: '50px', transform: 'translate(250px,15px)' }} src={`data:image/png;base64,${companyLogo}`} alt='logo' ></img>
            <CardContent style={{ marginTop: '1.5rem', display: 'grid', placeItems: 'center' }}>
              <input placeholder='Enter Email' className="profile-page" type='text' value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '.5rem' }} onKeyDown={handleEnterKeyPress}/>
              <FormHelperText className="helper helper-candidate">{error.email ? error.emailErrorMessage : null}</FormHelperText>
            </CardContent>
          </Card>
          <div className="row">
            <div className="mb-3 col-lg-11" style={{ paddingRight: '7px' }}>
              <button onClick={() => handleNext()} type="submit" disabled={!email.trim()} className="btn btn-sm btn-nxt" style={{ float: 'right' }}>Next</button>
            </div>
          </div>
        </Box>
      </div >
    </>
  )
}

export default withLocation(PublicRegister)