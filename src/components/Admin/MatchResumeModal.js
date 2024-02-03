import React, { Component } from 'react'
import { CustomTable } from '../../utils/CustomTable';

export default class MatchResumeModal extends Component {
  constructor(props){
    super(props)
    this.state={
      headers:[]
    }
  }

  componentDidMount(){
    this.setTableJson()
  }
   setTableJson = () => {
    const headers = [
      {
        name: "S.NO",
        align: "center",
        key: "S.NO",
      },
      {
        name: "Name",
        align: "center",
        key: "name",
      },
      {
        name: "JobDescription Match",
        align: "center",
        key: "JobDescription Match",
      },
      {
        name: "Skills Match",
        align: "center",
        key: "Skills Match",
      },
      {
        name: "Missing Skills",
        align: "center",
        key: "Missing Skills",
      },
    ];
    this.setState({ headers: headers });
  };

  render(){
    return (
          <>
          <div className="modal fade show" id="myModal" role="dialog" style={{display: "block", backgroundColor: "rgba(0,0,0,0.90)"}} aria-hidden="true">
            <div className="modal-dialog-full-width" style={{borderRadius: "15px",height: "93vh",verticalAlign: "center",padding:'1rem'}}>
              <div className="modal-content" style={{ borderStyle: 'solid', borderColor: '#af80ecd1', borderRadius: "20px" }}>
                  <div className='modal-header' style={{ border: "none", height: "3rem",}}>
                    <span style={{ fontFamily: 'Baskervville', fontWeight: 400, fontSize: '1.7rem', paddingLeft: '1.5rem', width: '100%', color: '#3f51b5',paddingTop:'1rem' }}>Resume Match Data</span>
                    <button type="button" onClick={(e) => { this.props.onCloseModal(e) }} className="close" data-dismiss="modal">&times;</button>
                  </div>
                <div className="modal-body">
                <div  style={{height: 'calc(100vh - 7rem)', overflowY:'auto',padding:'1rem'}}>
                  <CustomTable
                  data={this.props.data}
                  headers={this.state.headers}
                  pageSize={10}
                  currentPage={1}
                  // loader={this.state.loader}
                  />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
        )}
  }
