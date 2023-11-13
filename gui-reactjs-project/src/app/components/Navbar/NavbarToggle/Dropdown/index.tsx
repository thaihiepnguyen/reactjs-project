import classes from './styles.module.scss';
import Cookies from "universal-cookie/es6";
import {AccountCircle, ExitToApp, Help, NightsStay, Settings, ShoppingBasket} from "@mui/icons-material";


const menusIcon = [
  <AccountCircle/>,
];
export const Dropdown = () => {
  const menus = [
    {name: 'User Profile', link: `/user/profile`},
  ];
  const Logout = () => {
    const cookies = new Cookies();
    cookies.remove('token');
    cookies.remove('userId');
    cookies.remove('userName');
    window.location.reload();
  }
  return (
    <ul className={classes.menusContainer}>
      {
        menus.map((menu, index) => {
          return (
            <a className={classes.menusItemContainer} key={index} href={`${menu.link}`}>
              {menusIcon[index]}
              <li className={classes.menusItem}>
                {menu.name}
              </li>
            </a>
          )
        })
      }
      <div className={classes.menusItemContainer}>
        <ExitToApp/>
        <li className={classes.menusItem} onClick={Logout}>Đăng xuất</li>
      </div>
    </ul>
  );
}