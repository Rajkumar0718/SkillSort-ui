import axios from 'axios'
import React, { Component } from 'react'
import { authHeader, errorHandler } from '../../api/Api'
import { url } from '../../utils/UrlConstant'
import { LogReport } from './LogReport'
import { FaUserCheck } from 'react-icons/fa'
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
}

export default class Signupcount extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      showReportModal: false,
      loader: true,
      actions: [],
      type: 'week',
      actionType: 'signUp',
      duration: 'week',
    }
  }
  componentDidMount() {

    axios.get(`${url.ADMIN_API}/dashboard`, { headers: authHeader() })
      .then(res => {
        this.setState({ data: res.data.response, loader: false }, () => this.setActions('week'))
      })
      .catch(error => {
        this.setState({ loader: false });
        errorHandler(error);
      })
  }

  setActions = () => {
    const { data, type } = this.state
    const actionCounts = [
      { action: 'Signup', count: data[keyTypes[type]['signup']], icon: <i class="fa fa-user-plus" aria-hidden="true"></i>, color: '#3b489e',type: 'signUp' },
      { action: 'Login', count: data[keyTypes[type]['login']], icon: <i class="fa fa-sign-in" aria-hidden="true"></i>, color: 'orange',type: 'login' },
      { action: 'Search', count: data[keyTypes[type]['search']], icon: <i class="fa fa-search" aria-hidden="true"></i>, color: 'blue', type: 'search' },
      { action: 'Downloads', count: data[keyTypes[type]['download']], icon: <i class="fa fa-download" aria-hidden="true"></i>, color: 'orange', type: 'download' },
      { action: 'Recruited', count: data[keyTypes[type]['recruited']], icon: <FaUserCheck style={{ color: 'white', fontSize: '20px' }} />, color: 'blue', type: 'recruited' },
    ];
    this.setState({ actions: actionCounts })
  }

  
  setActionType = (actionType) => {
    this.setState({  actionType: actionType})
  }

  setType = (type) => {
    this.setState({ type },this.setActions)
  }

  render() {
    return (
      <>
        <LogReport actions={this.state.actions} setType={this.setType} setActionType ={this.setActionType}/>
        <div className="row" style={{
          display: 'flex', alignItems: 'center', position: "relative",
          top: "10%"
        }}>
        </div>
      </>
    )
  }
}
