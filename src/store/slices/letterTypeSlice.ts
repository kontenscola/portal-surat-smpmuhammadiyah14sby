import { createSlice, isPending, isRejected } from "@reduxjs/toolkit";
import {
    deleteLetterType,
    getAllLetterType,
    saveLetterType,
    toggleLetterType,
} from "../controllers/letterType.controller";
import { LetterTypeResponse, LetterTypeState } from "../types/LetterTypeType";

const emptyResponse: LetterTypeResponse = {
    action : null,
    toggle : null,
    delete : null,
};

const initialState: LetterTypeState = {
    letterTypes : [],
    loading     : false,
    response    : emptyResponse,
};

const letterTypeSlice = createSlice({
    name: "letterType",
    initialState,
    reducers: {
        resetLetterTypeResponse: (state) => {
            state.response = emptyResponse;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllLetterType.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.status === true) {
                    state.letterTypes = action.payload.data;
                }
            })
            .addCase(saveLetterType.fulfilled, (state, action) => {
                state.loading         = false;
                state.response.action = action.payload;
            })
            .addCase(toggleLetterType.fulfilled, (state, action) => {
                state.loading         = false;
                state.response.toggle = action.payload;
                if (action.payload.status === true) {
                    const toggledLetterType = action.payload.data;
                    state.letterTypes = state.letterTypes.map((letterType) => (
                        letterType.id === toggledLetterType.id ? { ...letterType, is_active: toggledLetterType.is_active } : letterType
                    ));
                }
            })
            .addCase(deleteLetterType.fulfilled, (state, action) => {
                state.loading         = false;
                state.response.delete = action.payload;
                if (action.payload.status === true) {
                    state.letterTypes = state.letterTypes.filter((letterType) => letterType.id !== action.meta.arg);
                }
            })
            .addMatcher(isPending(getAllLetterType, saveLetterType, toggleLetterType, deleteLetterType), (state) => {
                state.loading = true;
            })
            .addMatcher(isRejected(getAllLetterType, saveLetterType, toggleLetterType, deleteLetterType), (state) => {
                state.loading = false;
            });
    },
});

export const { resetLetterTypeResponse } = letterTypeSlice.actions;
export default letterTypeSlice.reducer;
