import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { authHeader, getCurrentUser } from '../api/Api';
import LOGO from '../assests/images/LOGO.svg';
import DEMO from '../assests/images/admin.png';
import { toastMessage, withLocation } from '../utils/CommonUtils';
import url from '../utils/UrlConstant';
import './Common.css';
import { isRoleValidation } from '../utils/Validation';
import { Badge } from '@mui/material';
import _ from 'lodash';

function Header(props) {
  const [candidates, setCandidates] = useState([]);
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    if (isRoleValidation() === 'ADMIN' || isRoleValidation() === 'HR') {
      getReexamCandidateCount();
    }
  }, [location]);

  const getReexamCandidateCount = () => {
    let companyId = JSON.parse(localStorage.getItem('user')).companyId;
    axios
      .get(`${url.CANDIDATE_API}/candidate/search/${companyId}?searchValue=${''}`, {
        headers: authHeader(),
      })
      .then((res) => {
        setCandidates(res.data.response);
      })
      .catch((error) => {
        toastMessage('error', error.response?.data?.message);
      });
  };

  const goToLogout = (e) => {
    e.preventDefault();
    props.logOut();
  };

  return (
      <div className='header'>
        <img className='header-logo' src={LOGO} alt='SkillSort' />
        <div className='header-right'>
          <div className='header-right-a'>
            {(isRoleValidation() === 'HR' || isRoleValidation() === 'ADMIN') &&
            pathname !== '/admin/candidates' ? (
              <Link to='/admin/candidates' state= {{candidates: candidates } }>
                <Badge color='secondary' badgeContent={_.size(candidates)} >
                  <i
                    className='fa fa-user-o'
                    aria-hidden='true'
                    title='ReExam-Request'
                    style={{ fontSize: '1.4rem', color: 'white' }}
                  ></i>
                </Badge>
                </Link>
            ) : null}
          </div>
          <hr className='vr' />
          <div className='header-right-a header-name-content'>
            <p className='header-name'>
              <b>{getCurrentUser()?.username}</b>
            </p>
            <div className='div-in-side'>
              <Link to={props.profile || window.location.pathname}>
                <button className='a-tag'>Edit Profile</button>
              </Link>
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <button className='a-tag' onClick={(e) => goToLogout(e)}>
                Log out
              </button>
            </div>
          </div>
          <div>
            <img src={DEMO} alt='Profile' className='profile-pic' />
          </div>
        </div>
      </div>
  );
}


export default withLocation(Header);
