import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '~/assets/img/logo.png';

import classNames from 'classnames/bind';
import styles from './HomepageHeader.module.scss';
import DropdownMenu from '~/components/Dropdown/DropdownMenu/DropdownMenu';

const cx = classNames.bind(styles);

function HomepageHeader({ isSignedIn, firstName, lastName, profilePic }) {
    const navigate = useNavigate();

    const navigateToSignInPage = () => {
        navigate('/sign-in');
    };

    const navigateToSignUpPage = () => {
        navigate('/sign-up');
    };

    return (
        <div className={cx('wrapper')}>
            <a href="/" className={cx('logo-link')}>
                <img src={logo} alt="Logo" className={cx('logo')} />
            </a>

            {isSignedIn ? (
                <div className={cx('user-section')}>
                    <DropdownMenu firstName={firstName} lastName={lastName} profilePic={profilePic} />
                </div>
            ) : (
                <div className={cx('authentication-section')}>
                    <button
                        onClick={navigateToSignInPage}
                        className={cx('authentication-section__btn', 'authentication-section__btn-sign-in')}
                    >
                        Sign in
                    </button>
                    <button
                        onClick={navigateToSignUpPage}
                        className={cx('authentication-section__btn', 'authentication-section__btn-sign-up')}
                    >
                        Sign up
                    </button>
                </div>
            )}
        </div>
    );
}

export default HomepageHeader;
