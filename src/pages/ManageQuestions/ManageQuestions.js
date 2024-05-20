import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './ManageQuestions.module.scss';
import { useNavigate } from 'react-router-dom';

import SetQuestionItem from '~/pages/ManageQuestions/SetQuestionItem/SetQuestionItem';
import HomepageHeader from '~/pages/Home/HomepageHeader/HomepageHeader';
import Loading from '~/components/Loading/Loading';

import axios from 'axios';

const cx = classNames.bind(styles);

function ManageQuestions() {
    const [listQuizzes, setListQuizzes] = useState([]);
    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(true);

    const [isSignedIn, setIsSignedIn] = useState(true);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [profilePic, setProfilePic] = useState('');

    const navigate = useNavigate();

    function handleCreate() {
        navigate('/create-quiz');
    }

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');

        if (accessToken) {
            axios
                .get(`https://quiz-lab-server.onrender.com/api/users/my-info `, {
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
                        setLoading1(false);
                    }
                })
                .catch((e) => {
                    console.log(e);
                });
        }

        axios
            .get(`https://quiz-lab-server.onrender.com/api/quizzes?page=1&take=100&userId=3`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then((res) => {
                console.log(res.data.data.data);
                setListQuizzes(res.data.data.data);
                setLoading2(false);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    return (
        <div className={cx('wrapper')}>
            {loading1 && <Loading />}

            {!loading1 && (
                <HomepageHeader
                    firstName={firstName}
                    lastName={lastName}
                    profilePic={profilePic}
                    isSignedIn={isSignedIn}
                />
            )}

            <div className={cx('header')}>
                <div className={cx('title-wrapper')}>
                    <h1 className={cx('title')}>My quizzes</h1>
                </div>
                <div className={cx('action')}>
                    <button className={cx('action__btn', 'action__btn-create')} onClick={handleCreate}>
                        Create
                    </button>
                </div>
            </div>

            {loading2 && <Loading />}
            {!loading2 && (
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
