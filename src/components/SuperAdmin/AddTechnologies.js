import React, { useState, useEffect } from 'react';
import { authHeader, errorHandler } from '../../api/Api';
import { toastMessage } from '../../utils/CommonUtils';
import { isEmpty } from '../../utils/Validation';
import axios from 'axios';
import _ from 'lodash';
import FormHelperText from '@material-ui/core/FormHelperText';

const AddTechnologies = ({ modalSection, onCloseModal, onCloseModalAdd }) => {
    const [industryType, setIndustryType] = useState({ name: '' });
    const [skillName, setSkillName] = useState('');
    const [status, setStatus] = useState('ACTIVE');
    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState({
        skillNameError: false,
        skillNameErrorMsg: '',
    });

    const handleAddTechnology = (event, key) => {
        setIndustryType({ ...industryType, [key]: event.target.value });
    };

    const handleSubmitAddSection = (event) => {
        event.preventDefault();
        const newError = { ...error };

        if (isEmpty(skillName?.trim())) {
            newError.skillNameError = true;
            newError.skillNameErrorMsg = 'Enter Valid Input';
            setError(newError);
        } else {
            newError.skillNameError = false;
            setError(newError);
        }

        if (skillName?.trim() !== '') {
            setDisabled(true);
            axios
                .post(`/api1/skillset/save`, { industryType, skillName, status }, { headers: authHeader() })
                .then(() => {
                    if (modalSection.action === 'Update') {
                        toastMessage('success', 'Technology Updated Successfully..!');
                        onCloseModal();
                    } else {
                        toastMessage('success', 'Technology Added Successfully..!');
                        onCloseModalAdd();
                    }
                })
                .catch((err) => {
                    setDisabled(false);
                    errorHandler(err);
                });
        }
    };

    useEffect(() => {
        if (modalSection.action === 'Update') {
            setIndustryType(modalSection.section);
        }
    }, [modalSection]);

    const oncheckBoxChange = (event) => {
        setStatus(event.target.value === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE');
    };

    return (
        <div className="modal fade show" id="myModal" role="dialog" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.90)' }} aria-hidden="true">
            <div className="modal-dialog" style={{ maxWidth: '670px', width: '625px' }}>
                <div className="modal-content" style={{ borderStyle: 'solid', borderColor: '#af80ecd1', borderRadius: '32px' }}>
                    <div className="modal-header" style={{ padding: '1rem 2rem 0 3.85rem', border: 'none' }}>
                        <h5 className="setting-title">{modalSection.action} Technology</h5>
                        {modalSection.action === 'Update' ? (
                            <button type="button" onClick={onCloseModal} className="close" data-dismiss="modal">
                                &times;
                            </button>
                        ) : (
                            <button type="button" onClick={onCloseModalAdd} className="close" data-dismiss="modal">
                                &times;
                            </button>
                        )}
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmitAddSection}>
                            <div className="form-group row">
                                <label className="col-md-3 col-sm-3 col-lg-3 col-form-label lable-text" htmlFor="question">
                                    Industry Type
                                </label>
                                <select
                                    className="form-control-mini"
                                    style={{ marginLeft: '2rem', width: '22.90rem', marginBottom: '10px' }}
                                    value={industryType.name}
                                    required={true}
                                    onChange={(e) => setIndustryType({ name: e.target.value })}
                                >
                                    <option hidden selected value="">
                                        Select Industry Type
                                    </option>
                                    {_.map(industryType, (industry) => (
                                        <option key={industry} value={industry}>
                                            {industry}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group row">
                                <label className="col-md-3 col-sm-3 col-lg-3 col-form-label lable-text" htmlFor="question">
                                    Technology
                                </label>
                                <input
                                    className="form-control-mini"
                                    required={true}
                                    style={{ marginLeft: '2rem', width: '22.90rem', paddingTop: '18px' }}
                                    onChange={(e) => setSkillName(e.target.value)}
                                    value={skillName}
                                    name="skillName"
                                    id="section"
                                    type="text"
                                    placeholder="Enter Technology"
                                />
                                <FormHelperText className="helper" style={{ paddingLeft: '0px', marginTop: '5px' }}>
                                    {error.skillNameError ? error.skillNameErrorMsg : null}
                                </FormHelperText>
                            </div>
                            {modalSection.action === 'Update' && (
                                <div className="form-group col-6" style={{ marginLeft: '2rem' }}>
                                    <div className="form-check ml-0">
                                        <input
                                            type="checkbox"
                                            value={status}
                                            onClick={oncheckBoxChange}
                                            checked={status === 'ACTIVE'}
                                            className="form-check-input"
                                            id="exampleCheck1"
                                        />
                                        <label className="form-check-label" htmlFor="exampleCheck1">
                                            Active
                                        </label>
                                    </div>
                                </div>
                            )}
                            <div className="form-group row">
                                <div className="col-md-11">
                                    <button disabled={disabled} style={{ float: 'right' }} type="submit" className="btn btn-sm btn-nxt">
                                        {modalSection.action}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default AddTechnologies;
