import { MenuItem } from "@mui/material";
import axios from "axios";
import _ from "lodash";
import React, { Component ,useState ,useEffect} from "react";
import { Link } from "react-router-dom";
import { authHeader, errorHandler } from "../../api/Api";
import ChipsArray from "../../utils/ChipsArray";
import { CustomTable } from "../../utils/CustomTable";
import CustomMenuItem from "../../utils/Menu/CustomMenuItem";
import Pagination from "../../utils/Pagination";
import { url } from "../../utils/UrlConstant";
import { isRoleValidation } from "../../utils/Validation";
import ExamMailModel from "../Admin/ExamMailModel";
import { Tooltip } from 'react-tippy';

const QuestionList = (props) => {

  const [questions, setQuestions] = useState([]);
  const [filter, setFilter] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectDifficulty] = useState(["ALL", "SIMPLE", "MEDIUM", "COMPLEX"]);
  const [questionTypes] = useState(["ALL", "MCQ", "TRUE/FALSE", "programming", "Fillups"]);
  const [status, setStatus] = useState(props.location?.state?.status || "ACTIVE");
  const [section, setSection] = useState(props?.location?.state?.section || "");
  const [difficulty, setDifficulty] = useState(props?.location?.state?.difficulty || "");
  const [questionType, setQuestionType] = useState(props.location?.state?.questionType || "");
  const [tooltipQuestion, setTooltipQuestion] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [sectionObject, setSectionObject] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [numberOfElements, setNumberOfElements] = useState(0);
  const [input, setInput] = useState([]);
  const [output, setOutput] = useState([]);
  const [mainClassName, setMainClassName] = useState('');
  const [sectionRoles, setSectionRoles] = useState('CANDIDATE');
  const [loader, setLoader] = useState(false);
  const [chipperData, setChipperData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [yourState, setYourState] = useState({
    questions: [],
    filter: [],
    sections: [],
    selectDifficulty: ['ALL', 'SIMPLE', 'MEDIUM', 'COMPLEX'],
    questionTypes: ['ALL', 'MCQ', 'TRUE/FALSE', 'programming', 'Fillups'],
    status: props.location?.state?.status || 'ACTIVE',
    section: props?.location?.state?.section || '',
    difficulty: props?.location?.state?.difficulty || '',
    questionType: props.location?.state?.questionType || '',
    tooltipQuestion: '',
    openModal: false,
    sectionObject: [],
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    totalElements: 0,
    numberOfElements: 0,
    input: [],
    output: [],
    mainClassName: '',
    sectionRoles: 'CANDIDATE',
    loader: false,
    chipperData: [],
  })

  useEffect(() => {
    getSections();
    getQuestions();
    setTableJson()
  }, [currentPage, pageSize, status, section, difficulty, questionType ,props.location, tooltipQuestion]);

  const setChipperDatas = () => {
    let chipperData = [];
    const chipKeys = ['questionType', 'section', 'difficulty'];
    if (status === 'INACTIVE') {
      chipKeys.push('status');
    }
    let keys = Object.keys({ status, section, difficulty, questionType });
    _.map(keys, (name) => {
      if (chipKeys.includes(name) && { status, section, difficulty, questionType }[name]) {
        chipperData.push({ label: name, value: name === 'questionType' ? "Question Type" : name });
      }
    });
    _.map(chipperData, (chip, index) => {
      chip.key = index;
    });
    setChipperData(chipperData);
  };

  const getSections = () => {
    axios
      .get(`${url.ADMIN_API}/section/list?status=${'ACTIVE'}&page=${currentPage}&size=${100}&sectionRoles=${sectionRoles}`, {
        headers: authHeader(),
      })
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
  };

  const handleStatusFilters = (value) => {
    setStatus(value);
    getQuestions();
  };

  const handleChange = (key, value) => {
    setCurrentPage(1);
    setPageSize(10);
    setYourState((prevState) => ({
      ...prevState,
      [key]: value === "ALL" ? "" : value
    }));
    getQuestions();
  };

  const getQuestions = () => {
    axios
      .get(`${url.ADMIN_API}/question/all?status=${status}&difficulty=${difficulty}&questionType=${questionType}&page=${currentPage}&size=${pageSize}&section=${section}`, {
        headers: authHeader(),
      })
      .then((res) =>
        setQuestions({
          questions: res.data.response.content,
          filter: res.data.response.content,
          totalPages: res.data.response.totalPages,
          totalElements: res.data.response.totalElements,
          numberOfElements: res.data.response.numberOfElements,
        }, () => setChipperData())
      )
      .catch((error) => errorHandler(error));
  };

  const handleDeleteChip = (data) => {
    if (data.label === 'status') {
      handleStatusFilters('ACTIVE');
    } else {
      handleChange(data.label, "");
    }
  };

  const setQuestionForTooltip = (question) => setTooltipQuestion(question);

  const onClickOpenModel = () => {
    if (!openModal) {
      document.addEventListener("click", handleOutsideClick, false);
    } else {
      document.removeEventListener("click", handleOutsideClick, false);
    }
    setOpenModal((prev) => !prev);
  };

  const handleOutsideClick = (e) => {
    if (e.target.className === "modal fade show") {
      setOpenModal((prev) => !prev);
    }
  };

  const onCloseModal = () => {
    setOpenModal((prev) => !prev);
    getQuestionsAndSections();
  };

  const getQuestionsAndSections = () => {
    getQuestions();
    getSections();
  };
  
  const setTableJson = () => {
    const headers = [
      { name: 'S.NO', align: 'center', key: 'S.NO' },
      {
        name: 'SECTION',
        align: 'left',
        isFilter: true,
        key: 'section',
        renderOptions: () => _.map(props.sections, (section) => (
          <CustomMenuItem
            key={section}
            onClick={() => props.handleChange('section', section)}
            value={section}
          >
            {section}
          </CustomMenuItem>
        )),
      },
      {
        name: 'QUESTION',
        align: 'left',
        key: 'question',
        renderCell: (question, index) => (
          <>
            <div
              data-tip
              data-for={"questionTip" + index}
              onMouseEnter={() => setTooltipQuestion(question.question)}
            >
              {question.question.slice(0, 50).replace(/(<([^>]+)>)/ig, '')}
            </div>
            <Tooltip id={"questionTip" + index} place="top" type="warning">
              <div className="questionAdmin">
                <div>Question:</div>
                <div
                  className={"questionSubdiv" + index}
                  dangerouslySetInnerHTML={{ __html: tooltipQuestion }}
                ></div>
              </div>
              <div className="questionAdmin">
                <div>Options:</div> {_.map(question.options, (list) => (
                  <div className="quesOption">
                    {' '}
                    <div className="row">
                      <div>{list.name}</div>&nbsp;:&nbsp; <div>{list.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="questionAdmin">Answer: {question.answer}</div>
            </Tooltip>
          </>
        ),
      },
      {
        name: 'Question Type',
        align: 'left',
        key: 'questionType',
        isFilter: true,
        renderOptions: () => _.map(props.questionTypes, (questionType) => (
          <CustomMenuItem
            key={questionType}
            value={questionType}
            onClick={() => props.handleChange('questionType', questionType)}
          >
            {questionType}
          </CustomMenuItem>
        )),
      },
      {
        name: 'Difficulty',
        align: 'left',
        key: 'difficulty',
        isFilter: true,
        renderOptions: () => _.map(props.selectDifficulty, (difficulty) => (
          <CustomMenuItem
            key={difficulty}
            value={difficulty}
            onClick={() => props.handleChange('difficulty', difficulty)}
          >
            {difficulty}
          </CustomMenuItem>
        )),
      },
      {
        name: 'STATUS',
        align: 'left',
        isFilter: true,
        key: 'status',
        renderOptions: () => {
          return _.map([{ name: 'Active', value: 'ACTIVE' }, { name: 'InActive', value: 'INACTIVE' }], (opt) => (
            <MenuItem
              onClick={() => props.handleStatusFilters(opt.value)}
              key={opt.value}
              value={opt.value}
            >
              {opt.name}
            </MenuItem>
          ));
        },
      },
      {
        name: 'Action',
        key: 'action',
        renderCell: (params) => (
          <Link
            className="collapse-item"
            to={{
              pathname: isRoleValidation() === 'TEST_ADMIN' ? '/testadmin/question/edit' : '/admin/questions/edit',
              state: {
                questions: params,
                action: 'Update',
                difficulty: props.difficulty,
                section: props.section,
                questionType: props.questionType,
                status: props.status,
              },
            }}
          >
            <i
              className="fa fa-pencil"
              style={{ cursor: 'pointer', color: '#3B489E' }}
              aria-hidden="true"
            ></i>
          </Link>
        ),
      },
    ];
    setHeaders(headers);
  };

  const onPagination = (pageSize, currentPage) => {
    props.setPageSize(pageSize);
    props.setCurrentPage(currentPage);
    props.getQuestions();
  };

  const increment = () => {
    props.setStartPage((prevStartPage) => prevStartPage + 5);
    props.setEndPage((prevEndPage) => prevEndPage + 5);
  };

  const decrement = () => {
    props.setStartPage((prevStartPage) => prevStartPage - 5);
    props.setEndPage((prevEndPage) => prevEndPage - 5);
  };

  return (
    <main className="main-content bcg-clr">
        <div>
          <div className="card-header-new">
            <div className="row">
              <div className="col-md-3 col-lg-3 col-3">
                <span>Questions</span>
              </div>
              <div className="col-md-6 col-lg-6 col-6">
                <ChipsArray chipperData={chipperData} handleDeleteChip={handleDeleteChip} />
              </div>
              <div className="col-md-3 col-lg-3 col-3">
                <button type="button" className="btn-sm btn-nxt header-button">
                  <Link to={isRoleValidation() === "TEST_ADMIN" ? "/testadmin/question/add" : "/admin/questions/add"}
                    style={{ textDecoration: "none", color: "white" }}> Add Question </Link>
                </button>
                <button className='btn-sm btn-nxt ml-1 header-button' onClick={() => onClickOpenModel()} style={{ marginRight: "15px" }} ><i className="fa fa-upload" aria-hidden="true"></i> Upload</button>
              </div>
            </div>

          </div>
          <CustomTable data={questions}
            headers={headers}
            loader={loader}
            pageSize={pageSize}
            currentPage={currentPage}
          />
          {numberOfElements === 0 ? '' :
            <Pagination totalPages={totalPages} currentPage={currentPage} onPagination={onPagination}
              increment={increment} decrement={decrement} numberOfElements={numberOfElements}
              totalElements={totalElements} pageSize={pageSize} />}
          {openModal ? <ExamMailModel modalSection={{ type: "Question", sections: sectionObject }}
            onCloseModal={onCloseModal} /> : ''}
        </div>
      </main>
  )
}

export default QuestionList