import { ApiResponse } from "./ApiType";

export type UserRole = "siswa" | "admin";

export interface Profile {
    id           : string;
    role         : UserRole;
    username     : string;
    nama_lengkap : string;
    nis          : string | null;
    kelas        : string | null;
}

export interface LoginPayload {
    username : string;
    password : string;
}

export interface LoginData {
    token : string;
}

export interface AuthResponse {
    login : ApiResponse<LoginData> | null;
}

export interface AuthState {
    profile  : Profile | null;
    loading  : boolean;
    response : AuthResponse;
}
