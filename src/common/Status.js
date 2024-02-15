import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import _ from 'lodash';
export default function BasicMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);


  const handleClick = (event, menu) => {
    setAnchorEl(event.currentTarget);
    props.onClick(event, menu);
    if(menu) setAnchorEl(null)
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <p className="vac-result" style={{ marginBottom: '0 !important' }}
        // aria-controls={open ? 'basic-menu' : undefined}
        // aria-haspopup="true"
        // aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Status<span><i class="fa fa-filter" aria-hidden="true"></i>
        </span>
      </p>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {_.map(props.menuItem, menu => (
          <MenuItem onClick={(e) => handleClick(e, menu)} >{menu}</MenuItem>
        ))}
      </Menu>
    </div>
  );
}
