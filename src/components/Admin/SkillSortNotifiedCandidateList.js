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
      examName: '',
      examId: '',
      openModel: false,
      result: {},
      loader: true,

    }
  }

  componentWillMount() {

    // if (this.props.location?.state) {
    //     sessionStorage.setItem('examId', this.props.location.state.examId)
    //     sessionStorage.setItem('examName', this.props.location.state.examName)
    // }
    // const examId = sessionStorage.getItem('examId');
    this.setState({
      examId: this.props.position.examId,
    })
  }

  componentDidMount() {
    this.setTableJson();
    this.getCandidates();

  }

  getCandidates = () => {
    axios.get(` ${url.ADMIN_API}/superadmin/selected?examId=${this.props.position.examId}&page=${this.state.currentPage}&size=${this.state.pageSize}&status=NOTIFIED_TO_SKILL_SORT`, { headers: authHeader() })
      .then(res => {
        this.setState({
          candidate: res.data.response.content,
          totalPages: res.data.response.totalPages,
          totalElements: res.data.response.totalElements,
          numberOfElements: res.data.response.numberOfElements,
          examName: this.props.position.name,
          examId: this.props.position.examId,
          loader: false
        });
      })
      .catch(error => {
        errorHandler(error);
        this.setState({ loader: false });
      })
  }

  onNextPage = () => {
    this.getCandidates();
  }

  onPagination = (pageSize, currentPage) => {
    this.setState({ pageSize: pageSize, currentPage: currentPage }, () => { this.onNextPage() });
  }

  increment = (_event) => {
    this.setState({
      startPage: (this.state.startPage) + 5,
      endPage: (this.state.endPage) + 5
    });
  }
  decrement = (_event) => {
    this.setState({
      startPage: (this.state.startPage) - 5,
      endPage: (this.state.endPage) - 5
    });
  }

  FBModel = (data) => {
    if (!this.state.openModel) {
      document.addEventListener("click", this.handleOutSideClick, true);
    } else {
      document.removeEventListener("click", this.handleOutSideClick, false);
    }
    this.setState({ openModel: !this.state.openModel, result: data });
  };

  handleOutSideClick = (e) => {
    if (e.target.className === "modal fade show") {
      this.setState({ openModel: !this.state.openModel })
      this.componentDidMount();
    }
  }

  onCloseModal = () => {
    this.setState({ openModel: false });
    this.componentDidMount();
  }

  setFontColor = (status) => {
    if (status === null || status !== 'FEEDBACK_FORWARDED') return '#6c757d'
    if (status === 'SELECTED') return '#28a745'
    return 'red'
  }

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
