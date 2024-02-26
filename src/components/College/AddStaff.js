import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { authHeader, errorHandler } from "../../api/Api";
import { toastMessage, withLocation } from "../../utils/CommonUtils";
import url from "../../utils/UrlConstant";
import { isEmpty, isValidEmail, isValidMobileNo } from "../../utils/Validation";
import StatusRadioButton from "../../common/StatusRadioButton";
import InputField from "../../common/Inputfield";

class AddStaff extends Component {
  constructor(props) {
    super(props);
    this.state = {
      staff: {
        name: "",
        email: "",
        phone: "",
        role: "",
        collegeId: JSON.parse(localStorage.getItem("user")).companyId,
        createdBy: "",
        department: "",
        token: localStorage.getItem("token"),
        status: "ACTIVE",
      },
      disabled: false,
      // departments: [Mechanicle],
      error: {
        name: false,
        nameErrorMessage: "",
        email: false,
        emailErrorMessage: "",
        phone: false,
        phoneErrorMessage: "",
      },
    };
  }

  // handleChange = (event, key) => {
  //   const { staff, error } = this.state;
  //   staff[key] = event.target.value;
  //   error[key] = false;
  //   this.setState({ staff, error });
  // };
  handleChange = (event, key) => {
    const { staff, error } = this.state;
    if (key === "phone") {
      const sanitizedValue = event.target.value.replace(/[^0-9]/g, '').slice(0, 10);
      staff[key] = sanitizedValue;
    } else if (key === "name") {
      const sanitizedValue = event.target.value.replace(/[^a-zA-Z]/g, '');
      staff[key] = sanitizedValue;
    } else {
      staff[key] = event.target.value;
    }
    error[key] = false;
    this.setState({ staff, error });
  };

  handleDepartmentChange = (event) => {
    let data = this.state.staff;
    data.department = event.target.value;
    this.setState({ staff: data });
  };

  handleSubmit = (event) => {
    const { staff, error } = this.state;
    if (isEmpty(staff.name?.trim())) {
      error.name = true;
      error.nameErrorMessage = isEmpty(staff.name)
        ? "Field Required !"
        : "Enter Valid Input";
      this.setState({ error });
    } else {
      error.name = false;
      this.setState({ error });
    }
    if (isEmpty(staff.email) || !isValidEmail(staff.email)) {
      error.email = true;
      error.emailErrorMessage = isEmpty(staff.email)
        ? "Field Required !"
        : "Enter Valid Input";
      this.setState({ error });
    } else {
      error.email = false;
      this.setState({ error });
    }
    if (isEmpty(staff.phone) || !isValidMobileNo(staff.phone)) {
      error.phone = true;
      error.phoneErrorMessage = isEmpty(staff.phone)
        ? "Field Required !"
        : "Enter Valid Input";
      this.setState({ error });
    } else {
      error.phone = false;
      this.setState({ error });
    }
    event.preventDefault();
    if (!error.name && !error.email && !error.phone) {
      this.setState({ disabled: true });
      axios
        .post(
          ` ${url.COLLEGE_API}/placement-coordinate/save`,
          this.state.staff,
          { headers: authHeader() }
        )
        .then((res) => {
          if (this.props.location.pathname.indexOf("edit") > -1) {
            console.log(
              "if ",
              this.props.location.pathname.indexOf("edit") > -1
            );
            toastMessage(
              "success",
              "Placement coordinator Details Updated Successfully..!"
            );
          } else {
            console.log(
              "else",
              this.props.location.pathname.indexOf("edit") > -1
            );
            toastMessage(
              "success",
              "Placement coordinator Added Successfully..!"
            );
          }
          this.props.navigate("/college/placement-coordinator");
        })
        .catch((error) => {
          this.setState({ disabled: false });
          errorHandler(error);
        });
    }
  };

  componentDidMount() {
    if (this.props.location?.pathname.indexOf("edit") > -1) {
      let staff = this.props.location.state.staff;
      let staffData = this.state.staff;
      staffData.id = staff.id;
      staffData.authId = staff.authId;
      staffData.name = staff.name;
      staffData.department = staff.department;
      staffData.collegeId = staff.collegeId;
      staffData.email = staff.email;
      staffData.phone = staff.phone;
      staffData.password = staff.password;
      staffData.status = staff.status;
      this.setState({ staff: staffData });
    }
  }

  render() {
    const fields = [
      {
        label: "Name",
        name: "name",
        type: "text",
        placeholder: "Enter User Name",
        maxlength: "30",
        pattern: "[a-zA-Z]",
      },
      {
        label: "Email",
        name: "email",
        type: "text",
        placeholder: "Enter email",
        maxlength: "30",
        pattern: "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$",
      },
      {
        label: "Phone",
        name: "phone",
        type: "tel",
        placeholder: "Enter phone",
        pattern: "[0-9]{10}",
        maxlength: "10",
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
              <span>
                {action !== null ? "Update" : "Add"} Placement Coordinator
              </span>
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
                          >
                            <InputField
                              label={field.label}
                              error={this.state.error[field.name]}
                              errorMessage={
                                this.state.error[`${field.name}ErrorMessage`]
                              }
                              onChange={this.handleChange}
                              value={this.state.staff[field.name]}
                              name={field.name}
                              type={field.type}
                              placeholder={field.placeholder}
                              maxlength={field.maxlength}
                            />
                          </div>
                        ))}

                        <div className="col-lg-6 col-6 col-sm-6 col-md-6 col-xl-6">
                          <div className="row"                                                                                                                                      >
                            <StatusRadioButton
                              handleChange={this.handleChange}
                              status={this.state.staff.status}
                              style={{ marginTop: "0.1rem" }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-11,col-lg-11,col-md-11 col-sm-11 col-xl-11">
                          <div
                            style={{ float: "right", marginRight: "3.9rem" }}
                          >
                            <Link
                              className="btn btn-default"
                              to="/college/placement-coordinator"
                              style={{}}
                            >
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

export default withLocation(AddStaff);
