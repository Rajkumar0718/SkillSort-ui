import React, { useState, useEffect } from 'react';
import FormHelperText from '@mui/material/FormHelperText';
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import AutoComplete from "../../common/AutoComplete";
import CertificationModal from "./CertificationModal";
import ViewProfile from "../Admin/ViewProfile";
import { authHeader, errorHandler } from '../../api/Api';
import { toastMessage, ToggleStatus } from '../../utils/CommonUtils';
import States from '../../utils/StatesAndDistricts';
import { isEmpty, isVaildnum, isValidMobileNo, isValidName } from "../../utils/Validation";
import  url  from '../../utils/UrlConstant';
import skillsort from '../../assests/images/av.jpg';
import DatePick from '../../common/DatePick';
import { useNavigate } from 'react-router-dom';

const StudentFirstTimeLogin = () => {
  const data = JSON.parse(localStorage.getItem('user'));
  const [student, setStudent] = useState({
    yop: new Date(),
    email: data.email,
    firstName:'',
    lastName:'',
    gender:'',
    ug:'',
    pg:'',
    sslc:'',
    hsc:''
  });
  const [collegeName, setCollegeName] = useState('');
  const [currentYear, setCurrentYear] = useState('');
  const [departments, setDepartments] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [department, setDepartment] = useState('');
  const [address, setAddress] = useState('');
  const [profilePicture, setProfilePicture] = useState(skillsort);
  const [resume, setResume] = useState(null);
  const [yop, setYop] = useState(moment().format('YYYY'));
  const [openModal, setOpenModal] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [certificateData, setCertificateData] = useState(null);
  const [viewProfile, setViewProfile] = useState(false);
  const navigate = useNavigate()

  const [error, setError] = useState({
    firstName: false,
    firstNameErrorMessage: '',
    lastName: false,
    lastNameErrorMessage: '',
    gender: false,
    genderErrorMessage: '',
    ug: false,
    ugErrorMessage: '',
    pg: false,
    pgErrorMessage: '',
    sslc: false,
    sslcErrorMessage: '',
    hsc: false,
    hscErrorMessage: '',
    resume: false,
    resumeErrorMessage: '',
    department: false,
    departmentErrorMessage: '',
    phone: false,
    phoneErrorMessage: '',
    yop: false,
    yopErrorMessage: '',
    state: false,
    stateErrorMessage: '',
    district: false,
    districtErrorMessage: '',
    address: false,
    addressErrorMessage: '',
    certificates: false,
    certificatesErrorMessage: '',
  });

  useEffect(() => {
    getStudent();
    // handlePageViewEvent();
    getCollege();
    getDepartments();
  }, []);

  const getStudent = () => {
    axios.get(`${url.COLLEGE_API}/student/getStudent?email=${data.email}`, { headers: authHeader() })
      .then(res => {
        localStorage.setItem("studentId", res.data.response.id)
        if (!isEmpty(res.data.response?.department) && (window.location.pathname === '/student')) {
          res.data.response?.isOpenForInterview ? navigate('/student/student-test') : navigate('/student/company-offer');
        }
        else {
          const student = res.data.response;
          student.isIntern = (student.isIntern === null && student.isInternAllowed) ? student.isInternAllowed : student.isIntern;
          setStudent(student);
        }
        setStudent(res.data.response)
      })
      .catch(error => {
        errorHandler(error);
      });
  };

  const getCollege = () => {
    axios.get(`${url.COLLEGE_API}/college/get?collegeId=${data.companyId}`, { headers: authHeader() })
      .then(res => {
        setCollegeName(res.data.response.collegeName);
      })
      .catch(error => {
        errorHandler(error);
      });
  };

  const getDepartments = () => {
    axios.get(`${url.ADMIN_API}/department?status=ACTIVE`, { headers: authHeader() })
      .then(res => {
        setDepartments(res.data.response);
      })
      .catch(error => {
        errorHandler(error);
      });
  };

  // const handlePageViewEvent = () => {
  //   window.dataLayer.push({
  //     event: 'Student_Profile_PageView',
  //     pagePath: window.location.href
  //   });
  // };

  const handleStateChange = (value) => {
    setStudent((prevStudent) => ({
      ...prevStudent,
      state: value,
      district: ''
    }));

    setError((prevError) => ({
      ...prevError,
      state: false
    }));

    setDistricts(States[value] || []);
  };


  const handleDistrictChange = (value) => {
    setStudent((prevStudent) => ({
      ...prevStudent,
      district: value,
    }));
    setError((prevError) => ({
      ...prevError,
      district: false,
    }));
  };

  const handleChange = (event, key) => {
    if (key === 'department') {
      setStudent((prevStudent) => ({
        ...prevStudent,
        department: event?.departmentName,
      }));
    } else {
      setStudent((prevStudent) => ({
        ...prevStudent,
        [key]: event.target.value,
      }));
    }

    setError((prevError) => ({
      ...prevError,
      [key]: false,
    }));
  };

  const getCertificate = () => {
    axios.get(`${url.COLLEGE_API}/certificate?studentId=${student?.id}`, { headers: authHeader() })
      .then(res => {
        setCertificateData(res.data.response);
        setViewProfile(true);
      }).catch(e => {
        errorHandler(e);
      })
  };

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log(event)
    let er = error
    student.department = student.department ? student.department : department;
    if (isEmpty(student.firstName?.trim()) || !isValidName(student.firstName)) {
      er.firstName = true;
      er.firstNameErrorMessage = isEmpty(student.firstName) ? "Field Required !" : "Enter Valid Input";

    } else {
      er.firstName = false;
    }

    if (isEmpty(student.lastName?.trim())) {
      er.lastName = true;
      er.lastNameErrorMessage = isEmpty(student.lastName) ? "Field Required !" : "Enter Valid Input";

    }
    else {
      er.lastName = false;
    }
    if (isEmpty(student.department)) {
      er.department = true;
      er.departmentErrorMessage = "Select department";
    } else {
      er.department = false;
    }
    if (isEmpty(student.resume)) {
      if (resume === null) {
        er.resume = true;
        er.resumeErrorMessage = isEmpty(resume) ? "Resume required" : "Upload file less than 1Mb"
      } else {
        er.resume = false;
      }
    }
    if (isEmpty(student.sslc) || isVaildnum(student.sslc) || student.sslc > 100) {
      er.sslc = true;
      er.sslcErrorMessage = isEmpty(student.sslc) ? "SSLC% Required" : "Enter valid input";
    } else {
      er.sslc = false;
    }
    if (isEmpty(student.hsc) || isVaildnum(student.hsc) || student.hsc > 100) {
      er.hsc = true;
      er.hscErrorMessage = isEmpty(student.hsc) ? "HSC% Required" : "Enter valid input";
    } else {
      er.hsc = false;
    }

    if (isEmpty(student.ug) || isVaildnum(student.ug) || student.ug > 100) {
      er.ug = true;
      er.ugErrorMessage = isEmpty(student.ug) ? "UG% Required" : "Enter valid input";
    } else {
      er.ug = false;
    }
    if ((!isEmpty(student.pg) && (isVaildnum(student.pg) || student.pg > 100))) {
      er.pg = true;
      er.pgErrorMessage = isEmpty(student.pg) ? "PG% Required" : "Enter valid input";
    } else {
      er.pg = false;
    }

    if (isEmpty(student.state)) {
      er.state = true;
      er.stateErrorMessage = "Field Required!"
    } else {
      er.state = false;
    }

    if (isEmpty(student.district)) {
      er.district = true;
      er.districtErrorMessage = "Field Required!"
    } else {
      er.district = false;
    }

    if (isEmpty(student.address)) {
      er.address = true;
      er.addressErrorMessage = "Field Required!"
    } else {
      er.address = false;
    }

    if (isEmpty(student.gender)) {
      er.gender = true;
      er.genderErrorMessage = "Select Gender";
    } else {
      er.gender = false;
    }
    if (isEmpty(student.yop)) {
      er.yop = true;
      er.yopErrorMessage = "Select Year Of Passing"
    } else {
      er.yop = false;
    }
    if (isEmpty(student.phone) && !isValidMobileNo(student.phone)) {
      er.phone = true;
      er.phoneErrorMessage = 'Field Required!'
    } else {
      er.phone = false;
    }
    setError(prevError => ({ ...prevError, ...er }));
    if (!error.department && !error.resume && !error.gender && !error.phone && !error.firstName && !error.lastName && !error.hsc && !error.sslc && !error.yop && !error.pg && !error.ug && !error.state && !error.district && !error.address) {
      setDisabled(true);
      const formData = new FormData();
      if (!_.isNumber(student.yop))
        student.yop = moment(student.yop).year();
      else
        student.yop = student.yop === 0 ? moment().year() : student.yop;
      formData.append('resume', resume);
      formData.append('student', JSON.stringify(student));
      axios.post(` ${url.COLLEGE_API}/student/save`, formData, { headers: authHeader() })
        .then(res => {
          toastMessage('success', "Profile Updated successfully..!");
          navigate('/student/student-test');
          let user = JSON.parse(localStorage.getItem('user'))
          user.username = student.firstName + ' ' + student.lastName
          localStorage.removeItem('user')
          localStorage.setItem('user', JSON.stringify(user))
          window.location.reload()
        })
        .catch(err => {
          setDisabled(false);
          errorHandler(err);
        })
    }
  };

  const onFileChange = (event) => {
    const er = {error};
    let pdf = event.target.files[0];
    if (pdf?.size > 1048576 || pdf.type !== "application/pdf") {
      setResume(null);
      er.resume = true;
      er.resumeErrorMessage = pdf.type !== "application/pdf" ? "Upload Pdf File only" : "File size must less than 1MB";
    } else {
      er.resume = false;
      setResume(event.target.files[0]);
    }
    setError(er);
  };

  const toggleInternAllowed = (value) => {
    setStudent((prevStudent) => ({
      ...prevStudent,
      isIntern: value,
    }));
  };

  const getDateFromYop = () => {
    let currentYear = new Date().getFullYear();
    let studentYop = student.yop;

    if (_.isDate(studentYop)) return studentYop;

    if (studentYop) {
      let diff = currentYear - studentYop;
      if (diff < 0) {
        // If studentYop is a future year, create a new Date with that year
        return new Date(studentYop, 0);
      } else {
        // If studentYop is a past or present year, subtract the diff from the current year
        return moment().subtract(diff, 'years').toDate();
      }
    }

    // If studentYop is not defined, return the current date
    return new Date();
  };

  const onClickOpenModel = () => {
    if (!openModal) {
      document.addEventListener('click', handleOutsideClick, false);
    } else {
      document.removeEventListener('click', handleOutsideClick, false);
    }
    setOpenModal(!openModal)
  };

  const handleOutsideClick = (e) => {
    if (e.target.className === 'modal fade show') {
      setOpenModal(!openModal)
    }
  };

  const close = () => {
    setViewProfile(false);
  };

  const onCloseModal = (isCertficateUploaded) => {
    setOpenModal(!openModal)
    if (typeof isCertficateUploaded === 'boolean')
      getStudent()
  };

  const handleOnDateChange = (event) => {
    setStudent(prevState => ({ ...prevState, yop: event?.getFullYear() }));


  };

  return (
    <>
      {openModal ? <CertificationModal studentId={student.id} onCloseModal={onCloseModal} isNewStudent={!student.resume} /> : ''}
      {viewProfile && <ViewProfile certificateData={certificateData} onClose={close} />}
      <div className='bg-image'>
        <main className="main-content bcg-clr">
          <div className='card-header-new'>
            <span>Update Your Profile!</span>
          </div>
          <div className="row" style={{ lineHeight: '3rem' }}>
            <div className="col-md-12">
              <form className="email-compose-body" onSubmit={handleSubmit}>
                <div className="row" style={{ height: '100%', overflow: 'hidden' }}>
                  <div className="send-header" style={{ marginLeft: '12rem', width: '70%' }}>
                    <div className="row">
                      <div className="col-2 competitor-input">
                        <label className="form-label text-label" for="form12">First Name*
                          <FormHelperText className='helper helper-login'>{error.firstName ? error?.firstNameErrorMessage : null}</FormHelperText></label>
                      </div>
                      <div className="col-4">
                        <input className="profile-page" type='name' label='First Name' name='username' maxLength="50" value={student?.firstName} onChange={(e) => handleChange(e, 'firstName')} aria-label="default input example"></input>
                      </div>
                      <div className="col-2 competitor-input">
                        <label className="form-label text-label" for="form12">Last Name
                          <FormHelperText className='helper helper-login'>{error.lastName ? error?.lastNameErrorMessage : null}</FormHelperText></label>
                      </div>
                      <div className="col-4">
                        <input className="profile-page" type='name' label='Last Name' name='lastName' maxLength="50" value={student?.lastName} onChange={(e) => handleChange(e, 'lastName')} id='lastName' aria-label="default input example"></input>
                      </div>
                      <div className="col-2 competitor-input">
                        <label className="form-label text-label" for="form12">Email*</label>
                      </div>
                      <div className="col-4">
                        <input className="profile-page" type='name' label='Email' name='email' maxLength="50" onChange={(e) => handleChange(e, 'email')} value={student?.email} id='email' aria-label="default input example" readOnly ></input>
                      </div>
                      <div className="col-2 competitor-input">
                        <label className="form-label text-label" for="form12">Phone*</label>
                      </div>
                      <div className="col-4">
                        <input className="profile-page" type='name' label='Phone' name='phone' maxLength="10" value={student?.phone} onChange={(e) => handleChange(e, 'phone')} id='phone' aria-label="default input example" ></input>
                      </div>
                      <div className="col-2 competitor-input">
                        <label className="form-label text-label" for="form12">State*
                          <FormHelperText className='helper helper-login'>{error.state ? error.stateErrorMessage : null}</FormHelperText></label>
                      </div>
                      <div className="col-4">
                        <AutoComplete
                          displayLabel={"Select state"}
                          width={250}
                          value={student?.state}
                          isObject={false}
                          selectExam={handleStateChange}
                          data={Object.keys(States)} >
                        </AutoComplete>
                      </div>
                      <div className="col-2 competitor-input">
                        <label className="form-label text-label" for="form12">District*
                          <FormHelperText className='helper helper-login'>{error.district ? error.districtErrorMessage : null}</FormHelperText></label>
                      </div>
                      <div className="col-4">
                        <AutoComplete
                          displayLabel={"Select District"}
                          width={250}
                          value={student?.district}
                          isObject={false}
                          selectExam={handleDistrictChange}
                          data={districts}>
                        </AutoComplete>

                      </div>
                      <div className='col-2 competitor-input'>
                        <label className="form-label text-label" for="form12">Address*
                          <FormHelperText className='helper helper-login'>{error.address ? error.addressErrorMessage : null}</FormHelperText></label>
                      </div>
                      <div className='col-4'>
                        <input className="profile-page" type='name' label='Address' name='Address' onChange={(e) => handleChange(e, 'address')} id='address' value={student?.address} aria-label="default input example"></input>
                      </div>
                      <div className="col-2 competitor-input">
                        <label className="form-label text-label">Gender*
                          <FormHelperText className="helper helper-login">{error.gender ? error.genderErrorMessage : null}</FormHelperText></label>
                      </div>
                      <div className="col-4" style={{ paddingLeft: '1rem' }}>
                        <div className="form-check form-check-inline">
                          <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="MALE" checked={student?.gender === "MALE"} style={{ marginTop: '16px' }} onClick={(event) => { handleChange(event, "gender") }} />
                          <label className="form-check-label text-label" for="inlineRadio1">Male</label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="FEMALE" checked={student?.gender === "FEMALE"} style={{ marginTop: '16px' }} onClick={(event) => { handleChange(event, "gender") }} />
                          <label className="form-check-label text-label" for="inlineRadio2">Female</label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="OTHERS" checked={student?.gender === "OTHERS"} style={{ marginTop: '16px' }} onClick={(event) => { handleChange(event, "gender") }} />
                          <label className="form-check-label text-label" for="inlineRadio3">Others</label>
                        </div>
                      </div>
                      <div className="col-2 competitor-input">
                        <label className="form-label text-label" style={{ marginBottom: '0' }}>Department*
                          <FormHelperText className="helper helper-login">{error.department ? error.departmentErrorMessage : null}</FormHelperText></label>
                      </div>
                      <div className="col-4">
                        {isEmpty(student?.department) ?
                          <AutoComplete
                            displayLabel={"Select Department"}
                            width={250}
                            value={department}
                            selectExam={(e) => handleChange(e, 'department')}
                            data={departments}
                            isObject={true}
                            displayValue={"departmentName"} >
                          </AutoComplete> : <input className="profile-page" maxLength="50"
                            value={student?.department} readOnly aria-label="default input example"
                            name='department' id='department' autoComplete='off' type="text" placeholder='Select Department' style={{ width: "250px" }}
                          />
                        }
                      </div>

                      <div className="col-2 competitor-input">
                        <label className="form-label text-label" for="form12">College*</label>
                      </div>
                      <div className="col-4">
                        <input className="profile-page" type='name' label='College Name' name='collegeName' maxLength="50" onChange={(e) => handleChange(e, 'collegeName')} id='collegeName' value={collegeName} aria-label="default input example" readOnly ></input>
                      </div>
                      <div className="col-2 competitor-input">
                        <label className="form-label text-label" for="form12">SSLC%*
                          <FormHelperText className='helper helper-login'>{error.sslc ? error.sslcErrorMessage : null}</FormHelperText></label>
                      </div>
                      <div className="col-4">
                        <input className="profile-page" type='number' label='SSLC %' name='sslcPercentage' maxLength="5" min={1} max={100} onChange={(e) => handleChange(e, 'sslc')} value={student?.sslc} id='SSLC' aria-label="default input example" ></input>
                      </div>
                      <div className="col-2 competitor-input">
                        <label className="form-label text-label" for="form12" style={{ marginBottom: '0px', minHeight: '32px', height: '32px' }}>HSC%*
                          <FormHelperText className='helper helper-login'>{error.hsc ? error.hscErrorMessage : null}</FormHelperText></label>
                      </div>
                      <div className="col-4">
                        <input className="profile-page" type='number' label='HSC' name='hscPercentage' maxLength="5" min={1} max={100} onChange={(e) => handleChange(e, 'hsc')} value={student?.hsc} id='hscPercentage' aria-label="default input example"></input>
                      </div>
                      <div className="col-2 competitor-input">
                        <label className="form-label text-label" for="form12" style={{ marginBottom: '0px', minHeight: '32px', height: '32px' }}>UG%*
                          <FormHelperText className="helper helper-login">{error.ug ? error.ugErrorMessage : null}</FormHelperText></label>
                      </div>
                      <div className="col-4">
                        <input className="profile-page" type='number' label='UG %' name='ugPercentage' maxLength="5" min={1} max={100} onChange={(e) => handleChange(e, 'ug')} value={student?.ug} id='hscPercentage' aria-label="default input example"></input>
                      </div>
                      <div className="col-2 competitor-input">
                        <label className="form-label text-label" for="form12">PG%<FormHelperText className="helper helper-candidate">{error.pg ? error.pgErrorMessage : null}</FormHelperText></label>
                      </div>
                      <div className="col-4">
                        <input className="profile-page" type='number' label='PG%' name='pgPercentage' maxLength="5" min={1} max={100} onChange={(e) => handleChange(e, 'pg')} value={student?.pg} id='pgPercentage' aria-label="default input example" ></input>
                      </div>
                      <div className="col-2 competitor-input">
                        <label className="form-label text-label" style={{ marginBottom: 0 }}>Year of Passing*
                          <FormHelperText className='helper helper-login'>{error.yop ? error.yopErrorMessage : null}</FormHelperText></label>
                      </div>
                      <div className="col-4">
                        <DatePick
                          className='profile-page'
                          style={{ border: 'none' }}
                          views={["year"]}
                          minDate={new Date().setFullYear(new Date().getFullYear() - 5)}
                          maxDate={new Date().setFullYear(new Date().getFullYear() + 1)}
                          value={getDateFromYop()}
                          inputProps={{
                            style: { padding: '0px', paddingBottom: '0.2rem', fontSize: '13px', color: 'black', fontWeight: '500', fontFamily: 'Montserrat' },
                          }}
                          onChange={handleOnDateChange}
                        />
                      </div>
                      {
                        <><div className="col-2 competitor-input">
                          <label className="form-label text-label" for="form12">Intern
                          </label>
                        </div>
                          <div className="col-4">
                            <span style={{ color: 'red', fontSize: '13px' }}>NO</span><ToggleStatus checked={student.isIntern} onChange={(e) => toggleInternAllowed(!student.isIntern)} /><span style={{ color: 'green', fontSize: '13px' }}>YES</span>
                          </div></>}
                      <div className="col-2 competitor-input">
                        <label className="form-label text-label">Resume*
                          <FormHelperText className="helper helper-login">{error.resume ? error.resumeErrorMessage : null}</FormHelperText></label>
                      </div>
                      <div class="col-4" style={{ marginTop: '7px' }}>
                        <input type="file" style={{ width: '250px' }} class="form-control" id="inputGroupFile02" onChange={onFileChange} accept={"application/pdf"}></input>
                      </div>
                      <div className="col-2 competitor-input">
                        <label className="form-label text-label">Certificate
                          <FormHelperText className="helper helper-login">{error.certificates ? error.certificatesErrorMessage : null}</FormHelperText></label>
                      </div>
                      <div className="col-4" style={{ display: 'flex' }}>
                        <button type="button" onClick={onClickOpenModel} data-toggle="tooltip" data-placement="top" title="Add Certificate" className="btn btn-outline-primary border-0 rounded-circle"><i className="fa fa-plus-circle fa-1x " aria-hidden="true" ></i></button>
                        {!student.certificatesExists ?
                          <input className="profile-page" value={"Upload Certificate"} aria-label="default input example" style={{ marginLeft: '1rem', width: '200px' }}></input> :
                          <button type="button" onClick={getCertificate} className='btn btn-sm btn-nxt' style={{ fontFamily: 'Montserrat' }}>View Certificate</button>
                        }
                      </div>
                      <div>
                        <button type="submit" className="btn btn-sm btn-nxt" disabled={disabled} style={{ float: 'right', marginRight: '1.8rem', marginTop: '1rem' }}>Update</button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
export default StudentFirstTimeLogin;
