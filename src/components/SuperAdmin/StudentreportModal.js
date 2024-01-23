import axios from "axios";
import _ from "lodash";
import moment from "moment";
import React, { Component } from "react";
import { authHeader, errorHandler } from "../../api/Api";
import { calculatePercentage, fallBackLoader } from "../../utils/CommonUtils";
import ExportXlsx from "../../utils/ExportXlsx";
import MultiSelectDropDown from "../../utils/MultiselectDropDown";
import Pagination from "../../utils/Pagination";
import { isRoleValidation } from "../../utils/Validation";
import { url } from "../../utils/UrlConstant";
import RenderModalBody from "../../common/RenderModalBody";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DatePick from "../../common/DatePick";
import { CustomTable } from "../../utils/CustomTable";
import { th } from "date-fns/locale";

const columnsForCollege = [
  { header: "NAME", key: "firstName", alignment: "left" },
  { header: "DEPARTMENT", key: "department", alignment: "center" },
  { header: "LOGICAL (%)", key: "LOGICAL REASONING", alignment: "right" },
  { header: "VERBAL (%)", key: "VERBAL ABILITY", alignment: "right" },
  { header: "NUMERICAL (%)", key: "NUMERICAL ABILITY", alignment: "right" },
  { header: "TECHNICAL (%)", key: "tech", alignment: "right" },
  { header: "PROGRAMMING", key: "programming", alignment: "right" },
  { header: "SKILLSORT SCORE", key: "score", alignment: "right" },
];

const columnsForSuperAdmin = [
  { header: "NAME", key: "firstName" },
  { header: "EMAIL", key: "email" },
  { header: "PHONE", key: "phone" },
  { header: "GENDER", key: "gender" },
  { header: "COLLEGE NAME", key: "collegeName" },
  { header: "DEPARTMENT", key: "department" },
  { header: "SSLC%", key: "sslc" },
  { header: "HSC%", key: "hsc" },
  { header: "UG%", key: "ug" },
  { header: "YOP", key: "yop" },
  { header: "SKILLSORT SCORE", key: "score" },
];

const keys = [
  "firstName",
  "department",
  "collegeName",
  "gender",
  "email",
  "phone",
  "sslc",
  "hsc",
  "ug",
  "yop",
  "company",
  "LOGICAL REASONING",
  "VERBAL ABILITY",
  "NUMERICAL ABILITY",
  "tech",
  "programming",
  "score",
];

export default class StudentreportModal extends Component {
  constructor() {
    super();
    this.state = {
      student: [],
      studentXlsx: [],
      skillSortscoreXlsx: [],
      colleges: [],
      skillSortscore: [],
      department: [],
      toggleClick: false,
      isSkillSortScorePresent: true,
      loader: false,
      currentPage: 1,
      pageSize: 10,
      totalPages: 0,
      totalElements: 0,
      numberOfElements: 0,
      countError: false,
      startPage: 1,
      endPage: 5,
      totalStudents: 0,
      selectedYop: [],
      yops: [],
      disabled: false,
      report: {
        fromDate: "",
        toDate: "",
        email: "",
        collegeId: "",
        department: "",
        yop: [],
        skillsortScore: "",
        role: "STUDENT",
      },
    };
  }
  onChange = (value, key) => {
    const { report } = this.state;
    if (key === "collegeId") {
      report[key] = this.state.colleges[value.target.value]?.id;
    } else if (key === "department") {
      report[key] = this.state.department[value.target.value]?.departmentName;
    } else {
      report[key] = value;
    }
    this.setState({ report: report });
  };

  getReport = () => {
    const report = _.cloneDeep(this.state.report);
    if (moment(report.fromDate).isValid() && moment(report.toDate).isValid()) {
      report.fromDate = moment(report.fromDate).format("DD/MM/YYYY");
      report.toDate = moment(report.toDate).format("DD/MM/YYYY");
    }
    if (_.isEmpty(report.toDate) && report.fromDate) {
      let toDate = new Date();
      report.fromDate = moment(report.fromDate).format("DD/MM/YYYY");
      report.toDate = moment(toDate).format("DD/MM/YYYY");
    }
    axios
      .post(
        ` ${url.COLLEGE_API}/student/getReport?page=${this.state.currentPage}&size=${this.state.pageSize}`,
        report,
        { headers: authHeader() }
      )
      .then((res) => {
        this.setState(
          {
            student: res.data.response.student.content,
            skillSortscore: res.data.response.score,
            totalPages: res.data.response.student.totalPages,
            totalElements: res.data.response.student.totalElements,
            numberOfElements: res.data.response.student.numberOfElements,
            loader: false,
            isSkillSortScorePresent: true,
          },
          isRoleValidation() === "COLLEGE_ADMIN"
            ? () => this.getSectionMarks()
            : null
        );
      })
      .catch((error) => {
        this.setState({ loader: false });
        errorHandler(error);
      });
  };
  onNextPage = () => {
    !this.state.report.skillsortScore
      ? this.getReport()
      : this.getScoreReport();
  };
  onPagination = (pageSize, currentPage) => {
    this.setState({ pageSize: pageSize, currentPage: currentPage }, () => {
      this.onNextPage();
    });
  };
  increment = () => {
    this.setState({
      startPage: this.state.startPage + 5,
      endPage: this.state.endPage + 5,
    });
  };
  decrement = () => {
    this.setState({
      startPage: this.state.startPage - 5,
      endPage: this.state.endPage - 5,
    });
  };

  handleReset = () => {
    this.setState(
      {
        student: [],
        colleges: [],
        department: [],
        report: {
          ...this.state.report,
          fromDate: "",
          toDate: "",
          email: "",
          collegeId: "",
          department: "",
          skillsortScore: "",
          yop: [],
        },
        currentPage: 1,
        pageSize: 10,
        totalPages: 0,
        totalElements: 0,
        numberOfElements: 0,
        countError: false,
        startPage: 1,
        endPage: 5,
        selectedYop: [],
        showCompanyOfferReleased: "NO",
      },
      () => this.getReport(),
      this.getCollege(),
      this.getDepartment()
    );
  };

  componentDidMount() {
    this.setHeader();
    this.getCollege();
    if (isRoleValidation() === "SUPER_ADMIN") this.getReport();
    this.getDepartment();
    this.setYearRange();
  }
  setYearRange = () => {
    let startDay = moment().subtract(5, "years");
    let endDate = moment().add(2, "years");
    this.setState({ yops: _.range(startDay.year(), endDate.year()) });
  };

  getDepartment = () => {
    axios
      .get(` ${url.ADMIN_API}/department?status=ACTIVE`, {
        headers: authHeader(),
      })
      .then((res) => {
        this.setState({ department: res.data.response });
      })
      .catch((error) => {
        errorHandler(error);
      });
  };
  pageChange = () => {
    this.setState(
      {
        currentPage: 1,
        pageSize: 10,
        totalPages: 0,
        totalElements: 0,
        numberOfElements: 0,
        startPage: 1,
        endPage: 5,
      },
      () =>
        !this.state.report.skillsortScore
          ? this.getReport()
          : this.getScoreReport()
    );
  };

  getScoreReport = () => {
    const report = _.cloneDeep(this.state.report);
    if (moment(report.fromDate).isValid() && moment(report.toDate).isValid()) {
      report.fromDate = moment(report.fromDate).format("DD/MM/YYYY");
      report.toDate = moment(report.toDate).format("DD/MM/YYYY");
    }
    if (_.isEmpty(report.toDate) && report.fromDate) {
      let toDate = new Date();
      report.fromDate = moment(report.fromDate).format("DD/MM/YYYY");
      report.toDate = moment(toDate).format("DD/MM/YYYY");
    }
    if (
      this.state.showCompanyOfferReleased === "YES" &&
      !this.state.report.skillsortScore
    ) {
      report.skillsortScore = 0;
    }
    axios
      .post(
        ` ${url.ADMIN_API}/adv-search/studentReport?page=${this.state.currentPage}&size=${this.state.pageSize}`,
        report,
        { headers: authHeader() }
      )
      .then((res) => {
        let studentScore = _.reduce(
          res.data.response.content,
          (st, obj) => {
            st[obj.email] = obj.skillSortScore ? obj.skillSortScore : "-";
            return st;
          },
          {}
        );
        this.setState(
          {
            student: res.data.response.content,
            skillSortscore: studentScore,
            totalPages: res.data.response.totalPages,
            totalElements: res.data.response.totalElements,
            numberOfElements: res.data.response.numberOfElements,
            isSkillSortScorePresent: false,
            loader: false,
          },
          isRoleValidation() === "COLLEGE_ADMIN"
            ? () => this.getSectionMarks()
            : null
        );
      })
      .catch((error) => {
        this.setState({ loader: false });
        errorHandler(error);
      });
  };
  handleYopChange = (event, isClearAll) => {
    if (isClearAll) {
      this.setState({
        selectedYop: [],
        report: { ...this.state.report, yop: [] },
      });
      return;
    }
    const value = event.target.value;
    this.setState({
      selectedYop: value,
      report: { ...this.state.report, yop: value },
    });
  };
  getCollege = () => {
    axios
      .get(` ${url.COLLEGE_API}/college/list?status=${"ACTIVE"}`, {
        headers: authHeader(),
      })
      .then((res) => {
        this.setState({ colleges: res.data.response });
        if (isRoleValidation() !== "SUPER_ADMIN") {
          let data = _.filter(
            res.data.response,
            (r) => r.id === this.props.collegeId
          );
          _.map(data, (c) => {
            this.setState({
              collegeName: c.collegeName,
              report: { ...this.state.report, collegeId: c.id },
            });
            this.getReport();
          });
        }
      })
      .catch((error) => {
        errorHandler(error);
      });
  };

  toggleHandle = () => this.setState({ toggleClick: !this.state.toggleClick });

  xlsxDownloadApi = () => {
    !this.state.report.skillsortScore
      ? this.getReportXlsx()
      : this.getScoreReportXlsx();
  };

  getScoreReportXlsx = () => {
    this.setState({ disabled: true });
    const report = _.cloneDeep(this.state.report);
    if (moment(report.fromDate).isValid() && moment(report.toDate).isValid()) {
      report.fromDate = moment(report.fromDate).format("DD/MM/YYYY");
      report.toDate = moment(report.toDate).format("DD/MM/YYYY");
    }
    if (_.isEmpty(report.toDate) && report.fromDate) {
      let toDate = new Date();
      report.fromDate = moment(report.fromDate).format("DD/MM/YYYY");
      report.toDate = moment(toDate).format("DD/MM/YYYY");
    }
    if (
      this.state.showCompanyOfferReleased === "YES" &&
      !this.state.report.skillsortScore
    ) {
      report.skillsortScore = 0;
    }
    axios
      .post(
        ` ${url.ADMIN_API}/adv-search/studentReport?page=${1}&size=${
          this.state.totalElements
        }`,
        report,
        { headers: authHeader() }
      )
      .then((res) => {
        this.setState(
          {
            studentXlsx: res.data.response.content,
            skillSortscoreXlsx: res.data.response.score,
            isSkillSortScorePresent: false,
          },
          () => this.downloadCsv()
        );
      })
      .catch((error) => {
        this.setState({ loader: false, disabled: false });
        errorHandler(error);
      });
  };

  getReportXlsx = () => {
    this.setState({ disabled: true });
    const report = _.cloneDeep(this.state.report);
    if (moment(report.fromDate).isValid() && moment(report.toDate).isValid()) {
      report.fromDate = moment(report.fromDate).format("DD/MM/YYYY");
      report.toDate = moment(report.toDate).format("DD/MM/YYYY");
    }
    if (_.isEmpty(report.toDate) && report.fromDate) {
      let toDate = new Date();
      report.fromDate = moment(report.fromDate).format("DD/MM/YYYY");
      report.toDate = moment(toDate).format("DD/MM/YYYY");
    }
    axios
      .post(
        ` ${url.COLLEGE_API}/student/getReport?page=${1}&size=${
          this.state.totalElements
        }`,
        report,
        { headers: authHeader() }
      )
      .then((res) => {
        this.setState(
          {
            studentXlsx: res.data.response.student.content,
            skillSortscoreXlsx: res.data.response.score,
            isSkillSortScorePresent: true,
          },
          () => this.downloadCsv()
        );
      })
      .catch((error) => {
        this.setState({ loader: false });
        errorHandler(error);
      });
  };

  downloadCsv = async () => {
    if (isRoleValidation() === "COLLEGE_ADMIN") {
      await this.getSectionMarks("csv");
    }
    const data = _.map(this.state.studentXlsx, (stu) =>
      _.pick(
        {
          ...stu,
          score: this.state.isSkillSortScorePresent
            ? _.round(this.state.skillSortscoreXlsx[stu.email])
              ? _.round(this.state.skillSortscoreXlsx[stu.email])
              : ""
            : stu.skillSortScore
            ? stu.skillSortScore
            : "-",
        },
        keys
      )
    );
    ExportXlsx(
      data,
      "StudentReport",
      isRoleValidation() === "SUPER_ADMIN"
        ? columnsForSuperAdmin
        : columnsForCollege
    );
    this.setState({ disabled: false });
  };

  getSectionMarks = async (key) => {
    const { student } = this.state;
    const { studentXlsx } = this.state;
    let ids = [];
    _.map(key === "csv" ? studentXlsx : student, (s) => {
      ids.push(s.id);
    });
    await axios
      .post(`${url.ADMIN_API}/adv-search/student-result`, ids, {
        headers: authHeader(),
      })
      .then((res) => {
        const results = res.data.response.data.response;
        _.map(key === "csv" ? studentXlsx : student, (s) => {
          if (results[s.id]) {
            if (results[s.id].level1Result) {
              _.map(results[s.id].level1Result, (r) => {
                s[r.section] = calculatePercentage(
                  r.totalMarks,
                  r.totalInSection
                );
              });
            }
            if (results[s.id].level2Result) {
              let tech = results[s.id].level2Result;
              s.tech = calculatePercentage(
                tech.totalMarks,
                tech.totalInSection
              );
            }
            if (results[s.id].programmingMarks) {
              s.programming = results[s.id].programmingMarks;
            }
          }
        });
        this.setState({ student: student, studentXlsx: studentXlsx });
      })
      .catch((error) => {
        errorHandler(error);
      });
  };

  renderTable = () => {
    let i = this.state.pageSize - 1;
    return this.state.student.length > 0 ? (
      _.map(this.state.student || [], (student, index) => {
        let score = this.state.isSkillSortScorePresent
          ? this.state.skillSortscore[student.email]
          : null;
        return (
          <>
            <tr key={index}>
              <td
                className="col-lg-1"
                style={{
                  textAlign: "center",
                  fontSize: this.state.toggleClick ? null : "11px",
                }}
              >
                {this.state.pageSize * this.state.currentPage - i--}
              </td>
              <td
                className="col-lg-2"
                style={{
                  textAlign: "left",
                  textTransform: "capitalize",
                  fontSize: this.state.toggleClick ? null : "11px",
                }}
              >{`${student.firstName} ${student.lastName}`}</td>
              <td
                className="col-lg-2"
                style={{
                  textAlign: "left",
                  textTransform: "captilize",
                  fontSize: this.state.toggleClick ? null : "11px",
                }}
              >
                {student.email}
              </td>
              {isRoleValidation() === "SUPER_ADMIN" ? (
                <td
                  style={{
                    textAlign: "left",
                    fontSize: this.state.toggleClick ? null : "11px",
                  }}
                  className="col-lg-3"
                >
                  {student.collegeName
                    ? student.collegeName
                    : student.college?.collegeName}
                </td>
              ) : null}
              <td
                className="col-lg-3"
                style={{
                  textAlign: "left",
                  fontSize: this.state.toggleClick ? null : "11px",
                }}
              >
                {student.department !== "" && student.department !== null
                  ? student.department
                  : "-"}
              </td>
              <td
                className="col-lg-1"
                style={{
                  textAlign: "center",
                  fontSize: this.state.toggleClick ? null : "11px",
                }}
              >
                {this.state.isSkillSortScorePresent
                  ? score !== undefined && score !== null
                    ? Math.round(score)
                    : "-"
                  : student.skillSortScore
                  ? student.skillSortScore
                  : "-"}
              </td>
            </tr>
          </>
        );
      })
    ) : (
      <tr className="text-center">
        <td colspan="8">No data available in table</td>
      </tr>
    );
  };

  renderTableForCollege = () => {
    let i = this.state.pageSize - 1;
    return this.state.student.length > 0 ? (
      _.map(this.state.student || [], (student, index) => {
        let score = this.state.isSkillSortScorePresent
          ? this.state.skillSortscore[student.email]
          : null;
        return (
          <>
            <tr key={index}>
              <td
                className="col-lg-1"
                style={{
                  textAlign: "center",
                  fontSize: this.state.toggleClick ? null : "11px",
                }}
              >
                {this.state.pageSize * this.state.currentPage - i--}
              </td>
              <td
                className="col-lg-2"
                style={{
                  textAlign: "left",
                  textTransform: "capitalize",
                  fontSize: this.state.toggleClick ? null : "11px",
                }}
              >{`${student.firstName} ${student.lastName}`}</td>
              <td
                className="col-lg-3"
                style={{
                  textAlign: "left",
                  fontSize: this.state.toggleClick ? null : "11px",
                }}
              >
                {student.department !== "" && student.department !== null
                  ? student.department
                  : "-"}
              </td>
              <td
                className="col-lg-1"
                style={{
                  textAlign: "center",
                  fontSize: this.state.toggleClick ? null : "11px",
                }}
              >
                {student["LOGICAL REASONING"]}
              </td>
              <td
                className="col-lg-1"
                style={{
                  textAlign: "center",
                  fontSize: this.state.toggleClick ? null : "11px",
                }}
              >
                {student["VERBAL ABILITY"]}
              </td>
              <td
                className="col-lg-1"
                style={{
                  textAlign: "center",
                  fontSize: this.state.toggleClick ? null : "11px",
                }}
              >
                {student["NUMERICAL ABILITY"]}
              </td>
              <td
                className="col-lg-1"
                style={{
                  textAlign: "center",
                  fontSize: this.state.toggleClick ? null : "11px",
                }}
              >
                {student["tech"]}
              </td>
              <td
                className="col-lg-1"
                style={{
                  textAlign: "center",
                  fontSize: this.state.toggleClick ? null : "11px",
                }}
              >
                {this.state.isSkillSortScorePresent
                  ? score !== undefined && score !== null
                    ? Math.round(score)
                    : "-"
                  : student.skillSortScore
                  ? student.skillSortScore
                  : "-"}
              </td>
            </tr>
          </>
        );
      })
    ) : (
      <tr className="text-center">
        <td colspan="8">No data available in table</td>
      </tr>
    );
  };
  setHeader = () => {
    const headers = [
      {
        name: "S.NO",
        align: "center",
        key: "S.NO",
      },
      {
        name: "NAME",
        align: "left",
        key: "firstName",
      },
      {
        name: "DEPARTMENT",
        align: "left",
        renderCell: (params) => {
          return params.department ? params.department : "-";
        },
      },
      {
        name: "LOGICAL",
        align: "center",

        renderCell: (params) => {
          return params["LOGICAL REASONING"]
            ? params["LOGICAL REASONING"]
            : "-";
        },
      },
      {
        name: "VERBAL",
        align: "center",
        renderCell: (params) => {
          return params["VERBAL ABILITY"] ? params["VERBAL ABILITY"] : "-";
        },
      },
      {
        name: "NUMERICAL",
        align: "center",
        renderCell: (params) => {
          return params["NUMERICAL ABILITY"]
            ? params["NUMERICAL ABILITY"]
            : "-";
        },
      },
      {
        name: "TECHNICAL",
        align: "center",
        renderCell: (params) => {
          return params["tech"] ? params["tech"] : "-";
        },
      },
      {
        name: "SKILLSORTSCORE",
        align: "center",
        renderCell: (params) => {
          let score = this.state.isSkillSortScorePresent
            ? this.state.skillSortscore[params.email]
            : null;
          return this.state.isSkillSortScorePresent
            ? score !== undefined && score !== null
              ? Math.round(score)
              : "-"
            : params.skillSortScore
            ? params.skillSortScore
            : "-";
        },
      },
    ];
    this.setState({ headers });
  };

  render() {
    return (
      <div
        className="modal fade show"
        id="myModal"
        role="dialog"
        style={{ display: "block", backgroundColor: "rgba(0,0,0,0.90)" }}
        aria-hidden="true"
      >
        <div className="modal-dialog-full-width" style={{ margin: "1rem" }}>
          <div
            className="modal-content"
            style={{
              borderStyle: "solid",
              borderColor: "#af80ecd1",
              borderRadius: "15px",
              height: "93vh",
              verticalAlign: "center",
            }}
          >
            <div
              className="modal-header"
              style={{ border: "none", height: "3rem" }}
            >
              {this.state.toggleClick ? "" : <span>Options </span>}
              <i
                onClick={this.toggleHandle}
                className="fa fa-filter"
                aria-hidden="true"
                style={{
                  cursor: 'pointer',
                  fontSize: "1.5rem",
                  marginRight: this.state.toggleClick
                    ? ""
                    : _.size(this.state.student) > 0
                    ? "46rem"
                    : "56.5rem",
                }}
              />
              <div style={{display: 'flex', alignItems: 'center'}}>
                {_.size(this.state.student) > 0 ? (
                  <button
                    disabled={this.state.disabled}
                    style={{ marginRight: "1rem" }}
                    onClick={this.xlsxDownloadApi}
                    className="btn-sm btn btn-nxt"
                  >
                    Download
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={this.props.onCloseModal}
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            </div>
            <RenderModalBody
              onChange={this.onChange}
              report={this.state.report}
              renderTable={this.renderTable}
              numberOfElements={this.state.numberOfElements}
              totalPages={this.state.totalPages}
              startPage={this.state.startPage}
              endPage={this.state.endPage}
              pageSize={this.state.pageSize}
              loader={this.state.loader}
              currentPage={this.state.currentPage}
              onPagination={this.onPagination}
              onNextPage={this.onNextPage}
              decrement={this.decrement}
              increment={this.increment}
              totalElements={this.state.totalElements}
              renderTableForCollege={this.renderTableForCollege}
              headers={this.state.headers}
              data={this.state.student}
              selectedYop={this.state.selectedYop}
              yops={this.state.yops}
              handleYopChange={this.handleYopChange}
              pageChange={this.pageChange}
              handleReset={this.handleReset}
              department={this.state.department}
              toggleClick={this.state.toggleClick}
            />
          </div>
        </div>
      </div>
    );
  }
}






















            {/* <div className="modal-body">
              <div className="row">
                {this.state.toggleClick ? (
                  ""
                ) : (
                  <div
                    className="col-md-2 col-lg-2 col-xl-2"
                    style={{
                      height: "calc(100vh - 8rem)",
                      overflowY: "auto",
                      display: "flex",
                      overflowX: "hidden",
                      justifyContent:"space-around",
                      paddingBottom: "1rem",
                    }}
                  >
                    <div
                      className="row"
                      style={{
                        flexDirection: "column",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div className="mb-05">
                        <label>From Date</label>
                        <div>
                          <DatePick
                            label="DD/MM/YYYY"
                            onChange={(date) => this.onChange(date, "fromDate")}
                            value={this.state.report.fromDate || null}
                            views={["year", "month", "day"]}
                          />
                        </div>
                      </div>
                      <div className="mb-05">
                        <label>To Date</label>
                        <div>
                          <DatePick
                            label="DD/MM/YYYY"
                            onChange={(date) => this.onChange(date, "toDate")}
                            value={this.state.report.toDate || null}
                            views={["year", "month", "day"]}
                          />
                        </div>
                      </div>
                      <div className="mb-05">
                        <label>Email</label>
                        <div>
                          <input
                            className="profile-page"
                            style={{ width: "12rem" }}
                            type="text"
                            placeholder="Enter email"
                            value={this.state.report.email}
                            onChange={(e) =>
                              this.onChange(e.target.value, "email")
                            }
                          ></input>
                        </div>
                      </div>
                      <div className="mb-05">
                        <label>SkillSort Score</label>
                        <div>
                          <input
                            className="profile-page"
                            style={{ width: "12rem" }}
                            type="text"
                            placeholder="Enter SkillSort Score"
                            value={this.state.report.skillsortScore}
                            onChange={(e) =>
                              this.onChange(e.target.value, "skillsortScore")
                            }
                          ></input>
                        </div>
                      </div>
                      <div className="mb-05">
                        <label>Year of passing</label>
                        <div style={{ width: "12.5rem" }}>
                          <MultiSelectDropDown
                            value={this.state.selectedYop}
                            list={this.state.yops}
                            handleChange={(e, isClearAll) =>
                              this.handleYopChange(e, isClearAll)
                            }
                            placeholder={"Select YOP"}
                            width={200}
                          />
                        </div>
                      </div>
                      {isRoleValidation() === "SUPER_ADMIN" ? (
                        <div className="mb-05">
                          <label>College</label>
                          <div>
                            <select
                              className="profile-page"
                              style={{ width: "12.5rem" }}
                              required="true"
                              onChange={(e) => this.onChange(e, "collegeId")}
                            >
                              <option hidden selected value="">
                                Select college
                              </option>
                              {_.map(this.state.colleges, (college, index) => {
                                return (
                                  <option value={index}>
                                    {college.collegeName}{" "}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                      ) : null}
                      <div className="mb-05">
                        <label>Department</label>
                        <div>
                          <select
                            className="profile-page"
                            style={{ width: "12rem" }}
                            required="true"
                            onChange={(e) => this.onChange(e, "department")}
                          >
                            <option hidden selected value="">
                              Select Department
                            </option>
                            {_.map(
                              this.state.department,
                              (department, index) => {
                                return (
                                  <option value={index}>
                                    {department.departmentName}{" "}
                                  </option>
                                );
                              }
                            )}
                          </select>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <button
                          className="btn btn-sm btn-prev"
                          style={{ minWidth: "5rem" }}
                          onClick={this.pageChange}
                        >
                          Filter
                        </button>
                        <button
                          disabled={
                            !this.state.report.fromDate &&
                            !this.state.report.toDate &&
                            !this.state.report.email &&
                            !this.state.report.collegeId &&
                            !this.state.report.department &&
                            !this.state.report.skillsortScore &&
                            _.size(this.state.report.yop) === 0
                          }
                          className="btn btn-sm btn-nxt"
                          style={{ minWidth: "5rem" }}
                          onClick={this.handleReset}
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div
                  className={this.state.toggleClick ? "col-sm-12" : "col-sm-10"}
                  style={{
                    borderTop: "2px solid grey",
                    borderLeft: this.state.toggleClick
                      ? null
                      : "2px solid grey",
                    height: "calc(100vh - 8.25rem)",
                  }}
                >
                  {fallBackLoader(this.state.loader)}
                  <div style={{ marginTop: "1rem" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        className="dash-text"
                        style={{ fontWeight: "400", marginLeft: "1.4rem" }}
                      >
                        Student Report
                      </span>
                      <span
                        className="dash-text"
                        style={{ marginRight: "1.4rem" }}
                      >
                        Total Students : {this.state.totalElements}
                      </span>
                    </div>
                    <div
                      style={{
                        marginTop: "1rem",
                        height: "calc(100vh - 14rem)",
                        overflowY: "auto",
                      }}
                      className="table-border"
                    >
                      <div>
                        <div className="table-responsive pagination_table">
                          {isRoleValidation() === "SUPER_ADMIN" ? (
                            <table
                              className="table table-hover"
                              id="dataTable"
                              style={{ textAlign: "center" }}
                            >
                              <thead className="table-dark">
                                <tr>
                                  <th
                                    className="col-lg-1"
                                    style={{
                                      textAlign: "center",
                                      fontSize: this.state.toggleClick
                                        ? null
                                        : "11px",
                                    }}
                                  >
                                    S.No
                                  </th>
                                  <th
                                    className="col-lg-2"
                                    style={{ textAlign: "left" }}
                                  >
                                    NAME
                                  </th>
                                  <th
                                    className="col-lg-2"
                                    style={{ textAlign: "left" }}
                                  >
                                    Email
                                  </th>
                                  {isRoleValidation() === "SUPER_ADMIN" ? (
                                    <th
                                      className="col-lg-3"
                                      style={{ textAlign: "left" }}
                                    >
                                      College
                                    </th>
                                  ) : null}
                                  <th
                                    className="col-lg-3"
                                    style={{ textAlign: "left" }}
                                  >
                                    Department
                                  </th>
                                  <th
                                    className="col-lg-1"
                                    style={{ textAlign: "left" }}
                                  >
                                    SkillsortScore
                                  </th>
                                </tr>
                              </thead>
                              <tbody>{this.renderTable()}</tbody>
                            </table>
                          ) : (
                            <CustomTable
                              headers={this.state.headers}
                              loader={this.state.loader}
                              pageSize={this.state.pageSize}
                              currentPage={this.state.currentPage}
                              data={this.state.student}
                            />
                          )}

                          {this.state.numberOfElements ? (
                            <Pagination
                              totalPages={this.state.totalPages}
                              currentPage={this.state.currentPage}
                              onPagination={this.onPagination}
                              increment={this.increment}
                              decrement={this.decrement}
                              startPage={this.state.startPage}
                              numberOfElements={this.state.numberOfElements}
                              endPage={this.state.endPage}
                              totalElements={this.state.totalElements}
                              pageSize={this.state.pageSize}
                            />
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
