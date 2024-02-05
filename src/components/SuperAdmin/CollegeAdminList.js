import React, { useState, useEffect } from "react";
import { MenuItem } from '@mui/material';
import axios from 'axios';
import _ from 'lodash';
import { Link } from "react-router-dom";
import { authHeader, errorHandler } from '../../api/Api';
import AdvSearch from '../../common/Search';
import { CustomTable } from '../../utils/CustomTable';
import Pagination from '../../utils/Pagination';
import TableHeader from '../../utils/TableHeader';
import url from '../../utils/UrlConstant';
import { isRoleValidation } from '../../utils/Validation';


const CollegeAdminList = () => {
  const [collegeAdmin, setCollegeAdmin] = useState([]);
  const [status, setStatus] = useState('ACTIVE');
  const [loader, setLoader] = useState(true);
  const [role, setRole] = useState(isRoleValidation());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [numberOfElements, setNumberOfElements] = useState(0);
  const [countError, setCountError] = useState(0);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(5);
  const [searchValue, setSearchValue] = useState('');
  const [headers, setHeaders] = useState([]);


  useEffect(() => {
    getCollegeAdmin();
  }, [currentPage, pageSize, status, searchValue]);

  const getCollegeAdmin = () => {
    setTableJson();
    axios.get(`${url.COLLEGE_API}/admin/list?status=${status}&page=${currentPage}&size=${pageSize}`, { headers: authHeader() })
      .then(res => {
        setCollegeAdmin(res.data.response.content);
        setLoader(false);
        setTotalPages(res.data.response.totalPages);
        setTotalElements(res.data.response.totalElements);
        setNumberOfElements(res.data.response.numberOfElements);
      })
      .catch(error => {
        setLoader(false);
        errorHandler(error);
      })
  };

  const setTableJson = () => {
    const newHeaders = [
      {
        name: 'S.NO',
        align: 'center',
        key: 'S.NO',
      },
      {
        name: 'Name',
        align: 'left',
        key: 'name',
      },
      {
        name: 'college name',
        align: 'left',
        key: 'college.collegeName',
      },
      {
        name: 'email',
        align: 'left',
        key: 'email',
      },
      {
        name: 'phone',
        key: 'phone',
        align: 'left',
      },
      {
        name: 'STATUS',
        key: 'status',
        isFilter: true,
        renderOptions: () => {
          return _.map(
            [
              { name: 'Active', value: 'ACTIVE' },
              { name: 'InActive', value: 'INACTIVE' },
            ],
            (opt) => (
              <MenuItem
                onClick={() => handleStatusFilter(opt.value)}
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
        name: 'action',
        key: 'action',
        renderCell: (params) => (
          <Link
            className="collapse-item"
            state={{ collegeAdmin: params, action: 'Update' }}
            to='/collegeadmin/admin/edit'
          >
            <i className="fa fa-pencil" aria-hidden="true"></i>
          </Link>
        ),
      },
    ];

    setHeaders(newHeaders);
  };

  const onPagination = (newPageSize, newCurrentPage) => {
    setPageSize(newPageSize);
    setCurrentPage(newCurrentPage);
  };

  const increment = () => {
    setStartPage(startPage + 5);
    setEndPage(endPage + 5);
  };

  const decrement = () => {
    setStartPage(startPage - 5);
    setEndPage(endPage - 5);
  };

  const handleStatusFilter = (value) => {
    setStatus(value);
  };

  const onSearch = (value) => {
    setSearchValue(value);
    setPageSize(10);
    setCurrentPage(1);
    getCollegeAdminList()
  };

  const getCollegeAdminList = () => {
    axios.get(`${url.COLLEGE_API}/admin/collegeAdminList?status=${status}&page=${currentPage}&size=${pageSize}&search=${searchValue}`, { headers: authHeader() })
      .then(res => {
        setCollegeAdmin(res.data.response.content);
        setLoader(false);
        setTotalPages(res.data.response.totalPages);
        setTotalElements(res.data.response.totalElements);
        setNumberOfElements(res.data.response.numberOfElements);
        setTableJson();
      })
      .catch(error => {
        setLoader(false);
        errorHandler(error);
      });
  };

  return (
    <main className="main-content bcg-clr">
      <div>
        <TableHeader
          title="College Admins"
          link="/collegeadmin/admin/add"
          buttonName="Add College Admin"
          showLink={true}
        />
        <AdvSearch
          title="Filter"
          showSearch={true}
          placeholder="Search by Name,CollegeName,Email,PhoneNumber "
          onSearch={onSearch}
        ></AdvSearch>
        <CustomTable data={collegeAdmin}
          headers={headers}
          loader={loader}
          pageSize={pageSize}
          currentPage={currentPage}
        />
        {numberOfElements === 0 ? '' :
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPagination={onPagination}
            increment={increment}
            decrement={decrement}
            startPage={startPage}
            numberOfElements={numberOfElements}
            endPage={endPage}
            totalElements={totalElements}
            pageSize={pageSize}

          />}
      </div>
    </main>

  )

}

export default CollegeAdminList;