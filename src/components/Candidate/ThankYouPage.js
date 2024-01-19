import React, { Component } from "react";
import submit from "../../assests/images/submit.png";

export default class ThankYouPage extends Component {
  state = {
    examSubmitMessage: '',
    examId: '',
    jwt: '',
    logOut: false
  }

  componentWillMount = () => {
    let examId = localStorage.getItem("examId") || sessionStorage.getItem("examId");
    let jwt = localStorage.getItem("jwtToken");
    this.setState({
      examId: examId,
      jwt: jwt
    });
    examId === null ? this.setState({ logOut: true }) : this.setState({ logOut: false })
    if (examId) {
      let submitMessage = localStorage.getItem("examSubmitMessage") || "Test Submitted Successfully..!";
      this.setState({
        examSubmitMessage: submitMessage,
      }, () =>
        (document.getElementById("examSubmitMessage").innerHTML = this.state.examSubmitMessage));
      localStorage.removeItem("examSubmitMessage");
      localStorage.removeItem("candidateInstruction");
      localStorage.removeItem("examId");
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("exam");
      localStorage.removeItem("examId");
      localStorage.removeItem("count");
      localStorage.removeItem("startDate");
      localStorage.removeItem("startTime");
      localStorage.removeItem("onGoingExamId");
      localStorage.removeItem("examDuration");
      localStorage.removeItem("AnsweredState");
      localStorage.removeItem("languageId");
      localStorage.removeItem("languageName");
      localStorage.removeItem("examStartTime")
      localStorage.removeItem("examDuration")
      localStorage.removeItem("publicExam")
    }
    // })
  }

  render() {
    return (
      <>
        <div className="d-flex justify-content-center">
          <div style={{ marginTop: "40vh" }}>
            <div className="mt-2">
              {(!this.state.logOut) ? <div>
                <div className="d-flex justify-content-center">
                  <img src={submit} alt="Skillsort"/>
                </div>
                <div className="container">
                  <div className="row justify-content-md-center" style={{ paddingLeft: '75px' }}>
                    <div id="examSubmitMessage" style={{ fontWeight: "bold", fontSize: "22px" }}>
                    </div>
                  </div>
                </div>
              </div>
                : <div style={{ fontWeight: "bold", fontSize: "25px" }}>you have been logged out </div>}
            </div>
          </div>
        </div>
      </>
    );
  }
}
