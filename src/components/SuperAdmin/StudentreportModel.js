import axios from "axios";
import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import { authHeader, errorHandler } from "../../api/Api";
import { calculatePercentage } from '../../utils/CommonUtils';
import ExportXlsx from "../../utils/ExportXlsx";
import url from "../../utils/UrlConstant";
import { isRoleValidation } from "../../utils/Validation";
import { RenderModalBody } from "../../common/RenderModalBody"

const columnsForCollege = [
    { header: 'NAME', key: 'firstName', alignment: 'left' },
    { header: 'DEPARTMENT', key: 'department', alignment: 'center' },
    { header: 'LOGICAL (%)', key: 'LOGICAL REASONING', alignment: 'right' },
    { header: 'VERBAL (%)', key: 'VERBAL ABILITY', alignment: 'right' },
    { header: 'NUMERICAL (%)', key: 'NUMERICAL ABILITY', alignment: 'right' },
    { header: 'TECHNICAL (%)', key: 'tech', alignment: 'right' },
    { header: 'PROGRAMMING', key: 'programming', alignment: 'right' },
    { header: 'SKILLSORT SCORE', key: 'score', alignment: 'right' }
];

const columnsForSuperAdmin = [
    { header: 'NAME', key: 'firstName' },
    { header: 'EMAIL', key: 'email' },
    { header: 'PHONE', key: 'phone' },
    { header: 'GENDER', key: 'gender' },
    { header: 'COLLEGE NAME', key: 'collegeName' },
    { header: 'DEPARTMENT', key: 'department' },
    { header: 'SSLC%', key: 'sslc' },
    { header: 'HSC%', key: 'hsc' },
    { header: 'UG%', key: 'ug' },
    { header: 'YOP', key: 'yop' },
    { header: 'SKILLSORT SCORE', key: 'score' }
];

const keys = ['firstName', 'department', 'collegeName', 'gender', 'email', 'phone', 'sslc', 'hsc', 'ug', 'yop', 'company', 'LOGICAL REASONING', 'VERBAL ABILITY', 'NUMERICAL ABILITY', 'tech', 'programming', 'score']

export default class StudentreportModal extends Component {
    constructor() {
        super();
        this.state = {
            student: [],
            studentXlsx: [],
            skillSortscoreXlsx: [],
            college: [],
            colleges: [],
            skillSortscore: [],
            department: [],
            toggleClick: false,
            isSkillSortScorePresent: true,
            loader: true,
            currentPage: 1,
            pageSize: 10,
            totalPages: 0,
            totalElements: 0,
            numberOfElements: 0,
            countError: false,
            startPage: 1,
            endPage: 5,
            totalStudents: 0,
            selectedYop: [],
            yops: [],
            disabled: false,
            header: [],
            superAdminHeader: [],
            report: {
                fromDate: '',
                toDate: '',
                email: '',
                collegeId: '',
                department: '',
                yop: [],
                skillsortScore: '',
                role: 'STUDENT'
            },
        }
    }
    onChange = (value, key) => {
        const { report } = this.state
        if (key === "collegeId") {
            report[key] = this.state.colleges[value]?.id
        }
        else if (key === "department") {
            report[key] = this.state.department[value.target.value]?.departmentName

        }
        else {
            report[key] = value
        }
        this.setState({ report: report })
    }

    getReport = () => {
        const report = _.cloneDeep(this.state.report)
        if (moment(report.fromDate).isValid() && moment(report.toDate).isValid()) {
            report.fromDate = moment(report.fromDate).format('DD/MM/YYYY')
            report.toDate = moment(report.toDate).format('DD/MM/YYYY')
        }
        if (_.isEmpty(report.toDate) && report.fromDate) {
            let toDate = new Date()
            report.fromDate = moment(report.fromDate).format('DD/MM/YYYY')
            report.toDate = moment(toDate).format('DD/MM/YYYY')
        }
        else if (_.isEmpty(report.fromDate) && report.toDate) {
            // let fromDate = new Date()
            // report.fromDate = moment(fromDate).format('DD/MM/YYYY')
            report.toDate = moment(report.toDate).format('DD/MM/YYYY')
        }

        axios.post(` ${url.COLLEGE_API}/student/getReport?page=${this.state.currentPage}&size=${this.state.pageSize}`, report, { headers: authHeader() })
            .then((res) => {
                this.setState({
                    student: res.data.response.student.content,
                    skillSortscore: res.data.response.score,
                    totalPages: res.data.response.student.totalPages,
                    totalElements: res.data.response.student.totalElements,
                    numberOfElements: res.data.response.student.numberOfElements,
                    loader: false,
                    isSkillSortScorePresent: true
                }, isRoleValidation() === 'COLLEGE_ADMIN' ? () => this.getSectionMarks() : null)
            })
            .catch((error) => {
                this.setState({ loader: false });
                errorHandler(error);
            });
    }
    onNextPage = () => {
        !this.state.report.skillsortScore ? this.getReport() : this.getScoreReport();
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


    handleReset = () => {
        this.setState({
            student: [], colleges: [], department: [], report: { ...this.state.report, fromDate: '', toDate: '', email: '', collegeId: '', department: '', skillsortScore: '', yop: [] }, currentPage: 1,
            pageSize: 10,
            totalPages: 0,
            totalElements: 0,
            numberOfElements: 0,
            countError: false,
            startPage: 1,
            endPage: 5,
            selectedYop: [],
            showCompanyOfferReleased: "NO"
        }, () => this.getReport(), this.getCollege(), this.getDepartment())
    }

    componentDidMount() {
        this.getCollege()
        if (isRoleValidation() === 'SUPER_ADMIN') {
            this.getReport()
            this.setSuperAdminHeader()
        }
        this.setHeader();
        this.getDepartment()
        this.setYearRange()
    }
    setYearRange = () => {
        let startDay = moment().subtract(5, 'years');
        let endDate = moment().add(2, 'years');
        this.setState({ yops: _.range(startDay.year(), endDate.year()) })
    }

    getDepartment = () => {
        axios.get(` ${url.ADMIN_API}/department?status=ACTIVE`, { headers: authHeader() })
            .then(res => {
                this.setState({ department: res.data.response })
            })
            .catch(error => {
                errorHandler(error);
            })
    }
    pageChange = () => {
        this.setState({
            currentPage: 1,
            pageSize: 10,
            totalPages: 0,
            totalElements: 0,
            numberOfElements: 0,
            startPage: 1,
            endPage: 5,
        }, () => !this.state.report.skillsortScore ? this.getReport() : this.getScoreReport())
    }

    getScoreReport = () => {
        const report = _.cloneDeep(this.state.report)
        if (moment(report.fromDate).isValid() && moment(report.toDate).isValid()) {
            report.fromDate = moment(report.fromDate).format('DD/MM/YYYY')
            report.toDate = moment(report.toDate).format('DD/MM/YYYY')
        }
        if (_.isEmpty(report.toDate) && report.fromDate) {
            let toDate = new Date()
            report.fromDate = moment(report.fromDate).format('DD/MM/YYYY')
            report.toDate = moment(toDate).format('DD/MM/YYYY')
        }
        if (this.state.showCompanyOfferReleased === 'YES' && !this.state.report.skillsortScore) {
            report.skillsortScore = 0;
        }
        else if (_.isEmpty(report.fromDate) && report.toDate) {
            // let fromDate = new Date()
            // report.fromDate = moment(fromDate).format('DD/MM/YYYY')
            report.toDate = moment(report.toDate).format('DD/MM/YYYY')
        }

        axios.post(` ${url.ADMIN_API}/adv-search/studentReport?page=${this.state.currentPage}&size=${this.state.pageSize}`, report, { headers: authHeader() })
            .then((res) => {
                let studentScore = _.reduce(res.data.response.content, (st, obj) => {
                    st[obj.email] = obj.skillSortScore ? obj.skillSortScore : '-'
                    return st;
                }, {})
                this.setState({
                    student: res.data.response.content,
                    skillSortscore: studentScore,
                    totalPages: res.data.response.totalPages,
                    totalElements: res.data.response.totalElements,
                    numberOfElements: res.data.response.numberOfElements,
                    isSkillSortScorePresent: false,
                    loader: false

                }, isRoleValidation() === 'COLLEGE_ADMIN' ? () => this.getSectionMarks() : null)

            })
            .catch((error) => {
                this.setState({ loader: false });
                errorHandler(error);
            });
    }
    handleYopChange = (event, isClearAll) => {
        if (isClearAll) {
            this.setState({ selectedYop: [], report: { ...this.state.report, yop: [] } })
            return;
        }
        const value = event.target.value;
        this.setState({ selectedYop: value, report: { ...this.state.report, yop: value } })
    }


    getCollege = () => {
        axios.get(` ${url.COLLEGE_API}/college/list?status=${'ACTIVE'}`, { headers: authHeader() })
            .then((res) => {
                this.setState({ colleges: res.data.response });
                if (isRoleValidation() !== 'SUPER_ADMIN') {
                    let data = _.filter(res.data.response, r => r.id === this.props.collegeId)
                    _.map(data, c => {
                        this.setState({ collegeName: c.collegeName, report: { ...this.state.report, collegeId: c.id } })
                        this.getReport()
                    })
                }
            })
            .catch(error => {
                errorHandler(error);
            })
    }

    toggleHandle = () => this.setState({ toggleClick: !this.state.toggleClick });

    xlsxDownloadApi = () => {
        !this.state.report.skillsortScore ? this.getReportXlsx() : this.getScoreReportXlsx()
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
            report.fromDate = moment(report.fromDate).format('DD/MM/YYYY')
            report.toDate = moment(toDate).format('DD/MM/YYYY')
        }
        else if (_.isEmpty(report.fromDate) && report.toDate) {
            // let fromDate = new Date()
            // report.fromDate = moment(fromDate).format('DD/MM/YYYY')
            report.toDate = moment(report.toDate).format('DD/MM/YYYY')
        }
        if (this.state.showCompanyOfferReleased === 'YES' && !this.state.report.skillsortScore) {
            report.skillsortScore = 0;
        }
        axios.post(` ${url.ADMIN_API}/adv-search/studentReport?page=${1}&size=${this.state.totalElements}`, report, { headers: authHeader() })
            .then((res) => {
                this.setState({
                    studentXlsx: res.data.response.content,
                    skillSortscoreXlsx: res.data.response.score,
                    isSkillSortScorePresent: false,

                }, () => this.downloadCsv())

            })
            .catch((error) => {
                this.setState({ loader: false, disabled: false });
                errorHandler(error);
            });
    }


    getReportXlsx = () => {
        this.setState({ disabled: true })
        const report = _.cloneDeep(this.state.report)
        if (moment(report.fromDate).isValid() && moment(report.toDate).isValid()) {
            report.fromDate = moment(report.fromDate).format('DD/MM/YYYY')
            report.toDate = moment(report.toDate).format('DD/MM/YYYY')
        }
        if (_.isEmpty(report.toDate) && report.fromDate) {
            let toDate = new Date()
            report.fromDate = moment(report.fromDate).format('DD/MM/YYYY')
            report.toDate = moment(toDate).format('DD/MM/YYYY')
        }
        else if (_.isEmpty(report.fromDate) && report.toDate) {
            // let fromDate = new Date()
            // report.fromDate = moment(fromDate).format('DD/MM/YYYY')
            report.toDate = moment(report.toDate).format('DD/MM/YYYY')
        }
        axios.post(` ${url.COLLEGE_API}/student/getReport?page=${1}&size=${this.state.totalElements}`, report, { headers: authHeader() })
            .then((res) => {
                this.setState({
                    studentXlsx: res.data.response.student.content,
                    skillSortscoreXlsx: res.data.response.score,
                    isSkillSortScorePresent: true
                }, () => this.downloadCsv())

            })
            .catch((error) => {
                this.setState({ loader: false });
                errorHandler(error);
            });

    }



    downloadCsv = async () => {
        if (isRoleValidation() === 'COLLEGE_ADMIN') {
            await this.getSectionMarks('csv')
        }
        const data = _.map(this.state.studentXlsx, stu => _.pick({ ...stu, collegeName: stu.college ? stu.college?.collegeName : stu.collegeName, score: this.state.isSkillSortScorePresent ? _.round(this.state.skillSortscoreXlsx[stu.email]) ? _.round(this.state.skillSortscoreXlsx[stu.email]) : '' : stu.skillSortScore ? stu.skillSortScore : '-' }, keys))
        ExportXlsx(data, "StudentReport", isRoleValidation() === 'SUPER_ADMIN' ? columnsForSuperAdmin : columnsForCollege)
        this.setState({ disabled: false })
    }

    getSectionMarks = async (key) => {
        const { student } = this.state
        const { studentXlsx } = this.state
        let ids = []
        _.map(key === 'csv' ? studentXlsx : student, s => {
            ids.push(s.id)
        })
        await axios.post(`${url.ADMIN_API}/adv-search/student-result`, ids, { headers: authHeader() })
            .then(res => {
                const results = res.data.response.data.response
                _.map(key === 'csv' ? studentXlsx : student, s => {
                    if (results[s.id]) {
                        if (results[s.id].level1Result) {
                            _.map(results[s.id].level1Result, r => {
                                s[r.section] = calculatePercentage(r.totalMarks, r.totalInSection)
                            })
                        }
                        if (results[s.id].level2Result) {
                            let tech = results[s.id].level2Result
                            s.tech = calculatePercentage(tech.totalMarks, tech.totalInSection)
                        }
                        if (results[s.id].programmingMarks) {
                            s.programming = results[s.id].programmingMarks
                        }
                    }
                })
                this.setState({ student: student, studentXlsx: studentXlsx }, () => console.log(student))
            }).catch((error) => {
                errorHandler(error);
            });
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
                name: "College",
                align: "left",
                key: "college",
                renderCell: (params) => params?.collegeName ? params?.collegeName : params.college ? params.college?.collegeName : '-'
            },
            {
                name: "DEPARTMENT",
                align: "left",
                key: "department",
                renderCell: (params) => params?.department ? params.department : "-"

            },
            {
                name: "SKILLSORTSCORE",
                align: "center",
                renderCell: (params) => {
                    let score = this.state.isSkillSortScorePresent
                        ? this.state.skillSortscore[params.email]
                        : null;
                    return this.state.isSkillSortScorePresent
                        ? score !== undefined && score !== null
                            ? Math.round(score)
                            : "-"
                        : params.skillSortScore
                            ? params.skillSortScore
                            : "-";
                },
            },
        ]
        this.setState({ superAdminHeader: header });
    }

    setHeader = () => {
        const headers = [
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
                name: "DEPARTMENT",
                align: "left",
                renderCell: (params) => {
                    return params.department ? params.department : "-";
                },
            },
            {
                name: "LOGICAL",
                align: "center",

                renderCell: (params) => {
                    return params["LOGICAL REASONING"] !== undefined
                        ? params["LOGICAL REASONING"]
                        : "-";
                },
            },
            {
                name: "VERBAL",
                align: "center",
                renderCell: (params) => {
                    return params["VERBAL ABILITY"] !== undefined ? params["VERBAL ABILITY"] : "-";
                },
            },
            {
                name: "NUMERICAL",
                align: "center",
                renderCell: (params) => {
                    return params["NUMERICAL ABILITY"] !== undefined
                        ? params["NUMERICAL ABILITY"]
                        : "-";
                },
            },
            {
                name: "TECHNICAL",
                align: "center",
                renderCell: (params) => {
                    return params["tech"] !== undefined ? params["tech"] : "-";
                },
            },
            {
                name: "SKILLSORTSCORE",
                align: "center",
                renderCell: (params) => {
                    let score = this.state.isSkillSortScorePresent
                        ? this.state.skillSortscore[params.email]
                        : null;
                    return this.state.isSkillSortScorePresent
                        ? score !== undefined && score !== null
                            ? Math.round(score)
                            : "-"
                        : params.skillSortScore
                            ? params.skillSortScore
                            : "-";
                },
            },
        ];
        this.setState({ headers });
    };

    changeCollege = (colleges) => {
        this.setState({ college: colleges })
        const { report } = this.state
        report['collegeId'] = colleges?.id
        this.setState({ report: report })
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
                            {this.state.toggleClick ? "" : <span>Options </span>}
                            <i
                                onClick={this.toggleHandle}
                                className="fa fa-filter"
                                aria-hidden="true"
                                style={{
                                    cursor: 'pointer',
                                    fontSize: "1.5rem",
                                    marginRight: this.state.toggleClick
                                        ? ""
                                        : _.size(this.state.student) > 0
                                            ? "46rem"
                                            : "56.5rem",
                                }}
                            />
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {_.size(this.state.student) > 0 ? (
                                    <button
                                        disabled={this.state.disabled}
                                        style={{ marginRight: "1rem" }}
                                        onClick={this.xlsxDownloadApi}
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
                            onChange={this.onChange}
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
                            college={this.state.college}
                            headers={this.state.headers}
                            superAdminHeader={this.state.superAdminHeader}
                            data={this.state.student}
                            selectedYop={this.state.selectedYop}
                            yops={this.state.yops}
                            handleYopChange={this.handleYopChange}
                            pageChange={this.pageChange}
                            handleReset={this.handleReset}
                            department={this.state.department}
                            toggleClick={this.state.toggleClick}
                            changeCollege={this.changeCollege}
                        />
                    </div>
                </div>
            </div>
        );
    }
}


