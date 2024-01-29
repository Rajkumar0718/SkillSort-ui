import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import _ from "lodash";
import React from "react";
import { fallBackLoader } from "../../utils/CommonUtils";
import MultiSelectDropDown from "../../utils/MultiselectDropDown";
import Pagination from "../../utils/Pagination";
import { isRoleValidation } from "../../utils/Validation";

export const CollegeModelReport = (props) => {
  return (
    <div className="modal-body">
      <div className="row">
        {props.toggleClick ? (
          ""
        ) : (
          <div
            className="col-md-2 col-lg-2 col-xl-2"
            style={{ height: "calc(100vh - 7rem)", overflowY: "auto" }}
          >
            <div
              className="row"
              style={{
                flexDirection: "column",
                display: "flex",
                padding: "0.7rem",
                justifyContent: "space-between",
              }}
            >
              <div className="mb-05">
                <label>From Date</label>
                <div>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      placeholder="DD/MM/YYYY"
                      onChange={(date) => props.onChange(date, "fromDate")}
                      value={props.report.fromDate || null}
                      format="dd/MM/yyyy"
                    ></KeyboardDatePicker>
                  </MuiPickersUtilsProvider>
                </div>
              </div>
              <div className="mb-05">
                <label>To Date</label>
                <div>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      placeholder="DD/MM/YYYY"
                      onChange={(date) => props.onChange(date, "toDate")}
                      value={props.report.toDate || null}
                      format="dd/MM/yyyy"
                    ></KeyboardDatePicker>
                  </MuiPickersUtilsProvider>
                </div>
              </div>
              <div className="mb-05">
                <label>Email</label>
                <div>
                  <input
                    className="profile-page"
                    style={{ width: "12.5rem" }}
                    type="text"
                    placeholder="Enter email"
                    value={props.report.email}
                    onChange={(e) => props.onChange(e.target.value, "email")}
                  ></input>
                </div>
              </div>
              <div className="mb-05">
                <label>SkillSort Score</label>
                <div>
                  <input
                    className="profile-page"
                    style={{ width: "12.5rem" }}
                    type="text"
                    placeholder="Enter SkillSort Score"
                    value={props.report.skillsortScore}
                    onChange={(e) =>
                      props.onChange(e.target.value, "skillsortScore")
                    }
                  ></input>
                </div>
              </div>
              <div className="mb-05">
                <label>Year of passing</label>
                <div style={{ width: "12.5rem" }}>
                  <MultiSelectDropDown
                    value={props.selectedYop}
                    list={props.yops}
                    handleChange={(e, isClearAll) =>
                      props.handleYopChange(e, isClearAll)
                    }
                    placeholder={"Select YOP"}
                    width={200}
                  />
                </div>
              </div>
              {isRoleValidation() === "SUPER_ADMIN" &&
              props.report.role === "STUDENT" ? (
                <div className="mb-05">
                  <label>College</label>
                  <div>
                    <select
                      className="profile-page"
                      style={{ width: "12.5rem" }}
                      required="true"
                      onChange={(e) => props.onChange(e, "collegeId")}
                    >
                      <option hidden selected value="">
                        Select college
                      </option>
                      {_.map(props.colleges, (college, index) => {
                        return (
                          <option value={index}>{college.collegeName} </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              ) : null}
              {props.report.role === "STUDENT" ? (
                <div className="mb-05">
                  <label>Department</label>
                  <div>
                    <select
                      className="profile-page"
                      style={{ width: "12.5rem" }}
                      required="true"
                      onChange={(e) => props.onChange(e, "department")}
                    >
                      <option hidden selected value="">
                        Select Department
                      </option>
                      {_.map(props.department, (department, index) => {
                        return (
                          <option value={index}>
                            {department.departmentName}{" "}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              ) : null}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  className="btn btn-sm btn-prev"
                  style={{ minWidth: "5rem" }}
                  onClick={props.pageChange}
                >
                  Filter
                </button>
                <button
                  disabled={
                    !props.report.fromDate &&
                    !props.report.toDate &&
                    !props.report.email &&
                    !props.report.collegeId &&
                    !props.report.department &&
                    !props.report.skillsortScore &&
                    _.size(props.report.yop) === 0
                  }
                  className="btn btn-sm btn-nxt"
                  style={{ minWidth: "5rem" }}
                  onClick={props.handleReset}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        <div
          className={props.toggleClick ? "col-sm-12" : "col-sm-10"}
          style={{
            borderTop: "2px solid grey",
            borderLeft: props.toggleClick ? null : "2px solid grey",
            height: "calc(100vh - 7rem)",
          }}
        >
          {fallBackLoader(props.loader)}
          <div style={{ marginTop: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span
                className="dash-text"
                style={{ fontWeight: "400", marginLeft: "1.4rem" }}
              >
                Student Report
              </span>
              <span className="dash-text" style={{ marginRight: "1.4rem" }}>
                Total Students : {props.totalElements}
              </span>
            </div>
            <div
              style={{
                marginTop: "1rem",
                height: "calc(100vh - 12rem)",
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
                              fontSize: props.toggleClick ? null : "11px",
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
                          {isRoleValidation() === "SUPER_ADMIN" &&
                          props.report.role === "STUDENT" ? (
                            <th
                              className="col-lg-3"
                              style={{ textAlign: "left" }}
                            >
                              College
                            </th>
                          ) : null}
                          {props.report.role === "STUDENT" ? (
                            <>
                              <th
                                className="col-lg-3"
                                style={{ textAlign: "left" }}
                              >
                                Department
                              </th>
                            </>
                          ) : (
                            <>
                              <th
                                className="col-lg-2 col-xl-2"
                                style={{ textAlign: "left" }}
                              >
                                Reg Date
                              </th>
                              <th
                                className="col-lg-4 col-xl-1"
                                style={{ textAlign: "left" }}
                              >
                                Yop
                              </th>
                            </>
                          )}
                          <th
                            className="col-lg-1"
                            style={{ textAlign: "left" }}
                          >
                            SkillsortScore
                          </th>
                        </tr>
                      </thead>
                      <tbody>{props.renderTable()}</tbody>
                    </table>
                  ) : (
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
                              fontSize: props.toggleClick ? null : "11px",
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
                            className="col-lg-3"
                            style={{ textAlign: "left" }}
                          >
                            Department
                          </th>
                          <th
                            className="col-lg-1"
                            style={{ textAlign: "left" }}
                          >
                            LOGICAL
                          </th>
                          <th
                            className="col-lg-1"
                            style={{ textAlign: "left" }}
                          >
                            VERBAL
                          </th>
                          <th
                            className="col-lg-1"
                            style={{ textAlign: "left" }}
                          >
                            NUMERICAL
                          </th>
                          <th
                            className="col-lg-1"
                            style={{ textAlign: "left" }}
                          >
                            TECHNICAL
                          </th>
                          <th
                            className="col-lg-1"
                            style={{ textAlign: "left" }}
                          >
                            SkillsortScore
                          </th>
                        </tr>
                      </thead>
                      <tbody>{props.renderTableForCollege()}</tbody>
                    </table>
                  )}
                  {props.numberOfElements ? (
                    <Pagination
                      totalPages={props.totalPages}
                      currentPage={props.currentPage}
                      onPagination={props.onPagination}
                      increment={props.increment}
                      decrement={props.decrement}
                      startPage={props.startPage}
                      numberOfElements={props.numberOfElements}
                      endPage={props.endPage}
                      totalElements={props.totalElements}
                      pageSize={props.pageSize}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CollegeModelReport;
