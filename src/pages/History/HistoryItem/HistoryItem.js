import classNames from 'classnames/bind';
import styles from './HistoryItem.module.scss';

const cx = classNames.bind(styles);

function HistoryItem({ data, type }) {
    console.log(data);
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
                <div className={cx('set-item')}>
                    {data.room?.quiz?.coverPicture ? (
                        <img className={cx('set-item__img')} alt="cover_image" src={data.room?.quiz?.coverPicture} />
                    ) : (
                        <div className={cx('cover-image')}>No Image</div>
                    )}

                    <div className={cx('set-item__info')}>
                        <h2 className={cx('set-item__heading')}>{data.room?.quiz?.title}</h2>
                        <p className={cx('set-item__desc')}>My rank: {data.rank}</p>
                        <p className={cx('set-item__desc')}>My score: {data.totalScore}</p>

                        {/* <p className={cx('set-item__desc')}>{data.room.quiz.description}</p> */}
                        <p className={cx('set-item__time')}>Time: {formatTime(data.room?.createdAt)}</p>
                    </div>
                </div>
            ) : (
                // Hosting
                <div className={cx('set-item')}>
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
        </div>
    );
}

export default HistoryItem;
