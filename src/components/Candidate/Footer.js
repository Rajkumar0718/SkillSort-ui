import React, { Component } from "react";
import _ from 'lodash'
export default class Footer extends Component {
  state = {
    disabledNext: false,
    disabledPrev: true,
    categoryIndex: 0,
    questionIndex: 0,
  };

  previouscategoryIndexChange(secondcategoryIndex) {
    if (secondcategoryIndex <= 0) {
      let categoryIndex = secondcategoryIndex;
      this.setState({
        categoryIndex: categoryIndex,
      });
    } else {
      let categoryIndex = secondcategoryIndex - 1;
      this.setState({
        categoryIndex: categoryIndex,
      });
    }
    let questionIndexLength = this.props.footer.categories[this.state.categoryIndex]
      .questions.length;
    let questionIndex = questionIndexLength - 1;
    if (this.state.categoryIndex === 0 && questionIndex === 0) {
      this.setState({
        disabledPrev: true,
      });
    } else {
      if (this.state.categoryIndex === 0 && questionIndex === 0) {
        this.setState({
          disabledPrev: false,
        });
        this.props.move(this.state.categoryIndex, this.state.questionIndex);
      } else {
        this.setState({
          disabledPrev: false,
        });
        this.props.move(this.state.categoryIndex, questionIndex);
      }
    }
  }

  nextcategoryIndexChange(secondcategoryIndex) {
    let categoryIndex = secondcategoryIndex + 1;
    let categoryIndexLength = this.props.footer.categories.length;
    let questionIndex = 0;
    if (categoryIndexLength <= categoryIndex) {
      this.setState({
        disabledNext: true,
      });
    } else {
      this.setState({
        disabledNext: false,
      });
      this.props.move(categoryIndex, questionIndex);
    }
  }

  componentWillReceiveProps = (newProps) => {
    let categoryIndex = newProps.categoryIndex;
    let questionIndex = newProps.questionIndex;
    let questionIndexLength = this.props.footer.categories[categoryIndex].questions.length;
    let categoryIndexLength = this.props.footer.categories.length;
    (categoryIndex === categoryIndexLength - 1 && questionIndex === questionIndexLength - 1) ?
      this.setState({ disabledNext: true }) :
      this.setState({ disabledNext: false });
    (categoryIndex === 0 && questionIndex === 0) ? this.setState({ disabledPrev: true }) :
      this.setState({ disabledPrev: false })
  }

  previous(categoryIndex, questionIndex) {
    if (categoryIndex === 0 && questionIndex === 1) {
      this.props.move(categoryIndex, questionIndex);
      this.setState({
        disabledPrev: true,
      });
      this.props.move(categoryIndex, questionIndex - 1);
    } else if (categoryIndex === 0 && questionIndex === 0) {
      this.props.move(categoryIndex, questionIndex);
      this.setState({
        disabledPrev: true,
      });
    } else if (questionIndex <= 0) {
      let secondcategoryIndex = categoryIndex;
      let secondquestionIndex = questionIndex;
      this.previouscategoryIndexChange(secondcategoryIndex, secondquestionIndex);
    } else {
      this.setState({
        disabledNext: false,
      });
      this.props.move(categoryIndex, questionIndex - 1);
    }
  }

  next(categoryIndex, questionIndex) {
    let questionIndexLength = this.props.footer.categories[categoryIndex].questions
      .length;
    let categoryIndexLength = this.props.footer.categories.length;
    if (questionIndexLength - 1 <= questionIndex) {
      let secondcategoryIndex = categoryIndex;
      let secondquestionIndex = questionIndex;
      this.nextcategoryIndexChange(secondcategoryIndex, secondquestionIndex);
    } else if (categoryIndex === 0 && questionIndex === questionIndexLength - 1) {
      this.setState({
        disabledNext: false,
      });
    } else if (
      categoryIndex === categoryIndexLength - 1 &&
      questionIndex === questionIndexLength - 2
    ) {
      this.setState({
        disabledNext: true,
      });
      this.props.move(categoryIndex, questionIndex + 1);
    } else {
      this.setState({
        disabledPrev: false,
      });
      this.props.move(categoryIndex, questionIndex + 1);
    }
  }

  render() {
    let categoryIndex = this.props.categoryIndex;
    let questionIndex = this.props.questionIndex;
    let totalQuestions = this.props.totalQuestions;
    return (
      <div className="row-f ml-2">
        <div
          className=" cursor-pointer"
          onClick={() => {
            this.previous(categoryIndex, questionIndex);
          }}
          disabled={this.state.disabledPrev}
          title="Previous"
          style={{ fontSize: "30px", color: "#5B6263", width: '90px' }}
        >
          {this.state.disabledPrev === true ? (""
          ) : (
            <button type='button' className='btn btn-sm btn-prev'>Previous</button>
          )}
        </div>
        <div className="footer-text "><p className="mb-0">Question {questionIndex + 1} of {totalQuestions?.categories[categoryIndex]?.questions.length} {_.toUpper(this.props.section)}</p></div>
        <div
          className="cursor-pointer"
          onClick={() => {
            this.next(categoryIndex, questionIndex);
          }}
          disable={this.state.disabledNext}
          title="Next"
          style={{ fontSize: "30px", color: "#5B6263", width: '8rem' }}
        >
          {this.state.disabledNext === true ? (
            "") : (
            <button type='button' className='btn btn-sm btn-prev'>Next</button>
          )}
        </div>
      </div>
    );
  }
}
