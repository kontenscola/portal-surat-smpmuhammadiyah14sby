import { createSlice, isPending, isRejected } from "@reduxjs/toolkit";
import {
    deleteLetterCategory,
    getAllLetterCategory,
    getDetailLetterCategory,
    saveLetterCategory,
} from "../controllers/letterCategory.controller";
import { LetterCategoryResponse, LetterCategoryState } from "../types/LetterCategoryType";

const emptyResponse: LetterCategoryResponse = {
    action : null,
    delete : null,
};

const initialState: LetterCategoryState = {
    letterCategories : [],
    letterCategory   : null,
    loading          : false,
    response         : emptyResponse,
};

const letterCategorySlice = createSlice({
    name: "letterCategory",
    initialState,
    reducers: {
        resetLetterCategoryResponse: (state) => {
            state.response = emptyResponse;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllLetterCategory.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.status === true) {
                    state.letterCategories = action.payload.data;
                }
            })
            .addCase(getDetailLetterCategory.pending, (state) => {
                state.letterCategory = null;
            })
            .addCase(getDetailLetterCategory.fulfilled, (state, action) => {
                state.loading        = false;
                state.letterCategory = action.payload.status === true ? action.payload.data : null;
            })
            .addCase(saveLetterCategory.fulfilled, (state, action) => {
                state.loading         = false;
                state.response.action = action.payload;
            })
            .addCase(deleteLetterCategory.fulfilled, (state, action) => {
                state.loading         = false;
                state.response.delete = action.payload;
                if (action.payload.status === true) {
                    state.letterCategories = state.letterCategories.filter((letterCategory) => letterCategory.id !== action.meta.arg);
                }
            })
            .addMatcher(isPending(getAllLetterCategory, getDetailLetterCategory, saveLetterCategory, deleteLetterCategory), (state) => {
                state.loading = true;
            })
            .addMatcher(isRejected(getAllLetterCategory, getDetailLetterCategory, saveLetterCategory, deleteLetterCategory), (state) => {
                state.loading = false;
            });
    },
});

export const { resetLetterCategoryResponse } = letterCategorySlice.actions;
export default letterCategorySlice.reducer;
