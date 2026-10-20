import { createSlice, isPending, isRejected } from "@reduxjs/toolkit";
import {
    deleteStudentLetter,
    getAllStudentLetter,
    replaceStudentLetter,
    toggleStudentLetter,
    uploadStudentLetter,
    viewStudentLetter,
} from "../controllers/studentLetter.controller";
import { StudentLetterResponse, StudentLetterState } from "../types/StudentLetterType";

const emptyResponse: StudentLetterResponse = {
    upload : null,
    toggle : null,
    delete : null,
    view   : null,
};

const initialState: StudentLetterState = {
    studentLetters : [],
    loading        : false,
    response       : emptyResponse,
};

const studentLetterSlice = createSlice({
    name: "studentLetter",
    initialState,
    reducers: {
        resetStudentLetterResponse: (state) => {
            state.response = emptyResponse;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllStudentLetter.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.status === true) {
                    state.studentLetters = action.payload.data;
                }
            })
            .addCase(uploadStudentLetter.fulfilled, (state, action) => {
                state.loading         = false;
                state.response.upload = action.payload;
            })
            .addCase(replaceStudentLetter.fulfilled, (state, action) => {
                state.loading         = false;
                state.response.upload = action.payload;
            })
            .addCase(viewStudentLetter.fulfilled, (state, action) => {
                state.loading       = false;
                state.response.view = action.payload;
            })
            .addCase(toggleStudentLetter.fulfilled, (state, action) => {
                state.loading         = false;
                state.response.toggle = action.payload;
                if (action.payload.status === true) {
                    const toggledLetter = action.payload.data;
                    state.studentLetters = state.studentLetters.map((studentLetter) => (
                        studentLetter.id === toggledLetter.id ? { ...studentLetter, akses_download: toggledLetter.akses_download } : studentLetter
                    ));
                }
            })
            .addCase(deleteStudentLetter.fulfilled, (state, action) => {
                state.loading         = false;
                state.response.delete = action.payload;
                if (action.payload.status === true) {
                    state.studentLetters = state.studentLetters.filter((studentLetter) => studentLetter.id !== action.meta.arg);
                }
            })
            .addMatcher(isPending(getAllStudentLetter, uploadStudentLetter, replaceStudentLetter, viewStudentLetter, toggleStudentLetter, deleteStudentLetter), (state) => {
                state.loading = true;
            })
            .addMatcher(isRejected(getAllStudentLetter, uploadStudentLetter, replaceStudentLetter, viewStudentLetter, toggleStudentLetter, deleteStudentLetter), (state) => {
                state.loading = false;
            });
    },
});

export const { resetStudentLetterResponse } = studentLetterSlice.actions;
export default studentLetterSlice.reducer;
