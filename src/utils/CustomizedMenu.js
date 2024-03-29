import { ThemeProvider, Typography, useTheme } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/system';
import { Code, Info } from '@mui/icons-material';
import React from 'react';

const StyledMenu = styled(Menu)(({ theme }) => ({
  paper: {
    border: '1px solid #d3d4d5',
  },
}));

export default function CustomizedMenus(props) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
    root: {
      '&:focus': {
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
          color: theme.palette.common.black,
        },
      },
    },
  }));


  const handleClick = (event) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleHelp = (type) => {
    handleClose();
    props.handleHelp(type);
  };

  return (
    <div>
      <button
        aria-controls="customized-menu"
        aria-haspopup="true"
        variant="contained"
        color="primary"
        className={`btn btn-sm ${!props.name ? 'btn-prev' : 'btn-nxt'}`}
        onClick={handleClick}
        disabled={!props.disable}
        style={{ textTransform: 'none', height: '2rem', opacity: !props.disable ? '0.5' : '1.0', cursor: !props.disable ? 'not-allowed' : 'pointer', backgroundColor: !props.name ? '#3f51b5' : '#F05A28', color: 'white' }}
      >
        <Typography> {!props.name ? 'Need Help' : 'Took Help'}   <i class={!props.name ? "fa fa-question" : "fa fa-lightbulb-o"} aria-hidden="true" style={{ color: !props.name ? '#F05A28' : '#3f51b5', marginLeft: '0.4rem' }} /></Typography>
      </button>
      <ThemeProvider theme={theme}>
        <StyledMenu
          id="customized-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <StyledMenuItem disabled={props.disableHint} onClick={() => handleHelp('hint')}>
            <ListItemIcon>
              <Info fontSize="small" style={{ color: props.hintColor }} />
            </ListItemIcon>
            <ListItemText primary={<Typography type="body2" style={{ color: props.hintColor }}>Logic</Typography>} />
          </StyledMenuItem>
          <StyledMenuItem disabled={props.disablePseudo} onClick={() => handleHelp('pseudocode')}>
            <ListItemIcon>
              <Code fontSize="small" style={{ color: props.pseudoColor }} />
            </ListItemIcon>
            <ListItemText primary={<Typography type="body2" style={{ color: props.pseudoColor }}>pseudocode</Typography>} />
          </StyledMenuItem>
        </StyledMenu>
      </ThemeProvider>

    </div>
  );
}
