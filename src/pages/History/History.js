import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './History.module.scss';
import Loading from '~/components/Loading/Loading';
import axios from 'axios';
import HomepageHeader from '~/pages/Home/HomepageHeader/HomepageHeader';

const cx = classNames.bind(styles);

function History() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [profilePic, setProfilePic] = useState('');

    const [loading, setLoading] = useState(false);

    return (
        <div className={cx('wrapper')}>
            {loading && (
                <div className={cx('loading-container')}>
                    <Loading />
                </div>
            )}

            {!loading && (
                <div className={cx('container')}>
                    <HomepageHeader
                        firstName={firstName}
                        lastName={lastName}
                        profilePic={profilePic}
                        isSignedIn={true}
                    />
                </div>
            )}
        </div>
    );
}

export default History;
