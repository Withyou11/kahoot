import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    info: {},
};
export const userSlide = createSlice({
    name: 'user',
    initialState,
    reducers: {
        initialUserInfo: (state, action) => {
            state.info = action.payload;
        },
    },
});

export const { initialUserInfo } = userSlide.actions;
export default userSlide.reducer;
