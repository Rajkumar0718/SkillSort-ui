import FormHelperText from '@mui/material/FormHelperText';
import axios from 'axios';
import _ from 'lodash';
import React, { Component } from 'react';
import { authHeader, errorHandler } from '../../api/Api';
import { toastMessage } from '../../utils/CommonUtils';
import IndustryType from '../../utils/IndustryTypes';
import { isEmpty } from '../../utils/Validation';

export default class AddTechnologies extends Component {

    constructor() {
        super();
        this.state = {
            industryType: {
                name: '',
            },
            skillName: '',
            status: 'ACTIVE',
            disabled:false,
            error: {
                skillNameError: false,
                skillNameErrorMsg: ''
            }
        }
    }

    handleAddTechnology = (event, key) => {
        this.setState({ [key]: event.target.value });
    }

    handleSubmitAddSection = event => {
        const { error } = this.state;
        event.preventDefault();
        if (isEmpty(this.state.skillName?.trim())) {
            error.skillNameError = true;
            error.skillNameErrorMsg = "Enter Valid Input";
            this.setState({ error: error });
        } else {
            error.skillNameError = false;
            this.setState({ error: error });
        }
        if (this.state.skillName?.trim() !== '') {
            this.setState({disabled:true})
            axios.post(` /api1/skillset/save`, this.state, { headers: authHeader() })
                .then(() => {
                    if (this.props.modalSection.action === 'Update') {
                        toastMessage('success', "Technology Updated Successfully..!");
                        this.props.onCloseModal();
                    } else {
                        toastMessage('success', "Technology Added Successfully..!");
                        this.props.onCloseModalAdd();
                    }
                })
                .catch(err => {
                    this.setState({disabled:false})
                    errorHandler(err)
                })
        }
    }

    componentWillMount() {
        if (this.props.modalSection.action === 'Update') {
            this.setState(this.props.modalSection.section)
        }
    }

    oncheckBoxChange = (event) => {
        this.setState({ status: event.target.value === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' })
    }

    render() {
       return (
            <div className="modal fade show" id="myModal" role="dialog" style={{ display: 'flex', justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.90)' }} aria-hidden="true">
                <div className="modal-dialog" style={{ maxWidth: "670px", width: "625px" }}>
                    <div className="modal-content" style={{ borderStyle: 'solid', borderColor: '#af80ecd1', borderRadius: "32px" }}>
                        <div className="modal-header" style={{ padding: "1rem 2rem 0 3.85rem", border: "none" }}>
                            <h5 className="setting-title" >{this.props.modalSection.action} Technology</h5>
                            {this.props.modalSection.action === 'Update' ?
                                <button type="button" onClick={this.props.onCloseModal} className="close" data-dismiss="modal" style={{background:'none',border:'none'}}>&times;</button> :
                                <button type="button" onClick={this.props.onCloseModalAdd} className="close" data-dismiss="modal" style={{background:'none',border:'none'}}>&times;</button>}
                        </div>
                        <div className="modal-body"  style={{bottom:'1rem'}}>
                            <form onSubmit={this.handleSubmitAddSection}>
                                <div className="form-group row">
                                    <label className='col-md-3 col-sm-3 col-lg-3 col-form-label lable-text' for="question">Industry Type</label>
                                    <select className="form-control-mini" style={{  marginLeft: "6rem", width: '22.90rem',marginBottom:'1.5rem'}}
                                        value={this.state.industryType.name}
                                        required='true'
                                        onChange={(e) => this.setState({ industryType: { name: e.target.value } })}
                                    >
                                        <option hidden selected value="">Select Industry Type</option>
                                        {_.map(IndustryType, (industryType) => {
                                            return <option value={industryType}>{industryType}</option>
                                        })}
                                    </select>
                                </div>
                                <div className="form-group row">
                                    <label className="col-md-3 col-sm-3 col-lg-3 col-form-label lable-text" for="question">Technology</label>
                                    <input className="form-control-mini" required='true'  style={{  marginLeft: "6rem", width: '22.90rem',marginBottom:'1.5rem'}}
                                        onChange={(e) => this.setState({ skillName: e.target.value })}
                                        value={this.state.skillName}
                                        name='skillName' id='section' type="text" placeholder='Enter Technology' />
                                    <FormHelperText className="helper" style={{ paddingLeft: "0px", marginTop: "5px" }}>{this.state.error.skillNameError ? this.state.error.skillNameErrorMsg : null}</FormHelperText>
                                </div>
                                {this.props.modalSection.action === 'Update' ? < div className="form-group col-6" style={{ marginLeft: '2rem' }}>
                                    <div className="form-check ml-0">
                                        <input type="checkbox" value={this.state.status} onClick={this.oncheckBoxChange} checked={this.state.status === 'ACTIVE' ? true : false} className="form-check-input" id="exampleCheck1" />
                                        <label className="form-check-label" for="exampleCheck1">Active</label>
                                    </div>
                                </div> : ''}
                                <div className="form-group row">
                                    <div className="col-md-11">
                                        <button disabled={this.state.disabled} style={{ float: "right" }} type="submit" className="btn btn-sm btn-nxt">{this.props.modalSection.action}</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
