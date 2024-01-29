import axios from 'axios';
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { authHeader, errorHandler } from '../../api/Api';
import { fallBackLoader } from '../../utils/CommonUtils';
import Pagination from "../../utils/Pagination";
import { url } from '../../utils/UrlConstant';import React from 'react'

const ExamList = () => {

    const [exams, setExams] = useState([]);
    const [loader, setLoader] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [numberOfElements, setNumberOfElements] = useState(0);
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(5);
    const [jobDescription, setJobDescription] = useState('');
    const [statusCount, setStatusCount] = useState([]);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const id = localStorage.getItem("companyId");
          const examsResponse = await axios.get(`${url.ADMIN_API}/exam/list?status=ACTIVE&companyId=${id}&page=${currentPage}&size=${pageSize}`, { headers: authHeader() });
          setExams(examsResponse.data.response.content);
          setTotalPages(examsResponse.data.response.totalPages);
          setTotalElements(examsResponse.data.response.totalElements);
          setNumberOfElements(examsResponse.data.response.numberOfElements);
          setLoader(false);
  
          const statusCountResponse = await axios.get(`${url.ADMIN_API}/superadmin/status/count`, { headers: authHeader() });
          setStatusCount(statusCountResponse.data.response);
          setLoader(false);
        } catch (error) {
          setLoader(false);
          errorHandler(error);
        }
      };
  
      fetchData();
    }, [currentPage, pageSize]);
  
    const increment = () => {
      setStartPage(startPage + 5);
      setEndPage(endPage + 5);
    };
  
    const decrement = () => {
      setStartPage(startPage - 5);
      setEndPage(endPage - 5);
    };
  
    const onPagination = (newPageSize, newCurrentPage) => {
      setPageSize(newPageSize);
      setCurrentPage(newCurrentPage);
      onNextPage();
    };
  
    const onNextPage = async () => {
      try {
        const examsResponse = await axios.get(`${url.ADMIN_API}/exam/list?status=ACTIVE&companyId=${localStorage.getItem("companyId")}&page=${currentPage}&size=${pageSize}`, { headers: authHeader() });
        setExams(examsResponse.data.response.content);
        setTotalPages(examsResponse.data.response.totalPages);
        setTotalElements(examsResponse.data.response.totalElements);
        setNumberOfElements(examsResponse.data.response.numberOfElements);
        setLoader(false);
      } catch (error) {
        setLoader(false);
        errorHandler(error);
      }
    };
  
    const route = (id, name, desc) => {
      localStorage.setItem('examId', id);
      localStorage.setItem('examName', name);
      localStorage.setItem('jobDescription', desc);
    };
  
    const renderTable = () => {
      let i = pageSize - 1;
      return exams.length > 0 ? exams.map((exam, _index) => {
        return (
          <tr style={{ textAlign: 'center' }} key={exam.id}>
            <td>{pageSize * currentPage - (i--)}</td>
            <td style={{ textAlign: 'left' }}>{exam.name}</td>
            <td style={{ textAlign: 'left' }}>{exam.jobDescription?.replace(/<[^>]*>?/gm, '')}</td>
            <td>
              <Link className="collapse-item" to={{ pathname: '/processadmin/company/test/candidate' }} onClick={() => route(exam.id, exam.name, exam.jobDescription)}>
                <i className="fa fa-eye" aria-hidden="true" data-toggle="tooltip" data-placement="top" title="VIEW CANDIDATE" style={{ color: 'black' }}></i>
              </Link>
            </td>
            <td><b>{statusCount[exam.id] ? statusCount[exam.id] : "-"}</b></td>
          </tr>
        );
      }) : <tr className='text-center'><td colspan="6">No data available</td></tr>;
    };
  
  return (
    <main className="main-content bcg-clr">
    <div>
      <div className="card-header-new">
        <span>Test</span>
      </div>
      <div className="row">
        <div className="col-md-12">
          {fallBackLoader(loader)}
          <div className="table-border">
            <div className="table-responsive pagination_table">
              <table className="table table-striped">
                <thead className="table-dark">
                  <tr>
                    <th style={{ textAlign: 'center' }}>S.NO</th>
                    <th style={{ textAlign: 'left' }}>NAME</th>
                    <th style={{ textAlign: 'left' }}>JOB DESCRIPTION</th>
                    <th style={{ textAlign: 'center' }}>ACTION</th>
                    <th style={{ textAlign: 'center' }}>PENDING</th>
                  </tr>
                </thead>
                <tbody>
                  {renderTable()}
                </tbody>
              </table>
              {numberOfElements === 0 ? '' :
                <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPagination={onPagination}
                  increment={increment}
                  decrement={decrement}
                  numberOfElements={numberOfElements}
                  totalElements={totalElements}
                  pageSize={pageSize}

                />}
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  )
}

export default ExamList