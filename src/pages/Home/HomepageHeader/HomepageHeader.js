import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '~/assets/img/logo.png';

import classNames from 'classnames/bind';
import styles from './HomepageHeader.module.scss';

const cx = classNames.bind(styles);

function HomepageHeader({ questions }) {
    const navigate = useNavigate();

    return (
        <div className={cx('wrapper')}>
            <a href="/" className={cx('logo-link')}>
                <img src={logo} alt="Logo" className={cx('logo')} />
            </a>

            <div className={cx('authentication-section')}>
                <button className={cx('authentication-section__btn', 'authentication-section__btn-sign-in')}>
                    Sign in
                </button>
                <button className={cx('authentication-section__btn', 'authentication-section__btn-sign-up')}>
                    Sign up
                </button>
            </div>
        </div>
    );
}

export default HomepageHeader;
