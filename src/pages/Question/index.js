import React, { useEffect, useState } from 'react';
import { questionApi } from '~/api/questions';
import styles from './styles.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { initialQuestion, nextQuestionRD } from '~/redux/questionSlide';

const Header = ({ question }) => {
    return <div className={styles.header}>{question}</div>;
};

const Image = ({ duration, imgUrl }) => {
    const dispatch = useDispatch();
    const endQuiz = useSelector((state) => state.question.endQuiz);
    const [timeLeft, setTimeLeft] = useState(Number(duration));

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timerId = setInterval(() => {
            setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft]);

    const nextQuestion = () => {
        console.log('nextQuestion');
        dispatch(nextQuestionRD());
    };

    return (
        <div className={styles.imageContainer}>
            <div className={styles.timer}>
                <div className={styles.timerBox}>
                    <span>
                        <b>{timeLeft}</b>
                    </span>
                </div>
            </div>
            <div className={styles.image}>
                <img src={imgUrl} alt="nothing to show" />
            </div>
            <div className={styles.controls}>
                <div className={styles.controlBox}>
                    <span>1</span>
                    <span>Answer</span>
                    <div className={styles.skip} onClick={() => nextQuestion()}>
                        <span>
                            <b>{timeLeft === 0 ? 'next' : endQuiz ? 'finish' : 'skip'}</b>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Answer = ({ options }) => {
    const items = ['◆', '■', '▲', '●'];
    return (
        <div className={styles.answerContainer}>
            <div className={styles.gridContainer}>
                {options.map((item, index) => (
                    <div key={index} className={styles.gridItem}>
                        <span style={{ fontSize: '60px', marginRight: '10px' }}>{items[index]}</span>
                        <span>{item.content}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Question = () => {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const data = useSelector((state) => state.question.question);
    const currentQuestion = useSelector((state) => state.question.currentQuestion);

    useEffect(() => {
        questionApi
            .getQuestion(currentQuestion, 5)
            .then((res) => {
                console.log('change data', currentQuestion);
                let tempData = {
                    question: res.data.data.data[0],
                    totalCount: res.data.data.meta.totalCount,
                };
                dispatch(initialQuestion(tempData));
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, [currentQuestion]);
    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '20vh' }}>
                <p>Loading...</p>
            </div>
        );
    }
    console.log(data);
    return (
        <div className={styles.questionContainer}>
            <Header question={data.content} />
            <div style={{ display: 'flex', flexDirection: 'column', height: '90vh' }}>
                <Image duration={data.timer} imgUrl={data.mediaUrl} />
                <Answer options={data.options} />
            </div>
        </div>
    );
};

export default Question;
