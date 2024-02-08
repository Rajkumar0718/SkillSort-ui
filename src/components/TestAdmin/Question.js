import { MenuItem } from "@mui/material";
import axios from "axios";
import _ from "lodash";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { authHeader, errorHandler } from "../../api/Api";
import ChipsArray from "../../utils/ChipsArray";
import { CustomTable } from "../../utils/CustomTable";
import CustomMenuItem from "../../utils/Menu/CustomMenuItem";
import Pagination from "../../utils/Pagination";
import { isRoleValidation } from "../../utils/Validation";
import ExamMailModel from "../Admin/ExamMailModel";
import url from "../../utils/UrlConstant";
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';


const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#fab35f',
    color: 'black',
    maxWidth: 500,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
    padding: 20,
    lineHeight: 2
  },
}));

export default class Question extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      filter: [],
      sections: [],
      selectDifficulty: ["ALL", "SIMPLE", "MEDIUM", "COMPLEX"],
      questionTypes: ["ALL", "MCQ", "TRUE/FALSE", "programming", "Fillups"],
      status: props.location?.state?.status || "ACTIVE",
      section: props?.location?.state?.section || "",
      difficulty: props?.location?.state?.difficulty || "",
      questionType: props.location?.state?.questionType || "",
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
    };
  }

  componentDidMount() {
    this.getSections();
    this.getQuestions();
  }

  setChipperData = () => {
    let chipperData = [];
    const chipKeys = ['questionType', 'section', 'difficulty']
    if (this.state.status === 'INACTIVE') {
      chipKeys.push('status')
    }
    let keys = Object.keys(this.state);
    _.map(keys, (name) => {
      if ((chipKeys.includes(name) && this.state[name])) {
        chipperData.push({ label: name, value: name === 'questionType' ? "Question Type" : name })
      }
    })
    _.map(chipperData, (chip, index) => {
      chip.key = index
    })
    this.setState({ chipperData: chipperData }, () => this.setTableJson())
  }

  getSections = () => {
    axios.get(`${url.ADMIN_API}/section/list?status=${'ACTIVE'}&page=${this.state.currentPage}&size=${100}&sectionRoles=${this.state.sectionRoles}`, { headers: authHeader() })
      .then((res) => {
        let selectSection = ["ALL"];
        for (let key in res.data.response.content) {
          selectSection.push(res.data.response.content[key]["name"]);
        }
        this.setState({ sections: selectSection, sectionObject: res.data.response.content, loader: false });
      }).catch((error) => {
        this.setState({ loader: false });
        errorHandler(error);
      });
  }

  handleStatusFilters = value => this.setState({ status: value }, this.getQuestions)

  handleChange = (key, value) => this.setState({ currentPage: 1, pageSize: 10, [key]: value === "ALL" ? "" : value }, this.getQuestions)

  getQuestions = () => {
    axios.get(`${url.ADMIN_API}/question/all?status=${this.state.status}&difficulty=${this.state.difficulty}&questionType=${this.state.questionType}&page=${this.state.currentPage}&size=${this.state.pageSize}&section=${this.state.section}`, {
      headers: authHeader(),
    }).then((res) =>
      this.setState({
        questions: res.data.response.content,
        filter: res.data.response.content,
        totalPages: res.data.response.totalPages,
        totalElements: res.data.response.totalElements,
        numberOfElements: res.data.response.numberOfElements
      }, () => this.setChipperData())).catch((error) => errorHandler(error));
  }

  handleDeleteChip = (data) => {
    if (data.label === 'status') {
      return this.handleStatusFilters('ACTIVE')
    }
    this.handleChange(data.label, "");
  }

  setQuestionForTooltip = question => this.setState({ tooltipQuestion: question });

  onClickOpenModel = () => {
    if (!this.state.openModal) {
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }
    this.setState(prev => ({ openModal: !prev.openModal }));
  };

  handleOutsideClick = (e) => {
    if (e.target.className === "modal fade show")
      this.setState(prev => ({ openModal: !prev.openModal }))
  };

  onCloseModal = () => this.setState(prev => ({ openModal: !prev.openModal }), () => this.getQuestionsAndSections());

  getQuestionsAndSections = () => {
    this.getQuestions()
    this.getSections()
  }

  getContent = (question, index) => {
    return (
      <>
        <div className="questionAdmin">
          <div>Question:</div>
          <div className={"questionSubdiv" + index} dangerouslySetInnerHTML={{ __html: this.state.tooltipQuestion }}></div>
        </div>
        <div className="questionAdmin">
          <div>Options:</div> {_.map(question.options, (list) => <div className="quesOption">
            <div className="row">
              <div>{list.name + " : " + list.value}</div>
              {/* <div>{list.value}</div> */}
            </div> </div>)}
        </div>
        <div className="questionAdmin">Answer: {question.answer}</div>
      </>
    )
  }

  setTableJson = () => {
    const headers = [{
      name: 'S.NO',
      align: 'center',
      key: 'S.NO',
    }, {
      name: 'SECTION',
      align: 'left',
      isFilter: true,
      key: 'section',
      renderOptions: () => _.map(this.state.sections, section => (
        <CustomMenuItem key={section} onClick={() => this.handleChange('section', section)}
          value={section}>{section}</CustomMenuItem>))
    }, {
      name: 'QUESTION',
      align: 'left',
      key: 'question',
      renderCell: (question, index) => {
        return (
          <>
            <HtmlTooltip title={this.getContent(question, index)}>
              <div data-tip data-for={"my-tooltip"}
                onMouseEnter={() => this.setQuestionForTooltip(question.question)}>
                {question.question.slice(0, 50).replace(/(<([^>]+)>)/ig, '')}
              </div>
            </HtmlTooltip>
          </>
        )
      }
    }, {
      name: 'QUESTION TYPE',
      align: 'left',
      key: 'questionType',
      isFilter: true,
      renderOptions: () => _.map(this.state.questionTypes, questionType => (
        <CustomMenuItem key={questionType} value={questionType}
          onClick={() => this.handleChange('questionType', questionType)}>
          {questionType}</CustomMenuItem>))
    }, {
      name: 'DIFFICULTY',
      align: 'left',
      key: 'difficulty',
      isFilter: true,
      renderOptions: () => _.map(this.state.selectDifficulty, difficulty => (
        <CustomMenuItem key={difficulty} value={difficulty}
          onClick={() => this.handleChange('difficulty', difficulty)}>
          {difficulty} </CustomMenuItem>))
    },
    {
      name: 'STATUS',
      align: 'left',
      isFilter: true,
      key: 'status',
      renderOptions: () => {
        return _.map([{ name: 'Active', value: 'ACTIVE' }, { name: 'InActive', value: 'INACTIVE' }], opt => <MenuItem onClick={() => this.handleStatusFilters(opt.value)} key={opt.value} value={opt.value}>{opt.name}</MenuItem>)
      }
    },
    {
      name: 'Action',
      key: 'action',
      renderCell: (params) => {
        return (
          <Link className="collapse-item"
            to={isRoleValidation() === "TEST_ADMIN" ? "/testadmin/question/edit" : "/admin/questions/edit"}
            state={{ questions: params, action: "Update", difficulty: this.state.difficulty, section: this.state.section, questionType: this.state.questionType, status: this.state.status }}
          >
            <i className="fa fa-pencil" style={{ cursor: 'pointer', color: '#3B489E' }} aria-hidden="true"></i>
          </Link>
        )
      }
    }
    ]
    this.setState({ headers: headers })
  }

  onPagination = (pageSize, currentPage) => this.setState({ pageSize: pageSize, currentPage: currentPage }, this.getQuestions);

  increment = () => this.setState({ startPage: (this.state.startPage) + 5, endPage: (this.state.endPage) + 5 });

  decrement = () => this.setState({ startPage: (this.state.startPage) - 5, endPage: (this.state.endPage) - 5 });

  render() {
    return (
      <main className="main-content bcg-clr">
        <div>
          <div className="card-header-new">
            <div className="row">
              <div className="col-md-3 col-lg-3 col-3">
                <span>Questions</span>
              </div>
              <div className="col-md-6 col-lg-6 col-6">
                <ChipsArray chipperData={this.state.chipperData} handleDeleteChip={this.handleDeleteChip} />
              </div>
              <div className="col-md-3 col-lg-3 col-3">
                <button type="button" className="btn btn-sm btn-nxt header-button">
                  <Link to={isRoleValidation() === "TEST_ADMIN" ? "/testadmin/question/add" : "/admin/questions/add"}
                    style={{ textDecoration: "none", color: "white" }}> Add Question </Link>
                </button>
                <button className='btn btn-sm btn-nxt ml-1 header-button' onClick={() => this.onClickOpenModel()} style={{ marginRight: "15px" }} ><i className="fa fa-upload" aria-hidden="true"></i> Upload</button>
              </div>
            </div>
          </div>
          <CustomTable data={this.state.questions}
            headers={this.state.headers}
            loader={this.state.loader}
            pageSize={this.state.pageSize}
            currentPage={this.state.currentPage}
          />
          {this.state.numberOfElements === 0 ? '' :
            <Pagination totalPages={this.state.totalPages} currentPage={this.state.currentPage} onPagination={this.onPagination}
              increment={this.increment} decrement={this.decrement} numberOfElements={this.state.numberOfElements}
              totalElements={this.state.totalElements} pageSize={this.state.pageSize} />}
          {this.state.openModal ? <ExamMailModel modalSection={{ type: "Question", sections: this.state.sectionObject }}
            onCloseModal={this.onCloseModal} /> : ''}
        </div>
      </main>
    );
  }
}