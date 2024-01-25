// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toastMessage } from '../../utils/CommonUtils';
// import { isEmpty } from "../../utils/Validation";
// import { url } from '../../utils/UrlConstant';
// import { authHeader, errorHandler } from '../../api/Api';
// import AddSkills from './AddSkills';
// import FormHelperText from '@mui/material/FormHelperText'
// import _ from 'lodash';
// import { Link } from 'react-router-dom';

// const AddQuestion = (props) => {
//     const [maxOption, setMaxOption] = useState(2);
//     const [tempOptions, setTempOptions] = useState([
//         { name: 'A', value: '' },
//         { name: 'B', value: '' }
//     ]);
//     const [sectionRoles, setSectionRoles] = useState('COMPETITOR');
//     const [selectDifficulty, setSelectDifficulty] = useState(['SIMPLE', 'MEDIUM', 'COMPLEX']);
//     const [selectSection, setSelectSection] = useState([]);
//     const [questionType, setQuestionType] = useState(['MCQ', 'True/False', 'Programming']);
//     const [competitorQuestionType, setCompetitorQuestionType] = useState(['MOCK', 'ACTUAL']);
//     const [isTimeBased, setIsTimeBased] = useState(false);
//     const [status, setStatus] = useState("ACTIVE");
//     const [openModal, setOpenModal] = useState(false);
//     const [questionObject, setQuestionObject] = useState({
//         section: "",
//         questionType: '',
//         difficulty: "",
//         question: "",
//         options: [],
//         hint: "",
//         answer: '',
//         openModal: false,
//         status: "ACTIVE",
//         questionRoles: 'COMPETITOR',
//         competitorQuestionType: ''
//     });
//     const [questionError, setQuestionError] = useState(false);
//     const [questionErrorMessage, setQuestionErrorMessage] = useState('Field Required !');

//     useEffect(() => {
//         if (props.location.pathname.indexOf('edit') > -1) {
//             const { questions } = props.location.state;
//             setTempOptions(questions.options);
//             setStatus(questions.status);
//             setQuestionObject({
//                 id: questions.id,
//                 section: questions.section,
//                 questionType: questions.questionType,
//                 difficulty: questions.difficulty,
//                 question: questions.question,
//                 options: questions.options,
//                 hint: questions.hint,
//                 answer: questions.answer,
//                 status: questions.status
//             });
//         }
//         initialCall();
//     }, [props.location.pathname, props.location.state]);

//     const initialCall = () => {
//         axios.get(` ${url.ADMIN_API}/section/list?status=${'ACTIVE'}&page=${1}&size=${100}&sectionRoles=${sectionRoles}`, { headers: authHeader() })
//             .then(res => {
//                 let selectSection = [];
//                 for (let key in res.data.response.content) {
//                     selectSection.push(res.data.response.content[key]['name']);
//                 }
//                 setSelectSection(selectSection);
//             }).catch(error => {
//                 errorHandler(error);
//             });
//     };

//     const handleChange = (e, key) => {
//         if (key === 'question') {
//             const updatedQuestionObject = { ...questionObject, [key]: e.editor.getData() };
//             setQuestionObject(updatedQuestionObject);
//         } else {
//             const updatedQuestionObject = { ...questionObject, [key]: e.target.value };
//             setQuestionObject(updatedQuestionObject);
//             if (e.target.value === 'True/False') {
//                 setMaxOption(2);
//             }
//             if (e.target.value === 'MCQ') {
//                 setMaxOption(5);
//             }
//         }
//     };

//     const handleStatusChange = (e, key) => {
//         setStatus(e.target.value);
//     };

//     const handleOptionChange = (i, e) => {
//         const { name, value } = e.target;
//         let newTempOptions = [...tempOptions];
//         newTempOptions[i] = { ...newTempOptions[i], [name]: value };
//         setTempOptions(newTempOptions);
//     };

//     const handleSubmit = (event) => {
//         event.preventDefault();
//         let updatedQuestionError = false;
//         let updatedQuestionErrorMessage = '';

//         if (isEmpty(questionObject.question)) {
//             updatedQuestionError = true;
//             updatedQuestionErrorMessage = 'Field Required !';
//         }

//         setQuestionError(updatedQuestionError);
//         setQuestionErrorMessage(updatedQuestionErrorMessage);

//         if (!updatedQuestionError) {
//             const updatedQuestionObject = { ...questionObject };
//             updatedQuestionObject.options = tempOptions;
//             updatedQuestionObject.status = status;

//             axios.post(`${url.ADMIN_API}/question/save`, updatedQuestionObject)
//                 .then((res) => {
//                     if (props.location.pathname.indexOf('edit') > -1) {
//                         toastMessage('success', 'Question Updated Successfully..!');
//                         props.history.push('/superadmin/question/list');
//                     } else {
//                         toastMessage('success', 'Question Added Successfully..!');
//                     }
//                 })
//                 .catch((error) => {
//                     // Handle error
//                 });

//             resetQuestionForm();
//         }
//     };

//     const resetQuestionForm = () => {
//         setStatus('ACTIVE');
//         setTempOptions([{ name: 'A', value: '' }, { name: 'B', value: '' }]);
//         setQuestionObject({
//             section: '',
//             questionType: '',
//             difficulty: '',
//             question: '',
//             options: [],
//             hint: '',
//             answer: '',
//             openModal: false,
//             status: 'ACTIVE',
//             questionRoles: 'COMPETITOR',
//             competitorQuestionType: ''
//         });
//     };

//     const addOption = () => {
//         if (tempOptions.length < maxOption) {
//             setTempOptions((prevTempOptions) => [
//                 ...prevTempOptions,
//                 {
//                     name: String.fromCharCode(prevTempOptions[prevTempOptions.length - 1].name.charCodeAt(0) + 1),
//                     value: ''
//                 }
//             ]);
//         }
//     };

//     const removeOption = () => {
//         if (tempOptions?.length > 2) {
//             let newTempOptions = [...tempOptions];
//             newTempOptions.pop();
//             setTempOptions(newTempOptions);
//         }
//     };

//     const createDynamicInput = () => {
//         return tempOptions.map((el, i) => (
//             <div className="form-group col-md-6" key={i}>
//                 <label className="form-label-select">{el.name}</label>
//                 <input
//                     className="form-control-select"
//                     required
//                     autoComplete="off"
//                     placeholder={'option-' + el.name}
//                     name="value"
//                     value={el.value || ''}
//                     onChange={(e) => handleOptionChange(i, e)}
//                 />
//             </div>
//         ));
//     };

//     const onClickOpenModel = () => {
//         if (!openModal) {
//             document.addEventListener('click', handleOutsideClick, false);
//         } else {
//             document.removeEventListener('click', handleOutsideClick, false);
//         }
//         setOpenModal(!openModal);
//     };

//     const initialcall=()=>{
//         axios.get(` ${url.ADMIN_API}/section/list?status=${'ACTIVE'}&page=${1}&size=${100}&sectionRoles=${sectionRoles}`, { headers: authHeader() })
//         .then(res => {
//             let selectSection = [];
//             for (let key in res.data.response.content) {
//                 selectSection.push(res.data.response.content[key]['name']);
//             }
//             setSelectSection(selectSection);
//         }).catch(error => {
//             errorHandler(error);
//         })
//     }

//     const handleOutsideClick = (e) => {
//         if (e.target.className === 'modal fade show') {
//             setOpenModal(!openModal);
//             initialcall();
//         }
//     };

//     const onCloseModal = () => {
//         setOpenModal(!openModal);
//         initialcall();
//     };

//     const component = (props) => {
//         const { questionObject } = props.state;
//         let action = null;
    
//         if (props.location.pathname.indexOf('edit') > -1) {
//             action = props.location.state;
//         }
    
//         return (
//             <>
//                 {openModal ? <AddSkills modalSection={{ action: 'Add' }} onCloseModal={onCloseModal} /> : ''}
//                 <main className="main-content bcg-clr">
//                     <div>
//                         <div className="container-fluid cf-1">
//                             <div className="card-header-new">
//                                 <span>
//                                     {action !== null ? 'Update' : 'Add'} Question
//                                 </span>
//                             </div>
//                             <div className="row">
//                                 <div className="col-md-12">
//                                     <div className="table-border-cr">
//                                         <form onSubmit={handleSubmit}>
//                                             <div className="form-row">
//                                                 <div className="form-group col-3">
//                                                     <label className="form-label-select">Section <span className='required'></span></label>
//                                                     <button type="button" onClick={onClickOpenModel} style={{ marginTop: '-5px' }} data-toggle="tooltip" data-placement="top" title="Add Section" className="btn btn-outline-primary ml-1 border-0 rounded-circle"><i className="fa fa-plus-circle fa-1x " aria-hidden="true"></i></button>
//                                                     <select className='form-control-select' required name='section'
//                                                         value={questionObject.section}
//                                                         onChange={(e) => handleChange(e, 'section')}>
//                                                         <option hidden selected value="">Select section</option>
//                                                         {_.map(selectSection, (key, value) => {
//                                                             return <option value={key}>{key}</option>
//                                                         })}
//                                                     </select>
//                                                 </div>
//                                                 <div className="form-group col-3">
//                                                     <label className="form-label-select" >Difficulty <span className='required'></span></label>
//                                                     <select className='form-control-select' required name="difficulty"
//                                                         value={questionObject.difficulty}
//                                                         onChange={(e) => handleChange(e, 'difficulty')}
//                                                     >
//                                                         <option hidden selected value="">Select difficulty</option>
//                                                         {_.map(selectDifficulty, (key, value) => {
//                                                             return <option value={key}>{key}</option>
//                                                         })}
//                                                     </select>
//                                                 </div>
//                                                 <div className="form-group col-3">
//                                                     <label className="form-label-select">Question Type <span className='required'></span></label>
//                                                     <select className='form-control-select' required
//                                                         value={questionObject.questionType}
//                                                         onChange={(e) => handleChange(e, 'questionType')}>
//                                                         <option hidden selected value="">Select Question Type</option>
//                                                         {_.map(questionType, (key, value) => {
//                                                             return <option value={key}>{key}</option>
//                                                         })}
//                                                     </select>
//                                                 </div>
//                                                 <div className="form-group col-3">
//                                                     <label className="form-label-select">Mock/Actual </label>
//                                                     <select className='form-control-select' required
//                                                         value={questionObject.competitorQuestionType}
//                                                         onChange={(e) => handleChange(e, 'competitorQuestionType')}>
//                                                         <option hidden selected value="">Select Question Type</option>
//                                                         {_.map(competitorQuestionType, (key, value) => {
//                                                             return <option value={key}>{key}</option>
//                                                         })}
//                                                     </select>
//                                                 </div>
//                                                 <div className="form-group col-12">
//                                                     <label className="form-label-select">Question <span className='required'></span>
//                                                         <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{questionError ? questionErrorMessage : null}</FormHelperText></label>                     
//                                                     <CKEditor
//                                                         content={questionObject.question}
//                                                         events={{
//                                                             "change": data => handleChange(data, 'question')
//                                                         }}
//                                                         config={{
//                                                             removePlugins: 'elementspath',
//                                                             resize_enabled: false
//                                                         }}
//                                                     />
//                                                 </div>
//                                                 <div className="form-group col-6">
//                                                     <label>Options: <span className='required'></span></label>
//                                                     <button type="button" data-toggle="tooltip" data-placement="top" title="Add more option" onClick={addOption} className="btn btn-outline-primary ml-1 border-0 rounded-circle"><i className="fa fa-plus-circle fa-1x " aria-hidden="true"></i></button>
//                                                     <button type="button" data-toggle="tooltip" data-placement="top" title="Delete option" onClick={removeOption} className="btn btn-outline-danger ml-1 border-0 rounded-circle"><i className="fa fa-minus-circle fa-1x" aria-hidden="true"></i></button>
//                                                 </div>
//                                                 <div className="form-group col-6">
                     
//                                                 </div>
//                                                 {createDynamicInput()}
//                                                 <div className="form-group col-6">
//                                                     <label className="form-label-select">Answer </label>
//                                                     <select className='form-control-select' required
//                                                         value={questionObject.answer}
//                                                         onChange={(e) => handleChange(e, 'answer')}>
//                                                         <option hidden selected value="">Select answer</option>
//                                                         {_.map(tempOptions, (el) => {
//                                                             return <option value={el.name}>{el.name}</option>
//                                                         })}
//                                                     </select>
//                                                 </div>
//                                                 <div className='form-group col-6'>
//                                                     <label className="form-label-select">Hint (optional)</label>
//                                                     <textarea name="hint" className="form-control-select"
//                                                         value={questionObject.hint}
//                                                         onChange={(e) => handleChange(e, 'hint')}
//                                                         id="hint" placeholder="Enter the hint" maxlength="1000" autocomplete="off" style={{ marginTop: '0px', marginBottom: '0px', height: '38px' }} ></textarea>
//                                                 </div>
//                                                 <div className="col-md-12">
//                                                     <label for="question"><strong>Status</strong></label>
//                                                     <div className="custom-control custom-radio custom-control-inline ml-3 radio">
//                                                         <input className="custom-control-input" id="active" type="radio" onChange={(e) => handleStatusChange(e, "status")}
//                                                             value="ACTIVE" name="status" checked={status === "ACTIVE" || status === ""} />
//                                                         <label className="custom-control-label" for="active" >  Active </label>
//                                                     </div>
//                                                     <div className="custom-control custom-radio custom-control-inline ml-3 radio">
//                                                         <input className="custom-control-input" id="inactive" type="radio" onChange={(e) => handleStatusChange(e, "status")}
//                                                             value="INACTIVE" name="status" checked={status === "INACTIVE"} />
//                                                         <label className="custom-control-label" for="inactive" >  InActive </label>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="mt-4">
//                                                 <div className="col-md-10">
//                                                     <button type="submit" className="btn btn-primary">{action !== null ? 'Update ' : 'Add '} Question</button>
//                                                     <Link className="btn btn-default" to="/superadmin/question/list">Cancel</Link>
//                                                 </div>
//                                             </div>
//                                         </form>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </main>
//             </>
//         );
//     }
// }
// export default AddQuestion; 

import React from 'react'

function AddQuestion() {
  return (
    <div>AddQuestion</div>
  )
}

export default AddQuestion
