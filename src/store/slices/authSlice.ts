import { createSlice, isPending, isRejected } from "@reduxjs/toolkit";
import { getProfile, loginAdmin, loginStudent } from "../controllers/auth.controller";
import { AuthResponse, AuthState } from "../types/AuthType";

const emptyResponse: AuthResponse = {
    login : null,
};

const initialState: AuthState = {
    profile  : null,
    loading  : false,
    response : emptyResponse,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        resetAuthResponse: (state) => {
            state.response = emptyResponse;
        },
        clearProfile: (state) => {
            state.profile = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginStudent.fulfilled, (state, action) => {
                state.loading        = false;
                state.response.login = action.payload;
            })
            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.loading        = false;
                state.response.login = action.payload;
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload.status === true ? action.payload.data : null;
            })
            .addMatcher(isPending(loginStudent, loginAdmin, getProfile), (state) => {
                state.loading = true;
            })
            .addMatcher(isRejected(loginStudent, loginAdmin, getProfile), (state) => {
                state.loading = false;
            });
    },
});

export const { resetAuthResponse, clearProfile } = authSlice.actions;
export default authSlice.reducer;
