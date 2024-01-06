import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useAppSelector } from '@/redux/hook';
import { Course } from '@/models/course';

interface Props {
  course: Course;
}
export default function PositionedMenu({course}: Props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onCopyLink = () => {
    navigator.clipboard.writeText(`${process.env.GUI_URL}/join-class/?code=${course.classCode ?? ""}`);
    handleClose();
  }

  const onCopyCode = () => {
    navigator.clipboard.writeText(course.classCode ?? "");

    handleClose();
  }
  return (
    <div>
      <Button
        id="demo-positioned-button"
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
      <div style={{width: '0.51px'}}>
        <MoreVertIcon />
      </div>
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={onCopyLink}>Copy Link</MenuItem>
        <MenuItem onClick={onCopyCode}>Copy the code</MenuItem>
        {/* <MenuItem onClick={handleClose}>Close</MenuItem> */}
      </Menu>
    </div>
  );
}
