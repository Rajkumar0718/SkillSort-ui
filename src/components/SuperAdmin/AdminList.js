import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { MenuItem } from '@mui/material';
import TableHeader from '../../utils/TableHeader';
import AdvSearch from '../../common/Search';
import { CustomTable } from '../../utils/CustomTable';
import Pagination from '../../utils/Pagination';
import { authHeader, errorHandler } from '../../api/Api';
import url from '../../utils/UrlConstant';

const AdminList = () => {
  const [adminData, setAdminData] = useState([]);
  const [status, setStatus] = useState('ACTIVE');
  const [searchValue, setSearchValue] = useState('');
  const [loader, setLoader] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [numberOfElements, setNumberOfElements] = useState(0);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(5);
  const [tableHeaders, setTableHeaders] = useState([]);

  useEffect(() => {
    setLoader(true)
    getAllAdmins();
    getAdminSearchList();
  }, [currentPage, pageSize, status,searchValue]);

  useEffect(() =>{
    setTableJson();
  },[])
  const getAllAdmins = () => {
    axios.get(`${url.ADMIN_API}/admin/list?page=${currentPage}&size=${pageSize}&status=${status}`, { headers: authHeader() })
      .then(res => {
        setAdminData(res.data.response.content);
        setLoader(false);
        setTotalPages(res.data.response.totalPages);
        setTotalElements(res.data.response.totalElements);
        setNumberOfElements(res.data.response.numberOfElements);
      })
      .catch(error => {
        errorHandler(error);
        setLoader(false);
      });
  };

  const getAdminSearchList = () => {
    axios.get(`${url.ADMIN_API}/admin/companyAdminlist?status=${status}&search=${searchValue}&size=${pageSize}&page=${currentPage}`, { headers: authHeader() })
      .then(res => {
        setAdminData(res.data.response.content);
        setTotalPages(res.data.response.totalPages);
        setTotalElements(res.data.response.totalElements);
        setNumberOfElements(res.data.response.numberOfElements);
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        errorHandler(err);
      });
  };

  const handleStatusFilters = (value) => {
    setStatus(value);
    setCurrentPage(1);
  };

  const setTableJson = () => {
    const headers = [
      {
        name: "S.NO",
        align: "center",
        key: "S.NO",
      },
      {
        name: "Admin Name",
        align: "left",
        key: "userName",
      },
      {
        name: "Company Name",
        align: "left",
        key: "company.name",
      },
      {
        name: "Email",
        align: "left",
        key: "email",
      },
      {
        name: "PhoneNumber",
        align: "left",
        key: "phone",
      },
      {
        name: "STATUS",
        align: "left",
        isFilter: true,
        key: "status",
        renderOptions: () => {
          return _.map(
            [
              { name: "Active", value: "ACTIVE" },
              { name: "InActive", value: "INACTIVE" },
            ],
            (opt) => (
              <MenuItem
                onClick={() => handleStatusFilters(opt.value)}
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
        name: "Action",
        key: "action",
        renderCell: (params) => (
          <Link
            className="collapse-item"
            to="/companyadmin/admin/edit"
            state= {{ Admin: params }}
          >
            <i
              className="fa fa-pencil"
              style={{ cursor: "pointer", color: "#3B489E" }}
              aria-hidden="true"
            ></i>
          </Link>
        ),
      },
    ];
  
    setTableHeaders(headers);
  };

  const onPagination = (pageSize, currentPage) => {
    setPageSize(pageSize);
    setCurrentPage(currentPage);
  };

  const onSearch = (searchValue) => {
    setSearchValue(searchValue);
    setCurrentPage(1);
  };

  return (
    <div>
      <TableHeader title="Admins" buttonName={'Add Admin'} link="/companyadmin/admin/add" showLink={true} />
      <AdvSearch title="Filter" showSearch={true} placeholder="Search By Name,CompanyName,Email,Phone" onSearch={onSearch} />
      <CustomTable data={adminData} headers={tableHeaders} loader={loader} pageSize={pageSize} currentPage={currentPage} />
      {numberOfElements === 0 ? "" : (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPagination={onPagination}
          numberOfElements={numberOfElements}
          totalElements={totalElements}
          pageSize={pageSize}
        />
      )}
    </div>
  );
};

export default AdminList;