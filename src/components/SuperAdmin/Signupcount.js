import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { authHeader, errorHandler } from '../../api/Api';
import { url } from '../../utils/UrlConstant';
import { LogReport } from './LogReport';
import { FaUserCheck } from 'react-icons/fa';

const keyTypes = {
  "week": {
    "signup": "weeklySignupActivity",
    "login": "weeklyLoginActivity",
    "search": "weeklySearchActivity",
    "download": "weeklyDownload",
    "recruited": "weeklyRecruited",
  },
  "month": {
    "signup": "monthlySignupActivity",
    "login": "monthlyLoginActiviy",
    "search": "monthlySearchActivity",
    "download": "monthlyDownload",
    "recruited": "monthlRecruited",
  },
  "qtr": {
    "signup": "quartelySignupActivity",
    "login": "quartelyLoginActivity",
    "search": "quartelySearchActivity",
    "download": "quartelyDownload",
    "recruited": "quartelyRecruited",
  }
};

const Signupcount = () => {
  const [data, setData] = useState({});
  const [loader, setLoader] = useState(true);
  const [actions, setActions] = useState([]);
  const [type, setType] = useState('week');
  const [actionType, setActionType] = useState('signUp');

  useEffect(() => {
    axios.get(`${url.ADMIN_API}/dashboard`, { headers: authHeader() })
      .then(res => {
        setData(res.data.response);
        setLoader(false);
        setType('week');
      })
      .catch(error => {
        setLoader(false);
        errorHandler(error);
      });
  }, []);

  const updateActions = () => {
    const actionCounts = [
      { action: 'Signup', count: data[keyTypes[type]['signup']], icon: <i className="fa fa-user-plus" aria-hidden="true"></i>, color: '#3b489e', type: 'signUp' },
      { action: 'Login', count: data[keyTypes[type]['login']], icon: <i className="fa fa-sign-in" aria-hidden="true"></i>, color: 'orange', type: 'login' },
      { action: 'Search', count: data[keyTypes[type]['search']], icon: <i className="fa fa-search" aria-hidden="true"></i>, color: 'blue', type: 'search' },
      { action: 'Downloads', count: data[keyTypes[type]['download']], icon: <i className="fa fa-download" aria-hidden="true"></i>, color: 'orange', type: 'download' },
      { action: 'Recruited', count: data[keyTypes[type]['recruited']], icon: <FaUserCheck style={{ color: 'white', fontSize: '20px' }} />, color: 'blue', type: 'recruited' },
    ];
    setActions(actionCounts);
  };

  useEffect(() => {
    updateActions();
  }, [data, type]);

  const handleActionType = (actionType) => {
    setActionType(actionType);
  };

  const handleTypeChange = (newType) => {
    setType(newType);
  };

  return (
    <>
      <LogReport actions={actions} setType={setType} setActionType ={setActionType}/>
      <div className="row" style={{
        display: 'flex', alignItems: 'center', position: "relative",
        top: "10%"
      }}>
      </div>
    </>
  )
}
export default Signupcount;