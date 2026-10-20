import api from "@/services/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ApiResponse } from "../types/ApiType";
import { LoginData, LoginPayload, Profile } from "../types/AuthType";

export const loginStudent = createAsyncThunk("auth/loginStudent", async (payload: LoginPayload) => {
    const response = await api.post<ApiResponse<LoginData>>("/auth/login-student", payload);
    return response.data;
});

export const loginAdmin = createAsyncThunk("auth/loginAdmin", async (payload: LoginPayload) => {
    const response = await api.post<ApiResponse<LoginData>>("/auth/login-admin", payload);
    return response.data;
});

export const getProfile = createAsyncThunk("auth/getProfile", async () => {
    const response = await api.get<ApiResponse<Profile>>("/auth/me");
    return response.data;
});
