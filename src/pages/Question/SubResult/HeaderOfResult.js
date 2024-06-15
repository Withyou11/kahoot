import React from 'react';

function Button({ children }) {
    return <div>{children}</div>;
}
export default Button;

export const HeaderOfResult = ({ setSubResult }) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
            }}
        >
            <div
                style={{
                    flex: 1,
                    fontSize: '25px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    padding: '10px 25px',
                    flexDirection: 'column',
                }}
            >
                <Button>
                    <i class="bi bi-volume-down bi-lg"></i>
                </Button>
                <Button>
                    <i class="bi bi-zoom-in bi-2x"></i>
                </Button>
                <Button>
                    <i class="bi bi-filter bi-3x"></i>
                </Button>
            </div>
            <div
                style={{
                    display: 'flex',
                    flex: 4,
                    justifyContent: 'center',
                    flexDirection: 'row',
                }}
            >
                <div
                    style={{
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        display: 'flex',
                        marginRight: '10px',
                        // width: '300px',
                        alignItems: 'center',
                        margin: '20px',
                        padding: '0px 30px',
                        justifyContent: 'center',
                        backgroundColor: '#f9f9f9',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <div>
                        <h1>Scoreboard</h1>
                    </div>
                </div>
            </div>
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-start',
                }}
            >
                <div
                    style={{
                        display: 'inline-block',
                        padding: '5px 20px',
                        borderRadius: '5px',
                        fontSize: '20px',
                        margin: '20px',
                        backgroundColor: '#f0f0f0',
                        border: '1px solid #ccc',
                    }}
                    onClick={() => setSubResult(false)}
                >
                    <span>Close</span>
                </div>
            </div>
        </div>
    );
};
