import React, { Component } from "react";

import axios from "axios";
import _ from "lodash";
import moment from "moment/moment";
import { authHeader, errorHandler } from "../../api/Api";
import RenderModalBody from "../../common/RenderModalBody";
import ExportXlsx from "../../utils/ExportXlsx";
import url from "../../utils/UrlConstant";
import { isRoleValidation } from "../../utils/Validation";
const columns = [
  { header: "Name", key: "firstName" },
  { header: "Email", key: "email" },
  { header: "Department", key: "department" },
  { header: "Offered Companies", key: "offerCompany" },
  { header: "Offer Status", key: "userStatus" },
];
export default class StudentreportModal extends Component {
  constructor() {
    super();
    this.state = {
      student: [],
      studentXlsx: [],
      colleges: [],
      department: [],
      toggleClick: false,
      loader: true,
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
        skillsortScore: 0,
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
    console.log("here");
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
        ` ${url.ADMIN_API}/adv-search/company-offers?page=${this.state.currentPage}&size=${this.state.pageSize}`,
        report,
        { headers: authHeader() }
      )
      .then((res) => {
        // let filteredStudent = _.filter(res.data.response.student.content,st=>res.data.response.score[st.email])
        this.setState({
          student: res.data.response.content,
          totalPages: res.data.response.totalPages,
          totalElements: res.data.response.totalElements,
          numberOfElements: res.data.response.numberOfElements,
          loader: false,
        });
      })
      .catch((error) => {
        this.setState({ loader: false });
        errorHandler(error);
      });
  };
  onNextPage = () => {
    this.getReport();
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
      },
      () => this.getReport(),
      this.getCollege(),
      this.getDepartment()
    );
  };

  componentDidMount() {
    this.getCollege();
    this.setHeader();
    if (isRoleValidation() === "SUPER_ADMIN") this.getReport();
    this.getDepartment();
    this.setYearRange();
  }
  setYearRange = () => {
    let startDay = moment().subtract(5, "years");
    let endDate = moment().add(3, "years");
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
      () => this.getReport()
    );
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
      .get(`${url.COLLEGE_API}/college/list?status=${"ACTIVE"}`, {
        headers: authHeader(),
      })
      .then((res) => {
        console.log("College data:", res.data.response);
        this.setState({ colleges: res.data.response }, () => {
          if (isRoleValidation() !== "SUPER_ADMIN") {
            let data = _.filter(
              res.data.response,
              (r) => r.id === this.props.collegeId
            );
            console.log("Filtered data:", data);
            _.map(data, (c) => {
              this.setState(
                {
                  collegeName: c.collegeName,
                  report: { ...this.state.report, collegeId: c.id },
                },
                () => {
                  console.log("State updated:", this.state);
                  this.getReport();
                }
              );
            });
          }
        });
      })
      .catch((error) => {
        errorHandler(error);
      });
  };

  toggleHandle = () => this.setState({ toggleClick: !this.state.toggleClick });

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
        ` ${url.ADMIN_API}/adv-search/company-offers?page=${1}&size=${
          this.state.totalElements
        }`,
        report,
        { headers: authHeader() }
      )
      .then((res) => {
        // let filteredStudent = _.filter(res.data.response.student.content,st=>res.data.response.score[st.email])
        this.setState(
          {
            studentXlsx: res.data.response.content,
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
    const keys = [
      "firstName",
      "email",
      "department",
      "offerCompany",
      "userStatus",
    ];
    const data = _.map(this.state.studentXlsx, (stu) =>
      _.pick(
        {
          ...stu,
          offerCompany: _.map(stu?.companyStatus, (st) => st.companyName).join(
            ","
          ),
          offerstatus: _.map(stu.companyStatus, (st) => st.hiringStatus),
          userStatus: stu?.companyStatus[0]?.userResponseStatus
            ? stu.companyStatus[0].userResponseStatus
            : "PENDING",
        },
        keys
      )
    );
    ExportXlsx(data, "StudentReport", columns);
    this.setState({ disabled: false });
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
        name: "EMAIL",
        align: "left",
        key: "email",
      },
      {
        name: "DEPARTMENT",
        align: "left",
        key: "department",
      },
      {
        name: "COMPANY",
        align: "left",
        renderCell: (params) => {
          return params.companyStatus[0].companyName;
        },
      },
      {
        name: "OFFER STATUS",
        align: "left",
        renderCell: (params) => {
          return params.companyStatus[0].userResponseStatus
            ? params.companyStatus[0].userResponseStatus
            : "PENDING";
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
              height: "94vh",
              verticalAlign: "center",
            }}
          >
            <div
              className="modal-header"
              style={{ border: "none", height: "4rem" }}
            >
              {this.state.toggleClick ? "" : <span>Options</span>}
              <i
                onClick={this.toggleHandle}
                className="fa fa-filter"
                aria-hidden="true"
                title={!this.state.toggleClick ? "Hide Menu" : "Show Menu"}
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
                    onClick={this.getReportXlsx}
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
              type ='PLACEMENT'
              toggleClick={this.state.toggleClick}
            />

          </div>
        </div>
      </div>
    );
  }
}
