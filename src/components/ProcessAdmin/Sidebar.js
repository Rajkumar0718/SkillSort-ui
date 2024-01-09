import React from 'react'
import _ from 'lodash';
import React, { Component ,useState} from "react";
import { Link } from "react-router-dom";
import company from "../../assests/images/company.png";
import NavBar from '../../container/NavBar';


const Sidebar = () => {
    const wrapperRef = useRef(null);
  const [showSidenav, setShowSidenav] = useState(false);
  const [sideBarClass, setSideBarClass] = useState("sidebar col-9 sb-1");
  const [isActive, setIsActive] = useState(false);

  const toggleClicked = () => {
    setShowSidenav(!showSidenav);
    openSideBar();
    setIsActive(!isActive);
  };

  const openSideBar = () => {
    if (showSidenav)
      setSideBarClass("sidebar col-9 sb-1-view");
    else
      setSideBarClass("sidebar col-9 sb-1");
  };

  const handleClickOutside = (event) => {
    if (wrapperRef && !wrapperRef.current.contains(event.target)) {
      setSideBarClass("sidebar col-9 sb-1");
      setShowSidenav(false);
    }
  };

  const changeClass = () => {
    const header = document.getElementById("myDIV");
    const buttons = header.getElementsByClassName("menu-icon");
    Array.from(buttons).forEach(btn => {
      btn.addEventListener("click", function () {
        const current = document.getElementsByClassName("focus");
        current[0].className = current[0].className.replace(" focus", "");
        className += " focus";
      });
    });
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    changeClass();

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div
        ref={wrapperRef}
        className={sideBarClass}
        style={{ paddingLeft: "0px" }}
      >
        <div className="sidebar-menu" id="myDIV">
          <NavBar toggleClicked={toggleClicked} />
          {/* <hr className="bottom-border" />
          <Link to="/processadmin/dashboard" onClick={() => changeClass()}>
            <div className="menu-icon">
              <div className="row link">
                <div className="col-3">
                  <img src={home} alt="home" className="sidenav-img" />
                </div>
                <div className="col-9 menu-name">
                  <span>Dashboard</span>
                </div>
              </div>
            </div>
          </Link> */}
          <hr className="bottom-border" />
          <Link to="/processadmin/company" onClick={() => changeClass()}>
            <div className="menu-icon focus">
              <div className="row link">
                <div className="col-3">
                  <div data-tip data-for="result">
                    <img src={company} alt="" className="sidenav-img" />
                  </div>
                </div>
                <div className="row link">
                  <div className="col-9 menu-name">
                    <span>Company</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
          <hr className="bottom-border" />
          {/* <Link to="/processadmin/college-exam" onClick={()=> changeClass()}>
            <div className="menu-icon">
              <div className="row link">
                <div className="col-3">
                  <div data-tip data-for="result">
                    <img src={College} alt="" className="sidenav-img" />
                  </div>
                </div>
                <div className="row link">
                  <div className="col-9 menu-name">
                    <span>College</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
          <hr className="bottom-border" /> */}
        </div>
      </div>
  )
}

export default Sidebar