import Sidebar from "../components/Sidebar";
import classes from "./styles.module.scss";

export default function SidebarLayout({children}: {
  children: React.ReactNode
}) {
  return <div className={classes.sidebarLayout}>
    <Sidebar></Sidebar>
    <div className={classes.content}>
      {children}
    </div>
  </div>
}