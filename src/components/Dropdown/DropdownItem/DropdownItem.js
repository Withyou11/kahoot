import React from 'react';

import classNames from 'classnames/bind';
import styles from './DropdownItem.module.scss';

import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);
const DropdownItem = ({ goToPage, activateEvent, children }) => {
    const navigate = useNavigate();

    const handleClickDropdownItem = () => {
        if (activateEvent) {
            switch (activateEvent) {
                case 'sign-out':
                    localStorage.removeItem('accessToken');
                    window.location.reload();
                    break;
                default:
                    break;
            }
        }

        if (goToPage) {
            navigate(goToPage);
        }
    };

    return (
        <>
            <a className={cx('menu-item')} onClick={handleClickDropdownItem}>
                {children}
            </a>
        </>
    );
};

export default DropdownItem;
