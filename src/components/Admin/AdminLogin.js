import React, { useState } from "react";
import '../../assests/css/Login.css';
import "../../assests/css/ReactToast.css";
import skillsort from '../../assests/images/Frame.png';
import { toastMessage } from '../../utils/CommonUtils';
import { isRoleValidation } from '../../utils/Validation';
import { authHeader, errorHandler } from "../../api/Api";
import { url } from '../../utils/UrlConstant';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const AdminLogin = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [disable, setDisable] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    localStorage.clear();
    event.preventDefault();
    setDisable(true);
    axios
      .post(`${url.ADMIN_API}/admin/login`, user)
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data.response.user));
        localStorage.setItem("token", res.data.response.token);
        if (localStorage.getItem("token")) {
          let roleName = isRoleValidation();
          if (roleName === "PROCESS_ADMIN") navigate("/processadmin");
          else if (roleName === "ADMIN" || roleName === "HR_MANAGER")
            navigate("/admin/vacancy");
          else if (roleName === "HR") {
            handleLoginEventForHR();
            navigate("/admin/vacancy");
          } else if (roleName === "SUPER_ADMIN") navigate("/home");
          else if (roleName === "COLLEGE_ADMIN" || roleName === "COLLEGE_STAFF")
            navigate("/college");
          else if (roleName.includes("COLLEGE_STUDENT")) {
            handleLoginEventForStudent();
            navigate("/student");
          } else if (roleName === "TEST_ADMIN") navigate("/testadmin");
          else if (roleName === "TRIAL_ADMIN") navigate("/admin/vacancy");
          else if (roleName === "COMPETITOR" || roleName === "DEMO_ROLE") {
            axios
              .get(`${url.COMPETITOR_API}/competitor/open-for-interview`, {
                headers: authHeader(),
              })
              .then((res) =>
                res.data.response
                  ? navigate("/competitor/testList")
                  : navigate("/competitor/company-offer")
              )
              .catch((er) => errorHandler(er));
          }
        }
      })
      .catch(() => {
        setDisable(false);
        toastMessage("error", "Invalid username or password..!");
      });
  };

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
  return (
    <>
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
    </>
  );
};

export default AdminLogin;
