import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authHeader, errorHandler } from '../../api/Api';
import Search from '../../common/AdvanceSearch';
import { ToggleStatus, fallBackLoader } from '../../utils/CommonUtils';
import { url } from '../../utils/UrlConstant';
import { isRoleValidation } from '../../utils/Validation';
import TableHeader from '../../utils/TableHeader';
import Pagination from '../../utils/Pagination';
import _ from 'lodash';
import { CollegeTable } from './CollegeTable';

const CompanyList = () => {
    const [company, setCompany] = useState([]);
    const [searchKey, setSearchKey] = useState('ACTIVE');
    const [loader, setLoader] = useState(false);
    const [role, setRole] = useState(isRoleValidation());
    // const [role, setRole] = useState("PROCESS_ADMIN");
    const [searchValue, setSearchValue] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [numberOfElements, setNumberOfElements] = useState(0);
    const [status, setStatus] = useState('ACTIVE');
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(5);
    const [name, setName] = useState('');
    const [isTrialCompany, setIsTrialCompany] = useState(false);
    const [history, setHistory] = ('');

    useEffect(() => {
        initialCall();

    }, []);

    const initialCall = () => {
        getAllCompanyList();
        console.log("companyyyyyyyyyyy" +company)
    };


    const getAllCompanyList = () => {
        let user = JSON.parse(localStorage.getItem('user'));
        if (role !== 'PROCESS_ADMIN') {
            axios
                .get(`${url.ADMIN_API}/company/list?status=${status}&page=${currentPage}&size=${pageSize}&trialCompany=${isTrialCompany}`, {
                    headers: authHeader(),
                })
                .then((res) => {
                    setCompany(res.data.response.content);
                    setTotalPages(res.data.response.totalPages);
                    setTotalElements(res.data.response.totalElements);
                    setNumberOfElements(res.data.response.numberOfElements);
                    setLoader(false);
                })
                .catch((error) => {
                    errorHandler(error);
                    setLoader(false);
                });
        } else {
            axios
                .get(`${url.ADMIN_API}/process/company?authId=${user.id}`, { headers: authHeader() })
                .then((res) => {
                    setCompany(res.data.response);
                })
                .catch((error) => {
                    errorHandler(error);
                });
        }
    };

    const handleStatusFilter = (event, _key) => {
        let searchKey = event.target.value;
        axios
            .get(`${url.ADMIN_API}/company/list?status=${searchKey}&page=${currentPage}&size=${pageSize}&trialCompany=${isTrialCompany}`, {
                headers: authHeader(),
            })
            .then((res) => {
                setCompany(res.data.response.content);
                setTotalPages(res.data.response.totalPages);
                setTotalElements(res.data.response.totalElements);
                setNumberOfElements(res.data.response.numberOfElements);
            })
            .catch((error) => {
                errorHandler(error);
            });
    };

    const getCompanyList = () => {
        axios
            .get(`${url.ADMIN_API}/company/companylist/?status=${status}&search=${name}&page=${currentPage}&size=${pageSize}&trialCompany=${isTrialCompany}`, { headers: authHeader() })
            .then((res) => {
                setCompany(res.data.response.content);
                setTotalPages(res.data.response.totalPages);
                setTotalElements(res.data.response.totalElements);
                setNumberOfElements(res.data.response.numberOfElements);
                setLoader(false);
            })
            .catch((error) => {
                setLoader(false);
                errorHandler(error);
            });
    };


    const getProcessAdminCompanyList = () => {
        let user = JSON.parse(localStorage.getItem('user'));
        axios
            .get(`${url.ADMIN_API}/process/processadmincompanylist/?authId=${user.id}&status=${searchKey}&search=${searchValue}`, { headers: authHeader() })
            .then((res) => {
                setCompany(res.data.response);
                setLoader(false);
            })
            .catch((error) => {
                setLoader(false);
                errorHandler(error);
            });
    };

    const onSearch = (name) => {
        setName(name);
        setCurrentPage(1);
        getCompanyList();
    };


    const onSearchProcessAdmin = (searchValue) => {
        setSearchValue(searchValue);
        getProcessAdminCompanyList();
    };

    const route = (data) => {
        localStorage.setItem('companyId', data);
        history.push('/processadmin/company/test');
    };


    const increment = () => {
        setStartPage(startPage + 5);
        setEndPage(endPage + 5);
    };

    const decrement = () => {
        setStartPage(startPage - 5);
        setEndPage(endPage - 5);
    };

    const onPagination = (pageSize, currentPage) => {
        setPageSize(pageSize);
        setCurrentPage(currentPage);
        onNextPage();
    };

    const onNextPage = () => {
        getAllCompanyList();
    };



    const switchToActualCompany = (companyId) => {
        axios.post(`${url.ADMIN_API}/freecredit/switch/trial-company?companyId=${companyId}`, {}, { headers: authHeader() })
            .then(() => {
                getAllCompanyList();
            })
            .catch(error => {
                errorHandler(error);
            });
    };

    const handleTrailCompany = () => {
        setIsTrialCompany(!isTrialCompany);
        setCurrentPage(1);
        getAllCompanyList();
    };

        const headers = ['S.No', 'Company Name', isTrialCompany ? 'Domain' : 'Sector', 'Location', "Status",isRoleValidation() === 'SUPER_ADMIN' ? 'SUBSCRIPTIONS': null, 'Action'];
    
    let i = pageSize - 1
    
    return (
        <main className="main-content bcg-clr">
            <div>
                <TableHeader
                    title={role === 'PROCESS_ADMIN' ? 'Interview Process List' : 'Companies'}
                    link="/companyadmin/add"
                    buttonName={role === 'PROCESS_ADMIN' ? null : "Add Company"}
                    showLink={true}
                />

                {role === 'PROCESS_ADMIN' ? <Search
                    title="Filter"
                    showSearch={true}
                    placeholder="Search By CompanyName,Sector,Location"
                    onSearch={onSearchProcessAdmin}
                ></Search> : <Search
                    title="Filter"
                    showSearch={true}
                    placeholder="Search By CompanyName,Sector,Location"
                    onSearch={onSearch}
                    showCheckBox={true}
                    handleTrailCompany={handleTrailCompany}
                    style={{display:'contents !important'}}
                ></Search>}
                <div className="row">
                    <div className="col-md-12">
                        <div className="table-border">
                            <div>
                                {fallBackLoader(loader)}
                                <div className="table-responsive pagination_table">
                                    <table className="table table-striped" id="dataTable">
                                        <CollegeTable headers={headers} body={company} pageSize={pageSize} currentPage={currentPage} link={"/companyadmin"}></CollegeTable>
                                        {/* <thead className="table-dark" style={{ textAlign: 'center' }}>
                                            <tr>
                                                <th>S.No</th>
                                                <th style={{ textAlign: 'left' }}>Company Name</th>
                                                <th style={{ textAlign: 'left' }}>{isTrialCompany ? "Domain" : "Sector"}</th>
                                                <th style={{ textAlign: 'left' }}>Location</th>
                                                {role === 'PROCESS_ADMIN' ? '' :
                                                    <th>
                                                        <div className='dropdown'>
                                                            <div type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" >
                                                                <span>STATUS </span> <i className="fa fa-filter" aria-hidden="true"></i>
                                                            </div>
                                                            <div
                                                                className="dropdown-menu"
                                                                aria-labelledby="dropdownMenuButton"
                                                            >
                                                                <option
                                                                    className="dropdown-item" onClick={(e) => handleStatusFilter(e, "status")} value="ACTIVE"> Active </option>
                                                                <option className="dropdown-item" onClick={(e) => handleStatusFilter(e, "status")} value="INACTIVE"> InActive </option>
                                                            </div>
                                                        </div>
                                                    </th>}
                                                {isRoleValidation() === 'SUPER_ADMIN' && <th>SUBSCRIPTIONS</th>}
                                                <th>ACTION</th>
                                            </tr>
                                        </thead> */}
                                        {/* <tbody style={{ textAlign: 'center' }}>
                                            {_.size(company) > 0 ? (
                                                _.map(company || [], (company, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td style={{ textAlign: 'center' }}>{pageSize * currentPage - (i--)}</td>
                                                            <td style={{ textAlign: 'left' }}>{company.name}</td>
                                                            <td style={{ textAlign: 'left' }}>{!company.isTrialCompany ? company.sector : company.domain}</td>
                                                            <td style={{ textAlign: 'left' }}>{company.location}</td>
                                                            {role === 'PROCESS_ADMIN' ? '' :
                                                                <td className={company.status === 'INACTIVE' ? 'text-danger' : 'text-success'}>{company.status}</td>}
                                                            {isRoleValidation() === 'SUPER_ADMIN' && (_.isEmpty(company.plans) ?
                                                                <td style={{ color: "green" }}> <Link className="collapse-item" to={{ pathname: '/companyadmin/plan', state: { company: company, action: 'add' } }}>
                                                                    <i className="fa fa-plus" aria-hidden="true" style={{ color: "darkgreen", paddingRight: "0.5rem", }} ></i>Plan</Link></td> :
                                                                <td> <Link className="collapse-item" to={{ pathname: `/companyadmin/plan`, state: { companyId: company.id, action: 'view' } }}>
                                                                    <i className="fa fa-eye" aria-hidden="true" style={{ color: "darkblue", paddingRight: "0.5rem", }} ></i>Plan</Link>
                                                                </td>)
                                                            }
                                                            {role === 'PROCESS_ADMIN' ?
                                                                <td> <Link className="collapse-item" to={{ pathname: '/processadmin/company/test' }} onClick={() => route(company.id)}>
                                                                    <i className="fa fa-eye" aria-hidden="true" data-toggle="tooltip" data-placement="top" title="VIEW TEST" style={{ color: 'black' }}></i></Link>
                                                                </td> :
                                                                <>
                                                                    <td> <Link className="collapse-item" to={{ pathname: '/companyadmin/edit', state: { company: company, action: 'Update' } }}>
                                                                        <i className="fa fa-pencil" aria-hidden="true" ></i>
                                                                    </Link>
                                                                        {company.isTrialCompany ?
                                                                            <ToggleStatus title='Switch To Onboard Company' checked={false} onChange={() => switchToActualCompany(company.id)} /> : null}
                                                                    </td>
                                                                </>
                                                            }
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr className="text-center">
                                                    <td colSpan="8">No data available in table</td>
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
            </div>
        </main>
    );
};
export default CompanyList;