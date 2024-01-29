import _ from 'lodash';
import React, { Component } from "react";

export default class FeedBackModel extends Component {
    state = {
        feedback: []
    }
    feedbackList = [
        {
            "id": 1,
            "status": "Good",
            "comment": "Good job on the exam and the questions. I am very happy with the result.",
        },
        {
            "id": 2,
            "status": "Average",
            "comment": "Good job on the exam and the questions. I am very happy with the result.",
        },
        {
            "id": 3,
            "status": "Good",
            "comment": "Good job on the exam and the questions. I am very happy with the result.",
        },
        {
            "id": 3,
            "status": "Average",
            "comment": "Good job on the exam and the questions. I am very happy with the result.",
        }
    ];
    componentDidMount() {
        this.setState({
            feedback: this.feedbackList
        })
    }

    render() {
        return (
            <div className="modal fade show" id="myModal" role="dialog" style={{ paddingRight: '15px', display: 'block', backgroundColor: 'rgba(0,0,0,0.4)' }} aria-hidden="true">
                <div className="col-md-8" style={{ margin: 'auto' }}>
                    <div className="modal-content" style={{ borderStyle: 'solid', borderColor: '#af80ecd1' }}>
                        <div className="modal-header" style={{ backgroundColor: '#808080' }}>
                            <h5 className="modal-title" style={{ color: 'white' }}>Feedback</h5>
                            <button type="button" onClick={this.props.onCloseModal} className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="row" style={{ margin: '10px' }}>
                            <div className="col-md" style={{ maxHeight: '450px', overflowY: 'scroll', background: 'ivory' }} >
                                {
                                    _.map(this.state.feedback, (fb, index) => {
                                        return (
                                            <div className="card" key={index}>
                                                <div className="card-body">
                                                    <h5 className="card-title">{fb.status}</h5>
                                                    <p className="card-text">{fb.comment}</p>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
