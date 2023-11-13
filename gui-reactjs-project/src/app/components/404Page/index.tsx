import Link from "next/link";
import classes from "./styles.module.scss";
import clsx from "clsx";
import { routes } from "@/app/routers/routes";
const LandingPage = () => {
  return (
    <div className={classes.container}>
      <div id="error-page">
        <div className={classes.content}>
          <h2 className={classes.header} data-text="404">
            404
          </h2>
          <h4 data-text="Opps! Page not found">Opps! Page not found</h4>
          <p>Sorry, the page you're looking for doesn't exist. If you think something is broken, report a problem.</p>
          <div className={classes.btns}>
            <Link href={routes.home}>return home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
