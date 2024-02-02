import axios from 'axios';
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { authHeader, errorHandler } from '../../api/Api';
import { fallBackLoader } from '../../utils/CommonUtils';
import { url } from '../../utils/UrlConstant';
import { isRoleValidation } from '../../utils/Validation';
const CollegeExamList = () => {
    const [exam, setExam] = useState([]);
    const [searchKey, setSearchKey] = useState('ACTIVE');
    const [loader, setLoader] = useState(false);
    const [role, setRole] = useState(isRoleValidation());
    const [tooltipAddress, setTooltipAddress] = useState('');
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(5);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${url.ADMIN_API}/exam/collegeExam/list?page=${page}&size=${size}`, { headers: authHeader() });
          setExam(response.data.response.content);
        } catch (error) {
          errorHandler(error);
        }
      };
  
      fetchData();
    }, [page, size]);
  return (
    <main className="main-content bcg-clr">
                <div>
                    <div className="card-header-new">
                        <span>College Test</span>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="table-border">
                                <div>
                                    {fallBackLoader(loader)}
                                    <div className="table-responsive pagination_table">
                                        <table className="table table-striped" id="dataTable">
                                            <thead className="table-dark" style={{ textAlign: 'center' }}>
                                                <tr>
                                                    <th className='col-lg-1'>S.NO</th>
                                                    <th className='col-lg-3'>Test NAME</th>
                                                    <th className='col-lg-3'>DURATION</th>
                                                    <th className='col-lg-2'>SECTIONS</th>
                                                    <th className='col-lg-4'>ACTION</th>
                                                </tr>
                                            </thead>
                                            <tbody style={{ textAlign: 'center' }}>
                                                {exam.length > 0 ? (
                                                    exam.map((exam, index) => {
                                                        return (
                                                            <tr>
                                                                <td>{index + 1}</td>
                                                                <td>{exam.name}</td>
                                                                <td>{exam.duration + exam.programmingDuration}</td>
                                                                <td>{exam.categories.length}</td>
                                                                <td>
                                                                    <Link to={{ pathname: "/processadmin/college-exam/collegeExamResult", state: { examId: exam.id, examName: exam.name } }}><button type="button" style={{ backgroundColor: '#067afb' }} className="btn-success show-result">
                                                                        <span>View Result</span></button></Link>
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
  )
}

export default CollegeExamList