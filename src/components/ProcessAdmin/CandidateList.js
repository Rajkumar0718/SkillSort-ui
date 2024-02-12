import axios from 'axios';
import moment from 'moment';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { authHeader, errorHandler } from '../../api/Api';
import feedback from '../../assests/images/feedback.png';
import { fallBackLoader, withLocation } from '../../utils/CommonUtils';
import Pagination from '../../utils/Pagination';
import TableHeaderWithDate from '../../utils/TableHeaderWithDate';
import url  from '../../utils/UrlConstant';
import FeedBackModel from '../ProcessAdmin/FeedbackModel';
import { CustomTable } from '../../utils/CustomTable';

 class CandidateList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      pageSize: 10,
      totalPages: 0,
      totalElements: 0,
      first: [],
      numberOfElements: 0,
      startPage: 1,
      endPage: 5,
      candidate: {},
      examName: '',
      examId: '',
      openModel: false,
      result: {},
      loader: true,
      toDate: '',
      fromDate: '',
      searchValue: '',
      headers:[],

    }
  }

  componentDidMount() {
    this.setTableJson()
    this.getSkillSortCandidates();
  }
  setTableJson = () => {
    const headers = [
        {
            name: 'S.NO',
            align: 'center',
            key: 'S.NO',
        },
        {
            name: 'CANDIDATE NAME',
            align: 'left',
            key: 'candidate.firstName',
        },
        {
            name: 'GENDER',
            align: 'left',
            key: 'candidate.gender',
        },
        {
            name: 'PANELIST NAME',
            align: 'left',
            key: 'panelist',
            renderCell:(params) =>{
              return params.panelist?params.panelist:"-"
            }
        },
        {
           name:'INTERVIEW DATE',
           align:'center',
           key:'interviewDate',
           renderCell:(params) =>{
            return params.interviewDate?params.interviewDate:"-"
          }
        },

        {
           name:'STATUS',
           align:'left',
           key:'status'
        },
        
        {
            name: 'Action',
            key: 'action',
            renderCell: (params) => {
                return (
                  <>
                  <Link to='/processadmin/company/test/candidate/sendmail' state= {{ candidate: params.candidate, skillSortId: params.candidate.id} } >
                  <button type="button" data-toggle="tooltip" data-placement="top" title="Allocate To Panelist" className="btn btn-sm ml-1"><i className="fa fa-paper-plane" aria-hidden="true"></i></button>
                </Link> 
                </>
                );
            },
        },
        {
          name:'FEEDBACK',
          align:'center',
          key:'feedback',
          renderCell:(params) =>{
            return params.feedback?params.feedback:"-"
          }
       },
    ]
    this.setState({headers: headers});
};

  getSkillSortCandidates = () => {
    axios.get(` ${url.ADMIN_API}/superadmin/selected?examId=${localStorage.getItem("examId")}&page=${this.state.currentPage}&size=${this.state.pageSize}&status=NOTIFIED_TO_SKILL_SORT&fromDate=${(this.state.fromDate !== '' && this.state.fromDate) ? moment(this.state.fromDate).format('DD/MM/YYYY') : ''}&toDate=${(this.state.toDate !== '' && this.state.toDate) ? moment(this.state.toDate).format('DD/MM/YYYY') : ''}&searchValue=${this.state.searchValue}`, { headers: authHeader() })
      .then(res => {
        this.setState({
          candidate: res.data.response.content,
          totalPages: res.data.response.totalPages,
          totalElements: res.data.response.totalElements,
          numberOfElements: res.data.response.numberOfElements,
          examName: localStorage.getItem("examName"),
          examId: localStorage.getItem("examId"),
          loader: false
        });
      })
      .catch(error => {
        this.setState({ loader: false });
        errorHandler(error);
      })
  }

  onNextPage = () => {
    this.setState({ loader: true })
    this.getSkillSortCandidates();
  }



  increment = () => {
    this.setState({
      startPage: (this.state.startPage) + 5,
      endPage: (this.state.endPage) + 5
    });
  }
  decrement = () => {
    this.setState({
      startPage: (this.state.startPage) - 5,
      endPage: (this.state.endPage) - 5
    });
  }

  FBModel = (data) => {
    if (!this.state.openModel) {
      document.addEventListener("click", this.handleOutSideClick, true);
    } else {
      document.removeEventListener("click", this.handleOutSideClick, false);
    }
    this.setState({ openModel: !this.state.openModel, result: data });
  };

  handleOutSideClick = (e) => {
    if (e.target.className === "modal fade show") {
      this.setState({ openModel: !this.state.openModel })
      this.getSkillSortCandidates();
    }
  }

  onCloseModal = () => {
    this.setState({ openModel: false });
    this.getSkillSortCandidates();
  }

  onSearch = (searchValue, fromDate, toDate) => {
    this.setState({ searchValue: searchValue, fromDate: fromDate, toDate: toDate }, () => { this.getSkillSortCandidates() });
  }

  onPagination = (pageSize, currentPage) => {
    this.setState({ pageSize: pageSize, currentPage: currentPage }, () => { this.onNextPage() });
  }

  setFontColor = (status) => {
    if (status === 'ASSIGNED TO PANELIST') return '#17a2b8'
    if (status === 'FEEDBACK RECEIVED') return '#ffc107'
    if (status === 'FEEDBACK FORWARDED') return 'green'
  }

  render() {
    return (
      <main className="main-content bcg-clr">
        <span className='card-title' style={{ fontFamily: 'Baskervville', fontWeight: '400', fontSize: '30px', verticalAlign: '-webkit-baseline-middle', marginLeft: '1.2rem' }}>Selected Candidates</span>
        <TableHeaderWithDate
          title="Adv.Filters"
          onSearch={this.onSearch}
          showLink={false}
          showSearch={true}
          showDate={true}
          placeholder="Panelist or Candidate"
        />
         <CustomTable headers={this.state.headers} data={this.state.candidate} pageSize={this.state.pageSize} currentPage={this.state.currentPage} style ={{width:'97%' , marginLeft:'18px'}}></CustomTable>
           {this.state.numberOfElements ? <Pagination totalPages={this.state.totalPages} currentPage={this.state.currentPage}
                  onPagination={this.onPagination} increment={this.increment} decrement={this.decrement} startPage={this.state.startPage}
                  numberOfElements={this.state.numberOfElements} endPage={this.state.endPage} totalElements={this.state.totalElements}
                  pageSize={this.state.pageSize} /> : null}
        <div>
          {this.state.openModel ? (
            <FeedBackModel
              modelSection={{
                skillSortCandidate: this.state.result,
              }}
              onCloseModal={this.onCloseModal}
            />
          ) : (
            ""
          )}
        </div>
      </main>
    );
  }
}

export default withLocation(CandidateList)