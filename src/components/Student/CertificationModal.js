import React, { useState } from 'react';
import axios from 'axios';
import { toastMessage } from '../../utils/CommonUtils';
import { authHeader, errorHandler } from '../../api/Api';
import { isEmpty } from '../../utils/Validation';
import FormHelperText from '@mui/material/FormHelperText';
import { url } from '../../utils/UrlConstant';

const CertificationModal = ({ onCloseModal, studentId, isNewStudent }) => {
  const [certificate, setCertificate] = useState({
    studentId: studentId,
    description: ''
  });
  const [certificateFile, setCertificateFile] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState({
    description: false,
    descriptionErrorMessage: '',
    certificateFile: false,
    certificateFileErrorMessage: ''
  });

  const handleChange = (event, key) => {
    setCertificate({
      ...certificate,
      [key]: event.target.value
    });
  };

  const addCertificate = () => {
    if (isEmpty(certificate.description)) {
      setError((prevError) => ({
        ...prevError,
        description: true,
        descriptionErrorMessage: 'Enter Description'
      }));
    } else {
      setError((prevError) => ({
        ...prevError,
        description: false
      }));
    }

    if (isEmpty(certificateFile)) {
      if (certificateFile === null) {
        setError((prevError) => ({
          ...prevError,
          certificateFile: true,
          certificateFileErrorMessage: isEmpty(certificateFile)
            ? 'Certificate Required'
            : 'Upload file less than 1Mb'
        }));
      } else {
        setError((prevError) => ({
          ...prevError,
          certificateFile: false
        }));
      }
    }

    if (!error.certificateFile && !error.description) {
      const formData = new FormData();
      formData.append('certificate', JSON.stringify(certificate));
      formData.append('file', certificateFile);
      setDisabled(true);

      axios
        .post(`${url.COLLEGE_API}/certificate/save`, formData, { headers: authHeader() })
        .then((res) => {
          toastMessage('success', 'Certificate Uploaded successfully!');
          onCloseModal(true);
        })
        .catch((error) => {
          setDisabled(false);
          errorHandler(error);
        });
    }
  };

  const onFileChange = (event) => {
    let pdf = event.target.files[0];
    if (pdf?.size > 1048576 || pdf.type !== 'application/pdf') {
      setCertificateFile(null);
      setError((prevError) => ({
        ...prevError,
        certificateFile: true,
        certificateFileErrorMessage: pdf.type !== 'application/pdf'
          ? 'Upload Pdf File only'
          : 'File size must be less than 1MB'
      }));
    } else {
      setError((prevError) => ({
        ...prevError,
        certificateFile: false
      }));
      setCertificateFile(event.target.files[0]);
    }
  };

  return (
    <>
      <div className="modal fade show" id="myModal" role="dialog" style={{ paddingRight: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.90)' }} aria-hidden="true">
        <div className="modal-dialog" style={{ width: '625px', maxWidth: '670px' }}>
          <div className="modal-content" style={{ borderStyle: 'solid', borderColor: '#af80ecd1', borderRadius: '32px' }}>
            <div className="modal-header" style={{ padding: '2rem 2rem 0 3.85rem', border: 'none' }}>
              <h5 className="setting-title">Technical Certificate Only </h5>
              <button type="button" onClick={onCloseModal} className="close" style={{backgroundColor:'transparent',padding:'0',border:'0'}} data-dismiss="modal">&times;</button>
            </div>
            <div className="modal-body" style={{ paddingTop: '5px' }}>
              <div className='form-row' style={{display:'flex', flexWrap:'wrap'}}>
                <div className='col-3'>
                  <label className="form-label text-label" htmlFor="form12">Certificate
                    <FormHelperText className='helper helper-candidate'>{error.certificateFile ? error?.certificateFileErrorMessage : null}</FormHelperText>
                  </label>
                </div>
                <div className='col-9'>
                  <input type="file" class="form-control" id="inputGroupFile02" onChange={onFileChange} accept={"application/pdf"} style={{ width: '311px', marginLeft: '5px' }}></input>
                  <label className="custom-file-label text-label" style={{ width: '255px', marginLeft: '14px' }}> {certificateFile ? certificateFile?.name : "Upload Certificate in .pdf"}</label>
                </div>
                <div className='col-3' >
                  <label className="form-label text-label" htmlFor="form12" style={{ padding: '14px' }}>Description
                    <FormHelperText className='helper helper-candidate'>{error.description ? error?.descriptionErrorMessage : null}</FormHelperText>
                  </label>
                </div>
                <div className='col-9'>
                  <textarea id="fixed-row-textarea" rows="1" className="profile-page" type='text' label='description' name='description' value={certificate?.description} onChange={(event) => handleChange(event, 'description')} aria-label="default input example" style={{ maxHeight: '5em', resize: 'vertical', padding: '9px', width:'311px' }}></textarea>
                </div>
              </div>
              <div className="form-group row">
                <div className="col-md-11">
                  <button disabled={disabled} onClick={addCertificate} style={{ float: "right" }} className="btn btn-sm btn-nxt">Upload</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CertificationModal;
