import { ApiResponse } from "./ApiType";

export interface LetterType {
    id         : string;
    nama_surat : string;
    kode       : string;
    deskripsi  : string | null;
    is_active  : boolean;
    created_at : string;
    updated_at : string;
}

export interface LetterTypePayload {
    nama_surat : string;
    kode       : string;
    deskripsi  : string;
}

export interface LetterTypeResponse {
    action : ApiResponse<LetterType> | null;
    toggle : ApiResponse<LetterType> | null;
    delete : ApiResponse<null> | null;
}

export interface LetterTypeState {
    letterTypes : LetterType[];
    loading     : boolean;
    response    : LetterTypeResponse;
}
