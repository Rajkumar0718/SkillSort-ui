import axios from 'axios';
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { authHeader, errorHandler } from '../../api/Api';
import { fallBackLoader, withLocation } from '../../utils/CommonUtils';
import Pagination from "../../utils/Pagination";
import  url  from '../../utils/UrlConstant';
import { CustomTable } from '../../utils/CustomTable';

 class ExamList extends Component {

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
            name: 'JOB DESCRIPTION	',
            align: 'left',
            key: 'jobDescription',
        },
        {
            name: 'Action',
            key: 'action',
            renderCell: (params) => {
                return (
                  <Link className="collapse-item" to= '/processadmin/company/test/candidate' onClick={() => this.route(params.id, params.name, params.jobDescription)}>
                  <i className="fa fa-eye" aria-hidden="true" data-toggle="tooltip" data-placement="top" title="VIEW CANDIDATE" style={{ color: 'black' }}></i></Link>
                );
            },
        },
        {
          name:'PENDING',
          align:'center',
          key:'id'
       },
    ]
    this.setState({headers: headers});
};

  route(id, name, desc) {
    localStorage.setItem('examId', id);
    localStorage.setItem('examName', name);
    localStorage.setItem('jobDescription', desc);
  }

  render() {
    return (
      <main className="main-content bcg-clr">
        <div>
          <div className="card-header-new">
            <span>Test</span>
          </div>
          <CustomTable statusCount={this.state.statusCount} headers={this.state.headers} data={this.state.exams} pageSize={this.state.pageSize} currentPage={this.state.currentPage} style ={{width:'97%' , marginLeft:'18px'}}></CustomTable>
           {this.state.numberOfElements ? <Pagination totalPages={this.state.totalPages} currentPage={this.state.currentPage}
                  onPagination={this.onPagination} increment={this.increment} decrement={this.decrement} startPage={this.state.startPage}
                  numberOfElements={this.state.numberOfElements} endPage={this.state.endPage} totalElements={this.state.totalElements}
                  pageSize={this.state.pageSize} /> : null}
        </div>
      </main>
    );
  }
}
export default withLocation(ExamList)