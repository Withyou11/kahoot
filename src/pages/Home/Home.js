import classNames from 'classnames/bind';
import styles from './Home.module.scss';

const cx = classNames.bind(styles);
function Home() {
  return (
    <div className={cx('container')}>
      <div className={cx('row')}>
        <div className={cx('col-5')}>
          <h1 className={cx('heading')}>Home page</h1>
        </div>
        <div className={cx('col-6', 'offset-1')}>
          <p className={cx('content')}>Home content</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
