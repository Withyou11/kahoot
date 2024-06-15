import React, { useState, useEffect } from 'react';
import styles from './styles.module.scss';
import { useSelector } from 'react-redux';
const ProgressBar = ({ duration, setNewQuest, socket, roomCode, questionId }) => {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setNewQuest(false);
                    socket.emit('startQuestion', { roomCode, questionId });
                    console.log(`progress bar: ${roomCode}, question ID: ${questionId}`);
                    return 100;
                }
                return prev + 0.5;
            });
        }, 15);

        return () => clearInterval(timer);
    }, [progress]);

    return (
        <div className={styles.progressBar}>
            <div className={styles.progress} style={{ width: `${progress}%` }}></div>
        </div>
    );
};
const getRandomColor = () => {
    const colors = ['#ff4c4c;', '#4ca0ff', '#b1ff4c', '#ff4ccf', '#4cc9ff', '#ea4cff'];
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * colors.length);
    } while (randomIndex < 0 || randomIndex >= colors.length);
    return colors[randomIndex];
};

const NewQuest = ({ question, current, max, setNewQuest, roomCode, questionId }) => {
    const backgroundColor = getRandomColor();
    const socket = useSelector((state) => state.socket.socket);
    return (
        <div
            className={styles.quizContainer}
            style={{ backgroundColor: backgroundColor ? backgroundColor : '#4ca0ff' }}
        >
            <div style={{ height: '10vh' }}>
                <h2>
                    {current} of {max}
                </h2>
            </div>
            <div style={{ height: '20vh' }}>
                <h1>{question}</h1>
            </div>
            <div style={{ height: '50vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <ProgressBar
                    progress={5000}
                    setNewQuest={setNewQuest}
                    socket={socket}
                    roomCode={roomCode}
                    questionId={questionId}
                />
            </div>
        </div>
    );
};

export default NewQuest;
