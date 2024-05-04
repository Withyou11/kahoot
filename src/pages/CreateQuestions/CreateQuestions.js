import React, { useEffect, useState } from 'react';

import classNames from 'classnames/bind';
import styles from './CreateQuestions.module.scss';
import CQSidebar from './CQSidebar/CQSidebar';
import CreateQuestionsHeader from '~/components/CreateQuestionsHeader/CreateQuestionsHeader';
import QuestionContent from './QuestionContent/QuestionContent';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const cx = classNames.bind(styles);

function CreateQuestion() {
    let { id } = useParams();
    const [loading, setLoading] = useState(true);

    const [questions, setQuestions] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState({});
    const [quizInfo, setQuizInfo] = useState({ title: '', description: '', coverPicture: '' });

    useEffect(() => {
        let tempIdCounter = 1;
        if (id) {
            axios
                .get(`https://quiz-lab-server.onrender.com/api/quizzes/${id}`, {
                    headers: {
                        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMyIsImVtYWlsIjoidXNlcjNAZ21haWwuY29tIn0sImlhdCI6MTcxNDIwNTc0NywiZXhwIjoxNzE2Nzk3NzQ3fQ.LFFHvwQWuWokTwvJ3fKfSL1slCo48oyWvGxgkDkP-Fs`,
                    },
                })
                .then((res) => {
                    const newDataFormat = res.data.data.questions.flatMap((question, index) => [
                        {
                            id: `question${tempIdCounter++}`,
                            quizId: question.quizId,
                            content: question.content,
                            sortOrder: question.sortOrder,
                            mediaUrl: question.mediaUrl,
                            options: question.options,
                            timer: question.timer,
                        },
                        {
                            id: `question${tempIdCounter++}`,
                            explanationContent: question.explanationContent,
                            explanationMediaUrl: question.explanationMediaUrl,
                            type: 'exp',
                            options: [],
                        },
                    ]);

                    const quizInfo = {
                        title: res.data.data.title,
                        description: res.data.data.description,
                        coverPicture: res.data.data.coverPicture,
                    };
                    setQuizInfo(quizInfo);
                    setQuestions(newDataFormat);
                    setSelectedQuestion(newDataFormat[0]);
                    setLoading(false);
                })
                .catch((e) => {
                    console.log(e);
                });
        } else {
            setLoading(false);
            setQuestions([
                {
                    id: `question${questions.length + 1}`,
                    sortOrder: 1,
                    content: '',
                    mediaUrl: '',
                    options: [
                        {
                            content: '',
                            isCorrect: false,
                        },
                        {
                            content: '',
                            isCorrect: false,
                        },
                        {
                            content: '',
                            isCorrect: false,
                        },
                        {
                            content: '',
                            isCorrect: false,
                        },
                    ],
                    timer: '15',
                },
            ]);
            setSelectedQuestion({
                id: `question${questions.length + 1}`,
                sortOrder: 1,
                content: '',
                options: [
                    {
                        content: '',
                        isCorrect: false,
                    },
                    {
                        content: '',
                        isCorrect: false,
                    },
                    {
                        content: '',
                        isCorrect: false,
                    },
                    {
                        content: '',
                        isCorrect: false,
                    },
                ],
                timer: '15',
            });
        }
    }, []);

    return (
        <div className={cx('wrapper')}>
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
                    <CreateQuestionsHeader
                        questions={questions}
                        setQuestions={setQuestions}
                        quizInfo={quizInfo}
                        setQuizInfo={setQuizInfo}
                    />
                    <div className={cx('container gx-0', 'question-content')}>
                        <div className={cx('row')}>
                            <div className={cx('col-2')}>
                                <CQSidebar
                                    questions={questions}
                                    setQuestions={setQuestions}
                                    selectedQuestion={selectedQuestion}
                                    setSelectedQuestion={setSelectedQuestion}
                                />
                            </div>
                            <div className={cx('col-10')}>
                                <QuestionContent selectedQuestion={selectedQuestion} setQuestions={setQuestions} />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default CreateQuestion;
