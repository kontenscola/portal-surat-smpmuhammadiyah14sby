import { useCallback, useState } from "react";
import Swal from "sweetalert2";

const isRejectedAction = (result: unknown): boolean => {
    if (typeof result !== "object" || result === null || !("meta" in result)) {
        return false;
    }
    const { meta } = result as { meta: { requestStatus?: string } };
    return meta.requestStatus === "rejected";
};

export function usePageLoader() {
    const [loadingCount, setLoadingCount] = useState(0);

    const runWithLoader = useCallback(async <ResultType,>(task: () => ResultType | Promise<ResultType>): Promise<ResultType> => {
        setLoadingCount((count) => count + 1);
        try {
            const result = await task();
            if (isRejectedAction(result)) {
                Swal.fire({ icon: "error", title: "Gagal", text: "Tidak dapat terhubung ke server. Silakan coba lagi." });
            }
            return result;
        } finally {
            setLoadingCount((count) => count - 1);
        }
    }, []);

    return { isPageLoading: loadingCount > 0, runWithLoader };
}
