import axios from 'axios';
import _ from 'lodash';
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { authHeader, errorHandler } from '../../api/Api';
import { fallBackLoader, withLocation } from '../../utils/CommonUtils';
import Pagination from '../../utils/Pagination';
import { url } from '../../utils/UrlConstant';
import { isRoleValidation } from '../../utils/Validation';
import ExamMailModel from '../Admin/ExamMailModel';
import { CustomTable } from '../../utils/CustomTable';
import { MenuItem } from "@mui/material";


class TestList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test: [],
      openModal: false,
      modalSection: "",
      mailOpenModal: false,
      mailModalSection: "",
      status: 'ACTIVE',
      validMailButton: false,
      currentPage: 1,
      pageSize: 10,
      totalPages: 0,
      totalElements: 0,
      numberOfElements: 0,
      msg: [],
      loader: true,
      startPage: 1,
      endPage: 5,
      headers: [],
    }
  }
  componentDidMount() {
    this.getTests();
  }

  getTests = () => {
    this.setTableJson();
    const { status, currentPage, pageSize } = this.state;
    axios.get(`${url.COLLEGE_API}/level/get-level-list?status=${status}&page=${currentPage}&size=${pageSize}`, { headers: authHeader() })
      .then(res => {
        this.setState({
          test: res.data.response,
          totalPages: res.data.response.totalPages,
          totalElements: res.data.response.totalElements,
          numberOfElements: res.data.response.numberOfElements,
          loader: false
        });
      }).catch(error => {
        errorHandler(error);
        this.setState({ loader: false });
      })
  }

  handleStatusFilter(value) {
    const status = value;
    this.setState({ status }, () => {
    this.getTests();
    });
  }


  onClickMailOpenModal = (_msg, test) => {
    if (!this.state.mailOpenModal) {
      document.addEventListener("click", this.handleMailOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleMailOutsideClick, false);
    }
    this.setState({ mailOpenModal: !this.state.mailOpenModal });

    this.setState({ modalSection: test });
  };

  handleMailOutsideClick = (e) => {
    if (e.target.className === "modal fade show") {
      this.setState({ mailOpenModal: !this.state.mailOpenModal });
      this.componentDidMount();
    }
  };

  onMailCloseModal = () => {
    this.setState({ mailOpenModal: !this.state.mailOpenModal });
    this.componentDidMount();
  }


  onClickOpenModel = (data) => {
    if (!this.state.openModal) {
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }
    this.setState({ openModal: !this.state.openModal, loader: false });
    this.setState({ modalSection: data });
  };

  handleOutsideClick = (e) => {
    if (e.target.className === "modal fade show") {
      this.setState({ openModal: !this.state.openModal });
      this.componentDidMount();
    }
  };

  onCloseModal = () => {
    this.setState({ openModal: !this.state.openModal });
    this.componentDidMount();
  };


  copyClipboard = (data) => {
    var elem = document.createElement("textarea");
    document.body.appendChild(elem);
    elem.value = data;
    elem.select();
    document.execCommand("copy");
    document.body.removeChild(elem);
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
  onPagination = (pageSize, currentPage) => {
    this.setState({ pageSize: pageSize, currentPage: currentPage }, () => { this.onNextPage() });
  }

  checkRoleAndRender = (test, event) => {
    if (event === "BUTTON") {
      return (
        <td style={{ textAlign: 'center' }}>
          <Link className="collapse-item" to='/settings/test/view' state={{ test: test, action: 'Update' }}><button type="button" className="btn"><i className="fa fa-pencil" aria-hidden="true"></i></button></Link>
          <button type="button" onClick={() => this.deleteExamHandler(test)} className="btn btn ml-1"><i className="fa fa-trash-o" aria-hidden="true"></i></button>
          <button type="button" data-toggle="tooltip" data-placement="top" title="Add emails" onClick={() => this.onClickOpenModel(test)} className="btn btn ml-1"><i className="fa fa-paper-plane" aria-hidden="true"></i></button>
        </td>
      )
    }


    else if (event === "LINK") {
      if (isRoleValidation() === 'SUPER_ADMIN') {
        return '/settings/test/addtest';
      }
    }
  }

  renderTable() {
    let i = this.state.pageSize - 1;
    return this.state.test?.length > 0 ? _.map(this.state.test, (test, _index) => {
      return (
        <tr className="collapsed" id="accordion" data-toggle="collapse" data-parent="#accordion" href="#collapseOne">
          <td style={{ textAlign: 'center' }}>{this.state.pageSize * this.state.currentPage - (i--)}</td>
          <td style={{ textAlign: 'center' }}>Level {test.level}</td>
          <td style={{ textAlign: 'center' }}>{parseInt(test.duration ? test.duration : '0') + parseInt(test.programmingDuration ? test.programmingDuration : '0')}</td>
          <td style={{ textAlign: 'center' }}>{test.categories.length}</td>
          <td className={test.status === 'INACTIVE' ? 'text-danger' : 'text-success'} style={{ textAlign: 'center' }}>{test.status}</td>
          {isRoleValidation() === "SUPER_ADMIN" ?
            <td style={{ textAlign: 'center' }}>
              <Link className="collapse-item" to={{ pathname: '/settings/test/view', state: { test: test, action: 'Update' } }}>
                <i className="fa fa-pencil" aria-hidden="true"></i>
              </Link>
            </td> : this.checkRoleAndRender(test, "BUTTON")
          }
        </tr>

      );
    }) : <tr className='text-center'><td colspan="6">No data available</td></tr>

  }

  onNextPage = () => {
    this.getTests();
  }

  setTableJson = () => {
    const newHeaders = [
      {
        name: 'S.NO',
        align: 'center',
        key: 'S.NO',
      },
      {
        name: 'LEVEL',
        align: 'center',
        key: 'level',
      },
      {
        name: 'DURATION',
        align: 'center',
        key: 'duration',
        renderCell: (params) => {
          return parseInt(params.duration ? params.duration : '0') + parseInt(params.programmingDuration ? params.programmingDuration : '0')
        }
      },
      {
        name: 'SECTION',
        align: 'center',
        key: 'section',
        renderCell: (params) => {
          return params?.categories?.length
        }
      },
      {
        name: 'STATUS',
        align: 'center',
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
        renderCell: (params) => {
          return (
            <Link className='collapse-item' to='/settings/test/view' state={{ test: params, action: 'Update' }}>
              <i
                className='fa fa-pencil'
                aria-hidden='true'
              ></i>
            </Link>
          );
        },
      },
    ];
    this.setState({ headers: newHeaders });
  };

  render() {
    return (
      <main className="main-content bcg-clr">
        <div>
          <div className="card-header-new">
            <span>Levels</span>
            <Link style={{ textDecoration: 'none', color: 'white' }} to={this.checkRoleAndRender(null, "LINK")}>
              <button type="button" className="btn btn-sm btn-nxt header-button">Add Level</button>
            </Link>
          </div>
          <div className="row">
            <div className="col-md-12">
              {fallBackLoader(this.state.loader)}
              <div className="table-border">
                <div className="table-responsive pagination_table">

                  <CustomTable headers={this.state.headers} data={this.state.test} pageSize={this.state.pageSize} currentPage={this.state.currentPage}></CustomTable>
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
              </div>
              {this.state.openModal ? (
                <ExamMailModel
                  modalSection={{
                    type: "Email",
                    test: this.state.modalSection,
                  }}
                  onCloseModal={this.onCloseModal}
                  mailModalSection={{ test: this.state.modalSection }} onMailCloseModal={this.onMailCloseModal}
                />
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }
}
export default withLocation(TestList)