import axios from 'axios';
import _ from 'lodash';
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { authHeader, errorHandler } from '../../api/Api';
import Search from '../../common/AdvanceSearch';
import { fallBackLoader } from '../../utils/CommonUtils';
import Pagination from '../../utils/Pagination';
import TableHeader from '../../utils/TableHeader';
import { CustomTable } from '../../utils/CustomTable';
import { MenuItem } from '@mui/material';
import url from '../../utils/UrlConstant';

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
          <Search
            title="Filter"
            showSearch={true}
            placeholder="search Hr by name, email, phone"
            onSearch={this.onSearch}
          ></Search>
           <CustomTable headers={this.state.headers} data={this.state.hr} pageSize={this.state.pageSize} currentPage={this.state.currentPage} style ={{width:'97%' , marginLeft:'18px'}}></CustomTable>
           {this.state.numberOfElements ? <Pagination totalPages={this.state.totalPages} currentPage={this.state.currentPage}
                  onPagination={this.onPagination} increment={this.increment} decrement={this.decrement} startPage={this.state.startPage}
                  numberOfElements={this.state.numberOfElements} endPage={this.state.endPage} totalElements={this.state.totalElements}
                  pageSize={this.state.pageSize} /> : null}
        </div>
      </main>
    );
  }
}
