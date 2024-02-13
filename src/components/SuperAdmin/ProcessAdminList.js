import axios from 'axios';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authHeader, errorHandler } from '../../api/Api';
import Search from '../../common/AdvanceSearch';
import { fallBackLoader } from '../../utils/CommonUtils';
import Pagination from '../../utils/Pagination';
import { isRoleValidation } from '../../utils/Validation';
import url from '../../utils/UrlConstant';
import { CustomTable } from '../../utils/CustomTable';
import { MenuItem } from "@mui/material";



const ProcessAdminList = () => {
    const [headers, setHeaders] = useState([]);
    const [processAdmin, setProcessAdmin] = useState([]);
    const [searchKey, setSearchKey] = useState('ACTIVE');
    const [loader, setLoader] = useState(false);
    const role = isRoleValidation();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [numberOfElements, setNumberOfElements] = useState(0);
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(5);
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        getProcessAdmin();
    }, [currentPage, pageSize, searchKey]);

    useEffect(() =>{  
        setTableJson();
    },[])

    const getProcessAdmin = () => {
        axios
            .get(`${url.ADMIN_API}/process/list?status=${searchKey}&page=${currentPage}&size=${pageSize}`, {
                headers: authHeader(),
            })
            .then((res) => {
                setProcessAdmin(res.data.response.content);
                setTotalPages(res.data.response.totalPages);
                setTotalElements(res.data.response.totalElements);
                setNumberOfElements(res.data.response.numberOfElements);
            })
            .catch((error) => {
                errorHandler(error);
            });
    };


    const onPagination = (pageSize, currentPage) => {
        setPageSize(pageSize);
        setCurrentPage(currentPage);
    };

    const increment = () => {
        setStartPage(startPage + 5);
        setEndPage(endPage + 5);
    };

    const decrement = () => {
        setStartPage(startPage - 5);
        setEndPage(endPage - 5);
    };

    const getProcessAdminList = (searchValue) => {
        axios
            .get(`${url.ADMIN_API}/process/processList?status=${searchKey}&search=${searchValue}&page=${currentPage}&size=${pageSize}`, {
                headers: authHeader(),
            })
            .then((res) => {
                setProcessAdmin(res.data.response.content);
                setTotalPages(res.data.response.totalPages);
                setTotalElements(res.data.response.totalElements);
                setNumberOfElements(res.data.response.numberOfElements);
            });
    };


    const handleStatusFilter = (value) => {
        setSearchKey(value);
    };

    const onSearch = (searchValue) => {
        setSearchValue(searchValue);
        getProcessAdminList(searchValue);

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
                key: 'userName',
            },
            {
                name: 'EMAIL',
                align: 'left',
                key: 'email',
            },
            {
                name: 'PHONE',
                align: 'left',
                key: 'phone',
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
                name: 'Action',
                key: 'action',
                renderCell: (params) => {
                    return (
                        <Link className='collapse-item' to='/skillsortadmin/edit' state={{ processAdmin: params, action: 'Update' }} >
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
                <div className="card-header-new">
                    <span>Process Admins</span>
                    <button type="button" className="btn btn-sm btn-nxt header-button">
                        <Link
                            style={{ textDecoration: "none", color: "white" }}
                            to='/skillsortadmin/add'
                        >
                            Add Process Admin
                        </Link>

                    </button>
                    
                </div>
                <Search
                    title="Filter"
                    showSearch={true}
                    placeholder="Search By Name,Email,Phone "
                    onSearch={onSearch}
                ></Search>
                <div className="row">
                    <div className="col-md-12">
                        <div className="table-border">
                            <div>
                                {fallBackLoader(loader)}
                                <div className="table-responsive pagination_table">
                                    <CustomTable headers={headers} data={processAdmin} pageSize={pageSize} currentPage={currentPage} link={"/collegeadmin/edit"}></CustomTable>
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
export default ProcessAdminList;