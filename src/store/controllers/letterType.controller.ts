import api from "@/services/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ApiResponse } from "../types/ApiType";
import { LetterType, LetterTypePayload } from "../types/LetterTypeType";

export const getAllLetterType = createAsyncThunk("letterType/getAll", async () => {
    const response = await api.get<ApiResponse<LetterType[]>>("/letter-types");
    return response.data;
});

export const saveLetterType = createAsyncThunk("letterType/save", async (payload: LetterTypePayload) => {
    const response = await api.post<ApiResponse<LetterType>>("/letter-types", payload);
    return response.data;
});

export const toggleLetterType = createAsyncThunk("letterType/toggle", async (letterTypeId: string) => {
    const response = await api.post<ApiResponse<LetterType>>(`/letter-types/${letterTypeId}/toggle`);
    return response.data;
});

export const deleteLetterType = createAsyncThunk("letterType/delete", async (letterTypeId: string) => {
    const response = await api.delete<ApiResponse<null>>(`/letter-types/${letterTypeId}`);
    return response.data;
});
