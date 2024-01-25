import React, { useState, useEffect } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { authHeader, errorHandler } from '../../api/Api';
import Search from '../../common/AdvanceSearch';
import { fallBackLoader } from '../../utils/CommonUtils';
import { url } from '../../utils/UrlConstant';
import { isRoleValidation } from '../../utils/Validation';
import TableHeader from '../../utils/TableHeader';
import Pagination from '../../utils/Pagination';
import '../../assests/css/AdminDashboard.css'
import '../../common/Common.css';
import { CustomTable } from '../../utils/CustomTable';
import { MenuItem } from "@mui/material";


const CollegeList = () => {
  const [college, setCollege] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [searchKey] = useState('ACTIVE');
  const [loader, setLoader] = useState(false);
  const role = isRoleValidation();
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [numberOfElements, setNumberOfElements] = useState(0);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(5);

  useEffect(() => {
    getCollegeSerachList();
  }, [currentPage, pageSize]);

  const handlerStatusFilter = (event) => {
    axios.get(`${url.COLLEGE_API}/college/list?status=${event || searchKey}`, { headers: authHeader() })
      .then(res => {
        setCollege(res?.data?.response);
        console.log(res)
      }).catch(err => {
        errorHandler(err);
      });
  };

  const getCollegeSerachList = () => {
    setTableJson();
    axios.get(`${url.COLLEGE_API}/college/collegeList?status=${searchKey}&search=${searchValue}&page=${currentPage}&size=${pageSize}`, { headers: authHeader() })
      .then(res => {
        setCollege(res.data.response.content);
        setLoader(false);
        setTotalPages(res.data.response.totalPages);
        setTotalElements(res.data.response.totalElements);
        setNumberOfElements(res.data.response.numberOfElements);
      })
      .catch(err => {
        errorHandler(err);
      });
  };

  const onSearch = (searchValue) => {
    setSearchValue(searchValue);
    setPageSize(10);
    setCurrentPage(1);
    getCollegeSerachList();

  };

  const onNextPage = () => {
    setLoader(true);
    getCollegeSerachList();
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

  let i = pageSize - 1;

  const setTableJson = () => {
    const newHeaders = [
      {
        name: 'S.NO',
        align: 'center',
        key: 'S.NO',
      },
      {
        name: 'COLLEGE NAME',
        align: 'left',
        key: 'collegeName',
      },
      {
        name: 'STATE',
        align: 'left',
        key: 'state',
      },
      {
        name: 'DISTRICT',
        align: 'left',
        key: 'district',
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
                onClick={() => handlerStatusFilter(opt.value)}
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
            <Link className='collapse-item' to='/collegeadmin/edit' state = {{ college: params, action: 'Update'}} >
              <i
                className='fa fa-pencil'
                style={{ cursor: 'pointer', color: '#3B489E' }}
                aria-hidden='true'
              ></i>
            </Link>
          );
        },
      },
    ];
    setHeaders(newHeaders);
  };

  return (
    <main className="main-content bcg-clr">
      <div>
        <TableHeader
          title="Colleges"
          link="/collegeadmin/add"
          buttonName="Add College"
          showLink={true}
        />
        <Search
          title="Filter"
          showSearch={true}
          placeholder="Search By CollegeName,State,District "
          onSearch={onSearch}
        ></Search>
        <div className="row">
          <div className="col-md-12">
            <div className="table-border">
              <div>
                {fallBackLoader(loader)}
                <div className="table-responsive pagination_table">
                  <CustomTable headers={headers} data={college} pageSize={pageSize} currentPage={currentPage} link={"/skillsortadmin"} ></CustomTable>

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
};
export default CollegeList;
