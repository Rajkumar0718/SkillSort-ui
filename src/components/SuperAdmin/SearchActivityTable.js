import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import url from '../../utils/UrlConstant';
import axios from 'axios';
import { authHeader, errorHandler } from '../../api/Api';

export function SearchActivityTable(props) {
    const [positions, setPositions] = useState();
    const data = props.data

    useEffect(() => {
        getPosition()
    }, [props])

    const getPosition = () => {
        let ids = []
        _.map(data, d => {
            ids.push(d.advanceSearchDto?.positionId)
        })
        axios.get(`${url.ADMIN_API}/position/retrive/?ids=${ids}`, { headers: authHeader() })
            .then(res => {
                setPositions(res.data.response)
            }).catch((error) => {
                errorHandler(error)
            })
    }

    return (
        <main className="main-content bcg-clr">
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="table-border">
                            <div>
                                <div className="table-responsive pagination_table">
                                    <table className="table table-striped" id="dataTable">
                                        <thead className="table-dark" style={{ textAlign: 'center' }}>
                                            <tr>
                                                <th>S.No</th>
                                                <th style={{ textAlign: 'left' }}>Company Name</th>
                                                <th style={{ textAlign: 'left' }}>Date</th>
                                                <th style={{ textAlign: 'left' }}>Average Mark</th>
                                                <th style={{ textAlign: 'left' }}>Technology</th>
                                                <th style={{ textAlign: 'left' }}>Position</th>
                                            </tr>
                                        </thead>
                                        <tbody style={{ textAlign: 'center' }}>
                                            {_.size(data) > 0 ? (
                                                _.map(data || [], (d, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td style={{ textAlign: 'center' }}>{20 * (props.currentPage - 1) + (index + 1)}</td>
                                                            <td style={{ textAlign: 'left' }}>{d.companyName}</td>
                                                            <td style={{ textAlign: 'left' }}>{moment(d.date).format('DD-MM-YYYY')}</td>
                                                            <td style={{ textAlign: 'left' }}>{d.advanceSearchDto?.averageMark}</td>
                                                            <td style={{ textAlign: 'left' }}>{d.advanceSearchDto?.technology}</td>
                                                            <td style={{ textAlign: 'left' }}>{positions ? positions[d.advanceSearchDto?.positionId] : null}</td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr className="text-center">
                                                    <td colSpan="8">No data available in table</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
