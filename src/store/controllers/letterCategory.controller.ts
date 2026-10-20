import api from "@/services/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ApiResponse } from "../types/ApiType";
import { LetterCategory, LetterCategoryPayload } from "../types/LetterCategoryType";

export const getAllLetterCategory = createAsyncThunk("letterCategory/getAll", async () => {
    const response = await api.get<ApiResponse<LetterCategory[]>>("/letter-categories");
    return response.data;
});

export const getDetailLetterCategory = createAsyncThunk("letterCategory/getDetail", async (letterCategoryId: string) => {
    const response = await api.get<ApiResponse<LetterCategory>>(`/letter-categories/${letterCategoryId}`);
    return response.data;
});

export const saveLetterCategory = createAsyncThunk("letterCategory/save", async (payload: LetterCategoryPayload) => {
    const response = await api.post<ApiResponse<LetterCategory>>("/letter-categories", payload);
    return response.data;
});

export const deleteLetterCategory = createAsyncThunk("letterCategory/delete", async (letterCategoryId: string) => {
    const response = await api.delete<ApiResponse<null>>(`/letter-categories/${letterCategoryId}`);
    return response.data;
});
