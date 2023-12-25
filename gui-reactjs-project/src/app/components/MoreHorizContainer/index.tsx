import { MoreHoriz } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";
import axiosInstance from "@/app/routers/axios";
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import Swal from "sweetalert2";
import React from "react";


export default function MoreHorizContainer({studentId, courseId, onBanStudent}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  async function banStudent(studentId: number, courseId: number) {
    const response = await axiosInstance.delete(`courses/ban-student/${studentId}/from/${courseId}`);
    if (response.data.statusCode === 200) {
      Swal.fire({
        title: 'Success!',
        text: 'Ban the student successfully',
        icon:'success',
      }).then(() => {
        onBanStudent();
      })
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Something error',
        icon:'error',
      });
    }
  } 

  return (
    <div>
      <IconButton
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MoreHoriz/>
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem sx={{color: 'red'}} onClick={() => {
          handleClose();
          banStudent(studentId, +courseId)
        }}>
        <DoDisturbIcon sx={{mr: 1}}/>
        Remove
        </MenuItem>
      </Menu>
    </div>
  )
}