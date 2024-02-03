import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import { authHeader, errorHandler } from '../../api/Api';
import axios from 'axios';
import  url  from '../../utils/UrlConstant';

const SliderWithVideo = (props) => {

    const [media, setMedia] = useState(null)
    const carouselRef = useRef(null);
    const [logos, setLogos] = useState({})


    useEffect(() => {
        setMedia(props?.mediaItems)
        getLogos();
    }, [props])

    const getLogos = () => {
        let ids = []
        _.map(props.mediaItems, ad => {
            ids.push(ad.id)
        })
        axios.get(`${url.ADV_API}/advdetails/logo?advIds=${ids}`, { headers: authHeader() })
            .then(res => {
                setLogos(res.data.response)
            })
            .catch(err => errorHandler(err))
    }

    return (
        <div>
            <Carousel navButtonsAlwaysVisible={_.size(media) > 0} autoPlay={_.size(media) > 0} ref={carouselRef}>
                {media?.map((item, index) => {
                    return item?.type !== 'VIDEO' ?
                        <div className='row' key={index} style={{ paddingLeft: '4.2rem', margin: 'auto', height: 'calc (100vh-500px)' }}>
                            <div className='col-6' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <img width={500} height={350} src={item?.path} alt="Slide" />
                            </div>
                            <div className='col-6' style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: '500px' }}>
                                <div style={{ width: '430px', height: '300px', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
                                    <div>
                                        <span className='setting-title' style={{ fontSize: '1.5rem' }}>{item.companyName}</span>
                                        <img alt='' style={{ marginLeft: '.5rem' }} width={45} height={40} src={`data:image/png;base64,${logos[item.id]}`}></img>
                                    </div>
                                    <span style={{ fontSize: '1.2rem', color: 'black', textIndent: '20px' }} className='setting-title' >{item.description}</span>
                                </div>
                            </div>
                        </div>
                        :
                        <div className='row' key={index} style={{ paddingLeft: '4.2rem', margin: 'auto', height: 'calc (100vh-500px)' }}>
                            <div className='col-6' style={{ height: '500px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', overflow: 'auto', }}>
                                <video autoPlay width={500} height={350} controls>
                                    <source src={item?.path} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                            <div className='col-6' style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', overflow: 'auto', height: '500px' }}>
                                <div style={{ width: '430px', height: '300px', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
                                    <div>
                                        <span className='setting-title' style={{ fontSize: '1.5rem' }}>{item.companyName}</span>
                                        <img alt='' style={{ marginLeft: '.5rem' }} width={45} height={40} src={`data:image/png;base64,${logos[item.id]}`}></img>
                                    </div>
                                    <span style={{ fontSize: '1.2rem', color: 'black', textIndent: '20px' }} className='setting-title' >{item.description}</span>
                                </div>
                            </div>
                        </div>
                })}
            </Carousel >
        </div>
    );
};

export default SliderWithVideo;
