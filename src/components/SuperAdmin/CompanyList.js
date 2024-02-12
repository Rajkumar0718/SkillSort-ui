import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authHeader, errorHandler } from '../../api/Api';
import Search from '../../common/AdvanceSearch';
import { ToggleStatus, fallBackLoader } from '../../utils/CommonUtils';
import url from '../../utils/UrlConstant';
import { isRoleValidation } from '../../utils/Validation';
import TableHeader from '../../utils/TableHeader';
import Pagination from '../../utils/Pagination';
import _ from 'lodash';
import { CustomTable } from '../../utils/CustomTable';
import { MenuItem } from "@mui/material";

const CompanyList = () => {
    const [company, setCompany] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [searchKey, setSearchKey] = useState('ACTIVE');
    const [loader, setLoader] = useState(false);
    const [role, setRole] = useState(isRoleValidation());
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
    const history = useNavigate();

    useEffect(() => {
        getAllCompanyList();
        setTableJson()
    }, [isTrialCompany, currentPage, pageSize]);


    const getAllCompanyList = () => {
        let user = JSON.parse(localStorage.getItem('user'));
        if (role !== 'PROCESS_ADMIN') {
            axios
                .get(`${url.ADMIN_API}/company/list?status=${status}&page=${currentPage}&size=${pageSize}&trialCompany=${isTrialCompany}`, {
                    headers: authHeader(),
                })
                .then((res) => {
                    setCompany(res.data.response.content);
                    console.log(res.data.response.content, "response")
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
        console.log(event)
        let searchKey = event?.target?.value || event;
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

    const getCompanyList = (name) => {
        console.log(name, "name")
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
        console.log(name +"ajayyyyyyyy");
        setName(name);
        setCurrentPage(1);
        getCompanyList(name);
    };


    const onSearchProcessAdmin = (searchValue) => {
        setSearchValue(searchValue);
        getProcessAdminCompanyList();
    };

    const route = (data) => {
        localStorage.setItem('companyId', data);
        history.apply('/processadmin/company/test');
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
        setIsTrialCompany(prev => !prev);
        setCurrentPage(1);
        getAllCompanyList();
    };

    const setTableJson = () => {

        const sectorHeader = isTrialCompany ? {
            name: 'DOMAIN',
            align: 'left',
            key: 'domain',
        } : {
            name: 'SECTOR',
            align: 'left',
            key: 'sector',
        };

        const newheaders = [
            {
                name: 'S.No',
                align: 'center',
                key: 'S.NO',
            },
            {
                name: 'COMPANY NAME',
                align: 'left',
                key: 'name',
            },
            sectorHeader,
            {
                name: 'LOCATION',
                align: 'left',
                key: 'location',
            },
            role === "PROCESS_ADMIN"?{}:{
                name: 'STATUS',
                align: 'center',
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
            role === "PROCESS_ADMIN"?{}:{
                name: 'SUBSCRIPTIONS',
                align: 'center',
                key: 'subscriptions',
                renderCell: (params) => {
                    return (
                        isRoleValidation() === 'SUPER_ADMIN' && (_.isEmpty(params?.plans) ?
                            <> <Link className="collapse-item" style={{ textDecoration: 'none',color: "darkgreen"  }} to='/companyadmin/plan' state={{ company: params, action: 'add' }} >
                                <i className="fa fa-plus" aria-hidden="true" style={{ paddingRight: "0.5rem", }} ></i>Plan</Link>
                            </> :
                            <div>
                                <> <Link className="collapse-item" style={{ color: "darkblue",textDecoration: 'none' }} to='/companyadmin/plan' state={{ company: params, action: 'view' }}>
                                    <i className="fa fa-eye" aria-hidden="true" style={{ paddingRight: "0.5rem" }} ></i>Plan</Link>
                                </>
                          
                            </div>
                        )
                    )
                }
            },
            {
                name: 'Action',
                key: 'action',
                renderCell: (params) => {
                    return (
                        <>
                        {role === 'PROCESS_ADMIN' ?
                                   <Link className="collapse-item" to={{ pathname: '/processadmin/company/test' }} onClick={() => route(params.id)}>
                                    <i className="fa fa-eye" aria-hidden="true" data-toggle="tooltip" data-placement="top" title="VIEW TEST" style={{ color: 'black' }}></i></Link>
                                   :
                                  <>
                                     <Link className="collapse-item" to={{ pathname: '/companyadmin/edit', state: { company: company, action: 'Update' } }}>
                                      <i className="fa fa-pencil" aria-hidden="true" ></i>
                                    </Link>
                                      {company.isTrialCompany ?
                                        <ToggleStatus title='Switch To Onboard Company' checked={false} onChange={() => this.switchToActualCompany(company.id)} /> : null}
                                    
                                  </>
                                }
                        </>
                    );
                },
            },
        ];

        setHeaders(newheaders);
    };

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
                    handleTrailCompany={() => handleTrailCompany()}
                ></Search>}
                <div className="row">
                    <div className="col-md-12">
                        <div className="table-border">
                            <div>
                                {fallBackLoader(loader)}
                                <div className="table-responsive pagination_table">
                                    <CustomTable headers={headers} data={company} pageSize={pageSize} currentPage={currentPage} link={"/companyadmin"}></CustomTable>
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
