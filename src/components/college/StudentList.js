import React, { useState, useEffect } from "react";
import Button from "../../common/Button";
import { fallBackLoader } from "../../utils/CommonUtils";
import axios from "axios";
import url from "../../utils/UrlConstant";
import { authHeader } from "../../api/Api";
import { errorHandler } from "../../api/Api";
const StudentList = () => {
  const [student, setStudent] = useState([]);
  const [status, setStatus] = useState("ACTIVE");
  const [loader, setLoader] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [numberOfElements, setNumberOfElements] = useState(0);
  const [countError, setCountError] = useState(false);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(5);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [searchValue, setSearchValue] = useState("");
  const btnList = [
    {
      type: "button",
      className: "btn btn-sm btn-nxt ml-1 header-button",
      onClick: () => onClickOpenModel(),
      title: "Upload",
      style: {
        marginRight: "15px",
        marginLeft: "5px",
        display: "flex",
        flexDirection: "row-reverse",
        justifyContent: "space-evenly",
        /* align-content: center; */
        alignItems: "center",
      },
    },
  ];

  const addStudentButton = [
    {
      type: "button",
      className: "btn btn-prev btn-sm header-button",
      title: "Add Student",
      linkStyle: { textDecoration: "none", color: "white" },
      to: "/college/add",
    },
  ];

  useEffect(() => {
    getStudents();
  }, [currentPage, pageSize, status, searchValue]);

  const getStudents = () => {
    setLoader(true);
    axios
      .get(
        `${url.COLLEGE_API}/student/list/?collegeId=${user.companyId}&status=${status}&page=${currentPage}&size=${pageSize}&search=${searchValue}`,
        { headers: authHeader() }
      )
      .then((res) => {
        setStudent(res.data.response.content);
        setLoader(false);
        setTotalPages(res.data.response.totalPages);
        setTotalElements(res.data.response.totalElements);
        setNumberOfElements(res.data.response.numberOfElements);
      })
      .catch((error) => {
        setLoader(false);
        errorHandler(error);
      });
  };

  const handleStatusFilter = (event, key) => {
    setStatus(event.target.value);
  };

  const onNextPage = () => {
    setLoader(true);
    getStudents();
  };

  const onPagination = (newPageSize, newCurrentPage) => {
    setPageSize(newPageSize);
    setCurrentPage(newCurrentPage);
    onNextPage();
  };

  const increment = () => {
    setStartPage(startPage + 5);
    setEndPage(endPage + 5);
  };

  const decrement = () => {
    setStartPage(startPage - 5);
    setEndPage(endPage - 5);
  };

  const onClickOpenModel = () => {
    if (!openModal) {
      document.addEventListener("click", handleOutsideClick, false);
    } else {
      document.removeEventListener("click", handleOutsideClick, false);
    }
    setOpenModal(!openModal);
  };

  const handleOutsideClick = (e) => {
    if (e.target.className === "modal fade show") {
      setOpenModal(!openModal);
      getStudents();
    }
  };

  const onCloseModal = () => {
    setOpenModal(!openModal);
    getStudents();
  };

  const onSearch = (value) => {
    setSearchValue(value);
    setCurrentPage(1);
  };
  return (
    <main className="main-content bcg-clr">
      <div>
        {fallBackLoader(loader)}
        <div className="card-header-new">
          <span>Student List</span>
          <Button buttonConfig={btnList[0]}>
            <i className="fa fa-upload" aria-hidden="true"></i>
          </Button>
          <Button buttonConfig={addStudentButton[0]} />
        </div>
      </div>
    </main>
  );
};

export default StudentList;
