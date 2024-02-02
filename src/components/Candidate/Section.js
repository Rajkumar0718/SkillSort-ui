import _ from "lodash";
import React, { Component } from "react";

export default class Section extends Component {
  state = {
    categoryIndex: 0,
  };

  isAnswered = (question) => {
    if (question.isPinned === true) {
      return (question = "pinned");
    } else if (question.selectedAnswer !== null && question.selectedAnswer !=='' ) {
      return (question = "true");
    } else {
      return (question = "false");
    }
  };

  componentWillReceiveProps = () => {
    let categoryIndex = this.props.categoryIndex;
    this.setState({
      categoryIndex: categoryIndex,
    });
  };

  sectionHeight = (categories) => {
     if(categories.length === 1) return 'section1'
     if(categories.length === 2)  return 'section2'
     return 'more-section'
  }

  render() {
    let questions = this.props.section;
    return (
      <div className="card" style={{ border: 'none', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)' }}>
        <div className="section-row" >
          {_.map(questions.categories, (category, categoryIndex) => (
            <div className="panel">
              <div className="panel-heading mb-2">
                <p
                  className="panel-title text-center mb-0 pb-0" style={{ padding: '10px' }}
                  data-toggle="collapse"
                  data-target={"#collapseTwo-" + categoryIndex}
                >
                  {category.sectionName}
                </p>
              </div>
              <div className={this.sectionHeight(questions.categories)}>
                <div id={"collapseTwo-" + categoryIndex} style={{ minWidth: '11rem', maxWidth: '11rem'}}>
                  <div className="row" style={{ padding: '5px', marginLeft: 'auto', marginBottom: '0rem' }}>
                    {_.map(category.questions, (question, questionIndex) => (
                      <div
                        key={question.id}
                        onClick={() => {
                          this.props.move(categoryIndex, questionIndex);
                        }}
                        className="ms-1 mb-3 mt-0 qno-itr"
                        style={{ height: "16px", width: "30px", }}
                      >
                        <button
                          id={questionIndex}
                          className={`${this.isAnswered(question) === "true"
                            ? "answered"
                            : "notanswered" &&
                              this.isAnswered(question) === "pinned"
                              ? "pinned"
                              : "notanswered"
                            }`}
                        >
                          {questionIndex + 1}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{marginLeft:'1rem'}}>
          <div style={{ marginTop: '1rem' }} >
            <div className="col-lg-12">
              <i className="fa fa-circle col-lg-2 pl-0 ml-0" style={{ fontSize: '26px', color: '#22B573' }} aria-hidden="true"></i>
              <p className="col-lg-10 pl-0 pt-1 mb-0 pull-right" style={{ fontFamily: 'Montserrat', fontSize: '11px' }}>Answered</p>
            </div>
            <div className="col-lg-12">
              <i className="fa fa-circle col-lg-2 pl-0 ml-0" style={{ fontSize: '26px', color: '#ED1C24' }} aria-hidden="true"></i>
              <p className="col-lg-10 pl-0 pt-1 mb-0  pull-right" style={{ fontFamily: 'Montserrat', fontSize: '11px' }}>Pinned For Review</p>
            </div>
            <div className="col-lg-12">
              <i className="fa fa-circle col-lg-2 pl-0 ml-0" style={{ fontSize: '26px', color: '#CCCCCC' }} aria-hidden="true"></i>
              <p className="col-lg-10 pl-0 pt-1 mb-0 pull-right" style={{ fontFamily: 'Montserrat', fontSize: '11px' }}>Not Answered</p>
            </div>
          </div>
        </div>
        <div style={{ margin: '1rem', paddingTop: '0.6rem', borderTop: '0.25px solid #fcaf95', display: 'flex', justifyContent: 'center' }}>
          <button type='button' className='btn-submit' onClick={this.props.submited}>
            Submit Test
          </button>
        </div>
      </div>
    );
  }
}
