import axios from 'axios';
import _ from "lodash";
import React, { Component } from 'react';
import { authHeader, errorHandler } from '../../api/Api';
import Search from '../../common/AdvanceSearch';
import { fallBackLoader } from '../../utils/CommonUtils';
import Pagination from "../../utils/Pagination";
import { url } from '../../utils/UrlConstant';
import DepartmentModal from '../College/DepartmentModal';
import { CustomTable } from '../../utils/CustomTable';
import { MenuItem } from "@mui/material";
import { Link } from 'react-router-dom';


export default class StaffList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      department: [],
      openModal: false,
      openModalAdd: false,
      modalSection: "",
      status: 'ACTIVE',
      loader: true,
      currentPage: 1,
      pageSize: 10,
      totalPages: 0,
      totalElements: 0,
      numberOfElements: 0,
      countError: false,
      startPage: 1,
      endPage: 5,
      collegeId: JSON.parse(localStorage.getItem("user")).companyId,
      searchValue: '',
      headers: [],
    }
  }

  componentDidMount() {
    this.getDepartmentList();
    this.setTableJson();
  }

  getDepartmentList = () => {
    const { status, currentPage, pageSize, searchValue } = this.state;
    axios.get(`${url.ADMIN_API}/department/list?status=${status}&page=${currentPage}&size=${pageSize}&search=${searchValue}`, { headers: authHeader() })
        .then(res => {
            this.setState({
                department: res.data.response.content,
                loader: false,
                totalPages: res.data.response.totalPages,
                totalElements: res.data.response.totalElements,
                numberOfElements: res.data.response.numberOfElements
            });
        })
        .catch(error => {
            this.setState({ loader: false });
            errorHandler(error);
        });
}

  handleStatusFilter = (value) => {
    const status = value;
    this.setState({ status }, () => {
        this.getDepartmentList();
    });
}


  onNextPage = () => {
    axios.get(` ${url.ADMIN_API}/department?collegeId=${this.state.collegeId}&status=${this.state.status}&page=${this.state.currentPage}&size=${this.state.pageSize}`, { headers: authHeader() })
      .then(res => {
        this.setState({
          department: res.data.response.content,
          totalPages: res.data.response.totalPages,
          totalElements: res.data.response.totalElements,
          numberOfElements: res.data.response.numberOfElements,
          loader: false
        });
      }).catch(error => {
        this.setState({ loader: false });
        errorHandler(error);
      })
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

  onClickOpenModalAdd = () => {
    if (!this.state.openModalAdd) {
      document.addEventListener('click', this.handleOutsideClick, false);
    } else {
      document.removeEventListener('click', this.handleOutsideClick, false);
    }
    this.setState({ openModalAdd: !this.state.openModalAdd });
  };

  onClickOpenModel = (data) => {
    if (!this.state.openModal) {
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }
    this.setState({ openModal: !this.state.openModal });
    this.setState({ modalSection: data });
  };

  handleOutsideClick = (e) => {
    if (e.target.className === "modal fade show") {
      if (this.state.openModal === true) {
        this.setState({ openModal: !this.state.openModal });
        this.getDepartmentList();
      }
      else {
        this.setState({ openModalAdd: !this.state.openModalAdd });
        this.getDepartmentList();
      }
    }
  };

  onCloseModalAdd = () => {
    this.setState({ openModalAdd: !this.state.openModalAdd });
    this.getDepartmentList();
  };

  onCloseModal = () => {
    this.setState({ openModal: !this.state.openModal });
    this.getDepartmentList();
  };
  onPagination = (pageSize, currentPage) => {
    this.setState({ pageSize: pageSize, currentPage: currentPage }, () => { this.onNextPage() });
  }
  onSearch = (searchValue) => {
    this.setState({ searchValue: searchValue }, () => { this.getDepartmentList() });
  }
  getDepartmentList = () => {
    axios.get(` ${url.ADMIN_API}/department/list?status=${this.state.status}&page=${this.state.currentPage}&size=${this.state.pageSize}&search=${this.state.searchValue}`, { headers: authHeader() })
      .then(res => {
        this.setState({
          department: res.data.response.content,
          loader: false,
          totalPages: res.data.response.totalPages,
          totalElements: res.data.response.totalElements,
          numberOfElements: res.data.response.numberOfElements
        });
      })
      .catch(error => {
        this.setState({ loader: false });
        errorHandler(error);
      })
  }

  setTableJson = () => {
    const newheaders = [
      {
        name: 'S.No',
        align: 'center',
        key: 'S.NO',
      },
      {
        name: 'DISPLAY NAME',
        align: 'left',
        key: 'abbreviation',
      },
      {
        name: 'DEPARTMENT',
        align: 'left',
        key: 'departmentName',
      },
      {
        name: 'STATUS',
        align: 'left',
        isFilter: true,
        key: 'status',
        renderOptions: () => {
          return _.map(
            [
              { name: 'Active', value: 'ACTIVE' },
              { name: 'InActive', value: 'INACTIVE' },
            ],
            (opt) => (
              <MenuItem
                onClick={() => this.handleStatusFilter(opt.value)}
                key={opt.value}
                value={opt.value}
              >
                {opt.name}
              </MenuItem>
            )
          );
        },
      },
      {
        name: 'Action',
        key: 'action',
        renderCell: (params) => (
          <Link to="#">
            <i className="fa fa-pencil" aria-hidden="true" onClick={() => this.onClickOpenModel(params)} style={{ cursor: 'pointer' }}></i>
          </Link>
        ),
      },
    ];

    this.setState({ headers: newheaders });
  };



  render() {
    let i = this.state.pageSize - 1;
    return (
      <main className="main-content bcg-clr">
        <div>
          {fallBackLoader(this.state.loader)}
          <div className="card-header-new">
            <span>Department List</span>
            <button type="button" className="btn btn-sm btn-nxt header-button" onClick={this.onClickOpenModalAdd}>
              Add Department
            </button>
            {this.state.openModalAdd ? (
              <DepartmentModal
                modalSection={{
                  action: "Add",
                  section: this.state.modalSection,
                }}
                onCloseModalAdd={this.onCloseModalAdd}
              />
            ) : (
              ""
            )}
          </div>
          <Search
            title="Filter"
            showSearch={true}
            placeholder="Search By Name,Department "
            onSearch={this.onSearch}
          ></Search>
          <div className="row">
            <div className="col-md-12">
              <div className="table-border">
                <CustomTable headers={this.state.headers} data={this.state.department} pageSize={this.state.pageSize} currentPage={this.state.currentPage}></CustomTable>

                {this.state.numberOfElements === 0 ? '' :
                  <Pagination
                    totalPages={this.state.totalPages}
                    currentPage={this.state.currentPage}
                    onPagination={this.onPagination}
                    increment={this.increment}
                    decrement={this.decrement}
                    numberOfElements={this.state.numberOfElements}
                    totalElements={this.state.totalElements}
                    pageSize={this.state.pageSize}

                  />}
              </div>
              {this.state.openModal ? (
                <DepartmentModal
                  modalSection={{
                    action: "Update",
                    section: this.state.modalSection,
                  }}
                  onCloseModal={this.onCloseModal}
                />
              ) : (
                ""
              )}
            </div>
          </div>
        </div >
      </main>
    );
  }
}
