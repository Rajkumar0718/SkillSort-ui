import React from "react";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
const NavBar = ({ toggleClicked }) => {
  return (
    <div
      className="menu-icon"
      onClick={toggleClicked}
      style={{ cursor: "pointer", width: "14 rem" }}
    >
      <div className="row">
        <div className="col-3">
          <div>
            <IconButton >
              <MenuIcon
                aria-hidden="true"
                style={{
                  color: "#3b489E",
                  fontSize: "2.0rem",
                  position:"absolute"
                }}
              ></MenuIcon>
            </IconButton>
          </div>
        </div>
        <div className="col-9 menu-name">
          <span>Menu</span>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
