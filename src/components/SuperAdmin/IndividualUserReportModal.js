// import DateFnsUtils from "@date-io/date-fns";
// import { DatePicker, MuiPickersUtilsProvider } from '@mui/x-date-pickers';
// import axios from "axios";
// import _ from 'lodash';
// import moment from "moment";
// import React, { Component } from 'react';
// import { authHeader, errorHandler } from "../../api/Api";
// import MultiSelectDropDown from "../../utils/MultiSelectDropDown";
// import Pagination from "../../utils/Pagination";
// import ExportXlsx from "../../utils/ExportXlsx";
// import { url } from "../../utils/UrlConstant";


// const columns = [
//   { header: 'Name', key: 'firstName' },
//   { header: 'Gender', key: 'gender' },
//   { header: 'College Name', key: 'collegeName' },
//   { header: 'Department', key: 'department' },
//   { header: 'SSLC%', key: 'sslc' },
//   { header: 'HSC%', key: 'hsc' },
//   { header: 'UG%', key: 'ug' },
//   { header: 'YOP', key: 'yop' },
//   { header: 'EMAIL', key: 'email' },
//   { header: 'PHONE', key: 'phone' },
//   { header: 'SkillSort Score', key: 'score' },
// ];
// export default class IndividualUserReportModal extends Component {
//   state = {
//     showOption: true,
//     currentPage: 1,
//     pageSize: 10,
//     totalPages: 0,
//     totalElements: 0,
//     numberOfElements: 0,
//     countError: false,
//     startPage: 1,
//     endPage: 5,
//     yops: [],
//     totalUsers: 0,
//     selectedYop: [],
//     isSkillSortScorePresent:true,
//     report: {
//       fromDate: '',
//       toDate: '',
//       email: '',
//       yop: [],
//       skillsortScore:'',
//       role:'INDIVIDUAL_USER'
//     },
//     individualUser: [],
//     skillsortScore: [],
//     individualUserXlsx: [],
//     skillsortScoreXlsx: [],
//     disabled :false

//   }
//   onNextPage = () => {
//    !this.state.report.skillsortScore? this.handleFilter():this.getScoreReport()
//   }
//   onPagination = (pageSize, currentPage) => {
//     this.setState({ pageSize: pageSize, currentPage: currentPage }, () => { this.onNextPage() });
//   }
//   increment = () => {
//     this.setState({
//       startPage: (this.state.startPage) + 5,
//       endPage: (this.state.endPage) + 5
//     });
//   }
//   decrement = () => {
//     this.setState({
//       startPage: (this.state.startPage) - 5,
//       endPage: (this.state.endPage) - 5
//     });
//   }

//   componentDidMount() {
//     this.handleFilter();
//     this.setYearRange();
//   }

//   setYearRange = () => {
//     let startDay = moment().subtract(5, 'years');
//     let endDate = moment().add(2, 'years');
//     this.setState({ yops: _.range(startDay.year(), endDate.year()) })
//   }

//   handleFilter = () => {
//     const report = _.cloneDeep(this.state.report)
//     if (moment(report.fromDate).isValid() && moment(report.toDate).isValid()) {
//       report.fromDate = moment(report.fromDate).format('DD/MM/YYYY')
//       report.toDate = moment(report.toDate).format('DD/MM/YYYY')
//     }
//     if (_.isEmpty(report.toDate) && report.fromDate) {
//       let toDate = new Date()
//       report.toDate = moment(toDate).format('DD/MM/YYYY')
//       report.fromDate = moment(report.fromDate).format('DD/MM/YYYY')
//     }

//     axios.post(` ${url.COMPETITOR_API}/competitor/get-report?page=${this.state.currentPage}&size=${this.state.pageSize}`, report, { headers: authHeader() })
//       .then(res => {
//         let data = res.data.response;
//         let competitorlist = data?.competitors
//         this.setState({
//           individualUser: competitorlist.content,
//           skillsortScore: data.score,
//           totalPages: competitorlist.totalPages,
//           totalElements: competitorlist.totalElements,
//           numberOfElements: competitorlist.numberOfElements,
//           isSkillSortScorePresent:true
//         })

//       }).catch(error => {
//         errorHandler(error)
//       })
//   }
//   getScoreReport = () => {
//     const report = _.cloneDeep(this.state.report)
//     if (moment(report.fromDate).isValid() && moment(report.toDate).isValid()) {
//       report.fromDate = moment(report.fromDate).format('DD/MM/YYYY')
//       report.toDate = moment(report.toDate).format('DD/MM/YYYY')
//     }
//     if (_.isEmpty(report.toDate) && report.fromDate) {
//       let toDate = new Date()
//       report.toDate = moment(toDate).format('DD/MM/YYYY')
//       report.fromDate = moment(report.fromDate).format('DD/MM/YYYY')
//     }

//     axios.post(` ${url.ADMIN_API}/adv-search/studentReport?page=${this.state.currentPage}&size=${this.state.pageSize}`, report, { headers: authHeader() })
//       .then(res => {
//         let data = res.data.response;
//         this.setState({
//           individualUser: data.content,
//           totalPages: data.totalPages,
//           totalElements: data.totalElements,
//           numberOfElements: data.numberOfElements,
//           isSkillSortScorePresent:false
//         })

//       }).catch(error => {
//         errorHandler(error)
//       })
//   }


//   handleReset = () => {
//     this.setState({
//       users: [], individualUser: [], currentPage: 1,
//       report: { ...this.state.report, fromDate: '', toDate: '', email: '', yop: [],skillsortScore:'' },
//       selectedYop:[],
//       pageSize: 10,
//       totalPages: 0,
//       totalElements: 0,
//       numberOfElements: 0,
//       countError: false,
//       startPage: 1,
//       endPage: 5,
//     }, () => this.handleFilter())
//   }

//   handleChange = (value, key) => {
//     const { report } = this.state
//     report[key] = value
//     this.setState({ report: report })
//   }
//     renderTable = () => {
//     let i = this.state.pageSize - 1;
//     console.log(this.state.individualUser?.competitors)
//     return _.size(this.state.individualUser) > 0 ? (
//       _.map(this.state.individualUser, (individualUser, index) => {
//         let score = this.state.skillsortScore[individualUser.email];
//         return (
//           <tr key={index}>
//             <td style={{ textAlign: 'center' }}>{this.state.pageSize * this.state.currentPage - i--}</td>
//             <td style={{ textAlign: 'left' }}>{individualUser.firstName}</td>
//             <td style={{ textAlign: 'left' }}>{individualUser.email}</td>
//             <td style={{ textAlign: 'left' }}>{moment(individualUser.updatedDate?individualUser.updatedDate:individualUser.createdDate).format('DD/MM/YYYY')}</td>
//             <td style={{ textAlign: 'left' }}>{individualUser.yop !== 0 ? individualUser.yop : '-'}</td>
//             <td className="col-lg-1" style={{ textAlign: 'center', fontSize: this.state.toggleClick ? null : '11px' }}>{this.state.isSkillSortScorePresent ? score !== undefined && score !== null ? Math.round(score) : "-" : individualUser.skillSortScore ? individualUser.skillSortScore : '-'}</td>
//           </tr>
//         );
//       })
//     ) : (
//       <tr className="text-center">
//         <td colspan="8">No data available in table</td>
//       </tr>
//     )
//   }

//   togleOption = () => {
//     const { showOption } = this.state
//     this.setState({ showOption: !showOption })
//   }

//   handleYopChange = (event,isClearAll) => {
//     if(isClearAll) {
//       this.setState({selectedYop: [],report: {...this.state.report,yop:[]}})
//       return;
//     }
//     const value = event.target.value;
//     this.setState({ selectedYop: value, report: { ...this.state.report, yop: value } })
//   }
//   pageChange = () => {
//     this.setState({
//       currentPage: 1,
//       pageSize: 10,
//       totalPages: 0,
//       totalElements: 0,
//       numberOfElements: 0,
//       startPage: 1,
//       endPage: 5,
//     }, () => !this.state.report.skillsortScore?this.handleFilter():this.getScoreReport())
//   }


// xlxsDownloadApi=()=>{
//   !this.state.report.skillsortScore?this.handleFilterXlsx():this.getScoreReportXlsx();
// }
// getScoreReportXlsx = () => {
//   this.setState({ disabled: true })
//   const report = _.cloneDeep(this.state.report)
//   if (moment(report.fromDate).isValid() && moment(report.toDate).isValid()) {
//     report.fromDate = moment(report.fromDate).format('DD/MM/YYYY')
//     report.toDate = moment(report.toDate).format('DD/MM/YYYY')
//   }
//   if (_.isEmpty(report.toDate) && report.fromDate) {
//     let toDate = new Date()
//     report.toDate = moment(toDate).format('DD/MM/YYYY')
//     report.fromDate = moment(report.fromDate).format('DD/MM/YYYY')
//   }

//   axios.post(` ${url.ADMIN_API}/adv-search/studentReport?page=${1}&size=${this.state.totalElements}`, report, { headers: authHeader() })
//     .then(res => {
//       let data = res.data.response;
//       this.setState({
//         individualUserXlsx: data.content,
//         isSkillSortScorePresent:false
//       },()=>this.convertExportToXlsx())

//     }).catch(error => {
//       errorHandler(error)
//     })
// }

// handleFilterXlsx = () => {
//   this.setState({ disabled: true })
//   const report = _.cloneDeep(this.state.report)
//   if (moment(report.fromDate).isValid() && moment(report.toDate).isValid()) {
//     report.fromDate = moment(report.fromDate).format('DD/MM/YYYY')
//     report.toDate = moment(report.toDate).format('DD/MM/YYYY')
//   }
//   if (_.isEmpty(report.toDate) && report.fromDate) {
//     let toDate = new Date()
//     report.toDate = moment(toDate).format('DD/MM/YYYY')
//     report.fromDate = moment(report.fromDate).format('DD/MM/YYYY')
//   }

//   axios.post(` ${url.COMPETITOR_API}/competitor/get-report?page=${1}&size=${this.state.totalElements}`, report, { headers: authHeader() })
//     .then(res => {
//       let data = res.data.response;
//       let competitorlist = data?.competitors
//       this.setState({
//         individualUserXlsx: competitorlist.content,
//         skillsortScoreXlsx: data.score,
//         isSkillSortScorePresent:true
//       },()=>this.convertExportToXlsx())

//     }).catch(error => {
//       errorHandler(error)
//     })
// }

//   convertExportToXlsx = async () => {
//     const keys = ['firstName', 'gender', 'collegeName', 'department', 'score', 'sslc', 'hsc', 'ug', 'yop', 'email', 'phone']
//     const data = _.map(this.state.individualUserXlsx, ind => _.pick({ ...ind, score: this.state.isSkillSortScorePresent ? _.round(this.state.skillsortScoreXlsx[ind.email]) ? _.round(this.state.skillsortScoreXlsx[ind.email]) : '' :ind.skillSortScore === '-'? '-': _.round(ind.skillSortScore), collegeName: ind.collegeName, yop: ind.yop ? ind.yop : '' }, keys))
//     ExportXlsx(data,"IndividualReport",columns)
//     this.setState({ disabled:false })
//   }

//   render() {
//     return (
//       <div className="modal fade show" id="myModal" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.90)' }} aria-hidden="true">
//         <div className="modal-dialog-full-width" style={{ margin: '1rem' }}>
//           <div className="modal-content" style={{ borderStyle: 'solid', borderColor: '#af80ecd1', borderRadius: "15px", height: '95vh', verticalAlign: "center" }}>
//             <div className="modal-header" style={{ border: 'none' }}>
//               {!this.state.showOption ? "" : <span>options </span>}
//               <i onClick={this.togleOption} style={{fontSize:'1.5rem', marginRight: this.state.showOption ? _.size(this.state.individualUser)>0?'45rem':'54rem' : null }} className="fa fa-filter" aria-hidden="true"></i>
//               <div>
//               {_.size(this.state.individualUser) > 0 ? <button disabled={this.state.disabled} style={{marginRight:'1rem',marginTop:'1px'}} onClick={this.xlxsDownloadApi} className="brn-sm btn btn-nxt"> Download</button> : null}
//               <button onClick={this.props.onCloseModal} type="button"  className="close" data-dismiss="modal" aria-label="Close">
//                 <span aria-hidden="true">&times;</span></button>
//                 </div>
//             </div>
//             <div className='modal-body'>
//               <div className="row">
//                 {this.state.showOption ?
//                   <div className='col-md-2'>
//                     <div className="row" style={{flexDirection:'column', height:'100%',display:'flex',justifyContent:'space-between',padding:'0.5rem'}}>
//                     <div>
//                       <label>From Date</label>
//                       <div>
//                         <MuiPickersUtilsProvider utils={DateFnsUtils}>
//                           <DatePicker format="dd/MM/yyyy" placeholder="DD/MM/YYYY" onChange={(date) => this.handleChange(date, 'fromDate')} value={this.state.report.fromDate || null}>
//                           </DatePicker>
//                         </MuiPickersUtilsProvider>
//                       </div>
//                     </div>
//                     <div>
//                       <label>To Date</label>
//                       <div>
//                         <MuiPickersUtilsProvider utils={DateFnsUtils}>
//                           <KeyboardDatePicker format="dd/MM/yyyy" placeholder="DD/MM/YYYY" onChange={(date) => this.handleChange(date, 'toDate')} value={this.state.report.toDate || null}>
//                           </KeyboardDatePicker>
//                         </MuiPickersUtilsProvider>
//                       </div>
//                     </div>
//                     <div>
//                       <label>Email</label>
//                       <div><input className="profile-page" style={{ width: '12.5rem' }} type="text" placeholder="Enter email" value={this.state.report.email}
//                         onChange={(e) => this.handleChange(e.target.value, 'email')}
//                       ></input></div>
//                     </div>
//                     <div style={{ alignItems: 'center' }}>
//                       <label>Skillsort Score</label>
//                       <div><input className="profile-page" style={{ width: '194px' }} type="text" placeholder="Enter Skillsort Score" value={this.state.report.skillsortScore}
//                         onChange={(e) => this.handleChange(e.target.value, 'skillsortScore')}
//                       ></input></div>
//                     </div>
//                     <div style={{ alignItems: 'center' }}>
//                       <label>Year of passing</label>
//                       <div style={{ width: '12.5rem'}}>
//                         <MultiSelectDropDown
//                           value={this.state.selectedYop}
//                           list={this.state.yops}
//                           handleChange={(e,clearAll) => this.handleYopChange(e,clearAll)}
//                           placeholder={'Select YOP'}
//                           width={200}
//                         />
//                       </div>
//                     </div>
//                     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                       <button onClick={this.pageChange} style={{ minWidth: '5rem' }} className="btn btn-sm btn-prev">Filter</button>
//                       <button disabled={(!this.state.report.fromDate && !this.state.report.toDate && !this.state.report.email && _.size(this.state.report.yop) === 0 && !this.state.report.skillsortScore)} onClick={this.handleReset} style={{ minWidth: '5rem' }} className="btn btn-sm btn-nxt">Reset</button>
//                     </div>
//                       </div>
//                   </div> : null}
//                 <div className={this.state.showOption ? "col-md-10" : "col-md-12"} style={{ borderTop: "2px solid grey", borderLeft: this.state.showOption ? '2px solid grey' : null, height: '82vh' }}>
//                   <div style={{ marginTop: '1rem' }}>
//                     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                       <span className="dash-text" style={{ fontWeight: '400', marginLeft: '1.4rem' }} >Individual User Report</span>
//                       <span className="dash-text" style={{ marginRight: '1.4rem' }} >Total Registered Users : {this.state.totalElements}</span>
//                     </div>
//                     <div style={{ marginTop: '1rem' }} className="table-border">
//                       <div>
//                         <div className="table-responsive pagination_table">
//                           <table className="table table-striped" id="dataTable" style={{ textAlign: 'left' }}>
//                             <thead className="table-dark">
//                               <tr>
//                                 <th className='col-lg-1 col-xl-1' style={{ textAlign: 'center' }} >S.No</th>
//                                 <th className='col-lg-4 col-xl-3' style={{ textAlign: 'left' }} >Name</th>
//                                 <th className='col-lg-4 col-xl-3' style={{ textAlign: 'left' }} >Email</th>
//                                 <th className='col-lg-2 col-xl-2' style={{ textAlign: 'left' }} >Reg Date</th>
//                                 <th className='col-lg-4 col-xl-1' style={{ textAlign: 'left' }} >Yop</th>
//                                 <th className='col-lg-2 col-xl-3' style={{ textAlign: 'left' }} >SkillSort Score</th>
//                               </tr>
//                             </thead>
//                             <tbody>
//                               {this.renderTable()}
//                             </tbody>
//                           </table>
//                           {this.state.numberOfElements ? <Pagination totalPages={this.state.totalPages} currentPage={this.state.currentPage}
//                             onPagination={this.onPagination} increment={this.increment} decrement={this.decrement} startPage={this.state.startPage}
//                             numberOfElements={this.state.numberOfElements} endPage={this.state.endPage} totalElements={this.state.totalElements}
//                             pageSize={this.state.pageSize} /> : null}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }
// }
