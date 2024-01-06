import classes from "./styles.module.scss";

export default function SidebarLayout({children}: {
  children: React.ReactNode
}) {
  return <div className={classes.sidebarLayout}>
    <div className={classes.content}>
      {children}
    </div>
  </div>
}