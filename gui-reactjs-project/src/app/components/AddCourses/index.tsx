import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import classes from "./styles.module.scss";


export default function AddCourses(props) {
  const {text, openModel} = props
  return <>
    <button className={classes.addClass} onClick={openModel}>
      <AddOutlinedIcon style={{fontSize: 50}}/>
      <div className={classes.addTextContainer}>
        <span className={classes.addText}>{text}</span>
      </div>
    </button>
  </>
}