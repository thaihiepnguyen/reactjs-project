"use client";
import { Button, Grid, Icon, ListItem, MenuList, Popper, ClickAwayListener, Paper, IconButton, List, ListItemText, Divider } from "@mui/material";
import classes from "./styles.module.scss";
import { PersonOutline, Loop, Logout, Payment, KeyboardDoubleArrowLeft } from "@mui/icons-material";
import { useMemo } from "react";
import { routes } from "@/app/routers/routes";
import clsx from "clsx";
import EditProfile from "@/app/components/EditProfile"

export default function Profile() {
  const dataMenuList = useMemo(() => {
    return [
      {
        icon: PersonOutline,
        name: "Edit Profile",
      },
      {
        icon: Loop,
        name: "Change Password",
      },
    ];
  }, []);

  const links = (
    <List>
      {dataMenuList.map((route, key) => {
        return (
          <ListItem button key={key} className={clsx(classes.border, { [classes.borderActive]: key === 0 })}>
            {typeof route.icon === "string" ? <Icon>{route.icon}</Icon> : <route.icon />}
            <ListItemText className={classes.routeName} primary={route.name} disableTypography={true} />
          </ListItem>
        );
      })}
      <Divider />
      <Button className={classes.btnLogout} onClick={() => {}}>
        <Logout />
        <p>Log out</p>
      </Button>
    </List>
  );

  return (
    <>
      <Grid className={classes.main}>
        <div className={classes.menuList}>{links}</div>
        <div className={classes.content}>
          <EditProfile/>
        </div>
      </Grid>
    </>
  );
}
