import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import HomepageHeader from './HomepageHeader/HomepageHeader';

import homepage_pic from '~/assets/img/homepage_pic.png';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

const cx = classNames.bind(styles);
function Homepage() {
    const navigate = useNavigate();
    const [isSignedIn, setIsSignedIn] = useState(false);

    const navigateToGamePage = () => {
        navigate(isSignedIn ? '/' : '/sign-in');
    };

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [profilePic, setProfilePic] = useState('');

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            setIsSignedIn(true);

            axios
                .get(`https://quiz-lab-server.onrender.com/api/users/my-info `, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    const resStatus = res?.status;
                    if (resStatus === 200) {
                        setFirstName(res?.data?.firstName);
                        setLastName(res?.data?.lastName);
                        setProfilePic(res?.data?.profilePicture);
                    }
                });
        }
    }, []);

    return (
        <div className={cx('wrapper')}>
            <HomepageHeader firstName={firstName} lastName={lastName} profilePic={profilePic} isSignedIn={isSignedIn} />
            <div className={cx('content')}>
                <div className={cx('img-and-slogan')}>
                    <img src={homepage_pic} alt="Homepage picture" className={cx('homepage_pic')} />
                    <div className={cx('homepage_slogan')}>
                        {isSignedIn && firstName ? `Welcome back, ${firstName}!` : `Let's play`}
                    </div>
                    <div className={cx('homepage_text')}>
                        Do you feel confident? Here, you'll challenge one of the most difficult questions
                    </div>
                </div>
                <div className={cx('joining-room')}>
                    {isSignedIn && (
                        <div className={cx('custom-input__wrapper')}>
                            <input type="text" placeholder="Enter room code" className={cx('custom-input')} />
                        </div>
                    )}

                    <div className={cx('custom-input__wrapper')}>
                        <button onClick={navigateToGamePage} className={cx('custom-input__button')}>
                            {isSignedIn ? 'Join to the game 🡢' : 'Get started for free 🡢'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Homepage;
