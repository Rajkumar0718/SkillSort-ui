import _ from "lodash";
import React from "react";
import Carousel from "react-material-ui-carousel";
// import '../../assests/css/SuperAdminDashboard.css'

export default function 
ViewProfile(props) {

  const viewCarousel = () => {
    return (
      <Carousel autoPlay navButtonsAlwaysVisible>
        {_.map(props.certificateData, (item) =>
          <div key={item} style={{ padding: '0 4rem 0 4rem', margin: 'auto' }}>
            <iframe title='profile' src={item?.preSignedUrl} style={{ width: '100%', height: 'calc(100vh - 12rem)' }}></iframe>
          </div>

        )}
      </Carousel>
    )
  }
  return (
    <div className="modal fade show" id="myModal" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.90)' }} aria-hidden="true">
      <div className="col-md-10" style={{ margin: 'auto' }}>
        <div className="modal-content" style={{ borderStyle: 'solid', borderColor: '#808080', marginTop: '1.5rem', borderRadius: '32px', background: 'white', height: 'calc(100vh - 80px)' }}>
          <div className="modal-header" style={{ border: 'none', padding: '5px',display:'flex',justifyContent:'flex-end' }}>
            <button type="button" onClick={() => props.onClose()} className="close" data-dismiss="modal" style={{ marginRight: '0px', marginTop: '0.2rem' ,border:'none',backgroundColor:'snow'}}>&times;</button>
          </div>
          <div className="row" style={{ margin: '10px' }}>
            <div className="col-md">
              {
                props.type === 'resume' ?
                  <iframe title="Profile" src={props.pdfData} style={{ width: '100%', height: 'calc(100vh - 12rem)', border: 'none' }} /> : props.certificateData.length === 1 ?
                    <iframe title="Profile" src={props.certificateData[0].preSignedUrl} style={{ width: '100%', height: 'calc(100vh - 12rem)', border: 'none' }} /> : viewCarousel()
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}