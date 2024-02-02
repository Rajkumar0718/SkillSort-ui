import { Divider, Grid } from '@mui/material';
import { TimelineContent } from '@mui/lab';
import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';

export default class ScreenShotModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      index: 0
    }
  }

  getViewImage = (index) => {
    this.setState({ viewImg: this.props.screenShots[index].base64String })
    this.setState({ time: this.props.screenShots[index].time })
    this.setState({ index: index })
  }

  render() {
    return (
      <div className="modal fade show" id="myModal" role="dialog" style={{ paddingRight: '15px', display: 'flex', backgroundColor: 'rgba(0,0,0,0.90)', justifyContent: 'center', alignItems: 'center' }} aria-hidden="true">
        <div className="col-lg-11 col-xs-11">
          <div className="modal-content" style={{ borderStyle: 'solid', borderColor: '#af80ecd1', borderRadius: "15px", height: '95vh', verticalAlign: "center" }}>
            <div className="modal-header" style={{ padding: "1rem", paddingBottom: "0rem", border: "none" }}>
              <span style={{ fontFamily: 'Baskervville', fontWeight: 400, fontSize: '2rem', paddingLeft: '1.5rem' }}>MCQ Images</span>
              <button type="button" onClick={this.props.onCloseModal} className="close" data-dismiss="modal">&times;</button>
            </div>
            <div className="modal-body">
              <Grid container spacing={3} style={{ paddingLeft: '2.5rem' }}>
                <Grid item xs={8}>
                  <img alt='screenshot' style={{ height: '24.8rem', width: '100%', marginBottom: '1rem' }} src={this.state.viewImg ? this.state.viewImg : this.props.screenShots[0].base64String} ></img>
                  <Divider style={{ backgroundColor: '#000000' }} />
                  <span className='pull-right' style={{ marginTop: '1rem' }}>{this.state.time? moment(this.state.time).format('LTS'):moment(this.props.screenShots[0]?.time).format('LTS')}</span>
                </Grid>
                <Grid item xs={4}>
                  <div style={{ background: '#E6E6E6', height: 'calc(100vh  - 150px)', overflowY: 'auto', width: '15.25rem', padding: 'none' }} >
                    {_.map(this.props.screenShots, (s, i) => {
                      return <>
                        <TimelineContent>
                          <div onClick={()=>this.getViewImage(i)} style={{ display: 'flex', justifyContent: 'space-between',cursor:'pointer' }}>
                            <div style={{ background: '#F05A28' }}>
                              <img onClick={() => this.getViewImage(i)} style={{width: '106px', opacity: this.state.index === i ? '0.5' : '1' }} alt='plug' width={250} src={s.base64String} ></img>
                            </div>
                            <span style={{ fontSize: '1rem', fontWeight: 400, fontFamily: 'Montserrat', margin: 'auto', color: s.suspect ? 'red' : 'green' }} >{moment(s.time).format('LTS')}</span>
                          </div>
                        </TimelineContent>
                        <div style={{ width: '92%', border: '2px solid white', margin: 'auto' }} ></div>
                      </>
                    })}
                  </div>
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
