import React, { Component } from 'react'
import AutoComplete from '../../common/AutoComplete'

export default class VacancyAddExamModal extends Component {
    state={
      showAddExam:true
    }
    setCloneExam=(e)=>{
        this.props.selectExam(e);
        if(e){
        this.setState({showAddExam:false})}
        else{
            this.setState({showAddExam:true})
        }
    }

  render() {
    return (
    <div className="modal fade show" id="myModal" role="dialog" style={{ paddingRight: '15px', display: 'flex', justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.90)' }} aria-hidden="true">
        <div className="modal-dialog" style={{ width: "625px", maxWidth: "670px" }}>
            <div className="modal-content" style={{ borderStyle: 'solid', borderColor: '#af80ecd1', borderRadius: "32px",position:'relative'}}>
                <div className="modal-body" style={{position:'relative',paddingTop: "5px",left:'35px'}}>
                    <label className="form-label input-label" for="inputSection" style={{position:'relative',top:'30px',right:'10px'}}>Available Exam</label>
                    <div ><AutoComplete style={{minWidth:'225px !important', width:'225px'}}  isObject={true} displayLabel={"Select Exam"} width={230} selectExam={this.setCloneExam} data={this.props.data} displayValue={"name"} ></AutoComplete></div>
                    <button disabled={this.state.showAddExam} onClick={this.props.sendCloneExam}  className="btn btn-sm btn-prev" style={{position:'relative',left:'60px',top:'35px'}}>{'Continue'}</button>
                </div>

              <div>
                    <span style={{position:'absolute',background:'black',width:'1px',height:'40%',left:'323px',bottom:'110px'}}></span>
                    <span style={{position:'absolute',left:'312px', top:'106px',fontSize:'16px'}}>OR</span>
                    <span style={{position:'absolute',background:'black',width:'1px',height:'40%',left:'323px',bottom:'5px'}}></span>
                </div>
                <div style={{display:"flex",justifyContent:"flex-end"}}>
                <button type="button" className="btn btn-sm btn-nxt" disabled={!this.state.showAddExam} onClick={this.props.addExam} title="Add Exam" style={{position:'relative',left:'400px',bottom:'60px',marginRight:"28rem"}}>ADD EXAM</button>
                    <button type="button" onClick={this.props.onCloseModal} className="close" data-dismiss="modal" style={{position:'relative',bottom:'150px',border:"none",backgroundColor:"initial",fontSize:"3rem",color:'coral',marginRight:"1rem",height:"3Exam-addrem"}}>&times;</button>
                </div>
            </div>
        </div>
    </div>
    )
  }
}


