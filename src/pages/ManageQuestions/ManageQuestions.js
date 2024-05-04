import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './ManageQuestions.module.scss';
import { useNavigate } from 'react-router-dom';

import SetQuestionItem from '~/pages/ManageQuestions/SetQuestionItem/SetQuestionItem';

import axios from 'axios';

const cx = classNames.bind(styles);

function ManageQuestions() {
    const [listQuizzes, setListQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    function handleCreate() {
        navigate('/create-quiz');
    }

    useEffect(() => {
        axios
            .get(`https://quiz-lab-server.onrender.com/api/quizzes?page=1&take=100&userId=3`, {
                headers: {
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMyIsImVtYWlsIjoidXNlcjNAZ21haWwuY29tIn0sImlhdCI6MTcxNDIwNTc0NywiZXhwIjoxNzE2Nzk3NzQ3fQ.LFFHvwQWuWokTwvJ3fKfSL1slCo48oyWvGxgkDkP-Fs`,
                },
            })
            .then((res) => {
                console.log(res.data.data.data);
                setListQuizzes(res.data.data.data);
                setLoading(false);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <div className={cx('title-wrapper')}>
                    <h1 className={cx('title')}>My question's sets</h1>
                </div>
                <div className={cx('action')}>
                    <button className={cx('action__btn', 'action__btn-create')} onClick={handleCreate}>
                        Create
                    </button>
                </div>
            </div>

            {loading && (
                <div className={cx('loading-wave')}>
                    <div className={cx('loading-bar')}></div>
                    <div className={cx('loading-bar')}></div>
                    <div className={cx('loading-bar')}></div>
                    <div className={cx('loading-bar')}></div>
                </div>
            )}
            {!loading && (
                <>
                    <div className={cx('container')}>
                        <div className={cx('row', 'row-cols-4', 'row-cols-md-2', 'row-cols-sm-1', 'gy-3')}>
                            {listQuizzes.map((setQuestion, index) => (
                                <div key={index} className={cx('col')}>
                                    <SetQuestionItem setQuestion={setQuestion} />
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default ManageQuestions;
