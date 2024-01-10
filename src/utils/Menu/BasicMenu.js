import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import { styled } from '@mui/material/styles';

const StyleIconButton = styled(IconButton)(({ theme }) => ({
  fontFamily: 'Montserrat',
  fontSize: '12px',
  fontWeight: '700',
  color: '#3B489E',
  padding: '0px',
  '&:hover': {
    backgroundColor: 'unset',
  },
}));

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
        {props.header.name} <i className="fa fa-filter" aria-hidden="true" style={{ marginLeft: '0.5rem' }}></i>
      </StyleIconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        // Replace PaperProps with slotProps.paper
        slotProps={{
          paper: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              // Add other styles here as needed
            },
          },
        }}
        onClick={handleClose}
      >
        {props.header.renderOptions()}
      </Menu>

    </div>
  );
}
