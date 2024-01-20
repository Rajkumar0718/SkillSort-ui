import React, { Component } from 'react';
import chrome from '../../assests/images/chrome.png';

export default class InstructionForCamera extends Component {
  render() {
    return (
      <div className="modal fade show" id="myModal" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.90)' }} aria-hidden="true">
        <div className="modal-dialog-full-width" style={{ margin: '1rem' }}>
          <div className="modal-content" style={{ borderStyle: 'solid', borderColor: '#af80ecd1', borderRadius: "15px", height: '95vh', verticalAlign: "center" }}>
            <div className="modal-header" style={{ border: 'none' }}>
              <h5 style={{ textAlign: "center", margin: "auto" }} className="setting-title" > Change a Sites's camera permissions </h5>
            </div>
            <ol style={{ paddingLeft: '3.5rem' }}>
              <li className='dash-text' style={{ marginTop: '1.5rem' }}>Open Chrome <img alt='chrome' width={20} src={chrome} ></img></li>
              <li className='dash-text' style={{ marginTop: '1.5rem' }}>At the top right, click More icon and then Settings.</li>
              <li className='dash-text' style={{ marginTop: '1.5rem' }}>Click Privacy and security and then Site settings. </li>
              <li className='dash-text' style={{ marginTop: '1.5rem' }}>In Recent activity section you can see the sites's name.</li>
              <li className='dash-text' style={{ marginTop: '1.5rem' }}>select the sites's name and change the camera permission to "Allow."</li>
            </ol>
            <h5 style={{ textAlign: "center", marginTop: '1rem' }} className="setting-title" >OR</h5>
            <ol style={{ paddingLeft: '3.5rem' }}>
              <li className='dash-text' style={{ marginTop: '1.5rem' }}>On the left of the Address bar in your browser, click the info icon <i className="fa fa-info-circle" aria-hidden="true"></i></li>
              <li className='dash-text' style={{ marginTop: '1.5rem' }}>Enable the camera.</li>
            </ol>
          </div>
        </div>
      </div>
    )
  }
}