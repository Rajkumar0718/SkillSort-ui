import { TextareaAutosize } from '@mui/material';
import React from 'react';


function HintModal(props) {


  return (
    <>
      <div onClick={(e) => { props.onCloseModal(e) }} className="modal fade show" id="myModal" role="dialog" style={{ display: 'flex', justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.90)' }} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "665px", width: '665px' }}>
          <div className="modal-content" style={{ borderStyle: 'solid', borderColor: '#af80ecd1', borderRadius: "20px" }}>
            {props.currentHint ?
              <div className='modal-header' style={{ padding: "1rem", paddingBottom: "0rem", border: "none" }}>
                <span style={{ fontFamily: 'Baskervville', fontWeight: 400, fontSize: '1.7rem', paddingLeft: '1.5rem', width: '100%', color: '#3f51b5' }}>{props.type === 'hint' ? 'Logic' : 'Pseudocode'}</span>
                <button type="button" style={{border:'none',background:'none',padding:'none'}} onClick={(e) => { props.onCloseModal(e) }} className="close" data-dismiss="modal">&times;</button>
              </div> : null
            }
            <div className="modal-body" style={{ textAlign: 'center', padding: '1rem', height: props.currentHint ? '25rem' : null }}>
              {!props.currentHint ?
                <>
                  <h5 className='form-group' style={{ fontWeight: "400", color: "#000000" }}>
                    {`If you ${props.type === 'hint' ? 'take help in logic, 20%' : 'view pseudocode, 30%'} of marks will be reduced for this question. Do you still want to continue ?`}
                  </h5>
                  <div style={{ display: 'flex', justifyContent: 'center' }} >
                    <button style={{ marginRight: '1rem' }} onClick={() => props.getHint(props.type)}
                      className="btn btn-sm btn-prev" >Yes</button>
                    <button onClick={(e) => { props.onCloseModal(e) }}
                      className="btn btn-sm btn-nxt">Cancel</button>
                  </div></>
                :
                <div>
                  <TextareaAutosize readOnly={true} minRows={13} maxRows={13}
                    style={{ width: '100%', padding: '.7rem', backgroundColor: '#F8F8F8', borderColor: '#d1d1d1', border: 'none' }}
                    value={!props.isExam ? props.currentHint : props.currentHint[props.type]} />
                </div>
              }

            </div>
          </div>
        </div>
      </div>
    </>
  );

}

export default HintModal;