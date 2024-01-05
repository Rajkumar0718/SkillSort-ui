import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authHeader, errorHandler } from '../../api/Api';
import Search from '../../common/AdvanceSearch';
import { fallBackLoader } from '../../utils/CommonUtils';
import Pagination from '../../utils/Pagination';
import { isRoleValidation } from '../../utils/Validation';
import { url } from '../../utils/UrlConstant';


const ProcessAdminList = () => {
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
    }, [currentPage, pageSize, searchKey, searchValue]);


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

    const onNextPage = () => {
        getProcessAdmin();
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

    const getProcessAdminList = () => {
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


    const handleStatusFilter = (event) => {
        setSearchKey(event.target.value);
    };

    const onSearch = (searchValue) => {
        setSearchValue(searchValue);
    };

    const headers=['S.No','Name','Email','Phone','STATUS'];
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
                                    <table className="table table-striped" id="dataTable" style={{ textAlign: 'center' }}>
                                        {/* <thead className="table-dark" style={{ textAlign: 'center' }}>
                                            <tr>
                                                <th>S.No</th>
                                                <th style={{ textAlign: 'left' }}>Name</th>
                                                <th style={{ textAlign: 'left' }}>Email</th>
                                                <th style={{ textAlign: 'left' }}>Phone</th>
                                                {role === 'PROCESS_ADMIN' ? '' :
                                                    <th>

                                                        <div className="dropdown" style={{ marginLeft: '10px' }}>
                                                            <div
                                                                type="button"
                                                                id="dropdownMenuButton"
                                                                data-toggle="dropdown"
                                                                aria-haspopup="true"
                                                                aria-expanded="false"
                                                            ><span>STATUS </span>
                                                                <i className="fa fa-filter" aria-hidden="true"></i>
                                                            </div>
                                                            <div
                                                                className="dropdown-menu"
                                                                aria-labelledby="dropdownMenuButton"
                                                            >
                                                                <option
                                                                    className="dropdown-item"
                                                                    onClick={(e) =>
                                                                        handleStatusFilter(e, "status")
                                                                    }
                                                                    value="ACTIVE"
                                                                >
                                                                    Active
                                                                </option>
                                                                <option
                                                                    className="dropdown-item"
                                                                    onClick={(e) =>
                                                                        handleStatusFilter(e, "status")
                                                                    }
                                                                    value="INACTIVE"
                                                                >
                                                                    InActive
                                                                </option>
                                                            </div>
                                                        </div>
                                                    </th>}
                                                <th>ACTION</th>
                                            </tr>
                                        </thead> */}
                                        <tbody style={{ textAlign: 'center' }}>
                                            {processAdmin?.length > 0 ? (
                                                (processAdmin || []).map((processAdmin, index) => {
                                                    return (
                                                        <tr>    
                                                            <td>{index + 1}</td>
                                                            <td style={{ textAlign: 'left', textTransform: 'capitalize' }}>{processAdmin.userName}</td>
                                                            <td style={{ textAlign: 'left' }}> {processAdmin.email}</td>
                                                            <td style={{ textAlign: 'left' }}>{processAdmin.phone}</td>
                                                            <td className={processAdmin.status === 'INACTIVE' ? 'text-danger' : 'text-success'}>{processAdmin.status}</td>
                                                            <td>
                                                                <Link className="collapse-item" to={{ pathname: '/skillsortadmin/edit', state: { processAdmin: processAdmin, action: 'Update' } }}>
                                                                    <i className="fa fa-pencil" aria-hidden="true" ></i>
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr className="text-center">
                                                    <td colspan="8">No data available in table</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
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