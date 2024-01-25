import React from 'react';
import { Link } from "react-router-dom";

const CompetitorDetails = (props) => {
    let action = props.location.state;

    return (
        <main className="main-content bcg-clr">
            <div>
                <div className="container-fluid cf-1">
                    <div className="card-header-new">
                        <span>
                            Competitor Details
                        </span>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="table-border-cr">
                                <div className="send-header">
                                    <div className="row">
                                        {/* ... rest of your JSX remains unchanged */}
                                    </div>

                                    {/* ... rest of your JSX remains unchanged */}

                                    <div className="form-group row">
                                        <div className="col-md-10"><br></br>
                                            <Link className="btn btn-secondary" to="/individualUser">Back</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default CompetitorDetails;
