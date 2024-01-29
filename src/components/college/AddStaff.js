import React, { useState, useEffect } from "react";
import axios from "axios";
import { isEmpty, isValidEmail, isValidMobileNo } from "../../utils/Validation";
import url from "../../utils/UrlConstant";
import { authHeader, errorHandler } from "../../api/Api";
import { toastMessage } from "../../utils/CommonUtils";
import FormHelperText from "@mui/material/FormHelperText";
import { Link } from "react-router-dom";
import Button from "../../common/Button";
import Input from "../../common/Input";
const AddStaff = (props) => {
  const [disabled, setDisabled] = useState(false);
  const [staff, setStaff] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    collegeId: JSON.parse(localStorage.getItem("user")).companyId,
    createdBy: "",
    department: "",
    token: localStorage.getItem("token"),
    status: "ACTIVE",
  });
  const [error, setError] = useState({
    name: false,
    nameErrorMessage: "",
    email: false,
    emailErrorMessage: "",
    phone: false,
    phoneErrorMessage: "",
  });

  const handleChange = (event, key) => {
    setStaff({ ...staff, [key]: event.target.value });
    setError({ ...error, [key]: false });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (isEmpty(staff.name?.trim())) {
      setError({
        ...error,
        name: true,
        nameErrorMessage: isEmpty(staff.name)
          ? "Field Required !"
          : "Enter Valid Input",
      });
    } else {
      setError({ ...error, name: false });
    }

    if (isEmpty(staff.email) || !isValidEmail(staff.email)) {
      setError({
        ...error,
        email: true,
        emailErrorMessage: isEmpty(staff.email)
          ? "Field Required !"
          : "Enter Valid Input",
      });
    } else {
      setError({ ...error, email: false });
    }

    if (isEmpty(staff.phone) || !isValidMobileNo(staff.phone)) {
      setError({
        ...error,
        phone: true,
        phoneErrorMessage: isEmpty(staff.phone)
          ? "Field Required !"
          : "Enter Valid Input",
      });
    } else {
      setError({ ...error, phone: false });
    }
    if (!error.name && !error.email && !error.phone) {
      setDisabled(true);
      axios
        .post(`${url.COLLEGE_API}/placement-coordinate/save`, staff, {
          headers: authHeader(),
        })
        .then((res) => {
          if (props.location.pathname.indexOf("edit") > -1) {
            toastMessage(
              "success",
              "Placement coordinator Details Updated Successfully..!"
            );
          } else {
            toastMessage(
              "success",
              "Placement coordinator Added Successfully..!"
            );
          }
          props.history.push("/college/placement-coordinator");
        })
        .catch((err) => {
          setDisabled(false);
          errorHandler(err);
        });
    }
  };
  useEffect(() => {
    if (props.location?.pathname?.indexOf("edit") > -1) {
      let staffData = props.location.state.staff;
      setStaff({
        ...staff,
        id: staffData.id,
        authId: staffData.authId,
        name: staffData.name,
        department: staffData.department,
        collegeId: staffData.collegeId,
        email: staffData.email,
        phone: staffData.phone,
        password: staffData.password,
        status: staffData.status,
      });
    }
  }, [props.location]);
  let action = null;
  if (props && props.location && props.location.pathname.indexOf("edit") > -1) {
    action = props.location.state.action;
  }
  const btnList = [
    {
      type: "submit",
      className: "btn btn-primary",
      title: action !== null ? "Update" : "Add",
      disabled: disabled,
    },
  ];
  const inputconfig = [
    {
      className: "profile-page",
      onChange: (e) => handleChange(e, "name"),
      value: staff.name,
      autoComplete: "off",
      name: "name",
      id: "staff",
      maxLength: "50",
      type: "text",
      placeholder: "Enter User Name",
    },
    {
      className: "profile-page",
      onChange: (e) => handleChange(e, "email"),
      value: staff.email,
      name: "email",
      id: "staff",
      autoComplete: "off",
      maxLength: "50",
      type: "text",
      placeholder: "Enter email",
    },
    {
      className: "profile-page",
      onChange: (e) => handleChange(e, "phone"),
      value: staff.phone,
      name: "phone",
      id: "staff",
      autoComplete: "off",
      maxLength: "50",
      type: "number",
      placeholder: "Enter phone",
    },
    {
      className: "custom-control-input",
      id: "active",
      type: "radio",
      onChange: (e) => handleChange(e, "status"),
      value: "ACTIVE",
      name: "status",
      checked: staff.status === "ACTIVE" || staff.status === "",
      style: { marginRight: "10px" },
    },
    {
      className: "custom-control-input",
      id: "inactive",
      type: "radio",
      onChange: (e) => handleChange(e, "status"),
      value: "INACTIVE",
      name: "status",
      checked: staff.status === "INACTIVE",
      style: { marginRight: "10px" },
    },
  ];

  return (
    <main className="main-content bcg-clr">
      <div>
        <div className="container-fluid cf-1">
          <div className="card-header-new">
            <span>
              {action !== null ? "Update" : "Add"} Placement Coordinator
            </span>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="table-border-cr">
                <form className="email-compose-body" onSubmit={handleSubmit}>
                  <div className="send-header">
                    <div className="row">
                      <div className="col-lg-6 col-6 col-sm-6 col-md-6 col-xl-6">
                        <div className="row">
                          <div className="col-3 col-sm-3 col-md-3 col-lg-3">
                            <label
                              className="form-label input-label"
                              htmlFor="inputSection"
                            >
                              Name<span className="required"></span>
                              <FormHelperText
                                className="helper"
                                style={{ paddingLeft: "0px" }}
                              >
                                {error.name ? error.nameErrorMessage : null}
                              </FormHelperText>
                            </label>
                          </div>
                          <div className="col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9">
                            <Input {...inputconfig[0]} />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-6 col-sm-6 col-md-6 col-xl-6">
                        <div className="row">
                          <div className="col-3 col-sm-3 col-md-3 col-lg-3">
                            <label
                              style={{ paddingLeft: "0px" }}
                              className="form-label input-label"
                              htmlFor="inputSection"
                            >
                              Email<span className="required"></span>
                              <FormHelperText
                                className="helper"
                                style={{ paddingLeft: "0px" }}
                              >
                                {error.email ? error.emailErrorMessage : null}
                              </FormHelperText>
                            </label>
                          </div>
                          <div className="col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9">
                            <Input {...inputconfig[1]} />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-6 col-sm-6 col-md-6 col-xl-6">
                        <div className="row">
                          <div className="col-3 col-sm-3 col-md-3 col-lg-3">
                            <label
                              className="form-label input-label"
                              htmlFor="inputSection"
                            >
                              Phone<span className="required"></span>
                              <FormHelperText
                                className="helper"
                                style={{ paddingLeft: "0px" }}
                              >
                                {error.phone ? error.phoneErrorMessage : null}
                              </FormHelperText>
                            </label>
                          </div>
                          <div className="col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9">
                            <Input {...inputconfig[2]} />
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-6 col-6 col-sm-6 col-md-6 col-xl-6">
                        <div className="row">
                          <div className="col-3 col-sm-3 col-md-3 col-lg-3">
                            <label
                              style={{ padding: "0px" }}
                              className="form-label input-label"
                            >
                              Status
                            </label>
                          </div>
                          <div
                            className="custom-control custom-radio custom-control-inline ml-3 radio"
                            style={{ width: "16%", marginTop: "6px" }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                flexWrap: "nowrap",
                              }}
                            >
                              <Input {...inputconfig[3]} />
                              <label
                                className="custom-control-label"
                                htmlFor="active"
                              >
                                Active
                              </label>
                            </div>
                          </div>
                          <div
                            className="custom-control custom-radio custom-control-inline ml-3 radio"
                            style={{ width: "16%", marginTop: "6px" }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                flexWrap: "nowrap",
                              }}
                            >
                              <Input {...inputconfig[4]} />
                              <label
                                className="custom-control-label"
                                htmlFor="inactive"
                              >
                                Inactive
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-11,col-lg-11,col-md-11 col-sm-11 col-xl-11">
                        <div style={{ float: "right", marginRight: "3.9rem" }}>
                          <Link
                            className="btn btn-default"
                            to="/college/placement-coordinator"
                            style={{
                              textDecoration: "none",
                              marginRight: "10px",
                            }}
                          >
                            Cancel
                          </Link>
                          <Button buttonConfig={btnList[0]}></Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AddStaff;
