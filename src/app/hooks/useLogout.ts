import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "./useStore";
import { clearProfile } from "@/store/slices/authSlice";
import { removeAuthKey } from "../libs/auth";

export function useLogout() {
    const router   = useRouter();
    const dispatch = useAppDispatch();

    return useCallback(() => {
        removeAuthKey();
        dispatch(clearProfile());
        router.replace("/");
    }, [dispatch, router]);
}
