import Navigation from "../../componentCore/Navigation";
import classNames from "classnames/bind";
import styles from "../MainLayout/MainLayout.module.scss";
const cx = classNames.bind(styles);
function MainLayout({ children }) {
  return (
    <div className={cx("wrapper")}>
      <div className={cx('nav')}>
        <Navigation appName="App Support"></Navigation>
      </div>
      <div className={cx('content')} >{children}</div>
    </div>
  );
}

export default MainLayout;
