import React, { useState } from 'react';

// Example styles
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
        backgroundColor: '#f5f5f5',
    },
    header: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        padding: '20px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    questionText: {
        fontSize: '24px',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    scoreBoard: {
        display: 'flex',
        flexDirection: 'row', // Changed from 'column' to 'row'
        justifyContent: 'center',
        alignItems: 'end',
        // justifyItems: 'end',
        // justifySelf: 'end',
        width: '100%',
        margin: '20px 0',
    },
    scoreItem: {
        display: 'flex',
        flexDirection: 'column',
        width: '100px',
        borderRadius: '5px',
        margin: '0 10px',
        textAlign: 'center',
    },
    scoreIcon: {
        fontSize: '24px',
    },
    scoreNumber: {
        fontSize: '24px',
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    controlButtons: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        margin: '20px 0',
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        borderRadius: '5px',
        cursor: 'pointer',
        border: 'none',
        margin: '0 10px',
    },
    answerOptions: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '80%',
        margin: '20px 0',
    },
    answerOption: {
        width: '45%',
        padding: '20px',
        margin: '10px',
        borderRadius: '5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        cursor: 'pointer',
    },
};

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

const answers = [
    { text: 'river', color: '#f8d7da' },
    { text: 'jungle', color: '#d1ecf1' },
    { text: 'climate', color: '#fff3cd' },
    { text: 'All of the above', color: '#d4edda', correct: true },
];

const UserPlay = () => {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    calScores();
    const handleAnswerClick = (index) => {
        setSelectedAnswer(index);
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={styles.questionText}>
                    Hang Son Doong cave in Vietnam is the biggest cave in the world. It has its own:
                </div>
            </header>
            <div
                style={{
                    display: 'flex',
                    justifyItems: 'flex-end',
                    alignItems: 'end',
                    flexDirection: 'column',
                }}
            >
                <div style={styles.scoreBoard}>
                    {scores.map((score, index) => (
                        <div key={index} style={{ ...styles.scoreItem }}>
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
                                style={
                                    (styles.scoreIcon,
                                    {
                                        backgroundColor: score.color,
                                        width: '100%',
                                        padding: '3px',
                                        color: 'white',
                                        borderRadius: '2px',
                                    })
                                }
                            >
                                {score.icon}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div style={styles.content}>
                <div style={styles.controlButtons}>
                    <button style={styles.button}>Show media</button>
                    <button style={styles.button}>Next</button>
                </div>
                <div style={styles.answerOptions}>
                    {answers.map((answer, index) => (
                        <div
                            key={index}
                            style={{
                                ...styles.answerOption,
                                backgroundColor: answer.color,
                                opacity: answer.correct ? 1 : 0.6,
                            }}
                            onClick={() => handleAnswerClick(index)}
                        >
                            {answer.text}
                        </div>
                    ))}
                </div>
            </div>
            <footer style={styles.footer}>
                <button style={styles.button}>End game</button>
            </footer>
        </div>
    );
};

export default UserPlay;
