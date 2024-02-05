import { Card, CardContent, CardHeader, Collapse, IconButton, styled, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from "axios";
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from "react";
import { authHeader, errorHandler } from "../../api/Api";
import States from "../../utils/StatesAndDistricts";
import { isRoleValidation } from "../../utils/Validation";
import AdvSearchCandidates from "./AdvSearchCandidates";
import url from '../../utils/UrlConstant';
import AutoComplete from '../../common/AutoComplete'
import MultiSelectDropDown from "../../utils/MultiSelectDropDown";


const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function AdvSearch(props) {

  const [sslc, setSslc] = useState();
  const [hsc, setHsc] = useState();
  const [ug, setUg] = useState();
  const [states, setStates] = useState("")
  const [districts, setDistricts] = useState([]);
  const [technologies, setTechnologies] = useState([])
  const [yop, setYop] = useState([]);
  const [selectedYop, setSelectedYop] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [average, setAverage] = useState('')
  const [candidates, setCandidates] = useState([]);
  const [expanded, setExpanded] = useState(true);
  const [natureOfJob, setNatureOfJob] = useState('FULL TIME');
  const [role, setRole] = useState('STUDENT');
  const [showAdvTable, setShowAdvTable] = useState(false);
  const [colleges, setColleges] = useState([]);
  const [collegeId, setCollegeId] = useState('');
  const [college, setCollege] = useState({});
  const [technology, setTechnology] = useState('');
  const [isStudent, setIsStudent] = useState(true);


  const handleExpandClick = () => {
    setExpanded(!expanded);
  };


  useEffect(() => {
    handleCandidateFiltering_PageViewEventTrack()
    axios.get(`${url.ADMIN_API}/department?status=ACTIVE`, { headers: authHeader() })
      .then(res => setDepartments(res.data.response))
      .catch(error => errorHandler(error));
    setYearRange();
    getCollege();
    getSections();
  }, [])

  const handleCandidateFiltering_PageViewEventTrack =()=>{
    window.dataLayer.push({
      event: 'HR_CandidateFiltering_PageView'
    });
  }

  const getCollege = () => {
    axios.get(` ${url.COLLEGE_API}/college/list?status=${'ACTIVE'}`, { headers: authHeader() })
      .then((res) => {
        setColleges(res.data.response)
      })
      .catch(error => {
        errorHandler(error);
      })
  }
  const handleChange = (event, isClearAll) => {
    if (!states) return;
    if (isClearAll) {
      setDistricts([])
      return;
    }
    const value = event.target.value;
    if (value[value.length - 1] === "all") {
      setDistricts(districts.length === States[states].length ? [] : States[states]);
      return;
    }
    setDistricts(value);
  };

  const handleYopChange = (event, isClearAll) => {
    if (isClearAll) {
      setSelectedYop([])
      return;
    }
    const value = event.target.value;
    if (value[value.length - 1] === "all") {
      setSelectedYop(selectedYop.length === yop.length ? [] : yop);
      return;
    }
    setSelectedYop(value);
  }

  const setYearRange = () => {
    let startDay = moment().subtract(5, 'years');
    let endDate = moment().add(2, 'years');
    setYop(_.range(startDay.year(), endDate.year()));
  }

  const getSections = () => {
    axios.get(`${url.ADMIN_API}/section?isSkillSort=${true}`, { headers: authHeader() })
      .then(res => {
        let sections = _.filter(res.data.response, { 'description': 'Technical' })?.map(data => data.name);
        setTechnologies(sections)
      })
  }


  const handleDepartmentChange = (event, isClearAll) => {
    if (isClearAll) {
      setSelectedDepartment([])
      return;
    }
    const value = event.target.value;
    if (value[value.length - 1] === "all") {
      setSelectedDepartment(selectedDepartment.length === departments.length ? [] : _.map(departments, dep => dep.departmentName));
      return;
    }
    setSelectedDepartment(value);
  };

  const handleSubmit = (event) => {
    handleAdvSearchEventTrack()
    event.preventDefault();
    setShowAdvTable(true)
    setExpanded(false)
    let advSearch = {}
    advSearch.sslc = sslc;
    advSearch.hsc = hsc;
    advSearch.ug = ug;
    advSearch.positionId = props.position?.id;
    advSearch.yop = selectedYop;
    advSearch.averageMark = average;
    advSearch.technology = technology;
    advSearch.natureOfJob = natureOfJob;
    advSearch.districts = (districts.length === 0 && states !== "") ? States[states] : districts;
    advSearch.department = selectedDepartment;
    advSearch.collegeId = role === 'STUDENT' ? collegeId : null;
    if (isRoleValidation() === 'SUPER_ADMIN') {
      advSearch.role = role
    }
    getCandidates(advSearch);
  }

  const handleAdvSearchEventTrack = ()=>{
    window.dataLayer.push({
      event: 'CandidateFiltering',
      skillsortScore: average ? average : '-'
    });
  }

  const handleStateChange = (value) => {
    setStates(value)
    setDistricts([])
  }

  const changeCollege = (college) => {
    setCollegeId(college?.id)
    setCollege(college)
  }

  const getCandidates = (advSearch) => {
    axios.post(`${url.ADMIN_API}/adv-search`, advSearch, { headers: authHeader() })
      .then(res => {
        if (_.size(res.data.response) === 0) {
          setCandidates([])
        }
        else {
          setCandidates(_.shuffle(res.data.response))
          handleExpandClick()
        }
      }).catch(error => errorHandler(error))
  }

  const roleChange = (e) => {
    setRole(e.target.value)
    e.target.value === 'STUDENT' ? setIsStudent(true) : setIsStudent(false)
  }

  const resetSearch = () => {
    setCandidates([]);
    setSslc();
    setUg();
    setHsc();
    setCollege();
    setSelectedDepartment([]);
    setSelectedYop([]);
    setAverage("");
    setStates("");
    setDistricts([]);
    setNatureOfJob("FULL TIME");
    setTechnology("")
    setShowAdvTable(false)
  }

  return (
    <main className="main-content bcg-clr">
      <div>
        <div style={{ padding: '10px', marginTop: '0.5rem' }}>
          <Card>
            <CardHeader
              title={
                <Typography style={{ fontSize: '30px', fontFamily: 'Baskervville' }}>
                  Advance search
                </Typography>
              }
              action={
                <ExpandMore
                  expand={expanded}
                  onClick={handleExpandClick}
                  aria-expanded={expanded}
                  aria-label="show more">
                  <ExpandMoreIcon />
                </ExpandMore>
              }
            />
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <CardContent>
                <form className="email-compose-body" style={{ paddingLeft: '0.5rem' }}>
                  <div className="form-group row" style={{marginTop:'1.5rem'}}>
                    <div className="col-12 col-lg-6 col-sm-12 col-xl-6">
                      <div className='row'>
                        <div className='col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3'>
                          <label className="form-label input-label">SSLC %</label>
                        </div>
                        <div className='col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9  '>
                          <input className="profile-page " maxLength="50" min={0} max={100}
                            onChange={(e) => setSslc(e.target.value)}
                            value={sslc} aria-label="default input example"
                            name='sslc' id='sslc' autoComplete='off' type="number" placeholder='Sslc %' />
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-lg-6 col-sm-12 col-xl-6">
                      <div className='row'>
                        <div className='col-3 col-sm-3 col-md-3 col-xl-3 col-lg-3'>
                          <label className="form-label input-label">HSC %</label>
                        </div>
                        <div className='col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9  '>
                          <input className="profile-page " maxLength="50" min={0} max={100}
                            onChange={(e) => setHsc(e.target.value)}
                            value={hsc} aria-label="default input example"
                            name='hsc' id='hsc' autoComplete='off' type="number" placeholder='Hsc %' />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group row" style={{marginTop:'1.5rem'}}>
                    <div className="col-12 col-lg-6 col-sm-12 col-xl-6">
                      <div className='row'>
                        <div className='col-3 col-sm-3 col-md-3 col-lg-3'>
                          <label className="form-label input-label">UG %</label>
                        </div>
                        <div className='col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9  '>
                          <input className="profile-page " maxLength="50" min={0} max={100}
                            onChange={(e) => setUg(e.target.value)}
                            value={ug} aria-label="default input example"
                            name='sslc' id='sslc' autoComplete='off' type="number" placeholder='Ug %' />
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-lg-6 col-sm-12 col-xl-6">
                      <div className='row'>
                        <div className='col-3 col-sm-3 col-md-3 col-xl-3 col-lg-3'>
                          <label className="form-label input-label">Department</label>
                        </div>
                        <div className='col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9' style={{position:'relative',bottom:'1rem'}}>
                          <MultiSelectDropDown
                            value={selectedDepartment}
                            list={departments}
                            handleChange={(event, clear) => handleDepartmentChange(event, clear)}
                            isObject={true}
                            keyValue={'departmentName'}
                            disabled={departments.length === 0}
                            displayValue={'departmentName'}
                            placeholder={"Select Department"}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group row" style={{marginTop:'1.5rem'}}>
                    <div className="col-12 col-lg-6 col-sm-12 col-xl-6">
                      <div className='row'>
                        <div className='col-3 col-sm-3 col-md-3 col-xl-3 col-lg-3'>
                          <label className="form-label input-label">Year of Passing</label>
                        </div>
                        <div className='col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9' style={{position:'relative',bottom:'1rem'}}>
                          <MultiSelectDropDown
                            value={selectedYop}
                            list={yop}
                            handleChange={(e, isClearAll) => handleYopChange(e, isClearAll)}
                            placeholder={'Select YOP'}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-lg-6 col-sm-12 col-xl-6">
                      <div className='row'>
                        <div className='col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3'>
                          <label className="form-label input-label">SkillSort Score</label>
                        </div>
                        <div className='col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9  '>
                          <input className="profile-page " maxLength="50" min={0} max={100}
                            onChange={(e) => setAverage(e.target.value)}
                            value={average} aria-label="default input example"
                            name='average' id='average' autoComplete='off' type="number" placeholder='SkillSort Score %' />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group row" style={{marginTop:'1.5rem'}}>
                    <div className="col-12 col-lg-6 col-sm-12 col-xl-6">
                      <div className='row'>
                        <div className='col-3 col-sm-3 col-md-3 col-xl-3 col-lg-3'>
                          <label className="form-label input-label">State</label>
                        </div>
                        <div className='col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9  '>
                          <AutoComplete
                             displayLabel={"Select state"}
                             width={250}
                             value={states}
                             isObject={false}
                             selectExam={handleStateChange}
                             data={Object.keys(States)} 
                             >                             
                           </AutoComplete>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-lg-6 col-sm-12 col-xl-6">
                      <div className='row'>
                        <div className='col-3 col-sm-3 col-md-3 col-lg-3'>
                          <label className="form-label input-label">District</label>
                        </div>
                        <div className='col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9' style={{position:'relative',bottom:'1rem'}}>
                          <MultiSelectDropDown
                            value={districts}
                            list={States[states]}
                            handleChange={(e, clearAll) => handleChange(e, clearAll)}
                            showSelectAll={false}
                            disabled={!states}
                            placeholder={'Select District'}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group row" style={{marginTop:'1.5rem'}}>
                    <div className="col-12 col-lg-6 col-sm-12 col-xl-6">
                      <div className='row'>
                        <div className='col-3 col-sm-3 col-md-3 col-xl-3 col-lg-3'>
                          <label className="form-label input-label">Nature Of Job</label>
                        </div>
                        <div className='col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9  '>
                          <select className="profile-page" style={{ backgroundColor: 'white' }}
                            value={natureOfJob}
                            onChange={(e) => setNatureOfJob(e.target.value)}
                          >
                            <option selected value="FULL TIME">FULL TIME</option>
                            <option value="INTERN">INTERN</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    {(isRoleValidation() === 'ADMIN' || isRoleValidation() === 'HR_MANAGAGER' || isRoleValidation() === 'HR') &&
                      <div className="col-12 col-lg-6 col-sm-12 col-xl-6">
                        <div className='row'>
                          <div className='col-3 col-sm-3 col-md-3 col-xl-3 col-lg-3'>
                            <label className="form-label input-label">Technology</label>
                          </div>
                          <div className='col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9  '>
                            <select className="profile-page" style={{ backgroundColor: 'white' }}
                              value={technology}
                              onChange={(e) => setTechnology(e.target.value)}
                            >
                              <option selected value="">Select Technology</option>
                              {_.map(technologies, tech => <option value={tech}>{tech}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>
                    }
                    {isRoleValidation() === 'SUPER_ADMIN' ?
                      <div className="col-12 col-lg-6 col-sm-12 col-xl-6">
                        <div className='row'>
                          <div className='col-3 col-sm-3 col-md-3 col-xl-3 col-lg-3'>
                            <label className="form-label input-label">Select Role</label>
                          </div>
                          <div className='col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9  '>
                            <select className="profile-page" style={{ backgroundColor: 'white' }}
                              value={role}
                              onChange={(e) => roleChange(e)}
                            >
                              <option selected value="STUDENT">STUDENT</option>
                              <option value="INDIVIDUAL_USER">INDIVIDUAL USER</option>
                            </select>
                          </div>
                        </div>
                      </div> : null}
                    {
                      isStudent && isRoleValidation() === 'SUPER_ADMIN' ? <div className="col-12 col-lg-6 col-sm-12 col-xl-6" style={{marginTop:'1.5rem'}}>
                        <div className='row'>
                          <div className='col-3 col-sm-3 col-md-3 col-xl-3 col-lg-3'>
                            <label className="form-label input-label">College</label>
                          </div>
                          <div className='col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9  '>
                            <AutoComplete
                             displayLabel={"Select College"}
                             width={250}
                             value={college}
                             selectExam={changeCollege}
                             data={colleges}
                             isObject ={true}
                             displayValue={"collegeName"} >
                           </AutoComplete>
                          </div>
                        </div>
                      </div> : null
                    }
                    <div className="col-11">
                      <div className="pull-right">
                        <button style={{ marginRight: '3rem' }} type='submit' className="btn btn-sm btn-prev" onClick={handleSubmit}>Search</button>
                        <button style={{ marginRight: '3rem' }} type='reset' className="btn btn-sm btn-prev" onClick={resetSearch}>Reset</button>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Collapse>
          </Card>
        </div>

        {showAdvTable ?
          <>
            <div style={{ padding: '10px', marginTop: '0.5rem' }}>
              <AdvSearchCandidates position={props.position} candidates={candidates} />
            </div>
          </> : null
        }
      </div>
    </main>
  )
}
