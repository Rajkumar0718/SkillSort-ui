import axios from 'axios';
import _ from 'lodash';
import React, { Component , useState} from 'react';
import { Link } from 'react-router-dom';
import { authHeader, errorHandler } from '../../api/Api';
import '../../assests/css/AdminDashboard.css';
import qualification from '../../assests/images/degree.png';
import  url  from '../../utils/UrlConstant';
import ViewProfile from '../Admin/ViewProfile';

const CandidateResultDetails = () => {
    const [results, setResults] = useState([]);
  const [user, setUser] = useState({});
  const [pdfData, setPdfData] = useState({});
  const [numPages, setNumPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [resume, setResume] = useState('');
  const [examId, setExamId] = useState('');
  const [category, setCategory] = useState([]);
  const [viewProfile, setViewProfile] = useState(false);
  const [totalResult, setTotalResult] = useState({});
  const [candidateStatus, setCandidateStatus] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = {};
        const storedDataKey = window.location.pathname.replace('/processadmin/result/candidate/details/', '');

        if (localStorage.getItem(storedDataKey)) {
          sessionStorage.setItem(storedDataKey, localStorage.getItem(storedDataKey));
          localStorage.removeItem(storedDataKey);
          result = JSON.parse(sessionStorage.getItem(storedDataKey));
        }

        result = JSON.parse(sessionStorage.getItem(storedDataKey));

        setResults(result.results);
        setUser(result.candidate);
        setExamId(result.examId);
        setTotalResult(result);

        const resumeResponse = await axios.get(`${url.ADMIN_API}/candidate/resume/${result.candidate?.id}`, { headers: authHeader(), responseType: 'blob' });
        const pdf = {};
        const pdfUrl = window.URL.createObjectURL(resumeResponse.data);
        pdf.data = pdfUrl.concat('#toolbar=0');
        setPdfData(pdf);

        const examResponse = await axios.get(`${url.ADMIN_API}/exam/${result.examId}`, { headers: authHeader() });
        setCategory(examResponse.data.response.categories);
        setCandidateStatus(result.candidate?.candidateStatus !== 'PENDING' ? true : false);
      } catch (error) {
        errorHandler(error);
      }
    };

    fetchData();
  }, []);

  const setCandidate = () => {
    if (!localStorage.getItem(window.location.pathname.replace('/processadmin/result/candidate/details/', ''))) {
      localStorage.setItem(window.location.pathname.replace('/processadmin/result/candidate/details/', ''), sessionStorage.getItem(window.location.pathname.replace('/processadmin/result/candidate/details/', '')));
    }
  };

  const getTotalTestCase = (type) => {
    return _.filter(totalResult.submittedExam, res => res.question.difficulty === type && res.question.input)?.map(res => res.question.input)?.flatMap(res => res)?.length;
  };

  const renderTable = () => {
    return (category?.length > 0 ? _.map(category, (categoryItem) => {
      return (
        results?.length > 0 ? _.map(results, (result) => {
          if (result.section === categoryItem.sectionName) {
            return (
              <tr style={{ paddingLeft: '15px' }}>
                {result.section === 'PROGRAMMING' ? (
                  <th>
                    <Link to={{ pathname: `/processadmin/result/candidate/programResult/${user.id}` }} onClick={() => setCandidate()} target={'_blank'}>
                      <div style={{ cursor: 'pointer', color: 'blue' }}>
                        {result.section}
                      </div>
                    </Link>
                  </th>
                ) : (
                  <th>{result.section}</th>
                )}
                <th>{categoryItem.sectionName === 'PROGRAMMING' ? `${result.totalTestCasePassInEasy}/${getTotalTestCase('SIMPLE')}` : `${result.easy}/${categoryItem.simple}`}</th>
                <th>{categoryItem.sectionName === 'PROGRAMMING' ? result.totalTestCasePassInMedium : result.medium}/{categoryItem.sectionName === 'PROGRAMMING' ? getTotalTestCase('MEDIUM') : categoryItem.medium}</th>
                <th>{categoryItem.sectionName === 'PROGRAMMING' ? result.totalTestCasePassInHard : result.hard}/{categoryItem.sectionName === 'PROGRAMMING' ? getTotalTestCase('COMPLEX') : categoryItem.complex}</th>
                <th>{categoryItem.sectionName === 'PROGRAMMING' ? (result.totalTestCasePassInEasy + result.totalTestCasePassInMedium + result.totalTestCasePassInHard) : result.totalMarks}/
                  {categoryItem.sectionName === 'PROGRAMMING' ? (getTotalTestCase('SIMPLE') + getTotalTestCase('MEDIUM') + getTotalTestCase('COMPLEX')) : categoryItem.totalInSection}</th>
              </tr>
            );
          }
        }) : ''
      );
    }) : '');
  };

  const close = () => {
    setViewProfile(false);
  };
  return (
    <div>
                <div className="modal-dialog modal-xl">
                    <div className="modal-content" style={{ overflowY: 'auto', height: 'calc(100vh - 60px)' }}>
                        <div className="modal-header">
                            <div>
                                <h4 className="modal-title">Candidate Result</h4>
                            </div>
                        </div>
                        <div className="modal-body">
                            <div>
                                <div className="row container d-flex justify-content-center mb-2">
                                    <div className="col-xl-12 col-md-12">
                                        <div className="card user-card-full">
                                            <div className="row m-l-0 m-r-0">
                                                <div className="col-sm-4 bg-c-lite-green user-profile">
                                                    <div className='row' style={{ display: 'contents' }}>
                                                        <div className="card-block text-center text-white">
                                                            <h4 className="f-w-600 mt-4" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', lineHeight: '1.2' }}>{user.firstName} {user.lastName}</h4>
                                                            <h5 style={{ marginBottom: '0.5rem', fontWeight: '500', lineHeight: '1.2' }}><img src={qualification} alt="" style={{ width: '30px', marginLeft: '-36px' }} /> {user.qualification}</h5>
                                                            <p style={{ marginBottom: '0.5rem' }}>{user.email}</p>
                                                            <p style={{ marginBottom: '1.0rem' }}>{user.phone}</p>
                                                        </div>
                                                    </div>
                                                    <div className='row' style={{ display: 'contents' }}>
                                                        <div className='card-block text-center text-white'>
                                                            <button onClick={() => setState({ viewProfile: !viewProfile })} className='btn btn-dark btn-sm' style={{ color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>view profile</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-8">
                                                    <div className="card-block">
                                                        <h6 className="m-b-20 p-b-5 b-b-default f-w-600">Academic Information</h6>
                                                        <div className="row">
                                                            <div className="col-sm-2">
                                                                <p className="m-b-10 f-w-600">SSLC</p>
                                                                <h6 className="text-muted f-w-400">{user.sslcPercentage}%</h6>
                                                            </div>
                                                            <div className="col-sm-2">
                                                                <p className="m-b-10 f-w-600">HSC</p>
                                                                <h6 className="text-muted f-w-400">{user.hscPercentage}%</h6>
                                                            </div>
                                                            <div className="col-sm-2">
                                                                <p className="m-b-10 f-w-600">UG</p>
                                                                <h6 className="text-muted f-w-400">{user.ugPercentage}%</h6>
                                                            </div>
                                                            {user.pgPercentage ? <div className="col-sm-2">
                                                                <p className="m-b-10 f-w-600">PG</p>
                                                                <h6 className="text-muted f-w-400">{user.pgPercentage}%</h6>
                                                            </div> : ''}
                                                            <div className="col-sm-4">
                                                                <p className="m-b-10 f-w-600">INSTITUTION</p>
                                                                <h6 className="text-muted f-w-400">{user.institution}</h6>
                                                            </div>
                                                        </div>
                                                        <h6 className="m-b-20 m-t-40 p-b-5 b-b-default f-w-600">Test Score</h6>
                                                        <div className="row">
                                                            <table className='table table-hover'>
                                                                <thead className='thead-dark'>
                                                                    <th>SECTION</th>
                                                                    <th>SIMPLE</th>
                                                                    <th>MEDIUM</th>
                                                                    <th>COMPLEX</th>
                                                                    <th>TOTAL</th>
                                                                </thead>
                                                                <tbody>
                                                                    {renderTable()}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {viewProfile ?
                        <div>
                            <ViewProfile pdfData={pdfData.data} onClose={close} />
                        </div> : ''
                    }
                </div>
            </div>
  )
}

export default CandidateResultDetails