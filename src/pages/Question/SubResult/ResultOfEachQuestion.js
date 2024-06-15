import React from 'react';

const Footer = ({ current, max, roomCode }) => {
    return (
        <div>
            <footer
                style={{
                    position: 'fixed',
                    bottom: '0',
                    width: '100%',
                    textAlign: 'center',
                }}
            >
                <div
                    style={{
                        backgroundColor: 'yellow',
                        padding: '5px 20px',
                        fontWeight: 'bold',
                    }}
                >
                    Skiniky had the answer in the fastest time
                </div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '5px 20px',
                        backgroundColor: '#333',
                        color: 'white',
                        textAlign: 'center',
                    }}
                >
                    <div>
                        <b>
                            {current}/{max}
                        </b>
                    </div>
                    <div style={{ paddingRight: '40px' }}>
                        <b>kahoot.it</b> kahoot.it Game pin:<b> {roomCode}</b>
                    </div>
                </div>
                {/* Your footer content */}
            </footer>
        </div>
    );
};

export default Footer;
