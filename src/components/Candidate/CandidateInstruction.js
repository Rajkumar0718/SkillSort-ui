import axios from "axios";
import _ from "lodash";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { authHeader, errorHandler } from "../../api/Api";
import { url } from "../../utils/UrlConstant";
import { isEmpty, isRoleValidation } from "../../utils/Validation";

import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from 'react-icons/fa';
import Python_Instruction_1 from '../../assests/images/Python_Instruction_1.png';
import Python_Instruction_2 from '../../assests/images/Python_Instruction_2.png';
import java_1 from '../../assests/images/java_instruction_1.png';
import java_2 from '../../assests/images/java_instruction_2.png';
import Csharp_Instruction_1 from '../../assests/images/Csharp_Instructions_1.png';
import Csharp_Instruction_2 from '../../assests/images/Csharp_Instructions_2.png';
export default class CandidateInstruction extends Component {

  state = {
    name: "",
    eventTracked:false,
    isAppsCompleted: false,
    selectSubject: [],
    subjectName: "",
    isSelected: false,
    sections: [],
    isTechnicalSection: false,
    jwt: "",
    sectionName: "",
    candidateInstruction: null,
    isOnlyProgramming: false,
    isProjectExam:false,
    instruction_slider:  { 'java': [java_1,java_2],'csharp':[Csharp_Instruction_1,Csharp_Instruction_2],'python':[Python_Instruction_1,Python_Instruction_2]},
    examQuestions: {
      categories: [
        {
          questions: [
            {
              question: "",
              isPinned: "",
            },
          ],
        },
      ],
    },
    error: {
      section: false,
      language: false,
      sectionMsg: "",
      languageMsg: ""
    },
    exam: {},
    haveProgramming: false,
    haveSql : false,
    languageName: localStorage.getItem("languageName") || "",
    language_id: localStorage.getItem("languageId") || "",
    langSelected: false,

    instruction_image_count : 0,
    technology: localStorage.getItem('technology')
  };
  errorMsg = {
    error: "",
  };

  componentWillMount = () => {
    localStorage.removeItem("count");
    let subjectName = localStorage.getItem("examId");
    let jwt = localStorage.getItem("jwtToken");
    if (localStorage.getItem("languageName")) {
      this.setState({ langSelected: true })
    }
    this.setState({
      subjectName: subjectName,
      jwt: jwt,
    });
    axios
      .get(
        `${url.CANDIDATE_API}/candidate/exam/instruction?examId=${localStorage.getItem("examId")}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      )
      .then((res) => {
        localStorage.setItem("candidateInstruction", res.data.response.candidateInstruction);
        localStorage.setItem("examSubmitMessage", res.data.response.examSubmitMessage);
        if(!localStorage.getItem("exam")){
          localStorage.setItem("exam", JSON.stringify(res.data.response));
        }
        let isTechnicalSection = _.filter(res.data.response.categories, { 'sectionName': 'TECHNICAL' }).length > 0 ? true : false;
        if (isTechnicalSection) {
          this.setState({ isTechnicalSection: isTechnicalSection });
          this.getSections(res.data.response.isSkillSortQuestion);
        }
        let haveProgramming = _.filter(res.data.response.categories, { 'sectionName': 'PROGRAMMING' }).length > 0 || _.filter(res.data.response.categories, { 'groupQuestionType': 'programming' }).length > 0? true : false;
        let haveSql = _.filter(res.data.response.categories, { 'groupQuestionType': 'SQL' }).length > 0? true : false;
        let isOnlyProgramming = haveProgramming && res.data.response.categories.length === 1 ? true : false;
        let isProjectExam = _.filter(res.data.response.categories, { 'sectionName': 'PROJECT' }).length > 0? true : false;
        this.setState({
          candidateInstruction: res.data.response.candidateInstruction, exam: res.data.response, haveProgramming: haveProgramming, isOnlyProgramming: isOnlyProgramming,haveSql :haveSql,isProjectExam
        }, () =>
        (document.getElementById(
          "candidateInstruction"
        ).innerHTML = localStorage.getItem("candidateInstruction")));
      })
      .catch((error) => {
        errorHandler(error)
      });
  };

  getSections = (value) => {
    axios.get(`${url.ADMIN_API}/section?isSkillSort=${value}`, { headers: authHeader() })
      .then(res => {
        let sections = _.filter(res.data.response, { 'description': 'Technical' })?.map(data => data.name);
        this.setState({ sections: sections },()=>console.log(sections));
      })
  }
  setSection = (event) => {
    event.preventDefault();
    this.setState({ sectionName: event.target.value });
    localStorage.setItem("technical", event.target.value);
  }

  language = (event) => {

    event.preventDefault();
    if (event.target.value === 'java') {
      this.setState({language_id: 'java',languageName: 'java',langSelected: true,instruction_image_count:0 })
    } else if (event.target.value === 'python') {
      this.setState({ langSelected: true,languageName: 'python',language_id: 'python',instruction_image_count:0})
    } else if (event.target.value === 'csharp') {
      this.setState({ langSelected: true,language_id: 'csharp',languageName: 'csharp',instruction_image_count:0 })
    } else {
      this.setState({ langSelected: false,languageName: 'Select language',language_id: '' })
    }

  }

  setLanguageInLocalStorage = (languageId, languageName) => {
    this.handleEventTrackForExamStart()
    if (this.state.sectionName !== "") {
      this.updateExam();
    }
    localStorage.setItem("languageId", languageId);
    localStorage.setItem("languageName", languageName);
  }

  getCandidateInstruction = () => {
    const { error } = this.state;
    if (this.state.isTechnicalSection) {
      if (isEmpty(this.state.sectionName)) {
        error.section = true;
      } else {
        error.section = false;
      }
    } else {
      error.section = false;
    }
    if (this.state.isOnlyProgramming || this.state.haveProgramming) {
      if (isEmpty(this.state.languageName)) {
        error.language = true;
      } else {
        error.language = false;
      }
    } else {
      error.language = false;
    }

    if ((!error.section && !error.language) || this.state.technology === "DBMS") {
      return this.getStartButton();
    }

  }
  getStartButton = () => {
    if ((this.state.isOnlyProgramming && this.state.langSelected ) || this.state.technology === 'PROGRAMMING') {
      if ((this.state.imgVisited)) {
        return (<Link className="btn btn-info" style={{ padding: '3px 0px 0px 0px' }} to="/program" onClick={() => this.setLanguageInLocalStorage(this.state.language_id, this.state.languageName)}> Start</Link>);
      } else {
        return (<div><Link className="btn btn-info disabled" style={{ padding: '3px 0px 0px 0px' }} to="/program" onClick={() => this.setLanguageInLocalStorage(this.state.language_id, this.state.languageName)}> Start</Link>
          <p style={{ fontSize: '15px', fontFamily: 'sans-serif' }}><b>Watch all the images till the end to activate the start button</b></p></div>);
      }
    }else if (this.state.technology === 'DBMS' || this.state.technology === 'BOTH' || this.state.haveSql) {
      return (<Link className="btn btn-info" style={{ padding: '3px 0px 0px 0px' }} to="/sql" onClick={() => this.setLanguageInLocalStorage(this.state.language_id, this.state.languageName)} > Start</Link>);
    }
     else if (this.state.haveProgramming && this.state.langSelected) {
      return (<Link className="btn btn-info" style={{ padding: '3px 0px 0px 0px' }} to="/test" onClick={() => this.setLanguageInLocalStorage(this.state.language_id, this.state.languageName)}> Start</Link>);
    } else if (this.state.haveProgramming && !this.state.langSelected) {
      return "";
    }
    else if(this.state.isProjectExam){
      return (<Link className="btn btn-info" style={{ padding: '3px 0px 0px 0px' }} to="/project"> Start</Link>);
    }
     else {
      return (<Link className="btn btn-info" style={{ padding: '3px 0px 0px 0px' }} to="/test" onClick={() => this.updateExam()}>Start</Link>);
    }
  }

  updateExam = () => {
    if(!this.state.eventTracked ){
      this.handleEventTrackForExamStart()
    }
    if (this.state.isTechnicalSection) {
      const startTime = performance.now();
      axios.post(this.getApi(), this.state.exam, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          "Technical": this.state.sectionName
        }
      }).then(()=>{
        const endTime = performance.now(); 
        const responseTime = endTime - startTime;
        this.handleEventTrackForExamStartApi(responseTime)
      }).catch(error => {
        errorHandler(error)
      })
    }
  }
  

  handleEventTrackForExamStart = ()=>{
    const dataLayer = window.dataLayer || []
    console.log(dataLayer);
    window.dataLayer.push({
      event: 'ExamStart'
    });
    this.setState({eventTracked:true})
  }

  handleEventTrackForExamStartApi=()=>{
    const dataLayer = window.dataLayer || []
    console.log(dataLayer);
    window.dataLayer.push({
      event: 'ExamStartApi'
    });

  }

  getApi = () => {
    if (isRoleValidation().includes("COLLEGE_STUDENT"))
      return `${url.COLLEGE_API}/test/update-test`
    return `${url.COMPETITOR_API}/testcompetitor/update-test`;
  }


  // Image silder
  nextSlide = () => {
    this.setState({
      instruction_image_count: this.state.instruction_image_count === this.state.instruction_slider[this.state.languageName].length - 1 ? 0 : this.state.instruction_image_count + 1,imgVisited:this.state.instruction_slider[this.state.languageName].length - 1 ? true:false
    });
  };

  prevSlide = () => {
    this.setState({
      instruction_image_count: this.state.instruction_image_count === 0 ? this.state.instruction_slider[this.state.languageName].length - 1 : this.state.instruction_image_count - 1,
    });
  };

  render() {
    return (
      <div className='row can-page'>
        <header className="can-header" style={{textAlign:'center'}}>
          <span className="can-instruction">
            Candidate Instruction{this.errorMsg.error}
          </span>
        </header>
        <div className="container instruction-container">
          {(((this.state.haveProgramming || this.state.isOnlyProgramming)&& this.state.technology !=='DBMS' ) && !localStorage.getItem("languageName")) ?
            <div className="row can-section">
              <div className="col">
                In which programming Language would you like to take the test?<span className="required"></span>
              </div>
              <div className="col">
                <select style={{ color: '#3B489E' }}
                  value={this.state.languageName}
                  onChange={this.language}
                  className="form-select section"
                >
                  <option value="">Select language</option>
                  <option value="csharp">C#</option>
                  <option value="java">Java</option>
                  <option value="python">Python</option>
                </select>
              </div>
            </div> : ""}
          {(this.state.sections && this.state.sections.length > 0) ?
            <div className="row can-section">
              <div className="col">
                In which programming Language would you like to take the test?<span className="required"></span>
              </div>
              <div className="col">
                <select style={{ color: '#3B489E' }}
                  value={this.state.sectionName}
                  onChange={this.setSection}
                  className="form-select section"
                >
                  <option value="">Select Section</option>
                  {_.map(this.state.sections, (section, index) => {
                    return <option key={index} value={section}>{section}</option>
                  })}
                </select>
              </div>
            </div> : ""}
          <div className="candidate-instruction" id="candidateInstruction"></div>
          <div>
            <h6 style={{ textAlign: "center" }}>{this.errorMsg.error}</h6>
          </div>
        </div>
        <div>
          {(this.state.isOnlyProgramming || this.state.technology === 'PROGRAMMING' || this.state.technology === 'BOTH' ) && this.state.langSelected?
          <div style={{display:'flex',justifyContent:'center'}}>
            <div>
                    {this.state.instruction_image_count > 0 ?
                      <FaArrowAltCircleLeft className={`left-arrow`} onClick={this.prevSlide} style={{ position: 'absolute', transform:'translate(-110%,250%)', fontSize: '2.5rem', zIndex: '10',color: '#F05A28', cursor: 'pointer', userSelect: 'none' }} />
                      :
                      null
                    }
                     <img src={this.state.instruction_slider?.[this.state.languageName]?.[this.state.instruction_image_count]} alt={`Wrong ${this.state.languageName}`}  />
                  {this.state.instruction_image_count < this.state.instruction_slider[this.state.languageName]?.length - 1 ?
                    <FaArrowAltCircleRight className={`right-arrow`} onClick={this.nextSlide}  style={{color:'#f05a28',fontSize:'2.5rem',position:'absolute',zIndex: '10',transform:'translate(10%,250%)',cursor:'pointer',userSelect:'none',animation: 'blink 1s infinite'}}/>
                    :
                    null
                  }
                  </div>
            
          </div>:null}
        </div>
        <footer className="btn start-test">
          {this.getCandidateInstruction()}
        </footer>
      </div>
    );
  }
}
