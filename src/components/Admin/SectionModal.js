import axios from 'axios';
import React, { Component } from 'react';
import { authHeader, errorHandler } from '../../api/Api';
import { toastMessage } from '../../utils/CommonUtils';
import url from '../../utils/UrlConstant';

export default class SectionModal extends Component {

  state = {
    name: '',
    description: '',
    status: 'ACTIVE',
    sectionRoles: 'CANDIDATE',
    companyId: JSON.parse(localStorage.getItem('user')).companyId
  }

  handleAddSection = (event, key) => {
    this.setState({ [key]: event.target.value });
  }

  handleSubmitAddSection = event => {
    event.preventDefault();
    axios.post(` ${url.ADMIN_API}/section/save`, this.state, { headers: authHeader() })
      .then(_res => {
        if (this.props.modalSection.action === 'Update') {
          toastMessage('success', "Section Updated successfully!");
          this.setState({ name: '', description: '' });
          this.props.onCloseModal();
        } else {
          toastMessage('success', "Section Added Successfully..!");
          this.props.onCloseModalAdd();
        }
      })
      .catch(error => {
        errorHandler(error);
      })
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
      <div className="modal fade show" id="myModal" role="dialog" style={{ paddingRight: '15px', display: 'block', backgroundColor: 'rgba(0,0,0,0.4)' }} aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content" style={{ borderStyle: 'solid', borderColor: '#808080' }}>
            <div className="modal-header" style={{ backgroundColor: '#808080' }}>
              <h5 className="modal-title" style={{ color: 'white' }}>{this.props.modalSection.action} Section</h5>
              {this.props.modalSection.action === 'Update' ?
                <button type="button" onClick={this.props.onCloseModal} className="close" data-dismiss="modal">&times;</button> :
                <button type="button" onClick={this.props.onCloseModalAdd} className="close" data-dismiss="modal">&times;</button>}
            </div>
            <div className="modal-body">
              <form onSubmit={this.handleSubmitAddSection}>
                <div className="form-row">
                  <div className="form-group col-6">
                    <label for="question">Section</label>
                    <input className="form-control"
                      onChange={(e) => this.handleAddSection(e, 'name')}
                      value={this.state.name}
                      name='name' id='section' autoFocus required='true' type="text" placeholder='Enter section' />
                  </div>
                  <div className="form-group col-6">
                    <label for="question">Description</label>
                    <input className="form-control" required='true'
                      onChange={(e) => this.handleAddSection(e, 'description')}
                      value={this.state.description}
                      name='section' id='section' type="text" placeholder='Enter description' />
                  </div>
                  {this.props.modalSection.action === 'Update' ? < div className="form-group col-6">
                    <div className="form-check ml-0">
                      <input type="checkbox" value={this.state.status} onClick={this.oncheckBoxChange} checked={this.state.status === 'ACTIVE' ? true : false} className="form-check-input" id="exampleCheck1" />
                      <label className="form-check-label" for="exampleCheck1">Active</label>
                    </div>
                  </div> : ''}
                </div>
                <div className="form-group row">
                  <div className="col-md-10">
                    <button type="submit" className="btn btn-secondary">{this.props.modalSection.action}</button>
                  </div>
                </div>
              </form>
            </div>
            {/* <div className="modal-footer">
                            <button type="button" onClick={this.props.onCloseModal} className="btn btn-default" data-dismiss="modal">Close</button>
                        </div> */}
          </div>

        </div>
      </div>
    );
  }
}