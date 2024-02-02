import { useState, useEffect } from 'react';
import { FormHelperText } from '@mui/material';
import axios from 'axios';
import _ from 'lodash';
import { authHeader, errorHandler } from '../../api/Api';
import { toastMessage } from '../../utils/CommonUtils';
import IndustryType from '../../utils/IndustryTypes';
import { isEmpty } from '../../utils/Validation';

const AddTechnologies = (props) => {
    const [state, setState] = useState({
        industryType: {
            name: '',
        },
        skillName: '',
        status: 'ACTIVE',
        disabled: false,
        error: {
            skillNameError: false,
            skillNameErrorMsg: ''
        }
    });

    const handleAddTechnology = (event, key) => {
        setState((prev) => ({ ...prev, [key]: event.target.value }));
    };

    const handleSubmitAddSection = (event) => {
        const { error } = state;
        event.preventDefault();

        if (isEmpty(state.skillName?.trim())) {
            error.skillNameError = true;
            error.skillNameErrorMsg = "Enter Valid Input";
            setState((prev) => ({ ...prev, error }));
        } else {
            error.skillNameError = false;
            setState((prev) => ({ ...prev, error }));
        }

        if (state.skillName?.trim() !== '') {
            setState((prev) => ({ ...prev, disabled: true }));

            axios.post(`/api1/skillset/save`, state, { headers: authHeader() })
                .then(() => {
                    if (props.modalSection.action === 'Update') {
                        toastMessage('success', "Technology Updated Successfully..!");
                        props.onCloseModal();
                    } else {
                        toastMessage('success', "Technology Added Successfully..!");
                        props.onCloseModalAdd();
                    }
                })
                .catch((err) => {
                    setState((prev) => ({ ...prev, disabled: false }));
                    errorHandler(err);
                });
        }
    };

    useEffect(() => {
        if (props.modalSection.action === 'Update') {
            setState(props.modalSection.section);
        }
    }, [props.modalSection]);

    const oncheckBoxChange = (event) => {
        setState((prev) => ({ ...prev, status: event.target.value === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }));
    };

    return (
        <div className="modal fade show" id="myModal" role="dialog" style={{ display: 'flex', justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.90)' }} aria-hidden="true">
            <div className="modal-dialog" style={{ maxWidth: "670px", width: "625px" }}>
                <div className="modal-content" style={{ borderStyle: 'solid', borderColor: '#af80ecd1', borderRadius: "32px" }}>
                    <div className="modal-header" style={{ padding: "1rem 2rem 0 3.85rem", border: "none" }}>
                        <h5 className="setting-title" >{props.modalSection.action} Technology</h5>
                        {props.modalSection.action === 'Update' ?
                            <button type="button" onClick={props.onCloseModal} className="close" data-dismiss="modal" style={{ background: 'none', border: 'none', padding: '0 1rem 0 0 !important', fontSize: '3rem ', color: '#F05A28' }}>&times;</button> :
                            <button type="button" onClick={props.onCloseModalAdd} className="close" data-dismiss="modal" style={{ background: 'none', border: 'none', padding: '0 1rem 0 0 !important', fontSize: '3rem ', color: '#F05A28' }}>&times;</button>}
                    </div>
                    <div className="modal-body" style={{ bottom: '1rem' }}>
                        <form onSubmit={handleSubmitAddSection}>
                            <div className="form-group row">
                                <label className='col-md-3 col-sm-3 col-lg-3 col-form-label lable-text' htmlFor="question">Industry Type</label>
                                <select className="form-control-mini" style={{ marginLeft: "6rem", width: '22.90rem', marginBottom: '1.5rem' }}
                                    value={state.industryType.name}
                                    required='true'
                                    onChange={(e) => setState((prev) => ({ ...prev, industryType: { name: e.target.value } }))}
                                >
                                    <option hidden selected value="">Select Industry Type</option>
                                    {_.map(IndustryType, (industryType) => (
                                        <option key={industryType} value={industryType}>{industryType}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group row">
                                <label className="col-md-3 col-sm-3 col-lg-3 col-form-label lable-text" htmlFor="question">Technology</label>
                                <input className="form-control-mini" required='true' style={{ marginLeft: "6rem", width: '22.90rem', marginBottom: '1rem' }}
                                    onChange={(e) => setState((prev) => ({ ...prev, skillName: e.target.value }))}
                                    value={state.skillName}
                                    name='skillName' id='section' type="text" placeholder='Enter Technology' />
                                <FormHelperText className="helper" style={{ paddingLeft: "0px", marginTop: "5px" }}>{state.error.skillNameError ? state.error.skillNameErrorMsg : null}</FormHelperText>
                            </div>
                            {props.modalSection.action === 'Update' ? < div className="form-group col-6" style={{ marginLeft: '2rem' }}>
                                <div className="form-check ml-0">
                                    <input type="checkbox" value={state.status} onClick={oncheckBoxChange} checked={state.status === 'ACTIVE'} className="form-check-input" id="exampleCheck1" />
                                    <label className="form-check-label" htmlFor="exampleCheck1">Active</label>
                                </div>
                            </div> : ''}
                            <div className="form-group row">
                                <div className="col-md-11">
                                    <button disabled={state.disabled} style={{ float: "right" }} type="submit" className="btn btn-sm btn-nxt">{props.modalSection.action}</button>
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