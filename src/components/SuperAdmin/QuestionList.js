import axios from "axios";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {Tooltip} from "react-tooltip";
import { authHeader, errorHandler } from "../../api/Api";
import Pagination from "../../utils/Pagination";
import BulkUploadModel from "./BulkUploadModel";
import { url } from "../../utils/UrlConstant";

const QuestionList = () => {
    const [questions, setQuestions] = useState([]);
    const [filter, setFilter] = useState([]);
    const [sections, setSections] = useState([]);
    const [selectDifficulty] = useState(["ALL", "SIMPLE", "MEDIUM", "COMPLEX"]);
    const [questionTypes] = useState(["ALL", "MCQ", "TRUE/FALSE"]);
    const [status, setStatus] = useState("ACTIVE");
    const [section, setSection] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [questionType, setQuestionType] = useState("");
    const [tooltipQuestion, setTooltipQuestion] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [sectionObject, setSectionObject] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [numberOfElements, setNumberOfElements] = useState(0);
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(5);
    const [sectionRoles] = useState('COMPETITOR');
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        getSectionList();
    }, [currentPage, sectionRoles]);

    const getSectionList = () => {
        axios
            .get(` ${url.ADMIN_API}/section/list?status=${'ACTIVE'}&page=${currentPage}&size=${100}&sectionRoles=${sectionRoles}`, { headers: authHeader() })
            .then((res) => {
                let selectSection = ["ALL"];
                for (let key in res.data.response.content) {
                    selectSection.push(res.data.response.content[key]["name"]);
                }
                setSections(selectSection);
                setSectionObject(res.data.response.content);
                setLoader(false);
            })
            .catch((error) => {
                setLoader(false);
                errorHandler(error);
            });
        onNextPage();
    }

    const handleStatusFilters = async (event, key) => {
        await setStatus(event.target.value);
        handleStatusFilter();
    };

    const handleStatusFilter = () => {
        axios
            .get(` ${url.ADMIN_API}/question/all?section=${section}&status=${status}&difficulty=${difficulty}&questionType=${questionType}&page=${currentPage}&size=${pageSize}`, {
                headers: authHeader(),
            })
            .then((res) => {
                setQuestions(res.data.response.content);
                setTotalPages(res.data.response.totalPages);
                setTotalElements(res.data.response.totalElements);
                setNumberOfElements(res.data.response.numberOfElements);
            })
            .catch((error) => {
                errorHandler(error);
            });
    };

    const handleFilterByTypes = async (value) => {
        if (value === "ALL") {
            await setQuestionType("");
        } else {
            await setQuestionType(value);
        }
        handleFilterByType();
    };

    const handleFilterByType = () => {
        axios
            .get(`${url.ADMIN_API}/question/all?section=${section}&status=${status}&difficulty=${difficulty}&questionType=${questionType}&page=${currentPage}&size=${pageSize}`, {
                headers: authHeader(),
            })
            .then((res) => {
                setQuestions(res.data.response.content);
                setTotalPages(res.data.response.totalPages);
                setTotalElements(res.data.response.totalElements);
                setNumberOfElements(res.data.response.numberOfElements);
            })
            .catch((error) => {
                errorHandler(error);
            });
    };

    const handleFilterByDifficultys = async (value) => {
        if (value === "ALL") {
            await setDifficulty("");
        } else {
            await setDifficulty(value);
        }
        handleFilterByDifficulty();
    };

    const handleFilterByDifficulty = () => {
        axios
            .get(`${url.ADMIN_API}/question/all?section=${section}&status=${status}&difficulty=${difficulty}&questionType=${questionType}&page=${currentPage}&size=${pageSize}`, {
                headers: authHeader(),
            })
            .then((res) => {
                setQuestions(res.data.response.content);
                setTotalPages(res.data.response.totalPages);
                setTotalElements(res.data.response.totalElements);
                setNumberOfElements(res.data.response.numberOfElements);
            })
            .catch((error) => {
                errorHandler(error);
            });
    };

    const handleFilterBySections = async (value) => {
        if (value === "ALL") {
            await setSection("");
        } else {
            await setSection(value);
            setCurrentPage(1);
            setPageSize(5);
        }
        handleFilterBySection();
    };

    const handleFilterBySection = () => {
        axios
            .get(`${url.ADMIN_API}/question/all?status=${status}&difficulty=${difficulty}&questionType=${questionType}&page=${currentPage}&size=${pageSize}&section=${section}`, {
                headers: authHeader(),
            })
            .then((res) => {
                setQuestions(res.data.response.content);
                setFilter(res.data.response.content);
                setTotalPages(res.data.response.totalPages);
                setTotalElements(res.data.response.totalElements);
                setNumberOfElements(res.data.response.numberOfElements);
            })
            .catch((error) => {
                errorHandler(error);
            });
    };

    const setQuestionForTooltip = (question, index) => {
        setTooltipQuestion(question);
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
            getSectionList();
        }
    };


    const onCloseModal = () => {
        setOpenModal(!openModal);
        getSectionList();
    };



    const renderTable = ({ questions, setQuestionForTooltip }) => {
        return questions?.length > 0 ? (
            questions.map((question, index) => (
                <tr key={index}>
                    <td>{question.section}</td>
                    <td>
                        <div
                            data-tip
                            data-for={"questionTip" + index}
                            onMouseEnter={() => setQuestionForTooltip(question.question)}
                        >
                            {question.question.slice(0, 50).replace(/(<([^>]+)>)/ig, '')}
                        </div>
                        <Tooltip
                            id={"questionTip" + index}
                            place="top"
                            // effect="solid"
                            type="warning"
                        >
                            <div className="questionAdmin">
                                <div>Question:</div>
                                <div
                                    className={"questionSubdiv" + index}
                                    dangerouslySetInnerHTML={{ __html: question.tooltipQuestion }}
                                ></div>
                            </div>
                            <div className="questionAdmin">
                                <div>Options:</div>
                                {question.options.map((list, idx) => (
                                    <div key={idx} className="quesOption">
                                        <div className="row">
                                            <div>{list.name}</div>&nbsp;:&nbsp;
                                            <div>{list.value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="questionAdmin">Answer: {question.answer}</div>
                        </Tooltip>
                    </td>
                    <td>{question.questionType}</td>
                    <td>{question.difficulty}</td>
                    <td className={question.status === "INACTIVE" ? "text-danger" : "text-success"}>
                        {question.status}
                    </td>
                    <td>
                        <Link
                            className="collapse-item"
                            to={{
                                pathname: "/individualUser/question/edit",
                                state: { questions: question, action: "Update" },
                            }}
                        >
                            <button type="button" className="btn">
                                <i className="fa fa-pencil" aria-hidden="true"></i>
                            </button>
                        </Link>
                    </td>
                </tr>
            ))
        ) : (
            <tr className="text-center">
                <td colSpan="7">NO DATA AVAILABLE IN TABLE</td>
            </tr>
        );
    };

    const onNextPage = () => {
        axios
            .get(` ${url.ADMIN_API}/question/all?section=${section}&status=${status}&difficulty=${difficulty}&questionType=${questionType}&page=${currentPage}&size=${pageSize}`, {
                headers: authHeader(),
            })
            .then((res) => {
                setQuestions(res.data.response.content);
                setFilter(res.data.response.content);
                setTotalPages(res.data.response.totalPages);
                setTotalElements(res.data.response.totalElements);
                setNumberOfElements(res.data.response.numberOfElements);
                setLoader(false);
            })
            .catch((error) => {
                errorHandler(error);
                toast.error(error.response.data.message);
            });
    };

    const increment = (event) => {
        setStartPage(startPage + 5);
        setEndPage(endPage + 5);
    };

    const decrement = (event) => {
        setStartPage(startPage - 5);
        setEndPage(endPage - 5);
    };

    const onPagination = (pageSize, currentPage) => {
        setPageSize(pageSize);
        setCurrentPage(currentPage);
        onNextPage();
    };

    return (
        <main className="main-content bcg-clr">
            <div>
                <div className="card-header-new">
                    <span>Questions</span>
                    <button type="button" className="btn btn-info header-button">
                        <Link
                            style={{ textDecoration: "none", color: "white" }}
                            to="/individualUser/question/add">
                            Add Question
                        </Link>
                    </button>
                    <button className='btn btn-info ml-1 header-button' onClick={() => onClickOpenModel()} style={{ marginRight: "15px" }} ><i className="fa fa-upload" aria-hidden="true"></i> Upload</button>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="table-border">
                            <div className="table-responsive pagination_table">
                                <table className="table table-striped">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>
                                                <div className="row">
                                                    <span style={{ padding: '0px 10px 0px 10px' }}>SECTION</span>
                                                    <div>
                                                        <div className="dropdown">
                                                            <div
                                                                className="dropdown-toggle"
                                                                type="button"
                                                                id="dropdownMenuButton"
                                                                data-toggle="dropdown"
                                                                aria-haspopup="true"
                                                                aria-expanded="false"
                                                            >
                                                                <i className="fa fa-filter" aria-hidden="true"></i>
                                                            </div>
                                                            <div
                                                                className="section dropdown-menu"
                                                                aria-labelledby="dropdownMenuButton"
                                                            >
                                                                {sections.map((key) => {

                                                                    return (
                                                                        <option
                                                                            onClick={() => handleFilterBySections(key)}
                                                                            className="dropdown-item"
                                                                            value={key}
                                                                        >
                                                                            {key}
                                                                        </option>
                                                                    );
                                                                })}

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </th>
                                            <th>QUESTION</th>
                                            <th>
                                                <div className="row">
                                                    <span>TYPE</span>
                                                    <div className="col-sm">
                                                        <div className="dropdown">
                                                            <div
                                                                className="dropdown-toggle"
                                                                type="button"
                                                                id="dropdownMenuButton"
                                                                data-toggle="dropdown"
                                                                aria-haspopup="true"
                                                                aria-expanded="false"
                                                            >
                                                                <i className="fa fa-filter" aria-hidden="true"></i>
                                                            </div>
                                                            <div
                                                                className="dropdown-menu"
                                                                aria-labelledby="dropdownMenuButton"
                                                            >
                                                                {_.map(questionTypes, (key, value) => {
                                                                    return (
                                                                        <option className="dropdown-item"
                                                                            onClick={() => handleFilterByTypes(key)}
                                                                            value={key}>
                                                                            {key}
                                                                        </option>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </th>
                                            <th>
                                                <div className="row">
                                                    <span>DIFFICULTY</span>
                                                    <div className="col-sm">
                                                        <div className="dropdown">
                                                            <div
                                                                className="dropdown-toggle"
                                                                type="button"
                                                                id="dropdownMenuButton"
                                                                data-toggle="dropdown"
                                                                aria-haspopup="true"
                                                                aria-expanded="false"
                                                            >
                                                                <i className="fa fa-filter" aria-hidden="true"></i>
                                                            </div>
                                                            <div
                                                                className="dropdown-menu"
                                                                aria-labelledby="dropdownMenuButton"
                                                            >
                                                                {_.map(selectDifficulty, (key, value) => {
                                                                    return (
                                                                        <option className="dropdown-item"
                                                                            onClick={() => handleFilterByDifficultys(key)}
                                                                            value={key}>
                                                                            {key}
                                                                        </option>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </th>
                                            <th>
                                                <div className="row">
                                                    <span>STATUS</span>
                                                    <div className="col-sm">
                                                        <div className="dropdown">
                                                            <div
                                                                className="dropdown-toggle"
                                                                type="button"
                                                                id="dropdownMenuButton"
                                                                data-toggle="dropdown"
                                                                aria-haspopup="true"
                                                                aria-expanded="false"
                                                            >
                                                                <i className="fa fa-filter" aria-hidden="true"></i>
                                                            </div>
                                                            <div
                                                                className="dropdown-menu"
                                                                aria-labelledby="dropdownMenuButton"
                                                            >
                                                                <option
                                                                    className="dropdown-item"
                                                                    onClick={(e) =>
                                                                        handleStatusFilters(e, "status")
                                                                    }
                                                                    value="ACTIVE"
                                                                >
                                                                    Active
                                                                </option>
                                                                <option
                                                                    className="dropdown-item"
                                                                    onClick={(e) =>
                                                                        handleStatusFilters(e, "status")
                                                                    }
                                                                    value="INACTIVE"
                                                                >
                                                                    InActive
                                                                </option>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </th>
                                            <th>ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody>{renderTable()}</tbody>
                                </table>
                                {numberOfElements === 0 ? '' :
                                    <Pagination
                                        totalPages={totalPages}
                                        currentPage={currentPage}
                                        onPagination={onPagination}
                                        increment={increment}
                                        decrement={decrement}
                                        startPage={startPage}
                                        numberOfElements={numberOfElements}
                                        endPage={endPage}
                                        totalElements={totalElements}
                                        pageSize={pageSize}

                                    />}
                            </div>
                            {/* </div> */}
                        </div>
                        {openModal ?
                            <BulkUploadModel
                                modalSection={{ type: "Question", sections: sectionObject }}
                                onCloseModal={onCloseModal} /> : ''
                        }
                    </div>
                </div>
            </div>
        </main>
    );
}


export default QuestionList;
