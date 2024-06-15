import { configureStore } from '@reduxjs/toolkit';
import questionReducer from '~/redux/questionSlide';
import socketReducer from '~/redux/socketSlide';
import userReducer from '~/redux/userSlide';
export const store = configureStore({
    reducer: {
        question: questionReducer,
        socket: socketReducer,
        user: userReducer,
    },
});
