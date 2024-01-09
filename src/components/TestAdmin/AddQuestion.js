import { Box, Button, Checkbox, FormHelperText, Grid, Step, StepLabel, Stepper, Tab, TextareaAutosize } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
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
import axios from 'axios';
import ckeditor from '@ckeditor/ckeditor5-react'
import _ from "lodash";
import React, {useEffect, useState,useRef } from 'react';
import AceEditor from "react-ace";
import { Link } from 'react-router-dom';
import { authHeader, errorHandler } from '../../api/Api';
import { toastMessage } from '../../utils/CommonUtils';
import EditTextarea from '../../utils/EditableTextArea';
import { url } from '../../utils/UrlConstant';
import { isEmpty, isRoleValidation } from "../../utils/Validation";
import "../Candidate/Compiler.css";
import "../Candidate/Programming.css";
import AddSectionModal from './AddSectionModal';
import { DataGrid } from '@mui/x-data-grid'; // or the appropriate library

const AddQuestion = (props) => {

  const [questionTypeError , setQuestionTypeError] = useState(false)
  const [questionSectionError , setQuestionSectionError] = useState(false)
  const [questionGroupError, setQuestionGroupError]= useState(false)
  const [testTypeError , setTestTypeError] = useState(false)
 const [difficultyError , setDifficultyError] = useState(false)
 const[functionNameError , setFunctionNameError] = useState(false)
 const[returnTypeError,setReturnTypeError] = useState(false)
 const [parameterError, setParameterError] = useState(false)

 const [testCaseError, setTestCaseError] = useState(false)

const[returnTypeErrorMsg,setReturnTypeErrorMsg] = useState(false)

const[parameterErrorMsg,setParameterErrorMsg] = useState(false)
const[testCaseErrorMsg,setTestCaseErrorMsg]= useState(false)

const[questionTypeErrorMsg,setQuestionTypeErrorMsg] = useState(false)

const[questionSectionErrorMsg , setQuestionSectionErrorMsg] = useState(false)
const[testTypeErrorMsg,setTestTypeErrorMsg] = useState(false)

const[questionGroupErrorMsg,setQuestionGroupErrorMsg] =useState(false)

const[difficultyErrorMsg,setDifficultyErrorMsg] = useState(false)

const[functionNameErrorMsg,setFunctionNameErrorMsg] = useState(false)



const[selectExamType ,setSelectExamType] = useState(["MOCK", "ACTUAL"])

    const [tempOptions , setTempOptions] = useState(
     [{ name: 'A', value: '', }, { name: 'B', value: '', }]
    )

    const [expectedAnswer ,setExpectedAnswer] = useState(
       [{ input: '', output: '' }],
    )

    const[dataTypeExceedErrorMsg , setDataTypeExceedErrorMsg]= useState('7 Parameter Only Allowed')
    const [maxOption, setMaxOption] = useState(2);

    const [tabName, setTabName] = useState("java");

    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [javaCode, setJavaCode] = useState('');
    const [pythonCode, setPythonCode] = useState('');
    const [cSharpCode, setCSharpCode] = useState('');
    const [returnType, setReturnType] = useState('');
    const [name, setName] = useState('');
    const [status, setStatus] = useState('');
   const[type,setType]=useState('')
    const [manualStructure, setManualStructure] = useState(false);
    const [generateStructure, setGenerateStructure] = useState(false);
    const [parameters, setParameters] = useState([{ dataType: '', name: '' }]);

      const [selectSection, setSelectSection] = useState([]);
      const [groupTypes, setGroupTypes] = useState([]);

      const[selectDifficulty ,setSelectDifficulty] = useState(['SIMPLE', 'MEDIUM', 'COMPLEX'])

    const [state , setState ] = useState({

      openModal: false,
      masterSection: [],
      groupTypes: [],
      maxOption: 2,
      tempOptions: [{ name: 'A', value: '', }, { name: 'B', value: '', }],
      expectedAnswer: [{ input: '', output: '' }],
      selectExamType: ["MOCK", "ACTUAL"],
      selectDifficulty: ['SIMPLE', 'MEDIUM', 'COMPLEX'],
      selectSection: [],
      questionType: ['MCQ', 'True/False', 'programming', 'Fillups', 'SQL','Project'],
      isTimeBased: false,
      status: "ACTIVE",
      tabName: "java",
      mainClassBoxExpand: false,
      userFunctionBoxExpand: false,
      input: '',
      output: '',
      questionObject: {
        section: "",
        groupType: "",
        questionType: '',
        actualQuery: '',
        examType: '',
        difficulty: '',
        question: "",
        options: [],
        hint: "",
        answer: '',
        questionRoles: 'CANDIDATE',
        status: "ACTIVE",
        input: [],
        output: [],
        methodName: '',
        userFunctionJava: '',
        userFunctionPython: '',
        userFunctionCsharp: '',
        programInput: [],
        pseudoCode: "",
        parameters: [],
        programmingHint: "",
        mainClassName: ''
      },

      questionError: false,
      questionErrorMessage: 'Field Required !',
      questionTypeError: false,
      questionTypeErrorMsg: 'Select QuestionType',
      questionSectionError: false,
      questionSectionErrorMsg: 'Select QuestionSection',
      questionGroupError: false,
      questionGroupErrorMsg: 'Select Question GroupType',
      testTypeError: false,
      testTypeErrorMsg: 'Select TestType',
      difficultyError: false,
      difficultyErrorMsg: 'Select Difficult Type',
      error: {},
      functionNameError: false,
      functionNameErrorMsg: 'Field Required',
      dataTypes: ['byte', 'short', 'int', 'long', 'float', 'double', 'boolean', 'char', 'String', 'byte[]', 'short[]', 'int[]', 'long[]', 'float[]', 'double[]', 'boolean[]', 'char[]', 'String[]'],
      dataTypeExceedErrorMsg: '7 Parameter Only Allowed',
      returnTypeError: false,
      returnTypeErrorMsg: 'Fileld Required',
      parameterError: false,
      parameterErrorMsg: 'Enter the value In All Field',
      testCaseError: false,
      testCaseErrorMsg: 'Add TestCase',
      returnType: "",
      functionName: "",
      parameters: [{ dataType: '', name: '' }],
      javaCode: "",
      pythonCode: "",
      cSharpCode: "",
      testCase: [{ values: {}, output: '' }],
      testCaseShow: 0,
      addTestCaseExceed: false,
      activeStep: 0,
      addTestcaseModal: false,
      manualStructure: false,
      generateStructure: true
    })

      const [questionObject, setQuestionObject] = useState({
         
            section: "",
            groupType: "",
            questionType: '',
            actualQuery: '',
            examType: '',
            difficulty: '',
            question: "",
            options: [],
            hint: "",
            answer: '',
            questionRoles: 'CANDIDATE',
            status: "ACTIVE",
            input: [],
            output: [],
            methodName: '',
            userFunctionJava: '',
            userFunctionPython: '',
            userFunctionCsharp: '',
            programInput: [],
            pseudoCode: "",
            parameters: [],
            programmingHint: "",
            mainClassName: ''
          }
      );

      const [masterSection, setMasterSection] = useState([]); 

      const [mainClassBoxExpand, setMainClassBoxExpand] = useState(false);
      const [userFunctionBoxExpand, setUserFunctionBoxExpand] = useState(false);

      const [questionError, setQuestionError] = useState(false);
      const [questionErrorMessage, setQuestionErrorMessage] = useState('');
      const [error, setError] = useState({
        mainClassError: false,
        mainClassErrorMsg: '',
        userClassError: false,
        userClassErrorMsg: '',
        mainClassName: false,
        mainClassNameErrorMsg: '',
      });


      const [dataTypes,setDataType] = useState( ['byte', 'short', 'int', 'long', 'float', 'double', 'boolean', 'char', 'String', 'byte[]', 'short[]', 'int[]', 'long[]', 'float[]', 'double[]', 'boolean[]', 'char[]', 'String[]'])
      
      const [description, setDescription] = useState('');
      
      const [testCase, setTestCase] = useState([{ values: [{ name: '', value: '' }], output: '' }]);
      const [testCaseShow, setTestCaseShow] = useState(0);
      const [openModal, setOpenModal] = useState(false);
      const modalRef = useRef(null);

    const tabJson=[
        {
          value: "java",
          key: "mainClassJava",
          mode: "java"
        }, {
          value: "python",
          key: "mainClassPython",
          mode: "python"
        }, {
          value: "c#",
          key: "mainClassCsharp",
          mode: "csharp"
        }
      ]
   
      const userFunction =[
        {
            value: "java",
            key: "javaCode",
            mode: "java"
          }, {
            value: "python",
            key: "pythonCode",
            mode: "python"
          }, {
            value: "c#",
            key: "cSharpCode",
            mode: "csharp"
          }
      ]

      const setQuestions = () => {
        if (window.location.pathname.indexOf('edit') > -1) {
          const { questions } = window.location.state;
          let questionObject = questions;
          questionObject.javaCode = questions.userFunctionJava;
          questionObject.pythonCode = questions.userFunctionPython;
          questionObject.cSharpCode = questions.userFunctionCsharp;
          questionObject.groupType = questions.groupType;
    
          setTempOptions(questions.options);
          setJavaCode(questions.userFunctionJava);
          setPythonCode(questions.userFunctionPython);
          setCSharpCode(questions.userFunctionCsharp);
          setReturnType(questions.returnType);
          setName(questions.section);
          setStatus(questions.status);
          setQuestionObject(questionObject);
          setManualStructure(!questions.programInput || false);
          setGenerateStructure(questions.programInput || false);
          setInput(questions.input ? questions.input[0] : '');
          setOutput(questions.output ? questions.output[0] : '');
    
          if (questions.programInput) {
            let testCase = questions.programInput.map((inpu, index) => ({
              values: inpu,
              output: questions.output[index],
            }));
            setTestCase(testCase);
          }
    
          if (questions.parameters) {
            let parameter = Object.entries(questions.parameters).map(([index, item]) => ({
              name: index,
              dataType: item,
            }));
            setParameters(parameter);
          }
        }
      };

      useEffect( ()=>{
        handleUseEffect()
      }, [])

     const handleUseEffect =()=>{
        const fetchData = async () => {
          try {
            
            const allowedTestCase = isRoleValidation() === 'TEST_ADMIN' ? 5 : 4;
            setTestCase(prevTestCase => [
              ...prevTestCase,
              ...Array.from({ length: allowedTestCase }, () => ({ values: {}, output: '' })),
            ]);
    
            const sectionResponse = await axios.get(`${url.ADMIN_API}/section/list?sectionRoles=CANDIDATE&status=ACTIVE&page=1&size=100`, { headers: authHeader() });
            const sectionData = sectionResponse.data.response.content;
            const sectionNames = Object.values(sectionData).map(item => item.name);
            setSelectSection(sectionNames);
            const questionType = questionObject?.questionType;
            if (questionType) {
              setSelectedSection(questionType);
            }
    
            
            const groupTypeResponse = await axios.get(`${url.COLLEGE_API}/practiceExam/getGroupType`, { headers: authHeader() });
            setGroupTypes(groupTypeResponse.data.response);
          } catch (error) {
            console.error(error.response?.data?.message);
            errorHandler(error);  
          }
        };
    
        fetchData();
    }
    
      const handleHintChange = (e, key) => {
        setQuestionObject(prevQuestionObject => ({
          ...prevQuestionObject,
          [key]: e.target.value,
        }));
      };
    
      const getSection = (questionType) => {
        switch (questionType) {
          case 'programming':
            return 'PROGRAMMING';
          case 'Fillups':
            return 'FILLUPS';
          case 'SQL':
            return 'SQL';
          case 'Project':
            return 'PROJECT';
          default:
            return '';
        }
      };
    
      const handleChange = (e, key) => {
        setQuestionObject((prevQuestionObject) => {
          switch (key) {
            case 'question':
            case 'staticFunction':
              return {
                ...prevQuestionObject,
                [key]: e.editor.getData(),
              };
            case 'methodName':
              return {
                ...prevQuestionObject,
                [key]: e.target.value.replace(/ /g, ''),
              };
            case 'questionType':
              const newQuestionObject = {
                ...prevQuestionObject,
                [key]: e.target.value,
                section: getSection(e.target.value),
              };
              if (e.target.value === 'True/False') {
                newQuestionObject.maxOption = 2;
                setSelectedSection(e.target.value);
              }
              if (e.target.value === 'MCQ') {
                newQuestionObject.maxOption = 5;
                setSelectedSection(e.target.value);
              }
              return newQuestionObject;
            default:
              return {
                ...prevQuestionObject,
                [key]: e.target.value,
              };
          }
        });
      };
      const setSelectedSection = (qType) => {
        if (qType !== 'programming' && qType !== 'SQL') {
          let updatedSelectSection = masterSection.filter(
            (section) => section !== 'PROGRAMMING' && section !== 'SQL' && section !== 'FILLUPS'
          );
          setSelectSection(updatedSelectSection);
        } else if (qType === 'SQL') {
          setSelectSection(['SQL']);
        } else {
          setSelectSection(['PROGRAMMING']);
        }
      };
    
      const handleStatusChange = (e) => {
        setStatus(e.target.value);
      };

    
    
      const handleOptionChange=(i, e) =>{
        const { name, value } = e.target;
        setTempOptions((prevTempOptions) => {
            const updatedTempOptions = [...prevTempOptions];
            updatedTempOptions[i] = { ...updatedTempOptions[i], [name]: value };
            return updatedTempOptions;
          });
      }
    
    
     const handleTestCaseChange = (params) => {
    const { field, id, props } = params;

    if (field !== 'output') {
      setTestCase((prevTestCase) => {
        const updatedTestCase = [...prevTestCase];
        updatedTestCase[id].values = {
          ...updatedTestCase[id].values,
          [field]: props.value.replace(/"/g, ''),
        };
        return updatedTestCase;
      });
    } else if (field === 'output') {
      setTestCase((prevTestCase) => {
        const updatedTestCase = [...prevTestCase];
        updatedTestCase[id] = {
          ...updatedTestCase[id],
          [field]: props.value.replace(/"/g, ''),
        };
        return updatedTestCase;
      });
    }
  };
  const getmapParameters = () => {
    return parameters.reduce((obj, { name, dataType }) => {
      return { ...obj, [name]: dataType };
    }, {});
  };
    
    
  const handleValueChange = (event, newValue) => {
    setTabName(newValue);
  };
    
  const handleExpand = (key) => {
    if (key === 'mainClass') {
      setMainClassBoxExpand((prevExpand) => !prevExpand);
    } else {
      setUserFunctionBoxExpand((prevExpand) => !prevExpand);
    }
  };
    
    
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (questionObject.questionType === 'programming' && generateStructure) {
      await generateProgramCode();
    }

    let questionError = false;
    let questionErrorMessage = '';

    if (isEmpty(questionObject.question)) {
      questionError = true;
      questionErrorMessage = 'Field Required!';
      setQuestionError(questionError);
      setQuestionErrorMessage(questionErrorMessage);
    } else {
      setQuestionError(false);
      setQuestionErrorMessage('');
    }

    if (questionObject.questionType === 'programming') {
        if (isEmpty(questionObject.methodName) && generateStructure) {
          setError((prevError) => ({
            ...prevError,
            mainClassError: true,
          }));
        } else {
          setError((prevError) => ({
            ...prevError,
            mainClassError: false,
          }));
        }
  
        if (manualStructure && (!questionObject.mainClassJava || !questionObject.mainClassPython || !questionObject.mainClassCsharp)) {
          setError((prevError) => ({
            ...prevError,
            mainClassError: true,
            mainClassErrorMsg: 'Field Required!',
          }));
        } else {
          setError((prevError) => ({
            ...prevError,
            mainClassError: false,
            mainClassErrorMsg: '',
          }));
        }
  
        if (manualStructure && (_.isEmpty(questionObject.javaCode) || _.isEmpty(questionObject.pythonCode) || _.isEmpty(questionObject.cSharpCode))) {
          setError((prevError) => ({
            ...prevError,
            userClassError: true,
            userClassErrorMsg: 'Field Required!',
          }));
        } else {
          setError((prevError) => ({
            ...prevError,
            userClassError: false,
            userClassErrorMsg: '',
          }));
        }
  
        if (manualStructure && (_.isEmpty(questionObject.mainClassName))) {
          setError((prevError) => ({
            ...prevError,
            mainClassName: true,
            mainClassNameErrorMsg: 'Field Required!',
          }));
        } else {
          setError((prevError) => ({
            ...prevError,
            mainClassName: false,
            mainClassNameErrorMsg: '',
          }));
        }
      }
    
      if (error.mainClassError || error.userClassError || error.mainClassName || questionError) {
        return;
      }
    submitQuestion();
};

    
    const   submitQuestion = () => {
        const updatedQuestionObject = { ...questionObject };
        updatedQuestionObject['options'] = tempOptions;
        updatedQuestionObject['status'] = status;
    
        if (updatedQuestionObject.questionType === 'programming') {
          updatedQuestionObject['methodName'] = updatedQuestionObject.methodName?.replace(/\s/g, '_');
    
          if (generateStructure) {
            updatedQuestionObject['programInput'] = testCase.map((item) => item.values);
            updatedQuestionObject['output'] = testCase.map((item) => item.output);
            updatedQuestionObject['userFunctionJava'] = javaCode;
            updatedQuestionObject['userFunctionPython'] = pythonCode;
            updatedQuestionObject['userFunctionCsharp'] = cSharpCode;
            updatedQuestionObject['parameters'] = getmapParameters(updatedQuestionObject);
            updatedQuestionObject['returnType'] = returnType;
            delete updatedQuestionObject.mainClassName;
          } else {
            updatedQuestionObject.output.pop();
            updatedQuestionObject.output.push(output);
            updatedQuestionObject.input.pop();
            updatedQuestionObject.input.push(input);
            updatedQuestionObject['userFunctionJava'] = updatedQuestionObject.javaCode;
            updatedQuestionObject['userFunctionPython'] = updatedQuestionObject.pythonCode;
            updatedQuestionObject['userFunctionCsharp'] = updatedQuestionObject.cSharpCode;
            delete updatedQuestionObject.programInput;
            delete updatedQuestionObject.parameters;
          }
        } else {
          updatedQuestionObject.parameters = null;
        }
    
        if ((updatedQuestionObject.questionType === 'SQL' && updatedQuestionObject.groupType === 'SQL') || updatedQuestionObject.groupType) {
          updatedQuestionObject['section'] = '';
        }
    
        console.log(updatedQuestionObject);
        axios
      .post(`/api2/question/save`, questionObject, { headers: authHeader() })
      .then(() => {
        setActiveStep(0);

        if (props.location.pathname.indexOf('edit') > -1) {
          toastMessage('success', 'Question Updated Successfully..!');
          props.history.push({
            pathname: isRoleValidation() === 'TEST_ADMIN' ? '/testadmin/question' : '/admin/questions',
            state: { difficulty: props.location?.state?.difficulty, section: props.location?.state?.section },
          });
          props.history.push(isRoleValidation() === 'TEST_ADMIN' ? '/testadmin/question' : '/admin/questions');
        } else {
          toastMessage('success', 'Question Added Successfully..!');
          resetQuestionForm();
        }
      })
      .catch(error => {
        errorHandler(error);
      });
      }
    
      const resetQuestionForm = () => {
        setStatus('ACTIVE');
        setTempOptions([
          { name: 'A', value: '' },
          { name: 'B', value: '' },
        ]);
        setQuestionObject({
          section: '',
          questionType: '',
          difficulty: '',
          question: '',
          options: [],
          hint: '',
          answer: '',
          programInput: [],
          programOutput: [],
          javaCode: '',
          pythonCode: '',
          csharpCode: '',
          pseudoCode: '',
          parameters: [],
          programmingHint: '',
          returnType: '',
          examType: '',
        });
        setName('');
        setDescription('');
        setReturnType('');
        setParameters([{ dataType: '', name: '' }]);
        setJavaCode('');
        setPythonCode('');
        setCSharpCode('');
        setTestCase([{ values: [{ name: '', value: '' }], output: '' }]);
        setTestCaseShow(0);
      };

      const addOption = () => {
        if (tempOptions && tempOptions?.length < maxOption) {
          setTempOptions((prevTempOptions) => [
            ...prevTempOptions,
            {
              name: String.fromCharCode(
                prevTempOptions[prevTempOptions.length - 1].name.charCodeAt(0) + 1
              ),
              value: '',
            },
          ]);
        } else {
          setExpectedAnswer((prevExpectedAnswer) => [
            ...prevExpectedAnswer,
            { input: '', output: '' },
          ]);
        }
      };
    
      const mcqRemoveOption = () => {
        if (tempOptions?.length > 2) {
          setTempOptions((prevTempOptions) => {
            const updatedTempOptions = [...prevTempOptions];
            updatedTempOptions.pop();
            return updatedTempOptions;
          });
        } else {
          setExpectedAnswer((prevExpectedAnswer) => {
            const updatedExpectedAnswer = [...prevExpectedAnswer];
            updatedExpectedAnswer.pop();
            return updatedExpectedAnswer;
          });
        }
      };

      const deleteInputsByIndex = (index, questionType) => {
        if (questionType === 'programming') {
          setExpectedAnswer((prevExpectedAnswer) => {
            const updatedExpectedAnswer = [...prevExpectedAnswer];
            updatedExpectedAnswer.splice(index, 1);
            return updatedExpectedAnswer;
          });
        } else {
          setTempOptions((prevTempOptions) => {
            const updatedTempOptions = [...prevTempOptions];
            updatedTempOptions.splice(index, 1);
            return updatedTempOptions;
          });
        }
      };

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'input') {
          setInput(value);
        } else {
          setOutput(value);
        }
      };


      const createDynamicInput = () => {
        if (questionObject.questionType !== 'programming' && questionObject.questionType !== 'Fillups' && questionObject.questionType !== 'SQL') {
          return tempOptions.map((el, i) => (
            <div className='row' style={{ marginLeft: '0.25rem' }} key={i}>
        <div className="col-6 col-lg-6 col-sm-6 col-xl-6">
          <div className="row">
            <div className="col-3 col-lg-3 col-sm-3 col-xl-3">
              <label className="form-label text-input-label">{el.name}</label>
            </div>
            <div className="col-7 col-lg-7 col-sm-7 col-xl-7">
              <input
                className="profile-page"
                required
                autoComplete="off"
                placeholder={'option-' + el.name}
                name="value"
                value={el.value || ''}
                onChange={(e) => handleOptionChange(i, e)}
              />
            </div>
            <div className='col-2 col-lg-2 col-sm-2 col-xl-2'>
              {i > 1 ? (
                <i
                  className="fa fa-trash"
                  aria-hidden="true"
                  style={{ color: 'red', marginTop: '1rem' }}
                  onClick={() => deleteInputsByIndex(i, questionObject.questionType)}
                ></i>
              ) : null}
            </div>
          </div>
        </div>
      </div>
          ));
        } else if (questionObject.questionType === 'programming' && manualStructure) {
          return (
            <>
      <div className='row'>
        <div className="col-6 col-lg-6 col-sm-6 col-xl-6" key={"input"}>
          <div className='row'>
            <div className="col-3 col-lg-3 col-sm-3 col-xl-3">
              <label className="form-label text-input-label"><b>Input</b></label>
            </div>
            <div className="col-9 col-lg-9 col-sm-9 col-xl-9">
              <textarea
                name="input"
                className="profile-page"
                value={input || ''}
                onChange={(e) => handleInputChange(e)}
                placeholder="Input"
                autoComplete="off"
              />
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-6 col-sm-6 col-xl-6" key={"output"}>
          <div className='row'>
            <div className="col-3 col-lg-3 col-sm-3 col-xl-3">
              <label className="form-label text-input-label"><b>Expected output</b></label>
            </div>
            <div className="col-7 col-lg-7 col-sm-7 col-xl-7">
              <textarea
                name="output"
                className="profile-page"
                value={output || ''}
                onChange={(e) => handleInputChange(e)}
                placeholder="Expected output"
                autoComplete="off"
              />
            </div>
          </div>
        </div>
      </div>
    </>
          );
        }
      };

      const onClickOpenModel = (type) => {
        if (!openModal) {
          document.addEventListener('click', handleOutsideClick, false);
        } else {
          document.removeEventListener('click', handleOutsideClick, false);
        }
        setOpenModal((prevOpenModal) => !prevOpenModal);
        setType(type);
      };
    
      const handleOutsideClick = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
          setOpenModal(false);
        }
      };

      const onCloseModal = () => {
        setOpenModal((prevOpenModal) => !prevOpenModal);
         handleUseEffect()
      }

     const beautify = (editor) => {
        const session = editor.session;
        console.log(session.getMode())
        session.setValue(session.getValue(), {
          indent_size: 2
        })
      }

      const handleMainClass = (value, key) => {
        setQuestionObject((prevQuestionObject) => ({
          ...prevQuestionObject,
          [key]: value,
        }));
      };

      const renderAceEditor = (key, mode) => {
        return <AceEditor style={{ height: '80%', width: '100%', marginLeft: '5px' }}
          mode={mode}
          theme="monokai"
          value={questionObject[key] ||[key]}
          onChange={(value) => handleMainClass(value, key)}
          fontSize={14}
          showPrintMargin={false}
          showGutter={false}
          commands={[
            {
              name: "beautify",
              bindKey: { win: 'Ctrl-Shift-I', mac: 'Command-Shift-I' },
              exec: (ses) => beautify(ses),
            }
          ]}
          key={key}
          highlightActiveLine={true}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2,
          }} />
      }

      const setProgramStub = (e, key) => {

        if (key === 'returnType') {
          setReturnType( e.target.value )
        }
      }

      const addParameter = () => {
        if (parameters.length <= 7) {
          setParameters(prevParameters => [
            ...prevParameters,
            { dataType: '', name: '' },
          ]);
        }
      };

      const handleDataTypeChange = (e, i) => {
        const { name, value } = e.target;
    
        if (props.location.pathname.includes('edit') && name === 'name') {
          const updatedTestCase = testCase.map((obj) => {
            obj.values[value] = obj.values[parameters[i].name];
            delete obj.values[parameters[i].name];
            return obj;
          });
    
          setTestCase(updatedTestCase);
        }
    
        const spaceRemoveval = value.replace(/ /g, '');
        setParameters((prevParameters) => [
          ...prevParameters.slice(0, i),
          { ...prevParameters[i], [name]: spaceRemoveval },
          ...prevParameters.slice(i + 1),
        ]);
      };

      const createDynamicAddingData = () => {
        return parameters.map((el, i) => (
          <React.Fragment key={i}>
            {i < 7 ? (
              <Grid container spacing={2} style={{ marginLeft: '10px', marginBottom: '10px' }}>
                <Grid item sm={6}>
                  <div style={{ marginBottom: '10px' }}>
                    <select
                      className="profile-page"
                      name="dataType"
                      required
                      style={{ background: 'none' }}
                      value={el.dataType || ''}
                      onChange={(e) => handleDataTypeChange(e, i)}
                    >
                      <option value="" defaultValue>
                        Select DataType
                      </option>
                      {Object.entries(
                        


                      ).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>
                </Grid>
                <Grid item sm={6}>
                  <div key={`name${i}`}>
                    <input
                      name="name"
                      className="profile-page"
                      placeholder="Parameter Name"
                      value={el.name || ''}
                      onChange={(e) => handleDataTypeChange(e, i)}
                      autoComplete="off"
                    />
                    {i !== 0 ? (
                      <i
                        className="fa fa-trash"
                        aria-hidden="true"
                        style={{ color: 'red', cursor: 'pointer' }}
                        onClick={() => deleteDataTypesByIndex(i)}
                      ></i>
                    ) : null}
                  </div>
                </Grid>
              </Grid>
            ) : i === 7 ? (
              <div>
                <FormHelperText style={{ marginLeft: '10px' }} className="helper">
                  {dataTypeExceedErrorMsg}
                </FormHelperText>
              </div>
            ) : null}
          </React.Fragment>
        ));
      };

      const deleteDataTypesByIndex = (index) => {
        const selectedOption = parameters[index];
        const updatedParameters = parameters.filter((option, i) => i !== index);
        setParameters(updatedParameters);
      };

      const generateProgramCode = () => {
        generateJavaCode();
        generatePythonCode();
        generateCSharpCode();
      };

      const generateJavaCode = () => {
        let mainClass = `public class Solution {  \n \t public static ${returnType} ${questionObject.methodName}(`;
        let codeJava = parameters.map((param, index) => (
          `${param.dataType} ${param.name}${index === parameters.length - 1 ? '){ \n   }\n}' : ','}`
        ));
        let code = mainClass + codeJava.join('');
        setJavaCode(code);
        console.log(code);
      };

      const generatePythonCode = () => {
        let mainClass = `def ${questionObject.methodName}(`;
        let codePython = parameters.map((param, index) => (
          `${param.name}${index === parameters.length - 1 ? '):' : ','}`
        ));
        let code = mainClass + codePython.join('');
        setPythonCode(code);
      };

      const generateCSharpCode = () => {
        let mainClass = `class Solution{  \n \t public static ${returnType.toLowerCase()} ${questionObject.methodName}(`;
        let codeCSharp = parameters.map((param, index) => (
          `${param.dataType.toLowerCase()} ${param.name}${index === parameters.length - 1 ? '){ \n     }\n}' : ','}`
        ));
        let code = mainClass + codeCSharp.join('');
        setCSharpCode(code);
      };


      const handleNext = async () => {
        if (activeStep === 0) {
          setQuestionTypeError(!questionObject.questionType);
          setQuestionSectionError(!questionObject.section);
          setQuestionGroupError(!questionObject.groupType);
          setTestTypeError(!questionObject.examType);
          setDifficultyError(!questionObject.difficulty);
          setQuestionError(!questionObject.question);
    
          if (!questionObject.groupType && questionObject.section === 'PROGRAMMING') {
            setQuestionObject((prevQuestionObject) => ({
              ...prevQuestionObject,
              section: '',
            }));
          }
    
          const isValid =
            questionObject.questionType &&
            (questionObject.section || questionObject.groupType) &&
            questionObject.examType &&
            questionObject.difficulty &&
            questionObject.question;
    
          if (isValid) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setQuestionError(false);
            setDifficultyError(false);
            setTestTypeError(false);
            setQuestionSectionError(false);
            setQuestionGroupError(false);
            setQuestionTypeError(false);
          }
        } else if (activeStep === 1 && questionObject.questionType === 'programming') {
          const emptyStr = parameters.some((param) => !param.name || !param.dataType);
    
          setFunctionNameError(!questionObject.methodName);
          setReturnTypeError(!returnType);
          setParameterError(emptyStr);
    
          if (questionObject.methodName && returnType && !emptyStr) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setParameterError(false);
            setReturnTypeError(false);
            setFunctionNameError(false);
          }
        } else if (activeStep === 2) {
          setTestCaseError(testCase.length < 5);
    
          if (!testCaseError) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setTestCaseError(false);
          }
        }
      };

      const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
      };

      const handleCellKeyDown = (params, event) => {
        if (!params || !params.value) return;
    
        if (event.key === 'Enter' && params.cellMode === 'edit') {
          console.log(params);
          event.preventDefault();
          params.api.setEditCellValue({
            id: params.id,
            field: params.field,
            value: params.value.concat('\n'),
          });
        }
      };

      const selectStructureType = (key) => {
        if (key === 'Manual' && !manualStructure) {
          setManualStructure(true);
          setGenerateStructure(false);
        } else if (key !== 'Manual' && !generateStructure) {
          setGenerateStructure(true);
          setManualStructure(false);
        }
      };


      const [activeStep, setActiveStep] = useState(0);
    
      const questionType = questionObject.questionType;
      const steps =
        questionType === 'programming' && generateStructure
          ? ['Type', 'Code Stub', 'TestCase', 'Submit']
          : questionType !== 'programming' && !manualStructure
          ? ['Type', 'Submit']
          : [];
    
      let action = null;
      if (window.location.pathname.indexOf('edit') > -1) {
        // Note: If using react-router, you might need to access location from props.
        // Modify accordingly based on your router setup.
        action = window.location.state;
      }
      

  return (<>
    {openModal ? <AddSectionModal type={type} modalSection={{ action: 'Add' }} onCloseModalAdd={onCloseModal} /> : ''}
    <main className="main-content bcg-clr">
      <div>
        <div className="container-fluid cf-1">
          <div className="card-header-new">
            <span>
              {action !== null ? 'Update' : 'Add'} Question
            </span>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="table-border-cr">
                <form onSubmit={handleSubmit}>
                  <Stepper activeStep={activeStep}>
                    {steps.map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                  {activeStep === 0 && (
                    <div>
                      <div className="row">
                        <div className=" col-6 col-lg-6 col-sm-6 col-xl-6">
                          <div className='row'>
                            <div className=" col-3 col-lg-3 col-sm-3 col-xl-3">
                              <label className="form-label text-input-label">Question Type <span className='required'></span></label>
                            </div>
                            <div className=" col-9 col-lg-9 col-sm-9 col-xl-9">
                              <div>
                                <select className='profile-page' required
                                  value={questionObject.questionType}
                                  onChange={(e) => handleChange(e, 'questionType')} style={{ background: 'none' }}>
                                  <option hidden selected value="">Select Question Type</option>
                                  {_.map(questionType, (key, value) => {
                                    return <option value={key}>{key}</option>
                                  })}
                                </select>
                                <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{questionTypeError ? questionTypeErrorMsg : null}</FormHelperText>
                              </div>
                            </div>
                          </div>
                        </div>
                        {!questionObject.groupType && questionObject.questionType === 'MCQ' ? <div className=" col-6 col-lg-6 col-sm-6 col-xl-6">
                          <div className='row'>
                            <div className=" col-3 col-lg-3 col-sm-3 col-xl-3">
                              <label className="form-label text-input-label">Section<span className='required'></span></label></div>
                            <div className=" col-9 col-lg-9 col-sm-9 col-xl-9" style={{ marginLeft: '-40px' }}>
                              <div>
                                <button type="button" onClick={() => onClickOpenModel('Section')} style={{ marginTop: '-5px' }} data-toggle="tooltip" data-placement="top" title="Add Section" className="btn btn-outline-primary ml-1 border-0 rounded-circle"><i className="fa fa-plus-circle fa-1x " aria-hidden="true"></i></button>
                                <select className='profile-page' required name='section'
                                  value={questionObject.section}
                                  onChange={(e) => handleChange(e, 'section')} style={{ background: 'none' }}>
                                  <option hidden selected value="">Select section</option>
                                  {_.map(selectSection, (key, value) => {
                                    return <option value={key}>{key}</option>;
                                  })}
                                </select>
                                <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{questionSectionError ? questionSectionErrorMsg : null}</FormHelperText>
                              </div></div>
                          </div>
                        </div> : null}
                      </div>
                      <div className='row'>
                        <div className=" col-6 col-lg-6 col-sm-6 col-xl-6">
                          <div className='row'>
                            <div className=" col-3 col-lg-3 col-sm-3 col-xl-3">
                              <label className="form-label text-input-label">Test Type <span className='required'></span></label></div>
                            <div className=" col-9 col-lg-9 col-sm-9 col-xl-9">
                              <div>
                                <select className='profile-page' required name='section'
                                  value={questionObject.examType}
                                  onChange={(e) => handleChange(e, 'examType')} style={{ background: 'none' }}>
                                  <option hidden selected value="">Select Test Type</option>
                                  {_.map(selectExamType, (key, value) => {
                                    return <option value={key}>{key}</option>;
                                  })}
                                </select>
                                <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{testTypeError ? testTypeErrorMsg : null}</FormHelperText>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className=" col-6 col-lg-6 col-sm-6 col-xl-6">
                          <div className='row'>
                            <div className=" col-3 col-lg-3 col-sm-3 col-xl-3">
                              <label className="form-label text-input-label">Difficulty<span className='required'></span></label></div>
                            <div className=" col-9 col-lg-9 col-sm-9 col-xl-9">
                              <div>
                                <select style={{ background: 'none' }} className='profile-page' required name="difficulty"
                                  value={questionObject.difficulty}
                                  onChange={(e) => handleChange(e, 'difficulty')}
                                >
                                  <option hidden selected value="">Select difficulty</option>
                                  {_.map(selectDifficulty, (key, value) => {
                                    return <option value={key}>{key}</option>;
                                  })}
                                </select>
                                <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{difficultyError ? difficultyErrorMsg : null}</FormHelperText>
                              </div>
                            </div>
                          </div>
                        </div>
                        {(!questionObject.section || questionObject.questionType === 'programming' || questionObject.questionType === 'SQL') && (!(isRoleValidation() === 'HR_MANAGER' || isRoleValidation() === 'ADMIN')) ?
                          <div className=" col-6 col-lg-6 col-sm-6 col-xl-6">
                            <div className='row'>
                              <div className=" col-3 col-lg-3 col-sm-3 col-xl-3">
                                <label className="form-label text-input-label">GroupType<span className='required'></span></label></div>
                              <div className=" col-9 col-lg-9 col-sm-9 col-xl-9" style={{ marginLeft: '-40px' }}>
                                <div>
                                  <button type="button" onClick={() => onClickOpenModel('Group')} style={{ marginTop: '-5px' }} data-toggle="tooltip" data-placement="top" title="Add GroupType" className="btn btn-outline-primary ml-1 border-0 rounded-circle"><i className="fa fa-plus-circle fa-1x " aria-hidden="true"></i></button>
                                  <select className='profile-page' required name='groupType'
                                    value={questionObject.groupType}
                                    onChange={(e) => handleChange(e, 'groupType')} style={{ background: 'none' }}>
                                    <option hidden selected value="">Select Group</option>
                                    {_.map(groupTypes, (key, value) => {
                                      return <option value={key.name}>{key.name}</option>;
                                    })}
                                  </select>
                                  <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{questionGroupError ? questionGroupErrorMsg : null}</FormHelperText>
                                </div></div>
                            </div>
                          </div> : null}
                      </div>
                      {questionObject.questionType === 'programming' ?
                        <div className="col-md-12">
                          <div className='row'>
                            <div className='col-6 col-lg-6 col-sm-6 col-xl-6'>
                              <span>Select Program Structure</span>
                            </div>
                            <div className='col-lg-3 col-sm-3 xol-md-3'>
                              <div className="form-group">
                                <span>Manual</span>
                                <Checkbox checked={manualStructure} onChange={() => selectStructureType('Manual')} />
                              </div>
                            </div>
                            <div className='col-lg-3 col-sm-3 xol-md-3'>
                              <div className="form-group">
                                <span>Generate</span>
                                <Checkbox checked={generateStructure} onChange={() => selectStructureType('Generate')} />
                              </div>
                            </div>
                          </div>
                        </div>
                        : null}
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <label className="form-label-select" style={{ marginLeft: '-18px' }}>Question<span className='required'></span></label>
                          <ckeditor
                            content={questionObject.question}
                            events={{
                              "change": (data) => handleChange(data, 'question'),
                              "ready": (data) => console.log(data)
                            }}
                            config={{
                              removePlugins: 'elementspath',
                              resize_enabled: false
                            }}
                          />
                          <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{questionError ? questionErrorMessage : null}</FormHelperText>
                        </Grid>
                        <Grid item xs={6}>
                          <label className="form-label-select" style={{ marginLeft: '-9px' }} >Preview</label>
                          <div className="fs-left-pane" style={{ maxHeight: '310px', height: '310px', overflowY: 'auto', border: '1px solid #d1d1d1' }}>
                            <div className="left-pane-container">
                              <span className="q-text">Question Preview</span>
                              <div style={{ padding: '1rem' }} >
                                <p className="instructions" dangerouslySetInnerHTML={{ __html: questionObject.question }}></p>
                              </div>
                            </div>
                          </div>
                        </Grid>
                      </Grid>
                      {questionType === 'programming' && manualStructure ?
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                          <Grid item xs={(!mainClassBoxExpand && !userFunctionBoxExpand) ? 6 : mainClassBoxExpand && !userFunctionBoxExpand ? 9 : 3}>
                            <div className='form-group col-lg-12 col-12 col-sm-12' style={{ height: "calc(100vh - 30px)" }}>
                              <label className="form-label-select" style={{ marginLeft: '-1.5rem' }}>Main Class <span className='required'></span></label>
                              <Box sx={{ width: '100%', typography: 'body1', height: '100%' }}>
                                <TabContext value={tabName}>
                                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <TabList onChange={handleValueChange} aria-label="lab API tabs example" >
                                      <Tab label="Java" value="java" />
                                      <Tab label="Python" value="python" />
                                      <Tab label="C#" value="c#" />
                                    </TabList>
                                  </Box>
                                  {!userFunctionBoxExpand ?
                                    <div onClick={() => handleExpand('mainClass')} style={{ float: 'right', marginRight: '1.2rem' }}>
                                      <i style={{ cursor: 'pointer' }} className={!mainClassBoxExpand ? "fa fa-expand" : "fa fa-compress"} aria-hidden="true"></i>
                                    </div> : null}
                                  {_.map(tabJson, json => <>
                                    <TabPanel value={json.value} style={{ height: '100%' }}>{renderAceEditor(json.key, json.mode)}</TabPanel>
                                  </>)}
                                </TabContext>
                              </Box>
                            </div>
                            <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{error.mainClassError ? error.mainClassErrorMsg : null}</FormHelperText>
                          </Grid>
                          <Grid item xs={(!mainClassBoxExpand && !userFunctionBoxExpand) ? 6 : userFunctionBoxExpand && !mainClassBoxExpand ? 9 : 3}>
                            <div className='form-group col-lg-12 col-12 col-sm-12' style={{ height: "calc(100vh - 30px)" }}>
                              <label className="form-label-select" style={{ marginLeft: '-30px' }}>User Function <span className='required'></span></label>
                              <Box sx={{ width: '100%', typography: 'body1', height: '100%' }}>
                                <TabContext value={tabName}>
                                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <TabList onChange={handleValueChange} aria-label="lab API tabs example" >
                                      <Tab label="Java" value="java" />
                                      <Tab label="Python" value="python" />
                                      <Tab label="C#" value="c#" />
                                    </TabList>
                                  </Box>
                                  {!mainClassBoxExpand ?
                                    <div onClick={() => handleExpand('userFunction')} style={{ float: 'right', marginRight: '1.2rem' }}>
                                      <i style={{ cursor: 'pointer' }} className={!userFunctionBoxExpand ? "fa fa-expand" : "fa fa-compress"} aria-hidden="true"></i>
                                    </div> : null}
                                  {_.map(userFunction, json => <>
                                    <TabPanel value={json.value} style={{ height: '100%' }}>{renderAceEditor(json.key, json.mode)}</TabPanel>
                                  </>)}
                                </TabContext>
                              </Box>
                            </div>
                            <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{error.userClassError ? error.userClassErrorMsg : null}</FormHelperText>
                          </Grid>
                        </Grid> : null
                      }
                    </div>)}
                  {questionType === 'programming' && manualStructure ? createDynamicInput() : null}
                  {questionType !== 'programming' ? activeStep === 1 && (
                    <div>
                      <div className='row'>
                        {questionType === 'MCQ' ? <div className=" col-6 col-lg-6 col-sm-6 col-xl-6" style={{ marginLeft: '0.25rem' }}>
                          <label>Options<span className='required'></span></label>
                          <button type="button" data-toggle="tooltip" data-placement="top" title="Add more option" onClick={addOption.bind()} className="btn btn-outline-primary ml-1 border-0 rounded-circle"><i className="fa fa-plus-circle fa-1x " aria-hidden="true"></i></button>
                          <button type="button" data-toggle="tooltip" data-placement="top" title="Delete option" onClick={mcqRemoveOption.bind()} className="btn btn-outline-danger ml-1 border-0 rounded-circle"><i className="fa fa-minus-circle fa-1x" aria-hidden="true"></i></button>
                        </div> : null}
                      </div>
                      {(questionType === 'MCQ' || questionType === 'SQL') && createDynamicInput()}
                      {questionType !== 'Project' ? <div className='row' style={{ marginLeft: '0.25rem' }}> <div className=" col-6 col-lg-6 col-sm-6 col-xl-6">
                        <div className='row'>
                          <div className=" col-3 col-lg-3 col-sm-3 col-xl-3">
                            <label className="form-label text-input-label">Answer <span className='required'></span></label></div>
                          <div className=" col-9 col-lg-9 col-sm-9 col-xl-9">
                            {questionType === 'Fillups' || 'SQL' ? <textarea name="hint" className="profile-page"
                              value={questionType === 'SQL' ? questionObject.actualQuery : questionObject.answer}
                              onChange={(e) => handleChange(e, questionType === 'SQL' ? 'actualQuery' : 'answer')}
                              id="answer" placeholder="Enter the Answer" maxLength="1000" autoComplete="off" style={{ marginTop: '0px', marginBottom: '0px', height: '38px' }}></textarea> :
                              <select style={{ background: 'none' }} className='profile-page' required
                                value={questionObject.answer}
                                onChange={(e) => handleChange(e, 'answer')}>
                                <option hidden selected value="">Select answer</option>
                                {_.map(tempOptions, (el) => {
                                  return <option value={el.name}>{el.name}</option>;
                                })}
                              </select>}
                          </div></div>
                      </div> <div className="col-6 col-lg-6 col-sm-6 col-xl-6">
                          <div className='row'>
                            <div className="col-3 col-lg-3 col-sm-3 col-xl-3">
                              <label className="form-label text-input-label">Hint (optional)</label></div>
                            <div className="col-9 col-lg-9 col-sm-9 col-xl-9">
                              <textarea name="hint" className="profile-page"
                                value={questionObject.hint}
                                onChange={(e) => handleChange(e, 'hint')}
                                id="hint" placeholder="Enter the hint" maxLength="1000" autoComplete="off" style={{ marginTop: '0px', marginBottom: '0px', height: '38px' }}></textarea>
                            </div></div></div></div> : null}
                      <div className="col-md-12">
                        <label for="question"><strong>Status <span className='required'></span></strong></label>
                        <div className="custom-control custom-radio custom-control-inline ml-3 radio">
                          <input className="custom-control-input" id="active" type="radio" onChange={(e) => handleStatusChange(e, "status")}
                            value="ACTIVE" name="status" checked={status === "ACTIVE" || status === ""} />
                          <label className="custom-control-label" for="active" >  Active  </label>
                        </div>
                        <div className="custom-control custom-radio custom-control-inline ml-3 radio">
                          <input className="custom-control-input" id="inactive" type="radio" onChange={(e) => handleStatusChange(e, "status")}
                            value="INACTIVE" name="status" checked={status === "INACTIVE"} />
                          <label className="custom-control-label" for="inactive" >InActive </label>
                        </div>
                      </div>

                      <div className="mt-4" style={{ display: 'flex', justifyContent: 'flex-end', paddingLeft: '50rem' }}>
                        <div className="col-md-10">
                          <button type="submit" className="btn btn-primary">{action !== null ? 'Update ' : 'Add '} Question</button>
                          <Link className="btn btn-default" to={{ pathname: isRoleValidation() === "TEST_ADMIN" ? "/testadmin/question" : "/admin/questions", state: { difficulty: props.location?.state?.difficulty, section: props.location?.state?.section, questionType: props.location?.state?.questionType, status: props.location?.state?.status } }}>Back</Link>
                        </div>
                      </div>

                    </div>
                  ) : activeStep === 1 && questionObject.questionType === 'programming' &&
                  <div>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                      <Grid item xs={6}>
                        <div>
                          <div className='row'>
                            <div style={{ paddingTop: '30px', paddingBottom: '10px', paddingLeft: '10px' }}><h5>Code Stub</h5></div>
                          </div>
                          <div className='row' style={{ marginLeft: '8px', marginBottom: '10px' }}>
                            <div className='col-4 col-lg-4 col-sm-4 col-xl-4'>
                              <label>Function Name<span className='required' /></label>
                            </div>
                            <div className='col-3 col-lg-3 col-sm-3 col-xl-3'>
                              <div>
                                <input className="profile-page" value={questionObject.methodName} onChange={(e) => handleChange(e, 'methodName')} />
                                <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{functionNameError ?functionNameErrorMsg : null}</FormHelperText>
                              </div>
                            </div>
                          </div>
                          <div className='row' style={{ marginLeft: '8px', marginBottom: '10px' }}>
                            <div className='col-4 col-lg-4 col-sm-4 col-xl-4'>
                              <label>Return Type<span className='required' /></label>
                            </div>
                            <div className='col-3 col-lg-3 col-sm-3 col-xl-3'>
                              <div>
                                <select className='profile-page' required style={{ background: 'none' }}
                                  value={returnType}
                                  onChange={(e) => setProgramStub(e, 'returnType')}>
                                  <option hidden selected value="">Select Return Type</option>
                                  {_.map(dataTypes, (key, value) => {
                                    return <option value={key}>{key}</option>
                                  })}
                                </select>
                                <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{returnTypeError ? returnTypeErrorMsg : null}</FormHelperText>
                              </div>
                            </div>
                          </div>
                          <div className='row' style={{ marginLeft: '8px', marginBottom: '10px' }}>
                            <div className='col-5 col-lg-5 col-sm-5 col-xl-5'>
                              <div>
                                <label>Function Parameter<span className='required' /></label>
                                <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{parameterError ? parameterErrorMsg : null}</FormHelperText>
                              </div>
                            </div>
                            <div className='col-3 col-lg-3 col-sm-3 col-xl-3'>
                              <button type='button' className="btn btn-primary" onClick={addParameter.bind()}>Add</button>
                            </div>
                          </div>
                          {createDynamicAddingData()}
                          <div className='row' style={{ marginLeft: '10px', marginBottom: '10px' }}>
                            <div className='col-6 col-lg-6 col-sm-6 col-xl-6'>
                              <button type='button' className="btn btn-primary" onClick={() => generateProgramCode()}>Generate Code</button>
                            </div>
                          </div>
                        </div>
                      </Grid>
                      <Grid item xs={6}>
                        <div className='form-group col-lg-12 col-12 col-sm-12' style={{ height: "calc(100vh - 20vh)" }}>
                          <label className="form-label-select" style={{ marginLeft: '-30px' }}>Code</label>
                          <Box sx={{ width: '100%', typography: 'body1', height: '100%' }}>
                            <TabContext value={tabName}>
                              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleValueChange} aria-label="lab API tabs example" >
                                  <Tab label="Java" value="java" />
                                  <Tab label="Python" value="python" />
                                  <Tab label="C#" value="c#" />
                                </TabList>
                              </Box>
                              {_.map(userFunction, json => <>
                                <TabPanel value={json.value} style={{ height: '100%' }}>{renderAceEditor(json.key, json.mode)}</TabPanel>
                              </>)}
                            </TabContext>
                          </Box>
                          <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{questionError ? questionErrorMessage : null}</FormHelperText>
                        </div>
                      </Grid>
                    </Grid></div>}
                  {activeStep === 2 && (<div><div className='row'>
                    <div className=" col-6 col-lg-6 col-sm-6 col-xl-6">
                      <div>
                        <label>Add TestCase<span className='required'></span></label>
                        <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{testCaseError ? testCaseErrorMsg : null}</FormHelperText>
                      </div>
                    </div>
                  </div>
                    <DataGrid
                      columns={[
                        {
                          field: 'testCase', headerName: 'TestCase', flex: 1, editable: false
                        },
                        ...parameters.map(p => ({ field: p.name, headerName: p.name, flex: 1, editable: true, valueFormatter: (params) => params.row[p.name] ? params.row[p.name] : 'Enter param value', renderEditCell: (params) => <EditTextarea {...params} /> })),
                        {
                          field: 'output', headerName: 'Output', flex: 1, editable: true, valueFormatter: (params) => params.row['output'] ? params.row['output'] : 'Enter value', renderEditCell: (params) => <EditTextarea {...params} />
                        },
                      ]}
                      rows={_.map(testCase, (t, index) => ({
                        id: index,
                        testCase: `TestCase ${index + 1}`,
                        ...t.values,
                        output: t.output,
                      }))}
                      autoHeight={true}
                      disableSelectionOnClick
                      editable
                      hideFooter={true}
                      onCellKeyDown={handleCellKeyDown}
                      onEditCellPropsChange={handleTestCaseChange}
                      hideFooterPagination={true}
                      hideFooterRowCount={true}
                      disableColumnMenu={true}
                    />
                  </div>)}
                  {questionType === 'programming' && manualStructure ?
                    <>
                      <div className='row'> <div className=" col-6 col-lg-6 col-sm-6 col-xl-6">
                        <div className='row'>
                          <div className="col-3 col-lg-3 col-sm-3 col-xl-3">
                            <label className="form-label text-input-label"><b>Main class Name <span className='required'></span></b></label></div>
                          <div className="col-9 col-lg-9 col-sm-9 col-xl-9">
                            <input className="profile-page"
                              value={questionObject.mainClassName}
                              onChange={(e) => handleChange(e, 'mainClassName')}
                              id="hint" placeholder="Enter the class name" maxlength="30" autocomplete="off" style={{ marginTop: '0px', marginBottom: '0px', height: '38px' }} /></div>
                          <FormHelperText className="helper" style={{ paddingLeft: "10px" }}>{error.mainClassName ? error.mainClassNameErrorMsg : null}</FormHelperText>
                        </div></div></div>
                    </>
                    : null}
                  {activeStep === 3 || (manualStructure && questionObject.questionType === 'programming') ? (<div>
                    <Grid container spacing={2} style={{ marginBottom: '1rem' }}>
                      {_.map([{ key: "programmingHint", name: "Hint" }, { key: "pseudoCode", name: "Pseudocode" }], item => {
                        return <Grid item xs={6}>
                          <label className="form-label-select" style={{ marginLeft: '-9px' }} >{item.name}</label>
                          <TextareaAutosize minRows={10} maxRows={10} style={{ width: '100%', padding: '.7rem', backgroundColor: '#F8F8F8', borderColor: '#d1d1d1' }} onChange={(e) => handleHintChange(e, item.key)} value={questionObject[item.key]} />
                        </Grid>
                      })}
                    </Grid>
                    <div className="col-md-12">
                      <label for="question"><strong>Status <span className='required'></span></strong></label>
                      <div className="custom-control custom-radio custom-control-inline ml-3 radio">
                        <input className="custom-control-input" id="active" type="radio" onChange={(e) => handleStatusChange(e, "status")}
                          value="ACTIVE" name="status" checked={status === "ACTIVE" || status === ""} />
                        <label className="custom-control-label" for="active" >  Active  </label>
                      </div>
                      <div className="custom-control custom-radio custom-control-inline ml-3 radio">
                        <input className="custom-control-input" id="inactive" type="radio" onChange={(e) => handleStatusChange(e, "status")}
                          value="INACTIVE" name="status" checked={status === "INACTIVE"} />
                        <label className="custom-control-label" for="inactive" >InActive </label>
                      </div>
                    </div>
                    <div className="mt-4" style={{ display: 'flex', justifyContent: 'flex-end', paddingLeft: '50rem' }}>
                      <div className="col-md-10">
                        <button type="submit" className="btn btn-primary">{action !== null ? 'Update ' : 'Add '} Question</button>
                        <Link className="btn btn-default" to={{ pathname: isRoleValidation() === "TEST_ADMIN" ? "/testadmin/question" : "/admin/questions", state: { difficulty: props.location?.state?.difficulty, section: props.location?.state?.section, questionType: props.location?.state?.questionType, status: props.location?.state?.status } }}>Back</Link>
                      </div>
                    </div>
                  </div>) : null}
                  {questionType === 'programming' && manualStructure ? null :
                    <>
                      <Button disabled={activeStep === 0} onClick={handleBack} style={{ marginTop: '1rem' }}>Back</Button>
                      <Button variant="contained" color="primary" disabled={questionObject.questionType === 'programming' ? activeStep === 3 : activeStep === 1} style={{ marginTop: '1rem' }} onClick={handleNext}>Next</Button>
                    </>
                  }
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </>
  )
  }

export default AddQuestion