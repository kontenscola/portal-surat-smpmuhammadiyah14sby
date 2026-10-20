import { createSlice, isPending, isRejected } from "@reduxjs/toolkit";
import {
    archiveStudent,
    deleteStudent,
    getAllStudent,
    importStudent,
    saveStudent,
} from "../controllers/student.controller";
import { StudentResponse, StudentState } from "../types/StudentType";

const emptyResponse: StudentResponse = {
    action  : null,
    delete  : null,
    archive : null,
};

const initialState: StudentState = {
    students : [],
    loading  : false,
    response : emptyResponse,
};

const studentSlice = createSlice({
    name: "student",
    initialState,
    reducers: {
        resetStudentResponse: (state) => {
            state.response = emptyResponse;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllStudent.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.status === true) {
                    state.students = action.payload.data;
                }
            })
            .addCase(saveStudent.fulfilled, (state, action) => {
                state.loading         = false;
                state.response.action = action.payload;
            })
            .addCase(importStudent.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(archiveStudent.fulfilled, (state, action) => {
                state.loading          = false;
                state.response.archive = action.payload;
            })
            .addCase(deleteStudent.fulfilled, (state, action) => {
                state.loading         = false;
                state.response.delete = action.payload;
                if (action.payload.status === true) {
                    state.students = state.students.filter((student) => student.id !== action.meta.arg);
                }
            })
            .addMatcher(isPending(getAllStudent, saveStudent, importStudent, archiveStudent, deleteStudent), (state) => {
                state.loading = true;
            })
            .addMatcher(isRejected(getAllStudent, saveStudent, importStudent, archiveStudent, deleteStudent), (state) => {
                state.loading = false;
            });
    },
});

export const { resetStudentResponse } = studentSlice.actions;
export default studentSlice.reducer;
