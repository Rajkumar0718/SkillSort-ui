import { Box, Button, ButtonGroup, Card, CardContent, Grid, Typography } from "@mui/material";
import _ from "lodash";
import { useState } from "react";
import ActivityReport from "./ActivityReport";


export function LogReport(props) {
  const [activeButton, setActiveButton] = useState('week'); // Set the initial active button
  const [type,setType] = useState('week')
  const [actionType,setActionType] = useState('signUp')

  const handleButtonClick = (type) => {
    props.setType(type); // Call the prop function to update the type in the parent component
    setActiveButton(type);
    setType(type)
  };

  const handleActionType = (action)=>{
    props.setActionType(action.type)
    setActionType(action.type)
  }

  const buttons = [
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
    { key: 'qtr', label: 'Qtr' },
  ];

  return (
    <div style={{marginRight:'1rem'}}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'end',
          '& > *': {
            m: 1,
          },
        }}
      >
        <ButtonGroup size='small'>
          {buttons.map(button => (
            <Button
              key={button.key}
              onClick={() => handleButtonClick(button.key)}
              style={{ backgroundColor: activeButton === button.key ? '#fc3f06' : '#3b489e', color: 'white' }}
            >
              {button.label}
            </Button>
          ))}
        </ButtonGroup>
      </Box>
      <Grid container spacing={4} style={{ justifyContent: 'space-around', marginTop: '1rem' }}>
        {_.map(props.actions,(action) => (
          <Grid item key={action.action} xs={12} sm={6} md={4} lg={2}>
            <Card elevation={actionType === action.type ? 20 : 5} onClick={() => handleActionType(action)} 
              style={{ backgroundColor: actionType === action.type ? "#fc3f06" : "#3b489e" }}>
              <CardContent style={{ color: "white" }}>
                <Typography variant="h6" align="center">{action.icon}   {action.action}</Typography>
                <Typography variant="h3" align="center">
                  {action.count}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
        <ActivityReport duration={type} type ={actionType}/>
    </div>
  )
}
