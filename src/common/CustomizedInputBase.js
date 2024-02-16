
import Tick from '@mui/icons-material/Check';
import Copy from '@mui/icons-material/FileCopy';
import React, { useState } from 'react';

import { Button, Divider, IconButton, InputBase, Paper } from '@mui/material';
import { styled } from '@mui/system';
import { FaLink } from 'react-icons/fa';

const StyledIconButton = styled(InputBase)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  flex: 1,
  color: 'black !important'
}));

export default function CustomizedInputBase(props) {
  const [copied, setCopied] = useState(false)
  const link = props.value;

  const copyTextToClipBoard = () => {
    navigator.clipboard?.writeText(link)
    setCopied(true)
  }

  const onClick = () => {
    setCopied(false);
    props.onClick();
  }

  return (
    <Paper component="form" sx={{padding:'2px 4px',display: 'flex', alignItems:'center',width:600}}>
      <IconButton style={{padding:10, cursor: 'pointer'}} aria-label="menu">
        {copied && link ? <Tick style={{ color: 'green' }} /> : <Copy onClick={() => copyTextToClipBoard()} />}
      </IconButton>
      <StyledIconButton
        value={link}
        disabled
        placeholder="Generate public exam url"
        inputProps={{ 'aria-label': 'search google maps' }}
      />

      <Divider style={{height: 28, margin: 4 }} orientation="vertical" />
      <Button color="primary" style={{ padding: 10, cursor: 'pointer' }} aria-label="directions" onClick={onClick} disabled={props.isLinkDisabled}>
        <FaLink color={props.isLinkDisabled ? 'grey' : '#3b489e'} title='Generate Public url' />&nbsp; Generate Link
      </Button>
    </Paper>
  );
}
