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
import feedback from "../../assests/images/feedback.png";
import EmailSortlistedCandidate from "./EmailSortlistedCandidate";
import BasicMenu from "../../common/BasicMenu";
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

  downloadAll = (e, status) => {
    status = status === "NOTIFIED SKILL SORT" ? "NOTIFIED_TO_SKILL_SORT" : status === "NOTIFIED INTERNALLY" ? "SCHEDULED" : "ALL"
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
  handleStatusFilters(value) {

    this.setState({ statusType: value, currentPage: '1' }, () => this.componentDidMount())
  }
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
      component: !this.handleProps() ? "" : <span>FEEDBACK</span>,
      isComponent: true,
      align: "center",
      renderCell: (params) => {
        return (
          <>
            {!this.handleProps() ? (
              ""
            ) : (
              <button
                type="button"
                data-toggle="tooltip"
                data-placement="top"
                title="FEEDBACK"
                onClick={() => this.FBModel()}
                className="btn btn ml-1"
                style={{ border: "none", padding: "initial" }}
              >
                <img src={feedback} style={{ width: "26px" }} alt="SkillSort" />
              </button>
            )}
          </>
        );
      },
    };

    const getStatus = (params) => {
      return !this.handleProps() ?
        <>
          <span style={{color: this.setStatusColor(params.candidateStatus)}}>{params.candidateStatus === "SELECTED" ? "PENDING" : params.candidateStatus === "SCHEDULED" ? "NOTIFIED INTERNALLY" : "NOTIFIED TO SKILL SORT"}</span>
        </> :
        <>
          <span style={{color: this.setStatusColor(params.candidateStatus)}}>{params.candidateStatus === "SELECTED" ? "SELECTED" : params.candidateStatus === "SCHEDULED" ? "NOTIFIED INTERNALLY" : "PENDING"}</span>
        </>
    }

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
                onClick={() => this.handleStatusFilters(opt.value)}
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
            getStatus(params)
          );
        },
      },
      checkbox,
      button,
    ];
    this.setState({ headers: headers });
  };
  menuItem = ["ALL", "NOTIFIED SKILL SORT", "NOTIFIED INTERNALLY"];
  render() {
    return (
      <div>
        {fallBackLoader(this.state.loader)}
        <div className="card-header-new" style={{display:"flex",justifyContent:"flex-end",alignItems:'baseline'}}>
          <span className="black-label pull-right">
            <div>{this.state.planCount || 0}</div>Interviews Available
          </span>
          {!this.handleProps() && this.state.selected.length === 0 ? (
            <BasicMenu menuItem={this.menuItem} onClick={this.downloadAll} />
          ) :
          null}
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
            candidate={{
              sendData: this.state.sendData,
              candidateStatus: this.state.candidateStatus,
            }}
            onCloseModal={this.onCloseModal}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}
