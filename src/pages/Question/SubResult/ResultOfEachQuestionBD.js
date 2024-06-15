import React, { useEffect, useState } from 'react';
import { roomApi } from '~/api/rooms';
import { userApi } from '~/api/user';

const ResultOfEachQuestionBD = ({ data, roomId }) => {
    const [complete, setComplete] = useState(false);
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        roomApi
            .update_user_rank(roomId)
            .then((res) => {
                setList(res.data.data.data);
                setLoading(false);
                setComplete(true);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);
    console.log('list', list);

    return (
        <div style={{ width: '80%', textAlign: 'center', marginLeft: '10%' }}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {list.map((item, index) => (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '5px 20px',
                            borderRadius: '5px',
                            fontSize: '20px',
                            margin: '5px',
                            backgroundColor: '#f0f0f0',
                            border: '1px solid #ccc',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#ccc'; // Change background color on mouse enter
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#f0f0f0'; // Change background color back on mouse leave
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', padding: '20px' }}>
                            <span>{item.rank}</span>
                            <span style={{ marginLeft: '10px' }}>
                                <b>
                                    {item.user.lastName} {item.user.firstName}
                                </b>
                            </span>
                        </div>
                        <div>
                            <span>
                                <b>{item.totalScore}</b>
                            </span>
                            {item.is_up && <i class="bi bi-arrow-up-circle-fill"></i>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResultOfEachQuestionBD;
