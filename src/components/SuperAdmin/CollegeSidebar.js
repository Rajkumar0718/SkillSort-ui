import _ from 'lodash';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../../container/NavBar';

export default class CollegeSidebar extends Component {
  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.state = {
      showSidenav: false,
      sideBarClass: "sidebar col-9 sb-1",

    };
  }
  toggleClicked = () => {
    this.setState({ showSidenav: !this.state.showSidenav }, () => this.openSideBar())
  }
  openSideBar = () => {
    if (this.state.showSidenav) this.setState({ sideBarClass: 'sidebar col-9 sb-1-view' })
    else this.setState({ sideBarClass: 'sidebar col-9 sb-1' })
  }
  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
    this.changeClass();
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
      this.setState({ sideBarClass: "sidebar col-9 sb-1", showSidenav: false });
    }
  }
  changeClass = () => {
    let header = document.getElementById("myDIV");
    let buttons = header.getElementsByClassName("menu-icon");
    _.map(buttons, (_btn, index) => {
      buttons[index].addEventListener("click", function () {
        let current = document.getElementsByClassName("focus");
        current[0].className = current[0].className.replace(" focus", "");
        this.className += " focus";
      })
    });
  };
  render() {
    let action = null;
    if (window.location.pathname.indexOf('settings') > -1) {
      action = true;
    }
    return (
      <div ref={this.wrapperRef} className={this.state.sideBarClass} style={{ paddingLeft: "0px" }}>
        <div className="sidebar-menu" id="myDIV">
          <NavBar toggleClicked={this.toggleClicked} />
          <hr className='bottom-border' />
          <Link to="/home" onClick={() => this.changeClass()}>
            <div className="menu-icon">
              <div className="row link">
                <div className="col-3">
                  <div>
                    <i style={{ fontSize: '1.4rem', color: '#3b489e' }} className="fa fa-home" aria-hidden="true"></i>
                  </div>
                </div>
                <div className="col-9 menu-name">
                  <span>Home</span>
                </div>
              </div>
            </div><hr className='bottom-border' /></Link>

          {!action ? <> <Link to="/collegeadmin" onClick={() => this.changeClass()} ><div className="menu-icon focus">
            <div className="row link">
              <div className="col-3">
                <div data-tip data-for="college">
                  <i className="fa fa-university" aria-hidden="true" style={{ fontSize: '1.3rem', color: '#3b489e' }}></i>
                </div>
              </div>
              <div className="col-9 menu-name">
                <span>College </span>
              </div>
            </div>
          </div></Link><hr className='bottom-border' /></> : ""}

          {!action ?
            <><Link to="/collegeadmin/admin" onClick={() => this.changeClass()}><div className="menu-icon">
              <div className="row link">
                <div className="col-3">
                  <div data-tip data-for="college">
                    <i style={{ fontSize: '1.3rem', color: '#3b489e' }} className="fa fa-user-circle-o" aria-hidden="true"></i>
                  </div>
                </div>
                <div className="col-9 menu-name">
                  <span>College Admin</span>
                </div>
              </div>
            </div></Link><hr className='bottom-border' /></> : ""}

          {action ? <><Link to='/settings' onClick={() => this.changeClass()}><div className="menu-icon focus">
            <div className="row link">
              <div className="col-3">
                <div data-tip data-for="result">
                  <i style={{ fontSize: '1.3rem', color: '#3b489e' }} className="fa fa-universal-access" aria-hidden="true"></i>
                </div>
              </div>
              <div className="col-9 menu-name">
                <span>Industry Type</span>
              </div>
            </div>
          </div></Link><hr className='bottom-border' /> </> : ""}

          {action ? <><Link to="/settings/department" onClick={() => this.changeClass()}> <div className="menu-icon">
            <div className="row link">
              <div className="col-3">
                <div data-tip data-for="result">
                  <i style={{ fontSize: '1.3rem', color: '#3b489e' }} className="fa fa-sitemap" aria-hidden="true"></i>
                </div>
              </div>
              <div className="col-9 menu-name">
                <span>Department</span>
              </div>
            </div>
          </div> </Link> <hr className='bottom-border' /> </> : ""}
           <hr className='bottom-border' />
          {action ? <><Link to="/settings/practiceExam">
            <div className="menu-icon" tabIndex='2'>
              <div className="row link">
                <div className="col-3">
                  <div data-tip data-for="result">
                    <i style={{ fontSize: '1.3rem', color: '#3b489e' }} className="fa fa-graduation-cap" aria-hidden="true"></i>
                  </div>
                </div>
                <div className="col-9 menu-name">
                  <span>PracticeExam</span>
                </div>
              </div>
            </div></Link><hr className='bottom-border' /></> : ""}
          {action ? <><Link to="/settings/smtp" onClick={() => this.changeClass()}><div className="menu-icon">
            <div className="row link">
              <div className="col-3">
                <div data-tip data-for="result">
                  <i style={{ fontSize: '1.3rem', color: '#3b489e' }} className="fa fa-cogs" aria-hidden="true"></i>
                </div>
              </div>
              <div className="col-9 menu-name">
                <span>SMTP Config</span>
              </div>
            </div>
          </div> </Link> <hr className='bottom-border' /> </> : ""}
          {action ? <><Link to="/settings/test" onClick={() => this.changeClass()}><div className="menu-icon">
            <div className="row link">
              <div className="col-3">
                <div data-tip data-for="result">
                  <i style={{ fontSize: '1.3rem', color: '#3b489e' }} className="fa fa-th-list" aria-hidden="true"></i>
                </div>
              </div>
              <div className="col-9 menu-name">
                <span>Test</span>
              </div>
            </div>
          </div></Link> <hr className='bottom-border' /> </> : ""}
          <hr className='bottom-border' />
          {action ? <><Link to="/settings/plan-master">
            <div className="menu-icon" tabIndex='2'>
              <div className="row link">
                <div className="col-3">
                  <div data-tip data-for="result">
                    <i style={{ fontSize: '1.3rem', color: '#3b489e' }} className="fa fa-battery-three-quarters" aria-hidden="true"></i>
                  </div>
                </div>
                <div className="col-9 menu-name">
                  <span>Plan</span>
                </div>
              </div>
            </div></Link><hr className='bottom-border' /></> : ""}
          <hr className='bottom-border' />
          {action ? <><Link to="/settings/weightage">
            <div className="menu-icon" tabIndex='2'>
              <div className="row link">
                <div className="col-3">
                  <div data-tip data-for="result">
                    <i style={{ fontSize: '1.3rem', color: '#3b489e' }} className="fa fa-balance-scale" aria-hidden="true"></i>
                  </div>
                </div>
                <div className="col-9 menu-name">
                  <span>Weightage</span>
                </div>
              </div>
            </div></Link><hr className='bottom-border' /></> : ""}
            <hr className='bottom-border' />
          {action ? <><Link to="/settings/freeCredits">
            <div className="menu-icon" tabIndex='2'>
              <div className="row link">
                <div className="col-3">
                  <div data-tip data-for="result">
                    <i style={{ fontSize: '1.3rem', color: '#3b489e' }} className="fa fa-ticket" aria-hidden="true"></i>
                  </div>
                </div>
                <div className="col-9 menu-name">
                  <span>FreeCredits</span>
                </div>
              </div>
            </div></Link><hr className='bottom-border' /></> : ""}
        </div>
      </div>
    );
  }
}