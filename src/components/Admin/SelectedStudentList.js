import axios from 'axios';
import { saveAs } from 'file-saver';
import _ from 'lodash';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { authHeader, errorHandler } from '../../api/Api';
import feedback from '../../assests/images/feedback.png';
import notify from '../../assests/images/Notified Skillsort.png';
import notify2 from '../../assests/images/Notify2.png';
import { fallBackLoader } from '../../utils/CommonUtils';
import Pagination from '../../utils/Pagination';
import  url  from '../../utils/UrlConstant';
import { isRoleValidation } from '../../utils/Validation';
import './AddExam.css';
import EmailSortlistedCandidate from './EmailSortlistedCandidate';
import FeedBackModel from './FeedBackModel';
import BasicMenu from '../../common/BasicMenu';
import Status from "../../common/Status"
export default class SelectedStudentList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      examName: '',
      statusType: null,
      sendData: '',
      showData: false,
      examId: '',
      loader: false,
      currentPage: 1,
      pageSize: 10,
      totalPages: 0,
      totalElements: 0,
      openModal: false,
      first: [],
      numberOfElements: 0,
      startPage: 1,
      endPage: 5,
      candidate: {},
      candidateStatus: '',
      selected: [],
      selectAll: 0,
      exportResult: [],
      openFBModal: false,
      FBModelData: [],
      status: [],
      plans: [],
      planCount: 0
    }
  }


  componentWillMount() {
    this.setState({
      examId:this.props.position.examId,
    })
  }

  componentDidMount() {
    this.getSelectedCandidates();
    this.getCompanyPlans();
  }

  getSelectedCandidates = () => {
    this.setState({ showData: true, selected: [] });
    axios.get(` ${url.ADMIN_API}/candidate/selected?examId=${this.state.examId}&page=${this.state.currentPage}&size=${this.state.pageSize}&status=${this.state.statusType}`, { headers: authHeader() })
      .then(res => {
        console.log(res.data.response.content);
        this.setState({ candidate: res.data.response.content, totalPages: res.data.response.totalPages, totalElements: res.data.response.totalElements, numberOfElements: res.data.response.numberOfElements, examName: this.props.position.name });
        let st = _.filter(res.data.response.content, can => can.candidateStatus !== 'NOTIFIED_TO_SKILL_SORT')?.map(cad => cad.id)
        this.setState({ status: st })
      })
      .catch(error => {
        this.setState({ loader: false });
      })
  }

  onPagination = (pageSize, currentPage) => {
    this.setState({ pageSize: pageSize, currentPage: currentPage }, () => { this.onNextPage() });
  }

  getCompanyPlans = () => {
    axios.get(`${url.ADMIN_API}/plan?service=INTERVIEW`, { headers: authHeader() })
      .then(res => {
        if (_.isEmpty(res.data.response)) return
        const plans = res.data.response || []
        this.setState({ plans: plans, planCount: _.sumBy(plans, p => p.residue || 0) })
      }).catch(error => errorHandler(error))
  }

  FBModel = () => {
    if (!this.state.openFBModal) {
      document.addEventListener("click", this.handleOutSideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutSideClick, false);
    }
    this.setState({ openFBModal: !this.state.openFBModal });
    this.setState({ FBModelData: [] });
  };

  handleOutSideClick = (e) => {
    if (e.target.className === "modal fade show") {
      this.setState({ openFBModal: !this.state.openFBModal })
      this.componentDidMount();
    }
  }

  onCloseModal = () => {
    this.setState({ openModal: false });
    this.setState({ openFBModal: false });
    this.componentDidMount();
  }

  onNextPage = () => {
    if (!this.handleProps()) {
      axios.get(` ${url.ADMIN_API}/candidate/selected?examId=${this.state.examId}&page=${this.state.currentPage}&size=${this.state.pageSize}&status=${this.state.statusType}`, { headers: authHeader() })
        .then(res => {
          this.setState({ candidate: res.data.response.content, totalPages: res.data.response.totalPages, totalElements: res.data.response.totalElements, numberOfElements: res.data.response.numberOfElements });
          let st = _.filter(res.data.response.content, can => can.candidateStatus !== 'NOTIFIED_TO_SKILL_SORT')?.map(cad => cad.id)
          this.setState({ status: st, selected: [], selectAll: 0 })
        }).catch(error => {
          this.setState({ loader: false });
          errorHandler(error);
        })
    } else {
      axios.get(` ${url.ADMIN_API}/candidate/selected?examId=${this.state.examId}&page=${this.state.currentPage}&size=${this.state.pageSize}&status=${'NOTIFIED_TO_SKILL_SORT'}`, { headers: authHeader() })
        .then(res => {
          this.setState({ candidate: res.data.response.content });
        }).catch(error => {
          this.setState({ loader: false });
          errorHandler(error);
        })
    }
  }

  increment = (event) => {
    this.setState({
      startPage: (this.state.startPage) + 5,
      endPage: (this.state.endPage) + 5
    });
  }
  decrement = (event) => {
    this.setState({
      startPage: (this.state.startPage) - 5,
      endPage: (this.state.endPage) - 5
    });
  }

  handleProps = () => this.props.location?.pathname?.indexOf('skillsort') > -1

  downloadAll = (status) => {
    axios.get(` ${url.ADMIN_API}/candidate/download?examId=${this.state.examId}&status=${status}`, { headers: authHeader() })
      .then(res => {
        if (res.data.response.length > 0)
          this.setState({ exportResult: res.data.response }, () => this.downloadCsv(status));
        else
          toast.info("No data to download")
      })
  }

  convertToCSV = (objArray) => {
    let array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = 'S.No,NAME,EMAIL,STATUS';
    str += row + '\r\n';
    let line = '';
    _.map(array, (list, index) => {
      line = index + 1 + ',' + list.firstName + ' ' + list.lastName + ',' + list.email + ',' + list.candidateStatus
      str += line + '\r\n';
    })
    return str;
  }

  downloadCsv = (status) => {

    let csvData = this.convertToCSV(this.state.exportResult)
    const blob = new Blob([csvData], { type: "text/plain" });
    saveAs(blob, `${status}.csv`);
  }

  handleStatusFilters(event, key) {
    if(key==="ALL"){
      key=null
    }else if(key==="SELECTED"){
      key="SELECTED"
    }else if(key==="NOTIFIED TO SKILL SORT"){
      key="NOTIFIED_TO_SKILL_SORT"
    }else if(key ==="INTERNALLY SCHEDULED"){
      key="SCHEDULED"
    }

    this.setState({ statusType: key, currentPage: '1' }, () => this.componentDidMount())
  }

  internallySchedule = () => {
    axios.post(`${url.ADMIN_API}/candidate/schedule`, this.state.selected, { headers: authHeader() })
      .then(res => {
        this.componentDidMount()
      })
  }

  notifyToSkillSort = () => {
    axios.post(`${url.ADMIN_API}/candidate/notify`, this.state.selected, { headers: authHeader() })
      .then(res => {
        this.componentDidMount()
      }).catch(err => errorHandler(err))
  }


  handleSelected = (id) => {
    toast.dismiss();
    let idx = this.state.selected.indexOf(id)
    let select = this.state.selected
    let planCount = this.state.planCount
    if (idx > -1) {
      select.splice(idx, 1);
      planCount = planCount + 1
    } else {
      if (planCount < 1) {
        this.exceedLimit();
        return;
      }
      select.push(id)
      planCount = planCount - 1
    }
    this.setState({ selected: select, planCount: planCount })
  }

  handleSelectAll = () => {
    toast.dismiss();
    if (this.state.planCount < _.size(_.filter(this.state.candidate, c => c.candidateStatus !== 'NOTIFIED_TO_SKILL_SORT'))) {
      this.exceedLimit(this.state.planCount);
    } else {
      if (_.size(this.state.candidate) > 0 && this.state.selectAll === 0 && _.size(this.state.selected) !== _.size(this.state.status)) {
        let newSelected = [];
        _.map(this.state.candidate, can => {
          if (can.candidateStatus !== 'NOTIFIED_TO_SKILL_SORT')
            newSelected.push(can.id)
        })
        this.setState({ selected: newSelected, selectAll: 1 })
      } else {
        this.setState({ selected: [], selectAll: 0 })
      }
    }
  }

  setStatusColor = (status) => {
    if (status === 'SCHEDULED') return '#3B489E'
    if (status === 'SELECTED') return 'green'
    return '#F05A28'
  }

  exceedLimit = (limit) => {
    toast(`You are about to exceed max limit${limit ? ` (${limit})` : ''}`,
      { style: { backgroundColor: 'rgb(255, 244, 229)', color: 'rgb(102, 60, 0)' }, autoClose: 5000, closeOnClick: true })
  }

  renderTable = () => this.state.candidate.length > 0 ? _.map(this.state.candidate, (result, index) =>
  (<>
    <tr>
      <td style={{ textAlign: 'center' }}>{index + 1}</td>
      <td>{result.firstName} {result.lastName}</td>
      {!this.handleProps() ? "" : <td style={{ textAlign: 'center' }}>{result.gender}</td>}
      <td>{result.email}</td>
      {!this.handleProps() ? "" : <td>{result.phone}</td>}
      {!this.handleProps() ?
        <td style={{ textAlign: 'left', color: this.setStatusColor(result.candidateStatus) }}>
          <span>{result.candidateStatus === "SELECTED" ? "PENDING" : result.candidateStatus === "SCHEDULED" ? "NOTIFIED INTERNALLY" : "NOTIFIED TO SKILL SORT"}</span>
        </td> :
        <td style={{ textAlign: 'left', color: this.setStatusColor(result.candidateStatus) }}>
          <span>{result.candidateStatus === "SELECTED" ? "SELECTED" : result.candidateStatus === "SCHEDULED" ? "NOTIFIED INTERNALLY" : "PENDING"}</span></td>}
      {!this.handleProps() && isRoleValidation() !== 'HR' && result.candidateStatus !== 'NOTIFIED_TO_SKILL_SORT' ? <td>
        <input type='checkbox' checked={this.state.selected.indexOf(result.id) > -1} onChange={() => this.handleSelected(result.id)} />
      </td> :
        <td><span><i data-toggle="tooltip" title="Already Notified to Skill sort&#13;" className="fa fa-info-circle"></i></span></td>}
      {!this.handleProps() ? "" : <td style={{ textAlign: 'center' }}>
        <button type="button" data-toggle="tooltip" data-placement="top" title="FEEDBACK"
          onClick={() => this.FBModel()} className="btn btn ml-1" style={{ border: 'none', padding: 'initial' }}>
          <img src={feedback} style={{ width: '26px' }} alt="SkillSort" />
        </button>
      </td>}
    </tr>
    {this.handleProps() && <div>
      {this.state.openFBModal ? (<FeedBackModel onCloseModal={this.onCloseModal} modelData={this.state.FBModelData} />) : ("")}
    </div>} </>)) : <tr className='text-center'><td colspan="7">NO DATA AVAILABLE</td></tr>
menuItem = ["ALL", "NOTIFIED SKILL SORT", "NOTIFIED INTERNALLY"];
statusItem = ["ALL", "SELECTED","NOTIFIED TO SKILL SORT", "INTERNALLY SCHEDULED" ];
  render() {
    return (
      <div>
        {fallBackLoader(this.state.loader)}
        <div className="card-header-new">
          {/* <span>{!this.handleProps() ? 'Selected ' : 'Notified '}Candidates</span> */}
          {this.state.selected.length > 0 ?
            <div className='pull-right pull-down' style={{ paddingTop: '8px' }}>
              <button type="button" data-toggle="tooltip" data-placement="bottom" title="NOTIFY TO SKILL SORT"
                onClick={() => this.notifyToSkillSort()} className="btn btn-sm btn-nxt" style={{ border: 'none' }}>
                <img src={notify2} style={{ width: '15px', marginRight: '5px' }} alt="notify"></img>
                Notify to SkillSort
              </button>
              <button type="button" data-toggle="tooltip" data-placement="top" title="SCHEDULE INTERNALLY"
                onClick={() => this.internallySchedule()} className="btn btn-sm btn-prev"
                style={{ border: 'none', marginLeft: '0.5rem' }}>
                <img src={notify} style={{ width: '15px', marginRight: '5px' }} alt="schedule"></img>
                Schedule Internally
              </button>
            </div> : null}
          <div style={{display:"flex",flexDirection:"row-reverse"}}>
            {!this.handleProps() && this.state.selected.length === 0 ? (
            <BasicMenu menuItem={this.menuItem} onClick={this.downloadAll} />
          ) :
            null}
          <span className='black-label pull-right'><div>{this.state.planCount || 0}</div>Interviews Available</span>
          </div>
        </div>
        <div style={{ display: this.state.showData ? 'block' : 'none', border: 'none' }} >
          <table className="table tb-hover" id="dataTable">
            <thead className="table-dark-custom">
              <tr>
                <th style={{ textAlign: 'center' }}>S.NO</th>
                <th scope="col">Name</th>
                {!this.handleProps() ? "" : <th scope="col" style={{ textAlign: 'center' }}>GENDER</th>}
                <th scope="col">Email</th>
                {!this.handleProps() ? "" : <th scope="col">Phone</th>}
                {/* <th scope="col">SCHEDULED STATUS</th> */}
                {!this.handleProps() ? <th>
                  <Status menuItem={this.statusItem} onClick={(e, key) => this.handleStatusFilters(e, key)}></Status>

                  {/* <div className="row" style={{ paddingLeft: '15px' }}>
                    <div>Status</div>
                    <div className="col-sm">
                      <div className="dropdown">
                        <div className="dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" >
                          <i className="fa fa-filter" aria-hidden="true"></i>
                        </div>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" >
                          <option className="dropdown-item" onClick={(e) => this.handleStatusFilters(e, "status")} value="null" > ALL </option>
                          <option className="dropdown-item" onClick={(e) => this.handleStatusFilters(e, "statusType")} value="SELECTED" > SELECTED </option>
                          <option className="dropdown-item" onClick={(e) => this.handleStatusFilters(e, "statusType")} value="NOTIFIED_TO_SKILL_SORT" > NOTIFIED TO SKILLSORT </option>
                          <option className="dropdown-item" onClick={(e) => this.handleStatusFilters(e, "statusType")} value="SCHEDULED" > INTERNALLY SCHEDULED </option>
                        </div>
                      </div>
                    </div>
                  </div> */}
                </th> : <th style={{ textAlign: 'center' }}> STATUS </th>}
                {!this.handleProps() ? "" : <th style={{ textAlign: 'center' }}>FEEDBACK</th>}
                {!this.handleProps() && this.state.totalElements > 0 && isRoleValidation() !== 'HR' && this.state.status.length ? <th scope="col">
                  <input type='checkbox' checked={this.state.selected.length === this.state.status.length} onChange={() => this.handleSelectAll()} /></th> : <th scope='col'></th>}
              </tr>
            </thead>
            <tbody> {this.renderTable()} </tbody>
          </table>
          <Pagination
            totalPages={this.state.totalPages} currentPage={this.state.currentPage} onPagination={this.onPagination} increment={this.increment}
            decrement={this.decrement} startPage={this.state.startPage} pageSize={this.state.pageSize}
            numberOfElements={this.state.numberOfElements} endPage={this.state.endPage} totalElements={this.state.totalElements} />
        </div>
        {this.state.openModal ? (
          <EmailSortlistedCandidate
            candidate={{ sendData: this.state.sendData, candidateStatus: this.state.candidateStatus }} onCloseModal={this.onCloseModal} />
        ) : ("")}
      </div >
    );
  }
}
