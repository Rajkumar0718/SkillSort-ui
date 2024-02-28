import axios from "axios";
import _ from 'lodash';
import moment from "moment";
import React, { Component } from 'react';
import { authHeader, errorHandler } from "../../api/Api";
import ExportXlsx from "../../utils/ExportXlsx";
import url from "../../utils/UrlConstant";
import RenderModalBody from "../../common/RenderModalBody";


const columns = [
    { header: 'Name', key: 'firstName' },
    { header: 'Gender', key: 'gender' },
    { header: 'College Name', key: 'collegeName' },
    { header: 'Department', key: 'department' },
    { header: 'SSLC%', key: 'sslc' },
    { header: 'HSC%', key: 'hsc' },
    { header: 'UG%', key: 'ug' },
    { header: 'YOP', key: 'yop' },
    { header: 'EMAIL', key: 'email' },
    { header: 'PHONE', key: 'phone' },
    { header: 'SkillSort Score', key: 'score' },
];
export default class IndividualUserReportModal extends Component {
    state = {
        toggleClick: false,
        currentPage: 1,
        pageSize: 10,
        totalPages: 0,
        totalElements: 0,
        numberOfElements: 0,
        countError: false,
        startPage: 1,
        endPage: 5,
        yops: [],
        superAdminHeader: [],
        totalUsers: 0,
        selectedYop: [],
        loader: true,
        isSkillSortScorePresent: true,
        skillSortscore: [],
        isScoreFilter:"",
        report: {
            fromDate: '',
            toDate: '',
            email: '',
            yop: [],
            skillsortScore: '',
            role: 'INDIVIDUAL_USER'
        },
        individualUser: [],
        skillsortScore: [],
        individualUserXlsx: [],
        skillsortScoreXlsx: [],
        disabled: false

    }
    onNextPage = () => {
        const report = _.cloneDeep(this.state.report)
        if(report.skillsortScore && !this.state.isScoreFilter){
            report.skillsortScore = ''
            this.setState({report:report})
        }
        !report.skillsortScore ? this.handleFilter() : this.getScoreReport()
    }

    onPagination = (pageSize, currentPage) => {
        this.setState({ pageSize: pageSize, currentPage: currentPage }, () => { this.onNextPage() });
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

    componentDidMount() {
        this.handleFilter();
        this.setYearRange();
        this.setSuperAdminHeader();
    }

    setYearRange = () => {
        let startDay = moment().subtract(5, 'years');
        let endDate = moment().add(2, 'years');
        this.setState({ yops: _.range(startDay.year(), endDate.year()) })
    }

    handleFilter = () => {
        const report = _.cloneDeep(this.state.report)
        if (moment(report.fromDate).isValid() && moment(report.toDate).isValid()) {
            report.fromDate = moment(report.fromDate).format('DD/MM/YYYY')
            report.toDate = moment(report.toDate).format('DD/MM/YYYY')
        }
        if (_.isEmpty(report.toDate) && report.fromDate) {
            let toDate = new Date()
            report.toDate = moment(toDate).format('DD/MM/YYYY')
            report.fromDate = moment(report.fromDate).format('DD/MM/YYYY')
        }
        else if (_.isEmpty(report.fromDate) && report.toDate) {
            // let fromDate = new Date()
            // report.fromDate = moment(fromDate).format('DD/MM/YYYY')
            report.toDate = moment(report.toDate).format('DD/MM/YYYY')
        }


        axios.post(` ${url.COMPETITOR_API}/competitor/get-report?page=${this.state.currentPage}&size=${this.state.pageSize}`, report, { headers: authHeader() })
            .then(res => {
                this.setState({ loader: false })
                let data = res.data.response;
                let competitorlist = data?.competitors
                this.setState({
                    individualUser: competitorlist.content,
                    skillsortScore: data.score,
                    totalPages: competitorlist.totalPages,
                    totalElements: competitorlist.totalElements,
                    numberOfElements: competitorlist.numberOfElements,
                    isSkillSortScorePresent: true
                })

            }).catch(error => {
                this.setState({ loader: false })
                errorHandler(error)
            })
    }
    getScoreReport = () => {
        const report = _.cloneDeep(this.state.report)
        if (moment(report.fromDate).isValid() && moment(report.toDate).isValid()) {
            report.fromDate = moment(report.fromDate).format('DD/MM/YYYY')
            report.toDate = moment(report.toDate).format('DD/MM/YYYY')
        }
        else if (_.isEmpty(report.toDate) && report.fromDate) {
            let toDate = new Date()
            report.toDate = moment(toDate).format('DD/MM/YYYY')
            report.fromDate = moment(report.fromDate).format('DD/MM/YYYY')
        }
        else if (_.isEmpty(report.fromDate) && report.toDate) {
            // let fromDate = new Date()
            // report.fromDate = moment(fromDate).format('DD/MM/YYYY')
            report.toDate = moment(report.toDate).format('DD/MM/YYYY')
        }

        axios.post(` ${url.ADMIN_API}/adv-search/studentReport?page=${this.state.currentPage}&size=${this.state.pageSize}`, report, { headers: authHeader() })
            .then(res => {
                let data = res.data.response;
                this.setState({
                    individualUser: data.content,
                    totalPages: data.totalPages,
                    totalElements: data.totalElements,
                    numberOfElements: data.numberOfElements,
                    isSkillSortScorePresent: false
                })

            }).catch(error => {
                errorHandler(error)
            })
    }


    handleReset = () => {
        this.setState({
            users: [], individualUser: [], currentPage: 1,
            report: { ...this.state.report, fromDate: '', toDate: '', email: '', yop: [], skillsortScore: '' },
            selectedYop: [],
            pageSize: 10,
            totalPages: 0,
            totalElements: 0,
            numberOfElements: 0,
            countError: false,
            startPage: 1,
            endPage: 5,
            isScoreFilter:""
        }, () => this.handleFilter())
    }

    handleChange = (value, key) => {
        const { report } = this.state
        report[key] = value
        this.setState({ report: report })
    }


    handleYopChange = (event, isClearAll) => {
        if (isClearAll) {
            this.setState({ selectedYop: [], report: { ...this.state.report, yop: [] } })
            return;
        }
        const value = event.target.value;
        this.setState({ selectedYop: value, report: { ...this.state.report, yop: value } })
    }
    pageChange = () => {
        this.setState({
            isScoreFilter:this.state.report.skillsortScore,
            currentPage: 1,
            pageSize: 10,
            totalPages: 0,
            totalElements: 0,
            numberOfElements: 0,
            startPage: 1,
            endPage: 5,
        }, () => !this.state.report.skillsortScore ? this.handleFilter() : this.getScoreReport())
    }


    xlxsDownloadApi = () => {
        !this.state.report.skillsortScore ? this.handleFilterXlsx() : this.getScoreReportXlsx();
    }
    getScoreReportXlsx = () => {
        this.setState({ disabled: true })
        const report = _.cloneDeep(this.state.report)
        if (moment(report.fromDate).isValid() && moment(report.toDate).isValid()) {
            report.fromDate = moment(report.fromDate).format('DD/MM/YYYY')
            report.toDate = moment(report.toDate).format('DD/MM/YYYY')
        }
        if (_.isEmpty(report.toDate) && report.fromDate) {
            let toDate = new Date()
            report.toDate = moment(toDate).format('DD/MM/YYYY')
            report.fromDate = moment(report.fromDate).format('DD/MM/YYYY')
        }
        else if (_.isEmpty(report.fromDate) && report.toDate) {
            // let fromDate = new Date()
            // report.fromDate = moment(fromDate).format('DD/MM/YYYY')
            report.toDate = moment(report.toDate).format('DD/MM/YYYY')
        }
        axios.post(` ${url.ADMIN_API}/adv-search/studentReport?page=${1}&size=${this.state.totalElements}`, report, { headers: authHeader() })
            .then(res => {
                let data = res.data.response;
                this.setState({
                    individualUserXlsx: data.content,
                    isSkillSortScorePresent: false
                }, () => this.convertExportToXlsx())

            }).catch(error => {
                errorHandler(error)
            })
    }

    handleFilterXlsx = () => {
        this.setState({ disabled: true })
        const report = _.cloneDeep(this.state.report)
        if (moment(report.fromDate).isValid() && moment(report.toDate).isValid()) {
            report.fromDate = moment(report.fromDate).format('DD/MM/YYYY')
            report.toDate = moment(report.toDate).format('DD/MM/YYYY')
        }
        if (_.isEmpty(report.toDate) && report.fromDate) {
            let toDate = new Date()
            report.toDate = moment(toDate).format('DD/MM/YYYY')
            report.fromDate = moment(report.fromDate).format('DD/MM/YYYY')
        }

        axios.post(` ${url.COMPETITOR_API}/competitor/get-report?page=${1}&size=${this.state.totalElements}`, report, { headers: authHeader() })
            .then(res => {
                let data = res.data.response;
                let competitorlist = data?.competitors
                this.setState({
                    individualUserXlsx: competitorlist.content,
                    skillsortScoreXlsx: data.score,
                    isSkillSortScorePresent: true
                }, () => this.convertExportToXlsx())

            }).catch(error => {
                errorHandler(error)
            })
    }

    convertExportToXlsx = async () => {
        const keys = ['firstName', 'gender', 'collegeName', 'department', 'score', 'sslc', 'hsc', 'ug', 'yop', 'email', 'phone']
        const data = _.map(this.state.individualUserXlsx, ind => _.pick({ ...ind, score: this.state.isSkillSortScorePresent ? _.round(this.state.skillsortScoreXlsx[ind.email]) ? _.round(this.state.skillsortScoreXlsx[ind.email]) : '' : ind.skillSortScore === '-' ? '-' : _.round(ind.skillSortScore), collegeName: ind.collegeName, yop: ind.yop ? ind.yop : '' }, keys))
        ExportXlsx(data, "IndividualReport", columns)
        this.setState({ disabled: false })
    }

    setSuperAdminHeader = () => {
        const header = [
            {
                name: "S.NO",
                align: "center",
                key: "S.NO",
            },
            {
                name: "NAME",
                align: "left",
                key: "firstName",
            },
            {
                name: "Email",
                align: "left",
                key: "email",
            },
            {
                name: "REG DATE",
                align: "left",
                key: "createdDate",
                renderCell: (individualUser) => {
                    return moment(individualUser.updatedDate ? individualUser.updatedDate : individualUser.createdDate).format('DD/MM/YYYY')
                }
            },
            {
                name: "YOP ",
                align: "left",
                key: "yop",
            },
            {
                name: "SKILLSORTSCORE",
                align: "center",
                renderCell: (params) => {
                    let score = this.state.skillsortScore[params.email];
                    return (
                        this.state.isSkillSortScorePresent ? score !== undefined && score !== null ? Math.round(score) : "-" : params.skillSortScore ? params.skillSortScore : '-');
                },

            },
        ]
        this.setState({ superAdminHeader: header });
    }

    togleOption = () => {
        const { toggleClick } = this.state
        this.setState({ toggleClick: !toggleClick })
    }


    render() {
        return (
            <div
                className="modal fade show"
                id="myModal"
                role="dialog"
                style={{ display: "block", backgroundColor: "rgba(0,0,0,0.90)" }}
                aria-hidden="true"
            >
                <div className="modal-dialog-full-width" style={{ margin: "1rem" }}>
                    <div
                        className="modal-content"
                        style={{
                            borderStyle: "solid",
                            borderColor: "#af80ecd1",
                            borderRadius: "15px",
                            height: "93vh",
                            verticalAlign: "center",
                        }}
                    >
                        <div
                            className="modal-header"
                            style={{ border: "none", height: "3rem" }}
                        >
                            <div>
                                {this.state.toggleClick ? "" : <span style={{ marginRight: '10rem' }}>options </span>}
                                <i onClick={this.togleOption} style={{ fontSize: '1.5rem', marginRight: this.state.toggleClick ? _.size(this.state.individualUser) > 0 ? '45rem' : '54rem' : null }} className="fa fa-filter" aria-hidden="true"></i>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {_.size(this.state.individualUser) > 0 ? (
                                    <button
                                        disabled={this.state.disabled}
                                        style={{ marginRight: "1rem" }}
                                        onClick={this.xlxsDownloadApi}
                                        className="btn-sm btn btn-nxt"
                                    >
                                        Download
                                    </button>
                                ) : null}
                                <button
                                    type="button"
                                    onClick={this.props.onCloseModal}
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        </div>
                        <RenderModalBody
                            onChange={this.handleChange}
                            report={this.state.report}
                            numberOfElements={this.state.numberOfElements}
                            totalPages={this.state.totalPages}
                            startPage={this.state.startPage}
                            endPage={this.state.endPage}
                            pageSize={this.state.pageSize}
                            loader={this.state.loader}
                            currentPage={this.state.currentPage}
                            onPagination={this.onPagination}
                            onNextPage={this.onNextPage}
                            decrement={this.decrement}
                            increment={this.increment}
                            totalElements={this.state.totalElements}
                            colleges={this.state.colleges}
                            headers={this.state.header}
                            superAdminHeader={this.state.superAdminHeader}
                            data={this.state.individualUser}
                            selectedYop={this.state.selectedYop}
                            yops={this.state.yops}
                            handleYopChange={this.handleYopChange}
                            pageChange={this.pageChange}
                            handleReset={this.handleReset}
                            department={this.state.department}
                            toggleClick={this.state.toggleClick}
                            type="INDIVIDUAL_USER"
                        />
                    </div>
                </div>
            </div >
        );
    }
}
