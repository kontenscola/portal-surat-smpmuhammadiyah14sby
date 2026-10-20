import { createSlice, isPending, isRejected } from "@reduxjs/toolkit";
import { downloadMyLetter, getAllMyLetter } from "../controllers/myLetter.controller";
import { MyLetterResponse, MyLetterState } from "../types/MyLetterType";

const emptyResponse: MyLetterResponse = {
    download : null,
};

const initialState: MyLetterState = {
    myLetters : [],
    loading   : false,
    response  : emptyResponse,
};

const myLetterSlice = createSlice({
    name: "myLetter",
    initialState,
    reducers: {
        resetMyLetterResponse: (state) => {
            state.response = emptyResponse;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllMyLetter.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.status === true) {
                    state.myLetters = action.payload.data;
                }
            })
            .addCase(downloadMyLetter.fulfilled, (state, action) => {
                state.loading           = false;
                state.response.download = action.payload;
            })
            .addMatcher(isPending(getAllMyLetter, downloadMyLetter), (state) => {
                state.loading = true;
            })
            .addMatcher(isRejected(getAllMyLetter, downloadMyLetter), (state) => {
                state.loading = false;
            });
    },
});

export const { resetMyLetterResponse } = myLetterSlice.actions;
export default myLetterSlice.reducer;
