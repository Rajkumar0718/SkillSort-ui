import React, { Component } from "react";
import axios from "axios";
import url from "../../utils/UrlConstant";
import { authHeader, errorHandler } from "../../api/Api";
import _ from "lodash";
import { MenuItem } from "@mui/material";
import moment from "moment";
import { fallBackLoader } from "../../utils/CommonUtils";
import notify from "../../assests/images/Notified Skillsort.png";
import notify2 from "../../assests/images/Notify2.png";
import { toast } from "react-toastify";
import { CustomTable } from "../../utils/CustomTable";
import isRoleValidation from "../../utils/UrlConstant";
import FeedBackModel from "./FeedBackModel";
import feedback from '../../assests/images/feedback.png';
import EmailSortlistedCandidate from "./EmailSortlistedCandidate";
export default class SelectedStudentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      examName: "",
      statusType: null,
      sendData: "",
      showData: false,
      examId: "",
      loader: false,
      currentPage: 1,
      pageSize: 10,
      totalPages: 0,
      totalElements: 0,
      openModal: false,
      first: [],
      numberOfElements: 0,
      startPage: 1,
      endPage: 5,
      candidate: {},
      candidateStatus: "",
      selected: [],
      selectAll: 0,
      exportResult: [],
      openFBModal: false,
      FBModelData: [],
      status: [],
      plans: [],
      planCount: 0,
    };
  }
  componentDidMount() {
    this.getSelectedCandidates();
    this.getCompanyPlans();
  }
  getSelectedCandidates = () => {
    this.setState({ showData: true, selected: [] });
    axios
      .get(
        ` ${url.ADMIN_API}/candidate/selected?examId=${this.state.examId}&page=${this.state.currentPage}&size=${this.state.pageSize}&status=${this.state.statusType}`,
        { headers: authHeader() }
      )
      .then((res) => {
        console.log(res.data.response.content);
        this.setState(
          {
            candidate: res.data.response.content,
            totalPages: res.data.response.totalPages,
            totalElements: res.data.response.totalElements,
            numberOfElements: res.data.response.numberOfElements,
            examName: this.props.position.name,
          },
          this.setTableJson
        );
        let st = _.filter(
          res.data.response.content,
          (can) => can.candidateStatus !== "NOTIFIED_TO_SKILL_SORT"
        )?.map((cad) => cad.id);
        this.setState({ status: st });
      })
      .catch((error) => {
        this.setState({ loader: false });
      });
  };

  getCompanyPlans = () => {
    axios
      .get(`${url.ADMIN_API}/plan?service=INTERVIEW`, { headers: authHeader() })
      .then((res) => {
        if (_.isEmpty(res.data.response)) return;
        const plans = res.data.response || [];
        this.setState({
          plans: plans,
          planCount: _.sumBy(plans, (p) => p.residue || 0),
        });
      })
      .catch((error) => errorHandler(error));
  };
  notifyToSkillSort = () => {
    axios
      .post(`${url.ADMIN_API}/candidate/notify`, this.state.selected, {
        headers: authHeader(),
      })
      .then((res) => {
        this.componentDidMount();
      })
      .catch((err) => errorHandler(err));
  };
  internallySchedule = () => {
    axios
      .post(`${url.ADMIN_API}/candidate/schedule`, this.state.selected, {
        headers: authHeader(),
      })
      .then((res) => {
        this.componentDidMount();
      });
  };
  handleProps = () => this.props.location?.pathname?.indexOf("skillsort") > -1;
  downloadAll = (status) => {
    axios
      .get(
        ` ${url.ADMIN_API}/candidate/download?examId=${this.state.examId}&status=${status}`,
        { headers: authHeader() }
      )
      .then((res) => {
        if (res.data.response.length > 0)
          this.setState({ exportResult: res.data.response }, () =>
            this.downloadCsv(status)
          );
        else toast.info("No data to download");
      });
  };
  setTableJson = () => {
    const gender = !this.handleProps()
      ? ""
      : {
          name: "NAME",
          align: "left",
          key: "gender",
        };
    const phone = !this.handleProps()
      ? ""
      : {
          name: "Phone",
          align: "left",
          key: "phone",
        };

    const checkbox = {
      component:
        this.handleProps() &&
        this.state.totalElements > 0 &&
        isRoleValidation() !== "HR" &&
        this.state.status.length ? (
          <input
            type="checkbox"
            checked={this.state.selected.length === this.state.status.length}
            onChange={() => this.handleSelectAll()}
          />
        ) : null,
      isComponent: true,
      align: "center",
      renderCell: (params) => {
        return (
          <>
            {!this.handleProps() &&
            isRoleValidation() !== "HR" &&
            params.candidateStatus !== "NOTIFIED_TO_SKILL_SORT" ? (
              <input
                type="checkbox"
                checked={this.state.selected.indexOf(params.id) > -1}
                onChange={() => this.handleSelected(params.id)}
              />
            ) : (
              <span>
                <i
                  data-toggle="tooltip"
                  title="Already Notified to Skill sort&#13;"
                  className="fa fa-info-circle"
                ></i>
              </span>
            )}
          </>
        );
      },
    };

    const button = {
      component:!this.handleProps() ? ("") : <span>FEEDBACK</span>,
      isComponent: true,
      align: "center",
      renderCell: (params) => {
        return (
          <>
            {!this.handleProps() ?"": (
               <button type="button" data-toggle="tooltip" data-placement="top" title="FEEDBACK"
               onClick={() => this.FBModel()} className="btn btn ml-1" style={{ border: 'none', padding: 'initial' }}>
               <img src={feedback} style={{ width: '26px' }} alt="SkillSort" />
             </button>
            )}
          </>
        );
      },
    };

    const headers = [
      {
        name: "S.NO",
        align: "center",
        key: "S.NO",
      },
      {
        name: "NAME",
        align: "left",
        renderCell: (params) => {
          return `${params.firstName} ${params.lastName}`;
        },
      },

      {
        name: "EMAIL",
        align: "left",
        key: "email",
      },
      gender,
      phone,
      {
        name: "STATUS",
        align: "left",
        isFilter: true,
        key: "status",
        renderOptions: () => {
          return _.map(
            [
              { name: "All", value: "ALL" },
              { name: "Selected", value: "SELECTED" },
              { name: "Notified To Skillsort", value: "NOTIFIED TO SKILLSORT" },
              { name: "Internally Scheduled", value: " INTERNALLY SCHEDULED " },
            ],
            (opt) => (
              <MenuItem
                onClick={() => this.handleActionFilter(opt.value)}
                key={opt.value}
                value={opt.value}
              >
                {opt.name}
              </MenuItem>
            )
          );
        },
        renderCell: (params) => {
          return (
            <div className="row">
              <div className="col" style={{ minWidth: "5rem" }}>
                <span
                  style={{
                    marginTop: "0px",
                    color: this.setFontColor(params.candidate?.candidateStatus),
                  }}
                >
                  {params.candidate?.candidateStatus === "HOLD"
                    ? "HOLD"
                    : params.candidate?.candidateStatus === "PENDING"
                    ? "PENDING"
                    : params.candidate?.candidateStatus === "REJECTED"
                    ? "REJECTED"
                    : "SELECTED"}
                </span>
              </div>
              <div className="col">
                <i
                  className="fa fa-share-square-o"
                  aria-hidden="true"
                  style={{ color: "#3b489e", cursor: "pointer" }}
                  onClick={() => this.onClickOpenModel(params.id)}
                  data-toggle="tooltip"
                  data-placement="top"
                  title="SHARE CANDIDATE RESULTS"
                />
              </div>
            </div>
          );
        },
      },
      checkbox,
      button
    ];
    this.setState({ headers: headers });
  };
  render() {
    return (
      <div>
        {fallBackLoader(this.state.loader)}
        <div className="card-header-new">
          {this.state.selected.length > 0 ? (
            <div className="pull-right pull-down" style={{ paddingTop: "8px" }}>
              <button
                type="button"
                data-toggle="tooltip"
                data-placement="bottom"
                title="NOTIFY TO SKILL SORT"
                onClick={() => this.notifyToSkillSort()}
                className="btn btn-sm btn-nxt"
                style={{ border: "none" }}
              >
                <img
                  src={notify2}
                  style={{ width: "15px", marginRight: "5px" }}
                  alt="notify"
                ></img>
                Notify to SkillSort
              </button>
              <button
                type="button"
                data-toggle="tooltip"
                data-placement="top"
                title="SCHEDULE INTERNALLY"
                onClick={() => this.internallySchedule()}
                className="btn btn-sm btn-prev"
                style={{ border: "none", marginLeft: "0.5rem" }}
              >
                <img
                  src={notify}
                  style={{ width: "15px", marginRight: "5px" }}
                  alt="schedule"
                ></img>
                Schedule Internally
              </button>
            </div>
          ) : null}

          {!this.handleProps() && this.state.selected.length === 0 ? (
            <div
              className="dropdown show pull-right"
              style={{ marginTop: "10px" }}
            >
              <div
                className="btn btn-sm btn-nxt dropdown-toggle"
                href="#"
                role="button"
                id="dropdownMenuLink"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Download
              </div>
              <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <div
                  className="dropdown-item"
                  onClick={() => this.downloadAll("ALL")}
                >
                  ALL
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => this.downloadAll("NOTIFIED_TO_SKILL_SORT")}
                >
                  NOTIFIED SKILL SORT
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => this.downloadAll("SCHEDULED")}
                >
                  NOTIFIED INTERNALLY
                </div>
              </div>
            </div>
          ) : null}
          <span className="black-label pull-right">
            <div>{this.state.planCount || 0}</div>Interviews Available
          </span>
        </div>
        <CustomTable
          data={this.state.candidate}
          headers={this.state.headers}
          loader={this.state.loader}
          pageSize={this.state.pageSize}
          currentPage={this.state.currentPage}
        />
        {this.handleProps() && (
          <div>
            {this.state.openFBModal ? (
              <FeedBackModel
                onCloseModal={this.onCloseModal}
                modelData={this.state.FBModelData}
              />
            ) : (
              ""
            )}
          </div>
        )}
         {this.state.openModal ? (
          <EmailSortlistedCandidate
            candidate={{ sendData: this.state.sendData, candidateStatus: this.state.candidateStatus }} onCloseModal={this.onCloseModal} />
        ) : ("")}
      </div>
    );
  }
}
