import React, { Component } from 'react';
import unPlug from '../../assests/images/unplug.png';

export default class UnplugedModal extends Component {
  render() {
    return (
      <div className="modal fade show" id="myModal" role="dialog" style={{ display: 'flex', justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.90)' }} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "625px" }}>
          <div className="modal-content" style={{ borderStyle: 'solid', borderColor: '#af80ecd1', borderRadius: "32px" }}>
            <div className="modal-body" style={{ PaddingTop: "0px", width: '625px' }}>
              <div>
                <h5 className="setting-title" style={{ textAlign: "center", margin: "auto" }}>We can't find your camera</h5>
              </div>
              <div className="form-row">
                <div className="form-group col-12" style={{ textAlign: "center" }}>
                  <h5 className='setting-title' style={{ color: "#000000", marginTop: '1.5rem', fontSize: '1.5rem' }} >Check to be sure it's connected and installed properly. Please connect and reload a window.</h5>
                  <img alt='plug' width={150} src={unPlug} ></img>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}