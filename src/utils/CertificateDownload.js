import React, { useRef, useEffect, useState } from 'react';
import advanceLevel from '../../src/assests/images/AdvancedLevel.png';
import basicLevel from '../../src/assests/images/BasicLevel.png';
import { upperCase } from 'lodash';
import html2canvas from 'html2canvas';
import goldMedal from '../../src/assests/images/goldmedalCertificate.png';
import silverMedal from '../../src/assests/images/silvermedalCertificate.png';
import { styled } from '@mui/system';


const BasicLevelContainer = styled('div')({
  width: '650px',
  height: '450px',
  transform: 'translate(0%, 0%)',
  backgroundImage: `url(${basicLevel})`,
  backgroundRepeat: 'no-repeat',
  backgroundAttachment: 'fixed',
  backgroundSize: 'cover',
});

const AdvanceLevelContainer = styled('div')({
  width: '650px',
  height: '450px',
  transform: 'translate(0%, 0%)',
  backgroundImage: `url(${advanceLevel})`,
  backgroundRepeat: 'no-repeat',
  backgroundAttachment: 'fixed',
  backgroundSize: 'cover',
});

const BasicLevelBody = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  position: 'absolute',
  top: '6%',
  left: '47%',
  height: '25%',
  fontFamily: 'Verdana, Tahoma, sans-serif',
});

const AdvanceLevelBody = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  position: 'absolute',
  top: '34%',
  left: '47%',
  height: '25%',
  fontFamily: 'Verdana, Tahoma, sans-serif',
});

const PracticeGoldContainer = styled('div')({
  width: '700px',
  height: '700px',
  transform: 'translate(0%, 0%)',
  backgroundImage: `url(${goldMedal})`,
  backgroundRepeat: 'no-repeat',
  backgroundAttachment: 'fixed',
  backgroundSize: 'cover',
});

const PracticeSilverContainer = styled('div')({
  width: '700px',
  height: '700px',
  transform: 'translate(0%, 0%)',
  backgroundImage: `url(${silverMedal})`,
  backgroundRepeat: 'no-repeat',
  backgroundAttachment: 'fixed',
  backgroundSize: 'cover',
});

const PracticeBody = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  position: 'absolute',
  top: '75%',
  left: '39.5%',
  height: '25%',
  fontFamily: 'Verdana, Tahoma, sans-serif',
  fontSize: '1.5rem',
});

const CertificateDownload = ({ name, classes, certificateType, onImageReceived }) => {
  const basicCertificateRef = useRef(null);
  const advanceCertificateRef = useRef(null);
  const practiceCertificateRef = useRef(null);
  const [image, setImage] = useState([]);

  useEffect(() => {
    if (certificateType === 'advance') {
      advanceCertificate();
    } else if (certificateType === 'basic') {
      basicCertificate(null);
    } else if (certificateType === 'gold' || certificateType === 'silver') {
      practiceCertificate();
    }
  }, [certificateType]);

  const basicCertificate = (imageData1) => {
    let certificateElement = basicCertificateRef.current;
    html2canvas(certificateElement).then((canvas) => {
      let imgData = canvas.toDataURL('image/png');
      const newImage = imageData1 !== null ? [...image, imageData1, imgData] : [...image, imgData];
      setImage(newImage);
      onImageReceived(newImage);
    });
  };

  const advanceCertificate = () => {
    let certificateElement = advanceCertificateRef.current;
    html2canvas(certificateElement).then((canvas) => {
      let imgData = canvas.toDataURL('image/png');
      basicCertificate(imgData);
    });
  };

  const practiceCertificate = () => {
    let certificateElement = practiceCertificateRef.current;
    html2canvas(certificateElement).then((canvas) => {
      let imgData = canvas.toDataURL('image/png');
      const newImage = [...image, imgData];
      setImage(newImage);
      onImageReceived(newImage);
    });
  };

  return (
    <div>
      <div ref={basicCertificateRef}>
        <BasicLevelContainer>
          <BasicLevelBody>{upperCase(name)}</BasicLevelBody>
        </BasicLevelContainer>
      </div>
      <div ref={advanceCertificateRef}>
        <AdvanceLevelContainer>
          <AdvanceLevelBody>{upperCase(name)}</AdvanceLevelBody>
        </AdvanceLevelContainer>
      </div>
      <div ref={practiceCertificateRef}>
        {
          certificateType === 'gold' ?
            <PracticeGoldContainer>
              <PracticeBody style={{ color: certificateType === 'gold' ? '#c7b517' : 'white' }}>
                {upperCase(name)}
              </PracticeBody>
            </PracticeGoldContainer> :
            <PracticeSilverContainer>
              <PracticeBody style={{ color: certificateType === 'gold' ? '#c7b517' : 'white' }}>
                {upperCase(name)}
              </PracticeBody>
            </PracticeSilverContainer>
        }
      </div>
    </div>
  );
};

export default CertificateDownload;
