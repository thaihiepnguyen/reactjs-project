import HomeBanner from "@/app/components/HomeBanner"
import classes from './styles.module.scss'

export default function Home() {
  return (
    <div style={{width: '100%', height: '100%', textAlign: "center"}}>
      {/* Home page */}
      <HomeBanner />
      <br/>
      <br/>
      <div className={classes.home__section1}>
        <div className={classes.bg} />
          <div className={classes.content}>
            <div className={classes.row}>
              <div className={classes.col__sm__8}>
                <div className={classes.section__heading}>STUDY ONLINE 
                <br/>
                  MORE CONVENIENTLY AND SAFELY
                </div>
                <div className={classes.section__text}>
                  <p>Sign Language Prediction</p>
                  <h5>Make people closer together</h5>
                </div>
                <div className={classes.getting__started}>
                  <a className={classes.btn} href="#">
                    About us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}