import _ from "lodash";
import React from "react";
import { isRoleValidation } from "../utils/Validation";
import { fallBackLoader } from "../utils/CommonUtils";
import Pagination from "../utils/Pagination";
import {
  DatePicker as MuiDatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CustomTable } from "../utils/CustomTable";
import MultiSelectDropDown from "../utils/MultiSelectDropDown";

export const RenderModalBody = (props) => {

  return (
    <div className="modal-body">
      <div className="row">
        {props.toggleClick ? (
          ""
        ) : (
          <div
            className="col-md-2 col-lg-2 col-xl-2"
            style={{
              height: "calc(100vh - 8rem)",
              overflowY: "auto",
              display: "flex",
              overflowX: "hidden",
              paddingBottom: "1rem",
              paddingRight: "0rem",
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
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <MuiDatePicker
                      value={props.report.fromDate || null}
                      onChange={(date) => props.onChange(date, "fromDate")}
                      format="dd/MM/yyyy"
                      slotProps={{
                        textField: {
                          variant: "filled",
                          size: "small",
                          sx: {
                            "& .MuiInputBase-input": {
                              backgroundColor: "white",
                              paddingTop: "0px !important",
                            },
                            "& .MuiSvgIcon-root": {
                              color: "#3b489e", // Change the ornament color to white
                            },
                            "& .MuiInputBase-root": {
                              width: "12rem",
                              background: "none",
                            },
                          },
                          className: "profile-page",
                          placeholder: "dd/mm/yyyy",
                        },
                      }}
                    />
                  </LocalizationProvider>
                </div>
              </div>
              <div className="mb-05">
                <label>To Date</label>
                <div>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <MuiDatePicker
                      onChange={(date) => props.onChange(date, "toDate")}
                      value={props.report.toDate || null}
                      format="dd/MM/yyyy"
                      minDate={props.report.fromDate || null}
                      slotProps={{
                        textField: {
                          variant: "filled",
                          size: "small",

                          sx: {
                            "& .MuiInputBase-input": {
                              backgroundColor: "white",
                              paddingTop: "0px !important",
                            },
                            "& .MuiSvgIcon-root": {
                              color: "#3b489e", // Change the ornament color to white
                            },
                            "& .MuiInputBase-root": {
                              width: "12rem",
                              background: "none",
                            },
                          },
                          className: "profile-page",
                          placeholder: "dd/mm/yyyy",
                        },
                      }}
                    />
                  </LocalizationProvider>
                </div>
              </div>
              {props.type !== "PLACEMENT" ? (
                <>
                  <div className="mb-05">
                    <label>Email</label>
                    <div>
                      <input
                        className="profile-page"
                        style={{ width: "12rem" }}
                        type="text"
                        placeholder="Enter email"
                        value={props.report.email}
                        onChange={(e) =>
                          props.onChange(e.target.value, "email")
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
                        value={props.report.skillsortScore}
                        onChange={(e) =>
                          props.onChange(e.target.value, "skillsortScore")
                        }
                      ></input>
                    </div>
                  </div>
                </>
              ) : null}
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
                  <label style={{ paddingBottom: "1rem" }}>Department</label>
                  <div>
                    <select
                      className="profile-page"
                      style={{ width: "12rem" }}
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
              <div style={{ display: "flex", flexDirection: "row" }}>
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
                  style={{ minWidth: "5rem", marginLeft: "2rem" }}
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
            height: "calc(100vh - 8.25rem)",
          }}
        >
          {fallBackLoader(props.loader)}
          <div style={{ marginTop: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span
                className="dash-text"
                style={{ fontWeight: "400", marginLeft: "1.4rem" }}
              >
                {props.type === "INDIVIDUAL_USER" ? "Individual User Report" : 'Student Report'}
              </span>
              <span className="dash-text" style={{ marginRight: "1.4rem" }}>
              {props.type === "INDIVIDUAL_USER" ? "Total Registered Users": 'Total Students'} : {props.totalElements}
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
                    <CustomTable
                      headers={props.superAdminHeader}
                      loader={props.loader}
                      pageSize={props.pageSize}
                      currentPage={props.currentPage}
                      data={props.data}
                    />
                  ) : (
                    <CustomTable
                      headers={props.headers}
                      loader={props.loader}
                      pageSize={props.pageSize}
                      currentPage={props.currentPage}
                      data={props.data}
                    />
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
export default RenderModalBody;
