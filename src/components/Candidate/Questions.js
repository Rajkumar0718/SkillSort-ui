import _ from "lodash";
import React, { Component } from "react";
import pin from "../../assests/images/Vector.png";

export default class Questions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAnswer: null,
      disabledNext: false,
      disabledPrev: false,
      isPinned: false,
      hint: false,
      nextQuestionHint: false,
      option: null,
    };
  }

  selectedAnswer = (categoryIndex, questionIndex, option) => {
    this.props.selectedAnswer(categoryIndex, questionIndex, option);
    let selectedOption = this.props.Question;
    if (selectedOption.selectedAnswer === null) {
      selectedOption.options.forEach((x) => {
        x.selected = false;
      });
    }
    selectedOption.options.find((x) => x.name === option.name).selected = true;
  }

  componentWillReceiveProps = () => {
    let nextQuestionHint = this.props.nextQuestionHint;
    this.setState({
      nextQuestionHint: nextQuestionHint,
    });
  };


  pinned(categoryIndex, questionIndex) {
    this.props.pinned(categoryIndex, questionIndex);
    this.setState({
      isPinned: true,
    });
  }

  unpinned(categoryIndex, questionIndex) {
    this.props.unPinned(categoryIndex, questionIndex);
    this.setState({
      isPinned: false,
    });
  }
  consoleSubString = (subString) => {
    return subString;
  }

  handleHint = () => this.setState({ hint: !this.state.hint, nextQuestionHint: true, });

  renderQuestion = (question,categoryIndex, questionIndex,selectedAnswer) => {
    const substrings = question.split(" ");

    return substrings.map((substring, index) =>
      substring.includes("_") ? (
        <>
        <textarea className="profile-page"
        style={{ marginTop: '0px', marginBottom: '0px', height: '20px',fontSize:'15px' }}
        key={index}
        value={selectedAnswer || ''}
        onChange={(e) => this.props.handleAnswerChange(e, categoryIndex, questionIndex)}/>
        </>
      ) : (
        <span key={index}> {this.consoleSubString(substring)} </span>
      )
    );
  };

  render() {
    let questions = this.props.Question;
    let selectedAnswer = this.props.Question?.selectedAnswer;
    console.log(questions)
    let hint = this.props.Question?.hint;
    let isPinned = this.props.Question?.isPinned;
    let questionIndex = this.props.questionIndex;
    let categoryIndex = this.props.categoryIndex;
    let totalQuestions = this.props.totalQuestions;
    return (
      <div >
        {hint === null || hint === "" ? null : (
          <div className="d-flex justify-content-end flex-row me-4" data-placement="top" >
            {this.state.hint === true &&
              this.state.nextQuestionHint === true ? (
              <div className="hint ms-1 me-2">{hint}</div>
            ) : null}
            <div style={{ fontSize: "20px" }} onClick={this.handleHint} title="Hint">
              <i className="fa fa-info-circle" aria-hidden="true"></i>
            </div>
          </div>
        )}
        <div className="row">
          <div>
            <b className="section-test ms-4 mt-2" style={{ paddingLeft: '1rem' }}>{"Q"}{questionIndex + 1}{"."}{this.props.section || _.capitalize(totalQuestions.categories[0]?.groupType)}&nbsp;</b>
          </div>
        </div>
        <div style={{ height: 'calc(100vh - 14rem)', overflowY: 'scroll', scrollbarWidth: '0', overflowX: 'hidden', paddingBottom:'2rem' }}>
          <div className="row">
            <div className='card-body' style={{ paddingTop: '2px', paddingLeft: "50px", paddingBottom: "0px" }}>
              <div>
                <div>
                  <div className="col-11 question">
                    {questions.questionType==="Fillups" ?
                      <b id="questionObject">{this.renderQuestion(questions?.question.replace(/<[^>]+>/g,"").replace(/&nbsp;/g," "),categoryIndex, questionIndex,selectedAnswer)}</b>
                    : <b id="questionObject" dangerouslySetInnerHTML={{ __html:questions?.question}}></b>
                    }
                    </div>
                </div>
              </div>
            </div>
            {this.props.section !== "FILLUPS" ? _.map(questions.options, (option, index) => (
              <div key={option.name} className="col-12 ms-2">
                <div className="option">
                  <label htmlFor={option.name} style={{ fontSize: '14px' }}>
                    <input
                      id={option.name}
                      name={questions.question}
                      checked={option.name === selectedAnswer}
                      type="radio"
                      onChange={() => {
                        this.selectedAnswer(categoryIndex, questionIndex, option);
                      }}
                    />
                    &nbsp;&nbsp;
                    {option.value}
                  </label>
                </div>
              </div>
            )) : null
            }
          </div>
        </div>
        <div className="col-lg-2 text-end ms-4 float-end" style={{ height: "0rem", display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', zIndex: '1' }}>
          {isPinned ? (
            <div onClick={() => {
              this.unpinned(categoryIndex, questionIndex);
            }}>
              <img src={pin} alt='' title="UnPin the Question"  style={{ paddingRight: '3.5rem' }}></img><p style={{ marginBottom: '0.4rem', marginTop: '-1rem' ,position:'relative' , right:'0.4rem' }}>UnPin</p>
            </div>
          ) : (
            <div onClick={() => {
              this.pinned(categoryIndex, questionIndex);
            }}>
              <img src={pin} alt='' title="Pin the Question"  style={{ paddingRight: '3.5rem' }}></img><p style={{ marginBottom: '0.4rem', marginTop: '-1rem',position:'relative' , right:'1.2rem' }}>Pin</p>
            </div>

          )}
        </div>
        <div className="progress" style={{ height: '0.2rem', backgroundColor: 'rgba(59, 72, 158, 0.5)' }}>
          <div className="progress-bar" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"
            style={{ width: `${((questionIndex + 1) / totalQuestions?.categories[categoryIndex]?.questions.length) * 100}%`, backgroundColor: '#F05A28' }}>
          </div>
        </div>
        {/* <hr style={{borderTop:'1px solid #CCCCCC',margin:'0rem 0rem',marginLeft:'1rem'}}></hr> */}
      </div>
    );
  }
}
