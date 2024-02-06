import React, { Component } from "react";
import LOGO from "../../assests/images/LOGO.svg";
import profile from "../../assests/images/profileCandidate.png";
import qualification from "../../assests/images/degree.png";
import axios from "axios";
import _ from "lodash";
import { Link } from "react-router-dom";
import { Avatar } from "@mui/material";
import { authHeader, errorHandler } from "../../api/Api";
import url from "../../utils/UrlConstant";
import ViewProfile from "./ViewProfile";
const path = window.location.pathname.replace(
  "/shortlisted-candidate-details/",
  ""
);
export default class ShortListedResultDetails extends Component {
  constructor(props) {
    super(props);
    if (localStorage.getItem(path)) {
      sessionStorage.setItem(path, localStorage.getItem(path));
      localStorage.removeItem(path);
    }
    this.state = {
      user: JSON.parse(sessionStorage.getItem(path)),
      results: {},
      pdfData: {},
      viewProfile: false,
      certificateData: [],
      programmingRound: [],
      sqlRound: [],
    };
  }

  componentDidMount() {
    axios
      .get(`${url.ADMIN_API}/company/exam-results/${path}`, {
        headers: authHeader(),
      })
      .then((res) => {
        this.setState(
          {
            results: res.data.response,
            programmingRound: _.filter(
              res.data.response,
              (r) => r.programmingRound
            ),
            sqlRound: _.filter(res.data.response, (r) => r.sqlRound),
          },
          () => this.getExamMonitor()
        );
      })
      .catch((err) => {
        errorHandler(err);
      });
    this.getResume();
    this.handleCandidateResultViewEventTrack();
    this.getCertificate();
  }

  handleCandidateResultViewEventTrack = () => {
    if (!window.dataLayer) {
      window.dataLayer = [];
    }

    window.dataLayer.push({
      event: "View_CandidateResult",
    });
  };

  renderTable = () => {
    return _.size(this.state.results) > 0
      ? _.map(this.state.results, (result, index) => {
          if (index !== "3") {
            return _.map(result.results, (res) => {
              return (
                <tr className="rowdesign" style={{ paddingLeft: "15px" }}>
                  <td style={{ color: "#000000" }}>{res.section}</td>
                  <td
                    style={{
                      color: "#000000",
                      fontWeight: "400",
                      fontSize: "13px",
                    }}
                  >
                    {res.easy !== 0
                      ? ((res.easy / res.totalInEasy) * 100).toFixed(0)
                      : 0}
                  </td>
                  <td
                    style={{
                      fontWeight: "400",
                      color: "#000000",
                      fontSize: "13px",
                    }}
                  >
                    {res.medium !== 0
                      ? ((res.medium / res.totalInMedium) * 100).toFixed(0)
                      : 0}
                  </td>
                  <td
                    style={{
                      fontWeight: "400",
                      color: "#000000",
                      fontSize: "13",
                    }}
                  >
                    {res.hard !== 0
                      ? ((res.hard / res.totalInHard) * 100).toFixed(0)
                      : 0}
                  </td>
                  <td
                    style={{
                      fontWeight: "400",
                      color: "#000000",
                      fontSize: "13px",
                      paddingLeft: "0px",
                    }}
                  >
                    {res.totalInSection !== 0
                      ? ((res.totalMarks / res.totalInSection) * 100).toFixed(0)
                      : 0}
                  </td>
                  <td
                    style={{
                      fontWeight: "400",
                      color: this.getColorsForSkill(res),
                      fontSize: "13px",
                      paddingLeft: "0px",
                    }}
                  >
                    <b>{this.calculateSkill(res)}</b>
                  </td>
                </tr>
              );
            });
          }
        })
      : null;
  };

  percentageCal() {
    let totalMark = 0;
    let totalQuestion = 0;
    let marks = 0;
    _.map(this.state.results, (result, index) => {
      if (index !== "3") {
        _.map(result.results, (res) => {
          totalMark += res.totalMarks;
          totalQuestion += res.totalInSection;
        });
      }
    });
    marks = ((totalMark / totalQuestion) * 100).toFixed(0);
    return isNaN(marks) ? "-" : marks + "%";
  }

  programRender = () => {
    return _.map(this.state.results, (r) => {
      return r.programmingRound || r.sqlRound ? (
        <Link
          className="btn btn-sm btn-prev"
          to={{ pathname: "/admin/result/candidate/programResult/" + path }}
          onClick={() => this.setCandidate()}
          target={"_blank"}
        >
          {!r.sqlRound ? "VIEW PROGRAMMING" : "VIEW SQL"}
        </Link>
      ) : null;
    });
  };

  setCandidate = () => {
    let user = localStorage.getItem(path);
    if (!user) {
      user = JSON.parse(sessionStorage.getItem(path));
      user.submittedExam =
        this.state.programmingRound[0].submittedExam ||
        this.state.sqlRound[0].submittedExam;
      user.screenShot =
        this.state.programmingRound[0]?.screenShot ||
        this.state.sqlRound[0]?.screenShot;
      user.sqlRound = _.size(this.state.sqlRound) > 0;
      user.programmingRound = _.size(this.state.programmingRound) > 0;
      localStorage.setItem(path, JSON.stringify(user));
    }
    localStorage.setItem("examMonitor", JSON.stringify(this.state.examMonitor));
  };

  getExamMonitor = () => {
    return _.map(this.state.results, (r) => {
      return r.programmingRound || r.sqlRound
        ? axios
            .get(
              `${url.CANDIDATE_API}/candidate/exam-monitor/${r.examId}/${this.state.user.email}`,
              { headers: authHeader() }
            )
            .then((res) => {
              this.setState({ examMonitor: res.data.response }, () =>
                this.getProfilePic()
              );
            })
            .catch((e) => errorHandler(e))
        : null;
    });
  };

  getProfilePic = () => {
    if (
      this.state.programmingRound[0]?.screenShot ||
      this.state.sqlRound[0]?.screenShot
    ) {
      const path = this.state.programmingRound[0].screenShot
        ? this.state.programmingRound[0]?.screenShot?.profilePath
        : this.state.sqlRound[0]?.screenShot?.profilePath;
      axios
        .get(`${url.ADMIN_API}/onlineTest/getScreenShotImage?path=${path}`, {
          headers: authHeader(),
        })
        .then((res) => {
          this.setState({ profilePic: res.data.message });
        });
    }
  };

  getResume = () => {
    axios
      .get(` ${url.ADMIN_API}/company/resume/${this.state.user?.id}`, {
        headers: authHeader(),
        responseType: "blob",
      })
      .then((res) => {
        const pdf = {};
        let url = window.URL.createObjectURL(res.data);
        pdf.data = url.concat("#toolbar=0");
        this.setState({ pdfData: pdf });
      })
      .catch((e) => {
        errorHandler(e);
      });
  };

  close = () => {
    this.setState({ viewProfile: false });
  };

  enlargeImg() {
    let img = document.getElementById("img");
    img.style.transform = "scale(2.5)";
    img.style.transition = "transform 0.25s ease";
    img.style.zIndex = 100;
  }

  reSizeImg = () => {
    let img = document.getElementById("img");
    img.style.width = "180";
    img.style.height = "180";
    img.style.transform = "";
    img.style.transition = "";
  };

  getColorsForSkill = (res) => {
    let r = this.calculateSkill(res);
    if (r === "Need to improve") {
      return "red";
    } else if (r === "Good" || r === "Very Good") {
      return "#1b9403";
    } else return "blue";
  };

  getCertificate = () => {
    axios
      .get(`${url.COLLEGE_API}/certificate?studentId=${this.state.user?.id}`, {
        headers: authHeader(),
      })
      .then((res) => {
        this.setState({ certificateData: res.data.response });
      })
      .catch((e) => {
        errorHandler(e);
      });
  };

  calculateSkill = (result) => {
    console.log(result);
    let takenPercantage = (
      (result.totalMarks / result.totalInSection) *
      100
    ).toFixed(0);
    if (takenPercantage < 60) {
      return "Need to improve";
    } else if (takenPercantage >= 60 && takenPercantage <= 70) {
      return "Good";
    } else if (takenPercantage > 70 && takenPercantage <= 80) {
      return "Very Good";
    } else {
      return "Excellent";
    }
  };

  render() {
    return (
      <div>
        <div className="header">
          <img className="header-logo" src={LOGO} alt="SkillSort" />
        </div>
        <div
          className="modal-content"
          style={{
            overflowY: "auto",
            marginTop: "1rem",
            paddingRight: "30px",
            // height: 'calc(100vh - 60px)'
          }}
        >
          <div
            className="modal-header"
            style={{ border: "none" }}
            onClick={this.state.profilePic ? this.reSizeImg : null}
          >
            <h6
              style={{
                fontSize: "50px",
                paddingTop: "5px",
                fontFamily: "Baskervville",
                color: "#000000",
                paddingLeft: "130px",
              }}
            >
              Test Result
            </h6>
            <div className="score-card" style={{ marginLeft: "34rem" }}>
              <span className="username"> SkillSort Score :</span>{" "}
              <span className="score">{this.state.user.skillSortScore}%</span>
            </div>
          </div>
        </div>
        <div className="backPic"
          style={{
            display: "flex",
            height: "calc(100vh - 150px)",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginRight: "2rem",
              marginLeft: "13rem",
            }}
          >
            <div className="col-sm-4 user-profile">
              <div className="row" style={{ display: "contents" }}>
                <div className="card-block content-align">
                  {this.state.profilePic ? (
                    <Avatar
                      id="img"
                      onClick={this.enlargeImg}
                      style={{ width: 180, height: 180 }}
                      src={`data:image/png;base64,${this.state.profilePic}`}
                      alt="profile"
                    />
                  ) : (
                    <img src={profile} alt="profile" />
                  )}
                    <h4
                      className="f-w-600 mt-4"
                      style={{
                        fontSize: "1.5rem",
                        marginBottom: "0.5rem",
                        lineHeight: "1.2",
                        color: "#3B489E",
                        fontFamily: "Montserrat",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {this.state.user.firstName} {this.state.user.lastName}
                    </h4>
                    <h5
                      style={{
                        fontWeight: "400",
                        color: "#000000",
                        fontSize: "13px",
                        marginBottom: "18px",
                      }}
                    >
                      <img
                        src={qualification}
                        alt=""
                        style={{ width: "30px", marginLeft: "-36px" }}
                      />{" "}
                      {this.state.user.qualification}
                    </h5>
                    <p
                      style={{
                        fontWeight: "400",
                        color: "#000000",
                        fontSize: "13px",
                        marginBottom: "0px",
                      }}
                    >
                      {this.state.user.email}
                    </p>
                    <p
                      style={{
                        fontWeight: "400",
                        color: "#000000",
                        fontSize: "13px",
                        marginBottom: "0px",
                      }}
                    >
                      {this.state.user.phone}
                    </p>
                </div>
              </div>
              <div className="row" >
                <div
                  className="card-block content-align"
                >
                  <button
                    onClick={() =>
                      this.setState({
                        viewProfile: !this.state.viewProfile,
                        type: "resume",
                      })
                    }
                    className="btn btn-sm btn-nxt"
                    style={{ fontFamily: "Montserrat", width: "8rem" }}
                  >
                    View Resume
                  </button>
                </div>
                {_.size(this.state.certificateData) > 0 ? (
                  <div
                    className="card-block content-align"
                    style={{ paddingTop: "0px" }}
                  >
                    <button
                      onClick={() =>
                        this.setState({
                          viewProfile: !this.state.viewProfile,
                          type: "certificate",
                        })
                      }
                      className="btn btn-sm btn-newnext"
                      style={{ fontFamily: "Montserrat" }}
                    >
                      View Certficate
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <div className="verticalline"></div>
          </div>
          <div>
            <div
              className="card-block"
              onClick={this.state.profilePic ? this.reSizeImg : null}
            >
              <h6
                className="m-b-20 p-b-5 b-b-default f-w-600"
                style={{ border: "none", color: "#fc3f06" }}
              >
                ACADAMIC
              </h6>
              <div className="row">
                <div className="col-sm-2">
                  <p className="m-b-10 f-w-400">SSLC</p>
                  <h6 className="f-w-600">{this.state.user.sslc}%</h6>
                </div>
                <div className="col-sm-2">
                  <p className="m-b-10 f-w-400">HSC</p>
                  <h6 className="f-w-600">{this.state.user.hsc}%</h6>
                </div>
                <div className="col-sm-2">
                  <p className="m-b-10 f-w-400">UG</p>
                  <h6 className="f-w-600">{this.state.user.ug}%</h6>
                </div>
                {this.state.user.pgPercentage ? (
                  <div className="col-sm-2">
                    <p className="m-b-10 f-w-400">PG</p>
                    <h6 className="f-w-600">{this.state.user.pg}%</h6>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <h6
                className="m-b-20 m-t-40 p-b-5 b-b-default f-w-600"
                style={{
                  border: "none",
                  color: "#fc3f06",
                  marginBottom: "0px",
                  marginTop: "50px",
                }}
              >
                ONLINE TEST SCORE
              </h6>
              <div
                className="row"
                style={{ paddingLeft: "15px", width: "46rem" }}
              >
                <table
                  className="table table-hover"
                  style={{ opacity: "65%", marginBottom: "0px" }}
                >
                  <thead style={{ backgroundColor: "#E0E1EA" }}>
                    <th
                      className="col-lg-3 thdesign"
                      style={{ fontWeight: "2000", color: "#000000" }}
                    >
                      Section
                    </th>
                    <th
                      className="col-lg-2 thdesign"
                      style={{ fontWeight: "2000", color: "#000000" }}
                    >
                      Simple %
                    </th>
                    <th
                      className="col-lg-2 thdesign"
                      style={{ fontWeight: "2000", color: "#000000" }}
                    >
                      Medium %
                    </th>
                    <th
                      className="col-lg-2 thdesign"
                      style={{ fontWeight: "2000", color: "#000000" }}
                    >
                      Complex %
                    </th>
                    <th
                      className="col-lg-2 thdesign"
                      style={{ fontWeight: "2000", color: "#000000" }}
                    >
                      Total %
                    </th>
                    <th
                      className="col-lg-2 thdesign"
                      style={{ fontWeight: "2000", color: "#000000" }}
                    >
                      Report
                    </th>
                  </thead>
                  <tbody>{this.renderTable()}</tbody>
                </table>
                <div
                  className="row"
                  style={{ width: "710px", marginTop: "5px" }}
                >
                  <div className="col-7 col-lg-7">{this.programRender()}</div>
                  <div className="col-5 col-lg-5">
                    {/* <p style={{ textAlign: 'center', marginLeft: '145px' }}><strong>{this.percentageCal()}</strong></p> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.state.viewProfile ?
          <div>
            <ViewProfile type={this.state.type} certificateData={this.state.certificateData} pdfData={this.state.pdfData.data} onClose={this.close} />
          </div> : ''
        }
      </div>
    );
  }
}
