import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './History.module.scss';
import Loading from '~/components/Loading/Loading';
import axios from 'axios';
import HomepageHeader from '~/pages/Home/HomepageHeader/HomepageHeader';
import HistoryItem from './HistoryItem/HistoryItem';

const cx = classNames.bind(styles);

function History() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [profilePic, setProfilePic] = useState('');

    const [isPlayTab, setIsPlayTab] = useState(true);

    const [data, setData] = useState();

    const handleChangeTab = (isPlayTab) => {
        setIsPlayTab(isPlayTab);
    };

    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(true);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            axios
                .get(`https://quiz-lab-server.onrender.com/api/users/my-info`, {
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
                        setLoading(false);
                    }
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    }, []);

    useEffect(() => {
        setLoading2(true);
        const accessToken = localStorage.getItem('accessToken');
        const type = isPlayTab ? 'PLAYING' : 'ORGANIZING';
        if (accessToken) {
            axios
                .get(`https://quiz-lab-server.onrender.com/api/users/my-history?page=1&take=10&historyType=${type}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    const resStatus = res?.status;
                    if (resStatus === 200) {
                        setData(res.data.data.data);
                        setLoading2(false);
                    }
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    }, [isPlayTab]);

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
                    <div className={cx('tab-container')}>
                        <div
                            className={cx(`${isPlayTab ? 'tab-active' : 'tab-inactive'}`)}
                            onClick={() => handleChangeTab(true)}
                        >
                            <p className={cx('tab-title')}>Play</p>
                        </div>
                        <div
                            className={cx(`${!isPlayTab ? 'tab-active' : 'tab-inactive'}`)}
                            onClick={() => handleChangeTab(false)}
                        >
                            <p className={cx('tab-title')}>Host</p>
                        </div>
                    </div>
                    {loading2 ? (
                        <div className={cx('loading-container')}>
                            <Loading />
                        </div>
                    ) : (
                        // <div >
                        <div className={cx('row', 'row-cols-4', 'row-cols-md-2', 'row-cols-sm-1', 'gy-3')}>
                            {data?.map((history, index) => (
                                <div key={index} className={cx('col')}>
                                    <HistoryItem data={history} type={isPlayTab} />
                                </div>
                            ))}
                        </div>
                        // </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default History;
