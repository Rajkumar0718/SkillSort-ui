import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../container/NavBar";
import { isRoleValidation } from "../utils/Validation";
import IconButton from "@mui/material/IconButton";
import _ from "lodash";
const SideBars = ({ links }) => {
  const wrapperRef = useRef(null);
  const [showSidenav, setShowSidenav] = useState(false);
  const [sideBarClass, setSideBarClass] = useState("sidebar col-9 sb-1");

  const toggleClicked = () => {
    setShowSidenav(!showSidenav);
    openSideBar();
  };

  const openSideBar = () => {
    setSideBarClass(
      showSidenav ? "sidebar col-9 sb-1-view" : "sidebar col-9 sb-1"
    );
  };

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setSideBarClass("sidebar col-9 sb-1");
      setShowSidenav(false);
    }
  };

  const changeClass = () => {
    let header = document.getElementById("myDIV");
    let buttons = header.getElementsByClassName("menu-icon");
    _.map(buttons, (_btn, index) => {
      buttons[index].addEventListener("click", function () {
        let current = document.getElementsByClassName("focus");
        if (current && current.length > 0) {
          current[0].className = current[0].className.replace(" focus", "");
        }
        this.className += " focus";
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
        <hr className="bottom-border" />
        {links.map((link, index) => (
          <Link key={index} to={link.to} onClick={() => changeClass()}>
            <div
              className={
                window.location.pathname === link.to
                  ? "menu-icon focus"
                  : "menu-icon"
              }
            >
              <div className="row link">
                <div data-tip data-for="result">
                  <IconButton
                    aria-hidden="true"
                    style={{ fontSize: "1.3rem", color: "#3b489E",display:'contents' }}
                  >
                    {link.iconButton}
                  </IconButton>

                  {/* <i
                      className={`fa ${link.iconClass}`}
                      aria-hidden="true"
                      style={{ fontSize: "1.3rem", color: "#3b489E" }}
                    ></i> */}
                </div>
                <div
                  className="col-9 menu-name"
                  style={{
                    width: "81%",
                    whiteSpace: "break-spaces",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  <span>{link.label}</span>
                </div>
              </div>
            </div>
            <hr className="bottom-border" style={{ color: "#BEBFC0" }} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SideBars;
