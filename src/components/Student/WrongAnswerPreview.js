import React, { useState, useEffect } from "react";
import LOGO from '../../assests/images/LOGO.svg';
import _ from "lodash";
import { Radio } from "@mui/material";
import "../Candidate/Styles.css";

const WronganswerPreview = () => {
    const [questions, setQuestions] = useState([]);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [disabledPrev, setDisabledPrev] = useState(true);
    const [disabledNext, setDisabledNext] = useState(false);

    useEffect(() => {
        let data = {};
        if (localStorage.getItem('wrongAnswers')) {
            sessionStorage.setItem('wrongAnswers', localStorage.getItem('wrongAnswers'));
            localStorage.removeItem('wrongAnswers');
            data = JSON.parse(sessionStorage.getItem('wrongAnswers'));
        }
        data = JSON.parse(sessionStorage.getItem('wrongAnswers'));
        setQuestions(data);
    }, []);

    const previous = () => {
        setQuestionIndex(prevIndex => {
            const newIndex = prevIndex - 1;
            setDisabledNext(false);
            if (newIndex === 0) {
                setDisabledPrev(true);
            }
            return newIndex;
        });
    };

    const next = () => {
        setQuestionIndex(prevIndex => {
            const newIndex = prevIndex + 1;
            setDisabledPrev(false);
            if (newIndex === _.size(questions) - 1) {
                setDisabledNext(true);
            }
            return newIndex;
        });
    };

    return (
        <>
            <div className="full-screen-view">
                <div className='header'>
                    <img className='header-logo' src={LOGO} alt="SkillSort" />
                </div>
                <div className="row">
                    <div>
                        <b className="section-test ml-4 mt-2" style={{ paddingLeft: '1rem' }}>{"Q"}{questionIndex + 1}{"."}{questions[questionIndex]?.groupType || ''}&nbsp;</b>
                    </div>
                </div>
                <div style={{ height: 'calc(100vh - 12rem)', overflowY: 'scroll', scrollbarWidth: '0', overflowX: 'hidden' }}>
                    <div className="row">
                        <div className='card-body' style={{ paddingTop: '2px', paddingLeft: "50px", paddingBottom: "0px" }}>
                            <div>
                                <div>
                                    <div className="col-11 question">
                                        <b id="questionObject" dangerouslySetInnerHTML={{ __html: questions[questionIndex]?.question || '' }}></b>
                                    </div>
                                    <div>
                                        {_.map(questions[questionIndex]?.options, option => (
                                            <div key={option.name}>
                                                <label htmlFor={option.name} style={{ fontSize: '14px' }}>
                                                    <Radio
                                                        checked={option.name === questions[questionIndex]?.selectedAnswer}
                                                        style={{ color: option.name === questions[questionIndex]?.selectedAnswer ? 'red' : null }}
                                                    />
                                                    &nbsp;&nbsp;
                                                    {option.value}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="progress" style={{ height: '0.2rem', backgroundColor: 'rgba(59, 72, 158, 0.5)' }}>
                    <div className="progress-bar" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"
                        style={{ width: `${((questionIndex + 1) / questions.length) * 100}%`, backgroundColor: '#F05A28' }}>
                    </div>
                </div>
                <div className='card-footer' style={{ border: 'none', padding: '0rem 0rem' }}>
                    <div className="row-f ml-2">
                        <div
                            className=" cursor-pointer"
                            title="Previous"
                            style={{ fontSize: "30px", color: "#5B6263", width: '90px' }}
                        >
                            {disabledPrev === true ? (
                                ""
                            ) : (
                                <button onClick={previous} type='button' className='btn btn-sm btn-prev'>Previous</button>
                            )}
                        </div>
                        <div className="footer-text "><p className="mb-0">Question {questionIndex + 1} of {questions.length}</p></div>
                        <div
                            className="cursor-pointer"
                            title="Next"
                            style={{ fontSize: "30px", color: "#5B6263", width: '8rem',marginRight: '1rem' }}
                        >
                            {disabledNext === true || _.size(questions) === 1 ? (
                                null) : (
                                <button onClick={next} type='button' className='btn btn-sm btn-nxt'>Next</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default WronganswerPreview;
