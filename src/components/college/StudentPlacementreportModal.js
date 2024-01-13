import React, { Component } from "react";
import _ from "lodash";
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
  toggleHandle = () => this.setState({ toggleClick: !this.state.toggleClick });
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
              height: "95vh",
              verticalAlign: "center",
            }}
          >
            <div className="modal-header" style={{ border: "none" }}>
              {this.state.toggleClick ? "" : <span>options </span>}
              <i
                onClick={this.toggleHandle}
                className="fa fa-filter"
                aria-hidden="true"
                style={{
                  fontSize: "1.5rem",
                  marginRight: this.state.toggleClick
                    ? ""
                    : _.size(this.state.student) > 0
                    ? "46rem"
                    : "56.5rem",
                }}
              />
              <div>

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
          </div>
        </div>
      </div>
    );
  }
}
