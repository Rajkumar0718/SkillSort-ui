import axios from 'axios';
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { authHeader, errorHandler } from '../../api/Api';
import { CustomTable } from '../../utils/CustomTable';
import Pagination from "../../utils/Pagination";
import url from '../../utils/UrlConstant';

export default class ExamList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      exams: [],
      loader: true,
      currentPage: 1,
      pageSize: 10,
      totalPages: 0,
      totalElements: 0,
      numberOfElements: 0,
      startPage: 1,
      endPage: 5,
      jobDescription: '',
      statusCount: [],
      headers :[],
    }
  }

  componentDidMount() {
    this.setTableJson()
    const id = localStorage.getItem("companyId");
    axios.get(` ${url.ADMIN_API}/exam/list?status=ACTIVE&companyId=${id}&page=${this.state.currentPage}&size=${this.state.pageSize}`, { headers: authHeader() })
      .then(res => {
        this.setState({
          exams: res.data.response.content,
          totalPages: res.data.response.totalPages,
          totalElements: res.data.response.totalElements,
          numberOfElements: res.data.response.numberOfElements, loader: false
        });
      }).catch(error => {
        this.setState({ loader: false });
        errorHandler(error);
      })
    axios.get(`${url.ADMIN_API}/superadmin/status/count`, { headers: authHeader() })
      .then(res => {
        this.setState({ statusCount: res.data.response, loader: false });
      }).catch(error => {
        this.setState({ loader: false });
        errorHandler(error);
      })
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
            key: 'userName',
        },
        {
            name: 'JOB DESCRIPTION	',
            align: 'left',
            key: 'job',
        },
      
        {
            name: 'Action',
            align:'center',
            key: 'action',
            renderCell: (params) => {
                return (
                    <Link className='collapse-item' to='/admin/hr/edit' state={{ Hr: params, action: 'Update' }} >
                        <i
                            className='fa fa-pencil'
                            style={{ cursor: 'pointer', color: '#3B489E' }}
                            aria-hidden='true'
                        ></i>
                    </Link>
                );
            },
        },
        {
          name: 'PENDING',
          align: 'center',
          key: 'pending',
      },
    ]
    this.setState({headers: headers});
};

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

  onNextPage = () => {
    axios.get(` ${url.ADMIN_API}/exam/list?status=ACTIVE&companyId=${localStorage.getItem("companyId")}&page=${this.state.currentPage}&size=${this.state.pageSize}`, { headers: authHeader() })
      .then(res => {
        this.setState({
          exams: res.data.response.content,
          totalPages: res.data.response.totalPages,
          totalElements: res.data.response.totalElements,
          numberOfElements: res.data.response.numberOfElements, loader: false
        });
      }).catch(error => {
        this.setState({ loader: false });
        errorHandler(error);
      })
  }

  route(id, name, desc) {
    localStorage.setItem('examId', id);
    localStorage.setItem('examName', name);
    localStorage.setItem('jobDescription', desc);
  }

  renderTable() {
    let i = this.state.pageSize - 1;
    return this.state.exams.length > 0 ? (this.state.exams || []).map((exam, _index) => {
      return (
        <tr style={{ textAlign: 'center' }} key={exam.id}>
          <td>{this.state.pageSize * this.state.currentPage - (i--)}</td>
          <td style={{ textAlign: 'left' }}>{exam.name}</td>
          <td style={{ textAlign: 'left' }}>{exam.jobDescription?.replace(/<[^>]*>?/gm, '')}</td>
          <td>
            <Link className="collapse-item" to={{ pathname: '/processadmin/company/test/candidate' }} onClick={() => this.route(exam.id, exam.name, exam.jobDescription)}>
              <i className="fa fa-eye" aria-hidden="true" data-toggle="tooltip" data-placement="top" title="VIEW CANDIDATE" style={{ color: 'black' }}></i></Link>
          </td>
          <td><b>{this.state.statusCount[exam.id] ? this.state.statusCount[exam.id] : "-"}</b></td>
        </tr>
      );
    }) : <tr className='text-center'><td colspan="6">No data available</td></tr>

  }

  render() {
    return (
      <main className="main-content bcg-clr">
        <div>
          <div className="card-header-new">
            <span>Test</span>
          </div>
          {/* <div className="row">
            <div className="col-md-12">
              {fallBackLoader(this.state.loader)}
              <div className="table-border">
                <div className="table-responsive pagination_table">
                  <table className="table table-striped">
                    <thead className="table-dark">
                      <tr>
                        <th style={{ textAlign: 'center' }}>S.NO</th>
                        <th style={{ textAlign: 'left' }}>NAME</th>
                        <th style={{ textAlign: 'left' }}>JOB DESCRIPTION</th>
                        <th style={{ textAlign: 'center' }}>ACTION</th>
                        <th style={{ textAlign: 'center' }}>PENDING</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.renderTable()}
                    </tbody>
                  </table>
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
              </div>
            </div>
          </div> */}
          <CustomTable headers={this.state.headers} data={this.state.exams} pageSize={this.state.pageSize} currentPage={this.state.currentPage} ></CustomTable>

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
      </main>
    );
  }
}