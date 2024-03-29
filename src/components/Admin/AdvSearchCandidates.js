import { Card, CardContent, CardHeader, Fade, Snackbar, Typography } from '@mui/material';
import axios from 'axios';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from "react";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authHeader, errorHandler } from '../../api/Api';
import { toastMessage } from '../../utils/CommonUtils';
import Pagination from "../../utils/Pagination";
import url from '../../utils/UrlConstant';
import { isRoleValidation } from '../../utils/Validation';


export default function AdvSearchCandidates(props) {
  const totalCandidates = props.candidates;
  const totalSize = _.size(props.candidates);
  const totalPages = Math.ceil(totalSize / 10)
  const [candidates, setCandidates] = useState([])
  const[message, setMessage] = useState("");
  const [open,setOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [disableBtn,setDisableBtn] = useState(false)
  const [numberOfElements, setNumberOfElements] = useState(0)
  const [shortListedCandidates, setShortListedCandidates] = useState([])
  const [pageSize, setPageSize] = useState(1);
  const [plans, setPlans] = useState();
  const [planCount, setPlanCount] = useState(0);
  const bottomRef = useRef(null)
  const role = isRoleValidation()
  const vertical = "top"
  const horizontal = "right";
  useEffect(() => {
    getCompanyPlans();
  }, [])

  useEffect(() => {
    setCurrentPage(1)
    let can = _.slice(totalCandidates, 0, 10);
    setCandidates(can)
    setNumberOfElements(_.size(can))
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [totalCandidates, props.candidates])

  const onNextPage = (currentpage) => {
    let end = currentpage * 10;
    let start = end - 10;
    let can = _.slice(totalCandidates, start, end)
    setCandidates(can)
  }
  const onPagination = (pagesize, currentpage) => {
    setCurrentPage(currentpage);
    setPageSize(pagesize)
    onNextPage(currentpage)
  }

  const handleChange = (candidate) => {
    toast.dismiss();
    let selected = [...shortListedCandidates]
    if (selected.includes(candidate)) {
      let can = _.pull(selected, candidate)
      setShortListedCandidates(can);
      setPlanCount(planCount + 1)
    } else {
      if (planCount < 1) {
        exceedLimit();
        return;
      }
      selected.push(candidate)
      setShortListedCandidates(selected);
      setPlanCount(planCount - 1)
    }
  }

  const getCompanyPlans = () => {
    axios.get(`${url.ADMIN_API}/plan?service=RESUME`, { headers: authHeader() })
      .then(res => {
        if (_.isEmpty(res.data.response)) return
        const plans = res.data.response || []
        setPlans(plans)
        setPlanCount(_.sumBy(plans, p => p.residue || 0))
      }).catch(error => errorHandler(error))
  }

  const saveShortListedCandidates = () => {
    let ids = _.map(shortListedCandidates, sc => sc.id);
    setDisableBtn(true)
    axios.post(`${url.ADMIN_API}/company/shortlisted-candidates?positionId=${props.position.id}`, ids, { headers: authHeader() })
      .then(() => {
        handleShortlistedEventTrack()
        let candidate = [...candidates];
        let tc = _.pullAll(candidate, shortListedCandidates)
        _.remove(totalCandidates, tca => shortListedCandidates.includes(tca))
        setCandidates(tc)
        setShortListedCandidates([])
        getCompanyPlans();
        setDisableBtn(false)
        toastMessage('success', "Candidates Shortlisted Successfully !!")
      }).catch(err => {
        setDisableBtn(false)
        errorHandler(err)
      })
  }

  const handleShortlistedEventTrack = ()=>{
    window.dataLayer.push({
      event: 'Shortlisting',
    });
  }

  const setCandidate = (data) => {
    let candidate = JSON.stringify(data)
    localStorage.removeItem(data.id)
    localStorage.setItem(data.id, candidate)
  }

  const renderTable = () => {
    let i = pageSize - 1;
    return _.size(candidates) > 0
      ? _.map(candidates, (candidate) => {
        const skillSortScore = Math.round(candidate.skillSortScore);
        return (
          <>
            <tr>
              <td style={{ textAlign: 'center' }}>{(pageSize * currentPage) - (i--)}</td>
              <td style={{ textAlign: 'left' }}>{role === 'SUPER_ADMIN' ? <Link onClick={() => setCandidate(candidate)} to={{ pathname: '/examResult/' + candidate.id }} target={'_blank'} style={{ color: 'blue' }}>{candidate.firstName?.concat(" ")?.concat(candidate.lastName)}</Link> : candidate.firstName?.concat(" ")?.concat(candidate.lastName)}</td>
              <td style={{ textAlign: role === 'SUPER_ADMIN' ? 'center' : 'right' }} >{candidate.sslc}</td>
              <td style={{ textAlign: role === 'SUPER_ADMIN' ? 'center' : 'right' }} >{candidate.hsc}</td>
              <td style={{ textAlign: role === 'SUPER_ADMIN' ? 'center' : 'right' }} >{candidate.ug}</td>
              <td style={{ textAlign: role === 'SUPER_ADMIN' ? 'center' : 'right' }} >{skillSortScore === 0 ? "-" : skillSortScore} {skillSortScore >= 70 ? <i class="fa fa-star" aria-hidden="true" style={{ color: 'gold' }} /> : ""}</td>
              {role === 'SUPER_ADMIN' ? <td style={{ textAlign: 'center' }} >{_.upperCase(candidate.role)}</td> : null}
              {role !== 'SUPER_ADMIN' ? <td style={{ textAlign: 'center' }}><input type="checkbox" checked={shortListedCandidates.includes(candidate)} onChange={() => handleChange(candidate)} /></td> : null}
            </tr>
          </>
        )
      }) : <tr className="text-center">
        <td colspan="8">No data available in table</td>
      </tr>
  }

  const exceedLimit = (limit) => {
    limit = limit ? ` (${limit})` : '';
    setMessage(`You are about to exceed max limit${limit}`);
    setOpen(true)
  }

  const onSelectAllCandidate = () => {
    toast.dismiss();
    if (planCount < _.size(totalCandidates)) {
      exceedLimit(planCount);
      return
    }
    const isReset = _.size(shortListedCandidates) === _.size(totalCandidates);
    const limit = _.sumBy(plans, p => p.residue || 0)
    const count = isReset ? limit : limit - _.size(totalCandidates)
    setPlanCount(count);
    setShortListedCandidates(isReset ? [] : totalCandidates)
  }





  return (
    <>
      <Snackbar
        anchorOrigin={{vertical, horizontal}}
        open={open}
        autoHideDuration={6000}
        TransitionComponent={Fade}
        message={message}
        key={"up"}
        onClose={() => setOpen(false)}
      />
      <Card>
        <CardHeader title={<React.Fragment>
          <Typography style={{ marginBottom: '1.5px' }}><span style={{ fontSize: '30px', fontFamily: 'Baskervville' }}>Filtered Results</span>
            {(shortListedCandidates.length === 0 && isRoleValidation() !== 'SUPER_ADMIN') ? <span style={{ padding: '7px' }} className='black-label pull-right'><div>{planCount}</div>Credits Available</span> : ''}
          </Typography>
        </React.Fragment>}
          action={shortListedCandidates.length > 0 && <span><span style={{ padding: '7px' }} className='black-label pull-left'><div>{planCount}</div>Credits Available</span><button className="brn-sm btn btn-nxt"
            onClick={() => saveShortListedCandidates()} disabled={disableBtn}>Shortlist Candidates</button></span>} />
        <CardContent>
          <div className="row"></div>
          <div className="col-md-12">
            <table className="table tb-hover" id="dataTable">
              <thead className="table-dark-custom" style={{ textAlign: 'right' }}>
                <tr>
                  <th style={{ textAlign: 'center' }} className="col-lg-1 col-xl-1">S.NO</th>
                  <th style={{ textAlign: 'left' }} className="col-lg-3 col-xl-3">Name</th>
                  <th style={{ textAlign: role === 'SUPER_ADMIN' ? 'center' : null }} className="col-lg-1 col-xl-1">SSLC %</th>
                  <th style={{ textAlign: role === 'SUPER_ADMIN' ? 'center' : null }} className="col-lg-1 col-xl-1">HSC %</th>
                  <th style={{ textAlign: role === 'SUPER_ADMIN' ? 'center' : null }} className="col-lg-1 col-xl-1">UG %</th>
                  <th style={{ textAlign: role === 'SUPER_ADMIN' ? 'center' : null }} className="col-lg-3 col-xl-3">SKILLSORT SCORE %</th>
                  {role === 'SUPER_ADMIN' ? <th style={{ textAlign: 'center' }} className="col-lg-2 col-xl-2">ROLE</th> : null}
                  {role !== 'SUPER_ADMIN' ? <th style={{ textAlign: 'center' }} className="col-lg-2 col-xl-2">
                    <input type='checkbox' checked={shortListedCandidates.length === totalCandidates.length} onChange={() => onSelectAllCandidate()} />
                  </th> : null}

                </tr>
              </thead>
              <tbody>
                {renderTable()}
              </tbody>
            </table>
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPagination={onPagination}
              numberOfElements={numberOfElements}
              totalElements={totalSize}
              pageSize={10}
            />

          </div>
        </CardContent>
      </Card>
    </>
  )
}