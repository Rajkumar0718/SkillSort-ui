import React, { useState, useEffect } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { authHeader, errorHandler } from '../../api/Api';
import { toastMessage, ToggleStatus, withLocation } from '../../utils/CommonUtils';
import States from '../../utils/StatesAndDistricts';
import url from '../../utils/UrlConstant';
import { isEmpty, isValidWebSite } from '../../utils/Validation';
import '../SuperAdmin/SuperAdmin.css';
import FormHelperText from '@mui/material/FormHelperText';
import './SuperAdmin.css';
import StatusRadioButton from '../../common/StatusRadioButton';

const AddCollege = (props) => {
  const [college, setCollege] = useState({
    collegeName: '',
    location: '',
    website: '',
    status: 'ACTIVE',
    state: '',
    district: '',
    testCredits: [],
    isInternAllowed: false,
  });

  const [districts, setDistricts] = useState([]);
  const [error, setError] = useState({
    collegeName: false,
    collegeErrorMessage: '',
    location: false,
    locationErrorMessage: '',
    website: false,
    websiteErrorMessage: '',
    district: false,
    districtErrorMessage: '',
    state: false,
    stateErrorMessage: '',
  });

  const [disabled, setDisabled] = useState(false);

  const handleChange = (event, key) => {
    setCollege({ ...college, [key]: event.target.value });
    setError({ ...error, [key]: false });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validateInputs = () => {
      let isValid = true;

      if (isEmpty(college.collegeName?.trim())) {
        setError((prevError) => ({
          ...prevError,
          collegeName: true,
          collegeErrorMessage: isEmpty(college.collegeName) ? 'Field Required !' : 'Enter Valid Input',
        }));
        isValid = false;
      } else {
        setError((prevError) => ({ ...prevError, collegeName: false }));
      }

      if (isEmpty(college.location?.trim())) {
        setError((prevError) => ({
          ...prevError,
          location: true,
          locationErrorMessage: isEmpty(college.location) ? 'Field Required !' : 'Enter Valid Input',
        }));
        isValid = false;
      } else {
        setError((prevError) => ({ ...prevError, location: false }));
      }

      if (!isValidWebSite(college.website)) {
        setError((prevError) => ({ ...prevError, website: true, websiteErrorMessage: 'Invalid Site!' }));
        isValid = false;
      } else {
        setError((prevError) => ({ ...prevError, website: false }));
      }

      if (isEmpty(college.state)) {
        setError((prevError) => ({ ...prevError, state: true, stateErrorMessage: 'Select State !' }));
        isValid = false;
      } else {
        setError((prevError) => ({ ...prevError, state: false }));
      }

      if (isEmpty(college.district)) {
        setError((prevError) => ({ ...prevError, district: true, districtErrorMessage: 'Select District !' }));
        isValid = false;
      } else {
        setError((prevError) => ({ ...prevError, district: false }));
      }

      return isValid;
    };

    if (validateInputs()) {
      setDisabled(true);
      axios
        .post(`${url.COLLEGE_API}/college/save`, college, { headers: authHeader() })
        .then((_res) => {
          if (props.location.pathname.indexOf('edit') > -1) {
            toastMessage('success', 'College Details Updated Successfully..!');
            props.navigate('/collegeadmin');
          } else {
            toastMessage('success', 'College Added Successfully..!');
            props.navigate('/collegeadmin');
          }
        })
        .catch((error) => {
          setDisabled(false);
          errorHandler(error);
        });
    }
  };

  const handleStateChange = (state) => {
    setCollege((prevCollege) => ({ ...prevCollege, state: state.target.value, district: '' }));
    setDistricts(States[state.target.value]);
  };

  const handleDistrictChange = (e) => {
    setCollege((prevCollege) => ({ ...prevCollege, district: e.target.value }));
  };

  useEffect(() => {
    if (props.location.pathname.indexOf('edit') > -1) {
      const editedCollege = _.pick(props.location.state?.college, [
        'id',
        'authUserId',
        'collegeName',
        'mailid',
        'status',
        'state',
        'district',
        'website',
        'testCredits',
        'location',
        'isInternAllowed',
      ]);
      setCollege(editedCollege);
      setDistricts(States[editedCollege.state]);
      getTestCredits(editedCollege.id);
    }
  }, [props.location.pathname, props.location.state]);

  const getTestCredits = (id) => {
    axios
      .get(`${url.ADMIN_API}/testCredit/college/${id}?entityType=COLLEGE`, { headers: authHeader() })
      .then((res) => {
        setCollege((prevCollege) => ({ ...prevCollege, testCredits: res.data.response }));
      });
  };

  const levelCreditHandleChange = (value, key) => {
    const collegeCredits = { level: key, credits: value };
    let testCredits = college.testCredits || [];

    if (_.filter(testCredits, { level: key })?.length > 0) {
      let index = _.findIndex(testCredits, { level: key });

      testCredits = [...testCredits];
      testCredits[index].credits = collegeCredits.credits;
    } else {
      testCredits.push(collegeCredits);
    }

    setCollege({ ...college, testCredits });
  };

  const toggleInternAllowed = (value) => {
    setCollege((prevCollege) => ({ ...prevCollege, isInternAllowed: value }));
  };


  const testLevelCredit = () => _.map([1, 2], (l, key) => (
    <div key={key} className="col-6">
      <div className="row" style={{ lineHeight: '2rem' }}>
        <div className="col-3 col-sm-3 col-md-3 col-lg-3">
          <label className="form-label input-label">Level {l} <span className="required"></span></label>
        </div>
        <div className="col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9">
          <input
            className="profile-page"
            maxLength="50"
            aria-label="default input example"
            style={{ width: '75%' }}
            name="test-credits"
            id="test-credits"
            autoComplete="off"
            type="number"
            placeholder="Enter Test Credits"
            value={_.filter(college.testCredits, { level: l })[0]?.credits}
            onChange={(e) => levelCreditHandleChange(e.target.value, l)}
          />
        </div>
      </div>
    </div>
  ));


  let action = null;
  if (props.location.pathname.indexOf('edit') > -1) {
    action = props.location.state;
  }
  return (
    <main className="main-content bcg-clr">
      <div>
        <div className="container-fluid cf-1">
          <div className="card-header-new"> <span>{action !== null ? 'Update' : 'Add'} College</span> </div>
          <div className="row">
            <div className="col-md-12">
              <div className="table-border-cr">
                <form className="email-compose-body" onSubmit={handleSubmit}>
                  <div className="send-header">
                    <div className="form-group row">
                      <div className="col-6 col-lg-6 col-sm-6 col-xl-6">
                        <div className='row'>
                          <div className='col-3 col-sm-3 col-md-3 col-lg-3'>
                            <label className="form-label input-label">College Name <span className='required'></span>
                              <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{error.collegeName ? error.collegeErrorMessage : null}</FormHelperText>
                            </label>
                          </div>
                          <div className='col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9'>
                            <input className="profile-page " maxLength="50"
                              onChange={(e) => handleChange(e, 'collegeName')}
                              value={college.collegeName} aria-label="default input example"
                              name='collegeName' id='college' autoComplete='off' type="text" placeholder='Enter College Name' style={{ width: "75%" }} />
                          </div>
                        </div>
                      </div>
                      <div className="col-6 col-lg-6 col-sm-6 col-xl-6">
                        <div className='row'>
                          <div className='col-3 col-sm-3 col-md-3 col-xl-3 col-lg-3'>
                            <label className="form-label input-label">Website<span className='required'></span>
                              <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{error.website ? error.websiteErrorMessage : null}</FormHelperText>
                            </label>
                          </div>
                          <div className='col-9 col-sm-9 col-xl-9 col-md-9 col-lg-9'>
                            <input className="profile-page" maxLength="50"
                              onChange={(e) => handleChange(e, 'website')}
                              value={college.website}
                              name='website' id='college' type="text" autocomplete='off' placeholder='Website' style={{ width: "75%" }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-6 col-lg-6 col-sm-6 col-xl-6">
                        <div className='row'>
                          <div className='col-3 col-sm-3 col-md-3 col-lg-3'>
                            <label className="form-label input-label" >State<span className='required'></span>
                              <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{error.state ? error.stateErrorMessage : null}</FormHelperText>
                            </label>
                          </div>
                          <div className='col-9 col-sm-9 col-xl-9 col-md-9 col-lg-9'>
                            <select className="profile-page" style={{ width: '75%', marginBottom: '10px' }}
                              value={college.state} onChange={(e) => handleStateChange(e)}>
                              <option hidden selected value="">Select State</option>
                              {_.map(Object.keys(States), (state) => <option key={state} value={state}>{state}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="col-6 col-lg-6 col-sm-6 col-xl-6">
                        <div className='row'>
                          <div className='col-3 col-sm-3 col-md-3 col-lg-3'>
                            <label className="form-label input-label">District<span className='required'></span>
                              <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{error.district ? error.districtErrorMessage : null}</FormHelperText>
                            </label>
                          </div>
                          <div className='col-9 col-sm-9 col-xl-9 col-md-9 col-lg-9' >
                            <select className="profile-page" style={{ width: '75%', marginBottom: '10px' }}
                              onChange={(e) => handleDistrictChange(e)}
                              value={college.district}>
                              <option hidden selected value="">Select district</option>
                              {_.map(districts, (district) => <option key={district} value={district}>{district}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-6 col-lg-6 col-sm-6 col-xl-6">
                        <div className='row'>
                          <div className='col-3 col-sm-3 col-md-3 col-lg-3'>
                            <label className="form-label input-label" >Address<span className='required'></span>
                              <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{error.location ? error.locationErrorMessage : null}</FormHelperText>
                            </label>
                          </div>
                          <div className='col-9 col-sm-9 col-xl-9 col-md-9 col-lg-9' >
                            <textarea className="profile-page"
                              onChange={(e) => handleChange(e, 'location')}
                              value={college.location}
                              name='location' id='college' type="text" autocomplete='off' placeholder='Address' style={{ width: "75%" }} />
                          </div>
                        </div>
                      </div>
                      <div className="col-6 col-lg-6 col-sm-6 col-xl-6">
                        <div className='row'>
                          <div className='col-3 col-sm-3 col-md-3 col-lg-3'>
                            <label className="form-label input-label" >Intern<span className='required'></span>
                            </label>
                          </div>
                          <div className='col-9 col-sm-9 col-xl-9 col-md-9 col-lg-9' >
                            <span style={{ color: 'red', fontSize: '13px' }}>NO</span><ToggleStatus checked={college.isInternAllowed} onChange={(e) => toggleInternAllowed(!college.isInternAllowed)} /><span style={{ color: 'green', fontSize: '13px' }}>YES</span>
                          </div>
                        </div>
                      </div>
                      {action !== null ? (
                        <div className="col-lg-6 col-6 col-sm-6 col-md-6 col-xl-6">
                          <div className="row">
                            <StatusRadioButton
                              handleChange={handleChange}
                              status={college.status}
                              style={{marginTop: "0.5rem"}}
                            />
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                      <label style={{ color: 'black', fontSize: '25px' }} className='setting-title'>Test Credits <span className='required'></span></label>
                      <div className="row" >
                        {testLevelCredit()}
                      </div>
                    </div>
                    <div className="row">
                      <div className="mb-3 col-lg-11" style={{ paddingRight: '7px' }}>
                        <button type="submit" disabled={disabled} className="btn btn-sm btn-prev" style={{ float: 'right' }}>{action !== null ? 'Update' : 'Add'}</button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


export default withLocation(AddCollege);
