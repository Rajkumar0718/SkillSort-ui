import axios from "axios";
import _ from "lodash";
import React, { Component } from "react";
import AceEditor from "react-ace";
import AutoResize from "react-textarea-autosize";
import enlarge from '../../assests/images/Frameenlarge.png';
import minimize from '../../assests/images/Minimize.png';

import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/ext-beautify";
import "ace-builds/src-noconflict/ext-keybinding_menu";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-prompt";
import "ace-builds/src-noconflict/keybinding-vscode";
import "ace-builds/src-noconflict/mode-c_cpp";
import 'ace-builds/src-noconflict/mode-csharp';
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/snippets/c_cpp";
import "ace-builds/src-noconflict/snippets/csharp";
import "ace-builds/src-noconflict/snippets/java";
import "ace-builds/src-noconflict/snippets/python";
import "ace-builds/src-noconflict/theme-monokai";
import 'ace-builds/src-noconflict/theme-one_dark';
import 'ace-builds/src-noconflict/theme-tomorrow_night';
import 'ace-builds/src-noconflict/theme-tomorrow_night_blue';
import 'ace-builds/src-noconflict/theme-tomorrow_night_bright';

import { Box, Card, CardContent, Divider, Fade, Snackbar, Tab, Typography } from "@mui/material";
import { Alert, TabContext, TabList, TabPanel } from "@mui/lab";
import { browserName, browserVersion, isDesktop, osName, osVersion } from "react-device-detect";
import Webcam from "react-webcam";
import { authHeader } from "../../api/Api";
import LOGO from '../../assests/images/LOGO.svg';
import { logEvent } from '../../utils/Analytics';
import { toastMessage } from "../../utils/CommonUtils";
import CustomizedMenus from "../../utils/CustomizedMenu";
import TimeCounter from "../../utils/TimeCounter";
import { url } from "../../utils/UrlConstant";
import { isRoleValidation } from "../../utils/Validation";
import "./Compiler.css";
import HintModal from "./HintModal";
import InstructionForCamera from "./InstructionForCamera";
import "./Programming.css";
import SubmitPopup from "./SubmitPopup";
import UnplugedModal from "./UnplugedModal";

export default class ProgramUi extends Component {


    constructor(props) {
        super(props);
        this.editorRef = React.createRef();
        this.state = {
            start: false,
            code: '',
            lineChecking: true,
            prevCode: '',
            output: '',
            language_id: localStorage.getItem("languageId") || "",
            exam: false,
            user_input: '',
            programmingDuration: '',
            languageName: localStorage.getItem("languageName") || "",
            disabledPrev: true,
            disabledNext: false,
            disabledOnRun: false,
            questions: [],
            questionIndex: 0,
            totalQuestions: 0,
            screenBlockCount: 0,
            examQuestions: {},
            isOngoingExamPresent: false,
            examLinkResponse: "",
            instructions: "",
            loading: false,
            testCase: [],
            isExpand: false,
            copiedText: '',
            screenShortTime: 0,
            screenShot: {},
            base64Image: '',
            cameraPermission: true,
            hasWebcam: true,
            programmingHasCamera: false,
            tabName: 'testcase',
            openHintModal: false,
            hintViewed: false,
            isCopyPasteAllowed: false,
            questionHints: [],
            open: false,
            openFailureSnackBar: false,
            examMonitor: {
                examId: localStorage.getItem("examId"),
                browserName: browserName,
                browserVersion: browserVersion,
                osName: osName,
                osVersion: osVersion,
                isDesktop: isDesktop,
                programmingStartTime: "",
                programmingEndTime: "",
                copyPasteContent: [],
                tabSwitchCounts: [],
            },
        };
    }

    handleEventTrackForAbondedExam = () => {
        localStorage.setItem('status', 'closed')
        window.dataLayer.push({
            event: 'AbandonedExam'
        });
    }

    componentDidMount() {
        window.addEventListener("unload", this.handleEventTrackForAbondedExam);
        window.addEventListener("blur", this.getTabSwitchCount);
        window.addEventListener("keydown", this.handleKeyDown);
        window.onbeforeunload = function () {
            return "";
        };
        let sessionQuestions = localStorage.getItem("AnsweredState");
        if (sessionQuestions === null || sessionQuestions === undefined || sessionQuestions === "null") {
            let techType = localStorage.getItem('technology')
            axios.get(`${url.CANDIDATE_API}/candidate/` + localStorage.getItem("examId") + `/questionList?questionRoles=CANDIDATE&techType=${techType ? techType : ''}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                },
            }).then((res) => {
                let questionsFlatten = _.flatten(_.map(res.data.response.categories, 'questions'));
                localStorage.setItem("examDuration", res.data.response.programmingDuration)
                this.setState({ questions: questionsFlatten, examQuestions: res.data.response, instructions: questionsFlatten[this.state.questionIndex].question }, () => { this.setInput() });
                this.saveCode(false);
            })
        } else {
            this.sessionStart();
        }
        this.getExam();
    }

    handleKeyDown = (event) => {
        if (
            (event.ctrlKey && event.shiftKey && event.keyCode === 73) || // Ctrl+Shift+I
            event.keyCode === 123 // F12
        ) {
            event.preventDefault();
        }
    };


    setCommandsForAceEditor = () => {
        let keyBindings = [
            {
                name: 'onSave',
                bindKey: { win: 'Ctrl-S', mac: 'Command-S' },
                exec: this.saveCode,
            }, {
                name: 'onRun',
                bindKey: { win: 'Ctrl-R', mac: 'Command-R' },
                exec: this.submit,
            }
        ];
        if (!this.state.isCopyPasteAllowed) {
            keyBindings.push({ name: 'onPaste', bindKey: { win: 'Ctrl-V', mac: 'Command-V' }, exec: (e) => { console.log(e) } })
        }
        if (this.editorRef.current) {
            // Get the Ace Editor instance
            const editor = this.editorRef.current.editor;

            // Get the editor's session
            console.log(editor)
            const commands = editor.commands

            _.map(keyBindings, (binding) => {
                commands.bindKey(binding.bindKey, binding.exec);
                commands.addCommand({
                    name: binding.name,
                    bindKey: binding.bindKey,
                    exec: binding.exec,
                });
            })
            editor.renderer.updateFull();
        }
    }
    getExam = () => {
        axios
            .get(
                `${url.CANDIDATE_API}/candidate/exam/instruction?examId=${localStorage.getItem("examId")}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                    },
                }
            ).then(res => this.setState({ programmingHasCamera: res.data.response.isProgrammingCamera, isCopyPasteAllowed: res.data.response.isCopyPaste }, () => this.checkCameraAndGetScreenShotTime()))
            .catch(error => toastMessage('error', 'Error while fetching exam'))

    }

    checkCameraAndGetScreenShotTime = () => {
        if (this.state.programmingHasCamera) {
            this.cameraState = setInterval(() => {
                this.getCameraState();
                this.detectWebcam();
            }, 1000);
            this.getScreenShortTime();
        }
        this.setCommandsForAceEditor();
    }

    getScreenShortTime = () => {
        axios.get(`${url.ADMIN_API}/onlineTest/getScreenShortTimer?status=${'ACTIVE'}`, { headers: authHeader() })
            .then(res => {
                this.setState({ screenShortTime: res.data.response.screenShortTimer * 1000 }, () => this.takeScreenshot())
            })
    }

    detectWebcam = () => {
        navigator.mediaDevices.getUserMedia({ video: true }).then().catch(err => console.log(err))
        let md = navigator.mediaDevices;
        if (!md?.enumerateDevices) { this.setState({ hasWebcam: false }) }
        else {
            md.enumerateDevices().then(devices => {
                this.setState({ hasWebcam: devices.some(device => 'videoinput' === device.kind) });
            })
        }
    }

    takeScreenshot = () => {
        const camera = document.getElementById("camera");
        this.screenshot = setInterval(() => {
            camera.click()
        }, this.state.screenShortTime)
    }

    sendScreenShot = async () => {
        const { screenShot } = this.state
        let user = JSON.parse(localStorage.getItem("user"))
        screenShot.id = {}
        screenShot.id.examId = localStorage.getItem("examId")
        screenShot.id.candidateId = user.id
        screenShot.screenShotImageBase64 = this.state.base64Image
        screenShot.time = new Date()
        screenShot.questionId = localStorage.getItem('questionId')
        axios.post(this.getAPi() + 'save-screenshot', screenShot, { headers: authHeader() })
            .then()
            .catch()

    }

    getCameraState = () => {
        navigator.permissions.query({ name: 'camera' }).then(res => {
            this.setState({ stateOfCamera: res.state })
            res.state === 'granted' ? this.setState({ cameraPermission: true }) : this.setState({ cameraPermission: false }, () => this.setCameraBlockCount())
            return res.state
        })
    }

    setCameraBlockCount = () => {
        this.setState(prev => ({ screenBlockCount: prev.screenBlockCount + 1 }))
    }

    getTabSwitchCount = () => {
        const { examMonitor } = this.state;
        let Qid = this.state.questions[this.state.questionIndex]?.id;
        let switchCount = {};
        switchCount.questionId = Qid;
        switchCount.count = 1;
        examMonitor.tabSwitchCounts.push(switchCount);
        this.saveCode(false);
        _.remove(examMonitor.tabSwitchCounts, tb => tb.questionId === Qid)
    }

    componentWillUnmount = () => {
        window.removeEventListener("blur", this.getTabSwitchCount)
        clearInterval(this.screenshot);
        clearInterval(this.cameraState);
        window.removeEventListener('unload', this.handleEventTrackForAbondedExam);
    }


    async sessionStart() {
        let sessionQuestions = JSON.parse(localStorage.getItem('AnsweredState'));
        if (localStorage.getItem('onGoingExamId') && !localStorage.getItem('startDate')) {
            await this.saveCode(false);
        } else {
            this.setInitStateForSession(sessionQuestions)
        }
    }

    setInitStateForSession = (sessionQuestions) => {
        localStorage.setItem("examDuration", sessionQuestions?.programmingDuration)
        let programQuestions = _.filter(sessionQuestions.categories, (c) => c.sectionName === 'PROGRAMMING' || c.groupQuestionType === 'programming');
        let questions = _.map(programQuestions, 'questions')
        let questionsFlatten = _.flatten(questions);
        this.setState({ questions: questionsFlatten, examQuestions: sessionQuestions, instructions: questionsFlatten[this.state.questionIndex].question }, () => { this.setInput() });
        if (localStorage.getItem("startDate"))
            this.setState({ start: true })
    }

    input = (event) => {
        let lines = event.split(/\r|\r\n|\n/);
        let count = lines.length;
        let lineChecking = true
        for (let i = 0; i <= count; i++) {
            let lengthcount = lines[i]?.length;
            if (lengthcount >= 130) {
                lineChecking = false
            }
        }
        if (count <= 200 && lineChecking) {
            this.setState({ code: event });
            let examQuestions = this.state.examQuestions;
            let idx = this.getIndexOfProgrammingQuestions();
            examQuestions.categories[idx].questions[this.state.questionIndex].selectedAnswer = event;
            this.setState({ examQuestions: examQuestions });
            localStorage.setItem("AnsweredState", JSON.stringify(examQuestions));
        }
    };

    submit = () => {
        logEvent('Button', 'Click');
        if (this.state.prevCode !== this.state.code) {
            this.setState({ disabledOnRun: true, loading: true, compileOutput: null });
            let data = {
                code: this.state.code,
                language: this.state.languageName,
                questionId: this.state.questions[this.state.questionIndex].id
            };
            axios.post(`${url.ADMIN_API}/compile`, data, {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                }
            }).then(response => {
                this.saveCode(false);
                const jsonResponse = response.data.response;
                let compileOutput = {}
                compileOutput.output = typeof jsonResponse.output === 'object' ? _.map(jsonResponse.output).join(',') : jsonResponse.output;
                compileOutput.input = typeof jsonResponse.input === 'object' ? _.join(_.map(jsonResponse.input, (value, key) => `${key}: ${value}`), ', ') : jsonResponse.input;
                compileOutput.testCasePass = jsonResponse.testCasePass;
                compileOutput.questionId = this.state.questions[this.state.questionIndex].id;
                console.log(this.state.testCase, "this.state.testCase")
                let output = this.state.testCase;
                let questionIndex = _.findIndex(output, { questionId: this.state.questions[this.state.questionIndex].id });
                if (questionIndex > -1) {
                    output[questionIndex] = compileOutput;
                } else {
                    output.push(compileOutput);
                }
                this.setState({ compileOutput: compileOutput, prevCode: data.code, loading: false, testCase: output, disabledOnRun: false });
            }).catch(() => {
                this.setState({ loading: false, disabledOnRun: false })
            })
        }
    };

    next = () => {
        logEvent('Button', 'Click');
        let questionIndex = this.state.questionIndex + 1;
        this.setCompileOutPut(questionIndex);
        let instructions = this.state.questions[questionIndex].question;
        this.setState({ questionIndex: questionIndex, instructions: instructions, loading: false }, () => { this.setInput() });
    }

    previous = () => {
        logEvent('Button', 'Click');
        let questionIndex = this.state.questionIndex - 1;
        this.setCompileOutPut(questionIndex);
        let instructions = this.state.questions[questionIndex].question;
        this.setState({ questionIndex: questionIndex, instructions: instructions, loading: false }, () => { this.setInput() });
    }


    setCompileOutPut = (questionIndex) => {
        let idx = _.findIndex(this.state.testCase, { questionId: this.state.questions[questionIndex].id });
        if (idx > -1)
            this.setState({ compileOutput: this.state.testCase[idx] })
        else
            this.setState({ compileOutput: null })
    }

    renderTestCases = () => {
        if (this.state.loading) {
            return <>
                <h6 style={{ textAlign: 'center', fontSize: "26px" }}>Processing...</h6>
            </>
        }
    }

    setInput = () => {
        let languageCode = localStorage.getItem("AnsweredState");
        localStorage.setItem('questionId', this.state.questions[this.state.questionIndex].id)
        if (languageCode && languageCode !== "null") {
            languageCode = JSON.parse(languageCode);
            let programCategory = _.filter(languageCode.categories, (c) => c.sectionName === 'PROGRAMMING' || c.groupQuestionType === 'programming')
            let questions = _.map(programCategory, 'questions')
            let questionsFlatten = _.flatten(questions);
            let questionIndex = _.findIndex(questionsFlatten, { question: this.state.questions[this.state.questionIndex]?.question })
            let input = questionsFlatten[questionIndex].selectedAnswer
            if (input) {
                this.setState({ code: input })
            } else {
                this.setAnsweredState();
            }
        }
        else if (this.state.languageName === 'java' || this.state.languageName === 'csharp') {
            this.setAnsweredState();
        } else {
            let examQuestions = this.state.examQuestions;
            let idx = this.getIndexOfProgrammingQuestions();
            examQuestions.categories[idx].questions[this.state.questionIndex].selectedAnswer = "";
            localStorage.setItem("AnsweredState", JSON.stringify(examQuestions));
            this.setState({ code: "", examQuestions: examQuestions })
        }
    }

    getIndexOfProgrammingQuestions = () => {
        return _.findIndex(this.state.examQuestions.categories, (c) => c.sectionName === 'PROGRAMMING' || c.groupQuestionType === 'programming')
    }

    setAnsweredState = () => {
        let currentQuestion = this.state.questions[this.state.questionIndex];
        if (this.state.languageName === 'java') {
            this.setCode(currentQuestion.userFunctionJava);
        } else if (this.state.languageName === 'csharp') {
            this.setCode(currentQuestion.userFunctionCsharp);
        } else {
            this.setCode(currentQuestion.userFunctionPython)
        }
    }

    setCode = (input) => {
        let examQuestions = this.state.examQuestions;
        let idx = this.getIndexOfProgrammingQuestions();
        examQuestions.categories[idx].questions[this.state.questionIndex].selectedAnswer = input;
        localStorage.setItem("AnsweredState", JSON.stringify(examQuestions));
        this.setState({ code: input, examQuestions: examQuestions })
    }

    saveCode = (openSnackBar = false) => {
        logEvent('Button', 'Click');
        let answeredState = JSON.parse(localStorage.getItem('AnsweredState'));
        let category = answeredState?.categories
        let sessionUser = JSON.parse(localStorage.getItem('user'));
        if (_.size(_.map(category, "sectionName")) > 0 && !localStorage.getItem('startTime')) {
            let startTime = new Date()
            localStorage.setItem("startTime", startTime);
            if (!localStorage.getItem('examStartTime')) {
                localStorage.setItem('examStartTime', startTime)
            }
        }
        this.setDataInExamMonitor(new Date(localStorage.getItem('startTime')), sessionUser);
        const submittedExam = {
            id: localStorage.getItem("onGoingExamId"),
            candidateId: sessionUser?.id,
            examId: localStorage.getItem("examId"),
            categories: category,
            preferredLanguage: this.state.languageName,
            isAppsCompleted: true,
            isSqlCompleted: true,
            copyPasteContent: this.state.examMonitor.copyPasteContent,
            examMonitor: this.state.examMonitor,
        };
        submittedExam["startDate"] = new Date(localStorage.getItem("startTime"));
        if (localStorage.getItem('level')) {
            const level = JSON.parse(localStorage.getItem('level'))
            submittedExam.level = level?.level
        }
        axios.post(this.getAPi() + "onGoingExam", submittedExam, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
        }).then((res) => {
            localStorage.setItem("onGoingExamId", res.data.response.id);
            localStorage.setItem("startDate", res.data.response.startDate);
            this.setState({ open: openSnackBar })
            if (!localStorage.getItem('seconds')) {
                this.setInitStateForSession(answeredState)
            }
        }).catch(() => {
            toastMessage('error', "Oops something went wrong!");
        });
    }

    saveCodeByButtonClick = () => {
        this.saveCode(true)
    }

    setDataInExamMonitor = (time, value) => {
        let monitor = this.state.examMonitor;
        if (time === null) {
            monitor.programmingEndTime = new Date();
            this.setState({ examMonitor: monitor });
        } else {
            monitor.email = value.email;
            monitor.programmingStartTime = time;
            this.setState({ examMonitor: monitor });
        }
    }

    handleResponseTime = (responseTime) => {
        const responseTimeInSeconds = responseTime / 1000
        window.dataLayer.push({
            event: 'SubmitExamApi',
            responseTime: responseTimeInSeconds
        });
    }

    getAPi = () => isRoleValidation().includes("COLLEGE_STUDENT") ?
        `${url.COLLEGE_API}/onlineTest/` : isRoleValidation().includes("COMPETITOR") || isRoleValidation().includes("DEMO_ROLE") ? `${url.COMPETITOR_API}/onGoingTest/` : `${url.CANDIDATE_API}/candidate/`

    submittedConfirm = () => {
        if (localStorage.getItem("user")) {
            let user = JSON.parse(localStorage.getItem("user"));
            let email = user?.email;
            let examId = localStorage.getItem("examId");
            let token = localStorage.getItem("jwtToken");
            axios.get(`${url.CANDIDATE_API}/candidate/check/` + email + `/` + examId,
                { headers: { Authorization: "Bearer " + token } }
            ).then(() => {
                toastMessage('error', "Test Already Submitted..!")
                this.props.navigate("/thankYou");
            })
                .catch(() => {
                    this.submitExam();
                });
        }
    };

    submitExam = () => {
        clearInterval(this.interval);
        let submitExam = [];
        let sessionUser = JSON.parse(localStorage.getItem('user'));

        this.setDataInExamMonitor(null, sessionUser);
        const submittedExam = {
            submittedExam: submitExam,
            candidateId: sessionUser?.id,
            candidateCreatedBy: sessionUser?.createdBy,
            examId: localStorage.getItem("examId"),
            programmingRound: true,
            sqlRound: _.size(_.filter(this.state.examQuestions.categories, c => c.sectionName === 'SQL')) > 0,
            examMonitor: this.state.examMonitor,
        };

        if (localStorage.getItem("collegeId")) {
            submittedExam["collegeId"] = localStorage.getItem("collegeId");
        }

        let examQuestions = JSON.parse(localStorage.getItem('AnsweredState'));
        let sectionNames = _.map(examQuestions.categories, (c) => c.sectionName || c.groupType);
        let sections = _.flatMap(sectionNames);
        let idx = this.getIndexOfProgrammingQuestions();

        _.map(examQuestions.categories[idx].questions, (question) => {
            let code = question?.selectedAnswer;
            let language = this.state.languageName
            submitExam.push({ question, code, language });
        })

        if (sections.length > 1) {
            examQuestions.categories.forEach((category) => {
                category.questions.forEach((question) => {
                    if (question.questionType !== 'programming' && question.questionType !== 'SQL') {
                        let selectOption = question.selectedAnswer;
                        submitExam.push({ question, selectOption });
                    }
                    else if (question.questionType === 'SQL') {
                        let code = question?.selectedAnswer;
                        submitExam.push({ question, code });
                    }
                });
            });
        }


        const startTime = performance.now();
        axios.post(this.getAPi() + "submitExam", submittedExam, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
        }).then(() => {
            const endTime = performance.now();
            const responseTime = endTime - startTime;
            this.handleEventTrackForExamSubmit()
            this.handleResponseTime(responseTime)
            localStorage.removeItem('examStartTime')
            this.props.navigate("/thankYou");
        })
            .catch((err) => {
                toastMessage('error', "Oops something went wrong!");
            });
    }

    handleEventTrackForExamSubmit = () => {
        const exam = JSON.parse(localStorage.getItem('exam'))
        const examDuration = exam.duration ? exam.duration : 0 + exam.programmingDuration
        let endTime = new Date();
        let examStartTime = new Date(localStorage.getItem('examStartTime'));
        const timeDifference = Math.abs(examStartTime - endTime);
        const timeTaken = Math.round(timeDifference / (1000 * 60));
        window.dataLayer.push({
            event: 'ExamSubmit',
            duration: `${examDuration} mins`,
            timeTaken: `${timeTaken} mins`,
        });
    }

    onClickOpenModel = () => {
        logEvent('Button', 'Click');
        if (!this.state.openModal) {
            document.addEventListener("click", this.handleOutsideClick, false);
        } else {
            document.removeEventListener("click", this.handleOutsideClick, false);
        }
        this.setState({ openModal: !this.state.openModal });
    };

    onCloseModal = () => {
        this.setState({ openModal: !this.state.openModal });
    };

    handleOutsideClick = (e) => {
        if (e.target.className === "modal fade show") {
            this.setState({ openModal: !this.state.openModal });
        }
    };

    copyPasteContent = (event) => {
        let lines = event.split(/\r|\r\n|\n/);
        let count = lines.length;
        this.setState({ lineChecking: true })
        for (let i = 0; i <= count; i++) {
            let lengthcount = lines[i]?.length;
            if (lengthcount >= 100) {
                this.setState({ lineChecking: false })
            }
        }
        if (count <= 200 && this.state.lineChecking) {
            if (event === this.state.copiedText) return;
            const { examMonitor } = this.state;
            let copyPasteContent = {};
            copyPasteContent.time = new Date();
            copyPasteContent.content = event;
            copyPasteContent.questionId = this.state.questions[this.state.questionIndex]?.id;
            examMonitor.copyPasteContent.push(copyPasteContent);
            this.setState({ examMonitor: examMonitor });
        }
    }

    videoConstraints = {
        width: 150,
        height: 100,
        facingMode: "user"
    };

    handleValueChange = (event, newValue) => {
        this.setState({ tabName: newValue })
    };

    handleHintModal = (type) => {
        this.setState({ helpType: type })
        const questionHints = _.clone(this.state.questionHints);
        const existingHints = _.filter(questionHints, qh => (qh.questionId === this.state.questions[this.state.questionIndex].id && qh[type]))
        if (_.size(existingHints) > 0) {
            return this.setState({ openHintModal: true, currentHint: existingHints[0] })
        }
        this.setState({ openHintModal: true, helpType: type, currentHint: null })
    }

    onHintCloseModal = (e) => {
        if (e.target.className === "modal fade show" || e.target.className === 'btn btn-sm btn-nxt' || e.target.className === 'close') {
            if (this.state.openHintModal === true) this.setState({ openHintModal: !this.state.openHintModal })
        }

    }

    getHint = (type) => {
        const idx = this.state.questionIndex;
        const help = {
            helpType: type,
            questionId: this.state.questions[idx].id,
            examId: localStorage.getItem("examId")
        }
        axios.post(`${url.CANDIDATE_API}/candidate/help-taken`, help, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
        }).then((res) => {
            if (res.data.message) {
                let hint = res.data.message;
                let questionHints = _.clone(this.state.questionHints);
                const isAlreadyExist = _.filter(questionHints, qh => qh.questionId === this.state.questions[idx].id)
                let code = this.state.code;
                if (!code.includes("/**") && type === 'pseudocode') {
                    if (this.state.languageName === 'python') {
                        const commentLine = '"""\n';
                        code = commentLine.concat(hint).concat(commentLine).concat(code);
                    } else {
                        const commentLine = '/**\n';
                        code = commentLine.concat(hint).concat("*/\n").concat(code)
                    }
                    this.input(code)
                }
                if (_.size(isAlreadyExist) > 0) {
                    isAlreadyExist[0][type] = hint;
                } else {
                    let hints = { questionId: this.state.questions[idx].id }
                    hints[type] = hint;
                    questionHints.push(hints)
                }
                this.setState({ questionHints: questionHints, openHintModal: !this.state.openHintModal }, () => this.handleHintModal(type))
            } else {
                toastMessage('error', `Sorry no ${type} available for this question`)
            }
        })
    }

    getCompileError = (output) => {
        const currentQuestion = this.state.questions[this.state.questionIndex]
        if (this.state.languageName === 'java') {
            const userFunction = currentQuestion.userFunctionJava;
            const className = userFunction?.split("{", 1)[0]?.replace("class ", "");
            const mainClassName = currentQuestion.mainClassName + ".java";
            return output.replace(mainClassName, className + ".java")
        } else if (this.state.languageName === 'csharp') {
            const userFunction = currentQuestion.userFunctionCsharp;
            const className = userFunction?.split("{", 1)[0]?.replace("class ", "");
            const mainClassName = currentQuestion.mainClassName;
            return output.replace(mainClassName, className)
        }
        else {
            return output.replace(/\\/g, '\\').replace(/\\"/g, '"').replace(/\\n/g, '\n')
        }
    }

    handleRightClick = (event) => {
        if (url.UI_URL === 'https://app.skillsort.in')
            event.preventDefault();
    }

    restrictCopy = (event) => {
        event.preventDefault();
        this.setState({ openFailureSnackBar: true })
    }

    render() {
        return (
            <div onContextMenu={this.handleRightClick} onCopy={this.restrictCopy}>
                <Snackbar
                    open={this.state.open}
                    autoHideDuration={6000}
                    TransitionComponent={Fade}
                    message="Code saved Successfully"
                    key={"up"}
                    onClose={() => this.setState({ open: false })}
                />
                <Snackbar key={"down"} TransitionComponent={Fade} open={this.state.openFailureSnackBar} autoHideDuration={6000} onClose={() => this.setState({ openFailureSnackBar: false })}>
                    <Alert onClose={() => this.setState({ openFailureSnackBar: false })} variant="filled" severity="error">
                        Copy paste not allowed during test
                    </Alert>
                </Snackbar>
                <div className="full-screen-view">
                    <div className='header'>
                        <img className='header-logo' src={LOGO} alt="SkillSort" />
                        <div className='header-right'>
                            {this.state.start ? <div className="col-3" style={{ paddingLeft: '0px' }}>
                                <TimeCounter timeDuration={this.state.examQuestions} submittedConfirm={this.submittedConfirm} />
                            </div> : ''}
                        </div>
                    </div>
                    {this.state.stateOfCamera === 'prompt' ?
                        <div className='container' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                            {<span className='dash-text'>Waiting for camera permission</span>}<i className="fa fa-spinner fa-spin fa-3x fa-fw"></i>
                        </div> :
                        <div className="contents-wrapper">
                            <div className="fs-pains-container">
                                <div className="fs-left-pane" style={{ width: 'calc(47.5556% - 6px)', position: 'relative' }}>
                                    <div className="left-pane-container">

                                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }} >
                                            {this.state.programmingHasCamera ?
                                                <Webcam style={{ textDecoration: 'none' }}
                                                    videoConstraints={this.videoConstraints}
                                                    muted={false}
                                                    mirrored={true}
                                                    imageSmoothing={true}
                                                    screenshotFormat='image/jpeg'
                                                >
                                                    {({ getScreenshot }) => <div id="camera" onClick={() => {
                                                        this.setState({ base64Image: getScreenshot() }, () => this.sendScreenShot());
                                                    }} />
                                                    }
                                                </Webcam>
                                                : (
                                                    <span className="title-text">Online Test</span>
                                                )}

                                        </div>
                                        <hr className="hr-tag" />
                                        <span className="q-text">Q.{this.state.questionIndex + 1} Programming Test</span>
                                        <div className="col-md-12">
                                            <p className="instructions" dangerouslySetInnerHTML={{ __html: this.state.instructions }}></p>
                                        </div>
                                    </div>
                                    <div style={{ paddingTop: '1rem', paddingLeft: '1.5rem' }}>
                                        <div className="container">
                                            <div className="progress" style={{ height: '0.25rem', backgroundColor: 'rgba(59, 72, 158, 0.5)' }}>
                                                <div className="progress-bar" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"
                                                    style={{ width: `${((this.state.questionIndex + 1) / this.state.questions.length) * 100}%`, backgroundColor: '#F05A28' }}>
                                                </div>
                                            </div>
                                            <div className="footer-btn">
                                                <div>
                                                    <button
                                                        className="btn btn-sm btn-prev"
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={(e) => this.previous(e)}
                                                        disabled={this.state.questionIndex === 0 || this.state.disabledOnRun}>Previous
                                                    </button>
                                                </div>
                                                <span style={{ fontSize: '13px', fontWeight: '300' }}>Questions {this.state.questionIndex + 1} of {this.state.questions.length}</span>
                                                <div>
                                                    <button
                                                        className="btn btn-sm btn-nxt"
                                                        style={{ cursor: 'pointer' }}
                                                        disabled={this.state.questionIndex === this.state.questions.length - 1 || this.state.disabledOnRun}
                                                        onClick={(e) => { this.next(e) }}>
                                                        Next
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={this.state.isExpand ? "fs-right-pane card with-expand" : "fs-right-pane card without-expand"}>
                                    <div style={{ height: '100vh', overflow: !this.state.compileOutput ? 'auto' : null }}>
                                        <div className="row program-top" style={{ paddingTop: (this.state.compileOutput?.length > 0 && _.filter(this.state.compileOutput, f => f === 'Failed').length !== 0) ? '0rem' : '1rem' }}>
                                            <div className="col-lg-2 col-md-2 col-sm-2 col-2 col-xl-2 enlarge">
                                                <img src={this.state.isExpand ? minimize : enlarge} alt='enlarge' onClick={() => this.setState({ isExpand: !this.state.isExpand })} style={{ cursor: 'pointer', height: '29.7px', width: '29.7px' }} />
                                                <span style={{ fontSize: '13px', paddingLeft: '0.8rem', fontWeight: '300' }}>{this.state.isExpand ? "Minimize" : "Enlarge"}<br />Screen</span>
                                            </div>

                                            <div className={this.state.isExpand ? "col-lg-10 col-md-10 col-sm-10 col-10 col-xl-10 test-caseExpanded" : "col-lg-10 col-md-10 col-sm-10 col-10 col-xl-10 test-case"}>
                                                <div className="row" style={{ paddingRight: '4rem' }}>
                                                    {this.renderTestCases()}
                                                </div>
                                                <CustomizedMenus handleHelp={(type) => this.handleHintModal(type)} disable={true} disablePseudo={false} disableHint={false} />
                                            </div>
                                        </div>
                                        <section className="code-editor-section split">
                                            <AceEditor style={{ height: this.state.isExpand ? '65%' : '60%', width: '95%', marginLeft: '10px' }}
                                                mode={this.state.language_id}
                                                theme="monokai"
                                                onChange={this.input}
                                                value={this.state.code}
                                                fontSize={14}
                                                showPrintMargin={false}
                                                showGutter={true}
                                                highlightActiveLine={true}
                                                key={this.state.language_id}
                                                onPaste={this.copyPasteContent}
                                                onCopy={(e) => this.setState({ copiedText: e })}
                                                ref={this.editorRef}
                                                setOptions={{
                                                    enableBasicAutocompletion: true,
                                                    enableLiveAutocompletion: true,
                                                    enableSnippets: true,
                                                    showLineNumbers: true,
                                                    tabSize: 2,
                                                }} />
                                            <div style={{ paddingRight: this.state.isExpand ? '3rem' : '2rem', display:'flex', justifyContent: 'space-between' }}>
                                                <div style={{ paddingLeft: '1.5rem' }}>
                                                    <button
                                                        style={{ marginTop: '10px' }}
                                                        type="submit"
                                                        className="btn btn-prev btn-sm"
                                                        onClick={this.onClickOpenModel}
                                                    >
                                                        Submit
                                                    </button>
                                                    {this.state.openModal ? (<SubmitPopup submit={this.submitExam} close={this.onCloseModal} />) : ("")}
                                                </div>
                                                <div style={{display:'flex',gap:'10px'}}>
                                                    <button
                                                        style={{ marginTop: '10px' }}
                                                        type="submit"
                                                        className="btn btn-prev btn-sm ml-2 mr-2 "
                                                        onClick={this.submit}
                                                    >
                                                        Run
                                                    </button>
                                                    <button
                                                        style={{ marginTop: '10px' }}
                                                        type="submit"
                                                        className="btn btn-nxt btn-sm ml-2 mr-2 "
                                                        title="save(ctrl+s)"
                                                        onClick={this.saveCodeByButtonClick}
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                            {this.state.compileOutput && _.size(this.state.compileOutput) > 0 ?
                                                <>
                                                    <Divider style={{ marginTop: '1rem' }} />
                                                    <Box sx={{ width: '100%', typography: 'body1' }}>
                                                        <TabContext value={this.state.tabName}>
                                                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                                                <TabList onChange={this.handleValueChange} aria-label="lab API tabs example" >
                                                                    <Tab label="TestCase" value="testcase" />
                                                                </TabList>
                                                                <Divider />
                                                            </Box>
                                                            <TabPanel value='testcase' style={{ height: '100vh' }}>
                                                                <CardContent>
                                                                    <Typography>Input</Typography>
                                                                    <Card style={{ background: '#D3D3D3' }}>
                                                                        <CardContent>
                                                                            {this.state.compileOutput.input}
                                                                        </CardContent>
                                                                    </Card>
                                                                </CardContent>
                                                                <span className="setting-title" style={{ color: this.state.compileOutput.testCasePass ? 'green' : 'red', fontSize: '1.2rem', paddingLeft: '16px' }}>{this.state.compileOutput.testCasePass ? 'TestCase Passed' : 'Wrong Answer'}</span>
                                                                <CardContent>
                                                                    <Typography>Output</Typography>
                                                                    {!_.lowerCase(this.state.compileOutput.output).includes('error') ?
                                                                        <Card style={{ background: '#D3D3D3' }}>
                                                                            <CardContent>
                                                                                <Typography style={{ color: this.state.compileOutput.testCasePass ? 'green' : 'red' }} >{this.state.compileOutput.output}</Typography>
                                                                            </CardContent>
                                                                        </Card> : <Card style={{ background: !this.state.compileOutput.output.includes('error') ? '#D3D3D3' : '#FFCCCB' }}>
                                                                            <CardContent>
                                                                                <AutoResize readOnly={true} style={{ border: 'none', background: '#FFCCCB', width: '100%', height: '100% !important', outline: 'none', marginTop: '0.8rem' }} sx={{ color: "text.secondary" }} value={this.getCompileError(this.state.compileOutput.output.replace(/\\/g, '\\').replace(/\\"/g, '"').replace(/\\n/g, '\n'))}> </AutoResize>
                                                                            </CardContent>
                                                                        </Card>}
                                                                </CardContent>
                                                            </TabPanel>
                                                        </TabContext>
                                                    </Box>
                                                </>
                                                : null}
                                        </section>
                                    </div>
                                </div>
                            </div>
                            {!this.state.cameraPermission && this.state.programmingHasCamera && this.state.stateOfCamera !== 'prompt' ? <InstructionForCamera /> : null}
                            {!this.state.hasWebcam && this.state.programmingHasCamera ? <UnplugedModal /> : null}
                        </div>}
                    {this.state.openHintModal ? <HintModal type={this.state.helpType} onCloseModal={(e) => this.onHintCloseModal(e)} getHint={(type) => this.getHint(type)} currentHint={this.state.currentHint} isExam={true} /> : null}
                </div >
            </div >
        );
    }
}
