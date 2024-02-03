import { Box, Card, CardContent, Typography } from '@mui/material';
import axios from 'axios';
import ReactEcharts from "echarts-for-react";
import React, { Component } from 'react';
import { authHeader, errorHandler } from '../../api/Api';
import ProgressBar from '../Admin/ProgressBar';
import url from '../../utils/UrlConstant';

export default class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sectionCount: '',
            questionCount: '',
            sectionQuestionCount: [],
            sections: []
        }
    }

    componentDidMount() {
        axios.get(` ${url.ADMIN_API}/testadmin/dashboard`, { headers: authHeader() })
            .then(res => {
                const sections = this.getSections(res.data.response.sectionQuestionCount);
                this.setState({
                    sectionCount: res.data.response.sectionCount,
                    questionCount: res.data.response.questionCount,
                    sectionQuestionCount: res.data.response.sectionQuestionCount, sections: sections
                });
            })
            .catch(e => {
                errorHandler(e);
            })
    }

    getSections(data) {
        const sections = []
        let n = Object.keys(data).length;
        for (let i = 0; i < n; i++) {
            sections.push(Object.keys(data)[i]);
        }
        return sections;
    }

    getQuestionCountBySection = () => ({
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'center'
        },
        series: [
            {
                name: "Question Count",
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '40',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: this.state.sectionQuestionCount
            }
        ]
    });

    render() {
        return (
            <div>
                <div className='row'>
                    <div className="col" style={{ marginLeft: '15px' }}>
                        <Card style={{ width: '100%', height: '100%' }}>
                            <Box>
                                <CardContent>
                                    <Typography variant="h6" component="h6" style={{ color: '#72777a', fontSize: '15px' }}>
                                        <strong>Total Section Count</strong>
                                    </Typography>
                                </CardContent>
                                <ProgressBar barColor="#08A3D5" bgColor="#F4F4F4" progress={50} borderRadius={30} margin={10} width={30} value={this.state.sectionCount} unit="" height={10} />
                            </Box>
                        </Card>
                    </div>
                    <div className="col" style={{ marginLeft: '15px' }}>
                        <Card style={{ width: '100%', height: '100%' }}>
                            <Box>
                                <CardContent>
                                    <Typography variant="h6" component="h6" style={{ color: '#72777a', fontSize: '15px', fontWeight: "bold" }}>
                                        <b>Total Question Count</b>
                                    </Typography>
                                </CardContent>
                                <ProgressBar barColor="#08A3D5" bgColor="#F4F4F4" progress={50} borderRadius={30} margin={10} width={30} value={this.state.questionCount} unit="" height={10} />
                            </Box>
                        </Card>
                    </div>
                </div>
                <div className='row'>
                    <div className="col-12">
                        <div className='card-body' style={{ padding: "20px 10px 10px 10px" }}>
                            <strong>Question Count In Each Section</strong>
                            <ReactEcharts option={this.getQuestionCountBySection()} style={{ height: 400 }} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}