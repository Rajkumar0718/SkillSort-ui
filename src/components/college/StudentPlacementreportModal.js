import React, { useEffect, useState } from "react";
import _ from "lodash";
import moment from "moment";
import axios from "axios";
import Button from "../../common/Button";
import { url } from "../../utils/UrlConstant";
import DateFnsUtils from "@date-io/date-fns";
import { authHeader, errorHandler } from "../../api/Api";
import MultiSelectDropDown from "../../utils/MultiSelectDropDown";
import { isRoleValidation } from "../../utils/Validation";
import { fallBackLoader } from "../../utils/CommonUtils";
import Pagination from "../../utils/Pagination";


const StudentReportModal = (props) => {
  const [student, setStudent] = useState([]);
  const [studentXlsx, setStudentXlsx] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [department, setDepartment] = useState([]);
  const [toggleClick, setToggleClick] = useState(false);
  const [loader, setLoader] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [numberOfElements, setNumberOfElements] = useState(0);
  const [countError, setCountError] = useState(false);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(5);
  const [totalStudents, setTotalStudents] = useState(0);
  const [selectedYop, setSelectedYop] = useState([]);
  const [yops, setYops] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [collegeName, setCollegeName] = useState();
  const [report, setReport] = useState({
    fromDate: "",
    toDate: "",
    email: "",
    collegeId: "",
    department: "",
    yop: [],
    skillsortScore: 0,
    role: "STUDENT",
  });

  // useEffect(() => {
  //     getCollege()
  //     if (isRoleValidation() === 'SUPER_ADMIN') this.getReport()
  //     getDepartment()
  //     setYearRange()
  // }, [])

  const setYearRange = () => {
    let startDay = moment().subtract(5, 'years');
    let endDate = moment().add(2, 'years');
    setYops(_.range(startDay.year(), endDate.year()))
  }

  const getReportXlsx = () => {
    setDisabled(true);
    const updatedReport = _.cloneDeep(report);
    if (
      moment(updatedReport.fromDate).isValid() &&
      moment(updatedReport.toDate).isValid()
    ) {
      updatedReport.fromDate = moment(updatedReport.fromDate).format(
        "DD/MM/YYYY"
      );
      updatedReport.toDate = moment(updatedReport.toDate).format("DD/MM/YYYY");
    }
    if (_.isEmpty(updatedReport.toDate) && updatedReport.fromDate) {
      const toDate = new Date();
      updatedReport.fromDate = moment(updatedReport.fromDate).format(
        "DD/MM/YYYY"
      );
      updatedReport.toDate = moment(toDate).format("DD/MM/YYYY");
    }

    axios
      .post(
        `${
          url.ADMIN_API
        }/adv-search/company-offers?page=${1}&size=${totalElements}`,
        updatedReport,
        { headers: authHeader() }
      )
      .then((res) => {
        setStudentXlsx(res.data.response.content);
        downloadCsv();
      })
      .catch((error) => {
        setLoader(false);
        errorHandler(error);
      });
  };

  const pageChange = () => {
    setCurrentPage(1);
    setPageSize(10);
    setTotalPages(0);
    setTotalElements(0);
    setNumberOfElements(0);
    setStartPage(1);
    setEndPage(5);
    getReport();
  };

  const fillterButton = [
    {
      className: "btn btn-sm btn-prev",
      style: { minWidth: "5rem" },
      onClick: { pageChange },
      title: "Filter",
    },
  ];

  const toggleHandle = () => setToggleClick(!toggleClick);

  const downloadButton = [
    {
      disabled: disabled,
      style: { marginRight: "1rem" },
      onClick: { getReportXlsx },
      className: "btn-sm btn btn-nxt",
      title: "Download",
    },
  ];

  const XButton = [
    {
      type: "button",
      type: "button",
      onClick: props.onCloseModal,
      className: "close",
      "aria-label": "Close",
      style: { background: "none", border: "none" },
    },
  ];

  const handleYopChange = (event, isClearAll) => {
    if (isClearAll) {
      setSelectedYop([]);
      setReport({ ...report, yop: [] });
      return;
    }
    const value = event.target.value;
    setSelectedYop(value);
    setReport({ ...report, yop: value });
  };
  const getReport = () => {
    const updatedReport = _.cloneDeep(report);
    if (
      moment(updatedReport.fromDate).isValid() &&
      moment(updatedReport.toDate).isValid()
    ) {
      updatedReport.fromDate = moment(updatedReport.fromDate).format(
        "DD/MM/YYYY"
      );
      updatedReport.toDate = moment(updatedReport.toDate).format("DD/MM/YYYY");
    }
    if (_.isEmpty(updatedReport.toDate) && updatedReport.fromDate) {
      const toDate = new Date();
      updatedReport.fromDate = moment(updatedReport.fromDate).format(
        "DD/MM/YYYY"
      );
      updatedReport.toDate = moment(toDate).format("DD/MM/YYYY");
    }
    axios
      .post(
        `${url.ADMIN_API}/adv-search/company-offers?page=${currentPage}&size=${pageSize}`,
        updatedReport,
        { headers: authHeader() }
      )
      .then((res) => {
        setStudent(res.data.response.content);
        setTotalPages(res.data.response.totalPages);
        setTotalElements(res.data.response.totalElements);
        setNumberOfElements(res.data.response.numberOfElements);
        setLoader(false);
      })
      .catch((error) => {
        setLoader(false);
        errorHandler(error);
      });
  };
  const getDepartment = () => {
    axios
      .get(`${url.ADMIN_API}/department?status=ACTIVE`, {
        headers: authHeader(),
      })
      .then((res) => {
        setDepartment(res.data.response);
      })
      .catch((error) => {
        errorHandler(error);
      });
  };
  const getCollege = () => {
    axios
      .get(`${url.COLLEGE_API}/college/list?status=${"ACTIVE"}`, {
        headers: authHeader(),
      })
      .then((res) => {
        setColleges(res.data.response);
        if (isRoleValidation() !== "SUPER_ADMIN") {
          const data = _.filter(
            res.data.response,
            (r) => r.id === props.collegeId
          );
          _.map(data, (c) => {
            setCollegeName(c.collegeName);
            setReport({ ...report, collegeId: c.id });
            getReport();
          });
        }
      })
      .catch((error) => {
        errorHandler(error);
      });
  };
  const handleReset = () => {
    setStudent([]);
    setColleges([]);
    setDepartment([]);
    setReport({
      ...report,
      fromDate: "",
      toDate: "",
      email: "",
      collegeId: "",
      department: "",
      skillsortScore: "",
      yop: [],
    });
    setCurrentPage(1);
    setPageSize(10);
    setTotalPages(0);
    setTotalElements(0);
    setNumberOfElements(0);
    setCountError(false);
    setStartPage(1);
    setEndPage(5);
    setSelectedYop([]);
    getReport();
    getCollege();
    getDepartment();
  };
  const resetButton = [
    {
      disabled:
        !report.fromDate &&
        !report.toDate &&
        !report.email &&
        !report.collegeId &&
        !report.department &&
        !report.skillsortScore &&
        _.size(report.yop) === 0,
      style: { minWidth: "5rem" },
      onClick: { handleReset },
      className: "btn btn-sm btn-nxt",
      title: "Reset",
    },
  ];
  const downloadCsv = async () => {};
  const renderTable = () => {
    let i = pageSize - 1;
    return student.length > 0 ? (
      _.map(student || [], (student, index) => {
        return (
          <>
            <tr key={index}>
              <td
                style={{
                  textAlign: "center",
                  fontSize: toggleClick ? null : "11px",
                }}
              >
                {pageSize * currentPage - i--}
              </td>
              <td
                style={{
                  textAlign: "left",
                  textTransform: "capitalize",
                  fontSize: toggleClick ? null : "11px",
                }}
              >{`${student.firstName} ${student.lastName}`}</td>
              <td
                style={{
                  textAlign: "left",
                  textTransform: "captilize",
                  fontSize: toggleClick ? null : "11px",
                }}
              >
                {student.email}
              </td>
              <td
                style={{
                  textAlign: "left",
                  fontSize: toggleClick ? null : "11px",
                }}
              >
                {student.department !== "" && student.department !== null
                  ? student.department
                  : "-"}
              </td>
              <td
                style={{
                  textAlign: "left",
                  fontSize: toggleClick ? null : "11px",
                }}
              >
                {_.map(student?.companyStatus, (st) => st.companyName).join(
                  ","
                )}
              </td>
              <td
                style={{
                  textAlign: "left",
                  fontSize: toggleClick ? null : "11px",
                }}
              >
                {_.map(student?.companyStatus, (st) =>
                  st.userResponseStatus ? st.userResponseStatus : "PENDING"
                ).join(",")}
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
            height: "95vh",
            verticalAlign: "center",
          }}
        >
          <div
            className="modal-header"
            style={{ border: "none", height: "3rem" }}
          >
            {toggleClick ? "" : <span>options </span>}
            <i
              onClick={toggleHandle}
              className="fa fa-filter"
              aria-hidden="true"
              style={{
                fontSize: "1.5rem",
                marginRight: toggleClick
                  ? ""
                  : _.size(student) > 0
                  ? "46rem"
                  : "56.5rem",
              }}
            />
            {_.size(student) > 0 ? (
              <Button buttonConfig={downloadButton[0]}></Button>
            ) : null}
            <Button buttonConfig={XButton[0]}>
              <span aria-hidden="true">&times;</span>
            </Button>
          </div>
          <div className="modal-body">
            <div className="row">
              {toggleClick ? (
                ""
              ) : (
                <div className="col-md-2">
                  <div
                    className="row"
                    style={{
                      flexDirection: "column",
                      display: "flex",
                      padding: "0.7rem",
                      justifyContent: "space-between",
                      height: "100%",
                    }}
                  >
                    {/* <div>
                      <label>From Date</label>
                      <div>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            placeholder="DD/MM/YYYY"
                            onChange={(date) => this.onChange(date, "fromDate")}
                            value={report.fromDate || null}
                            format="dd/MM/yyyy"
                          ></KeyboardDatePicker>
                        </MuiPickersUtilsProvider>
                      </div>
                    </div>
                    <div>
                      <label>To Date</label>
                      <div>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            placeholder="DD/MM/YYYY"
                            onChange={(date) => this.onChange(date, "toDate")}
                            value={report.toDate || null}
                            format="dd/MM/yyyy"
                          ></KeyboardDatePicker>
                        </MuiPickersUtilsProvider>
                      </div>
                    </div> */}
                    <div>
                      <label>Year of passing</label>
                      <div style={{ width: "12.5rem !important" }}>
                        <MultiSelectDropDown
                          value={selectedYop}
                          list={yops}
                          handleChange={(e, isClearAll) =>
                            handleYopChange(e, isClearAll)
                          }
                          placeholder={"Select YOP"}
                          width={100}
                        />
                      </div>
                    </div>

                    <div>
                      <label>Department</label>
                      <div>
                        <select
                          className="profile-page"
                          style={{ width: "10.5rem" }}
                          required="true"
                          onChange={(e) => this.onChange(e, "department")}
                        >
                          <option hidden selected value="">
                            Select Department
                          </option>
                          {_.map(department, (department, index) => {
                            return (
                              <option value={index}>
                                {department.departmentName}{" "}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Button buttonConfig={fillterButton[0]} />
                      <Button buttonConfig={resetButton[0]} />
                    </div>
                  </div>
                </div>
              )}
              <div
                className={toggleClick ? "col-sm-12" : "col-sm-10"}
                style={{
                  borderTop: "2px solid grey",
                  borderLeft: toggleClick ? null : "2px solid grey",
                  height: "82vh",
                }}
              >
                {fallBackLoader(loader)}
                <div style={{ marginTop: "1rem" }}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
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
                      Total Students : {totalElements}
                    </span>
                  </div>
                  <div style={{ marginTop: "1rem" }} className="table-border">
                    <div>
                      <div className="table-responsive pagination_table">
                        <table
                          className="table table-hover"
                          id="dataTable"
                          style={{ textAlign: "center" }}
                        >
                          <thead className="table-dark">
                            <tr>
                              <th
                                style={{
                                  textAlign: "center",
                                  fontSize: toggleClick ? null : "11px",
                                }}
                              >
                                S.No
                              </th>
                              <th style={{ textAlign: "left" }}>NAME</th>
                              <th style={{ textAlign: "left" }}>Email</th>
                              <th style={{ textAlign: "left" }}>Department</th>
                              <th style={{ textAlign: "left" }}>Company</th>
                              <th style={{ textAlign: "left" }}>
                                Offer Status
                              </th>
                            </tr>
                          </thead>
                          <tbody>{renderTable()}</tbody>
                        </table>
                        {numberOfElements ? (
                          <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            onPagination={this.onPagination}
                            increment={this.increment}
                            decrement={this.decrement}
                            startPage={startPage}
                            numberOfElements={numberOfElements}
                            endPage={endPage}
                            totalElements={totalElements}
                            pageSize={pageSize}
                          />
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentReportModal;
