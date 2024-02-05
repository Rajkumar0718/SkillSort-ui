import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { authHeader, errorHandler } from '../../api/Api';
import { toastMessage } from '../../utils/CommonUtils';
import url from '../../utils/UrlConstant';

const AddSkills = (props) => {
    const [skill, setSkill] = useState({
        name: '',
        description: '',
        status: 'ACTIVE',
        sectionRoles: 'COMPETITOR'
    });

    const handleAddSkills = (event, key) => {
        setSkill({ ...skill, [key]: event.target.value });
    };

    const handleSubmitAddSection = (event) => {
        event.preventDefault();
        axios.post(`${url.ADMIN_API}/section/save`, skill, { headers: authHeader() })
            .then(res => {
                if (props.modalSection.action === 'Update') {
                    toastMessage('success', "Section Updated Successfully!");
                    setSkill({ name: '', description: '' });
                    props.onCloseModal();
                } else {
                    toastMessage('success', "Section Added Successfully..!");
                    props.onCloseModalAdd();
                }
            })
            .catch(error => {
                errorHandler(error);
            })
    };

    const oncheckBoxChange = (event) => {
        setSkill({ ...skill, status: event.target.value === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' });
    };

    useEffect(() => {
        if (props.modalSection.action === 'Update') {
            setSkill(props.modalSection.section);
        }
    }, [props.modalSection]);

    return (
        <div className="modal fade show" id="myModal" role="dialog" style={{ paddingRight: '15px', display: 'flex', justifyContent: 'center', alignItems: "center", backgroundColor: 'rgba(0,0,0,0.90)' }} aria-hidden="true">
            <div className="modal-dialog" style={{ maxWidth: "670px", width: "625px" }}>
                <div className="modal-content" style={{ borderStyle: 'solid', borderColor: '#af80ecd1', borderRadius: '32px' }}>
                    <div className="modal-header" style={{ padding: "2rem 2rem 0 2rem", border: 'none' }}>
                        <h5 className="setting-title" style={{ marginBottom: '0px' }}>{props.modalSection.action} Skills</h5>
                        {props.modalSection.action === 'Update' ?
                            <button type="button" onClick={props.onCloseModal} className="close" data-dismiss="modal">&times;</button> :
                            <button type="button" onClick={props.onCloseModalAdd} className="close" data-dismiss="modal">&times;</button>}
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmitAddSection}>
                            <div className="row">
                                <div className="form-group col-12">
                                    <div className='row'>
                                        <div className='col-4 col-sm-4 col-lg-4 col-md-4'>
                                            <label style={{ paddingLeft: '1rem' }} className='input-label' htmlFor="question">Skill</label>
                                        </div>
                                        <div className='col-8 col-sm-8 col-lg-8 col-md-8'>
                                            <input className="profile-page" style={{ width: '85%' }}
                                                onChange={(e) => handleAddSkills(e, 'name')}
                                                value={skill.name}
                                                name='name' id='section' autoFocus required='true' type="text" placeholder='Enter skill' /></div>
                                    </div>
                                </div>
                                <div className="form-group col-12">
                                    <div className='row'>
                                        <div className='col-4 col-sm-4 col-lg-4 col-md-4' >
                                            <label style={{ paddingLeft: '1rem', marginBottom: '0px' }} className='input-label' htmlFor="question">Description</label></div>
                                        <div className='col-8 col-sm-8 col-lg-8 col-md-8' >
                                            <input className="profile-page" style={{ width: '85%' }}
                                                onChange={(e) => handleAddSkills(e, 'description')}
                                                value={skill.description}
                                                name='section' id='section' type="text" placeholder='Enter description' /></div>
                                    </div>
                                </div>
                                {props.modalSection.action === 'Update' ? < div className="form-group col-6">
                                    <div className="form-check ml-0">
                                        <input type="checkbox" value={skill.status} onClick={oncheckBoxChange} checked={skill.status === 'ACTIVE' ? true : false} className="form-check-input" id="exampleCheck1" />
                                        <label className="form-check-label" htmlFor="exampleCheck1">Active</label>
                                    </div>
                                </div> : ''}
                            </div>
                            <div className="row">
                                <div className="col-md-11" style={{ paddingRight: '1.25rem' }}>
                                    <button style={{ float: 'right' }} type="submit" className="btn btn-sm btn-nxt">{props.modalSection.action}</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
       );
    }

export default AddSkills;
