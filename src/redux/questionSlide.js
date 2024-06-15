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
            if (state.currentQuestion < state.maxQuestion) {
                state.currentQuestion = state.currentQuestion + 1;
            }
            if (state.currentQuestion === state.maxQuestion) {
                state.endQuiz = true;
            }
        },
        endQuiz: (state) => {
            state.question = {};
            state.maxQuestion = 0;
            state.currentQuestion = 1;
            state.endQuiz = false;
        },
    },
});

export const { initialQuestion, getNextQuestion, nextQuestionRD, endQuiz } = questionSlide.actions;
export default questionSlide.reducer;
