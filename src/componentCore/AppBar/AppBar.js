import classNames from "classnames/bind";
import styles from "./AppBar.module.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
const cx = classNames.bind(styles);
function AppBar({ text = "", moreButton }) {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("left")}>
        <div className={cx("icon")}>
          <MoreVertIcon></MoreVertIcon>
        </div>
        <div className={cx("text")}>{text}</div>
      </div>
      {moreButton && <div className={cx("more-button")}>{moreButton}</div>}
    </div>
  );
}

export default AppBar;
