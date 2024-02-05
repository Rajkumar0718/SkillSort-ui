import FormHelperText from '@mui/material/FormHelperText';
import axios from 'axios';
import { isEmpty } from 'lodash';
import React, { Component } from 'react';
import { authHeader, errorHandler } from '../../api/Api';
import { toastMessage } from '../../utils/CommonUtils';
import url from '../../utils/UrlConstant'

export default class SectionModal extends Component {
  constructor() {
    super();
    this.state = {
      departmentName: '',
      abbreviation: '',
      status: 'ACTIVE',
      disabled: false,

      error: {
        departmentName: false,
        departmentNameMsg: '',
        displayName: false,
        displayNameMsg: ''
      }
    }
  }


  handleAddSection = (event, key) => {
    const re = /^[A-Za-z ]+$/;
    if (event.target.value === "" || re.test(event.target.value)) {
      this.setState({ [key]: event.target.value });
    }
  }

  handleSubmitAddSection = event => {
    const { error } = this.state;
    event.preventDefault();
    if (isEmpty(this.state.departmentName?.trim())) {
      error.departmentName = true;
      error.departmentNameMsg = "Enter Valid Input";
      this.setState({ error: error });
    } else {
      error.departmentName = false;
      this.setState({ error: error });
    }
    if (isEmpty(this.state.abbreviation.trim())) {
      error.displayName = true;
      error.displayNameMsg = "Enter Valid Input"
      this.setState({ error: error });
    } else {
      error.displayName = false;
      this.setState({ error: error });
    }
    if (!this.state.error.departmentName && !this.state.error.displayName) {
      this.setState({ disabled: true })
      axios.post(` ${url.ADMIN_API}/department/save`, this.state, { headers: authHeader() })
        .then(res => {
          if (this.props.modalSection.action === 'Update') {
            toastMessage('success', "Department Updated Successfully..!");
            this.setState({ departmentName: '', description: '' });
            this.props.onCloseModal();
          } else {
            toastMessage('success', "Department Added Successfully..!");
            this.props.onCloseModalAdd();
          }
        })
        .catch(error => {
          this.setState({ disabled: false })
          errorHandler(error);
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
      <div className="modal fade show" id="myModal" role="dialog" style={{ paddingRight: '15px', display: 'flex', justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.90)' }} aria-hidden="true">
        <div className="modal-dialog" style={{ maxWidth: "670px", width: "625px" }} >
          <div className="modal-content" style={{ borderStyle: 'solid', borderColor: '#af80ecd1', borderRadius: "32px" }}>
            <div className="modal-header" style={{ padding: "1rem 2rem 0 3.85rem", border: "none" }}>
              <h5 className="setting-title" >{this.props.modalSection.action} Department</h5>
              {this.props.modalSection.action === 'Update' ?
                <button type="button" onClick={this.props.onCloseModal} className="close" data-dismiss="modal" id='model-cross-button'>&times;</button> :
                <button type="button" onClick={this.props.onCloseModalAdd} className="close" data-dismiss="modal" id='model-cross-button'>&times;</button>}
            </div>
            <div className="modal-body">
              <form onSubmit={this.handleSubmitAddSection}>
                <div>
                  <label for="question" className='model-label'>Department Name</label>
                  <input required='true' className='model-input'
                    onChange={(e) => this.handleAddSection(e, 'departmentName')}
                    value={this.state.departmentName}
                    autoComplete='off'
                    name='departmentName' autoFocus type="text" placeholder='Enter Department'/>
                  <FormHelperText className="helper" style={{ paddingLeft: "0px", marginTop: "5px" }}>{this.state.error.departmentName ? this.state.error.departmentNameMsg : null}</FormHelperText>
                </div>
                <div style={{ marginTop: "1.5rem" }}>
                  <label for="question" className='model-label'>Display Name</label>
                  <input required='true' className='model-input'
                    onChange={(e) => this.handleAddSection(e, 'abbreviation')}
                    value={this.state.abbreviation}
                    name='abbreviation' type="text" placeholder='Enter display name'/>
                  <FormHelperText className="helper" style={{ paddingLeft: "0px", marginTop: "5px" }}>{this.state.error.displayName ? this.state.error.displayNameMsg : null}</FormHelperText>
                </div>
                {this.props.modalSection.action === 'Update' ? < div className="form-group col-6" style={{ marginLeft: '2rem', marginTop: '1rem' }}>
                  <div className="form-check ml-0">
                    <input type="checkbox" value={this.state.status} onClick={this.oncheckBoxChange} checked={this.state.status === 'ACTIVE' ? true : false} className="form-check-input" id="exampleCheck1" />
                    <label className="form-check-label" for="exampleCheck1">Active</label>
                  </div>
                </div> : ''}
                <div className="form-group row">
                  <div className="col-md-11" style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
                    <div style={{ float: "right" }}>
                      <button type="submit" disabled={this.disabled} className="btn btn-sm btn-nxt">{this.props.modalSection.action}</button>
                    </div>
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










