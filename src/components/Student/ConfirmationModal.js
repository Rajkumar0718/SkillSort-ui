import React from 'react';
import _ from 'lodash';

const ConfirmationModal = (props) => {
  return (
    <div onClick={props.close} className="modal fade show" id="myModal" role="dialog" style={{ paddingRight: '15px', display: 'flex', justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.90)' }} aria-hidden="true">
      <div className="modal-dialog" style={{ maxWidth: "670px", width: "550px" }} >
        <div className="modal-content" style={{ borderStyle: 'solid', borderColor: '#af80ecd1', borderRadius: "32px", height: '12rem' }}>
          <div style={{ textAlign: 'center', border: "none", marginTop: '1rem', height: '2rem' }}>
            <span className='setting-title'>Are you sure ?</span>
          </div>
          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '18px' }}>Do you want to update this candidate hiring status to</div>
          <div style={{ marginTop: '0.7rem', textAlign: 'center', fontSize: '18px', color: props.statusColor }}><b>{_.upperCase(props.status)}</b></div>
          <div style={{ textAlign: 'center', padding: '15px', marginTop: 'auto' }}>
            <button onClick={props.close} className='btn btn-sm btn-nxt'>cancel</button>
            <button onClick={props.updateCandidateStatus} style={{ marginLeft: '1rem' }} className='btn btn-sm btn-prev'>Confirm</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
