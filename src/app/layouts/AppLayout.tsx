"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppDispatch, useAppSelector } from "../hooks/useStore";
import { usePageLoader } from "../hooks/usePageLoader";
import { getAuthKey, homePathOf, removeAuthKey } from "../libs/auth";
import { getProfile } from "@/store/controllers/auth.controller";
import { UserRole } from "@/store/types/AuthType";

interface AppLayoutProps {
    role     : UserRole;
    children : React.ReactNode;
}

export function AppLayout({ role, children }: AppLayoutProps) {
    const router                           = useRouter();
    const dispatch                         = useAppDispatch();
    const { profile }                      = useAppSelector((state) => state.auth);
    const { isPageLoading, runWithLoader } = usePageLoader();

    useEffect(() => {
        if (!getAuthKey()) {
            router.replace("/");
            return;
        }

        runWithLoader(() => dispatch(getProfile())).then((profileAction) => {
            if (!getProfile.fulfilled.match(profileAction)) {
                return;
            }

            const profileResponse = profileAction.payload;
            if (profileResponse.status !== true) {
                removeAuthKey();
                router.replace("/");
                return;
            }

            if (profileResponse.data.role !== role) {
                router.replace(homePathOf(profileResponse.data.role));
            }
        });
    }, [dispatch, router, runWithLoader, role]);

    if (!profile || profile.role !== role) {
        return isPageLoading ? <Loading /> : null;
    }

    return <>{children}</>;
}
