import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import _ from "lodash";
import { authHeader } from "../../api/Api";
import  url  from "../../utils/UrlConstant";
import { isRoleValidation } from "../../utils/Validation";

const StudentExam = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const exam = JSON.parse(localStorage.getItem("level"));

  const [state, setState] = useState({
    exam: exam,
    isAppsCompleted: false,
    isValidExamTime: false,
    isOngoingExamPresent: false,
    examLinkResponse: "",
    examId: localStorage.getItem("examId"),
    examUserId: user.id,
    emailId: user.email,
    collegeId: user.companyId,
    isSubmitted: false,
  });

  useEffect(() => {
    localStorage.setItem("examUsersId", state.examUserId);
    setState({ ...state, isValidExamTime: true });
    checkOnGoingExam(state.emailId, state.examId);
  }, []);

  const checkOnGoingExam = (email, examId) => {
    axios
      .get(`${url.COLLEGE_API}/onlineTest/onGoing/exam?email=${email}&examId=${examId}`, {
        headers: authHeader(),
      })
      .then((res) => {
        localStorage.setItem("onGoingExamId", res.data.response.id);
        if (res.data.response.startDate) {
          localStorage.setItem("startDate", res.data.response.startDate);
        }
        if (res.data.response.preferredLanguage) {
          localStorage.setItem("languageName", res.data.response.preferredLanguage);
          localStorage.setItem("languageId", res.data.response.preferredLanguage);
        }
        isOngoingExamPresent();

        let exam = state.exam;
        exam["categories"] = res.data.response.categories;
        if (res.data.response.categories) {
          exam["categories"] = res.data.response.categories;
          localStorage.setItem("AnsweredState", JSON.stringify(exam));
        }

        setStartTime(res.data.response.startDate);

        if (res.data.response.isAppsCompleted) {
          localStorage.setItem("examDuration", exam.programmingDuration);
        } else {
          localStorage.setItem("examDuration", exam.duration);
        }

        let programming = _.filter(res.data.response.categories, { sectionName: "PROGRAMMING" }).length > 0 ? true : false;
        redirectWindow(programming, res.data.response.isAppsCompleted);
      })
      .catch(() => {
        isOngoingExamPresent();
      });
  };

  const setStartTime = (startDate) => {
    let startTime = new Date(startDate);
    localStorage.setItem("startTime", startTime);
    localStorage.setItem("startDate", startTime);
  };

  const redirectWindow = (programming, isAppsCompleted) => {
    if (programming && isAppsCompleted) {
      window.open(`${url.UI_URL}/program`, "", "width=1450px,height=900px");
    } else {
      window.open(`${url.UI_URL}/test`, "", "width=1450px,height=900px");
    }
  };

  const isOngoingExamPresent = () => {
    let onGoingExamId = localStorage.getItem("onGoingExamId");
    if (onGoingExamId !== null) {
      setState({ ...state, isOngoingExamPresent: true });
    } else {
      goToStudentInstructionPage();
    }
  };

  const goToStudentInstructionPage = () => {
    window.open(`${url.UI_URL}/candidateinstruction`, "", "width=1450px,height=900px");
  };

  const toTestList = () => {
    // Assuming that `isRoleValidation` and `history` are available in the component props.
    // Adjust accordingly based on your actual setup.
    isRoleValidation() === "COLLEGE_STUDENT" ? "/student/student-test" : "/competitor/testlist";
  };

  return <div>{toTestList()}</div>;
};

export default withRouter(StudentExam);
