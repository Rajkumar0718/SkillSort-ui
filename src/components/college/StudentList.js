import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { authHeader, errorHandler } from "../../api/Api";
import Search from "../../common/AdvanceSearch";
import { fallBackLoader } from "../../utils/CommonUtils";
import Pagination from "../../utils/Pagination";
import { url } from "../../utils/UrlConstant";
import CustomMenuItem from "../../utils/Menu/CustomMenuItem";
// import ExamMailModel from '../Admin/ExamMailModel';
import _ from "lodash";
import { CustomTable } from "../../utils/CustomTable";
import Button from "../../common/Button";
export default class StudentList extends Component {
  constructor(props) {
    super(props);
    const user = JSON.parse(localStorage.getItem("user"));
    this.state = {
      student: [],
      status: "ACTIVE",
      loader: true,
      currentPage: 1,
      pageSize: 10,
      totalPages: 0,
      openModal: false,
      totalElements: 0,
      numberOfElements: 0,
      countError: false,
      startPage: 1,
      endPage: 5,
      user: user,
      searchValue: "",
    };
  }

  componentDidMount() {
    this.setHeader();
    this.getStudents();
  }

  getStudents = () => {
    axios
      .get(
        ` ${url.COLLEGE_API}/student/list/?collegeId=${this.state.user.companyId}&status=${this.state.status}&page=${this.state.currentPage}&size=${this.state.pageSize}&search=${this.state.searchValue}`,
        { headers: authHeader() }
      )
      .then((res) => {
        this.setState({
          student: res.data.response.content,
          loader: false,
          totalPages: res.data.response.totalPages,
          totalElements: res.data.response.totalElements,
          numberOfElements: res.data.response.numberOfElements,
        });
      })
      .catch((error) => {
        this.setState({ loader: false });
        errorHandler(error);
      })
  }

  handleStatusFilter(value) {
    this.setState({ status: value }, () => this.getStudents());
  }

  onNextPage = () => {
    this.setState({ loader: true });
    this.getStudents();
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

  onClickOpenModel = () => {
    if (!this.state.openModal) {
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }
    this.setState({ openModal: !this.state.openModal });
  };

  handleOutsideClick = (e) => {
    if (e.target.className === "modal fade show") {
      this.setState({ openModal: !this.state.openModal });
      this.getStudents();
    }
  };

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
        key: ["firstName", " ", "lastName"],
        concat: true,
      },
      {
        name: "EMAIL",
        align: "left",
        key: "email",
      },
      {
        name: "STATUS",
        align: "left",
        isFilter: true,
        key: "status",
        renderOptions: () => {
          return _.map(
            [
              { name: "Active", value: "ACTIVE" },
              { name: "InActive", value: "INACTIVE" },
            ],
            (opt) => (
              <CustomMenuItem
                onClick={() => this.handleStatusFilter(opt.value, "status")}
                key={opt.value}
                value={opt.value}
              >
                {opt.name}
              </CustomMenuItem>
            )
          );
        },
      },
      {
        name: "ACTION",
        align: "center",
        renderCell: (params) => {
          return (
            <Link
            className="collapse-item"
            to="/college/edit"
            state={{ student: params, action: "Update" }}
           >
            <i className="fa fa-pencil" aria-hidden="true" style={{ color: 'black'}}/>
           </Link>
          );
        },
      },
    ];

    this.setState({ headers });
  };

  onCloseModal = () => {
    this.setState({ openModal: !this.state.openModal });
    this.getStudents();
  };

  onSearch = (searchValue) => {
    this.setState({ searchValue: searchValue, currentPage: 1 }, () => {
      this.getStudents();
    });
  };
  btnList = [
    {
      className: "btn btn-sm btn-nxt ml-1 header-button",
      onClick: () => this.onClickOpenModel(),
      style: { marginRight: "15px" },
      title: "Upload",
    },
    {
      type: "button",
      className: "btn btn-prev btn-sm ml-1 header-button",
      linkStyle: { textDecoration: "none", color: "white" },
      to: "/college/add",
      title: "Add Student",
    },
  ];
  render() {
    let i = this.state.pageSize - 1;
    return (
      <main className="main-content bcg-clr">
        <div>
          {fallBackLoader(this.state.loader)}
          <div className="card-header-new">
            <span>Student List</span>
            <button className='btn btn-sm btn-nxt ml-1 header-button' onClick={() => this.onClickOpenModel()} style={{ marginRight: "15px" }} ><i className="fa fa-upload" aria-hidden="true"></i> Upload</button>
            <button type="button" className="btn btn-prev btn-sm header-button">
              <Link style={{ textDecoration: 'none', color: 'white' }} to='/college/add'>Add Student</Link>
            </button>
          </div>
          <Search
            title="Filter"
            showSearch={true}
            placeholder="search By first name,email"
            onSearch={this.onSearch}
          ></Search>
          <div className="row">
            <div className="col-md-12">
              <div className="table-border">
                <CustomTable
                  data={this.state.student}
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
                    increment={this.increment}
                    decrement={this.decrement}
                    startPage={this.state.startPage}
                    numberOfElements={this.state.numberOfElements}
                    endPage={this.state.endPage}
                    totalElements={this.state.totalElements}
                    pageSize={this.state.pageSize}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        {/* {this.state.openModal ?
          <ExamMailModel
            modalSection={{ type: "Student" }}
            onCloseModal={this.onCloseModal} /> : ''
        } */}
      </main>
    );
  }
}
