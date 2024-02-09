import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import _ from 'lodash';

export default function BasicMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event, menu) => {
    setAnchorEl(event.currentTarget);
    if (menu) setAnchorEl(null)
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ position: "relative", top: ".5rem" }}>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        style={{ backgroundColor: "#F05A28", color: "white", textTransform: 'none', width: '6rem', borderRadius: '6px' }}
      >
        Download
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {_.map(props.menuItem, menu => <MenuItem onClick={(e) => {
          props.onClick(e, menu);
          handleClose();
        }}>{menu}</MenuItem>)}

      </Menu>
    </div>
  );
}
