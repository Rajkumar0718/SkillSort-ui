import { FormHelperText } from '@mui/material'
import axios from 'axios'
import _ from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authHeader, errorHandler } from '../../api/Api'
import CustomDatePick from '../../common/CustomDatePick'
import { toastMessage, withLocation } from '../../utils/CommonUtils'
import url from "../../utils/UrlConstant"
import { isEmpty } from '../../utils/Validation'


const AddAdvertisement = ({location}) => {
  const videoRef = useRef();

  const [advertisement, setAdvertisement] = useState({})
  const [image, setImage] = useState(null);
  const [logo, setLogo] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [displayLogo, setDisplayLogo] = useState(null)
  const [base64Logo, setBase64Logo] = useState(null)
  const [videoSource, setVideoSource] = useState(null)
  const [error, setError] = useState({
    companyName: false,
    companyNameMsg: '',
    description: false,
    descriptionMsg: '',
    startDate: false,
    startDateMsg: '',
    endDate: false,
    endDateMsg: '',
    image: false,
    imageMsg: "",
    type: false,
    typeMsg: '',
    displayOrder: false,
    displayOrderMsg: "",
  });
  const [disable, setDisable] = useState(false)
  const navigate = useNavigate();
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
  let action = null;

  const changeHandler = (event) => {
    setAdvertisement((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  useEffect(() => {
    if (location.pathname.indexOf('edit') > -1) {
      const ad = location.state.ads;
      const updatedAd = { ...ad, startDate: new Date(ad.startDate), endDate: new Date(ad.endDate) }
      setAdvertisement(updatedAd)
      getLogo(updatedAd)
    }
  }, [])

  const setDate = (date, key) => {
    setAdvertisement((prev) => ({ ...prev, [key]: date }))
  }

  const setAdvertisementFile = (event) => {
    const file = event.target.files[0];
    let url;
    setImageSrc(null);
    setVideoSource(null);
    setImage(file)
    if (file?.type.startsWith('image')) {
      url = URL.createObjectURL(file);
      setImageSrc(url)
    } else if (advertisement.type === 'VIDEO' && file) {
      url = URL.createObjectURL(file);
      setVideoSource(url);
    }
  };

  useEffect(() => {
    videoRef.current?.load();
  }, [videoSource])


  const setCompanyLogo = (event) => {
    const err = _.clone(error)
    const file = event.target.files[0]
    if (allowedTypes.includes(file?.type)) {
      resizeFile(file).then((file) => {
        setLogo(file)
      })
      displayCompanyLogo(file)
      err.companyLogo = false
      err.companyLogoMsg = ''
      setError(err)
    }
    else {
      err.companyLogo = true
      err.companyLogoMsg = 'Enter a valid type'
      setError(err)
    }
  }

  const renderVideoOrImage = () => {
    if (advertisement.type === 'VIDEO') {
      if (videoSource) {
        return (<video  style={{ marginTop: '-3rem' }} width="200" height="200" controls autoplay ref={videoRef}>
          <source src={videoSource} type="video/mp4" />
        </video>)
      } else if (!advertisement.path?.includes('.jpeg')) {
        return (
          <video style={{ marginTop: '-3rem' }}  width="200" height="200" controls autoplay ref={videoRef}>
            <source src={advertisement.path} type="video/mp4" />
          </video>
        )
      }
    } else if (advertisement.type === 'IMAGE' && (advertisement.path?.includes('.jpeg') || imageSrc)) {
      return <img src={imageSrc ? imageSrc : advertisement.path}  width="200 " height="150"></img>
    }
  }


  const resizeFile = (file) => {
    return new Promise((resolve) => {
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 500;
        canvas.height = 350;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          const resizedFile = new File([blob], file.name, { type: 'image/jpeg' });
          resolve(resizedFile);
        }, 'image/jpeg', 1);
      };

      const reader = new FileReader();
      reader.onload = (e) => {
        image.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const getLogo = (ad) => {
    axios.get(`${url.ADV_API}/advdetails/logo/${ad.id}`, { headers: authHeader() })
      .then(res => {
        setBase64Logo(res.data.message)
      })
      .catch(err => errorHandler(err))
  }

  const options = ['IMAGE', 'VIDEO'];

  const handleSubmit = (e) => {
    e.preventDefault()
    let err = _.clone(error)
    if (isEmpty(advertisement.companyName?.trim())) {
      err.companyName = true
      err.companyNameMsg = 'Field Required'
    } else {
      err.companyName = false
      err.companyNameMsg = ''
    }
    if (isEmpty(advertisement.title?.trim())) {
      err.title = true
      err.titleMsg = 'Field Required'
    } else {
      err.title = false
      err.titleMsg = ''
    }
    if (isEmpty(advertisement.website?.trim())) {
      err.website = true
      err.websiteMsg = 'Field Required'
    } else {
      err.website = false
      err.websiteMsg = ''
    }
    if (isEmpty(advertisement.description?.trim())) {
      err.description = true
      err.descriptionMsg = 'Field Required'
    }
    else {
      err.description = false
      err.descriptionMsg = ''
    }
    if (isEmpty(advertisement.startDate)) {
      err.startDate = true
      err.startDateMsg = 'Field Required'
    }
    else {
      err.startDate = false
      err.startDateMsg = ''
    }
    if (isEmpty(advertisement.endDate)) {
      err.endDate = true
      err.endDateMsg = 'Field Required'
    }
    else {
      err.endDate = false
      err.endDateMsg = ''
    }
    if (isEmpty(logo) && isEmpty(advertisement.logo)) {
      err.companyLogo = true
      err.companyLogoMsg = 'Field Required'
    } else {
      err.companyLogo = false
      err.companyLogoMsg = ''
    }
    if (!image?.type.includes(_.toLower(advertisement.type)) || !image || Math.round(image.size / (1024 * 1024)) > 10) {
      err.image = true
      if (!image) {
        err.imageMsg = 'Field Required'
      }
      else if (!image?.type.includes(_.toLower(advertisement.type))) {
        err.imageMsg = 'Enter a valid type'
      }
      else {
        err.imageMsg = 'File size must less than 10MB'
      };
    }
    else {
      err.image = false
      err.imageMsg = ''
    }
    if (isEmpty(advertisement.type)) {
      err.type = true
      err.typeMsg = 'Field Required'
    }
    else {
      err.type = false
      err.typeMsg = ''
    }
    if (isEmpty(advertisement.displayOrder)) {
      err.displayOrder = true
      err.displayOrderMsg = 'Field Required'
    }
    else {
      err.displayOrder = false
      err.displayOrderMsg = ''
    }
    if (advertisement.path && !image) {
      if (advertisement.type === 'IMAGE') {
        if (advertisement.path.includes('jpeg')) {
          err.image = false;
          err.imageMsg = '';
        } else {
          err.image = true;
          err.imageMsg = 'Enter a valid type';
        }
      } else if (advertisement.type === 'VIDEO') {
        if (!advertisement.path.includes('jpeg')) {
          err.image = false;
          err.imageMsg = '';
        } else {
          err.image = true;
          err.imageMsg = 'Enter a valid type';
        }
      }
    }

    else {
      if (!image) {
        err.image = false
        err.imageMsg = ''
      }
    }

    setError(err)
    if (!err.companyName && !err.description && !err.startDate && !err.endDate && !err.image && !err.type && !err.displayOrder && !err.companyLogo && !err.title && !err.website) {
      setDisable(true)
      let formData = new FormData();
      formData.append("advdetails", JSON.stringify(advertisement));
      formData.append("file", image)
      formData.append("logo", logo)
      axios.post(`${url.ADV_API}/advdetails`, formData, { headers: authHeader() })
        .then(res => {
          setDisable(false)
          navigate('/skillsortadmin/advertisement')
          toastMessage("success", "Advertisement added successfully")
        })
        .catch((err) => {
          setDisable(false)
          errorHandler(err)
        })
    }
  }

  const displayCompanyLogo = (file) => {
    setDisplayLogo(URL.createObjectURL(file))
  }

  if (location.pathname.indexOf('edit') > -1) {
    action = location.state.action;
  }

  return (
    <main className="main-content bcg-clr">
      <div>
        <div className="container-fluid cf-1">
          <div className="card-header-new">
            <span>{action !== null ? 'Update' : 'Add'} Advertisement</span>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="table-border-cr">
                <form className="email-compose-body" onSubmit={(e) => handleSubmit(e)}>
                  <div className="send-header" style={{ marginLeft: "1rem" }}>
                    <div className="row">
                      <div className='col-6 col-lg-6 col-sm-6 col-xl-6'>
                        <div className='row'>
                          <div className='col-4 col-lg-4 col-md-4 col-sm-4'>
                            <label className="form-label input-label">Company Name<span className='required'></span><FormHelperText className="helper helper-candidate" style={{ paddingLeft: "0px", marginTop: '5px' }}>{error.companyName ? error.companyNameMsg : null}</FormHelperText></label>
                          </div>
                          <div className='col-8 col-lg-8 col-md-8 col-sm-8'>
                            <input className="profile-page input-mini" maxLength="50"
                              onChange={(e) => changeHandler(e)}
                              value={advertisement?.companyName || ''}
                              name='companyName' id='company' autoComplete="off" type="text" placeholder='Enter Company Name' />
                          </div>
                        </div>
                      </div>
                      <div className='col-6 col-lg-6 col-sm-6 col-xl-6'>
                        <div className='row'>
                          <div className='col-4 col-lg-4 col-md-4 col-sm-4'>
                            <label className="form-label input-label">Title<span className='required'></span><FormHelperText className="helper helper-candidate" style={{ paddingLeft: "0px", marginTop: '5px' }}>{error.title ? error.titleMsg : null}</FormHelperText></label>
                          </div>
                          <div className='col-8 col-lg-8 col-md-8 col-sm-8'>
                            <input className="profile-page input-mini" maxLength="50"
                              value={advertisement.title}
                              onChange={(e) => changeHandler(e)}
                              name='title' id='company' autoComplete="off" type="text" placeholder='' />
                            {/* <button disabled={disable} type='submit' className='btn btn-primary'>{action === null ? 'Submit' : 'Update'}</button> */}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className='col-6 col-lg-6 col-sm-6 col-xl-6'>
                        <div className='row'>
                          <div className='col-4 col-lg-4 col-md-4 col-sm-4'>
                            <label className="form-label input-label">Start Date<span className='required'></span><FormHelperText className="helper helper-candidate" style={{ paddingLeft: "0px", marginTop: '5px' }}>{error.startDate ? error.startDateMsg : null}</FormHelperText></label>

                          </div>
                          <div className='col-8 col-lg-8 col-md-8 col-sm-8'>
                            <CustomDatePick
                              onChange={date => setDate(date, 'startDate')}
                              value={advertisement?.startDate || null}
                              objectKey='startDate'
                              minDate={new Date()}
                            />
                          </div>
                        </div>
                      </div>
                      <div className='col-6 col-lg-6 col-sm-6 col-xl-6'>
                        <div className='row'>
                          <div className='col-4 col-lg-4 col-md-4 col-sm-4'>
                            <label className="form-label input-label">End Date<span className='required'></span><FormHelperText className="helper helper-candidate" style={{ paddingLeft: "0px", marginTop: '5px' }}>{error.endDate ? error.endDateMsg : null}</FormHelperText></label>
                          </div>
                          <div className='col-8 col-lg-8 col-md-8 col-sm-8'>
                            <CustomDatePick
                              onChange={date => setDate(date, 'endDate')}
                              value={advertisement?.endDate || null}
                              objectKey='endDate'
                              minDate={advertisement.startDate}
                            />
                          </div>

                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className='col-6 col-lg-6 col-sm-6 col-xl-6'>
                        <div className='row'>
                          <div className='col-4 col-lg-4 col-md-4 col-sm-4'>
                            <label className="form-label input-label">Website<span className='required'></span><FormHelperText className="helper helper-candidate" style={{ paddingLeft: "0px", marginTop: '5px' }}>{error.website ? error.websiteMsg : null}</FormHelperText></label>
                          </div>
                          <div className='col-8 col-lg-8 col-md-8 col-sm-8'>
                            <input className="profile-page input-mini"
                              onChange={(e) => changeHandler(e)}
                              value={advertisement?.website}
                              name='website' id='company' autoComplete="off" type="text" placeholder='' />
                          </div>
                        </div>
                      </div>
                      <div className='col-6 col-lg-6 col-sm-6 col-xl-6'>
                        <div className='row'>
                          <div className='col-4 col-lg-4 col-md-4 col-sm-4'>
                            <label className="form-label input-label">Select Type<span className='required'></span><FormHelperText className="helper helper-candidate" style={{ paddingLeft: "0px", marginTop: '5px' }}>{error.type ? error.typeMsg : null}</FormHelperText></label>
                          </div>
                          <div className='col-8 col-lg-8 col-md-8 col-sm-8'>
                            <select value={advertisement.type} name='type' onChange={(e) => changeHandler(e)} className="profile-page input-mini">
                              <option selected value={""}>Select Type</option>
                            <option key={"IMAGE"} value={"IMAGE"}>IMAGE</option>
                            <option key={"VIDEO"} value={"VIDEO"}>VIDEO</option>

                            </select>
                          </div>
                        </div>
                      </div>

                    </div>
                    <div className="row">
                      <div className='col-6 col-lg-6 col-sm-6 col-xl-6'>
                        <div className='row'>
                          <div className='col-4 col-lg-4 col-md-4 col-sm-4'>
                            <label className="form-label input-label">Description<span className='required'></span><FormHelperText className="helper helper-candidate" style={{ paddingLeft: "0px", marginTop: '5px' }}>{error.description ? error.descriptionMsg : null}</FormHelperText></label>

                          </div>
                          <div className='col-8 col-lg-8 col-md-8 col-sm-8 ' style={{ marginTop: "-1rem" }}>
                            <textarea name="description" className="profile-page input-mini" onChange={(e) => changeHandler(e)} value={advertisement?.description || ''} rows="2"></textarea>
                          </div>
                        </div>
                      </div>
                      <div className='col-6 col-lg-6 col-sm-6 col-xl-6'>
                        <div className='row'>
                          <div className='col-4 col-lg-4 col-md-4 col-sm-4'>
                            <label className="form-label input-label">Display Order<span className='required'></span><FormHelperText className="helper helper-candidate" style={{ paddingLeft: "0px", marginTop: '5px' }}>{error.displayOrder ? error.displayOrderMsg : null}</FormHelperText></label>
                          </div>
                          <div className='col-8 col-lg-8 col-md-8 col-sm-8'>
                            <input className="profile-page input-mini"
                              onChange={(e) => changeHandler(e)}
                              value={advertisement?.displayOrder || ''}
                              name='displayOrder' id='company' autoComplete="off" type="number" placeholder='Display Order' />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className='col-6 col-lg-6 col-sm-6 col-xl-6'>
                        <div className='row'>
                          <div className='col-4 col-lg-4 col-md-4 col-sm-4'>
                            <label className="form-label input-label">Select File<span className='required'></span><FormHelperText className="helper helper-candidate" style={{ paddingLeft: "0px", marginTop: '5px' }}>{error.image ? error.imageMsg : null}</FormHelperText></label>
                          </div>
                          <div className='col-8 col-lg-8 col-md-8 col-sm-8'>
                            <input className="profile-page input-mini" style={{ paddingBottom: '3px' }} maxLength="50"
                              onChange={(e) => setAdvertisementFile(e)}
                              name='image' id='company' autoComplete="off" type="file" placeholder='' />
                          </div>
                          <div className='col-8 col-lg-8 col-md-8 col-sm-8'>
                            {renderVideoOrImage()}
                          </div>
                        </div>
                      </div>

                      <div className='col-6 col-lg-6 col-sm-6 col-xl-6'>
                        <div className='row'>
                          <div className='col-4 col-lg-4 col-md-4 col-sm-4'>
                            <label className="form-label input-label">Company Logo<span className='required'></span><FormHelperText className="helper helper-candidate" style={{ paddingLeft: "0px", marginTop: '5px' }}>{error.companyLogo ? error.companyLogoMsg : null}</FormHelperText></label>
                            {displayLogo && <img style={{ width: '200px', height: '200px' }} alt='logo' src={displayLogo} ></img>}
                            {!displayLogo && base64Logo && <img style={{ width: '200px' }} alt='logo' src={`data:image/png;base64,${base64Logo}`} />}
                          </div>
                          <div className='col-8 col-lg-8 col-md-8 col-sm-8'>
                            <input className="profile-page input-mini" style={{ paddingBottom: '3px' }} maxLength="50" accept="image/jpeg, image/png"
                              onChange={(e) => setCompanyLogo(e)}
                              name='logo' id='company' autoComplete="off" type="file" placeholder='' />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-9 col-lg-9 col-md-9 col-sm-9" style={{ padding: "0px 0px 0px 10px", marginLeft: "3rem" }}>
                        <button style={{ float: 'right' }} disabled={disable} type='submit' className='btn btn-primary  float-end'>{action === null ? 'Submit' : 'Update'}</button>
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-md-12">

                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div >
    </main >
  );
}

export default withLocation(AddAdvertisement);