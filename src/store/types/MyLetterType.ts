import { ApiResponse } from "./ApiType";

export interface MyLetter {
    id             : string;
    kategori_id    : string;
    kategori_nama  : string;
    file_name      : string | null;
    file_path      : string | null;
    akses_download : boolean;
    uploaded_at    : string;
}

export interface MyLetterResponse {
    download : ApiResponse<null> | null;
}

export interface MyLetterState {
    myLetters : MyLetter[];
    loading   : boolean;
    response  : MyLetterResponse;
}
