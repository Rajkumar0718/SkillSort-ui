import React, { useState, useEffect } from "react";
import axios from "axios";
import { authHeader, errorHandler, logOut } from "../../api/Api";
import { fallBackLoader, toastMessage } from "../../utils/CommonUtils";
import { url } from "../../utils/UrlConstant";
import _ from "lodash";
import { saveAs } from "file-saver";
import ckeditor from '@ckeditor/ckeditor5-react'

const ExamMailModel = (props) => {
  const [loader, setLoader] = useState(false);
  const [validMailButton, setValidMailButton] = useState(false);
  const [id, setId] = useState("");
  const [mailMsg, setMailMsg] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [validUploadButton, setValidUploadButton] = useState(true);
  const [shortListedCandidates, setShortListedCandidates] = useState([]);
  const [mailOpenModal, setMailOpenModal] = useState(false);
  const [csvImportObject, setCsvImportObject] = useState({
    section: "",
    questionType: "",
    difficulty: "",
    examType: "",
    mailOpenModal: false,
    mailModalSection: "",
  });
  const questionType = ["MCQ", "True/False", "programming"];
  const examType = ["MOCK", "ACTUAL"];

  useEffect(() => {
    if (props.modalSection.type === "Question") {
      return null;
    }
    if (props.modalSection.type === "Email") {
      if (props.mailModalSection?.exam) {
        setMailMsg(props.mailModalSection?.exam?.message);
      } else {
        getExam(props.examId);
      }
    }
    if (props.shortListedCandidates) {
      setShortListedCandidates(props.shortListedCandidates);
    }
  }, [
    props.examId,
    props.modalSection.type,
    props.mailModalSection?.exam,
    props.shortListedCandidates,
  ]);

  const getExam = (examId) => {
    axios
      .get(`${url.CANDIDATE_API}/candidate/exam/instruction?examId=${examId}`, {
        headers: authHeader(),
      })
      .then((res) => {
        const exam = res.data.response;
        setMailMsg(exam.message);
      })
      .catch(() => toastMessage("error", "Error while fetching exam"));
  };
  const sendExamLink = (data) => {
    handleMailSentEventTrack();
    data.message = mailMsg;
    data.positionId = props.positionId;
    setValidMailButton(true);
    setLoader(true);

    let formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("exam", JSON.stringify(data));
    formData.append(
      "candidateEmails",
      _.map(shortListedCandidates, (s) => s.id)
    );

    axios
      .post(`${url.ADMIN_API}/onlineTest/send/link`, formData, {
        headers: authHeader(),
      })
      .then((_res) => {
        setValidMailButton(false);
        setLoader(false);
        toastMessage("success", "Emails sent Successfully..!");
        props.onCloseModal();
      })
      .catch((error) => {
        setValidMailButton(false);
        setLoader(false);
        if (error.response?.status === 401) {
          logOut();
          props.history.push("/login");
        }
        errorHandler(error);
      });
  };
  const handleMailSentEventTrack = () => {
    window.dataLayer.push({
      event: "EmailSentForExams",
    });
  };
  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setValidUploadButton(false);
  };
  const importSampleFile = () => {
    switch (props.modalSection.type) {
      case "Email":
        saveAs(
          new Blob(["S.NO", ",", "EMAIL"], { type: "text/plain" }),
          "candidate_email.csv"
        );
        break;
      case "Student":
        saveAs(
          new Blob(
            [
              "S.NO",
              ",",
              "FIRST_NAME",
              ",",
              "LAST_NAME",
              ",",
              "EMAIL",
              ",",
              "PHONE",
            ],
            { type: "text/plain" }
          ),
          "student.csv"
        );
        break;
      case "Question":
        let header;
        if (csvImportObject.questionType === "MCQ") {
          header = [
            "SECTION,QUESTION TYPE,EXAM TYPE,DIFFICULTY,QUESTION,ANSWER,OPTION-A,OPTION-B,OPTION-C,OPTION-D,OPTION-E",
          ];
        } else {
          header = [
            "SECTION,QUESTION TYPE,EXAM TYPE,DIFFICULTY,QUESTION,ANSWER,OPTION-A,OPTION-B",
          ];
        }
        let str = "";
        let row = "S.NO,";
        let line = "";
        for (let index in header) {
          row += header[index].toString().toUpperCase() + ",";
        }
        row = row.slice(0, -1);
        str += row + "\r\n";
        line =
          "1," +
          csvImportObject.section +
          "," +
          csvImportObject.questionType +
          "," +
          csvImportObject.examType;
        str += line + "\r\n";
        saveAs(new Blob([str], { type: "text/plain" }), "question.csv");
        break;
    }
  };
  const handleChange = (e, key) => {
    const newCsvImportObject = { ...csvImportObject };
    newCsvImportObject[key] = e.target.value;
    setCsvImportObject(newCsvImportObject);
  };

  const renderQuestionTemplate = () => {
    switch (props.modalSection.type) {
      case "Question":
        return (
          <div
            className="row"
            style={{ display: "flex", flexDirection: "row" }}
          >
            <div className="col" style={{ paddingLeft: "21px" }}>
              <select
                className="form-control-mini"
                name="section"
                style={{ width: "200px" }}
                value={csvImportObject.section}
                onChange={(e) => handleChange(e, "section")}
              >
                <option hidden selected value="">
                  Section
                </option>
                {_.map(props.modalSection?.sections, (value) => (
                  <option value={value.name} key={value.name}>
                    {value.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col" style={{}}>
              <select
                className="form-control-mini"
                style={{ width: "150px" }}
                value={csvImportObject.questionType}
                onChange={(e) => handleChange(e, "questionType")}
              >
                <option hidden selected value="">
                  Type
                </option>
                {_.map(questionType, (key) => (
                  <option value={key} key={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>
            <div className="col" style={{}}>
              <select
                className="form-control-mini"
                style={{ width: "110x" }}
                value={csvImportObject.examType}
                onChange={(e) => handleChange(e, "examType")}
              >
                <option hidden selected value="">
                  Type
                </option>
                {_.map(examType, (key) => (
                  <option value={key} key={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ paddingTop: "10px", marginLeft: "20px" }}>
              <button
                className="btn btn-sm btn-nxt"
                disabled={
                  csvImportObject?.section !== "" &&
                  csvImportObject?.questionType !== ""
                }
                onClick={importSampleFile}
              >
                <i className="fa fa-download" aria-hidden="true"></i> Sample
                Template
              </button>
              <strong className="ml-2" style={{ color: "#3b489e" }}>
                ( *must upload this file format )
              </strong>
            </div>
          </div>
        );
      case "Email":
        return (
          <button
            className="btn btn-sm btn-nxt"
            style={{ marginLeft: "5px" }}
            onClick={importSampleFile}
          >
            <i className="fa fa-download" aria-hidden="true"></i> Sample
            Template
          </button>
        );
      case "Student":
        return (
          <button
            className="btn btn-sm btn-nxt"
            style={{ marginLeft: "5px" }}
            onClick={importSampleFile}
          >
            <i className="fa fa-download" aria-hidden="true"></i> Sample
            Template
          </button>
        );
    }
  };
  const onFileUpload = () => {
    setValidUploadButton(true);
    setLoader(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    switch (props.modalSection.type) {
      case "Email":
        formData.append("examId", props.modalSection?.exam?.id);
        axios
          .post(`${url.ADMIN_API}/examUsers/upload`, formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            setLoader(false);
            setMailOpenModal(true);
            toastMessage("success", res.data.message);
          })
          .catch((error) => {
            setValidUploadButton(false);
            setLoader(false);
            toastMessage("error", error.response?.data?.message);
          });
        break;
      case "Question":
        axios
          .post(`${url.ADMIN_API}/question/bulk/question/`, formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            setLoader(false);
            props.onCloseModal();
            toastMessage("success", "Questions uploaded successfully..!!");
          })
          .catch((error) => {
            setValidUploadButton(false);
            setLoader(false);
            toastMessage("error", error);
          });
        break;
      case "Student":
        axios
          .post(`${url.COLLEGE_API}/student/bulk/save`, formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            setLoader(false);
            props.onCloseModal();
            toastMessage("success", res.data.message);
          })
          .catch((error) => {
            setValidUploadButton(false);
            setLoader(false);
            toastMessage(
              "error",
              error.response?.data?.message ||
                "Something went wrong while uploading"
            );
          });
        break;
    }
  };
  const handleSubmit = () => {};
  return (
    <div
      className="modal fade show"
      id="myModal"
      role="dialog"
      style={{
        paddingRight: "15px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.90)",
      }}
      aria-hidden="true"
    >
      {fallBackLoader(loader)}
      <div
        className="modal-dialog"
        style={{ width: "700px", maxWidth: "770px" }}
      >
        <div
          className="modal-content"
          style={{
            borderStyle: "solid",
            borderColor: "#af80ecd1",
            borderRadius: "32px",
          }}
        >
          <div
            className="modal-header"
            style={{ padding: "2rem 2rem 0 1.8rem", border: "none" }}
          >
            <h5 className="setting-title">
              Upload{" "}
              {props.modalSection?.type === "Email"
                ? "Candidates"
                : props.modalSection?.type}
            </h5>
            {props.modalSection?.type === "Email" ? (
              <h5 className="setting-title" style={{ paddingLeft: "0.5rem" }}>
                <span style={{ color: "#F05A28" }}>{props.remainingTest}</span>{" "}
                Credits Available
              </h5>
            ) : (
              ""
            )}
            <button
              type="button"
              onClick={props.onCloseModal}
              className="close"
              data-dismiss="modal"
            >
              &times;
            </button>
          </div>
          <div className="card-body" style={{ paddingTop: "10px" }}>
            <div>
              {renderQuestionTemplate()}
              {(props.mailModalSection?.exam === null &&
                props.modalSection?.type === "Email") ||
              props.modalSection?.type === "Student" ? (
                <strong className="ml-2" style={{ color: "#3b489e" }}>
                  ( *must upload this file format )
                </strong>
              ) : props.modalSection?.type !== "Question" &&
                props.modalSection?.type !== "Student" ? (
                <strong className="ml-2" style={{ color: "#3b489e" }}>
                  ( *You can add more candidates, but the file must be in CSV
                  format )
                </strong>
              ) : null}
              <hr className="rounded"></hr>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingLeft: "5px",
                }}
              >
                <input
                  style={{ color: "#3b489e" }}
                  id="files"
                  type="file"
                  onChange={onFileChange}
                  accept={".csv"}
                />
                {!props.modalSection?.type === "Email" && (
                  <button
                    className="btn btn-sm btn-nxt"
                    disabled={validUploadButton}
                    onClick={onFileUpload}
                  >
                    Upload
                  </button>
                )}
              </div>
              {props.modalSection?.type === "Email" && (
                <form onSubmit={handleSubmit}>
                  <div className="form-row" style={{ marginTop: "1rem" }}>
                    <div className="form-group col-12">
                      <ckeditor
                        content={mailMsg}
                        events={{
                          change: (newContent) => {
                            setMailMsg(newContent.editor.getData());
                          },
                        }}
                        config={{
                          removePlugins: "elementspath",
                          resize_enabled: false,
                        }}
                      />
                    </div>
                    <div
                      className="col-md-11"
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <button
                        disabled={
                          !selectedFile && props.mailModalSection?.exam === null
                        }
                        type="button"
                        onClick={() =>
                          sendExamLink(
                            props.mailModalSection.exam || props.exam
                          )
                        }
                        className="btn btn-sm btn-nxt"
                      >
                        Send Mail
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamMailModel;
