import _ from "lodash";
import React, { Component } from 'react';
import AceEditor from "react-ace";
import '../SuperAdmin/SuperAdmin.css';
import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/ext-beautify";
import "ace-builds/src-noconflict/ext-prompt";
import 'ace-builds/src-noconflict/mode-csharp';
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import AnalyticsModel from './AnalyticsModel';
import Divider from "@mui/material/Divider"
import Grid from "@mui/material/Grid"
import Link from "@mui/material/Link"
import List from "@mui/material/List"
import CustomizedMenu from "../../utils/CustomizedMenu";
import HintModal from "../Candidate/HintModal";


export default  class ProgramResult extends Component {

    constructor(props) {
        super(props);
        let result = {};
        if (localStorage.getItem(window.location.pathname.replace('/admin/result/candidate/programResult/', ''))) {
            sessionStorage.setItem(window.location.pathname.replace('/admin/result/candidate/programResult/', ''), localStorage.getItem(window.location.pathname.replace('/admin/result/candidate/programResult/', '')));
            localStorage.removeItem(window.location.pathname.replace('/admin/result/candidate/programResult/', ''));
            result = JSON.parse(sessionStorage.getItem(window.location.pathname.replace('/admin/result/candidate/programResult/', '')));
        }

        result = JSON.parse(sessionStorage.getItem(window.location.pathname.replace('/admin/result/candidate/programResult/', '')));

        let data = result
        let submittedExam = [];

        if (data.sqlRound && !data.programmingRound) {
            submittedExam = _.filter(data.submittedExam, 'question.actualQuery')
        } else if (!data.sqlRound && data.programmingRound) {
            submittedExam = _.filter(data.submittedExam, 'question.input')
        } else {
            submittedExam = _.filter(data.submittedExam, q => q.question?.input || q.question?.actualQuery)
        }

        this.state = {
            questions: _.map(submittedExam, 'question'),
            instructions: '',
            questionIndex: 0,
            submittedExam: submittedExam,
            screenShot: data.screenShot,
            code: '',
            openModal: false,
            openFBModal: false,
            examMonitor: JSON.parse(localStorage.getItem("examMonitor")),
            disabledPrev: 'true',
            disabledNext: 'false',
            language_id: submittedExam[0]?.language === 'java' ? 'java' : (submittedExam[0]?.language === 'python' ? 'python' : 'csharp'),
            currentTestCase: [],
            queryResult: '',
            copiedTextContents: '',
            tabSwitchCounts: [],
            isProgrammingCamera: data.isProgrammingCamera,
            showHelpTaken: false,
            hintDisable: false,
            pseudoDisable: false,
            isSqlResult: data.sqlRound,
            isProgrammingResult: data.programmingRound

        }
    }

    componentWillMount() {
        let instructions = this.state.questions[0]?.question;
        this.setState({ instructions: instructions, currentTestCase: this.state.submittedExam[this.state.questionIndex]?.testCases,queryResult: this.state.submittedExam[this.state.questionIndex]?.queryResult })
        this.setInput()
        this.getCopiedContent();
        this.setState({ tabSwitchCounts: this.state.examMonitor?.tabSwitchCounts })

    }

    tabCount = () => {
        let counts = _.filter(this.state.tabSwitchCounts, tab => tab?.questionId === this.state.submittedExam[this.state.questionIndex]?.question.id)
        return counts[0]?.count
    }

    next = () => {
        let questionIndex = this.state?.questionIndex + 1;
        let instructions = this.state.questions[questionIndex]?.question;
        this.setState({ questionIndex: questionIndex, instructions: instructions }, () => { this.setInput(); this.checkHintsTaken() });
    }

    setInput = () => {
        this.setState({ code: this.state.submittedExam[this.state.questionIndex]?.code ? this.state.submittedExam[this.state.questionIndex]?.code :'' , currentTestCase: this.state.submittedExam[this.state.questionIndex]?.testCases,queryResult: this.state.submittedExam[this.state.questionIndex]?.queryResult  }, () => this.getCopiedContent())
    }
    getCopiedContent = () => {
        return _.filter(this.state.examMonitor?.copyPasteContent, cpy => cpy.questionId === this.state.submittedExam[this.state.questionIndex]?.question.id)

    }

    previous = (e) => {
        let questionIndex = this.state.questionIndex - 1;
        let instructions = this.state.questions[questionIndex]?.question;
        this.setState({ questionIndex: questionIndex, instructions: instructions }, () => { this.setInput(); this.checkHintsTaken() });

    }

    onClickOpenModel = (e) => {
        if (!this.state.openModal) {
            document.addEventListener("click", this.handleOutSideClick, false);
        } else {
            document.removeEventListener("click", this.handleOutSideClick, false)
        }
        this.setState({ openModal: !this.state.openModal })
    }

    handleOutSideClick = (e) => {
        if (e.target.className === "modal fade show") {
            this.setState({ openModal: !this.state.openModal })
        }
    }

    onCloseModal = () => {
        this.setState({ openModal: false });
    }

    getSwitchCounts = () => {
        let currentTabSwitchCount = _.filter(this.state.tabSwitchCounts, (t) => t.questionId === this.state.questions[this.state.questionIndex]?.id)
        return _.size(currentTabSwitchCount) > 0 ? _.map(currentTabSwitchCount, (c) =>
            c.count
        ) : 0
    }

    getSWitchCountForQuestion = () => {
        return _.filter(this.state.tabSwitchCounts, (t) => t.questionId === this.state.questions[this.state.questionIndex]?.id)
    }

    getBase64Count = () => {
        return _.filter(this.state.screenShot?.base64String || [], (t) => t.questionId === this.state.questions[this.state.questionIndex]?.id)
    }

    getCopiedContentCount = () => {
        return _.filter(this.state.examMonitor?.copyPasteContent || [], (t) => t.questionId === this.state.questions[this.state.questionIndex]?.id)
    }

    getAnalytics = () => {
        if (_.size(this.getCopiedContentCount()) > 0 || _.size(this.getBase64Count()) > 0) {
            return <div className='col-md-8' style={{ paddingBottom: '.5rem' }}>
                <Link style={{ cursor: 'pointer', color: '#1976d2' }} component="button" onClick={this.onClickOpenModel}>View camera Images & Copied contents</Link>
            </div>
        }
        else if (_.size(this.getSWitchCountForQuestion()) > 0) {
            return <div className='col-md-8' style={{ paddingBottom: '.5rem', color: 'white' }}>
                <span>Tab Switch Count : {this.getSwitchCounts()}</span>
            </div>
        }
        else {
            return <div className='col-md-8' style={{ paddingBottom: '.5rem' }}>
                <span disabled={true} style={{ cursor: 'not-allowed', textDecoration: 'none' }}>No camera Images & Copied contents</span>
            </div>
        }
    }

    onHintCloseModal = (e) => {
        if (e.target.className === "modal fade show" || e.target.className === 'btn btn-sm btn-nxt' || e.target.className === 'close') {
            if (this.state.openHintModal === true) this.setState({ openHintModal: !this.state.openHintModal })
        }
    }

    handleHintModal = (type) => {
        let currentHint = type === 'hint' ? this.state.questions[this.state.questionIndex].programmingHint : this.state.questions[this.state.questionIndex].pseudoCode
        this.setState({ openHintModal: true, helpType: type, currentHint: currentHint })
    }

    componentDidMount = () => {
        this.checkHintsTaken()
    }


    checkHintsTaken = (type) => {
        if (!this.state.examMonitor)
            return
        let helpTaken = this.state.examMonitor.helpTaken
        let currentQt = _.filter(helpTaken, (h) => h.questionId === this.state.questions[this.state.questionIndex].id)
        if (currentQt.length > 0 && (currentQt[0].hintTaken || currentQt[0].pseudoCodeTaken)) {
            this.setState({ hintDisable: !currentQt[0].hintTaken })
            this.setState({ pseudoDisable: !currentQt[0].pseudoCodeTaken })
            this.setState({ showHelpTaken: true })
        } else this.setState({ showHelpTaken: false })
    }

    render() {
        return (

            <>
                <Grid container spacing={0} style={{ overflowY: 'auto', height: '100vh' }}>
                    <Grid item xs={5} xl={5} sm={12} lg={5} md={5} style={{ overflowY: 'auto', height: '100vh' }}>
                        <List style={{ marginLeft: '2rem' }}>
                            <h5 style={{ padding: '10px' }}>Question {this.state.questionIndex + 1}</h5>
                            <Divider />
                            <div className="instructions" dangerouslySetInnerHTML={{ __html: this.state.instructions }} style={{ overflowY: 'auto' }} />
                        </List>
                    </Grid>
                    <Grid item xs={7} xl={7} sm={12} lg={7} md={7} style={{ backgroundColor: '#000', height: '100vh', overflowY: 'auto' }}>
                        <div className="row" style={{ marginTop: '1rem', marginLeft: '0.5rem' }}>
                            <div className="col-md-6" style={{ padding: '10px' }}>
                                <div style={{ marginTop: "10px", marginLeft: "1rem" }}>
                                    <span style={{ color: "white" }}>Question {this.state.questionIndex + 1} of {this.state.submittedExam?.length}</span>
                                </div>
                            </div>
                            <div className="col-md-6" style={{ padding: '10px' }}>
                                <div className="row">
                                    <div className="col-md-6">
                                        < div
                                            onClick={(e) => this.previous(e)}
                                            className=" cursor-pointer"
                                            disabled={this.state.disabledPrev}
                                            title="Previous"
                                            style={{ fontSize: "30px", color: "#5B6263", width: '90px', marginTop: '10px', float: 'right' }}
                                        >
                                            {this.state.questionIndex === 0 ? (""
                                            ) : (
                                                <div className="p-1" style={{ marginTop: '-15px' }}><button type='button' className='btn-sm btn-prev '>&laquo; Previous</button></div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-6" >
                                        <div className="cursor-pointer" onClick={(e) => { this.next(e); }} disable={this.state.disabledNext} title="Next" style={{ fontSize: "30px", color: "#5B6263", width: '90px', marginTop: '10px' }} >
                                            {this.state.questionIndex === this.state.questions.length - 1 ? (
                                                "") : (
                                                <button type='button' className='btn btn-primary' style={{backgroundColor:"coral !important"}}>Next &raquo;</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <AceEditor style={{ height: '70%', width: '95%', marginLeft: '1.5rem', fontFamily: 'monospace' }}
                            mode={this.state.language_id}
                            theme="monokai"
                            value={this.state.code}
                            fontSize={14}
                            showPrintMargin={false}
                            showGutter={true}
                            highlightActiveLine={true}
                            readOnly={true}
                        />
                        <br />
                        {this.state.questions[this.state.questionIndex].questionType !== 'SQL'  ?
                            <div className='row' style={{ marginLeft: '0.5rem' }}>
                                <div className='col-lg-8 col-md-8'>
                                    <CustomizedMenu disableHint={this.state.hintDisable}
                                        disablePseudo={this.state.pseudoDisable} disable={this.state.showHelpTaken} name={'Took Help'}
                                        handleHelp={(type) => this.handleHintModal(type)}
                                        hintColor={this.state.hintDisable ? 'inherit' : 'red'} pseudoColor={this.state.pseudoDisable ? 'inherit' : 'red'} />

                                </div>
                                <div className='col-md-4'>
                                    <span style={{ color: "white", marginLeft: "10px" }}>Total Testcases : {this.state.currentTestCase ? this.state.currentTestCase?.length : this.state.questions[this.state.questionIndex]?.input?.length}</span>
                                </div>
                            </div> : null}
                        <div className='row' style={{ marginLeft: '0.5rem', marginTop: '0.5rem' }}>
                            {this.getAnalytics()}
                            <div className='col-lg-4 col-md-4'>
                            {this.state.questions[this.state.questionIndex].questionType !== 'SQL' ? <span style={{ color: "chartreuse", marginLeft: "10px" }}>Testcases Passed : {_.filter(this.state.currentTestCase, f => f !== 'Failed').length}</span> : <span style={{ color: "chartreuse", marginLeft: "10px" }}><span style={{color:'white'}}>Result :</span><span style={{ color: this.state.queryResult === 'Success' ? 'chartreuse' : 'red', marginLeft: "10px" }}>{this.state.queryResult}</span> </span>}
                            </div>
                        </div>
                    </Grid>
                </Grid>
                {this.state.openHintModal ? <HintModal onCloseModal={(e) => this.onHintCloseModal(e)} type={this.state.helpType} currentHint={this.state.currentHint} /> : null}
                {this.state.openModal ? (
                    <AnalyticsModel screenShot={_.filter(this.state.screenShot?.base64String, (s) => s.questionId === this.state.questions[this.state.questionIndex].id)}
                        questionId={this.state.questions[this.state.questionIndex]?.id} onCloseModal={this.onCloseModal} switchCount={this.tabCount()} questionIndex={this.state.questionIndex + 1} />
                ) : ("")}
            </>
        );
    }
}

