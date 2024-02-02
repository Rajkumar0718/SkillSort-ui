import axios from 'axios';
import React, { Component } from 'react';
import { authHeader, errorHandler } from '../../api/Api';
import { toastMessage } from '../../utils/CommonUtils';
import { url } from '../../utils/UrlConstant';
import "../Admin/AddExam.css";

export default class AddSectionModal extends Component {
    state = {
        name: '',
        description: '',
        status: 'ACTIVE',
        disabled:false,
        forGroupType:this.props.type==='Group',
    }

    handleAddSection = (event, key) => {
        this.setState({ [key]: event.target.value });
    }

    handleSubmitAddSection = (event) => {
        event.preventDefault()
        this.state.forGroupType ? this.addGroupType() : this.addSection()
    }

addSection=()=>{
    this.setState({disabled:true})
    axios.post(` ${url.ADMIN_API}/section/save`, this.state, { headers: authHeader() })
    .then(res => {
        if (this.props.modalSection.action === 'Update') {
            toastMessage('success', "Section Updated Successfully..!");
            this.setState({ name: '', description: '' });
            this.props.onCloseModal();
        } else {
            toastMessage('success', "Section Added Successfully..!");
            this.props.onCloseModalAdd();
        }
    })
    .catch(error => {
        this.setState({disabled:false})
        errorHandler(error);
    })
}

    addGroupType=()=>{
        this.setState({disabled:true})
        axios.post(` ${url.COLLEGE_API}/practiceExam/saveGroupType`, this.state, { headers: authHeader() })
        .then(res => {
            if (this.props.modalSection.action === 'Update') {
                toastMessage('success', "GroupType Updated Successfully..!");
                this.setState({ name: '', description: '' });
                this.props.onCloseModal();
            } else {
                toastMessage('success', "GroupType Added Successfully..!");
                this.props.onCloseModalAdd();
            }
        })
        .catch(error => {
            this.setState({disabled:false})
            errorHandler(error);
        })

    }

    componentWillMount() {
        if (this.props.modalSection.action === 'Update') {
            this.setState(this.props.modalSection.section)
            this.setState(this.props.modalSection.groupTypes)
        }
    }

    oncheckBoxChange = (event) => {
        this.setState({ status: event.target.value === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' })
    }

    render() {
        return (
            <div className="modal fade show" id="myModal" role="dialog" style={{ paddingRight: '15px', display: 'flex', justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.90)' }} aria-hidden="true">
                <div className="modal-dialog" style={{ width: "625px", maxWidth: "670px" }}>
                    <div className="modal-content" style={{ borderStyle: 'solid', borderColor: '#af80ecd1', borderRadius: "32px" }}>
                        <div className="modal-header" style={{ padding: "2rem 2rem 0 3.85rem", border: "none" }}>
                            <h5 className="setting-title">{this.props.modalSection.action} {this.state.forGroupType?'GroupType':'Section'}</h5>
                            {this.props.modalSection.action === 'Update' ?
                                <button type="button" onClick={this.props.onCloseModal} className="close" data-dismiss="modal" id='model-cross-button'>&times;</button> :
                                <button type="button" onClick={this.props.onCloseModalAdd} className="close" data-dismiss="modal" id='model-cross-button'>&times;</button>}
                        </div>
                        <div className="modal-body">
                            <form onSubmit={this.handleSubmitAddSection}>
                                <div>
                                    <label className='model-label' for="question" >{this.state.forGroupType?'GroupType':'Section'}<span className='required'></span></label>
                                    <input className='model-input' style={{marginBottom:'1.5rem'}}
                                        onChange={(e) => this.handleAddSection(e, 'name')}
                                        value={this.state.name}
                                        autoComplete="off"
                                        name='name' id='section' autoFocus required='true' type="text" placeholder={this.state.forGroupType?'Enter grouptype': 'Enter section' }/>
                                </div>
                                <div>
                                    <label className='model-label' for="question" >Description<span className='required'></span></label>
                                    <input className='model-input' required='true' style={{marginBottom:'1.5rem'}}
                                        onChange={(e) => this.handleAddSection(e, 'description')}
                                        value={this.state.description}
                                        autoComplete="off"
                                        name='section' id='section' type="text" placeholder='Enter description' />
                                </div>
                                {this.props.modalSection.action === 'Update' ? < div className="form-group col-6">
                                    <div className="form-check" style={{marginLeft: '2.2rem',paddingTop:'1rem'}}>
                                        <input type="checkbox" value={this.state.status} onClick={this.oncheckBoxChange} checked={this.state.status === 'ACTIVE' ? true : false} className="form-check-input" id="exampleCheck1" />
                                        <label className="form-check-label" for="exampleCheck1">Active</label>
                                    </div>
                                </div> : ''}
                                <div className="form-group row">
                                    <div className="col-md-11">
                                        <button disabled={this.state.disabled} type="submit" style={{ float: "right" }} className="btn btn-sm btn-nxt">{this.props.modalSection.action}</button>
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