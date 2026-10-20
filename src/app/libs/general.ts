import { ApiResponse } from "@/store/types/ApiType";

export const responseErrorMessage = (response: ApiResponse): string => {
    if (response.errors) {
        const [firstFieldErrors] = Object.values(response.errors);
        if (firstFieldErrors && firstFieldErrors[0]) {
            return firstFieldErrors[0];
        }
    }
    return response.message;
};

export const blobErrorResponse = async (blob: Blob): Promise<ApiResponse<null>> => {
    const responseText = await blob.text();
    return JSON.parse(responseText) as ApiResponse<null>;
};

export const saveBlobAsFile = (blob: Blob, fileName: string) => {
    const fileUrl      = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href     = fileUrl;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    setTimeout(() => URL.revokeObjectURL(fileUrl), 1000);
};

export const formatDate = (dateValue: string): string => new Date(dateValue).toLocaleDateString("id-ID", {
    day   : "numeric",
    month : "long",
    year  : "numeric",
});
