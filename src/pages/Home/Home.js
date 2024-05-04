import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import HomepageHeader from './HomepageHeader/HomepageHeader';

import homepage_pic from '~/assets/img/homepage_pic.png';

const cx = classNames.bind(styles);
function Homepage() {
    return (
        <div className={cx('wrapper')}>
            <HomepageHeader />
            <div className={cx('content')}>
                <div className={cx('img-and-slogan')}>
                    <img src={homepage_pic} alt="Homepage picture" className={cx('homepage_pic')} />
                    <div className={cx('homepage_slogan')}>Let's play</div>
                    <div className={cx('homepage_text')}>
                        Do you feel confident? Here, you'll challenge one of the most difficult questions
                    </div>
                </div>
                <div className={cx('joining-room')}>
                    <div className={cx('custom-input__wrapper')}>
                        <input
                            type="text"
                            placeholder="Enter room code"
                            className={cx('custom-input')}
                        />
                    </div>
                    <div className={cx('custom-input__wrapper')}>
                        <button className={cx('custom-input__button')}>Join to the game 🡢</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Homepage;
