import React, { useEffect, useState } from 'react';
import { questionApi } from '~/api/questions';
import styles from './styles.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { initialQuestion, nextQuestionRD, getNextQuestion } from '~/redux/questionSlide';
import { io } from 'socket.io-client';
import { initialSocket, setEndQuestionSocket } from '~/redux/socketSlide';
import { roomApi } from '~/api/rooms';

const Header = ({ question }) => {
    return <div className={styles.header}>{question}</div>;
};

const Result = () => {
    const scores = [
        { color: '#d01937', score: 44, icon: '▲' },
        { color: '#7c46b0', score: 12, icon: '◆' },
        { color: '#c79200', score: 0, icon: '■' },
        { color: '#237e0b', score: 12, icon: '●', correct: true },
    ];
    function calScores() {
        let sum = 0;
        for (let i = 0; i < scores.length; i++) {
            sum += scores[i].score;
        }
        for (let i = 0; i < scores.length; i++) {
            scores[i].percent = (scores[i].score / sum) * 5;
        }
    }
    calScores();
    return (
        <div
            style={{
                display: 'flex',
                justifyItems: 'flex-end',
                alignItems: 'end',
                flexDirection: 'column',
            }}
        >
            <div className={styles.scoreBoard}>
                {scores.map((score, index) => (
                    <div key={index} className={styles.scoreItem}>
                        <div>{score.score}</div>
                        <div
                            style={{
                                height: `${score.percent * 50 + 10}px`,
                                width: '100%',
                                backgroundColor: score.color,
                                marginBottom: '3px',
                                borderRadius: '2px',
                            }}
                        ></div>
                        <div
                            style={{
                                fontSize: '24px',
                                backgroundColor: score.color,
                                width: '100%',
                                padding: '3px',
                                color: 'white',
                                borderRadius: '2px',
                            }}
                        >
                            {score.icon}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Image = ({ duration, imgUrl, roomCode, socket, showResult, setShowResult, roomId, setEndQues }) => {
    const dispatch = useDispatch(setEndQuestionSocket(socket));
    const [timeLeft, setTimeLeft] = useState(Number(duration));

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timerId = setInterval(() => {
            setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft]);

    const nextQuestion = () => {
        if (showResult === false) {
            socket.emit('endQuestion', { roomCode });
            roomApi
                .update_user_rank(roomId)
                .then((res) => {
                    console.log('result', res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
            setEndQues(true);
            setShowResult(true);
        } else {
            setShowResult(false);
            dispatch(nextQuestionRD());
        }
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
            <div className={styles.image}>{showResult ? <Result /> : <img src={imgUrl} alt="nothing to show" />}</div>
            <div className={styles.controls}>
                <div className={styles.controlBox}>
                    <span>1</span>
                    <span>Answer</span>
                    <div className={styles.skip} onClick={() => nextQuestion()}>
                        <span>
                            {/* <b>{timeLeft === 0 ? 'next' : endQuiz ? 'finish' : 'skip'}</b> */}
                            <b> {showResult ? 'next' : 'result'}</b>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Answer = ({ options, endQues }) => {
    const items = ['◆', '■', '▲', '●'];
    return (
        <>
            {options !== undefined ? (
                <div className={styles.answerContainer}>
                    <div className={styles.gridContainer}>
                        {options.map((item, index) => (
                            <div
                                key={index}
                                className={styles.gridItem}
                                style={{ opacity: endQues === false ? 1 : item.isCorrect ? 1 : 0.6 }}
                            >
                                <span style={{ fontSize: '60px', marginRight: '10px' }}>{items[index]}</span>
                                <span>{item.content}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div>no options</div>
            )}
        </>
    );
};

const Question = () => {
    let { id, roomCode, roomId } = useParams();
    const socket = io('https://quiz-lab-server.onrender.com', {
        transports: ['websocket'],
    });
    // const socket = useSelector((state) => state.socket.socket);

    const quizId = id;
    const [loading, setLoading] = useState(true);
    const [showResult, setShowResult] = useState(false);
    const dispatch = useDispatch();
    const data = useSelector((state) => state.question.question);
    const currentQuestion = useSelector((state) => state.question.currentQuestion);
    const [endQues, setEndQues] = useState(false);
    useEffect(() => {
        questionApi
            .getQuestion(currentQuestion, quizId)
            .then((res) => {
                let tempData = {
                    question: res.data.data.data[0],
                    totalCount: res.data.data.meta.totalCount,
                };
                if (currentQuestion === 1) dispatch(initialQuestion(tempData));
                else dispatch(getNextQuestion(tempData));
                setLoading(false);
                console.log(res);
                setEndQues(false);
                socket.emit('startQuestion', { roomCode, questionId: tempData.question.id });
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
    return (
        <div className={styles.questionContainer}>
            <Header question={data.content} />
            <div style={{ display: 'flex', flexDirection: 'column', height: '90vh' }}>
                <Image
                    duration={data.timer}
                    imgUrl={data.mediaUrl}
                    roomCode={roomCode}
                    socket={socket}
                    showResult={showResult}
                    setShowResult={setShowResult}
                    roomId={roomId}
                    setEndQues={setEndQues}
                />
                <Answer options={data.options} endQues={endQues} />
            </div>
        </div>
    );
};

export default Question;
