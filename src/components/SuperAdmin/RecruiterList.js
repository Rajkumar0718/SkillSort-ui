import axios from 'axios';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authHeader, errorHandler } from '../../api/Api';
import { fallBackLoader } from '../../utils/CommonUtils';
import Pagination from '../../utils/Pagination';
import { MenuItem } from "@mui/material";
import '../../assests/css/AdminDashboard.css'
import { CustomTable } from '../../utils/CustomTable';

const RecruiterList = () => {
    const [loader, setLoader] = useState(true);
    const [headers, setHeaders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [openModal, setOpenModal] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [numberOfElements, setNumberOfElements] = useState(0);
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(5);
    const [statusType, setStatusType] = useState('ACTIVE');
    const [verifiedStatus, setVerifiedStatus] = useState('');
    const [verified, setVerified] = useState(0);
    const [notVerified, setNotVerified] = useState(0);
    const [recruiter, setRecruiter] = useState({});

    const handleAllOptionClick = () => {
        setLoader(true);
        setVerifiedStatus('');
        setTableJson();
        axios
            .get(`/api1/recruiter/getAllRecruitersBYFilter?page=${currentPage}&size=${pageSize}`, {
                headers: authHeader(),
            })
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

    useEffect(() => {
        handleAllOptionClick();
        getStatus();
    }, [currentPage, pageSize]);

    const getStatus = () => {
        axios.get(`/api1/recruiter/verifiedcount`, { headers: authHeader() }).then(res => {
            if (res.data.response.length > 0) {
                _.map(res.data?.response || [], data => {
                    if (data.verifiedStatus === 'VERIFIED') {
                        setVerified(data.count)
                        setNotVerified(0)
                    } else {
                        setNotVerified(data.count)
                    }
                })
            } else {
                setVerified(0)
                setNotVerified(0)
            }
        }).catch(error => {

        })
    }

    const handleVerifiedFilters = async (event, key) => {
        console.log(event, "event", key, "key")
        if (event.target.value === 'VERIFIED') {
            await setVerifiedStatus(event.target.value);
            await setCurrentPage('1');
        } else if (event.target.value === 'NOTVERIFIED') {
            await setVerifiedStatus(event.target.value);
            await setCurrentPage('1');
        }
        handleVerifiedFilter();
    };

    const handleVerifiedFilter = () => {
        axios
            .get(`/api1/recruiter/verificationState?verifiedStatus=${verifiedStatus}&page=${currentPage}&size=${pageSize}`, {
                headers: authHeader(),
            })
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

    const handleStatusFilters = async (value) => {
        if (value === 'ACTIVE' || value === 'INACTIVE') {
            await setStatusType(value);
            setCurrentPage('1');
            handleStatusFilter();
        }
    };
    const handleStatusFilter = () => {
        axios
            .get(`/api1/recruiter/list?statusType=${statusType}&page=${currentPage}&size=${pageSize}`, { headers: authHeader() })
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
            })
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
        axios
            .get(
                `/api1/recruiter/list?verifiedStatus=${verifiedStatus}&statusType=${statusType}&page=${currentPage}&size=${pageSize}`,
                { headers: authHeader() }
            )
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

    let i = pageSize - 1;

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
                key: 'panelistName',
            },
            {
                name: 'QUALIFICATION',
                align: 'left',
                key: 'qualification',
            },

            {
                name: 'INDUSTRY TYPE',
                align: 'left',
                key: 'industryType',
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
                key: 'verification',

                renderOptions: () => {
                    return _.map(
                        [
                            { name: 'ALL', value: 'ALL' },
                            { name: 'VERIFIED', value: 'VERIFIED' },
                            { name: 'NOT VERIFIED', value: 'NOT VERIFIED' },
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
                name: 'Action',
                key: 'action',
                renderCell: (params) => {
                    return (
                        <Link
                            className='collapse-item'
                            to='/panelists' state={{ position: params }}

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
                            <div className="table-responsive pagination_table" style={{ minHeight: '10rem' }}>
                                <CustomTable headers={headers} data={recruiter} handleAllOptionClick={handleAllOptionClick} handleVerifiedFilters={handleVerifiedFilters}></CustomTable>
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
}
export default RecruiterList;