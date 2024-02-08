import { MenuItem } from '@mui/material';
import Pagination from "../../utils/Pagination";
import axios from 'axios';
import _ from 'lodash';
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { authHeader, errorHandler } from '../../api/Api';
import Search from '../../common/AdvanceSearch';
import { toastMessage } from '../../utils/CommonUtils';
import { CustomTable } from '../../utils/CustomTable';
import TableHeader from '../../utils/TableHeader';
import { isRoleValidation } from '../../utils/Validation';
import url from '../../utils/UrlConstant';

export default class ExamList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exams: [],
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
      searchValue: '',
      plans: [],
      headers:[],
    }
  }
  componentDidMount() {
    this.setTableJson();
      this.initialCall();
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
            name: 'DURATION',
            align: 'left',
            key: 'duration',
        },
        {
            name: 'SECTION',
            align: 'left',
            key: 'categories',
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
            renderCell: (params) => {
                return (
                  <div>
                    <Link className='collapse-item' to='/admin/test/edit' state={{ exams: params, action: 'Update' }} >
                        <i
                            className='fa fa-pencil'
                            style={{ cursor: 'pointer', color: '#3B489E' }}
                            aria-hidden='true'
                        ></i>
                    </Link>
                    <i className="fa fa-trash-o" aria-hidden="true" style={{marginLeft: "1rem", color: "rgb(59, 72, 158)"}} onClick={() => this.deleteExamHandler(params)}></i>
                    </div>
                );
            },
        },
    ]
    this.setState({headers: headers});
};

  initialCall = () => {
    this.getTests();
    this.getCompanyPlans();
  }

  getTests = () => {
    axios.get(` ${url.ADMIN_API}/exam/list?status=${this.state.status}&page=${this.state.currentPage}&size=${this.state.pageSize}&search=${this.state.searchValue}`, { headers: authHeader() })
      .then(res => {
        this.setState({
          exams: res.data.response.content,
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

  getCompanyPlans = () => {
    axios.get(`${url.ADMIN_API}/plan?service=TEST`, { headers: authHeader() })
      .then(res => {
        if (_.isEmpty(res.data.response)) return
        this.setState({ plans: res.data.response || [] })
      }).catch(error => errorHandler(error))
  }

  deleteExamHandler = (data) => {
    let examId = data.id;
    axios.delete(`${url.ADMIN_API}/exam/remove/${examId}`, { headers: authHeader() })
      .then(_res => {
        toastMessage('success', 'Test Deleted Successfully..!');
        this.componentDidMount();
      }).catch(error => {
        errorHandler(error);
      })
  }

  handleStatusFilter(value) {
    this.setState({ status: value}, () => this.getTests());
  }


  changeOpenModalState = (key) => this.setState({ [key] : !this.state[key] }, this.initialCall);

  onMailCloseModal = () => {
      this.changeOpenModalState("mailOpenModal")
  }

  onClickOpenModel = (data) => {

    if (!this.state.openModal) {
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }
    this.setState({ openModal: !this.state.openModal, loader: false, modalSection: data });
  };

  handleOutsideClick = (e) => {
    if (e.target.className === "modal fade show") {
     this.changeOpenModalState('openModal')
    }
  };

  onCloseModal = () => {
    this.changeOpenModalState('openModal')
  };

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

  checkRoleAndRender = (exam, event) => {
    if (event === "BUTTON") {
      if (isRoleValidation() === "COLLEGE_ADMIN" || isRoleValidation() === "COLLEGE_STAFF") {
        return (
          <td style={{ textAlign: 'center' }}>
            <button type="button" data-toggle="tooltip" data-placement="top" title="Add emails" onClick={() => this.onClickOpenModel(exam)} className="btn btn ml-1"><i className="fa fa-paper-plane" aria-hidden="true"></i></button>
          </td>
        )
      } else {
        return (
          <td style={{ textAlign: 'center', cursor: 'pointer' }}>
            <Link className="collapse-item" to={{ pathname: '/admin/test/edit', state: { exams: exam, action: 'Update' } }}>
              <i className="fa fa-pencil" aria-hidden="true" style={{ color: '#3B489E' }}></i>
            </Link>
            <i className="fa fa-trash-o" aria-hidden="true" title='Delete Test' onClick={() => this.deleteExamHandler(exam)} style={{ marginLeft: '1rem', color: '#3B489E' }}></i>
          </td>
        )
      }
    } else if (event === "LINK") {
      if (isRoleValidation() === 'TEST_ADMIN') {
        return '/testadmin/add';
      } else if (isRoleValidation() === "ADMIN") {
        return '/admin/test/add';
      }
    }
  }

  renderTable() {
    let i = this.state.pageSize - 1;
    return this.state.exams?.length > 0 ? _.map(this.state.exams, (exam, _index) => {
      return (
        <tr className="collapsed" id="accordion" data-toggle="collapse" data-parent="#accordion" href="#collapseOne">
          <td style={{ textAlign: 'center' }}>{this.state.pageSize * this.state.currentPage - (i--)}</td>
          <td style={{ textAlign: 'left', textTransform: 'capitalize' }}>{exam.name}</td>
          <td>{parseInt(exam.duration ? exam.duration : '0') + parseInt(exam.programmingDuration ? exam.programmingDuration : '0')}</td>
          <td>{exam.categories.length}</td>
          <td style={{ textAlign: 'left' }} className={exam.status === 'INACTIVE' ? 'text-danger' : 'text-success'}>{exam.status}</td>
          {isRoleValidation() === "TEST_ADMIN" ?
            <td style={{ textAlign: 'center' }}>
              <Link className="collapse-item" to={{ pathname: '/testadmin/edit', state: { exams: exam, action: 'Update' } }}>
                <i className="fa fa-pencil" aria-hidden="true" style={{ color: '#3B489E' }}></i>
              </Link>
              <i className="fa fa-trash-o" aria-hidden="true" onClick={() => this.deleteExamHandler(exam)}></i>
            </td> : this.checkRoleAndRender(exam, "BUTTON")
          }
        </tr>
      );
    }) : <tr className='text-center'><td colSpan={6}>No data available</td></tr>

  }

  onNextPage = () => {
    this.getTests();
  }

  onSearch = (searchValue) => {
    this.setState({ searchValue: searchValue }, () => { this.getTests() });
  }

  render() {
    return (
      <main className="main-content bcg-clr">
        <div>
          <TableHeader
            title={<span style={{ fontFamily: 'Baskervville' }}>Test
            </span>}
            link="/admin/test/add"
            buttonName="Add Test"
            showLink={true}
          />
          <Search
           style={{
              backgroundColor: 'rgba(59, 72, 158, 0.3)',
              padding: '0.60rem 1.25rem',
              marginBottom: '0.5%',
              color: '#111111',
              height: '58px',
              verticalAlign: '-webkit-baseline-middle',
              borderRadius: '2px',
              /* fontWeight: '600', */
              marginLeft: '19.6px',
              marginRight: '19.6px',
            }}
            title='Filter'
            showSearch={true}
            placeholder='search Test by name'
            onSearch={this.onSearch}

          ></Search>
          <CustomTable headers={this.state.headers} data={this.state.exams} pageSize={this.state.pageSize} currentPage={this.state.currentPage} style ={{width:'97%' , marginLeft:'18px'}} />
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
