import React, { useState, useEffect } from 'react';

const UserPlay = () => {
    const styles = {
        container: {
            display: 'flex',
            height: '100vh',
        },
        item: {
            width: '25vw',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            padding: '20px',
            cursor: 'pointer',
        },
        colors: [
            { backgroundColor: '#d01937' }, // Style for the first item
            { backgroundColor: '#7c46b0' }, // Style for the second item
            { backgroundColor: '#237e0b' }, // Style for the third item
            { backgroundColor: '#c79200' }, // Style for the fourth item
        ],
        header: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            width: '100vw',
        },
        headerQuestion: {
            fontSize: '30px',
        },
    };

    const items = [{ symbol: '◆' }, { symbol: '■' }, { symbol: '▲' }, { symbol: '●' }];
    const [timeLeft, setTimeLeft] = useState(5000);

    useEffect(() => {
        console.log('call api');
    }, []);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timerId = setInterval(() => {
            setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
        }, 1);

        return () => clearInterval(timerId);
    }, [timeLeft]);

    const handleClick = (index) => {
        if (timeLeft > 0) {
            console.log(`Clicked on item ${index}`);
        } else {
            console.log('Time exit');
        }
    };

    console.log(timeLeft);

    return (
        <div>
            <header style={styles.header}>
                <div style={styles.headerQuestion}>Question</div>
            </header>
            <div style={styles.container}>
                {items.map((item, index) => (
                    <div
                        key={index}
                        style={{ ...styles.item, ...styles.colors[index] }}
                        onClick={() => handleClick(index)}
                    >
                        <span style={{ fontSize: '60px', marginRight: '10px' }}>{item.symbol}</span>
                        <span>{item.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserPlay;
