import classes from './styles.module.scss';

import {AccountCircle, ExitToApp} from "@mui/icons-material";
import Link from "next/link";
import {routes} from "@/app/routers/routes";
import {deleteCookie} from 'cookies-next';
import { useAppDispatch } from "@/redux/hook";
import { setUser } from "@/redux/reducers/user";
import SocketService from "@/services/socketService";


const menusIcon = [
  <AccountCircle/>,
];
export const Dropdown = () => {
  const socketService = SocketService.instance()
  const dispatch = useAppDispatch();
  const menus = [
    {name: 'User Profile', link: `/user/profile`},
  ];
  const Logout = () => {
    socketService.close()
    deleteCookie('token');
    deleteCookie('userId');
    deleteCookie('userName');
    deleteCookie('role');
    dispatch(setUser(null));
  }
  return (
    <ul className={classes.menusContainer}>
      {
        menus.map((menu, index) => {
          return (
            <Link href={routes.profile}  className={classes.menusItemContainer} key={index}>
              {menusIcon[index]}
              <li className={classes.menusItem}>
                {menu.name}
              </li>
            </Link>
          )
        })
      }
      <div className={classes.menusItemContainer}>
        <ExitToApp/>
        <Link href={"/"} className={classes.menusItem} onClick={Logout}>Logout</Link>
      </div>
    </ul>
  );
}