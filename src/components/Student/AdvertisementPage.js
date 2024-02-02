import axios from "axios";
import { useEffect, useState } from "react";
import { authHeader } from "../../api/Api";
import SliderWithVideo from "./SliderWithVideo ";
import _ from "lodash";
import { useLocation } from "react-router-dom";
import { url } from "../../utils/UrlConstant";



function AdvertisementPage() {
    const location = useLocation()
    const [advertisements, setAdvertisements] = useState(null);
    useEffect(() => {
        handlePageViewEvent()
        axios.get(`${url.ADV_API}/advdetails/getAll`, { headers: authHeader() }).then(res => {
            if (location?.state?.adv) {
                let ads = _.remove(res.data.response, r => r.id !== location.state.adv.id)
                ads.splice(0, 0, _.find(res.data.response, r => r.id === location.state.adv.id));
                setAdvertisements(ads)
            }
            else setAdvertisements(res.data.response)
        }).catch(err => {
            console.log(err)
        })
    }, [])

    const handlePageViewEvent = ()=>{
        window.dataLayer.push({
          event: 'Student-_Advertisements_PageView',
          pagePath:window.location.href
        });
      }

    return (
        <>
            <div className="container">
                <SliderWithVideo mediaItems={advertisements} />
            </div>
        </>
    );
}
export default AdvertisementPage;