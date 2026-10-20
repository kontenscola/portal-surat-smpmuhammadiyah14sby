import { ApiResponse } from "./ApiType";

export interface StudentLetter {
    id             : string;
    siswa_id       : string;
    kategori_id    : string;
    file_path      : string | null;
    file_name      : string | null;
    akses_download : boolean;
    uploaded_by    : string | null;
    uploaded_at    : string;
    siswa_nis      : string | null;
    siswa_nama     : string;
    siswa_kelas    : string | null;
}

export interface StudentLetterQuery {
    kategori_id : string;
}

export interface StudentLetterUploadPayload {
    kategori_id : string;
    siswa_id    : string;
    file        : File;
}

export interface StudentLetterReplacePayload {
    id   : string;
    file : File;
}

export interface StudentLetterResponse {
    upload : ApiResponse<StudentLetter> | null;
    toggle : ApiResponse<StudentLetter> | null;
    delete : ApiResponse<null> | null;
    view   : ApiResponse<null> | null;
}

export interface StudentLetterState {
    studentLetters : StudentLetter[];
    loading        : boolean;
    response       : StudentLetterResponse;
}
