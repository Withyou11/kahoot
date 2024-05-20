import classNames from 'classnames/bind';
import styles from './Loading.module.scss';

const cx = classNames.bind(styles);

function Loading() {
    return (
        <div className={cx('loading-wave')}>
            <div className={cx('loading-bar')}></div>
            <div className={cx('loading-bar')}></div>
            <div className={cx('loading-bar')}></div>
            <div className={cx('loading-bar')}></div>
        </div>
    );
}

export default Loading;
