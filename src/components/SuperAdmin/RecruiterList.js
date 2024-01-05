import axios from 'axios';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authHeader, errorHandler } from '../../api/Api';
import { fallBackLoader } from '../../utils/CommonUtils';
import Pagination from '../../utils/Pagination';
import { CollegeTable } from './CollegeTable';
import '../../assests/css/AdminDashboard.css'

const RecruiterList = () => {
    const [loader, setLoader] = useState(true);
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
        getStatus();
        setLoader(true);
        setVerifiedStatus('');
        axios
            .get(`/api1/recruiter/getAllRecruitersBYFilter?page=${currentPage}&size=${pageSize}`, {
                headers: authHeader(),
            })
            .then((res) => {
                console.log(res);
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

    }, [currentPage, pageSize]);

    const getStatus = async () => {
        const verifiedResponse = await axios.get(`/api1/recruiter/verifiedcount`, { headers: authHeader() });
        if (verifiedResponse.data.response.length > 0) {
            _.map(verifiedResponse.data?.response || [], (data) => {
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

    const handleStatusFilters = async (event, key) => {
        if (event.target.value === 'ACTIVE' || event.target.value === 'INACTIVE') {
            await setStatusType(event.target.value);
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

    const headers = [
        'S.No',
        'Panelist Name',
        'Qualification',
        'Industry Type',
        'Experience',
        'Verification',
        'STATUS',
        'ACTION',
      ];

    return (
        <main className="main-content bcg-clr">
            <div>
                <div className="card-header-new">
                    <span>Panelists</span>
                    {/* <span style={{ paddingLeft: '800px' }}>Verified: {this.state.verified} </span>
          <span style={{ paddingLeft: '30px' }}>Not Verified: {this.state.notVerified} </span> */}
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <div className="table-border">
                        <div>
                            {fallBackLoader(loader)}
                            <div className="table-responsive pagination_table" style={{minHeight: '10rem'}}>
                                <table className="table table-striped" id="dataTable">
                                <CollegeTable headers={headers} body={recruiter} handleAllOptionClick={handleAllOptionClick} handleVerifiedFilters={handleVerifiedFilters} />
                                    {/* <thead className="table-dark">
                                        <tr>
                                            <th>S.NO</th>
                                            <th style={{ textAlign: 'left' }}>Panelist Name</th>
                                            <th style={{ textAlign: 'left' }}>Qualification</th>
                                            <th style={{ textAlign: 'left' }}>Industry Type</th>
                                            <th>Experience</th>
                                            <th><div className="row">
                                                <div className="col-sm-6">Verification</div>
                                                <div className="col-sm">
                                                    <div className="dropdown">
                                                        <div
                                                            className="dropdown-toggle"
                                                            type="button"
                                                            id="dropdownMenuButton"
                                                            data-toggle="dropdown"
                                                            aria-haspopup="true"
                                                            aria-expanded="false"
                                                        >
                                                            <i className="fa fa-filter" aria-hidden="true"></i>
                                                        </div>
                                                        <div
                                                            className="dropdown-menu"
                                                            aria-labelledby="dropdownMenuButton"
                                                        >
                                                            <option
                                                                className="dropdown-item"
                                                                onClick={(() =>
                                                                    handleAllOptionClick())
                                                                }
                                                                value="ALL"
                                                            >
                                                                All
                                                            </option>
                                                            <option
                                                                className="dropdown-item"
                                                                onClick={(e) =>
                                                                    handleVerifiedFilters(e, "verifiedStatus")
                                                                }
                                                                value="VERIFIED"
                                                            >
                                                                Verified
                                                            </option>
                                                            <option
                                                                className="dropdown-item"
                                                                onClick={(e) =>
                                                                    handleVerifiedFilters(e, "verifiedStatus")
                                                                }
                                                                value="NOTVERIFIED"
                                                            >
                                                                Not Verified
                                                            </option>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div></th>
                                            <th>
                                                <div className="row">
                                                    <div className="col-sm-6">STATUS</div>
                                                    <div className="col-sm">
                                                        <div className="dropdown">
                                                            <div
                                                                className="dropdown-toggle"
                                                                type="button"
                                                                id="dropdownMenuButton"
                                                                data-toggle="dropdown"
                                                                aria-haspopup="true"
                                                                aria-expanded="false"
                                                            >
                                                                <i className="fa fa-filter" aria-hidden="true"></i>
                                                            </div>
                                                            <div
                                                                className="dropdown-menu"
                                                                aria-labelledby="dropdownMenuButton"
                                                            >
                                                                <option
                                                                    className="dropdown-item"
                                                                    onClick={(e) =>
                                                                        handleStatusFilters(e, "statusType")
                                                                    }
                                                                    value="ACTIVE"
                                                                >
                                                                    Active
                                                                </option>
                                                                <option
                                                                    className="dropdown-item"
                                                                    onClick={(e) =>
                                                                        handleStatusFilters(e, "statusType")
                                                                    }
                                                                    value="INACTIVE"
                                                                >
                                                                    InActive
                                                                </option>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </th>
                                            <th>ACTION</th>
                                        </tr>
                                    </thead> */}
                                    {/* <tbody>
                                        {recruiter.length > 0 ? (
                                            recruiter.map((recruiter, index) => {
                                                return (
                                                    <tr>
                                                        <td>{pageSize * currentPage - (i--)}</td>
                                                        <td style={{ textAlign: 'left', textTransform: 'capitalize' }}>{recruiter.userName}</td>
                                                        <td>{recruiter.qualification}</td>
                                                        <td>{recruiter.industryType.name}</td>
                                                        <td>{recruiter.experience}</td>
                                                        <td style={{ textAlign: 'left' }} className={recruiter.verifiedStatus === "VERIFIED" ? "text text-success" : "text text-danger"}>{recruiter.verifiedStatus === "NOTVERIFIED" ? "NOT VERIFIED" : "VERIFIED"}</td>
                                                        <td style={{ textAlign: 'left' }} className={recruiter.status === 'INACTIVE' ? 'text-danger' : 'text-success'}>{recruiter.status}</td>
                                                        <td>
                                                            <Link className="collapse-item" to={{ pathname: '/panelists/verify', state: { recruiter: recruiter, action: 'Update' } }}><i className="fa fa-pencil" aria-hidden="true"></i></Link>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr className="text-center">
                                                <td colspan="8">No data available in table</td>
                                            </tr>
                                        )}
                                    </tbody> */}
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
        </main>

    );
}
export default RecruiterList;