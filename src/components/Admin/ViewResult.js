import React, { Component } from "react";
import { fallBackLoader } from "../../utils/CommonUtils";
import AdvSearch from "../../common/Search";
import { CustomTable } from "../../utils/CustomTable";
import Pagination from "../../utils/Pagination";
import _ from "lodash";
import { MenuItem } from "@mui/material";
import moment from "moment";
import axios from "axios";
import url from "../../utils/UrlConstant";
import { authHeader, errorHandler } from "../../api/Api";
import CopyClipBoardPopUp from "./CopyClipBoardPopUp"
import { Link } from "react-router-dom";
import LOGO from '../../assests/images/logo.png';
import { isRoleValidation } from '../../utils/Validation';

let hidden = null;
let visibilityChange = null;
if (typeof document.hidden !== "undefined") {
  // Opera 12.10 and Firefox 18 and later support
  hidden = "hidden";
  visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  hidden = "msHidden";
  visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  hidden = "webkitHidden";
  visibilityChange = "webkitvisibilitychange";
}
export default class ViewResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      exportResult: [],
      anchorEl: false,
      showData: false,
      sections: [],
      exams: [],
      selectCard: "",
      mark: "",
      examId: "",
      examName: "",
      toDate: "",
      fromDate: "",
      user: "",
      ischeck: false,
      loader: true,
      currentPage: 1,
      pageSize: 10,
      totalPages: 0,
      totalElements: 0,
      openModal: false,
      searchKey: "ACTIVE",
      first: [],
      modalSection: "",
      resultSection: "",
      numberOfElements: 0,
      showMailButton: false,
      startPage: 1,
      copiedClipBoard: false,
      endPage: 5,
      action: "ALL",
      sharableLink: "",
      examMonitor: [],
    };
  }
  componentDidMount() {
    document.addEventListener(
      visibilityChange,
      this.handleVisibilityChange,
      false
    );
    this.setState(
      {
        examId: this.props.position.examId,
      },
      () => this.handleFilterByDate()
    );
  }

  handleVisibilityChange = () => {
    if (!document[hidden]) {
      this.handleFilterByDate();
    }

  }

  componentWillUnmount() {
    document.removeEventListener(visibilityChange, this.handleVisibilityChange);
  }

  onClickOpenModel = (id) => {
    if (!this.state.openModal) {
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }
    this.setState({ openModal: !this.state.openModal, sharableLink: `${url.UI_URL}/candidate-details/${id}` });

  };

  handleOutsideClick = (e) => {
    if (e.target.className === "modal fade show") {
      this.setState({ openModal: !this.state.openModal });
      this.handleFilterByDate();
    }
  };

  onCloseModal = () => {
    this.setState({ openModal: !this.state.openModal });
    this.handleFilterByDate();
  };

  setCandidate = (data) => {
    let candidate = JSON.stringify(data);
    localStorage.removeItem(data.candidate.id)
    localStorage.setItem(data.candidate.id, candidate)
  }

  setFontColor = (status) => {
    if (status === 'PENDING') return '#17a2b8'
    if (status === 'REJECTED') return 'red'
    if (status === 'HOLD') return '#ffc107'
    return '#28a745'
  }

  handleFilterByDate = () => {
    axios
      .get(
        ` ${url.ADMIN_API}/examResult/result?examId=${this.state.examId}&page=${
          this.state.currentPage
        }&size=${this.state.pageSize}&fromDate=${
          moment(this.state.fromDate).isValid()
            ? moment(this.state.fromDate).format("DD/MM/YYYY")
            : ""
        }&toDate=${
          moment(this.state.toDate).isValid()
            ? moment(this.state.toDate).format("DD/MM/YYYY")
            : ""
        }&mark=${this.state.mark}&status=${this.state.action}`,
        { headers: authHeader() }
      )
      .then((res) => {
        this.setState(
          {
            results: res.data.response.content,
            loader: false,
            showData: true,
            totalPages: res.data.response.totalPages,
            totalElements: res.data.response.totalElements,
            numberOfElements: res.data.response.numberOfElements,
            examName: this.props.position.name,
          },
          this.setTableJson
        );
      })
      .catch((error) => {
        errorHandler(error);
        this.setState({ loader: false });
      });
  };
  handleChange = (event) => {
    this.setState({ mark: event.target.value })
  }
  getTotalTestCase = (result) => {
    return _.filter(result.submittedExam, "question.input").length * 5;
  };

  setTableJson = () => {
    const headers = [
      {
        name: "S.NO",
        align: "center",
        key: "S.NO",
      },
      {
        name: "Date",
        align: "left",
        renderCell: (params) => {
          return moment(params?.createdDate).format("DD/MM/YYYY");
        },
      },
    //   {isRoleValidation() !== 'HR' ? <td>
    //   <Link
    //     to={{ pathname: '/admin/result/candidate/details/' + result.candidateId }}
    //     target={'_blank'}
    //     onClick={() => this.setCandidate(result)}
    //     style={{ textDecoration: 'none', color: 'blue' }}
    //   >
    //     {result.candidate?.firstName} {result.candidate?.lastName}
    //   </Link>
    //   {result.candidate?.isFromSkillSort ? <img alt="skillsort" style={{ marginLeft: '7px' }} src={LOGO} ></img> : null}
    // </td> : <td>{result.candidate?.firstName} {result.candidate?.lastName}
    //   {result.candidate?.isFromSkillSort ? <img alt="skillsort" style={{ marginLeft: '5px' }} src={LOGO} ></img> : null}
    // </td>}
      {
        name: "CANDIDATE",
        align: "left",
        renderCell: (params) => {
          return isRoleValidation() !== "HR" ? (
            <>
        <Link
            to={{ pathname: '/admin/result/candidate/details/' + params.candidateId }}
            target={'_blank'}
            onClick={() => this.setCandidate(params)}
            style={{ textDecoration: 'none', color: 'blue' }}
            >
            {params.candidate?.firstName} {params.candidate?.lastName}
            </Link>
             {params.candidate?.isFromSkillSort ? <img alt="skillsort" style={{ marginLeft: '7px' }} src={LOGO} ></img> : null}
             </>
          ) : <>
          {params.candidate?.firstName} {params.candidate?.lastName}
           {params.candidate?.isFromSkillSort ? <img alt="skillsort" style={{ marginLeft: '5px' }} src={LOGO} ></img> : null}
          </>
        },
      },
      {
        name: "TOTAL QUESTION",
        align: "center",
        key: "totalQuestion",
      },
      {
        name: "TOTAL MCQ MARKS",
        align: "center",
        key: "totalMarks",
      },
      {
        name: "PROGRAMMING MARK",
        align: "center",
        renderCell: (params) => {
          return params?.totalProgrammingMarks
            ? params.totalProgrammingMarks
            : 0;
        },
      },
      {
        name: "TEST CASE PASS",
        align: "center",
        key: "canditate",
        renderCell: (params) => {
          let numerator = 0;
          numerator = params?.results && params?.results[ _.findIndex(params?.results, { section: "PROGRAMMING" }) ]?.totalTestCasePass || 0;
          const denominator = this.getTotalTestCase(params) || 1;
          return `${numerator}/${denominator}`;
        },
      },
      {
        name: "STATUS",
        align: "left",
        isFilter: true,
        key: "status",
        renderOptions: () => {
          return _.map(
            [
              { name: "Pending", value: "PENDING" },
              { name: "Selected", value: "SELECTED" },
              { name: "Rejected", value: "REJECTED" },
              { name: "Hold", value: "HOLD" },
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
        renderCell:(params)=>{
          return (
            <div className="row">
          <div className="col" style={{minWidth: '5rem'}}>
              <span style={{ marginTop: "0px", color: this.setFontColor(params.candidate?.candidateStatus) }}>
                  {params.candidate?.candidateStatus === "HOLD" ? "HOLD" : (params.candidate?.candidateStatus === "PENDING" ? "PENDING" : (params.candidate?.candidateStatus === "REJECTED" ? "REJECTED" : "SELECTED"))}
              </span>
              </div>
              <div className="col">
              <i className="fa fa-share-square-o" aria-hidden="true" style={{ color: '#3b489e', cursor: 'pointer' }} onClick={() => this.onClickOpenModel(params.id)} data-toggle="tooltip" data-placement="top" title="SHARE CANDIDATE RESULTS" />
              </div>
          </div>
          )
        }
      },
    ];
    this.setState({ headers: headers });
  };

  handleActionFilter = (value) => {
    this.setState({ action: value }, () => this.handleFilterByDate());
  };
  onNextPage = () => {
    this.handleFilterByDate();
  }
  increment = () => {
    this.setState({
      startPage: (this.state.startPage) + 5,
      endPage: (this.state.endPage) + 5
    });
  }
  decrement = () => {
    this.setState({
      startPage: (this.state.startPage) - 5,
      endPage: (this.state.endPage) - 5
    });
  }
  onPagination = (pageSize, currentPage) => {
    this.setState({ pageSize: pageSize, currentPage: currentPage }, () => { this.onNextPage() });
  }
  onSearch = ( fromDate, toDate) => {
    this.setState(
      {  currentPage: 1, fromDate: fromDate, toDate: toDate },
      this.handleFilterByDate
    );
  };

  render() {
    return (
      <div className="row mt-2">
        {fallBackLoader(this.state.loader)}
        <AdvSearch
          title="Filter"
          showSearch={true}
          showDate={true}
          placeholder="Search Mark  Eg: <=10, =10"
          onSearch={this.onSearch}

        />
        <CustomTable
          data={this.state.results}
          headers={this.state.headers}
          loader={this.state.loader}
          pageSize={this.state.pageSize}
          currentPage={this.state.currentPage}
        />
        {this.state.numberOfElements === 0 ? (
          ""
        ) : (
          <Pagination
            totalPages={this.state.totalPages}
            currentPage={this.state.currentPage}
            onPagination={this.onPagination}
            numberOfElements={this.state.numberOfElements}
            totalElements={this.state.totalElements}
            pageSize={this.state.pageSize}
          />
        )}
        {this.state.openModal && (
          <CopyClipBoardPopUp
            link={this.state.sharableLink}
            onCloseModal={this.onCloseModal}
          />
        ) }
      </div>
    );
  }
}
