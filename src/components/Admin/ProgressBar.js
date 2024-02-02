import Chip from '@mui/material/Chip';
import React from "react";


const ProgressBar = ({ bgColor, barColor, borderRadius, margin, progress, height, width, value, unit, fontWeight, count, baseCount }) => {
  const Parentdiv = {
    height: height + 'px',
    width: '100%',
    backgroundColor: 'red',
    borderRadius: borderRadius + 'px',
    margin: margin + 'px',
    // backgroundColor: bgColor,
  }

  const Childdiv = {
    height: height + 'px',
    width: `${progress}%`,
    backgroundColor: barColor,
    borderRadius: borderRadius + 'px',
    textAlign: 'right'
  }

  // const progresstext = {
  //   padding: '5%',
  //   color: 'black',
  //   fontWeight: fontWeight
  // }

  const chip = {
    paddingRight: '15px',
    paddingLeft: '15px',
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: '#6db3c9',
  }

  // const box = { paddingBottom: '10px', }

  return (
    <>
      <div className='row' style={{ paddingBottom: '10px' }}>
        <div className='col-lg-8'>
          <div style={Parentdiv}>
            <div style={Childdiv}>
            </div>
          </div>
        </div>
        <div className='col-lg-3'>
        <Chip style={chip} color="primary" label={value} />
        </div>
      </div>
    </>
  );
}

export default ProgressBar;
