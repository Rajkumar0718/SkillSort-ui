import React from 'react'

const Dashboard = () => {

    const [interviewAllocationPendingCount, setInterviewAllocationPendingCount] = useState(0);
  const [feedbackPendingFromPanelistCount, setFeedbackPendingFromPanelistCount] = useState(0);
  const [feedbackForwardPendingCount, setFeedbackForwardPendingCount] = useState(0);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    axios.get(`${url.ADMIN_API}/process/interviewAllocationPendingCount?authId=${user.id}`, { headers: authHeader() })
      .then(res => setInterviewAllocationPendingCount(res.data.response));

    axios.get(`${url.ADMIN_API}/process/feedbackPendingFromPanelistCount?authId=${user.id}`, { headers: authHeader() })
      .then(res => setFeedbackPendingFromPanelistCount(res.data.response));

    axios.get(`${url.ADMIN_API}/process/feedbackForwardPendingCount?authId=${user.id}`, { headers: authHeader() })
      .then(res => setFeedbackForwardPendingCount(res.data.response));

    axios.get(`${url.ADMIN_API}/process/interviewAllocationPendingCountByCompany?authId=${user.id}`, { headers: authHeader() })
      .then(res => setAdmins(res.data.response));

  }, []);

  const name = () => {
    return interviewAllocationPendingCount === 0 ? 'No Pending' : 'Total Pending Count';
  };

  const getCountByCompany = () => ({
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: name(),
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
        data: admins
      }
    ]
  });
  return (
    <div>
                <div className="row">
                    <div className="col" style={{ marginLeft: '15px' }}>
                        <Card style={{ width: '100%', height: '100%' }}>
                            <Box>
                                <CardContent>
                                    <Typography variant="h6" component="h6" style={{ color: '#72777a', fontSize: '15px' }}>
                                        <b>Total Interview Allocation Pending Count</b>
                                    </Typography>
                                </CardContent>
                                <ProgressBar barColor="#08A3D5" bgColor="#F4F4F4" progress={50} borderRadius={30} margin={10} width={30} value={interviewAllocationPendingCount} unit="" height={10} />
                            </Box>
                        </Card>
                    </div>
                    <div className="col" style={{ marginLeft: '15px' }}>
                        <Card style={{ width: '100%', height: '100%' }}>
                            <Box>
                                <CardContent>
                                    <Typography variant="h6" component="h6" style={{ color: '#72777a', fontSize: '15px' }}>
                                        <strong>Feedback pending from panelist count</strong>
                                    </Typography>
                                </CardContent>
                                <ProgressBar barColor="#08A3D5" bgColor="#F4F4F4" progress={50} borderRadius={30} margin={10} width={30} value={feedbackPendingFromPanelistCount} unit="" height={10} />
                            </Box>
                        </Card>
                    </div>
                    <div className="col" style={{ marginLeft: '15px' }}>
                        <Card style={{ width: '100%', height: '100%' }}>
                            <Box>
                                <CardContent>
                                    <Typography variant="h6" component="h6" style={{ color: '#72777a', fontSize: '15px', fontWeight: "bold" }}>
                                        <b>Feedback not forward to companies count</b>
                                    </Typography>
                                </CardContent>
                                <ProgressBar barColor="#08A3D5" bgColor="#F4F4F4" progress={50} borderRadius={30} margin={10} width={30} value={feedbackForwardPendingCount} unit="" height={10} />
                            </Box>
                        </Card>
                    </div>
                </div>
                <div className='row'>
                    {/* <div className='col-3'></div> */}
                    <div className="col-6">
                        <div className='card-body'>
                            <strong>Allocation pending count by company</strong>
                            <ReactEcharts option={getCountByCompany()} style={{ height: 400 }} />
                        </div>
                    </div>
                    {/* <div className='col-3'></div> */}
                </div>
            </div>
  )
}

export default Dashboard