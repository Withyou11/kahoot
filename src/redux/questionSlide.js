import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    question: {},
    maxQuestion: 0,
    currentQuestion: 1,
    endQuiz: false,
};
export const questionSlide = createSlice({
    name: 'question',
    initialState,
    reducers: {
        initialQuestion: (state, action) => {
            state.question = action.payload.question;
            state.currentQuestion = 1;
            state.maxQuestion = action.payload.totalCount;
        },
        getNextQuestion: (state, action) => {
            state.question = action.payload.question;
            state.maxQuestion = action.payload.totalCount;
        },
        nextQuestionRD: (state) => {
            // console.log('curent question', state.currentQuestion);
            // console.log('max question', state.maxQuestion);
            if (state.currentQuestion < state.maxQuestion) {
                // console.log('jump into here');
                state.currentQuestion = state.currentQuestion + 1;
            } else if (state.currentQuestion === state.maxQuestion) {
                state.endQuiz = true;
                state.currentQuestion = 1;
            }
        },
        // setNumberOfQuestion: (state, action) => {
        //     state.action = action.payload;
        // },
    },
});

export const { initialQuestion, getNextQuestion, nextQuestionRD } = questionSlide.actions;
export default questionSlide.reducer;
