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
import { CollegeTable } from './CollegeTable';
import '../../common/Common.css';


const CollegeList = () => {
    const [college, setCollege] = useState([]);
    const [searchKey] = useState('ACTIVE');
    const [loader, setLoader] = useState(false);
    const [role] = useState(isRoleValidation());
    // const [tooltipAddress, setTooltipAddress] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [numberOfElements, setNumberOfElements] = useState(0);
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(5);
    // const [isTrialCompany,setTrialCompany]=useState();

    useEffect(() => {
        getCollegeSerachList();
    }, [currentPage, pageSize]);

    const handlerStatusFilter = (event) => {
        axios.get(`${url.COLLEGE_API}/college/list?status=${event.target.value || searchKey}`, { headers: authHeader() })
            .then(res => {
                setCollege(res?.data?.response);
                console.log(res)
            }).catch(err => {
                errorHandler(err);
            });
    };

    const getCollegeSerachList = () => {
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
    const headers = ['S.NO', 'COLLEGENAME','STATE','DISTRICT','STATUS','ACTION']
    
      
    // {/* <CustomTable headers={headers} data={college} pageSize={pageSize} currentPage={currentPage}/> */ }

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
                                    <table className="table table-striped" id="dataTable">
                                        <CollegeTable headers={headers} body={college} pageSize={pageSize} currentPage={currentPage} link={"/collegeadmin/edit"}></CollegeTable>
                                        {/* <thead className="table-dark">
                           <tr>
                             <th className='col-lg-1' style={{ textAlign: 'center' }}>S.NO</th>
                             <th className='col-lg-4' style={{ textAlign: 'left' }}>COLLEGE NAME</th>
                             <th className='col-lg-2' style={{ textAlign: 'left' }}>STATE</th>
                             <th className='col-lg-2' style={{ textAlign: 'left' }}>DISTRICT</th>
                             <th className='col-lg-2' style={{ textAlign: 'center' }}>
                               <div className="dropdown" >
                                 <div
                                   type="button"
                                   id="dropdownMenuButton"
                                   data-toggle="dropdown"
                                   aria-haspopup="true"
                                   aria-expanded="false"
   
                                 ><span>STATUS </span>
                                   <i className="fa fa-filter" aria-hidden="true"></i>
                                 </div>
                                 <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ top: '21px' }} >
                                   <option className="dropdown-item" onClick={handlerStatusFilter} value="ACTIVE" > Active </option>
                                   <option className="dropdown-item" onClick={handlerStatusFilter} value="INACTIVE" > InActive </option>
                                 </div>
                               </div>
                             </th>
                             <th className='col-lg-1' style={{ textAlign: 'center' }}>ACTION</th>
                           </tr>
                         </thead> */}
                                        {/* <tbody style={{ textAlign: 'left', textTransform: 'capitalize' }}>
                                            {college.length > 0 ? (
                                                _.map(college || [], (college, index) => {
                                                    return (
                                                        <tr>
                                                            <td style={{ textAlign: 'center' }}>{pageSize * currentPage - (i--)}</td>
                                                            <td style={{ textAlign: 'left', textTransform: 'capitalize' }}>{college.collegeName}</td>
                                                            <td style={{ textAlign: 'left' }}>{college.state}</td>
                                                            <td style={{ textAlign: 'left' }}>{college.district}</td>
                                                            <td style={{ textAlign: 'center' }}>{college.status}</td>
                                                            <td style={{ textAlign: 'center' }}>
                                                                <Link className="collapse-item" to={{ pathname: '/collegeadmin/edit', state: { college: college, action: 'Update' } }}>
                                                                    <i className="fa fa-pencil" aria-hidden="true" ></i></Link>
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
            </div>
        </main>
    );
};
export default CollegeList;
