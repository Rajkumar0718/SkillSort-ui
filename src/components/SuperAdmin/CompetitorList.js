import React, { useState } from 'react';
import IndividualUserReportModal from './IndividualUserReportModal';
import StudentreportModal from './StudentreportModal';

const cards = [
  { name: 'Individual User', icon: 'fa fa-users' },
  { name: 'Student', icon: 'fa fa-graduation-cap' }
];

const CompetitorList = () => {
  const [loader, setLoader] = useState(false);
  const [showuserModal, setShowUserModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);

  const openModal = (key) => {
    if (key === 'Individual User') {
      setShowUserModal(true);
    } else {
      setShowStudentModal(true);
    }
  };

  const onCloseModal = (key) => {
    if (key === 'Individual User') {
      setShowUserModal(false);
    } else {
      setShowStudentModal(false);
    }
  };

  return (
    <div className="row" style={{ justifyContent: 'center' }}>
      {cards.map((c, idx) => (
        <div key={idx} className='col-12 col-lg-4 col-sm-6 col-xl-2 col-md-4 d-flex' style={{ flexDirection: "column" }}>
          <div className="home" style={{ backgroundColor: idx % 2 === 0 ? "#3B489E" : "#F05A28", textAlign: 'center' }}>
            <i onClick={() => openModal(c.name)} style={{ color: '#FFFFFF', fontSize: '5rem', cursor: 'pointer', marginTop: '2.3rem' }} className={c.icon} aria-hidden="true"></i>
          </div>
          <div onClick={() => openModal(c.name)} style={{ textAlign: 'center', cursor: 'pointer' }} className='dash-text'>{c.name}</div>
        </div>
      ))}
      {showuserModal && <IndividualUserReportModal onCloseModal={() => onCloseModal("Individual User")} />}
      {showStudentModal && <StudentreportModal onCloseModal={() => onCloseModal('Student')} />}
    </div>
  );
};

export default CompetitorList;
