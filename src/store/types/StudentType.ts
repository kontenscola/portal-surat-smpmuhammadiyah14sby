import { ApiResponse } from "./ApiType";

export interface Student {
    id           : string;
    username     : string;
    nis          : string | null;
    nama_lengkap : string;
    kelas        : string | null;
    role         : "siswa";
    is_archived  : boolean;
    created_at   : string;
    updated_at   : string;
}

export interface StudentPayload {
    id           : string | null;
    nama_lengkap : string;
    username     : string;
    nis          : string;
    kelas        : string;
    password     : string;
}

export interface StudentImportRow {
    nama_lengkap : string;
    nis          : string;
    kelas        : string;
}

export interface StudentImportResult {
    imported : number;
    skipped  : number;
    errors   : { nis: string; message: string }[];
}

export interface StudentArchivePayload {
    ids         : string[];
    is_archived : boolean;
}

export interface StudentResponse {
    action  : ApiResponse<Student> | null;
    delete  : ApiResponse<null> | null;
    archive : ApiResponse<null> | null;
}

export interface StudentState {
    students : Student[];
    loading  : boolean;
    response : StudentResponse;
}
