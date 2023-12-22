import { withStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import React from 'react';


const StyleIconButton = withStyles(() => ({
  root:{
    fontFamily: 'Montserrat',
    fontSize: '14px',
    fontWeight: '700',
    color: '#3B489E',
    padding: '0px',
    '&:hover':{
      backgroundColor:'unset'
    }
  }
}))(IconButton);

const ITEM_HEIGHT = 48;

export default function BasicMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <StyleIconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
       {props.header.name} <i className="fa fa-filter" aria-hidden="true" style={{marginLeft: '0.5rem'}}></i>
      </StyleIconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
          },
        }}
        onClick={handleClose}
      >
        {props.header.renderOptions()}
      </Menu>
    </div>
  );
}