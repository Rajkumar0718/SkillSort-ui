import React, { useState, useEffect } from 'react';
import CertificateDownload from '../../utils/CertificateDownload';
import axios from 'axios';
import { authHeader } from '../../api/Api';
import Carousel from 'react-material-ui-carousel';
import _ from 'lodash';

const SocialMediaShareModal = (props) => {
    const [certificate, setCertificate] = useState(true);
    const [certificateType, setCertificateType] = useState('');
    const [imageFile, setImageFile] = useState([]);
    const [socialMediaType, setSocialMediaType] = useState('');

    useEffect(() => {
        setCertificate(true);
        setCertificateType(props.certificateType);
    }, [props.certificateType]);

    const handleClose = () => {
        setCertificate(false);
        setImageFile([]);
        setCertificateType('');
        props.close();
    };

    const handleFacebookShare = (imageUrl) => {
        const url = 'https://www.facebook.com/sharer.php?u=' + encodeURIComponent(imageUrl);
        window.open(url, '_blank');
    };

    const handleTwitterShare = (imageUrl) => {
        const url = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(imageUrl);
        window.open(url, '_blank');
    };

    const handleLinkedInShare = (imageUrl) => {
        const url = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(imageUrl);
        window.open(url, '_blank');
    };

    const handleImageReceived = (imageData) => {
        console.log('Received image data:', imageData);
        const newImageFile = [...imageFile, ...imageData];
        setImageFile(newImageFile);
        setCertificate(false);
    };

    const shareHandler = (social) => {
        setSocialMediaType(social);
        handleUpload();
    };

    const handleUpload = () => {
        if (socialMediaType === 'download') {
            imageFile.forEach((image, index) => {
                fetch(image)
                    .then((response) => response.blob())
                    .then((blob) => {
                        const downloadLink = document.createElement('a');
                        downloadLink.href = URL.createObjectURL(blob);
                        downloadLink.download = imageFile.length > 1 ? (index === 1 ? 'BasicLevelCertificate.png' : 'AdvanceLevelCertificate.png') : 'Skillsortcertificate.png';
                        downloadLink.click();
                    });
            });
        } else if (socialMediaType !== 'download') {
            fetch(imageFile[0])
                .then((response) => response.blob())
                .then((blob) => {
                    let formData = new FormData();
                    formData.append("image", blob, "certificate.png");
                    formData.append("certificateType", props.certificateType);
                    formData.append("examType", props.examType);

                    axios.post(`http://192.168.1.2:8805/api5/awsApi/sentImage`, formData, { headers: authHeader() })
                        .then(response => {
                            let url = response.data.message;
                            if (socialMediaType === "fb") {
                                handleFacebookShare(url);
                            } else if (socialMediaType === "twitter") {
                                handleTwitterShare(url);
                            } else if (socialMediaType === "linkedin") {
                                handleLinkedInShare(url);
                            }
                        })
                        .catch(error => {
                            console.error('Image upload error:', error);
                        });
                })
                .catch((error) => {
                    console.error('Error converting base64 to Blob:', error);
                });
        }
    };

    return (
        <div className="modal fade show" onClick={(e) => { props.handleOutside(e) }} id="myModal" role="dialog" style={{ display: 'flex', justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.90)' }} aria-hidden="true" >
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: props.examType === "practice" ? "35rem" : "50rem" }}>
                <div className="modal-content" style={{ borderStyle: 'solid', borderColor: '#af80ecd1', borderRadius: "32px" }}>
                    <div className="modal-header" style={{ border: "none", textAlign: "center" }}>
                        <button type="button" onClick={() => this.handleClose()} className="close" data-dismiss="modal"> &times;</button>
                    </div>
                    <div>
                        <h5 className="setting-title" style={{ textAlign: "center", margin: "auto" }}>SocialMedia Share</h5>
                    </div>
                    <div className="modal-body" style={{ PaddingTop: "0px" }}>
                        <div className="form-row">
                            <div className="form-group col-12" style={{ maxHeight: '450px' }}>
                                {imageFile.length > 1 ? (
                                    <Carousel>
                                        {imageFile.map((image, index) => (
                                            <div>
                                                <img key={index} src={image} alt='' style={{ objectFit: this.props.examType === "practice" ? 'contain' : null, height: '450px', width: this.props.examType === "practice" ? null : '700px' }} />
                                            </div>
                                        ))}
                                    </Carousel>) : (
                                    <div>
                                        <img key={1} src={imageFile[0]} alt='' style={{ objectFit: this.props.examType === "practice" ? 'contain' : null, height: '450px', width: this.props.examType === "practice" ? null : '700px' }} />
                                    </div>)}
                            </div>
                        </div>
                        <div className="form-group row" style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
                            <div className="col-md-3" style={{ display: 'flex', justifyContent: 'center' }}>
                                <span style={{ color: '#3b5998', cursor: 'pointer' }} title='Facebook' onClick={() => this.shareHandler("fb")} ><i class="fa fa-2x fa-facebook-square" aria-hidden="true" /></span>
                            </div>
                            <div className="col-md-3" style={{ display: 'flex', justifyContent: 'center' }}>
                                <span style={{ color: '#1DA1F2', cursor: 'pointer' }} title='Twitter' onClick={() => this.shareHandler("twitter")} ><i class="fa fa-2x fa-twitter-square" aria-hidden="true" /></span>
                            </div>
                            <div className="col-md-3" style={{ display: 'flex', justifyContent: 'center' }}>
                                <span style={{ color: '#0072b1', cursor: 'pointer' }} title='Linkedin' onClick={() => this.shareHandler("linkedin")} ><i class="fa fa-2x fa-linkedin-square" aria-hidden="true" /></span>
                            </div>
                            <div className="col-md-2" style={{ display: 'flex', justifyContent: 'center' }}>
                                <span style={{ color: '#18363E', cursor: 'pointer' }} title='Download' class="fa fa-2x fa-download" aria-hidden="true" round size={32} onClick={() => this.shareHandler("download")} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
                {/* <div> */}
                {certificate ? <CertificateDownload onImageReceived={this.handleImageReceived} certificateType={this.props.certificateType} name={this.props.candidateName} /> : null}
            </div>
        </div>
    );
};

export default SocialMediaShareModal;
