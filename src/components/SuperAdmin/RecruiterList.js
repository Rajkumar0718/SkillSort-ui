import axios from 'axios';
import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { authHeader, errorHandler } from '../../api/Api';
import { fallBackLoader } from '../../utils/CommonUtils';
import Pagination from '../../utils/Pagination';
import { MenuItem } from "@mui/material";
import { CustomTable } from '../../utils/CustomTable';

const RecruiterList = () => {
    const [loader, setLoader] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [numberOfElements, setNumberOfElements] = useState(0);
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(5);
    const [statusType, setStatusType] = useState('ACTIVE');
    const [verifiedStatus, setVerifiedStatus] = useState('');
    const [headers, setHeaders] = useState([]);
    const [verified, setVerified] = useState(0);
    const [notVerified, setNotVerified] = useState(0);
    const [recruiter, setRecruiter] = useState({});

    useEffect(() => {
        getStatus();
        setLoader(true);
        setVerifiedStatus('');
        getVerified();

    }, [currentPage, pageSize]);

    useEffect(() => {
        setTableJson();
    }, []);

    const getVerified = () => {
        axios.get(`/api1/recruiter/getAllRecruitersBYFilter?page=${currentPage}&size=${pageSize}`, { headers: authHeader() })
            .then((res) => {
                setRecruiter(res.data.response.content);
                setLoader(false);
                setTotalPages(res.data.response.totalPages);
                setTotalElements(res.data.response.totalElements);
                setNumberOfElements(res.data.response.numberOfElements);
            })
            .catch((error) => {
                setLoader(false);
                errorHandler(error);
            });
    }
    const getStatus = async () => {
        try {
            const response = await axios.get(`/api1/recruiter/verifiedcount`, { headers: authHeader() });
            if (response.data.response.length > 0) {
                _.map(response.data?.response || [], data => {
                    if (data.verifiedStatus === 'VERIFIED') {
                        setVerified(data.count);
                        setNotVerified(0);
                    } else {
                        setNotVerified(data.count);
                    }
                });
            } else {
                setVerified(0);
                setNotVerified(0);
            }
        } catch (error) {
            console.error('Error getting status:', error);
        }
    };

    const handleVerifiedFilters = (value) => {
        if (value === "ALL") {
            getVerified()
            setCurrentPage(1);
            return
        }
        else if (value === "VERIFIED") {
            setVerifiedStatus(value);
            setCurrentPage(1);
        } else if (value === "NOTVERIFIED") {
            setVerifiedStatus(value);
            setCurrentPage(1);
        }
        handleVerifiedFilter(value);
    };

    const handleVerifiedFilter = (value) => {
        axios.get(`/api1/recruiter/verificationState?verifiedStatus=${value}&page=${currentPage}&size=${pageSize}`, { headers: authHeader() })
            .then((res) => {
                setRecruiter(res.data.response.content);
                setLoader(false);
                setTotalPages(res.data.response.totalPages);
                setTotalElements(res.data.response.totalElements);
                setNumberOfElements(res.data.response.numberOfElements);
            })
            .catch((error) => {
                setLoader(false);
                errorHandler(error);
            });
    };

    const handleStatusFilters =  (value) => {
        if (value === "ACTIVE") {
             setStatusType(value);
             setCurrentPage(1);
        } else {
             setStatusType(value);
             setCurrentPage(1);
        }
        handleStatusFilter(value);
    };

    const handleStatusFilter = (value) => {
        axios.get(`/api1/recruiter/list?statusType=${value}&page=${currentPage}&size=${pageSize}`, { headers: authHeader() })
            .then(res => {
                setLoader(false);
                setRecruiter(res.data.response.content);
                setTotalPages(res.data.response.totalPages);
                setTotalElements(res.data.response.totalElements);
                setNumberOfElements(res.data.response.numberOfElements);
            })
            .catch(error => {
                setLoader(false);
                errorHandler(error);
            });
    };

    const increment = (event) => {
        setStartPage(startPage + 5);
        setEndPage(endPage + 5);
    };

    const decrement = (event) => {
        setStartPage(startPage - 5);
        setEndPage(endPage - 5);
    };

    const onNextPage = () => {
        axios.get(`/api1/recruiter/list?verifiedStatus=${verifiedStatus}&statusType=${statusType}&page=${currentPage}&size=${pageSize}`, { headers: authHeader() })
            .then((res) => {
                setLoader(false);
                setRecruiter(res.data.response.content);
                setTotalPages(res.data.response.totalPages);
                setTotalElements(res.data.response.totalElements);
                setNumberOfElements(res.data.response.numberOfElements);
            })
            .catch((error) => {
                setLoader(false);
                errorHandler(error);
            });
    };

    const onPagination = (pageSize, currentPage) => {
        setPageSize(pageSize);
        setCurrentPage(currentPage);
        onNextPage();
    };


    const setTableJson = () => {
        const newheaders = [
            {
                name: 'S.No',
                align: 'center',
                key: 'S.NO',
            },
            {
                name: 'PANELIST NAME',
                align: 'left',
                key: 'userName',
            },
            {
                name: 'QUALIFICATION',
                align: 'left',
                key: 'qualification',
            },
            {
                name: 'INDUSTRY TYPE',
                align: 'left',
                renderCell: (params) => {
                    return params.industryType?.name
                }
            },
            {
                name: 'EXPERIENCE',
                align: 'left',
                key: 'experience',
            },
            {
                name: 'VERIFICATION',
                align: 'left',
                isFilter: true,
                renderOptions: () => {
                    return _.map(
                        [
                            { name: 'ALL', value: 'ALL' },
                            { name: 'VERIFIED', value: 'VERIFIED' },
                            { name: 'NOT VERIFIED', value: 'NOTVERIFIED' },
                        ],
                        (opt) => (
                            <MenuItem
                                onClick={() => handleVerifiedFilters(opt.value)}
                                key={opt.value}
                                value={opt.value}
                            >
                                {opt.name}
                            </MenuItem>
                        )
                    );
                },
                renderCell: (params) => {
                    return <span style={{color:params.verifiedStatus=== 'VERIFIED'? 'green' :'red'}}>{params.verifiedStatus}</span>
                }
            },
            {
                name: 'STATUS',
                align: 'center',
                isFilter: true,
                renderOptions: () => {
                    return _.map(
                        [
                            { name: 'Active', value: 'ACTIVE' },
                            { name: 'InActive', value: 'INACTIVE' },
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
                renderCell: (params) => {
                    return <span style={{color:params.status=== 'ACTIVE'? 'green' :'red'}}>{params.status}</span>
    
                }
            },
            {
                name: 'Action',
                key: 'action',
                renderCell: (params) => {
                    return (
                        <Link
                            className='collapse-item'
                            to='/panelists/verify'
                            state={{ recruiter: params, action: 'Update' }}
                        >
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

        setHeaders(newheaders);
    };

    return (
        <main className="main-content bcg-clr">
            <div>
                <div className="card-header-new">
                    <span>Panelists</span>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <div className="table-border">
                        <div>
                            {fallBackLoader(loader)}
                            <div className="table-responsive pagination_table">
                                <CustomTable headers={headers} data={recruiter} pageSize={pageSize} currentPage={currentPage}></CustomTable>
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
        </main>
    );
};

export default RecruiterList;
