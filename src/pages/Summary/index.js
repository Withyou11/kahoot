import React, { useEffect, useState } from 'react';
import styles from './style.module.scss';
import HomepageHeader from '../Home/HomepageHeader/HomepageHeader';
import { userApi } from '~/api/user';
import Loading from '~/components/Loading/Loading';

const TopItem = ({ number, name, value, containerStyle, answer }) => {
    console.log(number, name, value, answer);
    return (
        <div className={containerStyle}>
            <div className={styles.rank}>{number}</div>
            <span>
                <b>{name}</b>
            </span>
            <span>{answer}</span>
            <span>{value}</span>
        </div>
    );
};

const TopLower = () => {
    return (
        <div className={styles.topLower}>
            <div className={styles.imageContainer}></div>
            <div className={styles.textContainer}>
                <div className={styles.circle}>4</div>
                <span>nameasdf</span>
            </div>
        </div>
    );
};

const SummaryPage = ({ navigate, rank, totalQuestion, reloadSummary }) => {
    // const [data, setData] = useState([]);
    const [data, setData] = useState(rank.data);
    // const data = [
    //     { user: 'Long', score: 1235, answer: 2, rank?: 1 },
    //     { user: 'Long', score: 1234, answer: 2, rank?: 2 },
    //     { user: 'Long', score: 1233, answer: 2, rank?: 3 },
    // ];

    // useEffect(() => {
    //     setData(rank?.data.data);
    //     for (let i = 0; i < rank?.data.length; i++) {
    //         const id = rank?.data[i].userId;
    //         const item = {};
    //         userApi.getUserById(id).then((res) => {
    //             item.user = `${res.data?.firstName} ${res.data?.lastName}`;
    //             console.log(res.data.firstName);
    //         });
    //         item.score = rank?.data[i].totalScore;
    //         item.answer = rank?.data[i].totalCorrectAnswer;
    //         setData((previous) => [...previous, item]);
    //     }
    // }, []);

    const moveHomepage = () => {
        navigate('/');
    };
    return (
        <div
            style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'orange',
                color: 'white',
            }}
        >
            {!reloadSummary ? (
                <Loading />
            ) : (
                <div className={styles.summaryPage}>
                    {rank?.data[1]?.totalScore && (
                        <TopItem
                            number="2"
                            name={`${rank?.data[1]?.user.firstName} ${rank?.data[1]?.user.lastName}`}
                            value={rank?.data[1]?.totalScore}
                            answer={`${rank?.data[1]?.totalCorrectAnswer} out of ${totalQuestion}`}
                            containerStyle={styles.redContainer}
                        />
                    )}

                    {rank?.data[0]?.totalScore && (
                        <div className={styles.columnContainer}>
                            <TopItem
                                number="1"
                                name={`${rank?.data[0]?.user.firstName} ${rank?.data[0]?.user.lastName}`}
                                value={rank?.data[0]?.totalScore}
                                answer={`${rank?.data[0]?.totalCorrectAnswer} out of ${totalQuestion}`}
                                containerStyle={styles.yellowContainer}
                            />
                        </div>
                    )}
                    {rank?.data[2]?.totalScore && (
                        <TopItem
                            number="3"
                            name={`${rank?.data[2]?.user.firstName} ${rank?.data[2]?.user.lastName}`}
                            value={rank?.data[2]?.totalScore}
                            answer={`${rank?.data[2]?.totalCorrectAnswer} out of ${totalQuestion}`}
                            containerStyle={styles.blueContainer}
                        />
                    )}
                </div>
            )}
            <div
                style={{
                    display: 'flex',
                    justifyItems: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}
            >
                <div
                    style={{
                        backgroundColor: 'green',
                        color: 'white',
                        padding: '10px',
                        marginTop: '20px',
                        fontSize: '26px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                    }}
                    onClick={() => moveHomepage()}
                >
                    close
                </div>
            </div>
        </div>
    );
};

export default SummaryPage;
