import TextField from '@mui/material/TextField';
import axios from 'axios';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { errorHandler } from '../api/Api';
import icon from '../assests/images/skill-sort.png';
import { toastMessage, withLocation } from './CommonUtils';
import { isEmpty } from './Validation';
import url from "./UrlConstant";


class LoginRegistration extends Component {
  state = {
    confirmPassword: '',
    disable: false,
    user: {
      email: '',
      newPassword: '',
      id: '',
      role: ''
    }
  }

  componentWillMount() {
    let id = this.props.params.id;
    let token = this.props.params.token;
    let role = this.props.params.role;
    axios.get(role.includes('college') ? `${url.COLLEGE_API}/password/getDetails/${id}/${role}` : `${url.ADMIN_API}/password/getDetails/${id}/${role}`, { headers: { Authorization: "Bearer ".concat(`${token}`) } })
      .then(res => {
        if (!isEmpty(res.data?.response?.password)) {
          toast.warning("Link already used")
          this.props.navigate('/login');
        }
        else {
          const { user } = this.state;
          user.email = res.data?.response?.email;
          user.id = res.data?.id;
          user.role = this.props.params.role;
          this.setState({ user: user });
        }
      })

  }

  handleSubmit = (event) => {
    this.setState({ disable: true })
    event.preventDefault();
    let id = this.props.params.id;
    let token = this.props.params.token;
    const { user } = this.state;
    user.id = id;
    let role = this.props.params.role;
    if (isEmpty(this.state.user.newPassword)) {
      this.setState({ disable: false })
      toast.error("Password Should not blank");
    }
    else if (this.state.user.newPassword === this.state.confirmPassword) {
      axios.post(role.includes('college') ? `${url.COLLEGE_API}/password/set` : `${url.ADMIN_API}/password/set`, this.state.user, { headers: { Authorization: "Bearer ".concat(`${token}`) } })
        .then(res => {
          toastMessage('success', "Password Reset Successfully..!")
          this.props.navigate('/');
        })
        .catch(error => {
          this.setState({ disable: false })
          errorHandler(error);
        })
    } else {
      this.setState({ disable: false })
      toastMessage('error', "New password and confirm password should be same")
    }
  }

  handleChange = (e, key) => {
    const { user } = this.state;
    user[key] = e.target.value;
    this.setState({ user });
  }

  handleConfirmPasswordChange = (e, key) => {
    this.setState({ [key]: e.target.value });
  }

  render() {
    return (
      <>
        <nav className='navbar navbar-expand-lg navbar-light bg-light border-bottom' style={{ paddingTop: '0px' }}>
          <div className="container" style={{marginLeft:'0px'}}> {/* Added container */}
            <img src={icon} width={130} alt="SkillSort" />
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav ms-auto mt-2 mt-lg-0"> {/* Updated class from 'ml-auto' to 'ms-auto' */}
              </ul>
            </div>
          </div> {/* Closing container */}
        </nav>
        <div className="container"> {/* Added container */}
          <div className="row signUp-form">
            <div className="border" style={{ margin: '100px  0px  100px  22rem', maxHeight: "260px" ,width:'32rem'}}>
              <h4 className="panel-title" style={{ textAlign: 'center', padding: '10px  0px  10px  10px' }}>Set Password</h4>
              <div className="panel-body">
                <form onSubmit={this.handleSubmit}>
                  <div className="row" style={{ paddingLeft: '17px' }}>
                    <div className="col-12 form-group"> {/* Updated class from 'form-group' to 'col-12 form-group' */}
                      <TextField
                        id="outlined-error-helper-text"
                        type="email"
                        label="E-Mail"
                        size="small"
                        value={this.state.user.email}
                        variant="outlined"
                        style={{ width: "120mm" }}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-11 form-group" style={{ width: '243.5px' ,padding:'31px'}}> {/* Updated class from 'form-group' to 'col-11 form-group' */}
                      <TextField
                        id="outlined-basic"
                        name="password"
                        type="password"
                        label="New-Password"
                        value={this.state.user.newPassword}
                        autoComplete="new-password"
                        size="small"
                        variant="outlined"
                        onChange={(e) => this.handleChange(e, 'newPassword')}
                        style={{ width: '221px' }}
                      />
                    </div>
                    <div className="col-11 form-group" style={{ width: '243.5px',padding:'31px' }}> {/* Updated class from 'form-group' to 'col-11 form-group' */}
                      <TextField
                        id="outlined-basic"
                        name="password"
                        type="password"
                        label="Confirm-password"
                        value={this.state.confirmPassword}
                        autoComplete="new-password"
                        size="small"
                        variant="outlined"
                        onChange={(e) => this.handleConfirmPasswordChange(e, 'confirmPassword')}
                        style={{ width: '221px' }}
                      />
                    </div>
                  </div>
                  <input type="submit" value="Set Password" className="btn btn-info btn-block" style={{ marginBottom: '30px',width:'30rem' }} disabled={this.state.disable} />
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default withLocation(LoginRegistration);