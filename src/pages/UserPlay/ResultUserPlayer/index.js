import React from 'react';
import { BsX } from 'react-icons/bs';
import { BsCheck } from 'react-icons/bs';
import MoonLoader from 'react-spinners/MoonLoader';
const ResultUserPlayer = ({ result, point, isLoading }) => {
    const backgroundColor = result ? 'green' : isLoading ? '#5571ec' : 'red';
    return (
        <div
            style={{
                backgroundColor: backgroundColor,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                color: 'white',
                borderRadius: '10px',
                height: '100%',
                width: '100%',
                fontSize: '40px ',
            }}
        >
            <b>{result ? 'Correct' : isLoading ? 'Loading' : 'False'}</b>

            {isLoading ? (
                <div style={{ marginTop: '20px' }}>
                    <MoonLoader color="white" size={150} />
                </div>
            ) : (
                <div style={{ fontSize: '150px' }}>{result ? <BsCheck /> : <BsX />}</div>
            )}
            {!isLoading && (
                <div
                    style={{
                        backgroundColor: 'rgba(0000, 0, 0, 0.3)',
                        padding: '20px',
                        width: '80%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '10px',
                    }}
                >
                    <b style={{ margin: 'auto' }}>+{point}</b>
                </div>
            )}
        </div>
    );
};

export default ResultUserPlayer;
