import { configureStore } from '@reduxjs/toolkit';
import questionReducer from '~/redux/questionSlide';
export const store = configureStore({
    reducer: {
        question: questionReducer,
    },
});
