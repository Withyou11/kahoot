import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    socket: null,
    endQuestionSocket: null,
    answerSocket: null,
};
export const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        initialSocket: (state, action) => {
            state.socket = action.payload;
        },
        setEndQuestionSocket: (state, action) => {
            state.endQuestionSocket = action.payload;
        },
        setAnswerSocket: (state, action) => {
            state.answerSocket = action.payload;
        },
        // getNextQuestion: (state, action) => {
        //     state.question = action.payload.question;
        //     state.maxQuestion = action.payload.totalCount;
        // },
        // nextQuestionRD: (state) => {
        //     console.log('curent question', state.currentQuestion);
        //     console.log('max question', state.maxQuestion);
        //     if (state.currentQuestion < state.maxQuestion) {
        //         console.log('jump into here');
        //         state.currentQuestion = state.currentQuestion + 1;
        //     } else if (state.currentQuestion === state.maxQuestion) {
        //         state.endQuiz = true;
        //         state.currentQuestion = 1;
        //     }
        // },
        // setNumberOfQuestion: (state, action) => {
        //     state.action = action.payload;
        // },
    },
});

export const { initialSocket, setEndQuestionSocket, setAnswerSocket } = socketSlice.actions;
export default socketSlice.reducer;
