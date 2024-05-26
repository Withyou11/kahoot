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
            state.maxQuestion = action.payload.totalCount;
        },
        nextQuestionRD: (state) => {
            console.log(state.maxQuestion);
            if (state.currentQuestion <= state.maxQuestion) state.currentQuestion += 1;

            if (state.currentQuestion > state.maxQuestion) {
                state.currentQuestion -= 1;
                state.endQuiz = true;
            }
        },
        // setNumberOfQuestion: (state, action) => {
        //     state.action = action.payload;
        // },
    },
});

export const { initialQuestion, nextQuestionRD } = questionSlide.actions;
export default questionSlide.reducer;
