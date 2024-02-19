import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { authHeader, errorHandler } from "../../api/Api";
import Search from "../../common/AdvanceSearch";
import { fallBackLoader } from "../../utils/CommonUtils";
import Pagination from "../../utils/Pagination";
import { isRoleValidation } from "../../utils/Validation";
import url from "../../utils/UrlConstant";
import { MenuItem } from '@mui/material';
import _ from 'lodash';
import { CustomTable } from "../../utils/CustomTable";


const TestAdminList = () => {
  const [testAdmin, setTestAdmin] = useState([]);
  const [searchKey, setSearchKey] = useState("ACTIVE");
  const [loader, setLoader] = useState(false);
  const [role, setRole] = useState(isRoleValidation());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [numberOfElements, setNumberOfElements] = useState(0);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(5);
  const [searchValue, setSearchValue] = useState("");
  const [headers, setHeaders] = useState([]);


  useEffect(() => {
    getTestAdmins();
  }, [searchKey, currentPage, pageSize]);


  useEffect(() =>{
    setTableJson();
  },[])

  const getTestAdmins = () => {
    setTableJson();
    axios
      .get(
        ` ${url.ADMIN_API}/testadmin/list?status=${searchKey}&page=${currentPage}&size=${pageSize}`,
        { headers: authHeader() }
      )
      .then((res) => {
        setTestAdmin(res.data.response.content);
        setTotalPages(res.data.response.totalPages);
        setTotalElements(res.data.response.totalElements);
        setNumberOfElements(res.data.response.numberOfElements);
      })
      .catch((error) => {
        errorHandler(error);
      });
  };

  const getTestAdminList = (searchValue) => {
    setSearchValue(searchValue)
    axios
      .get(
        ` ${url.ADMIN_API}/testadmin/testAdminList?status=${searchKey}&page=${currentPage}&size=${pageSize}&search=${searchValue}`,
        { headers: authHeader() }
      )
      .then((res) => {
        setTestAdmin(res.data.response.content);
        setTotalPages(res.data.response.totalPages);
        setTotalElements(res.data.response.totalElements);
        setNumberOfElements(res.data.response.numberOfElements);
      })
      .catch((error) => {
        errorHandler(error);
      });
  };

  const onNextPage = () => {
    getTestAdmins();
  };

  const onPagination = (pageSize, currentPage) => {
    setPageSize(pageSize);
    setCurrentPage(currentPage);
    onNextPage();
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
    setSearchKey(value);
  };

  const setTableJson = () => {
    const newHeaders = [
      {
        name: 'S.NO',
        align: 'center',
        key: 'S.NO'
      },
      {
        name: 'Name',
        align: 'left',
        renderCell:(param) => {
          return <span style={{textTransform: 'capitalize'}}>{param.firstName + " " + param.lastName}</span>
        },
    },
      {
        name: 'EMAIL',
        align: 'left',
        key: 'email',
      },
      {
        name: 'PHONE',
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
            state={{ testAdmin: params, action: 'Update' }}
            to='/skillsortadmin/testadmin/edit'
          >
            <i className="fa fa-pencil" aria-hidden="true"></i>
          </Link>
        ),
      },
    ];

    setHeaders(newHeaders);
  };


  return (
    <main className="main-content bcg-clr">
      <div>
        <div className="card-header-new">
          <span>Test Admins</span>
          <button type="button" className="btn btn-sm btn-nxt header-button">
            <Link
              style={{ textDecoration: "none", color: "white" }}
              to='/skillsortadmin/testadmin/add'
            >
              Add Test Admin
            </Link>
          </button>
        </div>
        <Search
          title="Filter"
          showSearch={true}
          placeholder="Search By Name,Email,Phone "
          onSearch={getTestAdminList}
        ></Search>
        <div className="row">
          <div className="col-md-12">
            <div className="table-border">
              <div>
                {fallBackLoader(loader)}
                <div className="table-responsive pagination_table">
                  <CustomTable data={testAdmin}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default TestAdminList;
