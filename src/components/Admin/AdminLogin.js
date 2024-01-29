import axios from 'axios';
import React, { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { authHeader, errorHandler } from "../../api/Api";
import '../../assests/css/Login.css';
import "../../assests/css/ReactToast.css";
import skillsort from '../../assests/images/Frame.png';
import useAuth from "../../hooks/useAuth";
import { toastMessage } from '../../utils/CommonUtils';
import { url } from '../../utils/UrlConstant';
import getRole from '../../utils/GetRole';


const AdminLogin = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [disable, setDisable] = useState(false);
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || ""

  const handleLoginEventForStudent = () => {
    window.dataLayer.push({
      event: "StudentLoggedIn",
    });
  };
  
  const handleLoginEventForHR = () => {
    window.dataLayer.push({
      event: "HRLoggedIn",
    });
  };

  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const checkCompetitor = (testListRoute, companyOfferRoute) => {
    axios
      .get(`${url.COMPETITOR_API}/competitor/open-for-interview`, {
        headers: authHeader(),
      })
      .then((res) => navigate(res.data.response ? testListRoute : companyOfferRoute))
      .catch((er) => errorHandler(er));
  };

  const roleMappings = {
    PROCESS_ADMIN: "/processadmin",
    ADMIN: "/admin/vacancy",
    HR_MANAGER: "/admin/vacancy",
    HR: { route: "/admin/vacancy", action: handleLoginEventForHR },
    SUPER_ADMIN: "/home",
    COLLEGE_ADMIN: "/college",
    COLLEGE_STAFF: "/college",
    COLLEGE_STUDENT: { route: "/student", action: handleLoginEventForStudent },
    TEST_ADMIN: "/testadmin/question",
    TRIAL_ADMIN: "/admin/vacancy",
    COMPETITOR: {
      route: "/competitor/testList",
      action: () => checkCompetitor("/competitor/testList", "/competitor/company-offer"),
    },
    DEMO_ROLE: {
      route: "/competitor/testList",
      action: () => checkCompetitor("/competitor/testList", "/competitor/company-offer"),
    },
  };

 

  const navigateBasedOnRole = (role) => {
    const mapping = roleMappings[role];
    if(from) {
      return navigate(from, {replace : true})
    }
    if (mapping) {
      if (typeof mapping === "string") {
        navigate(mapping);
      } else {
        navigate(mapping.route);
        if (mapping.action) {
          mapping.action();
        }
      }
    }
  };


  const handleSubmit = (event) => {
    localStorage.clear();
    event.preventDefault();
    setDisable(true);
    axios
      .post(`${url.ADMIN_API}/admin/login`, user)
      .then((res) => {
        const user = res.data.response.user;
        const token = res.data.response.token;
        const payload = getRole(token);
        const role = payload.role;

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        setAuth({ user, token, role })
        if (token) {
          navigateBasedOnRole(role);
        }
      })
      .catch(() => {
        setDisable(false);
        toastMessage("error", "Invalid username or password..!");
      });
  };


  return (
    <div className="login-background">
      <div className="container dp">
        <div>
          <p className="login-content">
            Matching <br />
            Fresh talents
            <br /> to great opportunities
          </p>
        </div>
        <div className="login-box">
          <img src={skillsort} alt="SkillSort" />
          <div
            className="container"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <form className="sign-in" onSubmit={handleSubmit}>
              <div className="text-pad">
                <input
                  className="login-textfield input-text"
                  placeholder="Email"
                  type="email"
                  onChange={handleChange}
                  name="email"
                  style={{ WebkitTextFillColor: "white" }}
                />
              </div>
              <div className="text-pad">
                <input
                  className="login-textfield input-text"
                  placeholder="Password"
                  autoComplete="current-password"
                  type="password"
                  onChange={handleChange}
                  name="password"
                  style={{ WebkitTextFillColor: "white" }}
                />
              </div>
              <div className="login-pad">
                <button
                  type="submit"
                  className="login-button"
                  disabled={disable}>
                  Login
                </button>
              </div>
            </form>
          </div>
          <div style={{ color: "white" }}>
            <a className="login-a" href="/admin/forgot/password">
              Forgot password
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
