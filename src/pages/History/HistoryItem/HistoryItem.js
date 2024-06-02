import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './HistoryItem.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMedal } from '@fortawesome/free-solid-svg-icons';
import Loading from '~/components/Loading/Loading';
import Ranking from '../Ranking/Ranking';
import axios from 'axios';

const cx = classNames.bind(styles);

function HistoryItem({ data, type }) {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [historyData, setHistoryData] = useState();
    const [hostData, setHostData] = useState();
    function handleOpenModal() {
        setShowModal(true);
        setLoading(true);

        const accessToken = localStorage.getItem('accessToken');
        if (type) {
            axios
                .get(`https://quiz-lab-server.onrender.com/api/users/my-playing-history?userRoomId=${data.id}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    setHistoryData(res.data.data);
                    setLoading(false);
                })
                .catch((e) => {
                    console.log(e);
                });
        } else {
            axios
                .get(
                    `https://quiz-lab-server.onrender.com/api/users/my-organizing-history?page=1&take=100&roomId=${data.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    },
                )
                .then((res) => {
                    setHostData(res.data.data.data);
                    setLoading(false);
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    }

    function handleCloseModal() {
        setShowModal(false);
    }

    function formatTime(dateString) {
        // Parsing the string into a Date object
        const date = new Date(dateString);

        // Extracting hours, minutes, day, month, and year from the date object
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
        const year = date.getFullYear();

        // Constructing the formatted string
        const formattedTime = `${hours}:${minutes} ${day}/${month}/${year}`;

        return formattedTime;
    }
    return (
        <div className={cx('wrapper')}>
            {type ? (
                // Playing
                <div className={cx('set-item')} onClick={handleOpenModal}>
                    {data.room?.quiz?.coverPicture ? (
                        <img className={cx('set-item__img')} alt="cover_image" src={data.room?.quiz?.coverPicture} />
                    ) : (
                        <div className={cx('cover-image')}>No Image</div>
                    )}

                    <div className={cx('set-item__info')}>
                        <h2 className={cx('set-item__heading')}>{data.room?.quiz?.title}</h2>
                        <p className={cx('set-item__desc')}>My rank: {data.rank}</p>
                        <p className={cx('set-item__desc')}>My score: {data.totalScore}</p>
                        <p className={cx('set-item__time')}>Time: {formatTime(data.room?.createdAt)}</p>
                    </div>
                </div>
            ) : (
                // Hosting
                <div className={cx('set-item')} onClick={handleOpenModal}>
                    {data.quiz?.coverPicture ? (
                        <img className={cx('set-item__img')} alt="cover_image" src={data.quiz?.coverPicture} />
                    ) : (
                        <div className={cx('cover-image')}>No Image</div>
                    )}

                    <div className={cx('set-item__info')}>
                        <h2 className={cx('set-item__heading')}>{data.quiz?.title}</h2>
                        <p className={cx('set-item__time')}>Time: {formatTime(data.createdAt)}</p>
                    </div>
                </div>
            )}
            {/* Modal */}
            {showModal && (
                <div className={cx('modal')}>
                    <div className={cx('modal__content', 'modal__content--large')}>
                        <h2 className={cx('modal__heading')}>
                            {data.room?.quiz?.title ? data.room?.quiz?.title : data.quiz?.title}
                        </h2>
                        {loading && <Loading />}
                        {!loading && type && (
                            <div>
                                <Ranking top3Player={historyData?.top3Player} />
                                <p className={cx('set-item__desc_1')}>My rank: {data.rank}</p>
                                <p className={cx('set-item__desc_1')}>My score: {data.totalScore}</p>
                                <p className={cx('set-item__desc_1')}>
                                    My correct answer: {historyData?.totalCorrectAnswer} / {historyData?.totalQuestion}
                                </p>
                                <p className={cx('set-item__desc_1')}>Participant: {historyData?.totalPlayer}</p>
                            </div>
                        )}
                        {!loading && !type && (
                            <div className={cx('history-list-container')}>
                                <div style={{ maxHeight: '100vh', overflowY: 'scroll' }}>
                                    <div className={cx('history-row')} style={{ background: '#3590F3' }}>
                                        <p className={cx('history-title', 'center')}>Rank</p>
                                        <p className={cx('history-title')}>FullName</p>
                                        <p className={cx('history-title', 'center')}>Score</p>
                                        <p className={cx('history-title', 'center')}>Correct answer</p>
                                        <div style={{ width: '50px' }}></div>
                                    </div>
                                </div>

                                <div className={cx('history-list')}>
                                    {hostData?.map((user, index) => (
                                        <div key={index} className={cx('history-row')}>
                                            <p className={cx('history-title', 'center')}>{user.rank}</p>
                                            <p className={cx('history-title')}>
                                                {user.user.firstName} {user.user.lastName}
                                            </p>
                                            <p className={cx('history-title', 'center')}>{user.totalScore}</p>
                                            <p className={cx('history-title', 'center')}>{user.totalCorrectAnswer}</p>
                                            <div style={{ width: '50px', display: 'flex' }}>
                                                {user.rank === '1' && (
                                                    <FontAwesomeIcon icon={faMedal} className={cx('gold')} />
                                                )}
                                                {user.rank === '2' && (
                                                    <FontAwesomeIcon icon={faMedal} className={cx('silver')} />
                                                )}
                                                {user.rank === '3' && (
                                                    <FontAwesomeIcon icon={faMedal} className={cx('bronze')} />
                                                )}
                                                {user.rank !== '1' && user.rank !== '2' && user.rank !== '3' && <p></p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={cx('modal__overlay')} onClick={handleCloseModal}></div>
                </div>
            )}
        </div>
    );
}

export default HistoryItem;
