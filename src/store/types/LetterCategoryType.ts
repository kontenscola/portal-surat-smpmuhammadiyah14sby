import { ApiResponse } from "./ApiType";

export interface LetterCategory {
    id            : string;
    nama_kategori : string;
    deskripsi     : string | null;
    created_at    : string;
}

export interface LetterCategoryPayload {
    nama_kategori : string;
    deskripsi     : string;
}

export interface LetterCategoryResponse {
    action : ApiResponse<LetterCategory> | null;
    delete : ApiResponse<null> | null;
}

export interface LetterCategoryState {
    letterCategories : LetterCategory[];
    letterCategory   : LetterCategory | null;
    loading          : boolean;
    response         : LetterCategoryResponse;
}
