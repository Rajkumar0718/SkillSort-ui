import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/system';
import CancelIcon from '@mui/icons-material/Cancel';
import React, { useEffect } from 'react';

const StyledChip = styled(Chip)(({ theme }) => ({
 margin: theme.spacing(0.5),
 textTransform: 'capitalize',
 fontWeight: '400',
 backgroundColor: '#3b489e !important',
 color: 'white',
 borderRadius:'5px !important'
}));

const StyledDeleteIcon = styled(CancelIcon)(({ theme }) => ({
 color: 'white !important'
}));

export default function ChipsArray(props) {
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
    <Paper 
      sx={{
        display: 'flex',
        // justifyContent: 'space-between',
        flexWrap: 'nowrap',
        listStyle: 'none',
        // p: 0.5,
        // m: 0,
        boxShadow:'none',
        // borderBottom: 'none', // Removes the bottom border
      }}
      component="ul"
    >
    {chipData.map((data) => {
      return (
        <li key={data.key}>
          <StyledChip
            size="small"
            label={`${data.value}`}
            onDelete={handleDelete(data)}
            deleteIcon= {<StyledDeleteIcon style={{cursor: 'pointer'}}/>}
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
