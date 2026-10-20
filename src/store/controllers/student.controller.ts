import api from "@/services/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ApiResponse } from "../types/ApiType";
import {
    Student,
    StudentArchivePayload,
    StudentImportResult,
    StudentImportRow,
    StudentPayload,
} from "../types/StudentType";

export const getAllStudent = createAsyncThunk("student/getAll", async () => {
    const response = await api.get<ApiResponse<Student[]>>("/students");
    return response.data;
});

export const saveStudent = createAsyncThunk("student/save", async (payload: StudentPayload) => {
    const response = await api.post<ApiResponse<Student>>("/students", payload);
    return response.data;
});

export const importStudent = createAsyncThunk("student/import", async (rows: StudentImportRow[]) => {
    const response = await api.post<ApiResponse<StudentImportResult>>("/students/import", { rows });
    return response.data;
});

export const archiveStudent = createAsyncThunk("student/archive", async (payload: StudentArchivePayload) => {
    const response = await api.post<ApiResponse<null>>("/students/archive", payload);
    return response.data;
});

export const deleteStudent = createAsyncThunk("student/delete", async (studentId: string) => {
    const response = await api.delete<ApiResponse<null>>(`/students/${studentId}`);
    return response.data;
});
