import { Divider, FormControl, Grid, InputLabel, List, MenuItem, Select } from "@mui/material";
import { TimelineContent } from "@mui/lab";
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from "react";
import AutoResize from "react-textarea-autosize";
import '../Admin/ProgramResult.css';

function AnalyticsModel(props) {

  const [images, setImages] = useState([]);
  const [viewImg, setViewImg] = useState(null)
  const [showCopyContents, setShowCopyContents] = useState(false);
  const [time, setTime] = useState(null);
  const [viewContent, setViewContent] = useState(null);
  const [index, setIndex] = useState(0);
  const [switchCount, setSwitchCount] = useState([]);
  const [filterResults, setFilterResults] = useState([]);
  const [filterValue, setFilterValue] = useState('');

  useEffect(() => {
    getScreenShots();
       // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props])

  useEffect(() => {
    if (filterResults.length > 0) {
      getViewImage(0);
      getCopiedContents(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterResults])

  const getScreenShots = async () => {
    let examMonitor = JSON.parse(localStorage.getItem('examMonitor'))
    let copyContent = examMonitor.copyPasteContent
    let currentCopyContent = _.filter(copyContent, (c) => c.questionId === props.questionId)
    let currentImages = props.screenShot
    _.map(currentCopyContent, (c) =>
      currentImages.push(c)
    )
    const orderedImages = _.orderBy(currentImages, ["time"])
    setImages(orderedImages)
    setFilterResults(orderedImages)
    let tabSwitchCounts = examMonitor.tabSwitchCounts
    let currentTabSwitchCount = _.filter(tabSwitchCounts, (t) => t.questionId === props.questionId)
    setSwitchCount(currentTabSwitchCount)
  }

  const getCopiedContents = (index) => {
    if (filterResults[index]?.content) {
      setShowCopyContents(true)
      setTime(filterResults[index].time)
      setViewContent(filterResults[index])
      setIndex(index)
    }
  }

  const getViewImage = (index) => {
    if (filterResults[index]?.base64String) {
      setViewImg(filterResults[index].base64String)
      setTime(filterResults[index].time)
      setShowCopyContents(false)
      setIndex(index)
    }
  }

  const filterBy = (e) => {
    setFilterValue(e.target.value)
    const value = e.target.value
    let results = []
    results = value === '' ? images : _.filter(images, (img) => value === 'SCREENSHOT' ? img.base64String : !img.base64String)
    setFilterResults(results)
  }

  return (
    <div >
      <div className="modal fade show" id="myModal" role="dialog" style={{ paddingRight: '15px', display: 'flex', backgroundColor: 'rgba(0,0,0,0.90)', justifyContent: 'center', alignItems: 'center' }} aria-hidden="true">
        <div className="col-lg-11 col-xs-11">
          <div className="modal-content" style={{ borderStyle: 'solid', borderColor: '#af80ecd1', borderRadius: "15px", height: '95vh', verticalAlign: "center" }}>
            <div className="modal-header" style={{ padding: "1rem", paddingBottom: "0rem", border: "none" }}>
              <span style={{ fontFamily: 'Baskervville', fontWeight: 400, fontSize: '2rem', paddingLeft: '1.5rem',width:'100%'}}>Question {props.questionIndex}</span>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', margin: '-10px 1rem 0 0' }} >
                <FormControl style={{ width: '10rem' }} >
                  <InputLabel id="demo-simple-select-label">Filter <i style={{ paddingLeft: '.5rem' }} className="fa fa-filter" aria-hidden="true"></i></InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={filterValue}
                    onChange={(e) => filterBy(e)}
                    sx={{
                      '.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'transparent',
                      },
                      '.MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      boxShadow: 'none',
                    }}
                  >
                    <MenuItem value={''}>All</MenuItem>
                    <MenuItem value={'SCREENSHOT'}>Camera Images</MenuItem>
                    <MenuItem value={'COPY CONTENT'}>Copied Contents</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <button type="button" onClick={props.onCloseModal} className="close" data-dismiss="modal">&times;</button>
            </div>
            <div className="modal-body">
              <Grid container spacing={3} style={{ paddingLeft: '2.5rem' }}>
                <Grid item xs={8}>
                  <List>
                    <div style={{ background: '#E6E6E6', height: '24.8rem', marginBottom: '1rem' }}>
                      {!showCopyContents && (viewImg || filterResults[0]?.base64String) ? <img alt="screenshot" style={{ height: '24.8rem', width: '100%' }} src={viewImg ? viewImg : filterResults[0]?.base64String} ></img> :
                        <div style={{ padding: '1rem 0 0 1rem' }}>
                          <span style={{ fontFamily: 'Montserrat', fontWeight: 400, fontSize: '1.5rem' }} >Copied Content</span>
                          <AutoResize maxRows={13.5} style={{ border: 'none', background: '#E6E6E6', width: '100%', height: '100% !important', outline: 'none', marginTop: '0.8rem' }} sx={{ color: "text.secondary" }} value={viewContent ? viewContent.content : filterResults[0]?.content}>
                          </AutoResize>
                        </div>}
                    </div>
                    <Divider style={{ backgroundColor: '#000000' }} />
                    <div >
                      <span style={{ float: 'right', marginTop: '1rem' }}>{time ? moment(time).format('LTS') : moment(filterResults[0]?.time).format('LTS')}</span>
                    </div>
                    <div className="dash-text" style={{ marginTop: '1rem' }}><span style={{ border: '1px solid black', padding: '.4rem', marginTop: '1rem', borderRadius: '8px',color:'red'}} >Number of Tab Switch Count - {_.size(switchCount) > 0 ? switchCount[0]?.count : 0}</span></div>
                  </List>
                </Grid>
                <Grid item xs={4}>
                  <div style={{ background: '#E6E6E6', height: 'calc(100vh  - 150px)', overflowY: 'auto', width: '15.25rem', marginTop: '0.5rem' }} >
                    {_.size(filterResults) > 0 ? _.map(filterResults, (s, i) => {
                      return <>
                        <TimelineContent>
                          <div onClick={filterResults[i].base64String ? () => getViewImage(i) : () => getCopiedContents(i)} style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
                            {s.base64String ? <div style={{ background: '#F05A28', cursor: 'pointer' }}><img onClick={() => getViewImage(i)} alt='screenshot' style={{ width: '106px', opacity: index === i ? '0.5' : '1' }} src={s.base64String} ></img></div> :
                              <div onClick={() => getCopiedContents(i)} style={{ background: index !== i ? '#FFFFFF' : '#F05A28', width: '106px', height: '65px', textAlign: 'center' }}>
                                <i style={{ color: '#3B489E', marginTop: '1.5rem', fontSize: '1.3rem' }} className="fa fa-file-text" aria-hidden="true"></i>
                              </div>}
                            <span style={{ fontSize: '15px', fontWeight: 400, fontFamily: 'Montserrat', margin: 'auto', color: s.suspect ? 'red' : 'green' }} >{moment(s.time).format('LTS')}</span>
                          </div>
                        </TimelineContent>
                        <div style={{ width: '92%', border: '2px solid white', margin: 'auto' }} ></div>
                      </>
                    }) : <div style={{ marginTop: '1rem', textAlign: 'center' }} >{filterValue === 'SCREENSHOT' ? "No Suspected Images" : "No Copied Contents"}</div>}
                  </div>
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsModel;
