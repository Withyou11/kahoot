import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import DropdownItem from '../DropdownItem/DropdownItem';

import classNames from 'classnames/bind';
import styles from './DropdownMenu.module.scss';

const cx = classNames.bind(styles);
const DropdownMenu = ({ firstName, lastName, profilePic }) => {
    const [active, setActive] = useState('');
    const [menuHeight, setMenuHeight] = useState(null);

    function calcHeight(el) {
        const height = el.offsetHeight;
        console.log(height);
        setMenuHeight(height);
    }

    function handleOpenCloseDropdown() {
        if (active) {
            setActive('');
        } else {
            setActive('main');
        }
    }

    return (
        <div className={cx('dropdown-wrapper')}>
            <div className={cx('user-wrapper')} onClick={handleOpenCloseDropdown}>
                <div className={cx('user-name')}>
                    {firstName} {lastName}
                </div>
                <img className={cx('user-avatar')} alt="user-avatar" src={profilePic} />
            </div>

            <div className={cx('dropdown')} style={{ height: menuHeight }}>
                <CSSTransition in={active === 'main'} unmountOnExit className={cx('menu-primary')} onEnter={calcHeight}>
                    <div className={cx('menu')}>
                        <DropdownItem goToPage={'my-profile'}>My Profile</DropdownItem>
                        <DropdownItem goToPage={'my-quizzes'}>My Quizzes</DropdownItem>
                        <DropdownItem goToPage={'my-history'}>Histories</DropdownItem>
                        <DropdownItem activateEvent={'sign-out'}>Sign out</DropdownItem>
                    </div>
                </CSSTransition>
            </div>
        </div>
    );
};

export default DropdownMenu;
