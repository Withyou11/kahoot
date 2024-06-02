import React, { useContext, useEffect, useState } from 'react';

import classNames from 'classnames/bind';
import styles from './CreateQuestions.module.scss';
import CQSidebar from './CQSidebar/CQSidebar';
import CreateQuestionsHeader from '~/components/CreateQuestionsHeader/CreateQuestionsHeader';
import QuestionContent from './QuestionContent/QuestionContent';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Loading from '~/components/Loading/Loading';

const cx = classNames.bind(styles);

function CreateQuestion() {
    let { id } = useParams();

    const [loading, setLoading] = useState(true);

    const [questions, setQuestions] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState({});
    const [quizInfo, setQuizInfo] = useState({ title: '', description: '', coverPicture: '' });

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');

        let tempIdCounter = 1;
        if (id) {
            axios
                .get(`https://quiz-lab-server.onrender.com/api/quizzes/${id}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    console.log(res.data.data);
                    const newDataFormat = res.data.data.questions.flatMap((question, index) => [
                        {
                            idfake: `question${tempIdCounter++}`,
                            id: question.id,
                            content: question.content,
                            sortOrder: question.sortOrder,
                            mediaUrl: question.mediaUrl,
                            options: question.options,
                            timer: question.timer,
                        },
                        {
                            idfake: `question${tempIdCounter++}`,
                            id: `e${question.id}`,
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
                    idfake: `question${tempIdCounter}`,
                    id: `1`,
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
                idfake: `question${tempIdCounter}`,
                id: `1`,
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
            {loading && <Loading />}
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
