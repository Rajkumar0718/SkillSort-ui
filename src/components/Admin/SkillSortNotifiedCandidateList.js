import React, { Component } from "react";
import { fallBackLoader } from "../../utils/CommonUtils";
import { CustomTable } from "../../utils/CustomTable";
import _ from "lodash";
import axios from "axios";
import url from "../../utils/UrlConstant";
import { authHeader, errorHandler } from "../../api/Api";
import feedback from '../../assests/images/feedback.png';
import NotifiedCandidateFeedbackModel from "./NotifiedCandidateFeedbackModel";
export default class SkillSortNotifiedCandidateList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      pageSize: 5,
      totalPages: 0,
      totalElements: 0,
      first: [],
      numberOfElements: 0,
      startPage: 1,
      endPage: 5,
      candidate: {},
      examName: "",
      examId: "",
      openModel: false,
      result: {},
      loader: true,
    };
  }
  componentDidMount() {
    this.getCandidates();
  }

  getCandidates = () => {
    axios
      .get(
        ` ${url.ADMIN_API}/superadmin/selected?examId=${this.props.position.examId}&page=${this.state.currentPage}&size=${this.state.pageSize}&status=NOTIFIED_TO_SKILL_SORT`,
        { headers: authHeader() }
      )
      .then((res) => {
        this.setState(
          {
            candidate: res.data.response.content,
            totalPages: res.data.response.totalPages,
            totalElements: res.data.response.totalElements,
            numberOfElements: res.data.response.numberOfElements,
            examName: this.props.position.name,
            examId: this.props.position.examId,
            loader: false,
          },
          this.setTableJson
        );
      })
      .catch((error) => {
        errorHandler(error);
        this.setState({ loader: false });
      });
  };

  setTableJson = () => {
    const headers = [
      {
        name: "S.NO",
        align: "center",
        key: "S.NO",
      },
      {
        name: "NAME	",
        align: "left",
        renderCell: (params) => {
          return `${params.candidate.firstName} ${params.candidate.lastName}`;
        },
      },

      {
        name: "GENDER",
        align: "left",
        renderCell: (params) => {
          return `${params.candidate.gender}`;
        },
      },
      {
        name: "EMAIL",
        align: "center",
        renderCell: (params) => {
          return `${params.candidate.email}`;
        },
      },
      {
        name: "PHONE",
        align: "center",
        renderCell: (params) => {
          return `${params.candidate.phone}`;
        },
      },
      {
        name: "STATUS",
        align: "left",
        renderCell: (params) => {
          return (
            <span style={{ color: this.setFontColor(params.skillsSortStatus) }}>
              {params.panelistCandidateStatus === null ||
              params.skillsSortStatus !== "FEEDBACK_FORWARDED"
                ? "PROCESSING"
                : params.panelistCandidateStatus.toUpperCase() === "SELECTED"
                ? "SELECTED"
                : params.panelistCandidateStatus.toUpperCase()}
            </span>
          );
        },
      },
      {
        name: "FEEDBACK",
        align: "center",

        renderCell: (params) => {
          return (
            <img src={feedback} alt="" style={{ height: "18px", width: "18px", cursor: 'pointer' }} onClick={() => this.FBModel(params)}></img>
          );
        },
      },
    ];
    this.setState({ headers: headers });
  };
  render() {
    return (
      <main className="main-content bcg-clr">
        <div className="row" style={{ marginTop: "1rem" }}>
          <div className="col-md-12">
            {fallBackLoader(this.state.loader)}
            <CustomTable
              data={this.state.candidate}
              headers={this.state.headers}
              loader={this.state.loader}
              pageSize={this.state.pageSize}
              currentPage={this.state.currentPage}
            />
             {this.state.openModel ?
                        <NotifiedCandidateFeedbackModel
                            modelSection={{
                                skillSortCandidate: this.state.result
                            }}
                            onCloseModal={this.onCloseModal}
                        /> : ""
                    }
          </div>
        </div>
      </main>
    );
  }
}
