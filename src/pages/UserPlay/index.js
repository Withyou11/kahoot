import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import styles from './style.module.scss';
import { roomApi } from '~/api/rooms';

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

    const items = [{ symbol: '◆' }, { symbol: '■' }, { symbol: '▲' }, { symbol: '●' }];
    const [timeLeft, setTimeLeft] = useState(5000);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [question, setQuestion] = useState([]);
    const [loading, setLoading] = useState(true);
    const userInfo = useSelector((state) => state.user.info);
    const socket = useSelector((state) => state.socket.socket);
    const endQuestionSocket = useSelector((state) => state.socket.endQuestionSocket);
    const [answerInput, setAnswerInput] = useState({});
    const [point, setPoint] = useState(0);
    const holdPoint = useRef(0);
    const [resultLoading, setResultLoading] = useState(0); //0: on answering, 1: on loading, 2: answer false, 3: answer true, 4: no response
    useEffect(() => {
        socket.on('startQuestion', ({ question }) => {
            setModalIsOpen(false);
            console.log('question: ', question);
            setTimeLeft(question.timer * 1000);
            setQuestion(question);
            setAnswerInput();
            setLoading(false);
            setModalIsOpen(false);
        });

        socket.on('endQuestion', () => {
            setModalIsOpen(true);
            console.log(`holdPoint.current:${holdPoint.current}, point: ${point}`);
            if (holdPoint.current > point) {
                setResultLoading(3);
                setPoint(holdPoint.current);
            } else {
                setResultLoading(2);
            }
        });
    }, []);

    const handleClick = (item, index) => {
        if (timeLeft > 0) {
            setModalIsOpen(true);
            setResultLoading(1);
            const input = {
                roomCode,
                questionId: question.id,
                optionId: item.id,
                timer: (question.timer * 1000 - timeLeft) / 1000,
            };

            roomApi
                .answer_question(input)
                .then((res) => {
                    holdPoint.current += res.data.data.score;
                })
                .catch((err) => {
                    console.log(err);
                });
        }

        if (timeLeft > 0) {
            // setModalIsOpen(true);
        } else {
            console.log('Time exit');
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
            <div style={{ textAlign: 'center', marginTop: '20vh' }}>
                <p>Loading...</p>
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
            <Modal isOpen={modalIsOpen}>
                {resultLoading === 1 ? (
                    <div>dang loaidng</div>
                ) : resultLoading === 3 ? (
                    <div>true</div>
                ) : (
                    <div>false</div>
                )}
            </Modal>
        </div>
    );
};

export default UserPlay;
