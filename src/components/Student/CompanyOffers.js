import React, { useEffect, useState } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { authHeader, errorHandler } from '../../api/Api';
import { fallBackLoader, toastMessage, ToggleStatus } from '../../utils/CommonUtils';
import  url  from '../../utils/UrlConstant';
import { isRoleValidation } from '../../utils/Validation';

const MAIN_COLORS = ["#3B489E", "#F05A28"];
const SHADE_COLORS = ["#F5F6FF", "#FFF7F5"];
const USER_STATUS = [{ name: 'ACCEPTED', color: 'green' }, { name: 'DECLINED', color: 'red' }];

const CompanyOffers = () => {
    const [editCompany, setEditCompany] = useState({});
    const [selectCompany, setSelectCompany] = useState({});
    const [offeredCompanies, setOfferedCompanies] = useState([]);
    const [showOfferContent, setShowOfferContent] = useState(false);
    const [role, setRole] = useState(isRoleValidation());
    const [base64CompanyLogo, setBase64CompanyLogo] = useState([]);
    const [loading, setLoading] = useState(false);
    const [interviewStatus, setInterviewStatus] = useState(false);

  useEffect(() => {
    getOfferedCompanies();
    getOpenForInterviewStatus();
    // handlePageViewEvent();
  }, []);

  // const handlePageViewEvent = () => {
  //   window.dataLayer.push({
  //     event: 'Student_CompanyOffers_PageView',
  //     pagePath: window.location.href,
  //   });
  // };

  const getOfferedCompanies = () => {
    const role = isRoleValidation();
    const basePath = role === 'COLLEGE_STUDENT'
      ? `${url.COLLEGE_API}/student/offered-companies`
      : `${url.COMPETITOR_API}/competitor/offered-companies`;

    axios.get(basePath, { headers: authHeader() })
      .then((res) => {
        setOfferedCompanies(_.orderBy(res.data.response, ["userResponseStatus"], ['desc']));
        getCompanyLogo(_.map(res.data.response || [], (company) => company.companyId));
      })
      .catch((er) => {
        errorHandler(er);
      });
  };

  const getCompanyLogo = (ids) => {
    axios.get(`${url.ADMIN_API}/company/logo?companyIds=${ids}`, { headers: authHeader() })
      .then((res) => {
        // Handle response for company logos
      })
      .catch((er) => {
        errorHandler(er);
      });
  };

  const getOpenForInterviewStatus = () => {
    const role = isRoleValidation();
    const basePath = role === 'COLLEGE_STUDENT'
      ? `${url.COLLEGE_API}/student/open-for-interview`
      : `${url.COMPETITOR_API}/competitor/open-for-interview`;

    axios.get(basePath, { headers: authHeader() })
      .then((res) => {
        setInterviewStatus(res.data.response);
      })
      .catch((er) => {
        errorHandler(er);
      });
  };

  const setOpenForInterviewStatus = () => {
    const role = isRoleValidation();
    const basePath = role === 'COLLEGE_STUDENT'
      ? `${url.COLLEGE_API}/student/open-for-interview`
      : `${url.COMPETITOR_API}/competitor/open-for-interview`;

    axios.post(`${basePath}?status=${!interviewStatus}`, {}, { headers: authHeader() })
      .then((_res) => {
        getOpenForInterviewStatus();
        toastMessage('success', 'InterviewStatus Updated Successfully..!');
      })
      .catch((er) => {
        errorHandler(er);
      });
  };

  const handleChange = (existing, field, value) => {
    const company = _.cloneDeep(existing);
    company[field] = value;
    setEditCompany(company);
  };

  const handleSubmit = () => {
    const role = isRoleValidation();
    const basePath = role === 'COLLEGE_STUDENT'
      ? `${url.COLLEGE_API}/student/update-status`
      : `${url.COMPETITOR_API}/competitor/update-status`;

    axios.post(basePath, editCompany, { headers: authHeader() })
      .then((_res) => {
        setEditCompany({});
        setSelectCompany({});
        getOfferedCompanies();
      })
      .catch((er) => {
        errorHandler(er);
      });
  };

  const getColor = (company, key) => selectCompany.companyId === company.companyId ? MAIN_COLORS[key % 2] : SHADE_COLORS[key % 2];

  const getUserStatusColor = (name) => (_.find(USER_STATUS, s => s.name === name) || {}).color || "#FFF";

  const companyCount = _.size(offeredCompanies);

  return (
    <div>
      <span style={{ fontSize: '2rem' }} className='username'>Offers Received</span>
      {
        companyCount !== 0 &&
        <span className='pull-right'>
          <label>Open for Interview &nbsp;
            <span style={{ color: 'red' }}>NO</span>
          </label>
          <ToggleStatus checked={!interviewStatus} onChange={setOpenForInterviewStatus} />
          <span style={{ color: 'green' }}>YES</span>
        </span>
      }
      <div style={{ padding: '1rem 2rem' }}>
        {
          companyCount !== 0 &&
          <span className='setting-title'>Congrats..!{' '}
            <span className='offer-card-content setting-title'>
              You have received offers from <span>{companyCount}</span> {companyCount === 1 ? 'company' : 'companies'}.
            </span>
          </span>
        }
      </div>
      <div style={{ padding: '2rem' }} className='row'>
        {
          offeredCompanies.length > 0 ?
            offeredCompanies.map((company, key) =>
              <div key={key} className='col-12 col-sm-6 col-md-4 col-lg-4 col-xl-4'>
                <div
                  style={{
                    background: SHADE_COLORS[key % 2],
                    border: '1px solid black',
                    borderRadius: '15px',
                    padding: '1rem 2rem',
                    boxShadow: `1px 1px ${MAIN_COLORS[key % 2]}`,
                    height: '16.5rem',
                    borderColor: getColor(company, key),
                  }}
                  onClick={() => setSelectCompany(company)}
                >
                  <div className='company-card-head'>
                    <img
                      style={{ width: '60px' }}
                      alt='logo'
                      src={`data:image/png;base64,${base64CompanyLogo[company.companyId]}`}
                    />
                    {company.userResponseStatus ?
                      <span style={{ color: getUserStatusColor(company.userResponseStatus) }}>
                        {company.userResponseStatus}
                      </span> :
                      <span className='dropdown' style={{ marginLeft: '0.5rem' }}>
                        <span
                          type="button"
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          <span>
                            {editCompany.companyId === company.companyId ?
                              editCompany.userResponseStatus || "Update status" : "Update status"}
                            <i style={{ marginLeft: "0.5rem" }} className="fa fa-caret-down" aria-hidden="true"></i>
                          </span>
                        </span>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                          {USER_STATUS.map((v) =>
                            <option
                              key={v.name}
                              className="dropdown-item"
                              style={{ color: v.color }}
                              onClick={() => handleChange(company, 'userResponseStatus', v.name)}
                              value={v.name}
                            >
                              {v.name}
                            </option>)}
                        </div>
                      </span>
                    }
                  </div>
                  <div style={{ marginBottom: "0.5rem" }}>Comment :</div>
                  {company.userResponseStatus ?
                    <div style={{ width: '310px', height: '65px', overflow: 'auto' }}>{company.comment}</div> :
                    <div style={{ width: '100%' }}>
                      <textarea
                        disabled={editCompany.companyId !== company.companyId || !editCompany.userResponseStatus}
                        value={editCompany.companyId === company.companyId ? editCompany.comment || "" : ""}
                        className='comment-box'
                        onChange={(e) => handleChange(editCompany, 'comment', e.target.value)}
                      />
                    </div>}
                  {company.userResponseStatus ? null : <>
                    <button
                      className='btn btn-sm btn-prev pull-right'
                      style={{ marginTop: "0.5rem" }}
                      onClick={handleSubmit}
                      disabled={loading || !_.trim(editCompany.comment) || editCompany.companyId !== company.companyId}
                    >
                      submit
                    </button>
                    <div style={{ clear: "both" }} />
                  </>}
                </div>
              </div>
            )
            :
            <div style={{ textAlign: 'center', width: '100%', marginTop: '5rem' }}>
              <h5>No Data Found</h5>
            </div>
        }
      </div>
    </div>
  );
};

export default CompanyOffers;
