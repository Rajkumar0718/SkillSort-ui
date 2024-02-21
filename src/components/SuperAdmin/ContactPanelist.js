import axios from 'axios';
import React, { Component } from 'react';
// import CKEditor from "react-ckeditor-component";
import { authHeader, errorHandler } from '../../api/Api';
import { fallBackLoader, toastMessage } from '../../utils/CommonUtils';
import  url  from '../../utils/UrlConstant';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import styled from 'styled-components';
import { CKEditor } from '@ckeditor/ckeditor5-react';


const StyledCKEditorWrapper = styled.div`
  .ck-editor__editable {
    &.ck-rounded-corners.ck-editor__editable_inline.ck-focused {
      overflow-y: auto;
      height: 12rem;
    }
    &.ck-rounded-corners.ck-editor__editable_inline.ck-blurred {
      overflow-y: auto;
      height:  12rem;
    }
    
  }
  .ck .ck-editor__main {
    height: 206px !important;
}
`;
export default class ContactPanelist extends Component {
  state = {
    panelistName: '',
    loader: false,
    email: '',
    password: '',
    message: 'Reset your default Password by this Credentials using the below link',
    panelistId: '',
    token: '',
    subject: 'SKILL SORT OFFER CONFORMATION MAIL'
  }


  componentDidMount = () => {
    let token = localStorage.getItem("token");
    this.setState({
      email: this.props.panelist.sendData.email,
      password: this.props.panelist.sendData.password,
      panelistId: this.props.panelist.sendData.id,
      panelistName: this.props.panelist.sendData.userName,
      token: token,
    })


  }

  handleChange = (e, key) => {
    this.setState({ [key]: e.target.value });
  }

  handleSubmit = event => {
    this.setState({ loader: true });
    event.preventDefault();
    axios.post(`${url.ADMIN_API}/superadmin/recruiter/sendmail`, this.state, { headers: authHeader() })
      .then(res => {
        if (res.data.response.verifiedStatus === "VERIFIED") {
          this.setState({ loader: false });
          toastMessage('success', "Mail Sent Successfully");
          this.props.onCloseModal();
        }
      }).catch(error => {
        errorHandler(error);
      })
  }

  render() {
    return (
      <>
        <div>
          <div className="modal fade show" id="myModal" role="dialog" style={{ display: 'flex', justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.90)' }} aria-hidden="true">
            <div className="col-md-8" style={{ margin: '20px 16.6% 0% 16.6%' }}>
              {fallBackLoader(this.state.loader)}
              <div className="modal-content" style={{ borderStyle: 'solid', borderColor: '#af80ecd1', borderRadius: "32px" }}>
                <div className="modal-header" style={{ padding: "1rem 2rem 0 1.83rem", border: "none" }}>
                  <h5 className="setting-title" >Sending Invitation</h5>
                  <button type="button" onClick={this.props.onCloseModal} className="close" data-dismiss="modal">&times;</button>
                </div>
                <div className="modal-body" style={{ paddingTop: "5px" }}>
                  <div className='container'>
                    <form onSubmit={this.handleSubmit}>
                      <div className="form-row">
                        <div className='form-group col-12'>
                          <div><b>To : </b>{this.state.email}</div><hr></hr>
                          <label style={{ fontsize: '10px' }}>Subject</label>
                          <textarea name="mailMsg" className="form-control"
                            value={this.state.subject}
                            onChange={(e) => this.handleChange(e, 'subject')}
                            id="first" placeholder="Enter Subject" maxlength="300" autocomplete="off" style={{ marginTop: '0px', marginBottom: '0px', height: '50px' }} ></textarea>
                          <label>Message</label>

                          <StyledCKEditorWrapper>
                                <CKEditor
                                  editor={ClassicEditor}
                                  data={this.state.message || ""}
                                  onChange={ (e,editor) => this.setState({ message: editor.getData() })}
                                  onReady={(editor) => {
                                    const container = editor.ui.view.element;
                                    ClassicEditor.create(
                                      editor.editing.view.document.getRoot(),
                                      {
                                        removePlugins: ["Heading", "Link", "CKFinder"],
                                        toolbar: [
                                          "style",
                                          "bold",
                                          "italic",
                                          "bulletedList",
                                          "numberedList",
                                          "blockQuote",
                                        ],

                                      }
                                    )
                                      .then(() => {
                                        console.log("Editor is ready to use!", editor);
                                      })
                                      .catch((error) => {
                                        console.error(error);
                                      });
                                  }}
                                />
                                </StyledCKEditorWrapper>
                        </div>
                        <div className="col-md-11">
                          <button type="submit" style={{ float: "right" }} className="btn btn-sm btn-nxt" >Send Mail</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}