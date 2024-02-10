import { MenuItem } from '@mui/material';
import axios from 'axios';
import _ from 'lodash';
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { authHeader, errorHandler } from '../../api/Api';
import Search from '../../common/AdvanceSearch';
import { toastMessage } from '../../utils/CommonUtils';
import { CustomTable } from '../../utils/CustomTable';
import Pagination from "../../utils/Pagination";
import TableHeader from '../../utils/TableHeader';
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


  onClickOpenModel = (data) => {

    if (!this.state.openModal) {
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }
    this.setState((prevState) => ({ ...prevState, openModal: !prevState.openModal, loader: false, modalSection: data}))
  };

  handleOutsideClick = (e) => {
    if (e.target.className === "modal fade show") {
     this.changeOpenModalState('openModal')
    }
  };

  increment = (_event) => {
    this.setState((prevState) => ({ ...prevState, startPage: prevState.startPage + 5, endPage: prevState.endPage + 5 }))
  }
  decrement = (_event) => {
    this.setState((prevState) => ({ ...prevState, startPage: prevState.startPage - 5, endPage: prevState.endPage - 5 }))
  }

  onPagination = (pageSize, currentPage) => {
    this.setState({ pageSize: pageSize, currentPage: currentPage }, () => { this.onNextPage() });
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
            title='Filter'
            showSearch={true}
            placeholder='search Test by name'
            onSearch={this.onSearch}

          ></Search>
          <CustomTable headers={this.state.headers} data={this.state.exams} pageSize={this.state.pageSize} currentPage={this.state.currentPage} style={{ width:'calc(100vw - 9.85rem)' , marginLeft:'18px'}} />
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
