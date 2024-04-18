import React, { useState, useEffect } from 'react';

import classNames from 'classnames/bind';
import styles from './Toast.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Toast({ title, desc }) {
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        setIsActive(true);

        setTimeout(() => {
            setIsActive(false);
        }, 5000);
    }, []);

    const handleCloseClick = () => {
        setIsActive(false);
    };

    return (
        <div className={cx(`${isActive ? 'active' : ''}`)}>
            <div className={cx(`toast`)}>
                <div className={cx('toast__content')}>
                    <FontAwesomeIcon icon={faCheck} className={cx('toast__check')} />
                    <div className={cx('message')}>
                        <span className={cx('toast__title')}>{title}</span>
                        <span className={cx('toast__desc')}>{desc}</span>
                    </div>
                </div>
                <FontAwesomeIcon icon={faXmark} className={cx('toast__close')} onClick={handleCloseClick} />
                <div className={cx('progress', 'active')}></div>
            </div>
        </div>
    );
}

export default Toast;
