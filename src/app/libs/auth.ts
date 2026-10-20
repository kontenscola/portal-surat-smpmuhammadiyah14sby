import { UserRole } from "@/store/types/AuthType";

const AUTH_KEY_NAME = "auth-key";

export const getAuthKey = (): string | null => {
    if (typeof window === "undefined") {
        return null;
    }
    return window.localStorage.getItem(AUTH_KEY_NAME);
};

export const setAuthKey = (authKey: string) => {
    window.localStorage.setItem(AUTH_KEY_NAME, authKey);
};

export const removeAuthKey = () => {
    window.localStorage.removeItem(AUTH_KEY_NAME);
};

export const homePathOf = (role: UserRole): string => (role === "admin" ? "/admin" : "/my-letters");
