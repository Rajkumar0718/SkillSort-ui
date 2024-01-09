import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../container/NavBar";
import { isRoleValidation } from "../utils/Validation";
import IconButton from "@mui/material/IconButton";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

import _ from "lodash";
const SideBar = ({ links }) => {
  const wrapperRef = useRef(null);
  const [showSidenav, setShowSidenav] = useState(false);
  const [sideBarClass, setSideBarClass] = useState("sidebar col-9 sb-1");
  const [focusedIndex, setFocusedIndex] = useState(null);
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
  const ChildLink = ({ link }) => (
    <div className="child-link">{link.title}</div>
  );

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
          <Link
            key={index}
            to={link.to}
            onClick={() => changeClass()}
            onFocus={() => setFocusedIndex(index)}
          >

            <div
              className= {
               window.location.pathname===link.homeLink|| window.location.pathname === link.to
                  ? "menu-icon focus"
                  : "menu-icon"
              }
              style={{height:link.child&&focusedIndex===index?"10rem":"3.5rem"}}
            >
              <div className="row link">
                <div data-tip data-for="result">
                  <IconButton
                    aria-hidden="true"
                    style={{
                      fontSize: "1.3rem",
                      color: "#3b489E",
                      display: "contents",
                    }}
                  >
                    {link.iconButton}
                  </IconButton>
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
                  {focusedIndex === index &&
                    link.child &&
                    !showSidenav &&
                    link.child.map((c, childIndex) => (
                      <div style={{ display: "flex",alignItems:"center"}}>
                        <ArrowRightIcon sx={{ color: "#F05A28" }} />
                        <a
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          style={{ color: "black", fontFamily: "Open Sans" }}
                        >
                          {c.title}
                        </a>
                      </div>
                    ))}
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

export default SideBar;
