import React, { Component } from "react";
import _ from "lodash";
import DatePick from "../../common/DatePick";
import MultiSelectDropDown from "../../utils/MultiselectDropDown";
import { isRoleValidation } from "../../utils/Validation";
import { fallBackLoader } from "../../utils/CommonUtils";
import Pagination from "../../utils/Pagination";
import moment from "moment/moment";
import axios from "axios";
import { authHeader, errorHandler } from "../../api/Api";
import ExportXlsx from "../../utils/ExportXlsx";
import { CustomTable } from "../../utils/CustomTable";
import { url } from "../../utils/UrlConstant";
import RenderModalBody from "../../common/RenderModalBody";
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

  // renderTable = () => {
  //   let i = this.state.pageSize - 1;
  //   return this.state.student.length > 0 ? (
  //     _.map(this.state.student || [], (student, index) => {
  //       return (
  //         <>
  //           <tr key={index}>
  //             <td
  //               style={{
  //                 textAlign: "center",
  //                 fontSize: this.state.toggleClick ? null : "11px",
  //               }}
  //             >
  //               {this.state.pageSize * this.state.currentPage - i--}
  //             </td>
  //             <td
  //               style={{
  //                 textAlign: "left",
  //                 textTransform: "capitalize",
  //                 fontSize: this.state.toggleClick ? null : "11px",
  //               }}
  //             >{`${student.firstName} ${student.lastName}`}</td>
  //             <td
  //               style={{
  //                 textAlign: "left",
  //                 textTransform: "captilize",
  //                 fontSize: this.state.toggleClick ? null : "11px",
  //               }}
  //             >
  //               {student.email}
  //             </td>
  //             <td
  //               style={{
  //                 textAlign: "left",
  //                 fontSize: this.state.toggleClick ? null : "11px",
  //               }}
  //             >
  //               {student.department !== "" && student.department !== null
  //                 ? student.department
  //                 : "-"}
  //             </td>
  //             <td
  //               style={{
  //                 textAlign: "left",
  //                 fontSize: this.state.toggleClick ? null : "11px",
  //               }}
  //             >
  //               {_.map(student?.companyStatus, (st) => st.companyName).join(
  //                 ","
  //               )}
  //             </td>
  //             <td
  //               style={{
  //                 textAlign: "left",
  //                 fontSize: this.state.toggleClick ? null : "11px",
  //               }}
  //             >
  //               {_.map(student?.companyStatus, (st) =>
  //                 st.userResponseStatus ? st.userResponseStatus : "PENDING"
  //               ).join(",")}
  //             </td>
  //           </tr>
  //         </>
  //       );
  //     })
  //   ) : (
  //     <tr className="text-center">
  //     key: "userResponseStatus",  <td colspan="8">No data available in table</td>
  //     </tr>
  //   );
  // };
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
            {/* <div className="modal-body">
              <div className="row">
                {this.state.toggleClick ? (
                  ""
                ) : (
                  <div className="col-md-2">
                    <div
                      className="row"
                      style={{
                        flexDirection: "column",
                        display: "flex",
                        justifyContent: "space-between",
                        height: "100%",
                      }}
                    >
                      <div>
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
                      <div>
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

                      <div>
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
                        <div>
                          <label>College</label>
                          <div>
                            <select
                              className="profile-page"
                              style={{ width: "12rem" }}
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

                      <div>
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
                    height: "calc(100vh - 9rem)",
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
                    <div style={{ marginTop: "1rem" }} className="table-border">
                      <div>
                        <div className="table-responsive pagination_table">
                          <CustomTable
                            headers={this.state.headers}
                            loader={this.state.loader}
                            pageSize={this.state.pageSize}
                            currentPage={this.state.currentPage}
                            data={this.state.student}
                          />

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
          </div>
        </div>
      </div>
    );
  }
}
