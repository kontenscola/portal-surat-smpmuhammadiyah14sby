import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import studentSlice from "./slices/studentSlice";
import letterTypeSlice from "./slices/letterTypeSlice";
import letterCategorySlice from "./slices/letterCategorySlice";
import studentLetterSlice from "./slices/studentLetterSlice";
import myLetterSlice from "./slices/myLetterSlice";

export const store = configureStore({
    reducer: {
        auth           : authSlice,
        student        : studentSlice,
        letterType     : letterTypeSlice,
        letterCategory : letterCategorySlice,
        studentLetter  : studentLetterSlice,
        myLetter       : myLetterSlice,
    },
});

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
