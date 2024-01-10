import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  isEmpty,
  isValidEmail,
  isValidMobileNo,
  isValidName,
} from "../../utils/Validation";
import FormHelperText from "@mui/material/FormHelperText";
import { Link } from "react-router-dom";
import Button from "../../common/Button";
import Input from "../../common/Input";
const AddStudent = (props) => {
  const [student, setStudent] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    // collegeId: JSON.parse(localStorage.getItem("user")).companyId,
    department: "",
    token: localStorage.getItem("token"),
    status: "ACTIVE",
  });

  const [disabled, setDisabled] = useState(false);

  const [error, setError] = useState({
    firstName: false,
    nameErrorMessage: "",
    phoneErrorMessage: "",
    lastName: false,
    lastNameErrorMessage: "",
    email: false,
    emailErrorMessage: "",
  });

  const handleChange = (event, key) => {
    setStudent({
      ...student,
      [key]: event.target.value,
    });

    setError({
      ...error,
      [key]: false,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isEmpty(student.firstName?.trim()) || !isValidName(student.firstName)) {
      setError({
        ...error,
        firstName: true,
        nameErrorMessage: isEmpty(student.firstName)
          ? "Field Required !"
          : "Enter Valid Input",
      });
    } else {
      setError({
        ...error,
        firstName: false,
      });
    }

    if (isEmpty(student.lastName?.trim())) {
      setError({
        ...error,
        lastName: true,
        lastNameErrorMessage: isEmpty(student.lastName)
          ? "Field Required !"
          : "Enter Valid Input",
      });
    } else {
      setError({
        ...error,
        lastName: false,
      });
    }

    if (isEmpty(student.email) || !isValidEmail(student.email)) {
      setError({
        ...error,
        email: true,
        emailErrorMessage: isEmpty(student.email)
          ? "Field Required !"
          : "Enter Valid Input",
      });
    } else {
      setError({
        ...error,
        email: false,
      });
    }

    // if (!error.firstName && !error.email) {
    //   setDisabled(true);

    //   const formData = new FormData();
    //   formData.append("student", JSON.stringify(student));

    //   axios
    //     .post(` ${url.COLLEGE_API}/student/save`, formData, {
    //       headers: authHeader(),
    //     })
    //     .then((res) => {
    //       if (props.location.pathname.indexOf("edit") > -1) {
    //         toastMessage("success", "Student Details Updated Successfully..!");
    //       } else {
    //         toastMessage("success", "Student Added Successfully..!");
    //       }
    //       props.history.push("/college");
    //     })
    //     .catch((error) => {
    //       setDisabled(false);
    //       toast.error(error.response.data.message);
    //     });
    // }
  };
  // useEffect(() => {
  //   if (props.location.pathname.indexOf("edit") > -1) {
  //     const studentData = props.location.state.student;
  //     setStudent((prevStudent) => ({
  //       ...prevStudent,
  //       id: studentData.id,
  //       authId: studentData.authId,
  //       role: studentData.role,
  //       firstName: studentData.firstName,
  //       lastName: studentData.lastName,
  //       department: studentData.department,
  //       collegeId: studentData.collegeId,
  //       email: studentData.email,
  //       phone: studentData.phone,
  //       password: studentData.password,
  //       status: studentData.status,
  //     }));
  //   }
  // }, [props.location.pathname, props.location.state]);
  let action = null;
  if (props && props.location && props.location.pathname.indexOf("edit") > -1) {
    action = props.location.state.action;
  }
  const buttonConfig = [
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
      onChange: (e) => handleChange(e, "firstName"),
      value: student.firstName,
      autoComplete: "new-username",
      name: "firstName",
      id: "student",
      maxLength: "50",
      type: "text",
      placeholder: "Enter User First Name",
    },
    {
      className: "profile-page",
      onChange: (e) => handleChange(e, "lastName"),
      value: student.lastName,
      autoComplete: "new-username",
      name: "lastName",
      id: "student",
      maxLength: "50",
      type: "text",
      placeholder: "Enter User Last Name",
    },
    {
      className: "profile-page",
      onChange: (e) => handleChange(e, "email"),
      value: student.email,
      autoComplete: "off",
      name: "email",
      id: "student",
      maxLength: "50",
      type: "text",
      placeholder: "Enter email",
    },
    {
      className: "profile-page",
      onChange: (e) => handleChange(e, "phone"),
      value: student.phone,
      autoComplete: "off",
      name: "phone",
      id: "student",
      maxLength: "50",
      type: "number",
      placeholder: "Enter phone",
    },
    {
      className: "custom-control-input",
      onChange: (e) => handleChange(e, "status"),
      value: "ACTIVE",
      name: "status",
      id: "active",
      type: "radio",
      checked: student.status === "ACTIVE" || student.status === "",
    },
    {
      className: "custom-control-input",
      onChange: (e) => handleChange(e, "status"),
      value: "INACTIVE",
      name: "status",
      id: "inactive",
      type: "radio",
      checked: student.status === "INACTIVE",
    },
  ];

  return (
    <main className="main-content bcg-clr">
      <div>
        <div className="container-fluid cf-1">
          <div className="card-header-new">
            <span>{action !== null ? "Update" : "Add"} Student</span>
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
                              First Name<span className="required"></span>
                              <FormHelperText
                                className="helper"
                                style={{ paddingLeft: "0px" }}
                              >
                                {error.firstName
                                  ? error.nameErrorMessage
                                  : null}
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
                              className="form-label input-label"
                              htmlFor="inputSection"
                            >
                              Last Name<span className="required"></span>
                              <FormHelperText
                                className="helper"
                                style={{ paddingLeft: "0px" }}
                              >
                                {error.lastName
                                  ? error.lastNameErrorMessage
                                  : null}
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
                            <Input {...inputconfig[2]} />
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
                            <Input {...inputconfig[3]} />
                          </div>
                        </div>
                      </div>
                      {action !== null ? (
                        <div
                          className="col-lg-6 col-6 col-sm-6 col-md-6 col-xl-6"
                          style={{ paddingLeft: "25px" }}
                        >
                          <div className="row">
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3">
                              <label
                                style={{ paddingLeft: "0px" }}
                                className="form-label input-label"
                              >
                                Status{" "}
                              </label>
                            </div>
                            <div
                              style={{
                                paddingLeft: "12px",
                                marginTop: "0.3rem",
                              }}
                              className="custom-control custom-radio custom-control-inline ml-3 radio"
                            >
                              <Input {...inputconfig[4]} />
                              <label
                                className="custom-control-label"
                                htmlFor="active"
                              >
                                Active
                              </label>
                            </div>
                            <div
                              style={{ marginTop: "0.3rem" }}
                              className="custom-control custom-radio custom-control-inline ml-3 radio"
                            >
                              <Input {...inputconfig[5]} />
                              <label
                                className="custom-control-label"
                                htmlFor="inactive"
                              >
                                Inactive
                              </label>
                            </div>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="row">
                      <div className="col-11,col-lg-11,col-md-11 col-sm-11 col-xl-11">
                        <div style={{ float: "right", marginRight: "3.9rem" }}>
                          <Link
                            className="btn btn-default"
                            to="/college"
                            style={{ textDecoration: "none" }}
                          >
                            Cancel
                          </Link>
                          <Button buttonConfig={buttonConfig[0]}></Button>
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

export default AddStudent;
