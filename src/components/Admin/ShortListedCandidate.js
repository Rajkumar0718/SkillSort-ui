import axios from "axios";
import { saveAs } from "file-saver";
import _ from "lodash";
import moment from "moment";
import { useEffect, useState } from "react";
import MailModalForShortListed from "./MailModalForShortListed";
import Pagination from "../../utils/Pagination";
import { Link } from "react-router-dom";
import { authHeader, errorHandler } from "../../api/Api";
import { fallBackLoader, toastMessage } from "../../utils/CommonUtils";
import url from "../../utils/UrlConstant";
import TableHeader from "../../utils/TableHeader";
import TableHeaderWithDate from "../../utils/TableHeaderWithDate";
import ConfirmationModal from "../Student/ConfirmationModal";
import { CustomTable } from "../../utils/CustomTable";
import styled from 'styled-components';

const statusColors = {
  OFFER_RELEASED: "green",
  REJECTED: "red",
  ON_HOLD: "#3b489e",
  NO_SHOW: "black",
};
const StyledLink = styled(Link)`
 color: black !important;
 text-decoration: none;
 &:hover {
    color: blue !important; // Change color to red on hover
 }
`;
export default function ShortListedCandidates(props) {
  const [candidates, setCandidates] = useState([]);
  const [candidateStatus, setCandidateStatus] = useState([]);
  const [hiringStatuses, sethiringStatuses] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [hiringStatus, sethiringStatus] = useState("");
  const [candidateId, setCandidateId] = useState("");
  const [showDropDown, setShowDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(5);
  const [noOfElements, setNumberOfElements] = useState(0);
  const [loader, setLoader] = useState(true);
  const [search, setSearch] = useState("");
  const [validSearch, setValidSearch] = useState(true);
  const [toDate, setToDate] = useState("");
  const [examName, setExamName] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [plan, setPlans] = useState([]);
  const [showTest, setShowTest] = useState(false);
  const [exams, setExams] = useState([]);
  const positionId = props?.position?.id;
  const [tableHeaders, setTableHeaders] = useState([]);
  let id = null;

  useEffect(() => {
    getCandidateStatus();
    getHiringStatuses();
    getExams();
    getCompanyPlans();
  }, []);

  const addElement = (email) => {
    let selected = _.cloneDeep(selectedCandidates);
    if (selected.includes(email)) {
      let index = _.findIndex(selected, (s) => s === email);
      selected.splice(index, 1);
    } else {
      selected.push(email);
    }
    setSelectedCandidates(selected);
  };

  const selectAllCandidates = () => {
    const isReset = _.size(selectedCandidates) === totalElements;
    if (!isReset) {
      axios
        .get(
          `${
            url.ADMIN_API
          }/company/shortlisted-candidates?page=${1}&size=${totalElements}&search=${search}&positionId=${positionId}`,
          { headers: authHeader() }
        )
        .then((res) => {
          let emails = _.map(res.data.response?.content, (r) => {
            return r.email;
          });
          setSelectedCandidates(emails);
        })
        .catch((err) => {
          errorHandler(err);
          setLoader(false);
        });
    } else {
      setSelectedCandidates([]);
    }
  };

  useEffect(() => {
    handleShortlisting_PageViewEventTrack();
    onNextPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, search, fromDate, toDate]);

  const getExams = () => {
    let user = JSON.parse(localStorage.getItem("user"));
    axios
      .get(
        `${url.ADMIN_API}/exam/getAllExamsByCompanyId?companyId=${
          user.companyId
        }&status=${"ACTIVE"}`,
        { headers: authHeader() }
      )
      .then((res) => {
        _.map(res.data.response, (exam, idx) => {
          if (exam.id === props.position.examId) {
            console.log(exam, "ajay");
            setExamName(exam.name);
            setExams(exam);
          }
        });
      })
      .catch((err) => {
        errorHandler(err);
        setLoader(false);
      });
  };

  const handleShortlisting_PageViewEventTrack = () => {
    window.dataLayer.push({
      event: "HR_Shortlisting_PageView",
    });
  };

  const getCompanyPlans = () => {
    axios
      .get(`${url.ADMIN_API}/plan?service=TEST`, { headers: authHeader() })
      .then((res) => {
        if (_.isEmpty(res.data.response)) return;
        setPlans(res.data.response || []);
      });
  };

  const getShortlistedCandidate = () => {
    if (search.match(/[^\w@\\.-\s]+/) != null) {
      setLoader(false);
      setValidSearch(false);
      return;
    }

    axios
      .get(
        `${
          url.ADMIN_API
        }/company/shortlisted-candidates?page=${currentPage}&size=${10}&search=${search}&fromDate=${
          moment(fromDate).isValid()
            ? moment(fromDate).format("YYYY-MM-DD")
            : ""
        }&toDate=${
          moment(toDate).isValid()
            ? moment(toDate).format("YYYY-MM-DD")
            : moment().format("YYYY-MM-DD")
        }&positionId=${positionId}`,
        { headers: authHeader() }
      )
      .then((res) => {
        setCandidates(res.data.response?.content);
        setLoader(false);
        setTotalPages(res.data.response?.totalPages);
        setTotalElements(res.data.response?.totalElements);
        setNumberOfElements(res.data.response?.noOfElements);
        setValidSearch(true);
      })
      .catch((err) => {
        errorHandler(err);
        setLoader(false);
      });
  };

  const onNextPage = () => {
    setLoader(true);
    getShortlistedCandidate();
  };

  const onPagination = (pageSize, currentPage) => {
    setPageSize(pageSize);
    setCurrentPage(currentPage);
  };

  const increment = () => {
    setStartPage(startPage + 5);
    setEndPage(endPage + 5);
  };
  const decrement = () => {
    setStartPage(startPage - 5);
    setEndPage(endPage - 5);
  };

  const resumeDownload = (candidate) => {
    axios
      .get(`${url.ADMIN_API}/company/resume/${candidate.id}`, {
        headers: authHeader(),
        responseType: "blob",
      })
      .then((res) => {
        let csvURL = window.URL.createObjectURL(res.data);
        let tempLink = document.createElement("a");
        tempLink.href = csvURL;
        tempLink.setAttribute("download", candidate.firstName.concat(".pdf"));
        tempLink.click();
      })
      .catch((error) => {
        errorHandler(error);
      });
  };

  const convertToCSV = (objArray, headerList) => {
    let array = typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
    let str = headerList + "\r\n";
    let line = "";
    _.map(array, (list, index) => {
      line =
        index +
        1 +
        "," +
        list.firstName?.concat(" ").concat(list.lastName) +
        "," +
        list.gender +
        "," +
        _.round(list.skillSortScore) +
        "," +
        list.sslc +
        "," +
        list.hsc +
        "," +
        list.ug +
        "," +
        list.phone +
        "," +
        list.email +
        "," +
        list.yop +
        "," +
        list.state +
        "," +
        list.district;
      str += line + "\r\n";
    });
    return str;
  };

  const downloadCsv = () => {
    axios
      .get(
        `${
          url.ADMIN_API
        }/company/shortlisted-candidates?page=${1}&size=${totalElements}&search=${search}&positionId=${positionId}`,
        { headers: authHeader() }
      )
      .then((res) => {
        let csvData = convertToCSV(res.data.response?.content, [
          "S.NO",
          "NAME",
          "GENDER",
          "SKILL SORT SCORE",
          "SSLC%",
          "HSC%",
          "UG%",
          "MOBILE",
          "EMAIL",
          "YOP",
          "STATE",
          "DISTRICT",
        ]);
        const blob = new Blob([csvData], { type: "text/plain" });
        saveAs(blob, `shortlisted_candidate_details.csv`);
      });
  };

  const updateCandidateStatus = (id, status) => {
    if (status === "OFFER_RELEASED") {
      handleOfferReleasedEventTrack();
    } else if (status === "REJECTED") {
      handleRejectionEventTrack();
    } else if (status === "ON_HOLD") {
      handleHold_CandidateEventTrack();
    }
    axios
      .post(
        `${url.ADMIN_API}/company/update/shortlisted-candidate?status=${status}&candidateId=${id}&positionId=${positionId}`,
        {},
        { headers: authHeader() }
      )
      .then((res) => {
        toastMessage("success", "Status Updated successfully");
        setOpenModal(false);
        getShortlistedCandidate();
        setCandidateId("");
      })
      .catch((err) => errorHandler(err));
  };

  const handleOfferReleasedEventTrack = () => {
    window.dataLayer.push({
      event: "OfferReleased",
    });
  };

  const handleRejectionEventTrack = () => {
    window.dataLayer.push({
      event: "CandidateRejection",
    });
  };

  const handleHold_CandidateEventTrack = () => {
    window.dataLayer.push({
      event: "Hold_Candidate",
    });
  };

  const getCandidateStatus = () => {
    axios
      .get(`${url.ADMIN_API}/company/candidate-status`, {
        headers: authHeader(),
      })
      .then((res) => {
        setCandidateStatus(res.data.response);
      });
  };

  const getHiringStatuses = () => {
    axios
      .get(`${url.ADMIN_API}/company/hiring-status`, { headers: authHeader() })
      .then((res) => {
        let status = res.data.response;
        sethiringStatuses(status);
      });
  };
  const handleOutsideClick = (e) => {
    if (
      e.target.className === "modal fade show" ||
      e.target.className === "btn btn-sm btn-prev" ||
      e.target.className === "btn btn-sm btn-nxt"
    ) {
      if (openModal === true) setOpenModal(!openModal);
    }
  };

  const handleOnchange = (e, id) => {
    setOpenModal(true);
    sethiringStatus(e.target.value);
    setCandidateId(id);
  };

  const handleDropDown = (id) => {
    setCandidateId(id);
    setShowDropdown(true);
  };

  useEffect(() => {
    setTableJson();
  }, [candidateId, showDropDown]);

  const setCandidate = (data) => {
    let candidate = JSON.stringify(data);
    localStorage.removeItem(data.id);
    localStorage.setItem(data.id, candidate);
  };

  const onSearch = (searchValue, fromDate, toDate) => {
    setSearch(searchValue);
    setFromDate(fromDate);
    setToDate(toDate);
    setCurrentPage(1);
    setPageSize(10);
  };

  const displayTest = () => {
    setShowTest(true);
  };

  const onCloseModal = (e) => {
    if (
      e.target.className === "modal fade show" ||
      e.target.className === "close" ||
      e.target.className === "btn btn-sm btn-nxt closeModal"
    ) {
      if (showTest === true) setShowTest(false);
    }
    getCompanyPlans();
  };

  const setTableJson = () => {
    const checkbox = candidates
      ? {
          component: examName ? (
            <input
              type="checkbox"
              checked={selectedCandidates.length === totalElements}
              onClick={() => selectAllCandidates()}
            ></input>
          ) : null,
          isComponent: true,
          align: "center",
          renderCell: (params) => {
            return (
              <>
                {examName ? (
                  <input
                    type="checkbox"
                    checked={selectedCandidates.includes(params.email)}
                    onChange={() => addElement(params.email)}
                  />
                ) : null}
              </>
            );
          },
        }
      : null;
    const headers = [
      {
        name: "S.NO",
        align: "center",
        key: "S.NO",
      },
      {
        name: "NAME	",
        align: "left",
        renderCell: (params) => {
          return (
            <StyledLink
              to={{ pathname: `/shortlisted-candidate-details/${params.id}` }}
              target="_blank"
              onClick={() => setCandidate(params)}
              style={{ color: "black", textDecoration: "none", color: "blue"}}
            >
              {`${params.firstName} ${params.lastName}`}
            </StyledLink>
          );
        },
      },
      {
        name: "EMAIL",
        align: "center",
        key: "email",
      },
      {
        name: "MOBILE",
        align: "center",
        key: "phone",
      },
      {
        name: "RESUME DOWNLOAD ",
        align: "center",
        renderCell: (params) => {
          return (
            <i
              className="fa fa-download"
              aria-hidden="true"
              data-placement="top"
              title="DOWNLOAD RESUME"
              style={{
                color: "black",
                paddingRight: "0.5rem",
                cursor: "pointer",
              }}
              onClick={() => resumeDownload(params)}
            ></i>
          );
        },
      },

      {
        name: "HIRING STATUS",
        align: "center",
        renderCell: (params) => {
          return candidateId === params.id && showDropDown ? (
            <div>
              <select
                className="profile-page"
                style={{ width: "125px" }}
                onChange={(e) => handleOnchange(e, params.id)}
                value={params?.companyStatus[0]?.hiringStatus}
              >
                <option hidden selected value="">
                  Select Status
                </option>
                {_.map(hiringStatuses, (v) => (
                  <option value={v}>{_.upperCase(v)}</option>
                ))}
              </select>
              <i
                style={{ marginLeft: "1rem", color: "red", fontSize: "1rem" }}
                onClick={() => setShowDropdown(false)}
                className="fa fa-times"
                aria-hidden="true"
              ></i>
            </div>
          ) : !params?.companyStatus[0]?.hiringStatus ? (
            <i
              style={{ marginLeft: "1rem", color: "#3b489e" }}
              onClick={() => handleDropDown(params.id)}
              className="fa fa-pencil"
              aria-hidden="true"
            ></i>
          ) : (
            <span
              style={{
                color: statusColors[params?.companyStatus[0]?.hiringStatus],
              }}
            >
              {_.upperCase(params?.companyStatus[0]?.hiringStatus)}{" "}
              {params?.companyStatus[0]?.hiringStatus !== "OFFER_RELEASED" ? (
                <i
                  style={{ marginLeft: "0.5rem", color: "#3b489e" }}
                  onClick={() => handleDropDown(params.id)}
                  className="fa fa-pencil"
                  aria-hidden="true"
                ></i>
              ) : null}
            </span>
          );
        },
      },
      checkbox,
    ];

    setTableHeaders(headers);
  };
  return (
    <main className="main-content bcg-clr">
      <div>
        {fallBackLoader(loader)}
        {_.size(candidates) > 0 ? (
          <TableHeader
            showTest={displayTest}
            title="Short-Listed Candidates"
            showLink={false}
            showButton={true}
            showSendButton={_.size(selectedCandidates) > 0 ? true : false}
            btnName="CSV Download"
            onButtonClick={downloadCsv}
          ></TableHeader>
        ) : (
          <TableHeader
            title="Short-Listed Candidates"
            showLink={false}
          ></TableHeader>
        )}
        <TableHeaderWithDate
          title="Adv.Filters"
          showSearch={true}
          showDate={true}
          placeholder="search Candidate by email, mobile"
          onSearch={onSearch}
        ></TableHeaderWithDate>

        <div className="row">
          <div className="col-md-12">
            <div className="table-border">
              <div className="table-responsive pagination_table">
                <CustomTable
                  data={candidates}
                  headers={tableHeaders}
                  pageSize={pageSize}
                  currentPage={currentPage}
                />
                <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPagination={onPagination}
                  increment={increment}
                  decrement={decrement}
                  startPage={startPage}
                  noOfElements={noOfElements}
                  endPage={endPage}
                  totalElements={totalElements}
                  pageSize={pageSize}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {showTest ? (
        <MailModalForShortListed
          exams={exams}
          examName={examName}
          emails={selectedCandidates}
          onCloseModal={onCloseModal}
          remainingTest={_.sumBy(plan || [], (p) => p.residue || 0)}
        />
      ) : null}
      {
        openModal?(<ConfirmationModal updateCandidateStatus={() => updateCandidateStatus(candidateId, hiringStatus)} close={(e) => handleOutsideClick(e)} status={hiringStatus} statusColor={statusColors[hiringStatus]}></ConfirmationModal>):null
      }
    </main>
  );
}
