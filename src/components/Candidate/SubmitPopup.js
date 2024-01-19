import React, { Component } from "react";

export default class SubmitPopup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text: '',
            error: false,
            errorMessage: ''
        }
    }


    render() {
        return (
            <div className="modal fade show" id="myModal" role="dialog" style={{ display: 'flex', justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.90)' }} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "625px" }}>
                    <div className="modal-content" style={{ borderStyle: 'solid', borderColor: '#af80ecd1', borderRadius: "32px" }}>
                        <div className="modal-header" style={{ border: "none", textAlign: "center" }}>

                            <button type="button" onClick={() => { this.props.close() }} className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div>
                            <h5 className="setting-title" style={{ textAlign: "center", margin: "auto" }}>Confirm to submit</h5>
                        </div>
                        <div className="modal-body" style={{ PaddingTop: "0px" }}>
                            <div className="form-row">
                                <div className="form-group col-12" style={{ textAlign: "center" }}>
                                    <h5 style={{ fontWeight: "400", color: "#000000" }} >{!localStorage.getItem("practiceExamId") ? "Once the test has been submitted it can't be re-taken, Make sure you have attended all the questions." : "Thank you for taking practice Exam, Make sure you have attended all the questions."}</h5>
                                </div>
                            </div>
                            <div className="form-group row" style={{ marginTop: "10px" }}>
                                <div className="col-md-3"></div>
                                <div className="col-md-3">
                                    <button className="btn btn-sm btn-nxt" onClick={() => { this.props.submit() }}>Yes</button>
                                </div>
                                <div className="col-md-6">
                                    <button className="btn btn-sm btn-prev" onClick={() => { this.props.close() }}>No</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}