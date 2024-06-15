import React from 'react';
import { HeaderOfResult } from './HeaderOfResult';
import ResultOfEachQuestionBD from './ResultOfEachQuestionBD';
import Footer from './ResultOfEachQuestion';
import data from './MockData.json';
const SubResult = ({ current, max, roomCode, setSubResult, roomId }) => {
    return (
        <div style={{ backgroundColor: '#5571ec', height: '100vh' }}>
            <HeaderOfResult setSubResult={setSubResult} />
            <ResultOfEachQuestionBD data={data} roomId={roomId} />
            <Footer current={current} max={max} roomCode={roomCode} />
        </div>
    );
};

export default SubResult;
