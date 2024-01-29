import axios from 'axios';
import React, { Component } from 'react';
import Webcam from 'react-webcam';
import { authHeader, errorHandler } from '../../api/Api';
import { toastMessage } from '../../utils/CommonUtils';
import url from '../../utils/UrlConstant';
import { isRoleValidation } from '../../utils/Validation';
import InstructionForCamera from './InstructionForCamera';
import UnplugedModal from './UnplugedModal';
import withRouter from '../../common/withRouter';

class TakePicture extends Component {

  constructor(props) {
    super(props)
    this.state = {
      base64Image: '',
      screenShot: {},
      btnDisable: false,
      cameraAllowed: true,
      hasWebcam: true,
      cameraPrompt: false,
      isLoading: false,
      stateOfCamera: ''
    }
  }

  componentDidMount() {
    this.detectWebcam();
    this.cameraState = setInterval(() => {
      this.getCameraState();
      this.detectWebcam();
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.cameraState)
  }

  videoConstraints = {
    width: 1280,
    height: 800,
    facingMode: "user"
  };

  detectWebcam = () => {
    let md = navigator.mediaDevices;
    if (!md || !md.enumerateDevices) { this.setState({ hasWebcam: false }) }
    else {
      md.enumerateDevices().then(devices => {
        this.setState({ hasWebcam: devices.some(device => 'videoinput' === device.kind) });
      })
    }
  }

  getCameraState = () => {
    navigator.permissions.query({ name: 'camera' }).then(res => {
      this.setState({ stateOfCamera: res.state })
    })
  }

  sendProfile = async () => {
    await document.getElementById("camera").click();
    await this.detectWebcam();
    this.setState({ isLoading: true })
    const { screenShot } = this.state
    let user = JSON.parse(localStorage.getItem("user"))
    screenShot.id = {}
    screenShot.id.examId = localStorage.getItem("examId")
    screenShot.id.candidateId = user.id
    screenShot.profilePictureBase64 = this.state.base64Image
    if (this.state.stateOfCamera === 'granted' && this.state.hasWebcam) {
      axios.post(`${url.ADMIN_API}/onGoingExam/save-profile`, screenShot, { headers: authHeader() })
        .then(res => {
          if (res.data.response) {
            this.setState({ btnDisable: true, isLoading: false })
            if (localStorage.getItem('havingSql') === 'true') {
              isRoleValidation() === 'COLLEGE_STUDENT' ? this.props.history.push('/student/test/selectTech') : this.props.history.push('/competitor/test/selectTech')
              return
            }
            window.open(`${url.UI_URL}/candidateinstruction`, "", "width=1450px,height=900px")
            this.props.history.push(isRoleValidation() === 'COLLEGE_STUDENT' ? '/student/student-test' : isRoleValidation() === 'COMPETITOR' || isRoleValidation() === 'DEMO_ROLE' ? '/competitor/testList' : this.props.onCloseModal());
          } else {
            toastMessage('error', 'Face does not recognize')
            this.setState({ isLoading: false })
          }
        }).catch((error) => {
          errorHandler(error)
          this.setState({ isLoading: false, btnDisable: false })
        })
    } else {
      toastMessage('error', 'Please allow Camera to Take Test');
      this.setState({ isLoading: false })
    }
  }

  render() {
    return (
      <>
        {
          isRoleValidation() === 'COLLEGE_STUDENT' || isRoleValidation() === 'COMPETITOR' || isRoleValidation() === 'DEMO_ROLE' ?
            this.state.stateOfCamera === 'prompt' ?
              <div className='container' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                {<span className='dash-text'>Waiting for camera permission</span>}<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>
              </div> :
              <div style={{ textAlign: this.state.stateOfCamera === 'granted' ? 'center' : 'left', marginTop: '2.5rem' }}>
                <Webcam
                  mirrored={true}
                  screenshotQuality={100}
                  videoConstraints={this.videoConstraints}
                  style={{ height: '60vh' }}
                  muted={false}
                  screenshotFormat='image/jpeg'>
                  {({ getScreenshot }) => <div id="camera" onClick={() => {
                    this.setState({ base64Image: getScreenshot() }, () => console.log(this.state.base64Image));
                  }} />}
                </Webcam>
                {this.state.stateOfCamera === 'granted' && this.state.hasWebcam ?
                  <button disabled={this.state.btnDisable || this.state.isLoading} onClick={this.sendProfile} className='btn btn-sm btn-prev'>
                    Take Picture
                  </button> : null}
                {this.state.stateOfCamera === 'denied' && this.state.hasWebcam ? < InstructionForCamera /> : null}
                {!this.state.hasWebcam ? <UnplugedModal /> : null}
              </div>

            :
            <div className="modal fade show" id="myModal" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.90)' }} aria-hidden="true">
              <div className="modal-dialog-full-width" style={{ margin: '1rem' }}>
                <div className="modal-content" style={{ borderStyle: 'solid', borderColor: '#af80ecd1', borderRadius: "15px", height: '95vh', verticalAlign: "center", overflow: 'auto' }}>
                  <div className="modal-header" style={{ padding: "1rem", paddingBottom: "0rem", border: "none" }}>
                    <button type="button" onClick={this.props.onCloseModal} className="close" data-dismiss="modal">&times;</button>
                  </div>
                  <div className="modal-body" style={{ height: "calc(100vh - 150px)" }}>
                    {this.state.stateOfCamera === 'prompt' ?
                      <div className='container' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                        {<span className='dash-text'>Waiting for camera permission</span>}<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>
                      </div>
                      :
                      <div style={{ textAlign: this.state.stateOfCamera === 'granted' ? 'center' : 'left', marginTop: '2.5rem' }}>
                        <Webcam
                          mirrored={true}
                          screenshotQuality={100}
                          videoConstraints={this.videoConstraints}
                          style={{ height: '60vh' }}
                          muted={false}
                          screenshotFormat='image/jpeg'>
                          {({ getScreenshot }) => <div id="camera" onClick={() => {
                            this.setState({ base64Image: getScreenshot() }, () => console.log(this.state.base64Image));
                          }} />}
                        </Webcam>
                        {this.state.stateOfCamera === 'granted' && this.state.hasWebcam ?
                          <button disabled={this.state.btnDisable || this.state.isLoading} onClick={this.sendProfile} className='btn btn-sm btn-prev'>
                            Take Picture
                          </button> : null}
                        {this.state.stateOfCamera === 'denied' && this.state.hasWebcam ? < InstructionForCamera /> : null}
                        {!this.state.hasWebcam ? <UnplugedModal /> : null}
                      </div>}
                  </div>
                </div>
              </div>
            </div>
        }
      </>
    )
  }
}
export default withRouter(TakePicture)
