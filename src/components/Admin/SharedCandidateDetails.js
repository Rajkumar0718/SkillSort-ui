import axios from "axios";
import _ from 'lodash';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { errorHandler } from "../../api/Api";
import qualification from '../../assests/images/degree.png';
import LOGO from '../../assests/images/LOGO.svg';
import profile from '../../assests/images/profileCandidate.png';
import url from "../../utils/UrlConstant";
import ViewProfile from "./ViewProfile";
import { useParams } from "react-router";


function SharedCandidateDetails(props) {

  const [candidate, setCandidate] = useState({})
  const [results, setResults] = useState([])
  const [examMonitor, setExamMonitor] = useState({});
  const [category, setCategory] = useState([]);
  const [totalResult, setTotalResult] = useState({})
  const [viewProfile, setViewProfile] = useState(false);
  const [pdfData, setPdfData] = useState({})
  const param = useParams()
  const examResultId = param.examResultId;



  useEffect(() => {
    function getExamResult() {
      axios.get(`${url.CANDIDATE_API}/candidate/exam-result/${examResultId}`)
        .then(res => {
          setResults(res.data.response.results)
          setTotalResult(res.data.response)
          setCandidate(res.data.response?.candidate)
          axios.get(`${url.CANDIDATE_API}/candidate/exam-monitor/${res.data.response?.examId}/${res.data.response?.candidate?.email}`)
            .then(response => setExamMonitor(response.data.response));

          axios.get(` ${url.ADMIN_API}/candidate/resume/${res.data.response?.candidate?.id}`, { responseType: 'blob' })
            .then(response => {
              const pdf = {}
              let url = window.URL.createObjectURL(response.data);
              pdf.data = url.concat("#toolbar=0")
              setPdfData(pdf)
            }).catch(e => errorHandler(e))

          axios.get(` ${url.ADMIN_API}/exam/candidate/${res.data.response?.examId}`)
            .then(response => setCategory(response.data.response.categories))
            .catch(e => errorHandler(e))

        })
        .catch(error => errorHandler(error))
    }



    getExamResult();
  }, [examResultId])

  const setLocalStorage = () => {
    localStorage.setItem(candidate?.id, JSON.stringify(totalResult));
    localStorage.setItem('examMonitor', JSON.stringify(examMonitor));
  }

  const programRender = () => {
    return (
      results?.length > 0 ? _.map(results, (program) => {
        if (program.section === 'PROGRAMMING') {
          return (
            <Link style={{ marginLeft: '0px' }} className='btn btn-sm btn-prev' to={{ pathname: '/admin/result/candidate/programResult/' + candidate?.id }} onClick={() => setLocalStorage()} target={'_blank'}>VIEW PROGRAMMING</Link>
          )
        }
      }) : '')
  }
  const percentageCal = () => {
    const result = results;
    const question = category;
    const questionsSection = question.filter((qt) => qt.sectionName !== 'PROGRAMMING');
    const totalMark = (_.sumBy(result || [], r => r.totalMarks));
    const totalQuestion = (_.sumBy(questionsSection || [], r => r.totalInSection))
    return ((totalMark / totalQuestion) * 100).toFixed(0);
  }
  const close = () => {
    setViewProfile(false);
  }

  const renderTable = () => {
    return (category?.length > 0 ? _.map(category, (cat) => {
      return (
        results?.length > 0 ? _.map(results, (result) => {
          if (result.section === cat.sectionName && result.section !== 'PROGRAMMING') {
            return (
              <tr className='rowdesign' style={{ paddingLeft: '15px' }}>
                <td style={{ color: '#000000' }}>{result.section}</td>
                <td style={{ color: '#000000', fontWeight: '400', fontSize: '13px' }}>{cat.simple !== 0 ? (((result.easy) / (cat.simple) * 100).toFixed(0)) : 0}</td>
                <td style={{ fontWeight: '400', color: '#000000', fontSize: '13px' }}>{cat.medium !== 0 ? (((result.medium) / (cat.medium) * 100).toFixed(0)) : 0}</td>
                <td style={{ fontWeight: '400', color: '#000000', fontSize: '13' }}>{cat.complex !== 0 ? (((result.hard) / (cat.complex) * 100).toFixed(0)) : 0}</td>
                <td style={{ fontWeight: '400', color: '#000000', fontSize: '13px', paddingLeft: '0px' }}>{cat.totalInSection !== 0 ? (((result.totalMarks) / (cat.totalInSection) * 100).toFixed(0)) : 0}</td>
              </tr>)
          }
        }) : '')
    }) : '')
  }


  return (
    <div>
      <div className="d-flex" id="wrapper">
        <div id="page-content-wrapper" style={{ position: 'absolute', paddingLeft: '0px' }}>
          <div className='header'>
            <img className='header-logo' src={LOGO} alt="SkillSort" />
          </div>
          <div className="modal-content" style={{ overflowY: 'auto', height: 'calc(100vh - 40px)', paddingRight: '30px' }}>
            <div className="modal-header" style={{ border: 'none' }}>
              <h6 style={{ fontSize: '50px', paddingTop: '5px', fontFamily: 'Baskervville', color: '#000000', paddingLeft: '130px' }}>Candidate Result</h6>
            </div>
            <div className="backPic">
              <div className="modal-body">
                <div>
                  <div style={{display:"flex"}}>
                    <div className="col-sm-4 user-profile">
                      <div className='row' style={{ display: 'contents' }}>
                        <div className="card-block content-align" >
                          <img src={profile} alt="profile" />
                          <h4 className="f-w-600 mt-4" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', lineHeight: '1.2', color: '#3B489E', fontFamily: 'Montserrat' }}>{candidate.firstName} {candidate.lastName}</h4>
                          <h5 style={{ fontWeight: '400', color: '#000000', fontSize: '13px', marginBottom: '18px' }}><img src={qualification} alt="" style={{ width: '30px', marginLeft: '-36px' }} /> {candidate.qualification}</h5>
                          <p style={{ fontWeight: '400', color: '#000000', fontSize: '13px', marginBottom: '0px' }}>{candidate.email}</p>
                          <p style={{ fontWeight: '400', color: '#000000', fontSize: '13px', marginBottom: '0px' }}>{candidate.phone}</p>
                        </div>
                      </div>
                      <div className='row' style={{ display: 'contents' }}>
                        <div className='card-block content-align' style={{ paddingTop: '0px' }}>
                          <button onClick={() => setViewProfile(!viewProfile)} className='btn btn-nxt' style={{ color: '#FFFFFF', fontWeight: '700px', cursor: 'pointer', paddingBottom: '30px', fontFamily: 'Montserrat' }}>View Resume</button>
                        </div>
                      </div>
                    </div>
                    <div className='verticalline'>
                    </div>
                    <div className="card-block" >
                      <h6 className="m-b-20 p-b-5 b-b-default f-w-600" style={{ border: 'none', color: '#fc3f06' }}>ACADAMIC</h6>
                      <div className="row">
                        <div className="col-sm-2">
                          <p className="m-b-10 f-w-400">SSLC</p>
                          <h6 className="f-w-600">{candidate.sslcPercentage}%</h6>
                        </div>
                        <div className="col-sm-2">
                          <p className="m-b-10 f-w-400">HSC</p>
                          <h6 className="f-w-600">{candidate.hscPercentage}%</h6>
                        </div>
                        <div className="col-sm-2">
                          <p className="m-b-10 f-w-400">UG</p>
                          <h6 className="f-w-600">{candidate.ugPercentage}%</h6>
                        </div>
                        {candidate.pgPercentage ? <div className="col-sm-2">
                          <p className="m-b-10 f-w-400">PG</p>
                          <h6 className="f-w-600">{candidate.pgPercentage}%</h6>
                        </div> : ''}
                        <div className="col-sm-6">
                          <p className="m-b-10 f-w-400">Institution</p>
                          <h6 className="f-w-600">{candidate.institution}</h6>
                        </div>
                      </div>
                      <h6 className="m-b-20 m-t-40 p-b-5 b-b-default f-w-600" style={{ border: 'none', color: '#fc3f06', marginBottom: '0px', marginTop: '50px' }}>MCQ ONLINE TEST SCORE</h6>
                      <div className="row" style={{ paddingLeft: '15px', width: '46rem' }}>
                        <table className="table table-hover" style={{ opacity: '65%', marginBottom: '0px' }}>
                          <thead style={{ backgroundColor: '#E0E1EA' }}>
                            <th className='col-lg-4 thdesign' style={{ fontWeight: '2000', color: '#000000' }}>Section</th>
                            <th className='col-lg-2 thdesign' style={{ fontWeight: '2000', color: '#000000' }}>Simple</th>
                            <th className='col-lg-2 thdesign' style={{ fontWeight: '2000', color: '#000000' }}>Medium</th>
                            <th className='col-lg-2 thdesign' style={{ fontWeight: '2000', color: '#000000' }}>Complex</th>
                            <th className='col-lg-2 thdesign' style={{ fontWeight: '2000', color: '#000000' }}>Total</th>
                          </thead>
                          <tbody>
                            {renderTable()}
                          </tbody>
                        </table>
                        <div className='row' style={{ width: '710px', marginTop: '5px' }}>
                          <div className='col-7 col-lg-7'>
                            {programRender()}
                          </div>
                          <div className='col-5 col-lg-5'>
                            <p style={{ textAlign: 'center', marginLeft: '145px' }}><strong>{percentageCal()}%</strong></p>
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
      </div>

      {viewProfile ?
        <div>
          <ViewProfile type="resume"pdfData={pdfData.data} onClose={close} />
        </div> : ''
      }
    </div>



);
}

export default SharedCandidateDetails;

