import axios from "axios";
import _ from "lodash";
import React, { Component } from "react";
import { authHeader, errorHandler } from "../../api/Api";
import { fallBackLoader } from '../../utils/CommonUtils';
import Pagination from "../../utils/Pagination";
import SectionModal from "./SectionModal";
import url from "../../utils/UrlConstant";
import { Link } from "react-router-dom";
import { CustomTable } from '../../utils/CustomTable';
import { MenuItem } from '@mui/material';
import CustomMenuItem from "../../utils/Menu/CustomMenuItem";
export default class SectionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sections: [],
      openModal: false,
      openModalAdd: false,
      modalSection: "",
      status: "ACTIVE",
      loader: false,
      currentPage: 1,
      pageSize: 10,
      totalPages: 0,
      totalElements: 0,
      numberOfElements: 0,
      startPage: 1,
      endPage: 5,
      sectionRoles: 'CANDIDATE',
      headers: [],
    };
  }

  componentDidMount() {
    this.setTableJson()
    this.setState({ loader: true });
    axios.get(` ${url.ADMIN_API}/section/list?sectionRoles=${this.state.sectionRoles}&status=${this.state.status}&page=${this.state.currentPage}&size=${this.state.pageSize}`, {
      headers: authHeader(),
    })
      .then((res) => {
        this.setState({ sections: res.data.response.content, loader: false, totalPages: res.data.response.totalPages, totalElements: res.data.response.totalElements, numberOfElements: res.data.response.numberOfElements });
      })
      .catch((error) => {
        errorHandler(error);
        this.setState({ loader: false });
      });
  }

  handleStatusFilter(value, key) {
    this.setState({ status:value });
    axios
      .get(` ${url.ADMIN_API}/section/list?sectionRoles=${this.state.sectionRoles}&${key}=${value}&page=${this.state.currentPage}&size=${this.state.pageSize}`, {
        headers: authHeader(),
      })
      .then((res) => {
        this.setState({ sections: res.data.response.content, totalPages: res.data.response.totalPages, totalElements: res.data.response.totalElements, numberOfElements: res.data.response.numberOfElements });
      })
      .catch((error) => {
        errorHandler(error);
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
        this.componentDidMount();
      }
      else {
        this.setState({ openModalAdd: !this.state.openModalAdd });
        this.componentDidMount();
      }
    }
  };

  onCloseModalAdd = () => {
    this.setState({ openModalAdd: !this.state.openModalAdd });
    this.componentDidMount();
  };

  onCloseModal = () => {
    this.setState({ openModal: !this.state.openModal });
    this.componentDidMount();
  };

  onNextPage = () => {
    axios.get(` ${url.ADMIN_API}/section/list/?sectionRoles=${this.state.sectionRoles}&status=${this.state.status}&page=${this.state.currentPage}&size=${this.state.pageSize}`, { headers: authHeader() })
      .then(res => {
        this.setState({ sections: res.data.response.content, totalPages: res.data.response.totalPages, totalElements: res.data.response.totalElements, numberOfElements: res.data.response.numberOfElements });
      })
  }

  increment = (event) => {
    this.setState({
      startPage: (this.state.startPage) + 5,
      endPage: (this.state.endPage) + 5
    });
  }
  decrement = (event) => {
    this.setState({
      startPage: (this.state.startPage) - 5,
      endPage: (this.state.endPage) - 5
    });
  }

  onPagination = (pageSize, currentPage) => {
    this.setState({ pageSize: pageSize, currentPage: currentPage }, () => { this.onNextPage() });
  }
  setTableJson = () => {
    const headers = [
      {
        name: 'S.NO',
        align: 'center',
        key: 'S.NO',
      },
      {
        name: 'NAME',
        align: 'left',
        key: 'name',
      },
      {
        name: 'DESCRIPTION',
        align: 'left',
        key: 'description',
      },
      {
        name: 'STATUS',
        align: 'left',
        isFilter: true,
        key: 'status',
        renderOptions: () => {
          return _.map([{ name: 'Active', value: 'ACTIVE' }, { name: 'InActive', value: 'INACTIVE' }], (opt) => (
            <CustomMenuItem onClick={() => this.handleStatusFilter(opt.value, 'status')} key={opt.value} value={opt.value}>
              {opt.name}
            </CustomMenuItem>
          ));
        },
      },
      {
        name: 'Action',
        key: 'action',
        renderCell: (params) => {
          return (
            <i
            className="fa fa-pencil"
            style={{ cursor: 'pointer', color: '#3B489E' }}
            aria-hidden="true"
            onClick={() =>this.onClickOpenModalAdd(params)}
          ></i>
          );
        },
      },
    ]
    this.setState({ headers: headers });
  };



  render() {
    let i = this.state.pageSize - 1;
    return (
      <main className="main-content bcg-clr">
        <div>
          <div className="card-header-new">
            <span>Section List</span>
            <button type="button" onClick={this.onClickOpenModalAdd} className="btn btn-nxt btn-sm header-button">Add Section</button>
            {this.state.openModalAdd ? <SectionModal modalSection={{ action: "Add", section: this.state.modalSection, }} onCloseModalAdd={this.onCloseModalAdd} /> : null} </div>
          {/* <div className="row">
            <div className="col-md-12">
              <div className="table-border">
                <div>
                  {fallBackLoader(this.state.loader)}
                  <div className="table-responsive pagination_table">
                    <table className="table table-striped">
                      <thead className="table-dark">
                        <tr>
                          <th>S.No</th>
                          <th>NAME</th>
                          <th>DESCRIPTION</th>
                          <th>
                            <div className="row">
                              STATUS
                              <div className="col-sm">
                                <div className="dropdown">
                                  <div className="dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown"
                                    aria-haspopup="true" aria-expanded="false" >
                                    <i className="fa fa-filter" aria-hidden="true"></i> </div>
                                  <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" >
                                    <option className="dropdown-item" onClick={(e) => this.handleStatusFilter(e, "status")} value="ACTIVE" > Active </option>
                                    <option className="dropdown-item" onClick={(e) => this.handleStatusFilter(e, "status")} value="INACTIVE" > InActive </option>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </th>
                          <th>ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.sections?.length > 0 ? (
                          _.map(this.state.sections, (section, index) => {
                            return (
                              <tr>
                                <td>{this.state.pageSize * this.state.currentPage - (i--)}</td>
                                <td>{section.name}</td>
                                <td>{section.description}</td>
                                <td
                                  className={section.status === "INACTIVE" ? "text-danger" : "text-success"} > {section.status} </td> <td>
                                  <button type="button" onClick={() => this.onClickOpenModel(section)} className="btn" >
                                    <i className="fa fa-pencil" aria-hidden="true" ></i> </button>
                                </td>
                              </tr>);
                          })) : (<tr className="text-center"> <td colspan="6">No data available in table</td> </tr>)}
                      </tbody>
                    </table>
                    {this.state.numberOfElements === 0 ? '' :
                      <Pagination totalPages={this.state.totalPages} currentPage={this.state.currentPage}
                        onPagination={this.onPagination} increment={this.increment} decrement={this.decrement}
                        startPage={this.state.startPage} numberOfElements={this.state.numberOfElements} endPage={this.state.endPage}
                        totalElements={this.state.totalElements} pageSize={this.state.pageSize} />}
                  </div>
                  {this.state.openModal ? <SectionModal modalSection={{ action: "Update", section: this.state.modalSection, }} onCloseModal={this.onCloseModal} /> : null}
                </div>
              </div>
            </div>
          </div> */}
          <CustomTable headers={this.state.headers} data={this.state.sections} pageSize={this.state.pageSize} currentPage={this.state.currentPage} />
          {this.state.numberOfElements === 0 ? '' :
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

            />}
        </div>
      </main>
    );
  }
}