
import { Avatar } from "@mui/material";
import classes from "./styles.module.scss";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Person from '@mui/icons-material/Person';
import Logout from '@mui/icons-material/Logout';
import { useState } from "react";
import { useAppDispatch } from "@/redux/hook";
import { setUser } from "@/redux/reducers/user";
import { getCookies, setCookie, deleteCookie, getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation'
import { signOut } from "next-auth/react"
import Link from "next/link";
import { useTranslation , appWithTranslation } from 'next-i18next';
import SocketService from "@/services/socketService";

interface NavbarToggleProps {
  avatar: string;
  userName: string;
}
export default function NavbarToggle({avatar, userName }: NavbarToggleProps) {
  const socketService = SocketService.instance()
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);

  };
  const handleClose = (e:React.MouseEvent<HTMLElement>) => {
    setAnchorEl(null);
  };

  const logout = () => {
    socketService.close()
    signOut();
    deleteCookie('token');
    deleteCookie('userId');
    deleteCookie('userName');
    deleteCookie('role');
    dispatch(setUser(null));
    router.replace('/');
  }

  return (
    <div className={classes.navbarToggle}>
      <span>{t('welcome')}, {userName}</span>
      <div style={{ marginLeft: 10 }} onClick={handleClick}>
        {!avatar ? (
          <Avatar>H</Avatar>
        ) : (
          <Avatar>
            <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={`${avatar}`}></img>
          </Avatar>
        )}
      </div>
      <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={!!anchorEl}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Link className={classes.link}  href="/user/profile">
            <MenuItem  onClick={handleClose}>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              {t('profile')}
            </MenuItem>

          </Link>
          <MenuItem onClick={(e)=>{
            logout();
            handleClose(e);
          }}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            {t('logout')}
          </MenuItem>
        </Menu>
    </div>
  );
}
