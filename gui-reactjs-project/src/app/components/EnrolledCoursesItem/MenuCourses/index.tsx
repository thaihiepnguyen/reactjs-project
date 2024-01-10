import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axiosInstance from "@/app/routers/axios";
import Swal from "sweetalert2";
import { useAppDispatch } from '@/redux/hook';
import { getEnrolledCourse } from '@/redux/reducers/courses';

const options = [
  'Unenroll course',
];

const ITEM_HEIGHT = 30;

export default function MenuCourses({id}) {
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    event.preventDefault();
    event.stopPropagation();
  };
  const UnenrollCourse = async () => {
    setAnchorEl(null);
    const response = await axiosInstance.put(`courses/un-enroll/${id}`)
    if (response.data.statusCode === 200) {
      await Swal.fire({
        title: response.data.message,
        text: 'Congratulations!',
        icon: 'success',
      })
      dispatch(getEnrolledCourse());
    }
  };

  const handleClose = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(null);
  }

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        style={{color: '#fff'}}
      >
        <MoreVertIcon />
      </IconButton>
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
            width: '15ch',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} selected={option === 'Pyxis'} onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            UnenrollCourse();
          }}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}