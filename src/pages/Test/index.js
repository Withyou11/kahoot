import React from 'react';
import styles from './style.module.scss';

const LeaderboardItem = ({ rank, name, score, questionsAnswered }) => {
    const rankClass = rank === 1 ? styles.rank1 : rank === 2 ? styles.rank2 : styles.rank3;

    return (
        <div className={`${styles.leaderboardItem} ${rankClass}`}>
            <div className={styles.rank}>{rank}</div>
            <div className={styles.name}>{name}</div>
            <div className={styles.score}>{score}</div>
            <div className={styles.questionsAnswered}>{questionsAnswered} out of 9</div>
        </div>
    );
};

const Leaderboard = () => {
    const data = [
        { rank: 1, name: 'ngân', score: 4932, questionsAnswered: 5 },
        { rank: 2, name: 'Daisy', score: 2902, questionsAnswered: 3 },
        { rank: 3, name: 'Lia', score: 1988, questionsAnswered: 2 },
    ];

    return (
        <div className={styles.leaderboard}>
            {data.map((item) => (
                <LeaderboardItem
                    key={item.rank}
                    rank={item.rank}
                    name={item.name}
                    score={item.score}
                    questionsAnswered={item.questionsAnswered}
                />
            ))}
        </div>
    );
};

function Test() {
    return (
        <div className={styles.App}>
            <Leaderboard />
        </div>
    );
}

export default Test;
