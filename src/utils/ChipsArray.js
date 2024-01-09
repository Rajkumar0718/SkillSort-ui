
import { Cancel } from '@mui/icons-material';
import { Chip, Paper, makeStyles  } from '@mui/material';
import React, { useEffect } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: theme.spacing(0.5),
    margin: 0,
    boxShadow: 'none',
  },
  chip: {
    margin: theme.spacing(0.5),
    textTransform: 'capitalize',
    fontWeight: '400',
    backgroundColor: '#3b489e !important',
    color: 'white',
    borderRadius:'5px !important'

  },
  deleteIcon :{
    color: 'white !important'
  }
}));

export default function ChipsArray(props) {
  const classes = useStyles();
  const [chipData, setChipData] = React.useState([]);

  useEffect(() => {
    if(props.chipperData) {
      setChipData(props.chipperData)
    }
  },[props])

  const handleDelete = (chipToDelete) => () => {
    props.handleDeleteChip(chipToDelete)
  };

  const renderChip = () => {
     if(chipData.length === 0)
        return "";
     return (
      <Paper component="ul" className={classes.root}>
      {chipData.map((data) => {
        return (
          <li key={data.key}>
            <Chip
              size="small"
              label={`${data.value}`}
              onDelete={handleDelete(data)}
              className={classes.chip}
              deleteIcon= {<Cancel style={{color: 'white',cursor: 'pointer'}}/>}
            />
          </li>
        );
      })}
    </Paper>
     )
  }

  return (
    renderChip()
  );
}