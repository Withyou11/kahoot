import React, { useEffect, useState, useRef } from 'react';
import { questionApi } from '~/api/questions';
import styles from './styles.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { initialQuestion, nextQuestionRD, getNextQuestion } from '~/redux/questionSlide';
import { io } from 'socket.io-client';
import { initialSocket, setAnswerSocket, setEndQuestionSocket } from '~/redux/socketSlide';
import { endQuiz } from '~/redux/questionSlide';
import { roomApi } from '~/api/rooms';
import SummaryPage from '../Summary';
import NewQuest from './newQuest';
import SubResult from './SubResult';
import Loading from '~/components/Loading/Loading';

const Header = ({ question }) => {
    return <div className={styles.header}>{question}</div>;
};

const Modal = ({ isOpen, children }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>{children}</div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ padding: '10px', backgroundColor: 'green' }}>Close</div>
            </div>
        </div>
    );
};

const Result = ({ data }) => {
    const scores = [
        { color: '#d01937', icon: '▲' },
        { color: '#7c46b0', icon: '◆' },
        { color: '#237e0b', icon: '■' },
        { color: '#c79200', icon: '●' },
    ];

    function calScores() {
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
            scores[i].score = data[i].count;
            scores[i].optionId = data[i].optionId;
            sum += scores[i].score;
        }
        if (sum !== 0 || sum !== NaN) {
            for (let i = 0; i < scores.length; i++) {
                scores[i].percent = (scores[i].score / sum) * 5;
            }
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

const Image = ({
    duration,
    imgUrl,
    roomCode,
    socket,
    showResult,
    setShowResult,
    roomId,
    setEndQues,
    answerNumber,
    setModalIsOpen,
    questionId,
    setUserAnswer,
    options,
    setNewQuest,
    setRank,
    setFinish,
    finish,
    setSubResult,
    setReloadSummary,
}) => {
    const dispatch = useDispatch(setEndQuestionSocket(socket));
    const [timeLeft, setTimeLeft] = useState(Number(duration));
    const endQuizState = useSelector((state) => state.question.endQuiz);
    const [resultArray, setResultArray] = useState([]);
    const [laodingResult, setLoadingResult] = useState(false);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timerId = setInterval(() => {
            setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft]);

    const nextQuestion = () => {
        if (showResult === false) {
            setTimeLeft(0);
            setResultArray([]);
            socket.emit('endQuestion', { roomCode });
            roomApi
                .update_user_rank(roomId)
                .then((res) => {
                    console.log('user rank', res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
            setEndQues(true);
            setShowResult(true);

            const input = { roomCode, questionId };
            setLoadingResult(true);
            roomApi
                .get_answer_question(input)
                .then((res) => {
                    convertResultFc({ data: res.data.data });
                    setLoadingResult(false);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            setShowResult(false);
            roomApi
                .update_user_rank(roomId)
                .then((res) => {
                    setRank(res.data.data);
                    setReloadSummary(true);
                })
                .catch((err) => {
                    console.log(err);
                });

            if (endQuizState) {
                dispatch(endQuiz());
                setModalIsOpen(true);
                socket.emit('endQuiz', { roomCode, roomId });
                setFinish(true);
            } else {
                dispatch(nextQuestionRD());
            }
        }
    };

    const convertResultFc = ({ data }) => {
        if (data.length !== 0) {
            for (let i = 0; i < options.length; i++) {
                let count = 0;
                let optionId = options[i].id;
                for (let j = 0; j < data.length; j++) {
                    if (data[j].optionId === options[i].id) count += 1;
                }
                const item = {
                    optionId,
                    count,
                };
                setResultArray((previous) => [...previous, item]);
                count = 0;
            }
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
            <div className={styles.image}>
                {showResult && resultArray.length !== 0 ? (
                    <Result data={resultArray} />
                ) : (
                    <img src={imgUrl} alt="nothing to show" />
                )}
            </div>
            <div className={styles.controls}>
                <div className={styles.controlBox}>
                    <span>{answerNumber}</span>
                    <span>Answer</span>
                    <div className={styles.skip} onClick={() => nextQuestion()}>
                        <span>{showResult === false ? 'result' : endQuizState === false ? 'next' : 'finish'}</span>
                    </div>
                    {showResult && (
                        <div className={styles.skip} style={{ top: 20 }} onClick={() => setSubResult(true)}>
                            <span>BXH</span>
                        </div>
                    )}
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
                                style={{ opacity: endQues === false ? 1 : item.isCorrect ? 1 : 0.3 }}
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
    const globalSocket = useSelector((state) => state.socket.socket);
    const socket = useSelector((state) => state.socket.socket);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const quizId = id;
    const [loading, setLoading] = useState(true);
    const [showResult, setShowResult] = useState(false);
    const dispatch = useDispatch();
    const data = useSelector((state) => state.question.question);
    const currentQuestion = useSelector((state) => state.question.currentQuestion);
    const [endQues, setEndQues] = useState(false);
    const holdAnswerNumber = useRef(0);
    const [answerNumber, setAnswerNumber] = useState(0);
    const [totalQuestion, setTotalQuestion] = useState(0);
    const questionId = useRef(0);
    const [userAnswer, setUserAnswer] = useState();
    const [resultConvert, setResultConvert] = useState([]);
    const [rank, setRank] = useState({});
    const navigate = useNavigate();
    const [newQuest, setNewQuest] = useState(false);
    const endQuiz = useSelector((state) => state.question.endQuiz);
    const [finish, setFinish] = useState(false);
    const [subResult, setSubResult] = useState(false);
    const [reloadSummary, setReloadSummary] = useState(false);

    useEffect(() => {
        if (finish === false) {
            questionApi
                .getQuestion(currentQuestion, quizId)
                .then((res) => {
                    let tempData = {
                        question: res.data.data.data[0],
                        totalCount: res.data.data.meta.totalCount,
                    };
                    questionId.current = tempData.question.id;
                    if (currentQuestion === 1) {
                        dispatch(initialQuestion(tempData));
                        setNewQuest(true);
                    } else {
                        dispatch(getNextQuestion(tempData));
                        setNewQuest(true);
                    }
                    if (totalQuestion === 0) {
                        setTotalQuestion(tempData.totalCount);
                    }
                    setLoading(false);
                    setEndQues(false);
                    // socket.emit('startQuestion', { roomCode, questionId: tempData.question.id });
                    holdAnswerNumber.current = 0;
                    setAnswerNumber(0);
                    globalSocket.off('newUserAnswer');
                    globalSocket.on('newUserAnswer', () => {
                        holdAnswerNumber.current += 1;
                        setAnswerNumber(holdAnswerNumber.current);
                    });
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);
                });
        }
    }, [currentQuestion]);
    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '20vh' }}>
                <Loading />
            </div>
        );
    }
    if (subResult === true) {
        roomApi
            .update_user_rank(roomId)
            .then((res) => {
                console.log('user rank', res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <>
            {newQuest ? (
                <NewQuest
                    question={data.content}
                    current={currentQuestion}
                    max={totalQuestion}
                    setNewQuest={setNewQuest}
                    socket={socket}
                    roomCode={roomCode}
                    questionId={questionId.current}
                    roomId={roomId}
                />
            ) : subResult ? (
                <SubResult
                    current={currentQuestion}
                    max={totalQuestion}
                    roomCode={roomCode}
                    roomId={roomId}
                    setSubResult={setSubResult}
                />
            ) : (
                <>
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
                                answerNumber={answerNumber}
                                setModalIsOpen={setModalIsOpen}
                                questionId={questionId.current}
                                setUserAnswer={setUserAnswer}
                                options={data.options}
                                setRank={setRank}
                                setNewQuest={setNewQuest}
                                setFinish={setFinish}
                                setSubResult={setSubResult}
                                finish={finish}
                                setReloadSummary={setReloadSummary}
                            />
                            <Answer options={data.options} endQues={endQues} />
                        </div>
                    </div>
                    <Modal isOpen={modalIsOpen}>
                        <SummaryPage
                            navigate={navigate}
                            rank={rank}
                            totalQuestion={totalQuestion}
                            reloadSummary={reloadSummary}
                        />
                    </Modal>
                </>
            )}
        </>
    );
};

export default Question;
