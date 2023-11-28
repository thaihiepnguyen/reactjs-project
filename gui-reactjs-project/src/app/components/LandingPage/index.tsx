'use client'
import Link from "next/link";
import classes from "./styles.module.scss";
import clsx from "clsx";
import { routes } from "@/app/routers/routes";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const LandingPage = () => {
  const searchPrms = useSearchParams();
  const redirect = searchPrms.get('redirect')
  if(redirect) {
    if(typeof window !== "undefined") {
      window.location.reload();
    window.location.href = '/home';
    }
  }


  return (
    <>
      <div className={classes.header__info}>
        <div className={classes.header__info_description}>
          <h1>Education for everyone in the internet</h1>
          <p>
            Thousands of people around the world are already learning new things in <strong>lessins</strong>, what are you waiting for to join?
          </p>
          <div className={classes.header__buttons}>
            <Link href={routes.login} className={clsx([classes.btn, classes.btn_black])}>Join us</Link>
            <button className={classes.btn}>Contact sales &gt;</button>
          </div>
        </div>
        <div className={classes.header__info_image}>
          <img src="./images/phone-1.png" alt="" />
        </div>
      </div>

      <div className={classes.header__companies}>
          <img
            src="./images/insta-cart.PNG"
            alt=""
            className={classes.header__companies_img}
          />
          <img
            src="./images/salesforce-logo.png"
            alt=""
            className={classes.header__companies_img}
          />
          <img
            src="./images/amazon-logo.png"
            alt=""
            className={classes.header__companies_img}
          />
          <img
            src="./images/slack-logo.png"
            alt=""
            className={classes.header__companies_img}
          />
          <img
            src="./images/shopify-logo.png"
            alt=""
            className={classes.header__companies_img}
          />
          <img
            src="./images/google-logo.png"
            alt=""
            className={classes.header__companies_img}
          />
          <img
            src="./images/lyft-logo.png"
            alt=""
            className={classes.header__companies_img}
          />
          <img
            src="./images/zoom-logo.png"
            alt=""
            className={classes.header__companies_img}
          />
        </div>

      <main className={classes.main}>
        <div className={classes.main__info}>
          <div className={classes.main__description}>
            <h2>Thousands of people around the world are already learning</h2>
            <p>We deliver high quality content that will impact in your profesional life. Get started now or read the docs to know more.</p>
            <button className={clsx([classes.btn, classes.btn_blue])}>Read the docs &gt;</button>
          </div>
          <div className={classes.main__image}>
            <img src="./images/phone-2.png" alt="" />
          </div>
        </div>

        <div className={classes.main__pictures}>
          <img src="./images/main-1.jpg" alt="" />
          <img src="./images/main-2.jpg" alt="" />
          <img src="./images/main-3.jpg" alt="" />
          <img src="./images/main-4.jpg" alt="" />
        </div>
      </main>

      <footer className={classes.footer}>
        <h2 className={classes.footer__title}>
          A tecnology-first approach to education and colaborative work
        </h2>
        <div className={classes.footer__images}>
          <div className={classes.footer__image}>
            <img src="./images/up-arrow-icon.svg" alt="" />
            <h3>Highlight Text</h3>
            <p>
              We deliver high quality <span>content</span> that will impact in
              your profesional life.
            </p>
          </div>
          <div className={classes.footer__image}>
            <img src="./images/paste.svg" alt="" />
            <h3>Highlight Text</h3>
            <p>Get started now or read <span>the docs</span> to know more.</p>
          </div>
          <div className={classes.footer__image}>
            <img src="./images/copy-icon.svg" alt="" />
            <h3>Highlight Text</h3>
            <p>
              We deliver <span>high quality</span> content that will impact in
              your profesional life.
            </p>
          </div>
          <div className={classes.footer__image}>
            <img src="./images/target-icon.svg" alt="" />
            <h3>Highlight Text</h3>
            <p>
              We deliver high quality content that will impact in your
              <span>profesional life.</span>
            </p>
          </div>
        </div>
        <div className={classes.footer__logo}>
          <h2 className={classes.footer__logo_title}>PTUDWNC - 20CLC02</h2>
          <p>2023 All rights reserved</p>
        </div>
      </footer>
    </>
  );
};

export default LandingPage;
