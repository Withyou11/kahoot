import React from 'react';

const Ranking = ({ top3Player }) => {
    return (
        <div
            style={{
                width: '100%',
                height: '250px',
                marginBottom: '30px',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                }}
            >
                <div
                    style={{
                        width: '20%',
                        height: '65%',
                        backgroundColor: '#c79200',
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                        color: 'white',
                        borderRadius: '10px',
                        marginRight: '10px',
                        // borderTopLeftRadius: '10px',
                        // borderTopRightRadius: '10px',
                    }}
                >
                    <p style={{ fontSize: '30px' }}>
                        <b>2nd</b>
                    </p>
                    <p style={{ marginTop: '10px', marginBottom: '10px' }}>
                        {top3Player?.length > 1 && <b>{top3Player[1]?.user.firstName}</b>}
                    </p>
                    {top3Player?.length > 1 && <span style={{ fontSize: '2rem' }}>{top3Player[1]?.totalScore}</span>}
                </div>
                <div
                    style={{
                        width: '20%',
                        height: '90%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#d01937',
                            color: 'white',
                            borderRadius: '10px',
                        }}
                    >
                        <p style={{ fontSize: '30px', textAlign: 'center' }}>
                            <b>1st</b>
                        </p>
                        <p style={{ textAlign: 'center', marginTop: '10px' }}>
                            {top3Player?.length > 0 && <b>{top3Player[0]?.user.firstName}</b>}
                        </p>
                        <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '2rem' }}>
                            {top3Player?.length > 0 && top3Player[0]?.totalScore}
                        </p>
                    </div>
                </div>
                <div
                    style={{
                        width: '20%',
                        height: '50%',
                        backgroundColor: '#237e0b',
                        color: 'white',
                        borderRadius: '10px',
                        marginLeft: '10px',
                    }}
                >
                    <p style={{ fontSize: '30px', textAlign: 'center' }}>
                        <b>3rd</b>
                    </p>
                    <p style={{ textAlign: 'center', marginTop: '10px', marginBottom: '10px' }}>
                        {top3Player?.length > 2 && <b>{top3Player[2]?.user.firstName}</b>}
                    </p>
                    {top3Player?.length > 2 && (
                        <p style={{ textAlign: 'center', fontSize: '2rem' }}>{top3Player[2]?.totalScore}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Ranking;
