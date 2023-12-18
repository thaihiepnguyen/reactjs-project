import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axiosInstance from "@/app/routers/axios";
import Swal from "sweetalert2";
import { useAppDispatch } from '@/redux/hook';
import { getEnrolledCourse, getMyCourse } from '@/redux/reducers/courses';



const ITEM_HEIGHT = 30;

export default function MenuCourses({id, isOwn}) {
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [options, setOption] = React.useState<string[]>([]);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(null);
  };

  React.useEffect(() => {
    if (isOwn) {
      setOption(["Remove course"])
    } else {
      setOption(["Leave course"])
    }
  }, [isOwn])

  const removeCourse = async () => {
    setAnchorEl(null);
    const response = await axiosInstance.put(`courses/remove/${id}`)
    if (response.data.statusCode === 200) {
      await Swal.fire({
        title: response.data.message,
        text: 'Congratulations!',
        icon: 'success',
      })
      dispatch(getEnrolledCourse());
      dispatch(getMyCourse());
    }
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
          <MenuItem key={option} selected={option === 'Pyxis'} onClick={removeCourse}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}