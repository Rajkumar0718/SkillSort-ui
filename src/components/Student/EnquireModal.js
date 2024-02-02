import React, { useEffect } from 'react';
// import MailOutlineTwoToneIcon from '@material-ui/icons/MailOutlineTwoTone';

const EnquireModal = ({ updateCredits }) => {

  return (
    <div className="modal fade show" id="myModal" role="dialog" style={{ paddingRight: '15px', display: 'flex', justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.90)' }} aria-hidden="true">
      <div className="modal-dialog" style={{ maxWidth: "600px" }}>
        <div className="modal-content" style={{ borderRadius: "32px", padding: "1rem 3rem" }}>
          <div style={{ textAlign: 'center', border: "none" }}>
            <div style={{ verticalAlign: 'middle' }}>
              <div style={{ fontSize: "1.5rem", margin: "1rem 0", color: "#3B489E" }}>Purchase Credits !!!</div>
              <div>You can always buy credits and write more to <br /> Improve your skills !!!...</div>
              <div className='test-package-card'>
                With this package, you are able to write<div style={{ fontSize: "4rem", color: "#F05A28" }}>3<div>more tests</div></div> in the programing section.
                <div style={{ fontSize: "2rem" }}>
                  <button type="button" className="btn" style={{ background: "#F05A28", color: 'white', border: 'none', fontSize: '13px' }}
                    onClick={updateCredits}>Buy Now</button>
                </div>
              </div>
            </div>
          </div>
          {/* <div style={{ textAlign: 'center', padding: '15px' }}>
            <MailOutlineTwoToneIcon/>&nbsp;admin@skillsort.in
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default EnquireModal;
