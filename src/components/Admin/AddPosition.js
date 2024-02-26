import React, { Component } from "react";
import { withLocation } from "../../utils/CommonUtils";
import { Link } from "react-router-dom";
import VacancyAddExamModal from "./VacancyAddExamModal";
import Checkbox from "@mui/material/Checkbox";
import FormHelperText from "@mui/material/FormHelperText";
import StatusRadioButton from "../../common/StatusRadioButton";
import axios from "axios";
import { authHeader, errorHandler } from "../../api/Api";
import { isEmpty } from "../../utils/Validation";
import { toastMessage } from "../../utils/CommonUtils";
import url from '../../utils/UrlConstant';
import CkEditor from "../../common/CkEditor"
class AddPosition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wantExam: false,
      updateExam: false,
      showExamSection: false,
      position: {},
      exams: [],
      clonedExam: null,
      disabled: false,
      pstn: {
        name: "",
        noOfCandidatesRequired: "",
        status: "ACTIVE",
        jobDescription: "",
        companyId: "",
      },

      error: {
        name: false,
        nameErrorMessage: "",
        noOfCandidatesRequired: false,
        noOfCandidatesRequiredErrorMessage: "",
        jobDescriptionError: false,
        jobDescriptionErrorMsg: "",
      },
    };
  }
  get formData() {
    return [
      {
        label: "Vacancy Name:",
        errorKey: "name",
        fieldValue: this.state.pstn.name,
        handleChange: (e) => this.handleChange(e, "name"),
        id: "section",
        name: "name",
        type: "text",
        placeholder: "Enter Vacancy Name",
      },
      {
        label: "No of Vacancies:",
        errorKey: "noOfCandidatesRequired",
        fieldValue: this.state.pstn.noOfCandidatesRequired,
        handleChange: (e) => this.handleChange(e, "noOfCandidatesRequired"),
        id: "section",
        name: "noOfCandidatesRequired",
        type: "number",
        placeholder: "Eg:10",
      },
    ];
  }

  handleSubmit = (event) => {
    const { pstn, error } = this.state;
    if (isEmpty(pstn.name)) {
      error.name = true;
      error.nameErrorMessage = "Field Required !";
      this.setState({ error });
    } else {
      error.name = false;
      this.setState({ error });
    }
    if (
      isEmpty(pstn.noOfCandidatesRequired) ||
      pstn.noOfCandidatesRequired <= 0
    ) {
      error.noOfCandidatesRequired = true;
      error.noOfCandidatesRequiredErrorMessage = isEmpty(
        pstn.noOfCandidatesRequired
      )
        ? "Field Required !"
        : "Enter Valid Input";
      this.setState({ error });
    } else {
      error.noOfCandidatesRequired = false;
      this.setState({ error });
    }
    if (isEmpty(pstn.jobDescription)) {
      error.jobDescriptionError = true;
      error.jobDescriptionErrorMsg = "Field Required!";
      this.setState({ error });
    } else {
      error.jobDescriptionError = false;
      this.setState({ error });
    }
    event.preventDefault();
    if (
      !error.name ||
      !error.noOfCandidatesRequired ||
      !error.jobDescriptionError
    ) {
      this.setState({ disabled: true });
      axios
        .post(` ${url.ADMIN_API}/position/save`, this.state.pstn, {
          headers: authHeader(),
        })
        .then((res) => {
          this.handleAddPositionEventTrack();
          this.setState({ disabled: false });
          if (
            this.props.location.state &&
            this.state.wantExam &&
            res.data.response.examId
          ) {
            this.props.navigate("/admin/vacancy/Exam-add", {
              examId: res.data.response.examId,
            });
          } else {
            toastMessage("success", "Vacancy Added Successfully..!");
            !this.state.wantExam
              ? this.props.navigate("/admin/vacancy", {
                position: res.data.response,
              })
              : this.setState({
                position: res.data.response,
                showExamSection: true,
              });
          }
        })
        .catch((error) => {
          this.setState({ disabled: false });
          errorHandler(error);
        });
    }
  };
  handleAddPositionEventTrack = () => {
    if (!window.dataLayer) {
      window.dataLayer = [];
    }

    window.dataLayer.push({
      event: "Add_Vaccancy",
    });
  };

  handleVaccancyPageViewEventTrack = () => {
    if (!window.dataLayer) {
      window.dataLayer = [];
    }

    window.dataLayer.push({
      event: "HR_VaccancyAdd_PageView",
    });
  };
  handleChange = (event, key) => {
    const { pstn, error } = this.state || {};
    error[key] = false;
    pstn[key] =
      key === "startDate" || key === "endDate" ? event : event.target.value;
    this.setState({ pstn, error });
  };
  componentDidMount() {
    this.getExams();
    this.handleVaccancyPageViewEventTrack();
  }

  getExams = () => {
    let user = JSON.parse(localStorage.getItem("user"));
    axios.get(`${url.ADMIN_API}/exam/getAllExamsByCompanyId?companyId=${user.companyId}&status=${"ACTIVE"}`, { headers: authHeader() }).then((res) => {
      this.setState({ exams: res.data.response });
    })
      .catch((err) => {
        errorHandler(err);
      });
  };

  setCloneExam = (e) => {
    this.setState({ clonedExam: e });
  };
  sendCloneExam = () => {
    const { clonedExam } = this.state
    clonedExam.id = null;
    clonedExam.startDateTime = new Date();
    clonedExam.positionId = this.state.position.id;
    this.onCloseModal()
    this.props.navigate('/admin/vacancy/Exam-add', { state: { clonedExam: clonedExam } });
  }
  componentWillMount() {
    if (this.props.location?.state) {
      const pstn = this.props.location.state?.position;
      this.setState({
        pstn: pstn,
      });
    }
  }
  onCloseModal = () => {
    this.setState({ showExamSection: !this.state.showExamSection });
    this.getExams();
  }
  addExam = () => {
    this.onCloseModal()
    this.props.navigate('/admin/vacancy/Exam-add', { state: { position: this.state.position } })
  }

  handleEditorChange = (newData) => {
    this.setState((prevState) => ({
      pstn: {
        ...prevState.pstn,
        jobDescription: newData,
      },
    }));
  };

  render() {
    let action = null;
    if (this.props.location.state) {
      action = "update";
    }

    return (
      <main className="main-content bcg-clr">
        <div>
          <div className="container-fluid cf-1">
            <div className="card-header-new">
              <span> {action !== null ? "Update" : "Add"} Vacancy</span>
            </div>
            <div className="table-border-cr" style={{ height: "fit-content" }}>
              <form className="email-compose-body" onSubmit={this.handleSubmit}>
                <div className="send-header">
                  {this.state.showExamSection ? (
                    <VacancyAddExamModal addExam={this.addExam} sendCloneExam={this.sendCloneExam} selectExam={this.setCloneExam} data={this.state.exams} position={this.state.position} onCloseModal={this.onCloseModal} />
                  ) : (
                    <>
                      <div className="row">
                        {this.formData.map((field, index) => (
                          <div className="col-6" key={index}>
                            <div className="row">
                              <div className="col-4">
                                <label
                                  className="form-label input-label"
                                  htmlFor={field.id}
                                >
                                  {field.label}
                                  <span
                                    className="required"
                                    style={{ color: "red", marginLeft: "5px" }}
                                  >

                                  </span>
                                  <FormHelperText
                                    style={{ paddingLeft: "0px" }}
                                    className="helper"
                                  >
                                    {this.state.error[field.errorKey]
                                      ? this.state.error[
                                      field.errorKey + "ErrorMessage"
                                      ]
                                      : null}
                                  </FormHelperText>
                                </label>
                              </div>
                              <div className="col-6">
                                <input
                                  type={field.type}
                                  className="profile-page"
                                  onChange={field.handleChange}
                                  value={field.fieldValue}
                                  name={field.name}
                                  id={field.id}
                                  placeholder={field.placeholder}
                                  maxLength={50}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="row">
                        <div className="form-group col-12">
                          <label
                            className="form-label input-label"
                            for="inputSection"
                          >
                            Job Description:
                            <span
                              className="required"
                              style={{ color: "red", marginLeft: "5px" }}
                            >

                            </span>
                            <FormHelperText
                              style={{ paddingLeft: "0px" }}
                              className="helper"
                            >
                              {this.state.error.noOfCandidatesRequired
                                ? this.state.error
                                  .noOfCandidatesRequiredErrorMessage
                                : null}
                            </FormHelperText>
                          </label>
                          <CkEditor data={this.state.pstn.jobDescription} onChange={this.handleEditorChange} />
                        </div>
                      </div>
                      {!this.state.pstn.examId && (
                        <div
                          className="row"
                          style={{
                            display: "flex",
                            flexWrap: "nowrap",
                            width: "52rem",
                            marginTop: "1rem",
                            alignItems: "baseline",
                          }}
                        >
                          <>
                            <div className="col-4">
                              <label className="form-label input-label">
                                {!this.state.pstn.examId
                                  ? "Do You Want to Create Test"
                                  : "Do You Want to Update Test"}
                              </label>
                            </div>
                            <div style={{ width: "6rem" }}>
                              {
                                <span>
                                  Yes
                                  <Checkbox
                                    style={{
                                      color: this.state.wantExam
                                        ? "#f15a2d"
                                        : "",
                                    }}
                                    onChange={() =>
                                      this.setState({ wantExam: true })
                                    }
                                    checked={this.state.wantExam}
                                  />
                                </span>
                              }
                            </div>
                            <div>
                              {
                                <span>
                                  No
                                  <Checkbox
                                    style={{
                                      color: !this.state.wantExam
                                        ? "#f15a2d"
                                        : "",
                                    }}
                                    onChange={() =>
                                      this.setState({ wantExam: false })
                                    }
                                    checked={!this.state.wantExam}
                                  />
                                </span>
                              }
                            </div>
                          </>
                        </div>
                      )}
                      <div style={{ display: "flex", marginTop: "1rem" }}>
                        <StatusRadioButton
                          handleChange={this.handleChange}
                          status={this.state.pstn.status}
                          style={{ marginTop: "0.1rem" }}
                          adminStyle={{ width: "5rem" }}
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className="form-group row">
                  <div className="col-md-12">
                    <div
                      className="row"
                      style={{
                        float: "right",
                        paddingRight: "7rem",
                      }}
                    >
                      <div className="col-lg-6 col-sm-6 xol-md-6">
                        <button
                          disabled={this.state.disabled}
                          type="submit"
                          className="btn btn-sm btn-prev"
                          style={{ paddingRight: "0.5rem" }}
                        >
                          {action !== null ? "Update" : "Continue"}
                        </button>
                      </div>
                      <div className="col-lg-6 col-sm-6 xol-md-6">
                        <Link
                          className="btn btn-sm btn-nxt"
                          to="/admin/vacancy"
                        >
                          Cancel
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default withLocation(AddPosition);
