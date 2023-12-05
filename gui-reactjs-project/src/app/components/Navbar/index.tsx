"use client";

import { Avatar, Button } from "@mui/material";
import Link from "next/link";
import { routes } from "@/app/routers/routes";
import classes from "./styles.module.scss";
import { BrandingWatermarkRounded } from "@mui/icons-material";
import { useAppSelector } from "@/redux/hook";
import NavbarToggle from "@/app/components/Navbar/NavbarToggle";

export default function Navbar() {
  const { user } = useAppSelector((state) => state.userReducer);

  return (
    <nav className={classes.nav}>
      {/*<Button variant="outlined" onClick={onClick}>Redux counter reducer: {value}</Button>*/}
      <div>
        <Link href={routes.home} className={classes.home}>
          <BrandingWatermarkRounded style={{ marginRight: 10 }} />
          Classroom
        </Link>
      </div>
      {!user ? (
        <div className={classes.loginContainer}>
          <Link className={classes.link} href={routes.register}>
            <Button variant="outlined">Register</Button>
          </Link>
          <Link className={classes.link} href={routes.login}>
            <Button variant="outlined">Login</Button>
          </Link>
        </div>
      ) : (
        <NavbarToggle avatar={user.avatarUrl} userName={user.fullname}></NavbarToggle>
      )}
    </nav>
  );
}
