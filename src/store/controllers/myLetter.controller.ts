import api from "@/services/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { blobErrorResponse, saveBlobAsFile } from "@/app/libs/general";
import { ApiResponse } from "../types/ApiType";
import { MyLetter } from "../types/MyLetterType";

export const getAllMyLetter = createAsyncThunk("myLetter/getAll", async () => {
    const response = await api.get<ApiResponse<MyLetter[]>>("/my-letters");
    return response.data;
});

export const downloadMyLetter = createAsyncThunk("myLetter/download", async (myLetter: MyLetter): Promise<ApiResponse<null>> => {
    const response = await api.get<Blob>(`/my-letters/${myLetter.id}/download`, { responseType: "blob" });
    if (response.status !== 200) {
        return blobErrorResponse(response.data);
    }

    saveBlobAsFile(response.data, myLetter.file_name as string);
    return { status: true, message: "Successfully", data: null };
});
