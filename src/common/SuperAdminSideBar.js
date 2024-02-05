import _ from 'lodash';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import sidebar from './SideBarJson';
import { isRoleValidation } from '../utils/Validation';
import NavBar from '../container/NavBar';

export default class TestingSidebar extends Component {
  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.state = {
      showSidenav: false,
      sideBarClass: "sidebar col-9 sb-1",
      showSubMenuTest: false,
      showSubMenuSkillsort: false,
    };
  }

  toggleClicked = () => {
    this.setState(prevState => ({
      ...prevState,
      showSidenav: !prevState.showSidenav,
      showSubMenuTest: false,
      showSubMenuSkillsort: false
    }), () => this.openSideBar());
  }

  toggleClickedSubMenu = (key) => {
    if (key === "test") {
      this.setState({ showSidenav: true, showSubMenuTest: true, showSubMenuSkillsort: false }, () => this.openSideBar())
    } else {
      this.setState({ showSidenav: true, showSubMenuSkillsort: true, showSubMenuTest: false }, () => this.openSideBar())
    }
  }

  openSideBar = () => {
    if (this.state.showSidenav) this.setState({ sideBarClass: 'sidebar col-9 sb-1-view' })
    else this.setState({ sideBarClass: 'sidebar col-9 sb-1' })
  }

  componentDidMount() {
    const role = isRoleValidation();
    this.setState({ role: role }, this.setEventListener)
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
      this.setState({ sideBarClass: "sidebar col-9 sb-1", showSidenav: false, showSubMenuTest: false, showSubMenuSkillsort: false });
    }
  }

  changeClass = () => {
    if (this.state.showSubMenuTest || this.state.showSubMenuSkillsort) {
      this.setState({ showSubMenuTest: false, showSubMenuSkillsort: false })
    }
  };



  setEventListener = () => {
    document.getElementById("myDIV").addEventListener("click", (event) => {
      const targetButton = event.target.closest('.menu-icon');

      if (targetButton) {
        const current = document.getElementsByClassName("focus");
        if (current.length > 0) {
          current[0].classList.remove("focus");
        }
        targetButton.classList.add("focus");
      }
    });
  }

  renderSubMenu = (sideBar) => {
    return (<div className='row' style={{ marginTop: '12px', marginLeft: '20px', display: 'flex', flexDirection: 'column' }}>
      {_.map(sideBar.subMenu, menu => {
        return <><Link to={menu.to} key={menu.name}><span style={{ color: 'black' }}><span style={{ color: '#F05A28' }}>▶&nbsp;</span>{menu.name}</span></Link><br /></>
      })}
    </div>)
  }

  getSideBarJSON = () => {
    const pathname = window.location.pathname;
  if (pathname.includes('/collegeadmin')) {
    return sidebar['SUPER_ADMIN_COLLEGE'];
  } else if (pathname.includes('/companyadmin')) {
    return sidebar['SUPER_ADMIN_COMPANY'];
  } else if (pathname.includes('/panelists')) {
    return sidebar['SUPER_ADMIN_PANELISTS'];
  } else if (pathname.includes('/report')) {
    return sidebar['SUPER_ADMIN_REPORT'];
  } else if (pathname.includes('/skillsortadmin')) {
    return sidebar['SUPER_ADMIN_SKILL_SORT_ADMIN'];
  } else if (pathname.includes('/settings')) {
    return sidebar['SUPER_ADMIN_SETTINGS'];
  }
  }

  renderSideBar = () => {
    const roleBasedSideBar = this.getSideBarJSON()
    const pathName = window.location.pathname
    if (!roleBasedSideBar) return;

    return _.map(roleBasedSideBar, sideBar => {
      if (sideBar.isSubMenu) {
        return (<> <hr className='bottom-border' />
          <div style={{ height: this.state[sideBar.toggleValue] ? sideBar.height[0] : sideBar.height[1], alignItems: this.state[sideBar.toggleValue] ? "start" : 'center', cursor: 'pointer' }} onClick={() => this.toggleClickedSubMenu(sideBar.param)} className={sideBar.isDefault ? 'menu-icon focus' : 'menu-icon'} >
            <div className="row link">
              <div className="col-3">
                <div data-tip data-for="result" style={{ marginTop: this.state[sideBar.toggleValue] ? sideBar.toolTipMarginTop : '0', cursor: 'pointer' }}>
                  <i className={sideBar.icon} aria-hidden="true" style={{ color: '#3b489E', fontSize: '1.3rem' }}></i>
                </div>
              </div>
              <div className='col-9 menu-name'>
                <div style={{ height: '20px', maxWidth: '8.5rem' }}>{sideBar.name}
                  {this.state[sideBar.toggleValue] ? <div> {this.renderSubMenu(sideBar)} </div> : ''}
                </div>
              </div>
            </div>
          </div></>)
      } else {
        return (<>
          <hr className='bottom-border' />
          <Link to={sideBar.to} onClick={this.changeClass} key={sideBar.name}>
            <div className={(pathName === sideBar.to || sideBar.subPath?.includes(pathName))  ? 'menu-icon focus' : 'menu-icon'}>
              <div className="row link">
                <div className="col-3">
                  <div>
                    <i className={sideBar.icon} aria-hidden="true" style={{ color: '#3b489E', fontSize: '1.3rem' }}></i>
                  </div>
                </div>
                <div className="col-9 menu-name">
                  <span style={{display:'flex', maxWidth: '8.5rem'}}>{sideBar.name}</span>
                </div>
              </div>
            </div>
          </Link>
        </>)
      }
    })
  }

  render() {
    return (
      <div ref={this.wrapperRef} className={this.state.sideBarClass} style={{ paddingLeft: "0px", overflow: 'hidden auto' }} >
        <div className="sidebar-menu" id="myDIV">
          <NavBar toggleClicked={this.toggleClicked} />
          {this.renderSideBar()}
          <hr className='bottom-border' />
        </div>
      </div>
    );
  }
}
