import { Box, Card, CardContent, Typography } from '@mui/material';
import axios from 'axios';
import ReactEcharts from "echarts-for-react";
import _ from 'lodash';
import React, { Component } from 'react';
import { authHeader } from '../../api/Api';
import url from '../../utils/UrlConstant';
import ProgressBar from './ProgressBar';


export default class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            exams: [],
            notifiedCount: 0,
            selectedCount: 0,
            sections: [],
            notifiedData: [],
            selectedData: [],
            sectionData: []
        }
    }

    countStatus = (key) => {
        let count = 0;
        for (let index = 0; index < key.length; index++) {
            count = count + key[index].statusCount
        }
        return count;
    }

    componentDidMount() {
        const user = JSON.parse(localStorage.getItem("user"));
        axios.get(` ${url.ADMIN_API}/admin/dashboard?companyId=${user.companyId}&status=NOTIFIED_TO_SKILL_SORT`, { headers: authHeader() })
            .then(res => {
                const notified = this.countStatus(res.data.response);
                this.setState({
                    exams: res.data.response, notifiedCount: notified
                })
                _.map(res.data.response, (value, index) => {
                    const activeData = {};
                    activeData.name = value.examName;
                    activeData.value = value.statusCount;
                    this.setState({ sections: [...this.state.sections, value.examName], notifiedData: [...this.state.notifiedData, activeData] })
                })
            })
        axios.get(` ${url.ADMIN_API}/admin/dashboard?companyId=${user.companyId}&status=SCHEDULED`, { headers: authHeader() })
            .then(res => {
                const notified = this.countStatus(res.data.response);
                this.setState({
                    selectedCount: notified
                })
                _.map(res.data.response, (value, index) => {
                    const activeData = {};
                    activeData.name = value.examName;
                    activeData.value = value.statusCount;
                    this.setState({ selectedData: [...this.state.selectedData, activeData] })
                })
            })
    }


    onChartClick = () => {
        this.props.history.push('/admin/result', 'skillsort')
    }

    onEchartClick = () => {
        this.props.history.push('/admin/skillsort', 'skillsort')
    }

    getOption = (key, value) => ({
        title: {
            text: value,
            x: "center"
        },
        tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: "horizontal",
            left: "center",
            y: "bottom",
            data: this.state.sections
        },
        series: [
            {
                name: value,
                type: "pie",
                radius: "55%",
                center: ["50%", "50%"],
                data: key,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: "rgba(0, 0, 0, 0.5)"
                    }
                }
            }
        ]
    });

    render() {
        let onEvents = {
            'click': this.onChartClick.bind(this)

        }
        let _event = {
            'click': this.onEchartClick.bind(this)

        }
        return (
            <div>
                <div className="row">
                    <div className="col" style={{ marginLeft: '15px' }}>
                        <Card style={{ width: '100%', height: '100%' }}>
                            <Box>
                                <CardContent>
                                    <Typography variant="h6" component="h6" style={{ color: '#72777a', fontSize: '15px' }}>
                                        <strong>Total Active Tests</strong>
                                    </Typography>
                                </CardContent>
                                <ProgressBar barColor="#08A3D5" bgColor="#F4F4F4" progress={50} borderRadius={30} margin={10} width={30} value={this.state.exams.length} unit="" height={10} />
                            </Box>
                        </Card>
                    </div>
                    <div className="col" style={{ marginLeft: '15px' }}>
                        <Card style={{ width: '100%', height: '100%' }}>
                            <Box>
                                <CardContent>
                                    <Typography variant="h6" component="h6" style={{ color: '#72777a', fontSize: '15px', fontWeight: "bold" }}>
                                        <b>Total SkillSort Notified Count</b>
                                    </Typography>
                                </CardContent>
                                <ProgressBar barColor="#08A3D5" bgColor="#F4F4F4" progress={50} borderRadius={30} margin={10} width={30} value={this.state.notifiedCount} unit="" height={10} />
                            </Box>
                        </Card>
                    </div>
                    <div className="col" style={{ marginLeft: '15px' }}>
                        <Card style={{ width: '100%', height: '100%' }}>
                            <Box>
                                <CardContent>
                                    <Typography variant="h6" component="h6" style={{ color: '#72777a', fontSize: '15px' }}>
                                        <b>Total Internally Scheduled Count</b>
                                    </Typography>
                                </CardContent>
                                <ProgressBar barColor="#08A3D5" bgColor="#F4F4F4" progress={50} borderRadius={30} margin={10} width={30} value={this.state.selectedCount} unit="" height={10} />
                            </Box>
                        </Card>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-6'>
                        <ReactEcharts option={this.getOption(this.state.notifiedData, "NOTIFIED COUNT")} style={{ margin: "20px 0px 30px 0px", height: 400, width: 500 }} onEvents={_event} />
                    </div>
                    <div className='col-6'>
                        <ReactEcharts option={this.getOption(this.state.selectedData, "INTERNALLY SCHEDULED COUNT")} style={{ margin: "20px 0px 30px 0px", height: 400, width: 500 }} onEvents={onEvents} />
                    </div>
                </div>
            </div>
        );
    }
}
