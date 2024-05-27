import classNames from 'classnames/bind';
import styles from './SetQuestionItem.module.scss';

import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function SetQuestionItem({ setQuestion }) {
    const navigate = useNavigate();

    const handleEdit = (id) => {
        navigate(`/edit-quiz/${id}`);
    };

    const handlePlay = (e, id) => {
        e.stopPropagation();
        navigate(`/create-room/${id}`);
    };
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
        <div onClick={() => handleEdit(setQuestion.id)} className={cx('wrapper')}>
            <div className={cx('set-item')}>
                {setQuestion.coverPicture ? (
                    <img className={cx('set-item__img')} alt="cover_image" src={setQuestion.coverPicture} />
                ) : (
                    <div className={cx('cover-image')}>No Image</div>
                )}

                <div className={cx('set-item__info')}>
                    <h2 className={cx('set-item__heading')}>{setQuestion.title}</h2>
                    <p className={cx('set-item__desc')}>{setQuestion.description}</p>
                    <div className={cx('set-item__cta')}>
                        <button onClick={() => handleEdit(setQuestion.id)} className={cx('set-item__edit-btn')}>
                            Edit
                        </button>
                        <button onClick={(e) => handlePlay(e, setQuestion.id)} className={cx('set-item__play-btn')}>
                            Play
                        </button>
                    </div>
                    {setQuestion.updatedAt ? (
                        <p className={cx('set-item__time')}>Last update: {formatTime(setQuestion.updatedAt)}</p>
                    ) : (
                        <p className={cx('set-item__time')}>Last update: {formatTime(setQuestion.createdAt)}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SetQuestionItem;
