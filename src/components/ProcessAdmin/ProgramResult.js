import _ from "lodash";
import React, { Component ,useState } from 'react';
import AceEditor from "react-ace";
import '../Candidate/Compiler.css';
import '../SuperAdmin/SuperAdmin.css';

import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/ext-beautify";
import "ace-builds/src-noconflict/ext-prompt";
import 'ace-builds/src-noconflict/mode-csharp';
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";

const ProgramResult = () => {
    const [questions, setQuestions] = useState([]);
    const [instructions, setInstructions] = useState('');
    const [questionIndex, setQuestionIndex] = useState(0);
    const [submittedExam, setSubmittedExam] = useState([]);
    const [code, setCode] = useState('');
    const [disabledPrev, setDisabledPrev] = useState(true);
    const [disabledNext, setDisabledNext] = useState(false);
    const [languageId, setLanguageId] = useState('');
    const [currentTestCase, setCurrentTestCase] = useState([]);
  
    useEffect(() => {
      const resultKey = window.location.pathname.replace('/processadmin/result/candidate/programResult/', '');
      let result = {};
  
      if (localStorage.getItem(resultKey)) {
        sessionStorage.setItem(resultKey, localStorage.getItem(resultKey));
        localStorage.removeItem(resultKey);
        result = JSON.parse(sessionStorage.getItem(resultKey));
      }
  
      result = JSON.parse(sessionStorage.getItem(resultKey));
  
      const submittedExamFiltered = _.filter(result.submittedExam, 'question.input');
  
      setQuestions(_.map(submittedExamFiltered, 'question'));
      setInstructions(submittedExamFiltered[0]?.question);
      setQuestionIndex(0);
      setSubmittedExam(submittedExamFiltered);
      setCode(submittedExamFiltered[0]?.code);
      setLanguageId(submittedExamFiltered[0]?.language === 'java' ? 'java' : (submittedExamFiltered[0]?.language === 'python' ? 'python' : 'csharp'));
      setCurrentTestCase(submittedExamFiltered[0]?.testCases);
    }, []);
  
    const next = () => {
      const nextIndex = questionIndex + 1;
      setQuestionIndex(nextIndex);
      setInstructions(questions[nextIndex]?.question);
      setInput();
    };
  
    const previous = () => {
      const prevIndex = questionIndex - 1;
      setQuestionIndex(prevIndex);
      setInstructions(questions[prevIndex]?.question);
      setInput();
    };
  
    const setInput = () => {
      setCode(submittedExam[questionIndex]?.code);
      setCurrentTestCase(submittedExam[questionIndex]?.testCases);
    };
  return (
    <>
                <div className="split left">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <h5 style={{ padding: '10px' }}>Question {questionIndex + 1}</h5>
                            </div>
                        </div>
                        <hr></hr>
                        <div className='row'>
                            <div className="col-md-12">
                                <div className="instructions" dangerouslySetInnerHTML={{ __html: instructions }}></div>
                            </div>
                        </div>
                        <hr></hr>
                    </div>
                </div>
                <div className="container">
                    <div className="split right" style={{ overflowY: 'auto' }}>
                        <div className="row">
                            <div className="col-md-6" style={{ padding: '10px' }}>
                                <div style={{ marginTop: "10px", marginLeft: "1rem" }}>
                                    <span style={{ color: "white" }}>Question {questionIndex + 1} of {submittedExam?.length}</span>
                                </div>
                            </div>
                            <div className="col-md-6" style={{ padding: '10px' }}>
                                <div className="row">
                                    <div className="col-md-6">
                                        < div
                                            onClick={(e) => previous(e)}
                                            className=" cursor-pointer"
                                            disabled={disabledPrev}
                                            title="Previous"
                                            style={{ fontSize: "30px", color: "#5B6263", width: '90px', marginTop: '10px', float: 'right' }}
                                        >
                                            {questionIndex === 0 ? (""
                                            ) : (
                                                <div className="p-1" style={{ marginTop: '-15px' }}><button type='button' className='btn-previous '>Previous</button></div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-6" style={{ right: '1.5rem' }}>
                                        <div
                                            className="cursor-pointer"
                                            onClick={(e) => {
                                                next(e);
                                            }}
                                            disable={disabledNext}
                                            title="Next"
                                            style={{ fontSize: "30px", color: "#5B6263", width: '90px', marginTop: '10px' }}
                                        >
                                            {questionIndex === questions.length - 1 ? (
                                                "") : (
                                                <div className="p-1" style={{ marginTop: '-15px' }}><button type='button' className='btn-next'>Next</button></div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <AceEditor style={{ height: '80%', width: '95%', marginLeft: '10px', fontFamily: 'monospace' }}
                            mode={language_id}
                            theme="monokai"
                            value={code}
                            fontSize={14}
                            showPrintMargin={true}
                            showGutter={false}
                            highlightActiveLine={false}
                            readOnly={true}
                        />
                        <br />
                        <div className='row'>
                            <div className='col-md-4'>
                                <span style={{ color: "white", marginLeft: "10px" }}><strong>Total Testcase : {currentTestCase ? currentTestCase?.length : questions[questionIndex]?.input?.length}</strong></span>
                            </div>
                            <div className='col-md-4'>
                                {/* <span style={{color: "green", marginLeft: "10px"}}>Total TestCasePass : {submittedExam[questionIndex]?.testCases?.length}</span> */}
                            </div>
                            <div className='col-md-4'>
                                <span style={{ color: "chartreuse", marginLeft: "10px" }}><strong>Total Testcase Passed : {_.filter(currentTestCase, f => f !== 'Failed').length}</strong></span>
                            </div>
                        </div>
                    </div>
                </div>
            </>
  )
}

export default ProgramResult