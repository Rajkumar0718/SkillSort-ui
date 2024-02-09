import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { authHeader } from "../../api/Api";
import { toastMessage, withLocation } from "../../utils/CommonUtils";
import url from "../../utils/UrlConstant";
import { isEmpty, isValidEmail, isValidName } from "../../utils/Validation";
import StatusRadioButton from "../../common/StatusRadioButton";
import InputField from "../../common/Inputfield";
class AddStudent extends Component {
  constructor() {
    super();
    this.state = {
      student: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "",
        collegeId: JSON.parse(localStorage.getItem("user")).companyId,
        department: "",
        token: localStorage.getItem("token"),
        status: "ACTIVE",
      },
      disabled: false,
      // departments: [Mechanicle],
      error: {
        firstName: false,
        nameErrorMessage: "",
        lastName: false,
        lastNameErrorMessage: "",
        email: false,
        emailErrorMessage: "",
      },
    };
  }

  handleChange = (event, key) => {
    const { student, error } = this.state;
    student[key] = event.target.value;
    error[key] = false;
    this.setState({ student, error });
  };

  handleSubmit = (event) => {
    const { student, error } = this.state;
    if (isEmpty(student.firstName?.trim()) || !isValidName(student.firstName)) {
      error.firstName = true;
      error.nameErrorMessage = isEmpty(student.firstName)
        ? "Field Required !"
        : "Enter Valid Input";
      this.setState({ error });
    } else {
      error.firstName = false;
      this.setState({ error });
    }
    if (isEmpty(student.lastName?.trim())) {
      error.lastName = true;
      error.lastNameErrorMessage = isEmpty(student.lastName)
        ? "Field Required !"
        : "Enter Valid Input";
      this.setState({ error });
    } else {
      error.lastName = false;
      this.setState({ error });
    }
    if (isEmpty(student.email) || !isValidEmail(student.email)) {
      error.email = true;
      error.emailErrorMessage = isEmpty(student.email)
        ? "Field Required !"
        : "Enter Valid Input";
      this.setState({ error });
    } else {
      error.email = false;
      this.setState({ error });
    }
    event.preventDefault();
    if (!error.firstName && !error.email) {
      this.setState({ disabled: true });
      const formData = new FormData();
      formData.append("student", JSON.stringify(this.state.student));
      axios
        .post(` ${url.COLLEGE_API}/student/save`, formData, {
          headers: authHeader(),
        })
        .then((res) => {
          if (this.props.location.pathname.indexOf("edit") > -1) {
            toastMessage("success", "Student Details Updated Successfully..!");
          } else {
            toastMessage("success", "Student Added Successfully..!");
          }
          this.props.navigate("/college");
        })
        .catch((error) => {
          this.setState({ disabled: false });
          toast.error(error.response.data.message);
        });
    }
  };

  componentWillMount() {
    if (this.props.location?.pathname.indexOf("edit") > -1) {
      let student = this.props.location.state.student;
      let staffData = this.state.student;
      staffData.id = student.id;
      staffData.authId = student.authId;
      staffData.role = student.role;
      staffData.firstName = student.firstName;
      staffData.lastName = student.lastName;
      staffData.department = student.department;
      staffData.collegeId = student.collegeId;
      staffData.email = student.email;
      staffData.phone = student.phone;
      staffData.password = student.password;
      staffData.status = student.status;
      this.setState({ student: staffData });
    }
  }

  render() {
    const fields = [
      {
        label: "First Name",
        name: "firstName",
        type: "text",
        placeholder: "Enter User First Name",
      },
      {
        label: "Last Name",
        name: "lastName",
        type: "text",
        placeholder: "Enter User Last Name",
      },
      {
        label: "Email",
        name: "email",
        type: "text",
        placeholder: "Enter email",
      },
      {
        label: "Phone",
        name: "phone",
        type: "number",
        placeholder: "Enter phone",
      },
    ];
    let action = null;
    if (this.props.location.pathname.indexOf("edit") > -1) {
      action = this.props.location.state.action;
    }
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
                  <form
                    className="email-compose-body"
                    onSubmit={this.handleSubmit}
                  >
                    <div className="send-header">
                      <div className="row">
                        {fields.map((field) => (
                          <div
                            key={field.name}
                            className="col-lg-6 col-6 col-sm-6 col-md-6 col-xl-6"
                            style={{position:"relative",left:"1rem"}}
                          >
                            <InputField
                              label={field.label}
                              error={this.state.error[field.name]}
                              errorMessage={
                                this.state.error[`${field.name}ErrorMessage`]
                              }
                              onChange={this.handleChange}
                              value={this.state.student[field.name]}
                              name={field.name}
                              type={field.type}
                              placeholder={field.placeholder}
                            />
                          </div>
                        ))}

                        {action !== null ? (
                          <div
                            className="col-lg-6 col-6 col-sm-6 col-md-6 col-xl-6"
                            style={{ paddingLeft: "25px" }}
                          >
                            <div className="row">
                              <StatusRadioButton
                                handleChange={this.handleChange}
                                status={this.state.student.status}
                                style={{ marginTop: "0.4rem" }}
                              />
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>

                      <div className="row">
                        <div className="col-11,col-lg-11,col-md-11 col-sm-11 col-xl-11">
                          <div
                            style={{ float: "right", marginRight: "3.9rem" }}
                          >
                            <Link className="btn btn-default" to="/college">
                              Cancel
                            </Link>
                            <button
                              disabled={this.state.disabled}
                              type="submit"
                              className="btn btn-primary"
                            >
                              {action !== null ? "Update" : "Add"}
                            </button>
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
  }
}
export default withLocation(AddStudent);
