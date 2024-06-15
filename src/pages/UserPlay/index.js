import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import styles from './style.module.scss';
import { roomApi } from '~/api/rooms';
import ResultUserPlayer from './ResultUserPlayer';
import { userApi } from '~/api/user';
import Loading from '~/components/Loading/Loading';

const Modal = ({ isOpen, children }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>{children}</div>
        </div>
    );
};

const UserPlay = () => {
    const location = useLocation();
    const totalQuestion = location.state?.totalQuestion;
    const { roomCode } = useParams();
    const navigate = useNavigate();

    const items = [{ symbol: '◆' }, { symbol: '■' }, { symbol: '▲' }, { symbol: '●' }];
    const [timeLeft, setTimeLeft] = useState(5000);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [question, setQuestion] = useState([]);
    const [loading, setLoading] = useState(true);
    const userInfo = useSelector((state) => state.user.info);
    const socket = useSelector((state) => state.socket.socket);
    const [answerInput, setAnswerInput] = useState({});
    const [point, setPoint] = useState(0);
    const [ws, setWs] = useState(null);
    const newPoint = useRef(0);
    const holdPoint = useRef(0);
    const [userId, setUserId] = useState('');
    const [prepareBack, setPrepareBack] = useState(false);
    const [resultLoading, setResultLoading] = useState(0); //0: on answering, 1: on loading, 2: answer false, 3: answer true, 4: no response
    useEffect(() => {
        socket.on('startQuestion', ({ question }) => {
            setModalIsOpen(false);
            setTimeLeft(question.timer * 1000);
            setQuestion(question);
            setAnswerInput();
            setLoading(false);
            setModalIsOpen(false);
        });

        socket.on('endQuestion', () => {
            console.log('new point 2', newPoint.current);
            setModalIsOpen(true);
            if (newPoint.current > 0) {
                setResultLoading(3);
                setPoint(holdPoint.current);
            } else {
                setResultLoading(2);
            }
        });
        socket.on('endQuiz', ({ roomId }) => {
            console.log(roomId);
            roomApi
                .update_user_rank(roomId)
                .then((res) => {
                    console.log('user rank', res.data);
                    setModalIsOpen(false);
                    setPrepareBack(true);
                })
                .catch((err) => {
                    console.log(err);
                });
            // userApi.getMyInfo().then((res) => {
            //     setUserId(res?.data?.id);
            //     setModalIsOpen(false);
            //     setPrepareBack(true);
            // });
            // navigate('/');
        });
    }, []);

    const handleClick = (item, index) => {
        console.log('handle click');
        if (timeLeft > 0) {
            setModalIsOpen(true);
            setResultLoading(1);
            const input = {
                roomCode,
                questionId: question.id,
                optionId: item.id,
                timer: (question.timer * 1000 - timeLeft) / 1000,
            };
            console.log('input', input);
            roomApi
                .answer_question(input)
                .then((res) => {
                    holdPoint.current += res.data.data.score;
                    newPoint.current = res.data.data.score;
                    console.log('new point 1', newPoint.current);
                })
                .catch((err) => {
                    console.log(err);
                });
            if (socket !== null) {
                console.log('answer question', roomCode);
                socket.emit('answerQuestion', { roomCode });
            }
        }
    };
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timerId = setInterval(() => {
            setTimeLeft((prevTimeLeft) => prevTimeLeft - 100);
        }, 100);
        return () => clearInterval(timerId);
    }, [timeLeft]);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '20vh', width: '100vw', height: '100vh' }}>
                <Loading />
            </div>
        );
    }
    return (
        <div>
            <header className={styles.header}>
                <div className={styles.headerQuestion}>
                    Pin: <b>{roomCode}</b>
                </div>
                <div className={styles.headerQuestion}>
                    {question.sortOrder} of {totalQuestion}
                </div>
            </header>
            <div className={styles.footer}>
                <div className={styles.headerQuestion}>
                    {userInfo.firstName} {userInfo.lastName}
                </div>
                <div className={styles.point}>
                    <b>{point}</b>
                </div>
            </div>

            {prepareBack ? (
                <div className={styles.container} style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className={styles.rankText}>Top 1</div>
                    <div className={styles.button}>
                        <span>Exit</span>
                    </div>
                </div>
            ) : (
                <div className={styles.container}>
                    {question.options.map((item, index) => (
                        <div
                            key={index}
                            className={`${styles.item} ${styles[`item${index + 1}`]}`}
                            onClick={() => handleClick(item, index)}
                        >
                            <span style={{ fontSize: '60px', marginRight: '10px' }}>{items[index].symbol}</span>
                            <span>{items[index].text}</span>
                        </div>
                    ))}
                </div>
            )}
            <Modal isOpen={modalIsOpen}>
                {resultLoading === 1 ? (
                    <ResultUserPlayer result={false} isLoading />
                ) : resultLoading === 3 ? (
                    <ResultUserPlayer result={true} point={newPoint.current} />
                ) : (
                    <ResultUserPlayer result={false} point={newPoint.current} />
                )}
            </Modal>
        </div>
    );
};

export default UserPlay;
