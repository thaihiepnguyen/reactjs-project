'use client'
import HomeBanner from "@/app/components/HomeBanner"
import classes from './styles.module.scss'
import { useTranslation } from "next-i18next"

export default function Home() {
  const {t} = useTranslation();
  return (
    <div style={{width: '100%', height: '100%', textAlign: "center"}}>
      <HomeBanner />
      <br/>
      <br/>
      <div className={classes.home__section1}>
        <div className={classes.bg} />
          <div className={classes.content}>
            <div className={classes.row}>
            <div className={classes.section__heading}>{t('STUDY ONLINE MORE')} 
                <br/>
                  {t('CONVENIENTLY AND FAST')}
                </div>
                <div className={classes.col__sm__8}>
                  <div className={classes.section__text}>
                    <p>{t('Join all available classes for free!')}</p>
                    <h5>{t('Make people closer together')}</h5>
                  </div>
                  {/* <div className={classes.getting__started}>
                    <a className={classes.btn} href="#">
                      {t('About us')}
                    </a>
                  </div> */}
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}