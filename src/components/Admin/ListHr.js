import axios from 'axios';
import _ from 'lodash';
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { authHeader, errorHandler } from '../../api/Api';
import Search from '../../common/AdvanceSearch';
import { fallBackLoader } from '../../utils/CommonUtils';
import Pagination from '../../utils/Pagination';
import TableHeader from '../../utils/TableHeader';
import { url } from '../../utils/UrlConstant';
import { CustomTable } from '../../utils/CustomTable';
import { MenuItem } from '@mui/material';

export default class ListHr extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hr: [],
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
      searchValue: '',
      headers:[],
  }
}

  componentDidMount() {
    
    this.setTableJson();
    this.getHrList();
  }

  getHrList = () => {
    axios.get(` ${url.ADMIN_API}/hr/list/?status=${this.state.status}&page=${this.state.currentPage}&size=${this.state.pageSize}&search=${this.state.searchValue}`, { headers: authHeader() })
      .then(res => {
        this.setResponse(res);
      })
      .catch(error => {
        this.setState({ loader: false });
        errorHandler(error);
      })
  }

  handleStatusFilter(value) {
    this.setState({ status: value }, () => { this.getHrList() });
  }

  setResponse = (res) => {
    this.setState({
      hr: res.data.response.content,
      totalPages: res.data.response.totalPages,
      totalElements: res.data.response.totalElements,
      numberOfElements: res.data.response.numberOfElements,
      loader: false,
    });
  }


  onNextPage = () => {
    this.getHrList();
  }

  onPagination = (pageSize, currentPage) => {
    this.setState({ pageSize: pageSize, currentPage: currentPage }, () => { this.onNextPage() });
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

  onSearch = (searchValue) => {
    this.setState({ searchValue: searchValue }, () => { this.getHrList() });
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
            name: 'QUALIFICATION',
            align: 'left',
            key: 'qualification',
        },
        {
            name: 'ROLE',
            align: 'left',
            key: 'role',
        },
        {
           name:'EMAIL',
           align:'left',
           key:'email'
        },
        
        {
           name:'PHONE NUMBER',
           align:'left',
           key:'phone'
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
    ]
    this.setState({headers: headers});
};

  render() {
    let i = this.state.pageSize - 1;
    return (
      <main className="main-content bcg-clr">
        {fallBackLoader(this.state.loader)}
        <div>
          <TableHeader
            title="HR Users"
            link="/admin/hr/add"
            buttonName="Add HR"
            showLink={true}
          />
          <Search style={{marginLeft:0,marginRight:0}}
            title="Filter"
            showSearch={true}
            placeholder="search Hr by name, email, phone"
            onSearch={this.onSearch}
          ></Search>
          {/* <div className="row">
            <div className="col-md-12">
              <div className="table-border">
                <table className="table table-striped" style={{ textAlign: 'center' }}>
                  <thead className="table-dark">
                    <tr>
                      <th>S.NO</th>
                      <th style={{ textAlign: 'left' }}>Name</th>
                      <th style={{ textAlign: 'left' }}>Qualification</th>
                      <th style={{ textAlign: 'left' }}>Role</th>
                      <th style={{ textAlign: 'left' }}>Email</th>
                      <th>Phone Number</th>
                      <th>
                        <div className="dropdown">
                          <div type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" >
                            <span>STATUS </span> <i className="fa fa-filter" aria-hidden="true"></i>
                          </div>
                          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ fontSize: "13px", minWidth: "5rem" }} >
                            <option className="dropdown-item" onClick={(e) => this.handleStatusFilter(e, "status")} value="ACTIVE" > Active </option>
                            <option className="dropdown-item" onClick={(e) => this.handleStatusFilter(e, "status")} value="INACTIVE" > InActive </option>
                          </div>
                        </div>
                      </th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.Hr?.length > 0 ?
                      _.map(this.state.Hr, (Hr) => <tr>
                        <td> {this.state.pageSize * this.state.currentPage - i--} </td>
                        <td style={{ textAlign: 'left' }}>{Hr.userName}</td>
                        <td style={{ textAlign: 'left' }}>{Hr.qualification}</td>
                        <td style={{ textAlign: 'left' }}>{Hr.role?.replace("_"," ")}</td>
                        <td style={{ textAlign: 'left' }}>{Hr.email}</td>
                        <td>{Hr.phone}</td>
                        <td className={Hr.status === "INACTIVE" ? "text-danger" : "text-success"} > {Hr.status} </td>
                        <td>
                          <Link className="collapse-item" to={{ pathname: "/admin/hr/edit", state: { Hr: Hr, action: "Update" }, }}>
                            <i className="fa fa-pencil" aria-hidden="true"></i> </Link>
                        </td>
                      </tr>) : <tr className="text-center"> <td colspan="8">No data available</td> </tr>}
                  </tbody>
                </table>
                {this.state.numberOfElements ? <Pagination totalPages={this.state.totalPages} currentPage={this.state.currentPage}
                  onPagination={this.onPagination} increment={this.increment} decrement={this.decrement} startPage={this.state.startPage}
                  numberOfElements={this.state.numberOfElements} endPage={this.state.endPage} totalElements={this.state.totalElements}
                  pageSize={this.state.pageSize} /> : null}
              </div>
            </div>
          </div> */}
           <CustomTable headers={this.state.headers} data={this.state.hr} pageSize={this.state.pageSize} currentPage={this.state.currentPage} ></CustomTable> 

        </div>
      </main>
    );
  }
}