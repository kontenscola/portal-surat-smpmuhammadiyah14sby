import api from "@/services/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { blobErrorResponse } from "@/app/libs/general";
import { ApiResponse } from "../types/ApiType";
import {
    StudentLetter,
    StudentLetterQuery,
    StudentLetterReplacePayload,
    StudentLetterUploadPayload,
} from "../types/StudentLetterType";

export const getAllStudentLetter = createAsyncThunk("studentLetter/getAll", async (query: StudentLetterQuery) => {
    const response = await api.get<ApiResponse<StudentLetter[]>>("/student-letters", { params: query });
    return response.data;
});

export const uploadStudentLetter = createAsyncThunk("studentLetter/upload", async (payload: StudentLetterUploadPayload) => {
    const uploadForm = new FormData();
    uploadForm.append("file", payload.file);
    const response = await api.post<ApiResponse<StudentLetter>>(`/student-letters/upload/${payload.kategori_id}/${payload.siswa_id}`, uploadForm);
    return response.data;
});

export const replaceStudentLetter = createAsyncThunk("studentLetter/replace", async (payload: StudentLetterReplacePayload) => {
    const uploadForm = new FormData();
    uploadForm.append("file", payload.file);
    const response = await api.post<ApiResponse<StudentLetter>>(`/student-letters/${payload.id}/file`, uploadForm);
    return response.data;
});

export const viewStudentLetter = createAsyncThunk("studentLetter/view", async (studentLetterId: string): Promise<ApiResponse<null>> => {
    const previewWindow = window.open("", "_blank");
    const response      = await api.get<Blob>(`/student-letters/${studentLetterId}/file`, { responseType: "blob" });
    if (response.status !== 200) {
        previewWindow?.close();
        return blobErrorResponse(response.data);
    }

    const fileUrl = URL.createObjectURL(response.data);
    if (previewWindow) {
        previewWindow.location.href = fileUrl;
    }
    return { status: true, message: "Successfully", data: null };
});

export const toggleStudentLetter = createAsyncThunk("studentLetter/toggle", async (studentLetterId: string) => {
    const response = await api.post<ApiResponse<StudentLetter>>(`/student-letters/${studentLetterId}/toggle`);
    return response.data;
});

export const deleteStudentLetter = createAsyncThunk("studentLetter/delete", async (studentLetterId: string) => {
    const response = await api.delete<ApiResponse<null>>(`/student-letters/${studentLetterId}`);
    return response.data;
});
